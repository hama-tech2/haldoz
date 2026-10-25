# Haldoz Workers release preparation
Status: local candidate tested; no deployment or Git connection configured.

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

## Git-connected automatic deployment — prepare now, configure after approval
Official setup: https://developers.cloudflare.com/workers/ci-cd/builds/
1. After public-source review/first-push approval, connect ONLY hama-tech2/haldoz to a new Haldoz Worker.
2. Production branch: main. Disable non-production branch deployments. Development branches run GitHub checks only and cannot replace production.
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
