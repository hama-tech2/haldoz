# Haldoz

## Current release preparation — 26 October 2026
The existing application is recovered and locally tested. Page Setup now uses one public phone number for Call and optional WhatsApp, accepting normal Iraqi formats. Hosted saving remains disabled until the reviewed SQL and real owner authorization tests are approved.
The ordinary Next.js commands below remain available. `npm run check:cloudflare` additionally builds and tests a parallel local Workers candidate; it does not deploy. Production deployment is disabled by default and allowed only from main after explicit approval and verified integration.
Read [the current change report](docs/RELEASE-PREPARATION-2026-10-26.md), [database approval scope](docs/DATABASE-APPROVAL-2026-10-26.md), and [Workers release procedure](docs/CLOUDFLARE-RELEASE.md). These current notes supersede historical status statements below. Never upload filled environment files, recovery archives, dependencies or build output.

Free owner-first Kurdish Sorani RTL job website, separate from the older Expo prototype and Bazaro.

## Run locally
Use Node.js >=22.18 with npm: npm ci, npm run dev. On this PC npm is not on PATH, so use:
```powershell
node scripts/tool.mjs npm ci --ignore-scripts
node scripts/tool.mjs npm run check
node scripts/tool.mjs npm run start
```
Open http://127.0.0.1:3100. No account/configuration is needed to explore landing/onboarding/form preview, /jobs fictional discovery and /favorites local storage.
Copy blank .env.example to ignored .env.local only if it does not already exist. The configured project is owner-confirmed wickyjtjhgfzntifuzac. Add its publishable key privately; never use secret/service-role keys. Read docs/SUPABASE-REVIEW.md before enabling auth or saving. Hosted migrations/provider changes need approval.

## Scope and checks
Root landing, /create, /page-setup, /preview/page, actual /p/[handle] route and Google SSR callback structure. Missing integration is visibly disabled; demo pages are labeled. No real Google login or hosted migration has been validated. Private draft Dashboard/Add Job/Save/Edit/Review implemented; publishing remains disabled.
Preserved /jobs and /favorites implement fictional keyword/city/category/shift search and local saved IDs. Self-hosted Vazirmatn/OFL, plain CSS, existing reusable cards. Entire MVP is free: no subscriptions/payments/Wayl/ads/sponsorship.
Run node scripts/tool.mjs npm run check for tests, scan, lint, types and build. With server running: node scripts/tool.mjs npm run verify:http and node scripts/verify-owner-routes.mjs. node scripts/inspect-connection.mjs writes only redacted read-only connectivity evidence and exits 1 until configured.
Read AGENTS.md, design.md, docs/CURRENT-STATE.md, docs/MILESTONE-2-REPORT.md and docs/SUPABASE-REVIEW.md. New user documentation lives in docs/. Local QA/backups/caches live in ignored .local/. Current real-browser draft evidence and remaining limits are documented in docs/DRAFT-WORKFLOW-2026-10-23.md. Explore /preview/jobs for clearly labeled browser-local synthetic draft saves; this creates no real account and makes no Supabase writes.

## Source control
Keep the original staged baseline and recovery ZIPs. New slice changes are intentionally unstaged for review. Do not reset/discard. A missing confirmed author defers commits, not safe local development. No push, deployment, hosted schema/config changes or paid services without approval.
