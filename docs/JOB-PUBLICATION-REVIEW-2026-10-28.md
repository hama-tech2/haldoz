# Owner jobs: local implementation and migration review

28 October 2026 (Asia/Baghdad). Local implementation only; no hosted SQL, merge or deployment in this milestone.

## Implemented

The existing Add Job/Edit/Review workflow now supports explicit workplace, monthly salary or negotiation, working hours, and agency placement fees (none, fixed IQD or percentage with basis/payment terms). Public contact comes from the owner's saved page: Call and optional same-number WhatsApp. Haldoz itself remains free.

With the new schema explicitly enabled, saves use an invoker RPC with optimistic revision checks. Drafts may be incomplete; publishing requires workplace, conditions, salary disclosure and fee disclosure. Published jobs can be edited while retaining their publication date. Review includes a confirmation before publishing or marking a job filled. Closed jobs cannot be reopened or edited. Saved replies must match the job, expected status and next revision; failures never report success.

The owner dashboard shows drafts, available and closed jobs. Available jobs appear on My Page, the public profile, /jobs, /favorites and /jobs/[id]. Public routes use a fresh anonymous client even when the viewer is signed in. Discovery no longer imports fictional jobs. Real favorites have separate browser storage from historical fixtures.

Filled jobs are excluded from application queries and, after the reviewed SQL, the database's public-read policy. Public reads are uncached. Already-open visible pages refresh every 30 seconds and on focus/return; a currently rendered screen can therefore remain stale until that refresh/network response. An offline screen cannot be revoked remotely. Owner records remain accessible privately.

Current limits: latest 200 public jobs (including the favorites candidate list), latest 50 owner jobs; no server pagination yet. Stored favorite IDs are retained when no longer available. Existing one-page-per-owner and immutable handle rules remain. No job-specific phone, image upload, applicant workflow or payment collection was added. Sorani copy still needs fluent owner review.

## Exact hosted approval scope — NOT APPLIED

Project: `wickyjtjhgfzntifuzac` (the owner-approved existing Haldoz backend).

File: `supabase/migrations/20261027164402_haldoz_job_publication.sql`

SHA-256: `D4BE1E8568BC9F1BF0707F68BCD3A0E93046601D23E1008EAB40D83EB20589A4`

This single transaction:

- Adds workplace, placement_fee_mode, placement_fee, placement_fee_terms and revision to existing `public.haldoz_jobs`, with validation constraints/defaults.
- Changes only the jobs public-read policy to active, already-published jobs; changes the jobs owner-update policy to permit owned active-job updates under the existing private ownership RLS.
- Grants authenticated users insert/update access to the new content fields. Does not grant timestamp, revision or ownership updates or DELETE.
- Adds one jobs-only BEFORE INSERT/UPDATE trigger and its SECURITY INVOKER function. It stamps publication/completion dates and increments revisions, rejects invalid transitions, identity changes and edits/reopening of closed jobs.
- Adds authenticated-only SECURITY INVOKER RPCs `haldoz_save_job(uuid,integer,jsonb)` and `haldoz_change_job_status(uuid,integer,text)`, each with an empty search_path. Existing ownership checks, verified identity and RLS remain mandatory.

No tables are recreated. No page/ownership/Auth rows or settings, shared helpers/default grants, unrelated schemas, storage or deployments are changed. This changes the **permissions and allowed states of existing/future Haldoz job rows**. Existing draft rows would receive empty/unspecified defaults and revision 1; they must be completed before publication. Existing active/filled jobs without required details would make the transaction fail and roll back. Stop for review if such rows appear; do not backfill/delete them automatically. Transaction lock/statement timeouts are 5/30 seconds.

Read-only hosted verification: one ownership row, one page, zero jobs, RLS enabled on all three tables, none of the five new columns present. Only migration `20261027074958_haldoz_owner_pages_and_jobs` was applied. Counts must be checked again immediately before any future execution.

