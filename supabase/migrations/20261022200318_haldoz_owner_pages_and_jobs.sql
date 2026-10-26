-- LOCAL REVIEW ONLY. Do not apply until shared-project preflight and owner approval.
-- No Expo migrations, existing object replacements, auth triggers, buckets or default-privilege changes.
begin;
create table public.haldoz_owner_pages (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique default auth.uid() references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);
create table public.haldoz_pages (
  id uuid primary key references public.haldoz_owner_pages(id) on delete cascade,
  handle text not null unique check (handle ~ '^[a-z0-9][a-z0-9-]{1,30}[a-z0-9]$'
    and handle not in ('admin','api','auth','create','dashboard','favorites','haldoz','help','jobs','login','owner','p','page-setup','preview','settings','support','www')),
  display_name text not null check (char_length(btrim(display_name)) between 2 and 80),
  bio text not null default '' check (char_length(bio) <= 500),
  city text not null check (city in ('هەولێر','سلێمانی','دهۆک','هەڵەبجە','کەرکووک','شارێکی تر')),
  public_phone text not null check (public_phone ~ '^\+[1-9][0-9]{7,14}$'),
  public_whatsapp text check (public_whatsapp ~ '^\+[1-9][0-9]{7,14}$'),
  brand_tone text not null default 'blue' check (brand_tone in ('blue','teal','violet')),
  created_at timestamptz not null default now(),
  constraint haldoz_same_public_number check (public_whatsapp is null or public_whatsapp = public_phone)
);
create table public.haldoz_jobs (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.haldoz_pages(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 2 and 120),
  description text not null default '' check (char_length(description) <= 4000),
  city text not null check (char_length(btrim(city)) between 2 and 80),
  salary integer check (salary >= 0),
  salary_mode text not null default 'unspecified' check (salary_mode in ('fixed','negotiable','unspecified')),
  start_time time,
  end_time time,
  shift text not null default 'unspecified' check (shift in ('morning','evening','night','flexible','unspecified')),
  status text not null default 'draft' check (status in ('draft','active','worker_found','archived')),
  published_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint haldoz_job_salary_truth check ((salary_mode = 'fixed') = (salary is not null)),
  constraint haldoz_job_hours_pair check ((start_time is null) = (end_time is null)),
  constraint haldoz_job_publication check (status not in ('active','worker_found') or published_at is not null),
  constraint haldoz_job_completion check ((status = 'worker_found') = (completed_at is not null))
);
create index haldoz_jobs_owner_lookup on public.haldoz_jobs(page_id);
create index haldoz_jobs_publication on public.haldoz_jobs(published_at desc, id) where status = 'active';
create index haldoz_jobs_completion on public.haldoz_jobs(completed_at desc) where status = 'worker_found';
alter table public.haldoz_owner_pages enable row level security;
alter table public.haldoz_pages enable row level security;
alter table public.haldoz_jobs enable row level security;
revoke all on public.haldoz_owner_pages, public.haldoz_pages, public.haldoz_jobs from public, anon, authenticated;
grant select on public.haldoz_owner_pages to authenticated;
grant insert (id) on public.haldoz_owner_pages to authenticated;
grant select on public.haldoz_pages to anon, authenticated;
grant insert (id,handle,display_name,bio,city,public_phone,public_whatsapp,brand_tone) on public.haldoz_pages to authenticated;
grant update (display_name,bio,city,public_phone,public_whatsapp,brand_tone) on public.haldoz_pages to authenticated;
grant select on public.haldoz_jobs to anon, authenticated;
-- This first release only permits draft writes. Publishing needs a separately reviewed change.
grant insert (page_id,title,description,city,salary,salary_mode,start_time,end_time,shift,status) on public.haldoz_jobs to authenticated;
grant update (title,description,city,salary,salary_mode,start_time,end_time,shift,status) on public.haldoz_jobs to authenticated;
create policy haldoz_owner_read on public.haldoz_owner_pages for select to authenticated
  using (owner_id = (select auth.uid()) and not coalesce((select auth.jwt()->>'is_anonymous')::boolean, false));
create policy haldoz_owner_insert on public.haldoz_owner_pages for insert to authenticated
  with check (owner_id = (select auth.uid()) and not coalesce((select auth.jwt()->>'is_anonymous')::boolean, false));
create policy haldoz_page_public_read on public.haldoz_pages for select to anon, authenticated using (true);
create policy haldoz_page_owner_insert on public.haldoz_pages for insert to authenticated
  with check (exists (select 1 from public.haldoz_owner_pages own where own.id = haldoz_pages.id));
create policy haldoz_page_owner_update on public.haldoz_pages for update to authenticated
  using (exists (select 1 from public.haldoz_owner_pages own where own.id = haldoz_pages.id))
  with check (exists (select 1 from public.haldoz_owner_pages own where own.id = haldoz_pages.id));
create policy haldoz_job_public_read on public.haldoz_jobs for select to anon, authenticated
  using ((status = 'active' and published_at <= now())
    or (status = 'worker_found' and completed_at <= now() and completed_at > now() - interval '48 hours'));
create policy haldoz_job_owner_read on public.haldoz_jobs for select to authenticated
  using (exists (select 1 from public.haldoz_owner_pages own where own.id = haldoz_jobs.page_id));
create policy haldoz_job_owner_insert on public.haldoz_jobs for insert to authenticated
  with check (status = 'draft' and published_at is null and completed_at is null
    and exists (select 1 from public.haldoz_owner_pages own where own.id = haldoz_jobs.page_id));
create policy haldoz_job_owner_update on public.haldoz_jobs for update to authenticated
  using (status = 'draft' and exists (select 1 from public.haldoz_owner_pages own where own.id = haldoz_jobs.page_id))
  with check (status = 'draft' and published_at is null and completed_at is null
    and exists (select 1 from public.haldoz_owner_pages own where own.id = haldoz_jobs.page_id));
-- Atomic creation under the caller's grants/RLS. No SECURITY DEFINER or admin key.
create function public.haldoz_create_page(page_handle text, page_name text, page_bio text, page_city text, page_phone text, page_whatsapp text, page_tone text)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare new_id uuid;
begin
  if auth.uid() is null or coalesce((auth.jwt()->>'is_anonymous')::boolean, false) then
    raise exception 'Signed-in owner required' using errcode = '42501';
  end if;
  insert into public.haldoz_owner_pages default values returning id into new_id;
  insert into public.haldoz_pages(id,handle,display_name,bio,city,public_phone,public_whatsapp,brand_tone)
    values (new_id,page_handle,page_name,coalesce(page_bio,''),page_city,page_phone,page_whatsapp,page_tone);
  return new_id;
end;
$$;
revoke all on function public.haldoz_create_page(text,text,text,text,text,text,text) from public, anon, authenticated, service_role;
grant execute on function public.haldoz_create_page(text,text,text,text,text,text,text) to authenticated;
commit;
