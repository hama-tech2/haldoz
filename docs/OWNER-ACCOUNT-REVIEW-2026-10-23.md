# Owner-account local milestone review — 23 October 2026

## Outcome and scope
Local owner-account/profile workflow implemented and tested; real Google accounts and hosted persistence remain BLOCKED. Approved landing and login source files are unchanged. No dependencies, hosted objects/settings, Expo files, Git index entries, commits, pushes or deployments changed.

Repository: C:/Users/Admin/Documents/Codex/2026-10-12/you-are-my-senior-mobile-app/outputs/haldoz
Remote: https://github.com/hama-tech2/haldoz.git
Branch: milestone/home-v1; HEAD d624613ed7c3a3db2c15a7cde8f83b835d243ab1.
Original 33 staged files preserved. Git author checkpoint remains deferred; safe development continued.

## What changed
- /owner loads only the verified user's ownership mapping and shared PublicProfile; no page redirects to /page-setup. Successful creation now redirects to /owner.
- /owner/edit loads that same owner's actual page and reuses PageSetupForm. Handle is immutable; public fields require explicit disclosure consent.
- Update server action selects page identity from verified claims plus ownership, ignores submitted owner/page/handle identity, updates only allowed public fields, requires a returned row, revalidates the stable public path and redirects after confirmed success.
- Private routes always return private/no-store headers, including missing-configuration paths. Next SSR cookie flow, verified claims and isolated Haldoz cookie names retained. Successful callback now enters /owner, which routes new owners to setup.
- Owner actions: Edit Profile, real clipboard Copy Link with honest failure/manual fallback, and visibly disabled Add Job. Local links explicitly say they work only on the development device.
- /p/[handle] remains anonymous/public with explicit public-column selection, never account email/metadata. Shared profile/header used across public, owner and form preview layouts.
- Clearly marked synthetic /preview/owner and /preview/owner/edit allow browser review without pretending an account or saved page exists. Their example copy URL points to /preview/page.
- Browser review found the biography textarea used the browser default monospace font. Corrected it to inherit the local Sorani font/line height and an explicit keyboard focus outline. Field/consent edits also clear stale validation feedback.
- Added profile-workflow unit tests, stronger real PostgreSQL RLS scenarios and real signed-out HTTP server-action rejection checks.
- No job publishing/Dashboard, payments, additional login methods, uploads or production deployment added. Existing discovery/search/Favorites preserved.

Primary files: src/app/owner/, src/lib/owner-page.ts, src/lib/profile-workflow.ts, src/components/owner-page-view.tsx, src/components/copy-profile-link.tsx, src/components/page-setup-form.tsx, src/app/page-setup/, src/app/auth/callback/route.ts, src/proxy.ts, src/app/preview/owner/, tests/authorization.test.mjs, tests/profile-workflow.test.mjs, scripts/verify-account-workflow.mjs.
TypeScript allows .ts import extensions for Node-native test execution with noEmit.

## Fresh tests and evidence
1. node scripts/tool.mjs npm run check — PASS: 33 tests, zero failures, basic working/index credential scan, ESLint with zero warnings, Next type generation/TypeScript and optimized production build.
2. SQL suite includes 15 authorization subtests in PGlite: owner create/edit; other owner denied; anonymous visitor public-only reads; anonymous-auth subject denied editing; immutable identity/handle and private mapping protection; draft visibility; public-contact constraint; atomic failure behavior. These run real PostgreSQL SQL/RLS with a synthetic Supabase role/auth shim.
3. New unit tests validate safe stable URL generation, editable-field whitelist excluding private/identity fields, and clipboard success versus failure.
4. node scripts/tool.mjs npm run verify:http — PASS: six public routes, missing route, font/assets/RTL/security headers.
5. node scripts/verify-owner-routes.mjs — PASS: disabled integration state, cross-origin login/logout denial, untrusted callback destination ignored, honest missing-backend state.
6. node scripts/verify-account-workflow.mjs — PASS: /owner and /owner/edit redirect signed-out users to /create with private/no-store; disabled publishing; actual native create and edit Server Action POSTs with forged owner IDs rejected without cookies. This exercises real local handlers, not just disabled buttons.
7. Real browser at 390x844: loaded local Sorani font; editable name reflected in profile preview; missing public contact/consent showed errors and focused telephone; valid synthetic values passed form validation while save stayed disabled. Stable handle read-only. Clipboard button returned success only after actual browser write. No clipboard contents were read.
8. Owner and edit previews at 320, 390 and 1024 CSS px: no horizontal overflow. Browser warning/error log empty for checked edit page. Owner action controls at least 48px high. Temporary viewport reset.
9. Actual JPEG captures: .local/qa/owner-account-preview-390-20261023.jpg, owner-edit-preview-390-20261023.jpg, owner-edit-validation-390-20261023.jpg. These are browser-rendered SYNTHETIC PREVIEWS, not authenticated account screenshots. Redacted HTTP and responsive evidence also under .local/qa/.

