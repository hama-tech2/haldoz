## Latest owner-job milestone — 28 October 2026
Read docs/JOB-PUBLICATION-REVIEW-2026-10-28.md before historical entries. Current source adds draft/active editing, review/publish/fill actions, real public discovery/profile/detail jobs and explicit workplace/agency-fee disclosure. 89 tests, lint/types, both production builds and local Next/Workers HTTP checks passed. Real 390px browser-only draft validation/save/reload/edit/review passed. Browser access is now available; existing authenticated Add Job rendered, but no hosted job was submitted.
Hosted state is still one page/ownership and zero jobs. Initial migration remains applied and unchanged; the NEW publication migration 20261027164402 is NOT APPLIED and requires exact-scope owner approval. HALDOZ_JOBS_READY remains false/unset. No hosted writes, deployment or main merge. No full verified database backup. No need to repeat Google/password setup or request manual testing while the owner is away.
The owner's current authorization covers safe local implementation/checkpoints, normal pushes to codex/phone-and-release-prep and an optional DRAFT PR to main for review only. It explicitly forbids deployment, paid services, destructive work and additional hosted changes without approval. Latest request overrides earlier preview rollout instructions. Preserve all recovered files and backups; work only in the existing Haldoz audit copy.

# Haldoz continuation handoff
Updated 27 October 2026 (Asia/Baghdad). Read this before historical reports.

## Latest continuation — form/profile checkpoint
Preservation checkpoint 427ed81ab49e67ff2cde9d12c7943d375e9b32e8 was pushed normally to codex/phone-and-release-prep and verified with ls-remote plus GitHub file reads (actual application and this handoff). It includes ef98e6b. The subsequent commit containing this section adds the form/profile slice; resolve its pushed hash below.
Read docs/FORM-PROFILE-SLICE-2026-10-27.md for exact changes and limitations. Fresh checks: 68 tests, lint/types, Next production build, vinext build, Next and local Workers HTTP/native-action denial checks passed. Anonymous HTTP reads of the real saved page succeeded twice with the correct contact fingerprint and no owner controls. New Page SSR phone is empty and consent unchecked. Original migration hash is unchanged; no hosted write in this slice.
Visual and signed-in acceptance are still pending: browser connector has no enabled browsers; native Chrome disappeared after its Guest window opened. Do not invent screenshots or claim browser editing/draft saving passed. Owner was asked to open http://127.0.0.1:3100/owner in normal Chrome and inspect Edit Profile. Existing production server is running with process-only PAGES_READY=true. Confirm current process/port before restarting; never kill unrelated Node processes. Saved private readiness configuration was not overwritten.
Cloudflare connector identity/account and workers.dev subdomain were verified; no Haldoz Worker exists. Wrangler 4.152.0 is installed but unauthenticated. Preview rollout/Git automation remain pending real owner acceptance, fixture isolation, appropriate credentials and exact callback configuration. Do not use temporary anonymous deployment accounts. See updated CLOUDFLARE-RELEASE.md. No production promotion authorized.
Vazirmatn retained; both it and a private official Noto Sans Arabic comparison pass glyph/shaping checks. Real visual comparison still pending; no font substitution or new imagery.

## Exact source and Git
- Working source: C:/Users/shara/Documents/Codex/2026-10-25/hey-codex-i-formatted-windows-but/work/haldoz-audit/haldoz
- Repository: https://github.com/hama-tech2/haldoz
- Working branch: codex/phone-and-release-prep
- Current checkpoint: the commit containing this handoff (or its descendant on this branch). Resolve exact local and remote hashes with the commands below; never assume main is current.
- Verified predecessor commits: a5086c6956c59c8cf98e89a408b5bbc7689e617b (recovered application/phone/release preparation, already pushed) and ef98e6b (approved hosted migration receipt, local at the start of this task).
- The owner explicitly authorizes normal pushes of the tested latest source/handoff to this working branch. No force-push, reset, source replacement or main merge.
- Recovered Desktop original remains untouched at C:/Users/shara/Desktop/my-websites/haldoz/2026-10-12/you-are-my-senior-mobile-app/outputs/haldoz.
- Preserve all recovery ZIPs, original index/checkpoints and existing audit copies. Do not create another full project copy.
- Work ONLY on Haldoz. Do not inspect/edit Bazaro, Discount or the old Expo app.

