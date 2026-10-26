# Google OAuth integration — current handoff, 23 October 2026

## Verified now
- Local publishable key configured and ignored; exact-project Auth settings HTTP 200. Google provider reports enabled.
- Browser access to Google Cloud project Haldoz (project selector/URL verified); existing Haldoz Website client is Web application.
- Supabase provider Client IDs matches this exact Web client. Provider dialog inspected read-only and cancelled; secret value not read/copied/displayed.
- Google callback present: https://wickyjtjhgfzntifuzac.supabase.co/auth/v1/callback.
- Google authorized JavaScript origins has no http://127.0.0.1:3100 entry. This alone is not demonstrated to block Supabase's server redirect flow; do not invent it as the root cause.
- Google Audience: External, Testing, no listed test users. Haldoz requests only openid email profile. Google documents a basic sign-in exception to test-user-list and seven-day testing restrictions for these scopes. Do not force production publication or add extra scopes merely to test basic login.
- Supabase Site URL is http://localhost:3000 and Redirect URLs list is EMPTY. Required Haldoz local callback http://127.0.0.1:3100/auth/callback is missing. Preserve Site URL and all shared Expo configuration; add only the exact callback when performing the authorized configuration with owner.
- HALDOZ_SITE_URL matches http://127.0.0.1:3100. HALDOZ_AUTH_READY=false; HALDOZ_PAGES_READY=false.

## Immediate security requirement
Owner reports the original Google OAuth client secret appeared in a screenshot. Treat it as exposed. Rotation is NOT completed or verified. Never copy/reconstruct that screenshot's secret, request a secret/screenshot in chat, place Google secrets in local/public env files, or print credential-filled UI.
Owner must generate the replacement and enter it privately in Supabase. Do not inspect Google client page or capture images while a newly created secret is visible.

## Owner-guided sequence — one action at a time
1. On the open Haldoz Website Google client, click Add secret. Keep its new-secret window open privately; reply created only. Agent does not click the credential-changing action.
2. Owner privately replaces only the existing Supabase Google provider secret with the new secret and saves. Preserve matching Client ID/provider switches and unrelated providers.
3. Owner disables the exposed old Google secret promptly after the replacement is saved. Confirm disabled status without revealing either value. Adding another secret alone does not revoke the old one. No need to delete the old client or create a second OAuth client. Permanent secret deletion is separate; do not do it automatically.
4. Add the exact Haldoz callback to Supabase redirect allowlist without replacing shared Site URL or any other redirect. Verify saved allowlist read-only. Review intended sign-in account/audience restrictions; basic-scope exception applies as documented, subject to Workspace/account restrictions.
5. Only once rotation/revocation, provider/client, callback/allowlist and local origin are verified, enable local AUTH_READY, rebuild/restart, and test real sign-in with the owner's chosen account and consent.
6. Test successful PKCE callback, verified session, refresh, signed-out protected routes, logout and cookie privacy. Do not print auth codes, session cookies, user email/IDs or tokens. No success claim until an actual sign-in/session succeeds.
7. After sign-in works, begin reviewed hosted metadata/function/security preflight. Present exact migration plus backup/recovery plan for approval before hosted schema changes. PAGES_READY stays false until approved schema and real hosted ownership tests pass.
8. Audit source/index/commit contents/history, verified Git author and checkpoints before feature-branch push; no merge/main/deploy without approval. Do not invent identity. No further demo feature development.

## Fresh checks / limits
scripts/inspect-connection.mjs passed with googleEnabled=true and no credentials printed. verify-owner-routes.mjs, verify-account-workflow.mjs and verify-draft-routes.mjs passed while AUTH/PAGES flags remain false. Actual login/refresh/logout not performed yet. No cloud setting/data/schema write, new secret creation, old-secret revocation, Git commit/push or application redesign by agent.
Browser console initially navigated slowly, then loaded authenticated access to correct Haldoz project. This supersedes earlier browser-sign-in-only limitations. Supabase MCP tools remain unavailable, but authenticated dashboard is now accessible.
Working/index scanner now also detects common Google OAuth client-secret format. It is a basic text guard, not proof that screenshots/history are clean; complete pre-push audit remains pending.
A transient local process-creation error occurred on a read-only command; the authorized escalated read succeeded. No data was altered by the failed command.

## Official references
- Rotation: https://support.google.com/googleapi/answer/6158849?hl=en
- Secret visibility: https://support.google.com/cloud/answer/15549257?hl=en
- Audience/basic scope exception: https://support.google.com/cloud/answer/15549945?hl=en
- Supabase Google/PKCE and redirects: https://supabase.com/docs/guides/auth/social-sign-in/auth-google

NEXT ACTION: owner clicks Add secret in Haldoz Website, keeps the secret private and replies created.

## Fresh continuation — 24 October 2026
Owner explicitly confirms rotation not done. Correct existing Google client and Supabase provider identity/callback match reverified through native Chrome; Audience External/Testing and 0 users. Supabase redirect allowlist reverified EMPTY; preserve http://localhost:3000 Site URL and Expo settings, propose only http://127.0.0.1:3100/auth/callback at approval step. Fresh API-key settings HTTP 200 / Google enabled and local negative auth checks pass. No real Google login/session/logout, cloud writes, credential creation/replacement/revocation, code redesign or hosted migration by agent. Current single owner action remains Add secret on existing Haldoz Website, keep it private/open, reply created. Do not inspect/capture the one-time-visible secret afterward. See latest CURRENT-STATE for exact evidence and pending local logout handling.

## Latest owner authorization and readiness — 24 October 2026
Replacement secret saved in Supabase per owner; exact local callback independently visible in allowlist, Site URL unchanged. Keep old secret enabled until replacement succeeds, as owner explicitly instructs; disable promptly afterward with owner hand-off. Local AUTH_READY=true, PAGES_READY=false. Targeted checks verify enabled Google button, PKCE cookie, exact OAuth broker/Google Client ID/callback and cross-origin guards. Actual Google account/token exchange/session/logout still unverified. No need to recreate/reconfigure projects, clients or publishable key. Redacted evidence .local/qa/google-ready-20261024.json. Continue real sign-in in the local browser tab; never capture the new-secret window or display OAuth codes/cookies/URLs.

## Real session / logout test checkpoint — 24 October 2026
Owner browser reached actual guarded /owner (no fixture); My Page correctly reports database pages unavailable. Source getClaims guard establishes an accepted application session. Full OAuth callback exchange/which secret was used was not directly observed; old secret stays unchanged per owner request. Added missing logout control to database-pending owner screen and reliable error handling; 45 tests/scan/lint/types/build pass, ready OAuth routing/PKCE checks pass. User input prevented further automated browser actions. NEXT owner action: click چوونەدەرەوە on /owner; then verify signed-out denial and a real repeat Google login before closing rotation. No database migration, push or deployment.
