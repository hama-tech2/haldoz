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
let actionId,statusActionId;
if(process.env.HALDOZ_TEST_RUNTIME === "workers") {
 const {default:manifest}=await import("../dist/server/__vinext_action_owner_manifest.js");
 actionId=Object.keys(manifest).find(id=>id.endsWith("#saveJobDraft"));
 statusActionId=Object.keys(manifest).find(id=>id.endsWith("#changeJobStatus"));
}else{
 const manifest=JSON.parse(fs.readFileSync(".next/server/server-reference-manifest.json","utf8"));
 actionId=Object.entries(manifest.node).find(([,metadata])=>metadata.exportedName==="saveJobDraft")?.[0];
 statusActionId=Object.entries(manifest.node).find(([,metadata])=>metadata.exportedName==="changeJobStatus")?.[0];
}
assert.ok(actionId,"Built draft action exists");
const body=new FormData();body.set("$ACTION_ID_"+actionId,"");
for(const [field,value] of Object.entries({title:"Forged draft",city:"هەولێر",page_id:"22222222-2222-4222-8222-222222222222",owner_id:"22222222-2222-4222-8222-222222222222",status:"active",published_at:"2026-01-01"}))body.set(field,value);
const denied=await fetch(base+"/owner/jobs/new",{method:"POST",headers:{Origin:base},body,redirect:"manual"});
const deniedText=await denied.text();
assert.ok(([303,307].includes(denied.status) && denied.headers.get("location")==="/create") || (denied.status===200 && deniedText.includes("بۆ پاشەکەوتکردنی ڕەشنووس سەرەتا بچۆ ژوورەوە.")),"Unauthenticated draft action is denied before any write");
results.push("Real native draft action rejects an unauthenticated submission with forged ownership/publication fields");
assert.ok(statusActionId,"Built publication action exists");
for(const target of ["active","worker_found"]){
 const body=new FormData();body.set("$ACTION_ID_"+statusActionId,"");
 for(const [key,value]of Object.entries({job_id:"44444444-4444-4444-8444-444444444444",revision:"1",target_status:target,confirm:"on"}))body.set(key,value);
 const response=await fetch(base+"/owner/jobs/44444444-4444-4444-8444-444444444444/review",{method:"POST",headers:{Origin:base},body,redirect:"manual"});
 const text=await response.text();
 assert.ok(([303,307].includes(response.status)&&response.headers.get("location")==="/create")||(response.status===200&&text.includes("سەرەتا بچۆ ژوورەوە.")),"Native status action must reject unsigned requests");
}
results.push("Real native publish and filled actions reject unauthenticated requests before any write");
for(const path of ["/jobs","/favorites"]){
 const response=await fetch(base+path);assert.equal(response.status,200);assert.match(response.headers.get("cache-control")??"",/no-store/);
 const text=await response.text();assert.doesNotMatch(text,/demo-\d{3}|هەموو هەل و پەڕەکان نموونەی ساختەن/);
}
assert.equal((await fetch(base+"/jobs/not-a-valid-job-id")).status,404);
results.push("Public discovery/favorites are uncached and contain no development jobs; invalid public job URL returns 404");
fs.writeFileSync(".local/qa/draft-http.json",JSON.stringify({results,note:"Local HTTP negative paths; no hosted write or real signed-in owner tested."},null,2));
console.log(JSON.stringify(results));
