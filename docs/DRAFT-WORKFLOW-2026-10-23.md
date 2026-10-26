# Draft workflow milestone — 23 October 2026

## Scope and outcome
Next smallest functional slice: Dashboard -> Add Job -> Save Draft -> reopen/edit -> Review. This supersedes the prior stop-after-profile scope under the owner's latest authorization. Approved / and /create designs preserved. Publishing, public job-detail routing and full owner job-status management remain the following slice; no fake publish action or public draft link.

Actual project: C:/Users/Admin/Documents/Codex/2026-10-12/you-are-my-senior-mobile-app/outputs/haldoz. Branch milestone/home-v1; original staged baseline/recovery files retained. No Expo/Bazaro or Google Cloud app discount changes. No dependency install, hosted database/settings write, push, deployment or merge.

## Implemented
- Private /owner/jobs dashboard lists latest 20 owned drafts with genuine database fields; explicit empty state, edit/review links and Add Job. No fabricated views/followers or aggregate statistics.
- Private /owner/jobs/new, /owner/jobs/[id] and /owner/jobs/[id]/review use verified claims, server-loaded ownership and existing database RLS; return honest integration-unavailable states.
- Shared draft form prioritizes required title and city; optional description, salary/shift/hours. Fixed salary normalizes Arabic/Kurdish digits and validates integer bounds; unspecified salary stays unspecified. Working hours require a valid pair; overnight range is explicit.
- Save server action chooses page_id on the server, whitelists fields, forces draft state and ignores submitted owner/page/status/publication metadata. Update filters by owned page, requested UUID and current draft state; a stale editor cannot overwrite a job that became active. Returned row required before success/review.
- Review uses saved data. Publish button disabled, with an explanation; no public share URL for drafts. Unsaved edits hide saved-review feedback.
- Clearly labeled /preview/jobs development workspace exercises the same form/validation/review using synthetic browser-local drafts. It does not import a Supabase client, create a session, set auth cookies or bypass production guards. Saves are real localStorage writes, survive reload, and fail visibly for denied/corrupt/full storage. Limit 30 development records. It is a fixture workspace, not a production account or authenticated backend success test.
- Real My Page now links to Add Job and draft dashboard. Its profile remains server-loaded, with Edit and real saved-profile Copy Link preserved. Removed the example Copy Link from unsaved profile preview.
- No global discovery/Favorites deletion or rebuild. No alternate login/payments/subscriptions/ads added.

Primary sources: src/lib/job-drafts.ts, src/lib/draft-fixtures.ts, src/lib/owner-jobs.ts, src/app/owner/jobs/, src/components/draft-form.tsx, draft-review.tsx, draft-workspace.tsx and owner-jobs-shell.tsx, src/app/preview/jobs/page.tsx. Existing owner-page-view.tsx updated narrowly.

## Security and migrations
Existing supabase/migrations/20261022200318_haldoz_owner_pages_and_jobs.sql already supports drafts. Reviewed against the write whitelist and executed locally in PGlite; SQL unchanged and unapplied hosted. No new migration needed for this slice.
Explicit grants and RLS protect owner mapping and jobs. Anonymous visitors and other owners cannot read drafts or mutate another owner's records. Production loaders filter both page and job IDs; route responses remain private/no-store. Non-owner/missing draft receives the same unavailable/not-found treatment without disclosure. No client-side identity is trusted for real writes.

Important boundary: the prepared migration includes future owner publication grants/policies. This slice prevents publication in its application action, but does not claim the database forbids legitimate owners from using those future permissions directly. Review publication scope before hosted apply. Both readiness flags remain false.

Before any hosted database change: independently inspect existing schemas/objects, collisions, event triggers, Auth/redirects and advisors; review exact rls_auto_enable function signature/body/ACL. Obtain a recoverable schema/data export via an authorized method, record restore procedure and verify the backup without exposing credentials. Rehearse additive SQL and authorization using synthetic accounts, present exact migration and obtain explicit approval. Do not use a destructive down migration as automatic rollback; disable writes and preserve/export new records first. Existing function hardening SQL is approval-only and unverified, never blindly applied.
The old Expo shares this backend; additive table names alone do not certify shared Auth/quota/event-trigger safety. No old Expo migrations imported. The existing security warnings remain unresolved. Provider configuration and hosted metadata access remain independent tasks.

