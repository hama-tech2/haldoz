## First online test preparation — 28 October 2026
Read docs/FIRST-TEST-DEPLOYMENT-2026-10-28.md. GitHub Pages is verified legacy/main/root Jekyll documentation, not the application. Exact proposed full-stack target: haldoz-preview.mahmadmajed149.workers.dev, Cloudflare account 11de8ff2142cb705ddccb688df41621a. No Haldoz resource currently exists. Local isolated packaging/routes passed; deploy:preview remains blocked by explicit exact-target approval, private Wrangler login and verification of the one new Supabase callback. Dashboard allowlist currently contains only http://127.0.0.1:3100/auth/callback; preserve it and the shared Site URL. No hosted changes, deployment, paid bindings or main merge occurred. Job publication remains disabled and its migration remains unapplied. Latest user request allows preparation now, requires approval before these external changes. Do not repeat historical migration/setup gates as blockers for serving the existing profile/draft slice online.

# Haldoz Workers release preparation
Status: local candidate tested; no deployment or Git connection configured.

## Verified continuation — 27 October 2026
The owner now authorizes a tested development preview and automatic preview updates from the Haldoz development branch. Production/main promotion still needs separate approval. This supersedes the older instruction to disable all development branch deployments.
Cloudflare connector account: 11de8ff2142cb705ddccb688df41621a. Existing workers.dev subdomain: mahmadmajed149. Read-only inventory returned no Worker whose name contains haldoz; unrelated Workers were not inspected or changed. No preview URL exists yet.
Installed Wrangler 4.152.0 reports unauthenticated. Connector authentication does not authenticate the local CLI. Use the owner's Cloudflare account, never the CLI's suggested temporary anonymous deployment account. Do not request tokens in chat.
The new UI passed a fresh vinext build and all four local Worker HTTP/native-action rejection scripts. Next remains intact. Cloudflare's current Next.js guidance still recommends vinext and identifies it as beta; passing local checks does not verify live edge OAuth, cookie handling or free-plan CPU limits.
No deployment, Git integration, hosted Auth URL edit, secret creation or paid plan change has occurred.

### Concrete preview sequence after owner acceptance
1. Finish observed local owner edit/save/reload and draft create/reopen; retain the existing saved page. Verify an independently authenticated non-owner cannot mutate its records. Never substitute synthetic RLS for hosted JWT proof.
2. Isolate labeled development fixture routes/data from hosted preview/public routes. Complete real public job reading/publication in a separately reviewed slice before production; no additional SQL is approved by this document.
3. Add a separate guarded preview deploy command targeting ONLY haldoz-preview in the account above. A prospective URL is https://haldoz-preview.mahmadmajed149.workers.dev — this is a planned address, NOT a live deployment. The preview guard must reject main/unknown branches, dirty trees, wrong account/backend/target, privileged keys and untested artifacts. Keep production target haldoz and its release guard separate.
4. Authenticate Wrangler privately through the normal browser flow, or configure the official Workers Builds/GitHub connection for ONLY hama-tech2/haldoz. Do not create/broaden credentials without a concrete permission review. Store credentials outside Git; no service-role/database password is required for the application.
5. Configure build and runtime public Supabase URL/publishable key and exact preview origin. Both readiness flags must reflect verified real integration. Preserve local/shared OAuth URLs; add only the exact preview /auth/callback after reviewing the current allowlist. No wildcard redirect or authentication bypass.
6. Run complete checks before the first preview deployment. For automatic updates, build/check the codex/phone-and-release-prep branch and deploy only the isolated preview target. Keep production promotion manual/approved from tested main. Never enable deploy-on-push for untrusted forks or expose deployment secrets to pull-request code.
7. Record the actual Worker version and URL, then test Google login, page edit/reload, anonymous profile reads, draft persistence, non-owner denial and runtime CPU on that URL. Production is not approved by a successful upload.

This sequence is concrete preparation, not a configured or tested deployment pipeline. Browser acceptance and deployment authentication remain external blockers.

