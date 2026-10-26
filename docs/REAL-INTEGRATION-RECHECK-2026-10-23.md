# Haldoz real integration recheck — 23 October 2026

This report supersedes earlier disconnected-tool/server-down notes. It does not supersede pending hosted approvals or prove a successful owner login.

## Scope and fresh results

Confirmed repository: C:/Users/Admin/Documents/Codex/2026-10-12/you-are-my-senior-mobile-app/outputs/haldoz. Remote https://github.com/hama-tech2/haldoz.git; branch milestone/home-v1; HEAD d624613ed7c3a3db2c15a7cde8f83b835d243ab1. No application feature/design, dependency, migration, environment value or readiness flag changed in this continuation. Documentation/ignored QA evidence and a source-only recovery archive were prepared. Expo, Bazaro and app-discount untouched.

- Existing production server successfully started using cmd.exe/direct Next CLI, replacing the previously failing launcher path. Node v24.22.1; Next 16.4.2. Stopped only this tool-owned server session before rebuilding, then restarted the new build with system CA support at http://127.0.0.1:3100. Process lifetime is not guaranteed beyond the local host session.
- node --use-system-ca scripts/inspect-connection.mjs: exit 0. Correct project URL, publishable key present, Auth settings HTTP 200, Google provider enabled. No key printed. This is public-key API connectivity, NOT a signed-in owner or management/database inspection.
- Ignored .env.local remains excluded; HALDOZ_AUTH_READY=false, HALDOZ_PAGES_READY=false and HALDOZ_SITE_URL=http://127.0.0.1:3100. Login remains deliberately disabled pending real provider/rotation/redirect verification.
- node scripts/check.mjs: exit 0; all 41 tests pass, including 18 PostgreSQL/RLS subtests using synthetic Supabase auth roles. Working/index credential scan, ESLint, Next type generation/TypeScript and optimized production build pass. No tests skipped. These are not hosted JWT/PostgREST/Google/real-session tests.
- node scripts/verify-http.mjs, verify-owner-routes.mjs, verify-account-workflow.mjs, verify-draft-routes.mjs: all exit 0 against the running local production server. Public routes/assets/font/RTL/privacy checks, cross-origin auth rejection, signed-out owner/draft redirects and real native Server Action denial of forged unauthenticated owner fields pass. verify-http repeated successfully after final rebuild/restart. Approved screen layouts unchanged.
- Additional basic textual source/index/history scan: zero pattern findings; 33 index entries preserved; existing history contains one commit/one README blob. No private/generated candidate paths found. Limit: regex scan does not prove absence of unknown secret formats or credentials in binary images.
- Three existing recovery ZIP SHA-256 values match prior recorded checkpoints: original 33-file baseline, owner-account final and drafts final. Redacted evidence: .local/qa/integration-audit-20261023.json. No commit/staging/push/merge/deployment.

## Errors, evidence and remaining uncertainty

Browser transport now responds, but browser inventory is empty; creating iab tab reports Browser is not available: iab. open_in_codex returned queued, not opened. No fresh real browser render/screenshot, Google consent, authenticated session, refresh or logout was tested. Historical synthetic screenshots must not be presented as real-account proof. Do not repeat app-restart troubleshooting without a meaningful new condition.

Initial un-escalated connectivity inspector failed EPERM while saving its ignored QA report outside this chat's Expo write root. Authorized escalation succeeded. This was a filesystem permission failure, not a bad Supabase key. CLI help similarly needed local write permission for its telemetry file. Official CLI help clarified --project-ref requires --linked for management targeting; the corrected read-only command then failed: Access token not provided. No management login/token is currently usable by this CLI. A publishable key is not a management access token. No credentials were extracted from browser/Codex/Windows storage and no new auth troubleshooting loop was started.

The official Google/redirect documentation was consulted. The web tool could not parse changelog.md, and shell retrieval failed TLS authentication; no package/config update was inferred from an unread changelog. No Supabase feature implementation was changed during this recheck.

## Real Google login gates

Previous authenticated dashboard inspection (historical, not rechecked now) verified Haldoz Google Web client, matching Supabase Client IDs, Google provider enabled, secure provider switches, correct Supabase Google callback, Audience External/Testing and zero listed test users. Basic openid/email/profile scopes can qualify for Google's testing exception; zero test users alone is not a proven blocker. Missing JS origin alone was not established as a server-redirect OAuth blocker.

The last inspected Supabase URL configuration had Site URL http://localhost:3000 and an empty redirect allowlist. Proposed exact additive change, requiring owner approval and fresh verification: add http://127.0.0.1:3100/auth/callback only. Preserve shared Site URL and every Expo/unrelated redirect/provider. Do not apply hosted settings in this continuation.