The initial source SQL `20261022200318_haldoz_owner_pages_and_jobs.sql` remains unchanged (SHA-256 `8141BA8ED3E60EFF0C717046A51722CAD042EB2067C476886FF57D2855FD5FC7`). Its hosted execution version differs from its filename. Never blindly run `db push`, reapply the initial SQL, or repair history automatically. Apply only the exact newly approved transaction through the reviewed migration mechanism, recording the actual assigned history version and checksum.

## Recovery and activation gates

A full restorable backup is still **not verified**. Existing recovery archives and source checkpoints remain preserved; none is represented as a full hosted database backup. The prior backup-risk approval covered the initial migration only.

The new SQL is narrowly scoped and additive to an observed zero-job table, but it changes grants, a trigger and RLS; approval is still required. Before execution, independently recheck project identity, exact hash, job count/statuses, column/function/trigger conflicts, policies/grants and shared event-trigger state. Unexpected differences require stopping. Retain private schema/security metadata and available backup evidence outside Git. Do not dump private rows into this repository.

`HALDOZ_JOBS_READY` remains unset/false. Existing legacy draft saving continues against the applied schema; the new fields and publish controls remain unavailable. Do not enable this flag before successful migration and policy/RPC verification. `HALDOZ_PAGES_READY=true` is a process-only setting for the current local preview; ignored .env.local was not overwritten. Both flags are availability gates, never substitutes for authentication.

After separately approved execution, verify using actual owner and independent non-owner sessions: save/reload draft, edit, reject stale revision, review/publish, read public profile/detail without cookies, edit active job, mark filled, then confirm it disappears from fresh public discovery/detail reads and cannot be changed by another owner. Local tests do not establish those hosted JWT/PostgREST results. Do not publish a fictional job as part of public launch.

If the transaction fails, PostgreSQL rolls it back. After a successful migration, a safe containment step is to disable new publishing in application configuration; **that does not revoke direct API permissions**. Any policy/grant rollback or restrictive hotfix needs separate reviewed approval. Do not drop columns or restore over hosted data automatically. A realistic full restore remains dependent on a separately verified private backup.

## Verified evidence

- 89 automated tests passed: existing baseline plus publication validation, application actions/receipts, anonymous public loader and actual local PostgreSQL/PGlite policy/trigger/RPC tests with two synthetic owners and anonymous roles.
- PGlite executed both SQL files and verified create/reload/edit/publish/fill, public availability, stale-write rejection, non-owner/anonymous denial, grants, preservation of page/Auth fixtures and unchanged shared helper privileges. This is not a hosted JWT test or a real multi-connection concurrency test.
- Lint, TypeScript, Next.js production build, vinext/Workers build and all four local Workers HTTP scripts passed. Existing vinext sourcemap/dynamic-import warnings remain; no dependency upgrade was performed.
- Next production HTTP checks passed with pages enabled and jobs disabled, including native unauthenticated draft/publish/fill action denial, no-store public responses, missing-job 404 and no fictional discovery jobs. The missing-profile assertion was corrected to expect 404 when the database is enabled, rather than the disabled-database service screen.
- The existing real public page was fetched anonymously twice; saved contact fingerprints matched and no owner controls leaked. No hosted rows were created, edited or published.
- Current real browser at 390px: browser-only draft saved, reloaded, edited and reviewed; invalid 101% fee rejected, Kurdish digits normalized in review, workplace/salary/fee terms preserved, no horizontal overflow. No browser console warnings/errors observed on public discovery. Public discovery showed zero available jobs. Existing authenticated session could open real Add Job; it was not submitted.
- Private screenshot: `outputs/haldoz-job-review-390-2026-10-28.jpg` under the parent recovery task directory, outside the Git repository. It shows a clearly labeled local synthetic draft, not hosted publication.

## Documentation used

[Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [database functions](https://supabase.com/docs/guides/database/functions), [Next.js path revalidation](https://nextjs.org/docs/app/api-reference/functions/revalidatePath), and [Wrangler commands](https://developers.cloudflare.com/workers/wrangler/commands/). Existing pinned dependencies were retained.

## Next action

Review and approve only the exact migration above, acknowledging that a full restorable backup remains unverified. No deployment, merge, Auth changes or public job publication is included in that approval.
