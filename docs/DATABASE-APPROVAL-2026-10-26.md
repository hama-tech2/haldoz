# Haldoz database change for owner approval
Status: PREPARED LOCALLY, NOT APPLIED.

## Exact file
supabase/migrations/20261022200318_haldoz_owner_pages_and_jobs.sql
Reviewed SHA-256: 8141BA8ED3E60EFF0C717046A51722CAD042EB2067C476886FF57D2855FD5FC7

This updates the previously UNAPPLIED recovered proposal. Its old A618B206... hash belongs to the preserved recovery version and must not be confused with this reviewed revision.
Do not run a blanket migration push. Apply only the reviewed transaction after explicit approval and the execution gates below.

## Impact
Creates exactly three namespaced tables: haldoz_owner_pages (private ownership), haldoz_pages (deliberately public profile/contact fields), and haldoz_jobs (owner drafts).
Creates their indexes, explicit column grants/RLS policies and one atomic SECURITY INVOKER haldoz_create_page RPC with an empty search_path.
Ownership derives from verified auth.uid(), excludes anonymous-auth identities, and cannot be submitted/reassigned by a browser. Handles are unique and immutable; one page per owner.
The single public phone must be canonical international format. Optional WhatsApp must equal that phone.
Initial owner creation is atomic: duplicate handle or invalid data rolls back the ownership insertion too.
Only rightful owners can edit their public fields or save drafts. Guests/other owners cannot mutate them. Public reads omit Google identity/email.
Owners cannot publish or alter publication timestamps through this initial proposal. Older prepared publication states/read policies remain for compatibility but have no owner publication grant.
No existing application object is replaced. No Auth provider/redirect change, auth.users modification, storage bucket, paid service, default-grant change, event-trigger edit or helper hardening is included.
Name collisions deliberately fail rather than overwrite.

## Fresh read-only preflight
The target project has no public tables, recorded migrations, Haldoz relations or Haldoz RPC.
The existing public.rls_auto_enable() is a postgres-owned SECURITY DEFINER event-trigger helper, search_path=pg_catalog, attached as ensure_rls to ddl_command_end. Effective EXECUTE is currently available to anon/authenticated.
The two advisor warnings are real and unresolved. Its event_trigger return type matters: warnings alone are not a demonstrated arbitrary-call exploit.
Fresh metadata also confirms public schema USAGE for both API roles and broad inherited default table/function grants. The migration explicitly revokes inherited table/function access before granting its narrow API permissions; the local PostgreSQL suite now recreates those hosted defaults before exercising every policy.
This migration neither fixes nor changes that shared helper. Its conditional hardening proposal remains separate and unapplied.
Schema/function/ACL/event-trigger baseline must be retained privately before execution. Verify a usable platform backup/export and restore path; platform backup availability has not yet been independently confirmed.

## Execution and acceptance gates
1. Reconfirm the exact project, no collisions, this SQL hash and private preflight baseline.
2. Verify backup/restore availability. Never export credentials or personal Auth rows into public Git.
3. Obtain explicit approval for this exact three-table scope. Do not infer approval from local testing or a Git push.
4. Apply only this transaction; stop on error and inspect whether it committed or rolled back. Preserve all existing objects/Auth configuration.
5. Verify metadata and public API grants, then test owner A create/save/reload/edit, returning-owner routing, anonymous public profile, duplicate-handle atomicity and non-owner B denial using approved test identities.
6. Keep pages readiness off until those hosted tests pass; then enable it only in the approved environment.
7. Before production, close the outstanding Google-secret rotation handoff privately and review shared-helper warnings separately. Never read/reveal client secrets.

## Recovery
Before COMMIT, PostgreSQL rolls this transaction back on failure.
After real records exist, application rollback means disabling page writes/readiness and rolling back application code to an approved version while preserving data.
Do not automatically DROP tables or delete Auth users as rollback. Export new Haldoz data privately and obtain separate approval for any destructive remediation.
A source ZIP is not a hosted database backup.
