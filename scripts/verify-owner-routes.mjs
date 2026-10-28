import assert from "node:assert/strict";
import fs from "node:fs";
try { process.loadEnvFile(".env.local"); } catch {}
const base=process.env.HALDOZ_TEST_ORIGIN ?? "http://127.0.0.1:3100";
assert.ok(["127.0.0.1","localhost"].includes(new URL(base).hostname),"HTTP checks are loopback-only");
const cases=[];
const login=await fetch(base+"/create");
const loginHtml=await login.text();
assert.equal(login.status,200);
assert.match(loginHtml,/<button[^>]*class="google-button"/);
const googleEnabled=!/<button[^>]*class="google-button"[^>]*disabled/.test(loginHtml);
const setup=await fetch(base+"/page-setup");
const setupHtml=await setup.text();
assert.equal(setup.status,200);
assert.match(setupHtml,/name="confirm_public"/);
assert.doesNotMatch(setupHtml,/<input[^>]*name="confirm_public"[^>]*checked/);
assert.match(setupHtml,/<button[^>]*class="primary-button"[^>]*disabled/);
cases.push("Unconfigured sign-in/save disabled; public consent initially unchecked");
cases[0]="Google button reflects current provider readiness; signed-out saving disabled and consent unchecked";
assert.equal((setupHtml.match(/type="tel"/g)??[]).length,1,"Exactly one public phone input");
assert.match(setupHtml,/name="whatsapp_enabled"/);
assert.doesNotMatch(setupHtml,/name="public_whatsapp"/);
for(const route of ["/auth/login","/auth/logout"]){
 const result=await fetch(base+route,{method:"POST",headers:{Origin:"https://untrusted.example"},redirect:"manual"});
 assert.equal(result.status,403);cases.push(route+" rejects cross-origin POST");
}
const getLogin=await fetch(base+"/auth/login",{redirect:"manual"});assert.equal(getLogin.status,405);
const callback=await fetch(base+"/auth/callback?next=https%3A%2F%2Funtrusted.example",{redirect:"manual"});
assert.equal(callback.status,303);
const callbackUrl=new URL(callback.headers.get("location"));
assert.equal(callbackUrl.origin,base);assert.equal(callbackUrl.pathname,"/create");
assert.ok(["callback_missing_code","callback_configuration"].includes(callbackUrl.searchParams.get("error")));
cases.push("Callback failure uses current safe error categories and ignores untrusted next destination");
const start=await fetch(base+"/auth/login",{method:"POST",headers:{Origin:base},redirect:"manual"});
assert.equal(start.status,303);
const target=new URL(start.headers.get("location"));
if(googleEnabled){
 assert.equal(target.origin,"https://wickyjtjhgfzntifuzac.supabase.co");assert.equal(target.pathname,"/auth/v1/authorize");
 assert.equal(target.searchParams.get("provider"),"google");assert.equal(target.searchParams.get("redirect_to"),base+"/auth/callback");
 assert.match(start.headers.get("set-cookie")??"",/haldoz-.*-code-verifier/);
 cases.push("Ready OAuth starts at the confirmed broker with PKCE; no account selection or token exchange performed");
}else{assert.equal(target.origin,base);assert.equal(target.pathname,"/create");assert.equal(target.searchParams.get("error"),"unavailable");cases.push("Unavailable Google flow fails closed");}
const reserved=await fetch(base+"/p/admin");assert.equal(reserved.status,404);
const profile=await fetch(base+"/p/aso-test");
if(process.env.HALDOZ_TEST_PAGES_READY === "true"){
 assert.equal(profile.status,404);cases.push("Reserved and absent hosted handles return 404 with pages enabled");
}else{
 assert.equal(profile.status,200);assert.match(await profile.text(),/پەڕەکان هێشتا چالاک نین/);cases.push("Reserved handles 404; missing backend shows honest service state");
}
fs.mkdirSync(".local/qa",{recursive:true});fs.writeFileSync(".local/qa/owner-routes.json",JSON.stringify({cases,note:"Current local HTTP boundaries; no completed real OAuth/session or hosted write tested"},null,2));
console.log(JSON.stringify(cases));
