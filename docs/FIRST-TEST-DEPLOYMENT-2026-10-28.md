# First full-stack test deployment: approval scope

Prepared 28 October 2026 (Asia/Baghdad). **NOT DEPLOYED.** This is separate from production/main promotion and the unapplied job-publication SQL.

## Verified diagnosis

GitHub Pages API: `build_type=legacy`, source branch `main`, source directory `/`, status `built`. Latest inspected Pages build used commit `1cf589f376dca457d4ed67467d904f521d6f6e45`. The public URL returns 200 with Jekyll/README milestone content and no `/_next/` assets. It is a repository documentation build, not a Next.js server deployment. No Pages setting has been changed.

Cloudflare account `11de8ff2142cb705ddccb688df41621a` and workers.dev subdomain `mahmadmajed149` were verified through the connected API. No Haldoz Worker or Pages project exists. Unrelated Worker contents/settings were not inspected or changed. Local Wrangler 4.152.0 is installed but is not authenticated; connector authorization does not sign in the CLI.

Application branch `codex/phone-and-release-prep` was independently verified on GitHub at `fb54709cf1f4ded2a3547fee708b2727085518e7` before this preparation. Use the tested descendant containing this preparation, never the Pages/main build. A fresh GitHub read shows PR #2 has already been merged externally. This preparation task did not merge anything; deployment still uses the explicit development branch and its newly tested preparation commit.

## Exact proposed external changes

1. After explicit approval and private Wrangler browser authorization, create **only** Worker `haldoz-preview` in the account above, with a public HTTPS workers.dev endpoint:
   `https://haldoz-preview.mahmadmajed149.workers.dev`
2. Deploy the existing full-stack vinext Worker server plus its built application assets. No static export, README upload, database migration, custom-domain route, paid binding, new backend, Git integration or automatic deployment is part of this first test.
3. Set only these application variables on that new Worker:

| Variable | Value/source |
| --- | --- |
| NEXT_PUBLIC_SUPABASE_URL | https://wickyjtjhgfzntifuzac.supabase.co |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | Existing privately configured publishable client key; never printed or committed |
| HALDOZ_SITE_URL | Exact HTTPS workers.dev origin above |
| HALDOZ_AUTH_READY | true — provider readiness is still checked at runtime |
| HALDOZ_PAGES_READY | true — uses existing tables, verified identity and RLS |
| HALDOZ_JOBS_READY | false — publication migration is unapproved/unapplied |
| HALDOZ_HOSTED_PREVIEW | true — hides all /preview/* synthetic fixture routes |

4. Add **only** `https://haldoz-preview.mahmadmajed149.workers.dev/auth/callback` to the existing Supabase project's redirect allowlist, after explicit approval. Preserve `http://127.0.0.1:3100/auth/callback` and all other existing entries. Dashboard read-only inspection found that localhost callback was the sole entry; the preview callback is missing.

Supabase Site URL currently remains `http://localhost:3000`. The app explicitly supplies the preview callback in `redirectTo`; the exact allowlist entry enables that flow without changing the shared default Site URL. Google continues to redirect to the existing Supabase `/auth/v1/callback` broker endpoint. No Google client ID/secret, provider settings or Google Cloud project changes are needed for this scope.

The preview is publicly reachable and uses the existing live backend. Normal authorized owner actions on it can create/edit real pages and legacy job drafts. Authentication, public-contact consent and ownership/RLS remain active. Job publication stays disabled; zero active jobs means an honest empty discovery screen and 404 for nonexistent/closed job URLs. No synthetic public job will be inserted to make a test pass.

## Concrete preparation and checks

`npm run deploy:preview -- --dry-run` packages the full application locally without uploading. The script pins the account, target, branch, origin and backend, excludes other resource bindings/routes/migrations, keeps generated settings and detailed output ignored, and hides fixture routes. Actual deployment additionally requires a clean committed tree, exact-target approval, a verified callback and Wrangler authorization to the approved account, then reruns the complete existing checks. Production deployment remains separately guarded behind main/release approval.

Fresh regression checks passed: 91 tests, credential/source scans, lint, TypeScript, Next.js production build, Workers production build and local Workers HTTP/authorization checks. Fresh local preview packaging succeeded. The generated server is `dist/server/index.js`, with application static assets under `dist/client/_next`. The isolated config is `dist/server/wrangler.preview.json`; generated files, private logs and key values are excluded from Git. Original source and recovery backups remain intact.

The prepared Worker was run locally using the intended HTTPS origin and runtime flags. `scripts/verify-preview.mjs` passed: Landing, enabled Google Login, real /jobs and /favorites rendered application assets; owner routes redirected unsigned requests; cross-origin login was rejected; PKCE used the exact intended callback; synthetic fixture routes and nonexistent jobs returned 404. The existing public profile and public contact rendered anonymously without owner controls. Google provider settings and anonymous profile/jobs Data API requests all returned HTTP 200 using the correct project.

These are local Worker and read-only backend checks. They do not establish deployed routing, Google token exchange, logged-in phone behavior or actual hosted job publication. Full live verification follows approval/deployment. The job SQL and full-backup gap remain documented separately; neither blocks serving the existing login/profile/draft slice online, and neither is implicitly approved here.

## Execution after approval

1. Recheck target absence and exact committed branch, then complete Wrangler's private browser login to the approved account. Never request a token/password in chat or use a temporary anonymous Cloudflare account.
2. Add and verify the one approved callback URL, preserving existing settings.
3. Set `HALDOZ_PREVIEW_ENABLED=true` and `HALDOZ_PREVIEW_CALLBACK_VERIFIED=true` only in the deployment process; run `npm run deploy:preview`. No saved local .env file needs overwriting.
4. Record the returned deployment version/URL privately and run `scripts/verify-preview.mjs` against the exact live target. Inspect current Landing/Login/owner redirects, real anonymous profile/job routes and absence of fixture routes. Test Google login/session on the live origin; user interaction may be needed for Google consent. Report any incomplete acceptance honestly.
5. Share the verified phone-accessible URL. Keep the Worker on the existing free plan and stop if a paid plan or extra permission is required. Preserve all existing Workers and database records.

## Official references

[GitHub Pages is static hosting](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [Cloudflare Next.js/vinext full-stack guidance](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/), [Wrangler deploy/dry-run](https://developers.cloudflare.com/workers/wrangler/commands/), [Supabase redirect allowlists](https://supabase.com/docs/guides/auth/redirect-urls).

Cloudflare currently recommends vinext for Next.js Workers and still labels it beta. The already pinned, locally tested adapter is preserved. Live SSR/OAuth and free-plan runtime behavior must be observed after upload; local success is not a launch claim.
