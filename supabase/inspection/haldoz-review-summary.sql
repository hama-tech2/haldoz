select jsonb_pretty(jsonb_build_object(
 'project_check','wickyjtjhgfzntifuzac',
 'public_tables',(select count(*) from information_schema.tables where table_schema='public' and table_type='BASE TABLE'),
 'auth_users_count',(select count(*) from auth.users),
 'google_identities_count',(select count(*) from auth.identities where provider='google'),
 'storage_buckets_count',(select count(*) from storage.buckets),
 'migration_history_relation',to_regclass('supabase_migrations.schema_migrations'),
 'haldoz_relations',(select coalesce(jsonb_agg(c.relname),'[]'::jsonb) from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname like 'haldoz_%'),
 'haldoz_functions',(select coalesce(jsonb_agg(p.oid::regprocedure::text),'[]'::jsonb) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname like 'haldoz_%'),
 'rls_auto_enable',(select coalesce(jsonb_agg(jsonb_build_object('signature',p.oid::regprocedure::text,'owner',pg_get_userbyid(p.proowner),'returns',p.prorettype::regtype::text,'security_definer',p.prosecdef,'config',p.proconfig,'acl',p.proacl,'anon_execute',has_function_privilege('anon',p.oid,'EXECUTE'),'authenticated_execute',has_function_privilege('authenticated',p.oid,'EXECUTE'),'definition',pg_get_functiondef(p.oid))),'[]'::jsonb) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname='rls_auto_enable'),
 'event_triggers',(select coalesce(jsonb_agg(jsonb_build_object('name',evtname,'event',evtevent,'enabled',evtenabled,'function',evtfoid::regprocedure::text)),'[]'::jsonb) from pg_event_trigger),
 'public_schema_usage',jsonb_build_object('anon',has_schema_privilege('anon','public','USAGE'),'authenticated',has_schema_privilege('authenticated','public','USAGE'))
)) as readonly_preflight;
