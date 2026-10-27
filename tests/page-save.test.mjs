import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { validatePage } from "../src/lib/page-validation.ts";
import { pageDatabasePending, pageDatabaseUnavailable } from "../src/lib/account-errors.ts";

const compiled = ts.transpileModule(fs.readFileSync(new URL("../src/app/page-setup/actions.ts", import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const valid = {handle:"aso-office",display_name:"پەڕەی ئاسۆ",city:"هەولێر",public_phone:"07912345678",whatsapp_enabled:"on",confirm_public:"on",brand_tone:"blue",owner_id:"forged-owner",public_whatsapp:"+9647701111111"};

function action({signedIn=true,status="new",rpcResult={data:"synthetic-page-id",error:null}}={}) {
 const calls=[];
 const exports={};
 vm.runInNewContext(compiled,{exports,require(name){
  if(name==="next/navigation") return {redirect(destination){throw Object.assign(new Error("redirect"),{destination});}};
  if(name.endsWith("/supabase/server")) return {verifiedOwner:async()=>signedIn?{id:"verified-owner",client:{rpc:async(name,payload)=>{calls.push({name,payload});return rpcResult;}}}:null};
  if(name.endsWith("/owner-routing"))return {ownerPageState:async()=>({status,page:status==="saved"?{id:"saved-page"}:null})};
  if(name.endsWith("/page-validation"))return {validatePage};
  if(name.endsWith("/account-errors"))return {pageDatabasePending,pageDatabaseUnavailable};
  throw new Error("Unexpected dependency "+name);
 }});
 return {run:fields=>exports.savePage({},new Map(Object.entries(fields))),calls};
}
test("page saving sends one normalized contact to the atomic RPC and redirects only after success",async()=>{
 const handler=action();
 await assert.rejects(()=>handler.run(valid),error=>error.destination==="/owner");
 assert.equal(handler.calls.length,1);
 const {name,payload}=handler.calls[0];
 assert.equal(name,"haldoz_create_page");
 assert.equal(payload.page_phone,"+9647912345678");
 assert.equal(payload.page_whatsapp,payload.page_phone);
 assert.equal("owner_id" in payload,false);
 const disabled=action();
 await assert.rejects(()=>disabled.run({...valid,whatsapp_enabled:undefined}),error=>error.destination==="/owner");
 assert.equal(disabled.calls[0].payload.page_whatsapp,null);
});
test("page saving rejects signed-out, unavailable-schema and invalid-contact requests before any write",async()=>{
 for(const settings of [{signedIn:false},{status:"database-pending"},{status:"database-unavailable"}]){
  const handler=action(settings);
  const result=await handler.run(valid);
  assert.ok(result.message);
  assert.equal(handler.calls.length,0);
 }
 const invalid=action();
 assert.ok((await invalid.run({...valid,public_phone:"0751"})).errors.public_phone);
 assert.equal(invalid.calls.length,0);
});
test("returning owners go to their saved page without attempting a duplicate creation",async()=>{
 const handler=action({status:"saved"});
 await assert.rejects(()=>handler.run(valid),error=>error.destination==="/owner");
 assert.equal(handler.calls.length,0);
});
test("duplicate handles and failed saving never redirect or expose database diagnostics",async()=>{
 for(const rpcResult of [{data:null,error:{code:"23505",message:"private-diagnostic"}},{data:null,error:{code:"42501",message:"private-diagnostic"}},{data:null,error:null}]){
  const result=await action({rpcResult}).run(valid);
  assert.ok(result.message);
  assert.equal(JSON.stringify(result).includes("private-diagnostic"),false);
 }
});
