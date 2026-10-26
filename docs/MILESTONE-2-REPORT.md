# Haldoz owner-first local slice — 22 October 2026

## Implemented
Root / is the owner-first trust landing. Existing JobBrowser/search/compact cards/Favorites are retained at /jobs and /favorites, with internal discovery links updated. Existing fixtures/font/search/storage logic and their tests remain.
Routes: /create onboarding; /page-setup interactive public-field form/inline preview; /preview/page visibly fictional shared profile; /p/[handle] real public-profile route, gated until hosted schema approval/configuration; POST /auth/login and /auth/logout; GET /auth/callback.
PublicProfile is shared by landing example, setup preview, demo profile and actual profile route. No fake verification, follow counts, job inventory, successful saves or account state. Optional branding is a constrained color/initial; image uploading is explicitly unavailable.
Form has public name, ASCII handle, city, biography, public phone/WhatsApp and initially unchecked disclosure confirmation. Client/server validation, database constraints and atomic creation RPC are prepared. Handle availability is checked by the actual unique constraint at save, not simulated while typing.
Next 16 proxy and @supabase/ssr cookie clients use verified getClaims; fixed trusted callback origin, PKCE exchange, POST origin checks, no shared caching for auth routes. Public profile reads use a separate nonpersistent public client with an explicit safe-column selection.
Google/save buttons stay disabled until their real configuration/schema gates pass. A signed-out user can explore a preview without creating anything. No Dashboard job publishing implemented.

## Exact local dependencies
Added exact-pinned @supabase/ssr 0.12.7, @supabase/supabase-js 2.118.0, server-only 0.0.1; development @electric-sql/pglite 0.5.11 and Supabase CLI 2.121.0. Existing Next/React/TypeScript unchanged. No global installs.
Initial metadata requests hit UNABLE_TO_VERIFY_LEAF_SIGNATURE; process-only NODE_OPTIONS=--use-system-ca succeeded for installs/audits. TLS validation remained enabled.
An attempted older CLI entry path did not exist; reading the installed package bin metadata identified dist/supabase.js. Actual CLI version/help/migration-new then succeeded. No hosted CLI commands that mutate state were run.
npm retains its existing blocked unrs-resolver postinstall policy; no script permission expansion was made.

## Fresh checks
- node scripts/tool.mjs npm run check: exit 0; 26 tests passed, zero failed, basic working/index credential scan, lint --max-warnings=0, next typegen/tsc and optimized webpack build passed.
- PostgreSQL suite includes 11 subtests: enabled RLS/invoker RPC grants; visitor public reads/private ownership denial; owner-only identity access; own edit/non-owner zero rows; ownership/handle immutability; duplicate-handle atomic rollback; guest/anonymous denial; draft/recent-completion privacy; cross-owner job insert/update denial; page reassignment/salary constraints; future publication/archive visibility.
- Synthetic PostgreSQL does NOT verify real Supabase JWTs, PostgREST, hosted concurrency/event triggers or OAuth.
- node scripts/tool.mjs npm run verify:http: six routes 200, missing route 404, lang=ckb/dir=rtl/noindex, privacy headers and all referenced JS/CSS/font assets passed. Landing HTML 20,663 bytes; HTML-referenced JS gzip estimate 176,504 bytes; font 111,152 bytes. Not a field-performance/Lighthouse result.
- node scripts/verify-owner-routes.mjs: passed disabled sign-in/save, unchecked consent, cross-origin POST 403, login GET 405, failed callback ignores attacker next destination, unavailable login stays local, reserved handle 404 and honest unconfigured public-profile state.
- npm audit: 5 HIGH affected entries in the existing single braces development-tool chain. Production-only: zero findings. npm ls --all --json: exit 0, no invalid dependency tree. Do not force the suggested breaking downgrade.
- node scripts/inspect-connection.mjs: exit 1, exact URL matched, publishable key absent, Auth settings HTTP 401. Network gateway reachable; authenticated connectivity/provider/hosted state NOT verified.
Evidence: .local/qa/http.json, owner-routes.json, supabase-connectivity.json, milestone2-audit-all.json, milestone2-audit-production.json, milestone2-dependency-tree.json.

