-- PROPOSAL ONLY, NOT A MIGRATION TO APPLY AUTOMATICALLY.
-- Requires hosted definition/return-type/event-trigger/ACL inspection and explicit owner approval.
-- If confirmed to be the standard internal zero-argument event-trigger function:
begin;
do $$
declare target regprocedure := to_regprocedure('public.rls_auto_enable()');
begin
  if target is null then raise exception 'Expected function missing; stop for fresh review'; end if;
  if not exists (select 1 from pg_proc where oid=target and prorettype='event_trigger'::regtype and prosecdef) then
    raise exception 'Unexpected function type; stop for fresh review';
  end if;
  execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
end;
$$;
commit;
-- Do not drop/replace the function, remove its event trigger, or change search_path blindly.
-- Verify event-trigger behavior and advisors after an approved change. This file has NOT run hosted.
