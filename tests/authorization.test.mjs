import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import {validateDraft,draftWriteFields,blankDraft} from "../src/lib/job-drafts.ts";
test("PostgreSQL authorization with synthetic Supabase roles (not hosted/JWT validation)", async t => {
 const db = new PGlite();
 try {
  await db.exec(`create role anon; create role authenticated; create role service_role;
   create schema auth; create table auth.users(id uuid primary key, email text);
   create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
   create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb $$;
   grant usage on schema auth, public to anon, authenticated;
   insert into auth.users values ('11111111-1111-4111-8111-111111111111','owner-a@example.invalid'),('22222222-2222-4222-8222-222222222222','owner-b@example.invalid'),('33333333-3333-4333-8333-333333333333','owner-c@example.invalid');`);
  // Reproduce the confirmed hosted public-schema defaults before testing the migration's revokes.
  await db.exec(`alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
    alter default privileges in schema public grant all on functions to anon, authenticated, service_role;`);
  await db.exec(fs.readFileSync(new URL("../supabase/migrations/20261022200318_haldoz_owner_pages_and_jobs.sql",import.meta.url),"utf8"));
  const a="11111111-1111-4111-8111-111111111111", b="22222222-2222-4222-8222-222222222222", c="33333333-3333-4333-8333-333333333333";
  const actor = (id, fn, anonymous=false) => db.transaction(async tx => {
   await tx.exec("set local role " + (id ? "authenticated" : "anon"));
   await tx.query("select set_config('request.jwt.claim.sub',$1,true),set_config('request.jwt.claims',$2,true)",[id ?? "",JSON.stringify({sub:id,is_anonymous:anonymous})]);
   return fn(tx);
  });
  const create = (id,handle,anonymous=false) => actor(id,tx=>tx.query("select public.haldoz_create_page($1,$2,'',$3,$4,null,'blue') as id",[handle,"پەڕەی نموونە","هەولێر","+9647500000000"]),anonymous);
  const pageA=(await create(a,"owner-a")).rows[0].id, pageB=(await create(b,"owner-b")).rows[0].id;
  await t.test("all three tables have RLS, RPC is invoker and anon cannot execute it",async()=>{
   const result=await db.query("select relname,relrowsecurity from pg_class where relname in ('haldoz_owner_pages','haldoz_pages','haldoz_jobs')");
   assert.equal(result.rows.length,3); assert.ok(result.rows.every(r=>r.relrowsecurity));
   const f=(await db.query("select prosecdef,has_function_privilege('anon',oid,'execute') as anon from pg_proc where proname='haldoz_create_page'")).rows[0];
   assert.equal(f.prosecdef,false); assert.equal(f.anon,false);
   const permissions=(await db.query("select has_table_privilege('anon','public.haldoz_owner_pages','select') as public_owner_read,has_column_privilege('authenticated','public.haldoz_jobs','published_at','update') as publication_write,has_table_privilege('authenticated','public.haldoz_jobs','delete') as job_delete")).rows[0];
   assert.equal(permissions.public_owner_read,false);assert.equal(permissions.publication_write,false);assert.equal(permissions.job_delete,false);
  });
  await t.test("visitor reads profiles without auth and sees no account identity",async()=>{
   const result=await actor(null,tx=>tx.query("select * from public.haldoz_pages"));
   assert.equal(result.rows.length,2); assert.ok(result.rows.every(r=>!("owner_id" in r)&&!("email" in r)));
   await assert.rejects(()=>actor(null,tx=>tx.query("select * from public.haldoz_owner_pages")),/permission denied/);
  });
  await t.test("each owner sees only their own private ownership record",async()=>{
   const rows=(await actor(b,tx=>tx.query("select * from public.haldoz_owner_pages"))).rows;
   assert.equal(rows.length,1); assert.equal(rows[0].owner_id,b);
  });
  await t.test("owner updates own public page, non-owner updates zero rows",async()=>{
   assert.equal((await actor(a,tx=>tx.query("update public.haldoz_pages set bio='Owner update' where id=$1 returning id",[pageA]))).rows.length,1);
   assert.equal((await actor(b,tx=>tx.query("update public.haldoz_pages set bio='Attack' where id=$1 returning id",[pageA]))).rows.length,0);
  });
  await t.test("owner cannot reassign ownership, change stable handle, or impersonate another owner",async()=>{
   await assert.rejects(()=>actor(a,tx=>tx.query("update public.haldoz_owner_pages set owner_id=$1 where id=$2",[b,pageA])),/permission denied/);
   await assert.rejects(()=>actor(a,tx=>tx.query("update public.haldoz_pages set handle='stolen-handle' where id=$1",[pageA])),/permission denied/);
   await assert.rejects(()=>actor(c,tx=>tx.query("insert into public.haldoz_owner_pages(owner_id) values ($1)",[a])),/permission denied/);
  });
  await t.test("duplicate handle atomically rolls back private ownership insertion",async()=>{
   await assert.rejects(()=>create(c,"owner-a"),/unique constraint/);
   assert.equal((await actor(c,tx=>tx.query("select * from public.haldoz_owner_pages"))).rows.length,0);
   await assert.rejects(()=>create(c,"admin"),/check constraint/);
  });
  await t.test("guest cannot create and anonymous auth user cannot become owner",async()=>{
   await assert.rejects(()=>create(null,"guest-page"),/permission denied/);
   await assert.rejects(()=>create(c,"guest-page",true),/Signed-in owner required/);
  });
  await t.test("complete profile edit is public at the same handle without exposing account fields",async()=>{
   await actor(a,tx=>tx.query("update public.haldoz_pages set display_name='Edited public page',bio='Public description',city='سلێمانی',public_phone='+9647500000001',public_whatsapp='+9647500000001',brand_tone='teal' where id=$1 returning id",[pageA]));
   const page=(await actor(null,tx=>tx.query("select * from public.haldoz_pages where handle='owner-a'"))).rows[0];
   assert.equal(page.display_name,"Edited public page");assert.equal(page.city,"سلێمانی");assert.equal(page.brand_tone,"teal");
   assert.equal(page.handle,"owner-a");assert.equal("email" in page,false);assert.equal("owner_id" in page,false);
  });
  await t.test("non-owner cannot alter public contacts or delete someone else's profile",async()=>{
   assert.equal((await actor(b,tx=>tx.query("update public.haldoz_pages set public_phone='+9647500000003' where id=$1 returning id",[pageA]))).rows.length,0);
   await assert.rejects(()=>actor(b,tx=>tx.query("delete from public.haldoz_pages where id=$1",[pageA])),/permission denied/);
  });
  await t.test("an anonymous-auth token cannot edit even with a matching synthetic subject",async()=>{
   assert.equal((await actor(a,tx=>tx.query("update public.haldoz_pages set bio='Anonymous attack' where id=$1 returning id",[pageA]),true)).rows.length,0);
  });
  await t.test("visitor writes and removing every public contact fail at the database",async()=>{
   await assert.rejects(()=>actor(null,tx=>tx.query("update public.haldoz_pages set bio='Guest attack' where id=$1",[pageA])),/permission denied/);
   await assert.rejects(()=>actor(a,tx=>tx.query("update public.haldoz_pages set public_phone=null,public_whatsapp=null where id=$1",[pageA])),/not-null constraint/);
   await assert.rejects(()=>actor(a,tx=>tx.query("update public.haldoz_pages set public_whatsapp='+9647701111111' where id=$1",[pageA])),/check constraint/);
  });


  const draft=(await actor(a,tx=>tx.query("insert into public.haldoz_jobs(page_id,title,city) values ($1,'Private draft','هەولێر') returning id",[pageA]))).rows[0].id;
  // Elevated synthetic fixtures exercise existing public visibility, not owner publication rights.
  await db.query("insert into public.haldoz_jobs(page_id,title,city,status,published_at) values ($1,'Available job','هەولێر','active',now())",[pageA]);
  await db.query("insert into public.haldoz_jobs(page_id,title,city,status,published_at,completed_at) values ($1,'Recent completed','هەولێر','worker_found',now()-interval '2 days',now()-interval '1 hour'),($1,'Old completed','هەولێر','worker_found',now()-interval '4 days',now()-interval '49 hours')",[pageA]);
  await t.test("visitors see active/recent-completed jobs, never drafts or old completions",async()=>{
   const titles=(await actor(null,tx=>tx.query("select title from public.haldoz_jobs order by title"))).rows.map(r=>r.title);
   assert.deepEqual(titles,["Available job","Recent completed"]);
   assert.equal((await actor(b,tx=>tx.query("select * from public.haldoz_jobs where id=$1",[draft]))).rows.length,0);
   assert.equal((await actor(a,tx=>tx.query("select * from public.haldoz_jobs"))).rows.length,4);
  });
  await t.test("non-owner cannot insert jobs for another page or update drafts",async()=>{
   await assert.rejects(()=>actor(b,tx=>tx.query("insert into public.haldoz_jobs(page_id,title,city) values ($1,'Attack','هەولێر')",[pageA])),/row-level security/);
   assert.equal((await actor(b,tx=>tx.query("update public.haldoz_jobs set title='Attack' where id=$1 returning id",[draft]))).rows.length,0);
  });
  await t.test("jobs cannot move between owners and unknown salary is never fabricated",async()=>{
   await assert.rejects(()=>actor(a,tx=>tx.query("update public.haldoz_jobs set page_id=$1 where id=$2",[pageB,draft])),/permission denied/);
   await assert.rejects(()=>actor(a,tx=>tx.query("update public.haldoz_jobs set salary_mode='fixed' where id=$1",[draft])),/check constraint/);
  });
  await t.test("future scheduled active jobs are not public and archived jobs stay private",async()=>{
   await db.query("insert into public.haldoz_jobs(page_id,title,city,status,published_at) values ($1,'Future job','هەولێر','active',now()+interval '1 day'),($1,'Archived job','هەولێر','archived',now())",[pageA]);
   assert.equal((await actor(null,tx=>tx.query("select * from public.haldoz_jobs where title in ('Future job','Archived job')"))).rows.length,0);
  });

  await t.test("validated draft payload saves and reloads without any public visibility",async()=>{
   const parsed=validateDraft({...blankDraft,title:"ڕەشنووسی تاقیکردنەوە",city:"هەولێر",salary_mode:"fixed",salary:"۶۵۰۰۰۰",start_time:"22:00",end_time:"06:00",shift:"night",description:"Synthetic description",page_id:pageB,status:"active",published_at:"now"});
   assert.deepEqual(parsed.errors,{});const fields=draftWriteFields(parsed.draft);
   const saved=(await actor(a,tx=>tx.query("insert into public.haldoz_jobs(page_id,title,city,description,salary_mode,salary,start_time,end_time,shift,status) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning id",[pageA,fields.title,fields.city,fields.description,fields.salary_mode,fields.salary,fields.start_time,fields.end_time,fields.shift,fields.status]))).rows[0];
   const reloaded=(await actor(a,tx=>tx.query("select * from public.haldoz_jobs where page_id=$1 and id=$2 and status='draft'",[pageA,saved.id]))).rows[0];
   assert.equal(reloaded.salary,650000);assert.equal(reloaded.published_at,null);assert.equal(reloaded.status,"draft");assert.equal(reloaded.start_time,"22:00:00");
   for(const identity of [null,b])assert.equal((await actor(identity,tx=>tx.query("select id from public.haldoz_jobs where id=$1",[saved.id]))).rows.length,0);
  });
  await t.test("owner draft editing is denied to another owner and anonymous-auth identities",async()=>{
   for(const [identity,anonymous] of [[b,false],[a,true]])assert.equal((await actor(identity,tx=>tx.query("update public.haldoz_jobs set title='Forged edit' where page_id=$1 and id=$2 and status='draft' returning id",[pageA,draft]),anonymous)).rows.length,0);
   const edited=await actor(a,tx=>tx.query("update public.haldoz_jobs set title='Edited draft',description='Changed',salary_mode='negotiable',salary=null where page_id=$1 and id=$2 and status='draft' returning title,salary",[pageA,draft]));
   assert.equal(edited.rows[0].title,"Edited draft");assert.equal(edited.rows[0].salary,null);
  });
  await t.test("stale draft editor cannot overwrite a record that became active",async()=>{
   const active=(await actor(a,tx=>tx.query("select id from public.haldoz_jobs where title='Available job'"))).rows[0].id;
   const result=await actor(a,tx=>tx.query("update public.haldoz_jobs set title='Stale draft',status='draft' where page_id=$1 and id=$2 and status='draft' returning id",[pageA,active]));
   assert.equal(result.rows.length,0);assert.equal((await actor(null,tx=>tx.query("select title from public.haldoz_jobs where id=$1",[active]))).rows[0].title,"Available job");
  });
  await t.test("first-release owners cannot publish or alter publication metadata through direct API grants",async()=>{
   await assert.rejects(()=>actor(a,tx=>tx.query("update public.haldoz_jobs set status='active',published_at=now() where id=$1",[draft])),/permission denied/);
   await assert.rejects(()=>actor(a,tx=>tx.query("insert into public.haldoz_jobs(page_id,title,city,status) values ($1,'Bypass','هەولێر','archived')",[pageA])),/row-level security/);
   assert.equal((await actor(a,tx=>tx.query("update public.haldoz_jobs set title='Changed active' where title='Available job' returning id"))).rows.length,0);
  });
 } finally { await db.close(); }
});
