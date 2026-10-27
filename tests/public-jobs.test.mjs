import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import * as publication from '../src/lib/job-publication.ts';
const code=ts.transpileModule(fs.readFileSync(new URL('../src/lib/public-jobs.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
function loader({ready=true,configured=true,data=[],error=null}={}){
 const calls=[],exports={};let options;
 const query={then(resolve,reject){return Promise.resolve({data,error}).then(resolve,reject);}};
 for(const method of ['select','eq','lte','order','limit'])query[method]=(...args)=>{calls.push([method,...args]);return query;};
 vm.runInNewContext(code,{exports,Date,process:{env:{HALDOZ_PAGES_READY:String(ready)}},fetch:async(input,init)=>({input,init}),require(name){
  if(name==='server-only')return {};
  if(name==='@supabase/supabase-js')return {createClient(url,key,opts){options=opts;calls.push(['client',url,key]);return {from:table=>{calls.push(['from',table]);return query;}};}};
  if(name.endsWith('/config'))return {supabaseConfig:()=>configured?{url:'https://wickyjtjhgfzntifuzac.supabase.co',key:'synthetic-publishable-key'}:null};
  if(name.endsWith('/job-publication'))return {...publication,jobsReady:()=>true};
  throw Error('Unexpected dependency '+name);
 }});
 return {run:exports.loadPublicJobs,calls,options:()=>options};
}
test('public loader always uses an anonymous non-persistent client and active-only uncached reads',async()=>{
 const s=loader();await s.run({pageId:'page-a',id:'job-a'});
 for(const pair of [['status','active'],['page_id','page-a'],['id','job-a']])assert.ok(s.calls.some(c=>c[0]==='eq'&&c[1]===pair[0]&&c[2]===pair[1]));
 assert.ok(s.calls.some(c=>c[0]==='lte'&&c[1]==='published_at'));
 assert.equal(s.options().auth.persistSession,false);assert.equal(s.options().auth.autoRefreshToken,false);assert.equal(s.options().auth.detectSessionInUrl,false);
 const response=await s.options().global.fetch('synthetic-url',{cache:'force-cache'});assert.equal(response.init.cache,'no-store');
 assert.ok(s.calls.some(c=>c[0]==='select'&&c[1].includes('haldoz_pages!inner')));
});
test('public data rejects filled/draft/future jobs even if an upstream result accidentally includes them',async()=>{
 const active={id:'active',status:'active',published_at:'2020-01-01T00:00:00Z',page:{handle:'synthetic'}};
 const s=loader({data:[active,{...active,id:'filled',status:'worker_found'},{...active,id:'draft',status:'draft'},{...active,id:'future',published_at:'2999-01-01T00:00:00Z'},{...active,id:'missing-page',page:null}]});
 const result=await s.run();assert.deepEqual(result.jobs.map(row=>row.id),['active']);assert.equal(result.unavailable,false);
});
test('database/configuration failures are distinguished from an honestly empty public list, without fixtures',async()=>{
 for(const options of [{ready:false},{configured:false},{error:{message:'private diagnostic'}}]){
  const s=loader(options);const result=await s.run();assert.equal(result.unavailable,true);assert.equal(result.jobs.length,0);assert.doesNotMatch(JSON.stringify(result),/private diagnostic/);
 }
 const empty=await loader().run();assert.equal(empty.unavailable,false);assert.equal(empty.jobs.length,0);
});
