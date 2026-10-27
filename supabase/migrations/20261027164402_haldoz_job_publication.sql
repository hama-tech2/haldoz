-- REVIEW ONLY: requires separate owner approval before any hosted execution.
-- Extends existing Haldoz jobs only; preserves pages, ownership, Auth and shared helpers.
begin;
set local lock_timeout = '5s';
set local statement_timeout = '30s';

alter table public.haldoz_jobs
  add column workplace text not null default '',
  add column placement_fee_mode text not null default 'unspecified',
  add column placement_fee numeric,
  add column placement_fee_terms text not null default '',
  add column revision integer not null default 1,
  add constraint haldoz_job_workplace check (char_length(workplace) <= 200),
  add constraint haldoz_job_fee_mode check (placement_fee_mode in ('unspecified','none','fixed','percentage')),
  add constraint haldoz_job_fee_truth check (
    (placement_fee_mode in ('unspecified','none') and placement_fee is null)
    or (placement_fee_mode = 'fixed' and placement_fee is not null and placement_fee > 0 and placement_fee <= 2147483647 and trunc(placement_fee) = placement_fee)
    or (placement_fee_mode = 'percentage' and placement_fee is not null and placement_fee > 0 and placement_fee <= 100 and scale(placement_fee) <= 2)),
  add constraint haldoz_job_fee_terms check (char_length(placement_fee_terms) <= 500),
  add constraint haldoz_job_revision check (revision > 0),
  add constraint haldoz_job_ready_to_publish check (status not in ('active','worker_found') or (
    char_length(btrim(workplace)) between 2 and 200
    and char_length(btrim(description)) between 10 and 4000
    and salary_mode in ('fixed','negotiable') and (salary_mode <> 'fixed' or salary > 0)
    and placement_fee_mode <> 'unspecified'
    and (placement_fee_mode not in ('fixed','percentage') or char_length(btrim(placement_fee_terms)) between 5 and 500)));

-- Filled jobs immediately stop being publicly readable, including through direct Data API requests.
alter policy haldoz_job_public_read on public.haldoz_jobs
  using (status = 'active' and published_at <= now());
alter policy haldoz_job_owner_update on public.haldoz_jobs
  using (exists (select 1 from public.haldoz_owner_pages own where own.id = haldoz_jobs.page_id))
  with check (exists (select 1 from public.haldoz_owner_pages own where own.id = haldoz_jobs.page_id));

grant insert (workplace,placement_fee_mode,placement_fee,placement_fee_terms) on public.haldoz_jobs to authenticated;
grant update (workplace,placement_fee_mode,placement_fee,placement_fee_terms) on public.haldoz_jobs to authenticated;
-- No grants for timestamps, revision, page_id reassignment, DELETE, or privileged roles.

create function public.haldoz_guard_job_write()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    if new.status <> 'draft' then
      raise exception 'Create a draft before publishing' using errcode = '23514';
    end if;
    new.published_at := null;
    new.completed_at := null;
    new.revision := 1;
  else
    if new.id <> old.id or new.page_id <> old.page_id or new.created_at <> old.created_at then
      raise exception 'Job identity is immutable' using errcode = '23514';
    end if;
    if old.status in ('worker_found','archived') then
      raise exception 'Closed jobs cannot be edited or reopened' using errcode = '23514';
    end if;
    if new.status <> old.status and not (
      (old.status = 'draft' and new.status = 'active')
      or (old.status = 'active' and new.status in ('worker_found','archived'))
    ) then
      raise exception 'Invalid job transition' using errcode = '23514';
    end if;
    new.published_at := case when old.status = 'draft' and new.status = 'active' then now() else old.published_at end;
    new.completed_at := case when new.status = 'worker_found' then now() else null end;
    new.revision := old.revision + 1;
  end if;
  return new;
end;
$$;
revoke all on function public.haldoz_guard_job_write() from public, anon, authenticated, service_role;
create trigger haldoz_job_write_guard before insert or update on public.haldoz_jobs
  for each row execute function public.haldoz_guard_job_write();

-- Caller identity, RLS and column grants apply throughout. Never SECURITY DEFINER.
create function public.haldoz_save_job(job_id uuid, expected_revision integer, job_payload jsonb)
returns table(id uuid, revision integer, status text)
language plpgsql security invoker set search_path = '' as $$
declare
  owned_page uuid;
  saved public.haldoz_jobs%rowtype;
