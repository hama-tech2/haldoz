import assert from "node:assert/strict";
import fs from "node:fs";
const base=process.env.HALDOZ_TEST_ORIGIN ?? "http://127.0.0.1:3100";
assert.ok(["127.0.0.1","localhost"].includes(new URL(base).hostname),"HTTP checks are loopback-only");
const results=[];
for(const path of ["/owner/jobs","/owner/jobs/new","/owner/jobs/44444444-4444-4444-8444-444444444444","/owner/jobs/44444444-4444-4444-8444-444444444444/review"]){
 const response=await fetch(base+path,{redirect:"manual"});
 assert.equal(response.status,307,path);assert.equal(response.headers.get("location"),"/create");
 assert.match(response.headers.get("cache-control") ?? "",/private/);assert.match(response.headers.get("cache-control") ?? "",/no-store/);
 results.push(path+": signed-out redirect, private/no-store");
}
const fixture=await fetch(base+"/preview/jobs");const html=await fixture.text();
assert.equal(fixture.status,200);assert.match(html,/تەنها تاقیکردنەوەی پەرەپێدان/);assert.match(html,/Supabase/);
let actionId;
if(process.env.HALDOZ_TEST_RUNTIME === "workers") {
 const {default:manifest}=await import("../dist/server/__vinext_action_owner_manifest.js");
 actionId=Object.keys(manifest).find(id=>id.endsWith("#saveJobDraft"));
}else{
 const manifest=JSON.parse(fs.readFileSync(".next/server/server-reference-manifest.json","utf8"));
 actionId=Object.entries(manifest.node).find(([,metadata])=>metadata.exportedName==="saveJobDraft")?.[0];
}
assert.ok(actionId,"Built draft action exists");
const body=new FormData();body.set("$ACTION_ID_"+actionId,"");
for(const [field,value] of Object.entries({title:"Forged draft",city:"هەولێر",page_id:"22222222-2222-4222-8222-222222222222",owner_id:"22222222-2222-4222-8222-222222222222",status:"active",published_at:"2026-01-01"}))body.set(field,value);
const denied=await fetch(base+"/owner/jobs/new",{method:"POST",headers:{Origin:base},body,redirect:"manual"});
const deniedText=await denied.text();
assert.ok(([303,307].includes(denied.status) && denied.headers.get("location")==="/create") || (denied.status===200 && deniedText.includes("بۆ پاشەکەوتکردنی ڕەشنووس سەرەتا بچۆ ژوورەوە.")),"Unauthenticated draft action is denied before any write");
results.push("Real native draft action rejects an unauthenticated submission with forged ownership/publication fields");
fs.writeFileSync(".local/qa/draft-http.json",JSON.stringify({results,note:"Local HTTP negative paths; no hosted write or real signed-in owner tested."},null,2));
console.log(JSON.stringify(results));
