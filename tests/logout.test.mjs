import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
const origin = "http://127.0.0.1:3100";
const source = ts.transpileModule(fs.readFileSync(new URL("../src/app/auth/logout/route.ts", import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
function route(getClient) {
  const exports = {};
  vm.runInNewContext(source, { exports, Response, URL, require(name) {
    if (name === "next/server") return { NextResponse: { redirect: (url, status) => new Response(null, { status, headers: { Location: String(url) } }) } };
    if (name.endsWith("/server")) return { serverSupabase: getClient };
    if (name.endsWith("/config")) return { siteOrigin: () => origin };
    throw new Error("Unexpected route dependency");
  } });
  return exports.POST;
}
const request = (value = origin) => new Request(origin + "/auth/logout", { method: "POST", headers: { Origin: value } });
test("logout rejects cross-origin requests before reading the session", async () => {
  let touched = false;
  const response = await route(async () => { touched = true; throw Error(); })(request("https://untrusted.example"));
  assert.equal(response.status, 403); assert.equal(touched, false);
});
test("logout redirects only after successful local-session signout", async () => {
  let scope;
  const response = await route(async () => ({ auth: { signOut: async value => { scope = value.scope; return { error: null }; } } }))(request());
  assert.equal(scope, "local"); assert.equal(response.status, 303);
  assert.equal(response.headers.get("location"), origin + "/");
  assert.equal(response.headers.get("cache-control"), "private, no-store");
});
test("logout API failure is not reported as a successful redirect", async () => {
  const response = await route(async () => ({ auth: { signOut: async () => ({ error: new Error("private diagnostic") }) } }))(request());
  assert.equal(response.status, 503); assert.equal(response.headers.get("location"), null);
  assert.doesNotMatch(await response.text(), /private diagnostic/);
});
test("logout handles unavailable client and thrown failures without exposing errors", async () => {
  for (const getClient of [async () => null, async () => { throw Error("private diagnostic"); }]) {
    const response = await route(getClient)(request());
    assert.equal(response.status, 503); assert.equal(response.headers.get("location"), null);
    assert.equal(response.headers.get("cache-control"), "private, no-store");
    assert.doesNotMatch(await response.text(), /private diagnostic/);
  }
});