## Backend and actual evidence
Confirmed Supabase project: wickyjtjhgfzntifuzac, historically named kurdish-jobs. Reuse was explicitly approved; it does not authorize changes to the separate old Expo app.
Approved source migration: supabase/migrations/20261022200318_haldoz_owner_pages_and_jobs.sql.
SHA-256: 8141BA8ED3E60EFF0C717046A51722CAD042EB2067C476886FF57D2855FD5FC7.
Applied via Supabase MCP with hosted execution version 20261027074958, name haldoz_owner_pages_and_jobs.
DO NOT reapply it. The local filename and hosted migration version differ. Reconcile history explicitly before any future CLI db push; do not rename the reviewed recovery file or blindly repair history.
Three tables: public.haldoz_owner_pages, haldoz_pages and haldoz_jobs. All have RLS; nine reviewed policies and SECURITY INVOKER atomic haldoz_create_page RPC.
Real anonymous API reads of profiles/jobs succeeded; private ownership SELECT was denied. Shared helper/default ACL/event triggers were unchanged by migration.
Latest read-only count: one saved page and ownership record; zero jobs. This proves persistence exists. End-to-end edit, independent non-owner JWT denial and deployed OAuth still require observed acceptance tests.
Two pre-existing shared helper EXECUTE warnings and Auth leaked-password-protection warning remain. No verified full restorable database backup exists; owner expressly accepted that risk for the exact additive migration. A metadata/source archive is NOT a full database backup.
Ownership links use ON DELETE RESTRICT against Auth users. One page per owner, immutable ASCII URL handle. Display names are separate multilingual text.

## Implemented
Approved owner-first landing / and Google onboarding /create; Supabase SSR cookie login/callback/logout, getClaims identity verification.
Page Setup -> atomic save -> /owner; owner profile editing; shared PublicProfile for owner/guest; actual clipboard copy with manual fallback.
One public phone plus optional WhatsApp using the same canonical number; Iraqi/international normalization with pinned libphonenumber-js. Explicit unchecked public-contact consent.
Private /owner/jobs dashboard, add/edit draft, saved-draft review. Ownership chosen server-side and enforced by RLS. No service-role/browser identity bypass.
Current jobs/favorites discovery still uses explicitly labeled development fixtures. Preview pages are synthetic and must never be called real saves.
Publishing is NOT implemented. Initial schema blocks owners from writing publication timestamps; a separately reviewed SQL change is required.
Image/banner uploads are NOT implemented. The existing profile uses a color cover and initial; never present those as uploaded branding.
No placement-fee field was found in the existing draft payload; inspect and specify this before public job publication rather than silently claiming coverage.

## Local running and verification
Use installed Node 24.22.1 and exact package lock. No global install or broad npm audit fix.
Local URL: http://127.0.0.1:3100
A server started inside the restricted command environment reported Ready but was unreachable. Running the same existing production server with approved unrestricted execution resolved localhost access for both HTTP checks and the in-app browser.
Current real-data acceptance server uses HALDOZ_PAGES_READY=true only in its process. Saved .env.local remains pages-ready=false; do not claim otherwise or commit it. AUTH_READY is privately configured true.
Authentication, explicit public consent and RLS remain active; readiness is not an authorization bypass.
Four HTTP scripts passed in the disabled-pages baseline; native anonymous create/edit action denial was repeated successfully with pages enabled. Missing hosted profile returned 404. No authenticated record was manufactured by those checks.
Historical full check: 64 tests, lint, types, Next build, Workers build and local negative-route checks passed. Record fresh results for each changed slice; do not claim historical screenshots are current.
Maintain tests' baseline WebAssembly flags: --liftoff-only --wasm-num-compilation-tasks=1 and serialized files. They avoid observed Node optimizing-compiler crashes, without skipping authorization checks.

## Design
Preserve premium minimal blue/white, Kurdish Sorani RTL and the existing tokens in design.md. Keep approved / and /create layouts.
Use real screenshots at 390px and desktop for review, no new AI mockups or unrelated references.
Public and owner profiles share one visual foundation; only owners get controls. No fake statistics, verification badges or public fake jobs.
Use natural multilingual display names with spaces; keep handle rules separate and make conflicts understandable.
Creation phone must start empty with placeholder "ژمارەی مۆبایل بنووسە". Owner editing may show only server-loaded saved contact. Browser autofill is separate from application defaults.
Initial checkpoint removes a number previously embedded in phone examples/placeholder. Tests use the library's published IQ mobile example rather than owner data. Earlier pushed history is preserved, so this does not erase older examples from history.
Next UI slice: simplify redundant validate/save controls; readable 16px forms/body, clear hierarchy, one primary Add Job action, compact contacts and a useful zero-jobs state. Keep optional job details collapsed. Do not claim uploads/publication are ready.
Vazirmatn is self-hosted with OFL; assess real Sorani glyphs before replacing it with Noto Sans Arabic. No font switch based only on taste.