## Adapter decision
Cloudflare currently recommends vinext for Next.js, but it is beta and not guaranteed to reproduce every Next.js behavior:
https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
https://github.com/cloudflare/vinext
The pinned checker reported 97% compatibility: supported imports/proxy, one partial App Router reactStrictMode behavior, zero blocking findings.
OpenNext preserves next build output, but current docs report Node.js middleware unsupported. Haldoz uses Next 16 proxy.ts, so it is not assumed interchangeable:
https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/
The existing npm run dev/build/start scripts still use Next.js. Separate dev:vinext/build:vinext/start:vinext commands test Workers.
Pinned tooling and two patch overrides (undici 7.30.1, fflate 0.7.5) address advisories without the suggested breaking downgrades. Keep the lockfile; do not run audit fix --force.

## Commands
npm ci --ignore-scripts
npm run check:cloudflare
The latter runs all application checks, a normal Next build, a Workers build and local Worker HTTP/native-action negative checks. It never deploys or applies SQL.
Local Worker smoke tests force auth/pages readiness false and use only loopback port 3102.
Vite emits upstream sourcemap/dynamic-import and static route-classification warnings. Builds passed; this does not establish all production edge cases.
Generated dist/server/.dev.vars may contain local configuration. dist, .dev.vars*, .env*, .local and .wrangler are ignored and forbidden from the public checkpoint.

## Free-plan suitability
Official limits: https://developers.cloudflare.com/workers/platform/limits/
Workers Free currently lists 100,000 dynamic requests/day, 10 ms CPU/request and 128 MB memory. Network waiting does not count as CPU.
Local builds and workerd checks prove compatibility, not production CPU fit or field performance. SSR/authentication may exceed the free CPU budget; assess actual platform timings after an approved limited release.
No paid plan is selected. There are no R2, D1, KV, Response Store, Cloudflare Images or other paid-resource bindings. CDN/data/image optimization services were explicitly left unconfigured.
If free limits prove insufficient, stop for owner approval of a different plan or hosting target.

## Production Git-connected deployment — still gated
Official setup: https://developers.cloudflare.com/workers/ci-cd/builds/
1. After public-source review/first-push approval, connect ONLY hama-tech2/haldoz to a new Haldoz Worker.
2. Production branch: main. Development branches must use the isolated preview target described above and cannot replace production.
3. Require the Haldoz checks workflow before merging to main. Configure branch protection separately with owner approval; it has not been changed.
4. Build command: npm run check:cloudflare. Deploy command: npm run deploy:production. Use Node 24 (tested 24.22.1) and the committed lockfile.
5. Only after release approval set HALDOZ_RELEASE_ENABLED=true in the build environment. The guard otherwise exits BEFORE Wrangler deployment. It also refuses non-main, dirty trees, missing Worker artifacts, wrong backend, privileged keys, non-HTTPS canonical origins and unverified auth/pages gates.
6. Define NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, HALDOZ_SITE_URL, HALDOZ_AUTH_READY and HALDOZ_PAGES_READY privately in the appropriate build/runtime settings. The browser key must be publishable, never service_role/secret.
7. The final HTTPS production origin and its exact /auth/callback allowlist entry still need owner selection/review. Preserve current local/shared Auth URLs; no settings have been changed.
8. Cloudflare must run the build successfully before its deploy command. A failed check/build therefore does not replace the existing deployed version.
9. Do not use an unrestricted deploy:vinext shortcut: it intentionally calls the same production guard.

No automatic database migration runs in either CI or deployment.
GitHub Actions has contents:read permissions and no deployment credentials, including on pull requests.

## Rollback
Cloudflare keeps Worker versions/deployments:
https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/
Record the last known-good version after each approved deployment. Use an approved version rollback when needed; no rollback command has been executed.
Rolling back application code does not roll back Supabase records. Disable readiness/writes and preserve data if database compatibility is uncertain.
Auth/profile live success, real JWT isolation, free CPU fit and the first public release remain separate approval/acceptance gates.
