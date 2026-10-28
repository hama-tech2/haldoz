import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import * as drafts from '../src/lib/job-drafts.ts';
import * as publication from '../src/lib/job-publication.ts';
const code=ts.transpileModule(fs.readFileSync(new URL('../src/app/owner/jobs/actions.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const id='44444444-4444-4444-8444-444444444444';
const other='55555555-5555-4555-8555-555555555555';
const complete={...drafts.blankDraft,title:'Synthetic test role',city:'هەولێر',workplace:'Synthetic workplace',description:'Synthetic job conditions',salary_mode:'negotiable',placement_fee_mode:'none'};
const row={...publication.jobContentFields(complete),id,status:'draft',revision:3,created_at:'2026-10-27T00:00:00Z'};
function form(values){const result=new FormData();for(const [key,value]of Object.entries(values))result.set(key,String(value));return result;}
function setup({signedIn=true,pagesReady=true,jobsReady=true,page=true,current=row,readError=null,result={data:[{id,revision:1,status:'draft'}],error:null}}={}){
 const calls=[],refreshed=[],exports={};
 const chain={};
 for(const method of ['select','eq','returns'])chain[method]=(...args)=>{calls.push([method,...args]);return chain;};
 chain.maybeSingle=async()=>({data:current,error:readError});
 const client={from(table){calls.push(['from',table]);return chain;},async rpc(name,payload){calls.push(['rpc',name,payload]);return result;}};
 vm.runInNewContext(code,{exports,FormData,Object,Number,String,process:{env:{HALDOZ_PAGES_READY:String(pagesReady)}},require(name){
  if(name==='next/cache')return {revalidatePath:path=>refreshed.push(path)};
  if(name.endsWith('/supabase/server'))return {verifiedOwner:async()=>signedIn?{id:'owner-a',client}:null};
  if(name.endsWith('/owner-page'))return {loadOwnedPage:async()=>page?{id:'page-a',handle:'synthetic-page'}:null};
  if(name.endsWith('/job-drafts'))return drafts;
  if(name.endsWith('/job-publication'))return {...publication,jobsReady:()=>jobsReady};
  if(name.endsWith('/owner-jobs'))return {ownerJobColumns:()=>'*'};
  throw Error('Unexpected dependency '+name);
 }});
 return {...exports,calls,refreshed};
}
const statusForm=(overrides={})=>form({job_id:id,revision:3,target_status:'active',confirm:'on',...overrides});
test('job draft action saves whitelisted content and reports success only from a matching receipt',async()=>{
 const s=setup();const result=await s.saveJobDraft({},form({...complete,page_id:'forged',status:'active',published_at:'forged'}));
 assert.equal(result.savedId,id);assert.equal(result.savedStatus,'draft');assert.equal(result.savedRevision,1);
 const rpc=s.calls.find(call=>call[0]==='rpc');assert.equal(rpc[1],'haldoz_save_job');assert.equal(rpc[2].job_id,null);
 for(const field of ['page_id','status','published_at','revision'])assert.equal(Object.hasOwn(rpc[2].job_payload,field),false);
 assert.ok(s.refreshed.includes('/p/synthetic-page'));assert.ok(s.refreshed.includes('/jobs/'+id));
});
test('save guards reject missing identity/page, readiness, invalid input and another owner before writing',async()=>{
 for(const options of [{signedIn:false},{pagesReady:false},{page:false},{current:null},{current:row,readError:{code:'denied'}}]){
  const s=setup(options);const result=await s.saveJobDraft({},form({...complete,draft_id:id,revision:3}));
  assert.equal(result.savedId,undefined);assert.equal(s.calls.some(c=>c[0]==='rpc'),false);assert.equal(s.refreshed.length,0);
 }
 const invalid=setup();assert.ok((await invalid.saveJobDraft({},form({...complete,title:''}))).errors.title);assert.equal(invalid.calls.length,0);
 const pending=setup({jobsReady:false});assert.equal((await pending.saveJobDraft({},form(complete))).savedId,undefined);assert.equal(pending.calls.length,0);
});
test('editing requires the saved revision and preserves active status',async()=>{
 const active={...row,status:'active'};
 const s=setup({current:active,result:{data:[{id,revision:4,status:'active'}],error:null}});
 assert.equal((await s.saveJobDraft({},form({...complete,draft_id:id,revision:3}))).savedStatus,'active');
 assert.ok(s.calls.some(c=>c[0]==='eq'&&c[1]==='page_id'&&c[2]==='page-a'));
 const stale=setup({current:active});assert.equal((await stale.saveJobDraft({},form({...complete,draft_id:id,revision:2}))).savedId,undefined);assert.equal(stale.calls.some(c=>c[0]==='rpc'),false);
 const incomplete=setup({current:active});assert.ok((await incomplete.saveJobDraft({},form({...complete,draft_id:id,revision:3,workplace:''}))).errors.workplace);assert.equal(incomplete.calls.some(c=>c[0]==='rpc'),false);
});
test('publish validates the saved row, requires confirmation and invalidates public routes after success',async()=>{
 const s=setup({result:{data:[{id,revision:4,status:'active'}],error:null}});
 assert.equal((await s.changeJobStatus({},statusForm({title:'ignored forged title',page_id:'forged'}))).savedStatus,'active');
 const rpc=s.calls.find(c=>c[0]==='rpc');assert.equal(rpc[1],'haldoz_change_job_status');assert.deepEqual(JSON.parse(JSON.stringify(rpc[2])),{job_id:id,expected_revision:3,target_status:'active'});
 assert.ok(s.refreshed.includes('/jobs'));assert.ok(s.refreshed.includes('/favorites'));assert.ok(s.refreshed.includes('/p/synthetic-page'));
 const incomplete=setup({current:{...row,workplace:''}});assert.ok((await incomplete.changeJobStatus({},statusForm({workplace:'forged complete'}))).errors.workplace);assert.equal(incomplete.calls.some(c=>c[0]==='rpc'),false);
 for(const overrides of [{confirm:''},{target_status:'archived'},{revision:2},{job_id:'invalid'}]){
  const denied=setup();assert.equal((await denied.changeJobStatus({},statusForm(overrides))).savedId,undefined);assert.equal(denied.calls.some(c=>c[0]==='rpc'),false);
 }
});
test('closing succeeds only for an owned active job; auth/readiness/ownership failures never publish',async()=>{
 const s=setup({current:{...row,status:'active'},result:{data:[{id,revision:4,status:'worker_found'}],error:null}});
 assert.equal((await s.changeJobStatus({},statusForm({target_status:'worker_found'}))).savedStatus,'worker_found');
 for(const options of [{signedIn:false},{pagesReady:false},{jobsReady:false},{page:false},{current:null},{current:{...row,status:'worker_found'}}]){
  const denied=setup(options);assert.equal((await denied.changeJobStatus({},statusForm())).savedId,undefined);assert.equal(denied.calls.some(c=>c[0]==='rpc'),false);
 }
});
test('empty, wrong, stale or failed database receipts never produce false save/publish success',async()=>{
 for(const result of [{data:null,error:{code:'40001',message:'private diagnostic'}},{data:[],error:null},{data:[{id:other,revision:4,status:'active'}],error:null},{data:[{id,revision:3,status:'active'}],error:null},{data:[{id,revision:4,status:'draft'}],error:null}]){
  const s=setup({result});const response=await s.changeJobStatus({},statusForm());assert.equal(response.savedId,undefined);assert.equal(s.refreshed.length,0);assert.doesNotMatch(response.message,/private diagnostic/);
 }
 for(const result of [{data:[],error:null},{data:[{id,revision:2,status:'draft'}],error:null},{data:[{id:'invalid',revision:1,status:'draft'}],error:null},{data:[{id,revision:1,status:'active'}],error:null}]){
  const s=setup({result});assert.equal((await s.saveJobDraft({},form(complete))).savedId,undefined);assert.equal(s.refreshed.length,0);
 }
});
