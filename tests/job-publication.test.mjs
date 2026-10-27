import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {PGlite} from "@electric-sql/pglite";
import {blankDraft,validateDraft} from "../src/lib/job-drafts.ts";
import {jobContentFields,publicationErrors,isPubliclyAvailable,receiptMatches} from "../src/lib/job-publication.ts";

const complete={...blankDraft,title:"کارمەندی نووسینگە",city:"هەولێر",workplace:"Synthetic workplace",description:"Synthetic responsibilities and conditions",salary_mode:"negotiable",placement_fee_mode:"none"};
test("publication requires truthful workplace, conditions, salary and fee disclosure",()=>{
 assert.deepEqual(publicationErrors(complete),{});
 const incomplete=publicationErrors({...blankDraft,title:"Job",city:"هەولێر"});
 for(const field of ["description","workplace","salary_mode","placement_fee_mode"])assert.ok(incomplete[field],field);
 assert.ok(publicationErrors({...complete,salary_mode:"fixed",salary:"0"}).salary);
 for(const [mode,amount] of [["fixed","-1"],["fixed","1.5"],["percentage","101"],["percentage","2.555"]])assert.ok(validateDraft({...complete,placement_fee_mode:mode,placement_fee:amount}).errors.placement_fee);
 const paid=validateDraft({...complete,placement_fee_mode:"percentage",placement_fee:"١٢.٥٠",placement_fee_terms:"One-time percentage of the first month, paid after placement."});
 assert.deepEqual(publicationErrors(paid.draft),{});
 assert.equal(jobContentFields(paid.draft).placement_fee,12.5);
 assert.ok(publicationErrors({...paid.draft,placement_fee_terms:""}).placement_fee_terms);
 assert.equal(jobContentFields(validateDraft({...paid.draft,placement_fee_mode:"none"}).draft).placement_fee,null);
});
test("public availability excludes filled, draft, archived, invalid and future-dated rows",()=>{
 const now=Date.parse("2026-10-27T12:00:00Z");
 for(const status of ["draft","worker_found","archived"])assert.equal(isPubliclyAvailable({status,published_at:"2026-10-27T11:00:00Z"},now),false);
 for(const published_at of [null,"invalid","2026-10-28T12:00:00Z"])assert.equal(isPubliclyAvailable({status:"active",published_at},now),false);
 assert.equal(isPubliclyAvailable({status:"active",published_at:"2026-10-27T11:00:00Z"},now),true);
 for(const response of [null,[],[{id:"x",revision:0,status:"active"}],[{id:"wrong",revision:1,status:"active"}]])assert.equal(receiptMatches(response,"expected","active"),false);
});