## Cloudflare and release
Normal Next build/start remain supported. Pinned vinext 1.3.1 / @vinext/cloudflare 1.2.1 candidate is prepared with wrangler.jsonc and no paid bindings.
Current GitHub workflow runs checks only. Current production deployment guard requires main, a clean tree, correct backend, HTTPS origin and explicit release/auth/pages gates. No automatic SQL.
No live Cloudflare Worker or Git-connected deployment has been verified here.
Latest owner authorizes preparing and releasing a tested Cloudflare PREVIEW and configuring tested branch previews. Production promotion/main merge still requires approval.
Do not send this incomplete fixture-based discovery app as public production. Choose a separate Haldoz preview target; retain the production guard. Configure only this repository/account.
Preview deployment needs actual Cloudflare access, exact preview domain, environment configuration, Supabase callback allowlist and real remote OAuth/persistence checks. Any new credentials are entered privately. Do not expose service-role keys.
Official sources: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/ ; https://supabase.com/docs/guides/auth/server-side/nextjs ; https://nextjs.org/docs/app/guides/authentication .

## Safe commands (run from exact working source)
On this Windows PC, the existing Git executable is:
C:/Users/shara/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe
Add its directory and mingw64/bin to this process PATH when needed. GCM authentication as hama-tech2 previously succeeded. Do not reinstall Git or change global PATH.
Verified commit identity: hama-tech2 / 276953050+hama-tech2@users.noreply.github.com; use per-command config when needed, not global settings.

```powershell
git status --short --branch
git log -4 --oneline
git ls-remote origin refs/heads/codex/phone-and-release-prep
node scripts/tool.mjs npm run check
node scripts/tool.mjs npm run check:cloudflare
# For authorized real hosted testing only, in this process:
$env:NODE_OPTIONS='--use-system-ca'
$env:HALDOZ_PAGES_READY='true'
node scripts/tool.mjs npm run start
```

With the server running, run verify-http.mjs, verify-account-workflow.mjs and verify-draft-routes.mjs as appropriate. verify-owner-routes.mjs currently expects the pages-disabled baseline for its final missing-profile assertion; do not misreport that assertion on an enabled real-data server.
Review git diff, run check-secrets and check-public-source before committing/pushing. Exclude .env.local, .dev.vars*, node_modules, .next, dist, .wrangler, .local, archives, generated action keys, actual user phone values and private screenshots.
Never print passwords, tokens, auth codes or complete server-action manifests.

## Preservation checkpoint verification
Fresh checks completed for this checkpoint: all 64 tests passed; credential/private-contact/public-file scans, ESLint, TypeScript and the optimized Next production build passed. The owner's saved phone was compared by fingerprint without exporting the number, and was not found in upload candidates. No environment files, private backup archives, generated dependencies or unrelated sources are included.
Immediately before this push, the working branch on GitHub was a5086c6956c59c8cf98e89a408b5bbc7689e617b. Remote main was independently observed at 7feaa09f83bb5c62e16a5bc1a7944749591ba6aa; do not assume historical main receipts still describe it. This task does not modify main.

## Next precise work
1. Finish and verify the preservation push including this handoff before UI expansion.
2. Apply one tested shared form/profile improvement; preserve approved landing/login. Test empty create state versus owner edit/autofill and multilingual names.
3. Observe the existing real owner page, save/edit/reload and anonymous public read. Test non-owner denial with a genuinely separate authorized account/session; synthetic SQL identities are not JWT proof.
4. Verify actual Add Job -> Save Draft -> reload/edit/review. Publishing needs its own reviewed migration and real public job route.
5. Prepare a separate tested Cloudflare preview and Git preview workflow; verify remote Google callback, owner privacy and real persistence before requesting production promotion.
Communicate English only, keep reports short, never restart from the old GitHub main.
