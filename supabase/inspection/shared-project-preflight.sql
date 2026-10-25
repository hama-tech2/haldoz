-- Read-only metadata/count inspection for the owner-confirmed project only:
-- wickyjtjhgfzntifuzac. Do not paste credentials or export user records.
begin read only;
select current_database() as database_name, version() as postgres_version;
select n.nspname as schema_name, c.relname as object_name, c.relkind, c.relrowsecurity
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where n.nspname not in ('pg_catalog','information_schema') and n.nspname not like 'pg_toast%'
  and c.relkind in ('r','p','v','m') order by 1,2;
select count(*) as public_tables from information_schema.tables where table_schema='public' and table_type='BASE TABLE';
select count(*) as registered_auth_users from auth.users;
select count(*) as storage_buckets from storage.buckets;
select to_regclass('supabase_migrations.schema_migrations') as migration_history_relation;
-- If that relation exists, separately SELECT count(*) FROM supabase_migrations.schema_migrations;
select p.oid::regprocedure as signature, pg_get_userbyid(p.proowner) as owner,
 p.prorettype::regtype as returns_type, p.prosecdef, p.proconfig,
 has_function_privilege('anon',p.oid,'EXECUTE') as anon_execute,
 has_function_privilege('authenticated',p.oid,'EXECUTE') as authenticated_execute,
 pg_get_functiondef(p.oid) as function_definition
from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public' and (p.proname='rls_auto_enable' or p.prosecdef);
select e.evtname,e.evtevent,e.evtenabled,e.evtfoid::regprocedure as function_signature from pg_event_trigger e;
select p.oid::regprocedure as haldoz_collision from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public' and p.proname like 'haldoz_%';
commit;
-- Also inspect project status, API exposure, Auth Google provider/redirect allowlist and advisors
-- via the existing read-only management connection. Public REST success cannot prove these counts.
