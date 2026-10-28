import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const source=ts.transpileModule(fs.readFileSync(new URL('../src/proxy.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
function proxy(hosted){const exports={};let authCalls=0;class NextResponse extends Response{static next(){return new NextResponse();}}vm.runInNewContext(source,{exports,process:{env:{HALDOZ_HOSTED_PREVIEW:String(hosted)}},require(name){if(name==='next/server')return {NextResponse};if(name==='@supabase/ssr')return {createServerClient(){authCalls++;throw Error('Fixture route must not authenticate');}};if(name.endsWith('/config'))return {supabaseConfig:()=>null};throw Error('Unexpected dependency');}});return {...exports,authCalls:()=>authCalls};}
test('hosted preview blocks fixture routes before reading auth; local fixtures remain available',async()=>{
 const hosted=proxy(true);for(const pathname of ['/preview','/preview/jobs','/preview/page','/preview/owner/edit']){const result=await hosted.proxy({nextUrl:{pathname}});assert.equal(result.status,404);assert.match(result.headers.get('cache-control'),/no-store/);}
 assert.equal(hosted.authCalls(),0);assert.equal((await hosted.proxy({nextUrl:{pathname:'/jobs'}})).status,200);
 assert.equal((await proxy(false).proxy({nextUrl:{pathname:'/preview/jobs'}})).status,200);
 assert.ok(hosted.config.matcher.includes('/preview/:path*'));
});
