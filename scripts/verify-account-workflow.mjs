import assert from "node:assert/strict";
import fs from "node:fs";
const base=process.env.HALDOZ_TEST_ORIGIN ?? "http://127.0.0.1:3100";
assert.ok(["127.0.0.1","localhost"].includes(new URL(base).hostname),"HTTP checks are loopback-only");
const results=[];
for (const path of ["/owner","/owner/edit"]) {
 const response=await fetch(base+path,{redirect:"manual"});
 assert.equal(response.status,307,path);
 assert.equal(response.headers.get("location"),"/create");
 assert.match(response.headers.get("cache-control")??"",/private/);
 assert.match(response.headers.get("cache-control")??"",/no-store/);
 results.push(path+": signed-out access redirects with private/no-store");
}
const preview=await fetch(base+"/preview/owner");const html=await preview.text();
assert.equal(preview.status,200);assert.match(html,/نموونەی پێشبینینە/);
assert.match(html,/<button[^>]*disabled[^>]*aria-describedby="publishing-status"/);
assert.doesNotMatch(html,/href="[^"]*(?:publish|add-job)/);
results.push("Owner fixture clearly labeled; Add Job disabled with no publishing route");
const decode=value=>value.replace(/&quot;/g,'"').replace(/&#x27;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&");
for(const [path,message] of [["/page-setup","بۆ پاشەکەوتکردن سەرەتا بچۆ ژوورەوە."],["/preview/owner/edit","بۆ دەستکاریکردن سەرەتا بچۆ ژوورەوە."]]) {
 const response=await fetch(base+path);assert.equal(response.status,200);
 const page=await response.text();const form=page.match(/<form[^>]*class="setup-form"[^>]*>([\s\S]*?)<\/form>/)?.[1];
 assert.ok(form,"Native action form exists");
 const body=new FormData();let nativeActions=0;
 for(const match of form.matchAll(/<input\b[^>]*>/g)){
  const attributes=Object.fromEntries([...match[0].matchAll(/([\w$:-]+)="([^"]*)"/g)].map(m=>[m[1],decode(m[2])]));
  if(attributes.type==="hidden" && attributes.name){body.append(attributes.name,attributes.value??"");if(attributes.name.startsWith("$ACTION"))nativeActions++;}
 }
 assert.ok(nativeActions>0,"Progressive server-action reference exists");
 for(const [name,value] of Object.entries({handle:"attacker-page",display_name:"Attacker",city:"هەولێر",public_phone:"+9647500000000",brand_tone:"blue",confirm_public:"on",owner_id:"11111111-1111-4111-8111-111111111111",id:"11111111-1111-4111-8111-111111111111"}))body.append(name,value);
 const denied=await fetch(base+path,{method:"POST",headers:{Origin:base},body,redirect:"manual"});
 assert.equal(denied.status,200,"Unauthorized server action returns form state");
 assert.ok((await denied.text()).includes(message),"Server rejects forged identity independently of disabled UI");
 results.push(path+": real native server-action POST rejects unauthenticated forged owner fields");
}
fs.writeFileSync(".local/qa/account-http.json",JSON.stringify({results,note:"Real local HTTP/server-action negative-path checks; no authenticated account or hosted write tested."},null,2));
console.log(JSON.stringify(results));
