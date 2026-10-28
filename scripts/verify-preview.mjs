import assert from "node:assert/strict";
import fs from "node:fs";
import {previewTarget} from "../src/lib/deployment.ts";
const base=process.env.HALDOZ_TEST_ORIGIN??previewTarget.origin;
assert.ok([previewTarget.origin,"http://127.0.0.1:3102"].includes(base),"Only the exact Haldoz target or its local preview may be tested");
const results=[];
for(const route of ["/","/create","/jobs","/favorites"]){
 const response=await fetch(base+route,{signal:AbortSignal.timeout(15000)}),html=await response.text();
 assert.equal(response.status,200,route);assert.match(html,/lang="ckb"/);assert.match(html,/dir="rtl"/);assert.ok(html.includes("/_next/"),"Real application assets required");
 assert.ok(!html.includes("Current milestone"),"README must never replace the application");
 if(route==="/create"){assert.match(html,/<button[^>]*class="google-button"/);assert.doesNotMatch(html,/<button[^>]*class="google-button"[^>]*disabled/);}
 if(["/jobs","/favorites"].includes(route)){assert.match(response.headers.get("cache-control")??"",/no-store/);assert.doesNotMatch(html,/demo-\d{3}|هەموو هەل و پەڕەکان نموونەی ساختەن/);}
 results.push(route+": application rendered");
}
for(const route of ["/preview/jobs","/preview/page","/preview/owner","/preview/owner/edit","/jobs/not-a-job-id","/jobs/44444444-4444-4444-8444-444444444444"]){
 assert.equal((await fetch(base+route)).status,404,route);
}
for(const route of ["/owner","/owner/edit","/owner/jobs","/owner/jobs/new"]){
 const response=await fetch(base+route,{redirect:"manual"});assert.equal(response.status,307);assert.equal(response.headers.get("location"),"/create");assert.match(response.headers.get("cache-control")??"",/private/);
}
assert.equal((await fetch(base+"/auth/login",{method:"POST",headers:{Origin:"https://untrusted.invalid"},redirect:"manual"})).status,403);
const login=await fetch(base+"/auth/login",{method:"POST",headers:{Origin:previewTarget.origin},redirect:"manual"});assert.equal(login.status,303);
const broker=new URL(login.headers.get("location"));assert.equal(broker.origin,"https://wickyjtjhgfzntifuzac.supabase.co");assert.equal(broker.pathname,"/auth/v1/authorize");assert.equal(broker.searchParams.get("provider"),"google");assert.equal(broker.searchParams.get("redirect_to"),previewTarget.origin+"/auth/callback");assert.match(login.headers.get("set-cookie")??"",/-code-verifier/);
results.push("Google broker URL and PKCE use the exact preview callback; no token exchange performed","Owner routes require sign-in; fixture routes hidden; missing jobs 404");
if(process.env.HALDOZ_TEST_PROFILE_HANDLE){
 const handle=process.env.HALDOZ_TEST_PROFILE_HANDLE;assert.match(handle,/^[a-z0-9-]{3,32}$/);
 const response=await fetch(base+"/p/"+handle),html=await response.text();assert.equal(response.status,200);assert.match(html,/href="tel:/);assert.doesNotMatch(html,/href="\/owner(?:\/edit|\/jobs\/new)?"/);results.push("Existing public profile and contact render anonymously without owner controls");
}
fs.mkdirSync(".local/qa",{recursive:true});fs.writeFileSync(".local/qa/preview-routes.json",JSON.stringify({origin:base,results,live:base===previewTarget.origin,hostedWrites:false,completedGoogleLogin:false,publishedJobDetailVerified:false},null,2));
console.log(JSON.stringify(results));