test("publication migration executes under real local PostgreSQL RLS (synthetic identities, NOT hosted JWTs)",async t=>{
 const db=new PGlite();
 const a="11111111-1111-4111-8111-111111111111",b="22222222-2222-4222-8222-222222222222";
 try{
 await db.exec(`create role anon; create role authenticated; create role service_role;
 create schema auth;create table auth.users(id uuid primary key);
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 create function auth.jwt() returns jsonb language sql stable as $$select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb$$;
 grant usage on schema auth,public to anon,authenticated;
 alter default privileges in schema public grant all on tables to anon,authenticated,service_role;
 alter default privileges in schema public grant all on functions to anon,authenticated,service_role;
 create function public.test_shared_helper() returns integer language sql as $$select 1$$;
 insert into auth.users values ('${a}'),('${b}');`);
 const initial=fs.readFileSync(new URL("../supabase/migrations/20261022200318_haldoz_owner_pages_and_jobs.sql",import.meta.url),"utf8");
 await db.exec(initial);
 const actor=(id,fn,anonymous=false)=>db.transaction(async tx=>{
 await tx.exec("set local role "+(id?"authenticated":"anon"));
 await tx.query("select set_config('request.jwt.claim.sub',$1,true),set_config('request.jwt.claims',$2,true)",[id??"",JSON.stringify({sub:id,is_anonymous:anonymous})]);return fn(tx);});
 const page=(id,handle)=>actor(id,tx=>tx.query("select public.haldoz_create_page($1,'Synthetic page','','هەولێر','+9647912345678',null,'blue') as id",[handle]));
 const pageA=(await page(a,"owner-a")).rows[0].id;
 await page(b,"owner-b");
 // Apply ONLY to this disposable in-memory PostgreSQL database.
 await db.exec(fs.readFileSync(new URL("../supabase/migrations/20261027164402_haldoz_job_publication.sql",import.meta.url),"utf8"));
 const save=(who,id,revision,payload,anonymous=false)=>actor(who,tx=>tx.query("select * from public.haldoz_save_job($1,$2,$3::jsonb)",[id,revision,JSON.stringify(payload)]),anonymous);
 const change=(who,id,revision,status,anonymous=false)=>actor(who,tx=>tx.query("select * from public.haldoz_change_job_status($1,$2,$3)",[id,revision,status]),anonymous);
 const read=(who,id)=>actor(who,tx=>tx.query("select * from public.haldoz_jobs where id=$1",[id]));
 const expectCode=(fn,code)=>assert.rejects(fn,error=>error.code===code);
 let row;
 await t.test("existing pages/Auth and shared helper grants survive; invoker RPCs never give anonymous execution",async()=>{
 assert.equal((await db.query("select count(*)::int as n from auth.users")).rows[0].n,2);
 assert.equal((await db.query("select count(*)::int as n from public.haldoz_pages")).rows[0].n,2);
 assert.equal((await db.query("select has_function_privilege('anon','public.test_shared_helper()','EXECUTE') as ok")).rows[0].ok,true);
 const functions=(await db.query("select prosecdef,has_function_privilege('anon',oid,'EXECUTE') as anon from pg_proc where proname in ('haldoz_save_job','haldoz_change_job_status','haldoz_guard_job_write')")).rows;
 assert.equal(functions.length,3);assert.ok(functions.every(f=>!f.prosecdef&&!f.anon));
 for(const column of ["page_id","published_at","completed_at","revision","created_at"])assert.equal((await db.query("select has_column_privilege('authenticated','public.haldoz_jobs',$1,'UPDATE') as allowed",[column])).rows[0].allowed,false);
 });
 await t.test("owner creates/reloads a private draft; forged status/page identity ignored",async()=>{
 row=(await save(a,null,null,{...jobContentFields({...complete,workplace:"",description:"",salary_mode:"unspecified",placement_fee_mode:"unspecified"}),page_id:"forged",status:"active",revision:999,published_at:"2030-01-01"})).rows[0];
 assert.equal(row.status,"draft");assert.equal(row.revision,1);
 const stored=(await read(a,row.id)).rows[0];assert.equal(stored.page_id,pageA);assert.equal(stored.published_at,null);
 assert.equal((await read(null,row.id)).rows.length,0);assert.equal((await read(b,row.id)).rows.length,0);
 });
 await t.test("incomplete publication and forged direct insert fail without partial changes",async()=>{
 await expectCode(()=>change(a,row.id,1,"active"),"23514");
 await expectCode(()=>actor(a,tx=>tx.query("insert into public.haldoz_jobs(page_id,title,city,status) values ($1,'Forged','هەولێر','active')",[pageA])),"23514");
 assert.equal((await read(a,row.id)).rows[0].revision,1);
 });
 await t.test("save/edit is durable and stale writes/publication cannot overwrite later edits",async()=>{
 row=(await save(a,row.id,1,jobContentFields(complete))).rows[0];assert.equal(row.revision,2);
 await expectCode(()=>save(a,row.id,1,jobContentFields({...complete,title:"Stale"})),"40001");
 await expectCode(()=>change(a,row.id,1,"active"),"40001");
 assert.equal((await read(a,row.id)).rows[0].title,complete.title);
 });
 await t.test("owner publishes reviewed content; anonymous reads show real public job data",async()=>{
 row=(await change(a,row.id,2,"active")).rows[0];assert.equal(row.status,"active");assert.equal(row.revision,3);
 const publicRow=(await read(null,row.id)).rows[0];assert.equal(publicRow.title,complete.title);assert.ok(publicRow.published_at);assert.equal(publicRow.completed_at,null);
 assert.equal("owner_id" in publicRow,false);
 });
 await t.test("active-job editing keeps status and timestamps and revalidates required public details",async()=>{
 const before=(await read(a,row.id)).rows[0];
 await expectCode(()=>save(a,row.id,row.revision,jobContentFields({...complete,workplace:""})),"23514");
 row=(await save(a,row.id,row.revision,jobContentFields({...complete,title:"Updated available job"}))).rows[0];
 const after=(await read(null,row.id)).rows[0];assert.equal(after.status,"active");assert.equal(after.title,"Updated available job");assert.equal(after.published_at.getTime(),before.published_at.getTime());
 });
 await t.test("non-owner, anonymous visitor and anonymous-auth identity cannot edit/publish/close another job",async()=>{
 await expectCode(()=>save(b,row.id,row.revision,jobContentFields(complete)),"40001");
 await expectCode(()=>change(b,row.id,row.revision,"worker_found"),"40001");
 await expectCode(()=>change(null,row.id,row.revision,"worker_found"),"42501");
 await expectCode(()=>change(a,row.id,row.revision,"worker_found",true),"42501");
 assert.equal((await actor(b,tx=>tx.query("update public.haldoz_jobs set status='worker_found' where id=$1 returning id",[row.id]))).rows.length,0);
 await expectCode(()=>actor(a,tx=>tx.query("update public.haldoz_jobs set published_at=now() where id=$1",[row.id])),"42501");
 });
 await t.test("filled job disappears from direct public reads and discovery; remains visible to its owner",async()=>{
 row=(await change(a,row.id,row.revision,"worker_found")).rows[0];
 assert.equal((await read(null,row.id)).rows.length,0);assert.equal((await read(b,row.id)).rows.length,0);
 assert.equal((await actor(null,tx=>tx.query("select id from public.haldoz_jobs where status='active'"))).rows.length,0);
 const closed=(await read(a,row.id)).rows[0];assert.equal(closed.status,"worker_found");assert.ok(closed.completed_at);
 await expectCode(()=>change(a,row.id,row.revision,"active"),"40001");
 await expectCode(()=>actor(a,tx=>tx.query("update public.haldoz_jobs set status='active' where id=$1",[row.id])),"23514");
 await expectCode(()=>save(a,row.id,row.revision,jobContentFields(complete)),"40001");
 });
 await t.test("paid placement fee requires valid amount and explicit terms before publication",async()=>{
 const paid={...complete,placement_fee_mode:"percentage",placement_fee:"12.5",placement_fee_terms:""};
 const draft=(await save(a,null,null,jobContentFields(paid))).rows[0];
 await expectCode(()=>change(a,draft.id,draft.revision,"active"),"23514");
 await expectCode(()=>save(a,draft.id,draft.revision,{...jobContentFields(paid),placement_fee:100.01}),"23514");
 const updated=(await save(a,draft.id,draft.revision,jobContentFields({...paid,placement_fee_terms:"One-time percentage of first monthly salary after placement."}))).rows[0];
 const published=(await change(a,updated.id,updated.revision,"active")).rows[0];
 const publicRow=(await read(null,published.id)).rows[0];assert.equal(Number(publicRow.placement_fee),12.5);assert.ok(publicRow.placement_fee_terms.includes("first monthly"));
 });
 }finally{await db.close();}
});
