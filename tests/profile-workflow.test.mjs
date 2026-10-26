import test from "node:test";
import assert from "node:assert/strict";
import { editablePublicFields, profilePath, profileUrl, copyProfileLink } from "../src/lib/profile-workflow.ts";
import { previewPage } from "../src/lib/page-validation.ts";
test("public URLs are stable and reject path traversal or dangerous origins",()=>{
 assert.equal(profileUrl("http://127.0.0.1:3100","aso-office"),"http://127.0.0.1:3100/p/aso-office");
 assert.equal(profilePath("aso-office"),"/p/aso-office");
 for(const handle of ["../owner","https://elsewhere","admin","a/b"])assert.throws(()=>profilePath(handle));
 for(const origin of ["javascript:alert(1)","http://evil.example","https://user:password@example.invalid"])assert.throws(()=>profileUrl(origin,"aso-office"));
});
test("edit payload cannot contain private identity, handle, timestamps or job fields",()=>{
 const fields=editablePublicFields({...previewPage,id:"attacker",owner_id:"other-owner",email:"private@example.invalid",handle:"attacker",created_at:"fake",status:"active"});
 assert.deepEqual(Object.keys(fields).sort(),["bio","brand_tone","city","display_name","public_phone","public_whatsapp"]);
 assert.equal(fields.public_phone,null); assert.equal(fields.public_whatsapp,null);
});
test("copy reports success only after the actual clipboard operation succeeds",async()=>{
 let copied="";
 assert.equal(await copyProfileLink("http://127.0.0.1:3100/p/aso-office",async text=>{copied=text;}),true);
 assert.equal(copied,"http://127.0.0.1:3100/p/aso-office");
 assert.equal(await copyProfileLink("not-copied",async()=>{throw new Error("Denied");}),false);
});