begin
  if auth.uid() is null or coalesce((auth.jwt()->>'is_anonymous')::boolean,false) then
    raise exception 'Signed-in owner required' using errcode = '42501';
  end if;
  select own.id into owned_page from public.haldoz_owner_pages own where own.owner_id = auth.uid();
  if owned_page is null then raise exception 'Owner page required' using errcode = '42501'; end if;
  if jsonb_typeof(job_payload) is distinct from 'object' then
    raise exception 'Invalid job input' using errcode = '22023';
  end if;
  if job_id is null then
    insert into public.haldoz_jobs(page_id,title,city,description,salary_mode,salary,start_time,end_time,shift,workplace,placement_fee_mode,placement_fee,placement_fee_terms)
    values (owned_page,btrim(coalesce(job_payload->>'title','')),btrim(coalesce(job_payload->>'city','')),
      btrim(coalesce(job_payload->>'description','')),coalesce(job_payload->>'salary_mode','unspecified'),
      (job_payload->>'salary')::integer,(job_payload->>'start_time')::time,(job_payload->>'end_time')::time,
      coalesce(job_payload->>'shift','unspecified'),btrim(coalesce(job_payload->>'workplace','')),
      coalesce(job_payload->>'placement_fee_mode','unspecified'),(job_payload->>'placement_fee')::numeric,
      btrim(coalesce(job_payload->>'placement_fee_terms','')))
    returning * into saved;
  else
    update public.haldoz_jobs j set
      title=btrim(coalesce(job_payload->>'title','')),city=btrim(coalesce(job_payload->>'city','')),
      description=btrim(coalesce(job_payload->>'description','')),salary_mode=coalesce(job_payload->>'salary_mode','unspecified'),
      salary=(job_payload->>'salary')::integer,start_time=(job_payload->>'start_time')::time,end_time=(job_payload->>'end_time')::time,
      shift=coalesce(job_payload->>'shift','unspecified'),workplace=btrim(coalesce(job_payload->>'workplace','')),
      placement_fee_mode=coalesce(job_payload->>'placement_fee_mode','unspecified'),placement_fee=(job_payload->>'placement_fee')::numeric,
      placement_fee_terms=btrim(coalesce(job_payload->>'placement_fee_terms',''))
    where j.id=job_id and j.page_id=owned_page and j.revision=expected_revision and j.status in ('draft','active')
    returning * into saved;
  end if;
  if saved.id is null then raise exception 'Job changed or unavailable' using errcode = '40001'; end if;
  return query select saved.id,saved.revision,saved.status;
end;
$$;
revoke all on function public.haldoz_save_job(uuid,integer,jsonb) from public, anon, authenticated, service_role;
grant execute on function public.haldoz_save_job(uuid,integer,jsonb) to authenticated;

create function public.haldoz_change_job_status(job_id uuid, expected_revision integer, target_status text)
returns table(id uuid, revision integer, status text)
language plpgsql security invoker set search_path = '' as $$
declare saved public.haldoz_jobs%rowtype;
begin
  if auth.uid() is null or coalesce((auth.jwt()->>'is_anonymous')::boolean,false) then
    raise exception 'Signed-in owner required' using errcode = '42501';
  end if;
  if target_status not in ('active','worker_found') or target_status is null then
    raise exception 'Invalid job status' using errcode = '22023';
  end if;
  update public.haldoz_jobs j set status=target_status
    where j.id=job_id and j.revision=expected_revision
      and ((target_status='active' and j.status='draft') or (target_status='worker_found' and j.status='active'))
      and exists (select 1 from public.haldoz_owner_pages own where own.id=j.page_id and own.owner_id=auth.uid())
    returning * into saved;
  if saved.id is null then raise exception 'Job changed or unavailable' using errcode = '40001'; end if;
  return query select saved.id,saved.revision,saved.status;
end;
$$;
revoke all on function public.haldoz_change_job_status(uuid,integer,text) from public, anon, authenticated, service_role;
grant execute on function public.haldoz_change_job_status(uuid,integer,text) to authenticated;
commit;
