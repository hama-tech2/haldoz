import assert from "node:assert/strict";
import fs from "node:fs";
import { gzipSync } from "node:zlib";
const base = process.env.HALDOZ_TEST_ORIGIN ?? "http://127.0.0.1:3100";
assert.ok(["127.0.0.1", "localhost"].includes(new URL(base).hostname), "HTTP checks are loopback-only");
const checks = [];
for (const route of ["/", "/jobs", "/favorites", "/create", "/page-setup", "/preview/page"]) {
  const response = await fetch(base + route, { signal: AbortSignal.timeout(10_000) });
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /lang="ckb"/);
  assert.match(html, /dir="rtl"/);
  assert.match(html, /noindex/);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
  const assets = [...new Set([...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css|woff2)(?:\?[^"]*)?)"/g)].map(match => match[1]))];
  let jsGzipBytes = 0;
  let fontBytes = 0;
  for (const asset of assets) {
    assert.ok((asset.startsWith("/_next/") || asset.startsWith("/fonts/")), "Only local framework assets expected");
    const assetResponse = await fetch(base + asset, { signal: AbortSignal.timeout(10_000) });
    assert.equal(assetResponse.status, 200, asset);
    const bytes = Buffer.from(await assetResponse.arrayBuffer());
    if (asset.includes(".js")) jsGzipBytes += gzipSync(bytes).length;
    if (asset.includes(".woff2")) { assert.equal(bytes.subarray(0,4).toString(), "wOF2"); fontBytes += bytes.length; }
  }
  assert.ok(fontBytes > 0, "Explicit self-hosted font preload must exist");
  checks.push({ route, status: response.status, htmlBytes: Buffer.byteLength(html), jsGzipBytes, fontBytes, assetCount: assets.length });
}
const missing = await fetch(base + "/missing-milestone-page", { signal: AbortSignal.timeout(10_000) });
assert.equal(missing.status, 404);
fs.mkdirSync(".local/qa", { recursive: true });
fs.writeFileSync(".local/qa/http.json", JSON.stringify({ checks, notFoundStatus: missing.status, note: "Local HTTP/assets check; gzip estimates are not a Lighthouse or field performance score." }, null, 2));
console.log(JSON.stringify(checks));
console.log("Local HTTP, font delivery, privacy headers and 404 checks passed.");
