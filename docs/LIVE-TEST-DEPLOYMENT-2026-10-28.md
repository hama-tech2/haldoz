# Haldoz live test deployment

28 October 2026 (Asia/Baghdad). Executed after the owner's explicit approval of only the documented test Worker and exact Supabase callback.

## Exact deployed application

- URL: https://haldoz-preview.mahmadmajed149.workers.dev
- Worker: `haldoz-preview`
- Cloudflare account: `11de8ff2142cb705ddccb688df41621a`
- Deployed application source: `9627cffd1ae4d1951750281e66fe671cc9ffe3c3`, branch `codex/phone-and-release-prep`
- Worker version: `2a6e3012-0d11-4e2e-958d-4879ea776c3b`
- Deployment: `442ab38a-7eef-4a2c-ad76-8dd98846a6bf`, created `2026-10-28T08:46:29Z`, 100% of this test Worker's traffic

The source is the existing full-stack vinext server and application assets, not GitHub Pages, a README upload or static export. No branch was merged. GitHub Pages remains the separate legacy documentation site; use the workers.dev URL for testing the app.

## Approved configuration changes actually made

Created only this Worker with workers.dev enabled and ephemeral version preview URLs disabled. Its bindings are application assets and the seven approved plain-text application variables; no paid-resource binding was added. `HALDOZ_SITE_URL` is the exact HTTPS preview origin, Auth/Pages readiness is true, `HALDOZ_JOBS_READY=false`, and `HALDOZ_HOSTED_PREVIEW=true`. The existing Supabase publishable key was configured privately; no privileged/service-role key or database password was used.

Added only `https://haldoz-preview.mahmadmajed149.workers.dev/auth/callback` to project `wickyjtjhgfzntifuzac`'s redirect allowlist. Dashboard verification showed both this entry and the preserved `http://127.0.0.1:3100/auth/callback`, total 2. Shared Site URL remains `http://localhost:3000`. Google provider/client settings were not changed.

Private Wrangler browser authorization completed with account/user read and Worker-script write scopes. OS keyring storage was unavailable because the installed CLI lacked its optional keyring package; no dependency was installed. Standard private Wrangler credential storage outside Git was used. Never print or upload those credentials.

No application records were submitted during acceptance checks. Real Google login naturally used Auth session services, but no provider configuration, migration or application data was changed. Other projects/Workers, recovered source and backups were preserved. No paid service was enabled.

## Fresh verification

The deployment guard reran all required checks before uploading: **91 tests passed**, credential/source scans, lint, TypeScript, Next production build, Workers production build and local Workers HTTP/authorization checks.

Live HTTPS checks passed for Landing, enabled Google Login, /jobs and /favorites, with actual application assets. Unsigned owner requests redirected to sign-in with private/no-store responses. Cross-origin login was rejected. The live PKCE login route used the exact approved callback. All development fixture routes returned 404. Missing/invalid public job IDs returned 404. The existing public profile and contact rendered anonymously without owner controls.

Real browser at **390px width**:

- Landing rendered the preserved Sorani RTL design.
- Clicking Continue with Google returned to the existing owner's `/owner` page on this live origin; the authenticated session survived a reload.
- Edit Profile loaded the existing saved contact; no edit was submitted.
- My Page -> dashboard -> Add Job navigation worked. The new form remained draft-only, with publication fields unavailable.
- The public profile rendered contact controls and its jobs section without owner editing controls.
- No horizontal overflow or browser console warnings/errors were observed in these paths.

Read-only database counts before and after: one ownership row, one page, zero jobs; new publication columns absent. No publication migration was applied. Hosted filled/publish workflows and real published job detail remain **unverified**, because publishing is deliberately disabled and there is no published job. No physical phone was used; the public HTTPS endpoint and mobile-width browser were tested.

Private evidence lives under ignored `.local/qa/` (deployment receipt/log, HTTP results, browser summary). Current live mobile screenshot is in the parent task's `outputs/haldoz-live-landing-390-2026-10-28.jpg`, outside Git. Logs may contain binding values and must never be uploaded.

## Next scope

The test URL is ready for the owner to open on a phone without PowerShell. Job publishing still needs separate review/approval of migration `20261027164402`; do not enable the flag, apply SQL, merge or promote production based on this deployment approval. Automatic branch deployments were not configured. Additional deployments or hosting/provider changes must remain within explicit owner approval.