## Verification
- Node test suite: 41 passed, 0 failed, including 18 synthetic PostgreSQL authorization subtests. New tests cover field validation, normalized salary, unknown/overnight hours, ignored forged ownership/publication fields, corrupt/versioned development storage, save/reload under PostgreSQL RLS, non-owner and anonymous-auth denial, and stale draft update protection.
- Basic working/index credential scan passed; filled .env.local stays ignored/untracked. No credential value in this report/checkpoints.
- ESLint max-warnings=0 and Next type generation/TypeScript passed.
- Optimized production build passed with two build workers. Final form fixes were rebuilt and browser-retested; pure SQL/domain logic unchanged after suite.
- verify:http, verify-owner-routes.mjs and verify-account-workflow.mjs passed: public routes/assets/RTL/privacy and existing auth/profile negative paths.
- New verify-draft-routes.mjs passed: signed-out private dashboard/new/edit/review redirect with private/no-store; actual native draft Server Action submission with forged ownership/publication fields denied. The helper reads only required action metadata from the generated build manifest and never prints its encryption key.
- Real browser evidence and exact final interaction results are recorded in CURRENT-STATE and .local/qa/draft-browser-20261023.json. Screenshots are actual locally rendered 390x844 development fixtures, not mockups or real authenticated owners.

## Errors found and addressed
1. Initial PostgreSQL worker crashed with V8 "Fatal process out of memory: Zone" before assertions. File serialization alone did not fix it. Node advertised 128 default WebAssembly compilation tasks; limiting compilation tasks to 1 made the isolated PostgreSQL suite and all 41 tests pass. That setting alone later failed again, so it was not a complete fix. Baseline-only WebAssembly compilation (--liftoff-only), one compilation task and serialized test files then passed all 41 tests twice consecutively, including the final npm test. The test script retains these flags; production code/compiler settings are unaffected. No SQL/security assertions removed. Exact V8 allocation mechanism remains unproven; not presented as proof of insufficient PC RAM.
2. Initial Next build worker exited with Windows code 3221226505 while using 15 workers. Local Next config now limits experimental.cpus to 2; subsequent production builds succeeded. This changes build concurrency, not authentication or type/lint validation. Exact crash mechanism remains uncertain.
3. Real-browser failed submission reset native select fields. The form now prevents automatic reset, retains inputs, and focuses the first validation error.
4. Native working-hour input values were lost during another field edit in browser testing. These inputs now retain native input state; submissions validate actual FormData. Save/reload/review is retested before completion.
5. One overly broad diagnostic manifest read included a generated local server-action encryption key in tool output. Subsequent builds explicitly generated fresh random action keys, replacing it before serving this slice. No Supabase secret/service-role credential was involved. Do not print full generated manifests.

## Limits and remaining work
DONE: local draft/dashboard/review implementation, synthetic authorization and working browser-local save/edit path.
UNVERIFIED: real Google sessions, real owner-page/draft persistence through hosted PostgREST/JWT/RLS, physical Android/TalkBack, actual 200% browser zoom, fluent Sorani wording, field performance and real concurrency.
MISSING: publishing/state transitions, public job details/list integration, pagination beyond latest 20 drafts, idempotent retry/multi-tab conflict management, production abuse controls and disabling fixture pages before release.
BLOCKED integration only: Google provider setup and approval-dependent hosted schema/security work. Prior read-only Auth settings HTTP 200 established publishable-key connectivity; provider reported disabled. No need to repeat OAuth/Git metadata troubleshooting to continue local coding.
The synthetic draft workspace is currently accessible by its explicitly labeled preview route; do not ship development fixture routes as final product navigation. It grants no cloud identity/access.

Recovery: pre-slice source ZIP .local/qa/drafts-before-20261023.zip, SHA256 DE6A1F2C215F0D1B4CBD99D7F474B3297B5685BD722CA5861CF1C2002AC03BE9. Original 33 staged files unchanged; final source-only snapshot/checkpoint under .local/qa/. Never include filled .env.local or generated build manifests in these source archives. Git author remains unverified; no commit created and development continued.

Recommendation: next implement review-to-publish and public job details with tested state/ownership rules, still locally until hosted approval. Configure Google in parallel when convenient; do not treat it as a universal development gate.

Official references reviewed: https://supabase.com/changelog and https://supabase.com/docs/guides/database/postgres/row-level-security . Local Next 16.4.2 config types/build implementation verified the worker-concurrency option.

NEXT ACTION: open http://127.0.0.1:3100/preview/jobs and review the working synthetic draft workflow.
