# Approved hosted Haldoz migration — 27 October 2026

## Result and identity
Applied only the owner-approved SQL to Supabase project wickyjtjhgfzntifuzac (dashboard name kurdish-jobs, eu-central-1, ACTIVE_HEALTHY). This is the explicitly confirmed backend for Haldoz.
The source is supabase/migrations/20261022200318_haldoz_owner_pages_and_jobs.sql, SHA-256 8141BA8ED3E60EFF0C717046A51722CAD042EB2067C476886FF57D2855FD5FC7.
The file remains unchanged from approved checkpoint a5086c6.

Supabase MCP applied the exact transaction and returned success. Its migration service assigned execution version **20261027074958**, name haldoz_owner_pages_and_jobs. The reviewed source version remains **20261022200318**.
The single stored statement has 7,357 characters; its MD5 c5fac3c9f5fcb4b8102a3669d5c42b60 matches the local SQL text, including line endings. The pre-execution SHA-256 above remains the approval identifier.
**Do not run a blanket CLI migration push:** the local filename and hosted execution version differ. Reconcile migration history through a separately reviewed, non-destructive procedure before any future CLI push. Do not apply the same SQL again or rename the approved recovery file automatically.

## Fresh verification
Immediately before execution: zero public tables, no haldoz_* relation/function conflicts, no migration history, two existing Auth users.
Immediately afterward:
- Exactly haldoz_owner_pages, haldoz_pages and haldoz_jobs exist in public; all three have RLS enabled and all nine reviewed policies are present.
- The page-creation function is SECURITY INVOKER with an empty search_path. Authenticated callers can execute it; anon cannot.
- Anonymous public profile/job SELECT is permitted. Anonymous private ownership SELECT is denied.
- Authenticated callers cannot reassign owner_id, change handles, delete jobs or write published_at. Profile-edit column grants are present.
- The ownership FK is ON DELETE RESTRICT: an Auth user who later owns a page cannot be deleted until that relationship is addressed under separate approval.
- Public ownership/pages/jobs row counts are all zero. No profile or job fixture was inserted.
- Auth user count remains two. The existing rls_auto_enable function definition, event-trigger metadata and default ACLs match the pre-execution baseline.
- Security advisor has the same three existing warnings: anon/authenticated EXECUTE on the shared SECURITY DEFINER event-trigger helper, and leaked-password protection disabled. No automatic hardening was performed.

Real anonymous PostgREST requests, using only the existing private publishable-key configuration:
- haldoz_pages: HTTP 200, zero rows.
- haldoz_jobs: HTTP 200, zero rows.
- haldoz_owner_pages: HTTP 401, PostgreSQL permission code 42501.
No key, token, password, Auth row or private contact appears in this report.

These are actual hosted metadata/anonymous API checks. They do not establish real signed-in owner/non-owner JWT isolation or successful Page Setup persistence. The prior synthetic PostgreSQL authorization tests remain local evidence, not a replacement.

## Recovery decision
The owner explicitly accepted the absence of a verified full restorable backup before this additive migration. No database export or restore rehearsal is claimed.
The Free project had no accessible dashboard restore point. Standard CLI export was not ready: no authenticated CLI/direct database access and no available Docker/pg_dump/psql in the inspected standard locations. MCP metadata is not a full Auth/data backup.
Official guidance: https://supabase.com/docs/guides/platform/backups and https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore . Default CLI schema exports have managed-schema/data coverage limits: https://supabase.com/docs/reference/cli/supabase-db-dump .
On any application problem, leave hosted data intact and keep writes disabled. No automatic DROP/reset/restore is authorized.

## Acceptance blocker and stop
The existing Next 16.4.2 production build started on 127.0.0.1:3100 and reported Ready, with HALDOZ_PAGES_READY=true only in that test process.
The real browser could not open /page-setup (net::ERR_CONNECTION_TIMED_OUT). A local command first received EACCES; its approved unrestricted read-only retry also timed out. The cause is not fully diagnosed; this is not proof of an application failure.
Per the owner's stop-on-unexpected-problem instruction, no save, auth-user modification, publishing, code implementation, deployment or main merge followed. The tool-owned test server was stopped. The saved environment readiness gate remains unchanged.
No new application test run was needed because application source did not change.

## Next step
Resolve the local preview reachability and complete Page Setup -> save -> reload -> My Page -> edit using the owner's intended real public fields and Google session. Check a separate real non-owner session before enabling general use. Do not consume the owner's one-page immutable handle with an invented test profile.
Publishing remains a separate local implementation and separately approved database change. Public discovery still uses clearly labeled development fixtures at this checkpoint; it is not launch-ready. No job publication is authorized.
Workers remains a local vinext candidate; no resource or release change occurred. Follow current official requirements at https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/ . Static GitHub Pages cannot serve this app's cookie-dependent server actions: https://nextjs.org/docs/app/guides/static-exports .