## Browser and screenshots
No new real-browser screenshots or interactions were possible: browser inventory returned no apps/browsers; createBrowserTab(iab) reported Browser is not available; Codex open preview returned queued and inventory remained empty. The local production preview is http://127.0.0.1:3100.
Earlier Home screenshots in .local/qa and BROWSER-VALIDATION.md are historical Milestone 1 evidence only. Do NOT label them as current landing/setup screenshots. Responsive CSS, previews, interaction state and Sorani wording still need real browser/owner review before this slice is accepted as visually verified.

## Git and recovery
Original Milestone 1 ZIP hash verified: 03b3f35252f175ca60f1528e87aad43cc8a90a4cc8f5e71ce776f37ff3a4d439.
Before this slice, all 33 staged working files were also saved in .local/qa/milestone2-start-33-files.zip, SHA256 88ff53ef9a7565d9ad5ccf94c9b7b341b8a940e162bc3403331e79682c4ae3c2.
Original 33-entry index remains staged as the prior baseline; new Milestone 2 changes remain unstaged/untracked for review. No reset/deletion/discard occurred. Checkpoint HEAD remains d624613 on milestone/home-v1.
Local author fields remain unset. The initial commit does not establish an owner no-reply identity; GitHub's generic committer address cannot be used. Commit deferred per latest instruction, not a development blocker. Signature verification was unavailable because gpg is absent; no gpg installation attempted.
No commit, push, PR, production deployment, cloud schema/configuration/data change, paid service or old Expo/Bazaro source modification.
Recover by extracting the relevant ZIP into a NEW empty directory for comparison; never overwrite the current tree or hard-reset it. Ignored backups are local only, not remote disaster recovery.

## DONE / UNVERIFIED / MISSING / BLOCKED
DONE: preserved frontend, local owner-first slice, SSR auth structure, local schema/RLS and synthetic authorization checks, production build and HTTP boundary checks.
UNVERIFIED: real browser/responsive/keyboard/accessibility/Sorani visual quality, authenticated Supabase connectivity, Google provider, live profiles, hosted counts and warning definitions.
MISSING: current browser screenshots, real Google end-to-end test, approved hosted migration/live RLS test, later job publishing/dashboard. Image uploads and multi-owner/page transfer are outside this slice.
BLOCKED: hosted verification tools are unavailable here; publishable key is not supplied; provider setup status unknown; hosted migration/security hardening require separate approval. Commit deferred for author identity, with no request to stop development.
Recommendation: complete read-only shared-project inspection, review the warning definition and local UI in a working browser, then approve the specific backend/provider changes before a real Google -> save page -> anonymous public view test.
NEXT OWNER ACTION: add this project's publishable key to the already-created ignored Haldoz .env.local and reply saved; do not send it in chat.

## Final recovery / runtime note
The original 33 staged blobs were independently recomputed with Git blob headers from the pre-slice ZIP and all matched the current index; none of the original index entries were overwritten. The original ZIP and the intermediate slice ZIP remain preserved.
Final application/SQL/docs snapshot: .local/qa/milestone2-local-slice-final.zip (65 source files; excludes .env.local, node_modules, .next and QA/cache). Digest and branch/HEAD evidence: .local/qa/milestone2-final-recovery.json. This remains a local backup, not an authored commit or remote backup.
After adding a Haldoz-specific cookie namespace, the full 26-test/scan/lint/types/build suite passed again. A duplicate preview start returned EADDRINUSE because the existing loopback server was still running; inspected its exact process command, restarted only that Haldoz listener, then repeated both HTTP scripts successfully against the final build. No unrelated process was stopped.
Page Setup currently creates an initial page; owner editing/navigation UI and public job rendering/publishing are not implemented in this slice. The prepared SQL authorizes only the rightful owner to update; actual public profile uses a shared layout and explicit safe fields. This is a local integration scaffold awaiting the documented external and visual gates, not a completed real-owner release.