Owner reported original OAuth client secret exposed in a screenshot. Replacement saved privately in Supabase AND old secret disabled are still unconfirmed. A status question is pending; do not claim rotation, inspect a potentially visible new secret, request secrets in chat or bypass the local readiness gate. Credential entry/change requires owner hand-off. Once privately rotated/revoked, redirect verified and approved/configured, enable only local AUTH_READY, rebuild and test real login/callback/session/refresh/logout and signed-out denial. PAGES_READY remains false until separately approved hosted schema and live authorization checks pass. Existing logout route ignores the signOut error result; assess actual error handling during the real-session slice before certifying logout.

## Database proposal and approval boundary

Exact prepared application migration: supabase/migrations/20261022200318_haldoz_owner_pages_and_jobs.sql. Reviewed unchanged, NOT applied. It creates three additive namespaced tables: private haldoz_owner_pages, public-only haldoz_pages, and haldoz_jobs including drafts/future publication states; indexes; explicit grants; RLS on all three; and atomic SECURITY INVOKER haldoz_create_page. No Expo migration, existing-object replacement, auth trigger, bucket or global default grant change. Public pages expose only deliberately entered public profile/contact fields. One page per owner; immutable unique handle; no owner reassignment/delete privilege. Local RLS tests cover owner/non-owner/guest/anonymous-auth identities, atomic duplicate-handle rollback, private draft visibility and edit constraints.

Important scope for approval: current SQL also permits rightful owners to publish/change job status directly through the API, even though publishing UI is disabled. Do not describe it as only profile setup. Recommend narrowing the first hosted migration to the smallest reviewed profile scope, or explicitly approving the complete future-job permission scope after preflight; do not silently deploy broader grants.

Exact separate security proposal: supabase/review/rls-auto-enable-hardening.sql. It conditionally revokes EXECUTE from PUBLIC/anon/authenticated on the expected zero-argument SECURITY DEFINER event-trigger function; no drop/replacement. NOT approved or applied. Actual hosted body, ACL, owner/search_path/event-trigger dependencies and advisor findings remain unverified. The function name/warnings alone do not demonstrate an exploitable RPC. Both reported warnings remain unresolved.

Read-only preflight file: supabase/inspection/shared-project-preflight.sql. It includes a read-only transaction, non-system object metadata, user/bucket counts only, migration-history relation presence, function bodies/effective execution permissions, event triggers and Haldoz-name collisions. CLI could not authenticate, so no SQL results were obtained. Reported ACTIVE_HEALTHY/zero public tables/users/buckets/migrations remain owner-supplied, not newly verified. Complete actual grants/default privileges, API schema exposure and migration-count inspection before approving changes.

Recovery plan before any hosted application: capture redacted preflight metadata, exact existing function definitions/ACL/event-trigger dependencies and Auth URL/provider setting baseline; verify existing database backup/export availability and recovery method without exposing user records; hash reviewed SQL; verify no collisions; deploy only approved transaction; stop on error; inspect commit/rollback outcome. Do not automatically DROP objects as rollback after real data exists. Disable Haldoz readiness flags for application rollback; preserve existing objects/data and seek separate approval for remediation. Shared Auth/users/provider settings, triggers and quotas mean Expo compatibility is not yet certified despite namespaced additions. No hosted changes occurred.

## Git and continuation

Current branch remains milestone/home-v1 with original 33-entry index. Index digest before this continuation: 305a75e0cabd264752fa943ed89ac58692e92753e0473b7a0f9492861a1ab758. Repository-local Git author name/email absent; no verified GitHub author source available. GitHub CLI absent. Never invent identity or treat it as a local development blocker. A separate tested integration checkpoint branch/commit/push remains pending author verification and review; no main merge/deploy. Recovery files remain ignored and environment files excluded.

DONE: local server restored, API-key connectivity/provider flag, full local checks, negative-path HTTP authorization, source/index/history scan and recovery-integrity checks.
UNVERIFIED: real Google account/callback/session/refresh/logout, hosted persistence/JWT/RLS/advisors, fresh real-browser screenshots, shared-project compatibility.
MISSING: confirmed secret replacement/revocation, freshly verified exact redirect allowlist, management/browser access for metadata, verified Git author.
BLOCKED: real login pending security/configuration gates; database application pending actual preflight/recovery review/explicit approval; Git checkpoint commit/push pending verified identity/review.

Expert next step: complete the private OAuth secret rotation first, then approve/verify the single additive callback and run one real owner sign-in. Do not build more fixture features or apply SQL to work around authentication.

NEXT ACTION: reply whether the new Google secret is saved in Supabase and the exposed old secret is disabled; no secret values.