Not tested: real Google consent/callback, production cookies, authenticated hosted owner success path, live PostgREST/JWT/RLS, physical Android/TalkBack, actual 200% zoom, concurrent hosted requests, fluent Sorani wording review or field performance. Passing PGlite/build/HTTP checks does not prove production readiness.

## Supabase and confirmed blockers
Value-redacted local check: exact confirmed URL present, publishable-key field blank, ignored .env.local; both readiness flags false. Owner explicitly says key not saved yet. Editor-open request queued; private entry instructions given. No futile keyless connection test repeated. After owner replies saved, run NODE_OPTIONS=--use-system-ca node scripts/inspect-connection.mjs and report only sanitized results. A successful public Auth settings response proves API/key connectivity, not valid Google credentials or hosted schema safety.

No Supabase MCP tools exposed in this session. One read-only dashboard navigation reached Supabase sign-in, so hosted inspection remains unavailable. No repeated failed OAuth discovery troubleshooting. Owner-reported ACTIVE_HEALTHY, zero tables/users/buckets/migrations and two public.rls_auto_enable warnings are not independently confirmed. Do not present them as fresh verified facts.

Existing SECURITY DEFINER warning remains unresolved. Exact function identity/signature, return type, body, ACL and attached event trigger must be inspected with supabase/inspection/shared-project-preflight.sql. A name matching an official event-trigger helper is insufficient to conclude either exploitability or safety. supabase/review/rls-auto-enable-hardening.sql is a guarded review proposal, not an applied fix. Do not drop/replace functions or change shared defaults blindly.

Expo references this same backend. Our local work has no hosted side effects and leaves Expo untouched; compatibility of future shared Auth/redirect/quota changes cannot yet be certified. Preserve existing redirect entries and Site URL, and never import Expo migrations.

Google Client IDs reportedly contains kurdish-jobs, an invalid project label. Provider integration remains disabled. Valid Web OAuth client ID ends .apps.googleusercontent.com; client secret belongs only in the Supabase dashboard. See GOOGLE-OAUTH-SETUP.md for the two distinct callback destinations.

## Database review / pending approval
Existing supabase/migrations/20261022200318_haldoz_owner_pages_and_jobs.sql reviewed and unchanged; not applied remotely. It prepares three namespaced tables, explicit grants, RLS, public-only profile fields, private owner mapping, immutable stable handles and atomic SECURITY INVOKER page creation. It already supports the edit whitelist, so no new migration was needed.
One page per owner, no transfers/teams/deletes and immediate public visibility of confirmed public profile fields are current limits. Google sign-in never proves company representation. Public phone exposure is deliberate/consented, with attendant spam risk.
The migration also contains future draft/job permissions; hosted approval must explicitly review that scope although no publishing UI exists. Approval is required only after metadata/Auth/function inspection and compatibility review. Hosted owner/non-owner/anonymous authorization checks still required after approved apply, using synthetic accounts only.

## Recovery and continuation
Pre-edit snapshot .local/qa/owner-account-before-20261023.zip SHA256 FD076C0AE92F43B44BE3598B305FD4E3410263C47C112777FF14F792AC11D48F. Earlier source/index recovery ZIPs preserved; final source-only snapshot/checkpoint recorded separately under .local/qa/. No environment files included.
Approved /, /create, entry.css and EntryHeader hashes compared to pre-task baseline; unchanged. Original 33 index entries remain intact. No Git identity invented or remote write performed.

DONE: local account/profile code, negative-path server checks, synthetic SQL authorization, real-browser preview validation.
UNVERIFIED: real Google login, actual owner create/edit, hosted anonymous profile read and shared-backend compatibility.
MISSING: local key, valid Google Web OAuth configuration, independent hosted metadata/function/advisor inspection and hosted authorization evidence.
BLOCKED: key-dependent connectivity; provider-dependent login; approval-dependent hosted migration. Keep both readiness flags false. Stop feature expansion here; publishing is later.

Recommendation: finish private key entry, verify read-only connectivity, then configure Google with the owner one step at a time; independently inspect hosted state/security before requesting approval for the reviewed migration. Do not repeat unrelated network/OAuth discovery loops.

Official guidance consulted: https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs and https://supabase.com/docs/guides/auth/social-sign-in/auth-google . Existing SSR verified-claims/cookie flow retained; credentials remain outside source and chat.

NEXT ACTION: Paste the key after NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY= in Haldoz .env.local, save, and reply saved.

Final follow-up: production build passed again after the textarea CSS correction; browser computed font confirms Vazirmatn and 27px line height. Stale validation feedback clears on a new edit. All 33 original staged blob hashes independently match milestone2-start-33-files.zip, not only the filename count. Final recovery files: .local/qa/owner-account-local-final-20261023.zip and owner-account-checkpoint-20261023.json.
