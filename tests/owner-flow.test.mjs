import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { authErrorMessage } from '../src/lib/account-errors.ts';
const origin='http://127.0.0.1:3100';
const cookieBase='haldoz-wickyjtjhgfzntifuzac-auth-token';
const compile=file=>ts.transpileModule(fs.readFileSync(new URL(file,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const callbackSource=compile('../src/app/auth/callback/route.ts');
const routingSource=compile('../src/lib/owner-routing.ts');
function callback({state='new',valid=true,exchangeError=false,configured=true}={}) {
  let exchanges=0;const logs=[];
  const exports={};
  vm.runInNewContext(callbackSource,{exports,URL,Map,Object,console:{warn:(...v)=>logs.push(v),info:(...v)=>logs.push(v)},require(name){
    if(name==='next/server')return {NextResponse:{redirect(url,status){const response=new Response(null,{status,headers:{Location:String(url)}});const cookies=new Map();response.cookies={set(name,value,options){cookies.set(name,{name,value,options});},getAll:()=>[...cookies.values()]};return response;}}};
    if(name==='@supabase/ssr')return {createServerClient(url,key,options){return {auth:{
      async exchangeCodeForSession(){exchanges++;if(!exchangeError)options.cookies.setAll([{name:cookieBase+'.0',value:'synthetic-part-a',options:{path:'/',sameSite:'lax'}},{name:cookieBase+'.1',value:'synthetic-part-b',options:{path:'/',sameSite:'lax'}},{name:cookieBase+'-code-verifier',value:'',options:{path:'/',maxAge:0}}],{'Cache-Control':'private, no-store'});return {error:exchangeError?new Error('private provider diagnostic'):null};},
      async getClaims(){return valid?{data:{claims:{sub:'synthetic-owner',is_anonymous:false}},error:null}:{data:null,error:{code:'invalid'}};}
    }};}};
    if(name.endsWith('/config'))return {siteOrigin:()=>origin,authCookieOptions:{name:cookieBase,path:'/',sameSite:'lax'},supabaseConfig:()=>configured?{url:'https://wickyjtjhgfzntifuzac.supabase.co',key:'synthetic-key'}:null};
    if(name.endsWith('/owner-routing'))return {ownerPageState:async()=>({status:state,page:state==='saved'?{id:'synthetic-page'}:null}),ownerDestination:value=>value.status==='saved'?'/owner':'/page-setup'};
    throw Error('Unexpected dependency '+name);
  }});
  return {run:exports.GET,exchanges:()=>exchanges,logs};
}
function request(query='?code=synthetic-code',verifier=true,base=origin){return {headers:new Headers({host:new URL(base).host}),nextUrl:new URL(base+'/auth/callback'+query),cookies:{getAll:()=>verifier?[{name:cookieBase+'-code-verifier',value:'synthetic-verifier'}]:[]}};}
test('callback sends a new owner to setup and carries all session cookie chunks/deletions',async()=>{
 const handler=callback();const result=await handler.run(request());
 assert.equal(result.headers.get('location'),origin+'/page-setup');assert.equal(handler.exchanges(),1);
 assert.deepEqual(result.cookies.getAll().map(c=>c.name),[cookieBase+'.0',cookieBase+'.1',cookieBase+'-code-verifier']);
 assert.equal(result.cookies.getAll().at(-1).options.maxAge,0);
 assert.match(result.headers.get('cache-control'),/private/);assert.match(result.headers.get('cache-control'),/no-store/);
 assert.doesNotMatch(JSON.stringify(handler.logs),/synthetic-code|synthetic-verifier|synthetic-part|synthetic-owner/);
});
test('callback sends an existing saved page to My Page; database pending/error goes to setup',async()=>{
 for(const [state,path]of [['saved','/owner'],['database-pending','/page-setup'],['database-unavailable','/page-setup']])assert.equal((await callback({state}).run(request())).headers.get('location'),origin+path);
});
test('missing verifier and failed exchange produce distinct safe errors, never accept an unverified identity',async()=>{
 const missing=callback({valid:false});const absent=await missing.run(request('?code=synthetic-code',false));
 assert.equal(missing.exchanges(),0);assert.equal(new URL(absent.headers.get('location')).searchParams.get('error'),'callback_verifier_missing');
 const failure=await callback({valid:false,exchangeError:true}).run(request());assert.equal(new URL(failure.headers.get('location')).searchParams.get('error'),'callback_exchange_failed');
 const identity=await callback({valid:false}).run(request());assert.equal(new URL(identity.headers.get('location')).searchParams.get('error'),'callback_identity_failed');
});
test('callback distinguishes provider refusal/missing code/configuration and rejects alternate origin/open redirects',async()=>{
 for(const [query,code]of [['?error=access_denied','callback_denied'],['?next=https://untrusted.example','callback_missing_code']]){
  const result=await callback({valid:false}).run(request(query));const url=new URL(result.headers.get('location'));assert.equal(url.origin,origin);assert.equal(url.searchParams.get('error'),code);
 }
 assert.equal(new URL((await callback({configured:false}).run(request())).headers.get('location')).searchParams.get('error'),'callback_configuration');
 assert.equal(new URL((await callback().run(request('?code=synthetic-code',true,'http://localhost:3100'))).headers.get('location')).searchParams.get('error'),'callback_origin');
});
test('a verified existing session survives a stale/reloaded callback without creating another account',async()=>{
 const handler=callback({state:'new'});const result=await handler.run(request('',false));
 assert.equal(result.headers.get('location'),origin+'/page-setup');assert.equal(handler.exchanges(),0);
});
test('page resolution never confuses database failure with an empty ownership record',async()=>{
 for(const state of ['pending','unavailable','new','saved']){
  let called=0;const exports={};
  vm.runInNewContext(routingSource,{exports,process:{env:{HALDOZ_PAGES_READY:state==='pending'?'false':'true'}},require(name){if(name==='server-only')return {};if(name.endsWith('/owner-page'))return {loadOwnedPage:async()=>{called++;if(state==='unavailable')throw Error('missing table');return state==='saved'?{id:'page'}:null;}};throw Error('Unexpected dependency');}});
  const result=await exports.ownerPageState({id:'owner'});assert.equal(result.status,state==='pending'?'database-pending':state==='unavailable'?'database-unavailable':state);
  assert.equal(exports.ownerDestination(result),state==='saved'?'/owner':'/page-setup');assert.equal(called,state==='pending'?0:1);
 }
});
test('callback UI uses only allowlisted messages and never echoes provider input',()=>{
 assert.equal(authErrorMessage('arbitrary private diagnostic'),authErrorMessage('callback'));
 assert.equal(authErrorMessage('__proto__'),authErrorMessage('callback'));
 assert.notEqual(authErrorMessage('callback_verifier_missing'),authErrorMessage('callback_exchange_failed'));
});

function pageController(file, {signedIn=true,state='new'}={}) {
 const exports={};const saved={id:'synthetic-page',handle:'synthetic-page'};
 const jsx=(type,props)=>({type,props});
 const code=ts.transpileModule(fs.readFileSync(new URL(file,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 vm.runInNewContext(code,{exports,process:{env:{HALDOZ_PAGES_READY:state==='database-pending'?'false':'true'}},require(name){
  if(name==='react/jsx-runtime')return {jsx,jsxs:jsx,Fragment:'fragment'};
  if(name==='next/navigation')return {redirect(destination){throw Object.assign(Error('redirect'),{destination});}};
  if(name.endsWith('/supabase/server'))return {verifiedOwner:async()=>signedIn?{id:'synthetic-owner',client:{}}:null};
  if(name.endsWith('/owner-routing'))return {ownerPageState:async()=>({status:state,page:state==='saved'?saved:null}),ownerDestination:value=>value.status==='saved'?'/owner':'/page-setup'};
  if(name.endsWith('/supabase/readiness'))return {authReadiness:async()=>({ready:true,reason:''})};
  if(name.endsWith('/supabase/config'))return {siteOrigin:()=>origin};
  if(name.endsWith('/profile-workflow'))return {profileUrl:(base,handle)=>base+'/p/'+handle};
  if(name.endsWith('/account-errors'))return {authErrorMessage:()=> 'session error',pageDatabasePending:'database pending',pageDatabaseUnavailable:'database unavailable'};
  if(name.endsWith('/page-setup-form'))return {PageSetupForm:'setup-form'};
  if(name.endsWith('/owner-page-view'))return {OwnerPageView:'owner-view'};
  if(name.endsWith('/public-jobs'))return {loadPublicJobs:async()=>({jobs:[],unavailable:false})};
  if(name.endsWith('/public-job-list'))return {PublicJobList:'public-job-list'};
  return {};
 }});
 return exports.default;
}
function findNode(node,type){if(!node||typeof node!=='object')return null;if(node.type===type)return node;for(const child of [node.props?.children].flat(Infinity)){const found=findNode(child,type);if(found)return found;}return null;}
test('signed-in login page redirects to setup or saved page instead of asking Google again',async()=>{
 for(const state of ['new','database-pending','database-unavailable','saved']){
  await assert.rejects(()=>pageController('../src/app/create/page.tsx',{state})({searchParams:Promise.resolve({})}),error=>error.destination===(state==='saved'?'/owner':'/page-setup'));
 }
 assert.ok(await pageController('../src/app/create/page.tsx',{signedIn:false})({searchParams:Promise.resolve({})}));
});
test('My Page redirects unsaved owners to setup and never treats database pending as a login failure',async()=>{
 for(const state of ['new','database-pending','database-unavailable'])await assert.rejects(()=>pageController('../src/app/owner/page.tsx',{state})(),error=>error.destination==='/page-setup');
 await assert.rejects(()=>pageController('../src/app/owner/page.tsx',{signedIn:false})(),error=>error.destination==='/create');
 assert.ok(findNode(await pageController('../src/app/owner/page.tsx',{state:'saved'})(),'owner-view'));
});
test('setup ends the redirect chain: save only for a verified new owner with available schema',async()=>{
 for(const state of ['new','database-pending','database-unavailable']){
  const tree=await pageController('../src/app/page-setup/page.tsx',{state})();const form=findNode(tree,'setup-form');
  assert.ok(form);assert.equal(form.props.authenticated,true);assert.equal(form.props.canSave,state==='new');
  if(state!=='new')assert.match(form.props.unavailableReason,/database/);
 }
 await assert.rejects(()=>pageController('../src/app/page-setup/page.tsx',{state:'saved'})(),error=>error.destination==='/owner');
 const guest=findNode(await pageController('../src/app/page-setup/page.tsx',{signedIn:false})(),'setup-form');assert.equal(guest.props.canSave,false);assert.equal(guest.props.authenticated,false);
});
