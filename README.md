# Haldoz

## Current milestone — 28 October 2026
The recovered application has an existing saved public page. Page Setup uses one public phone number for Call and optional WhatsApp. Owner draft/edit/review/publish/fill and real public job routes are implemented locally; activating publishing requires the separately reviewed, unapplied jobs migration. Read [the publication review and test results](docs/JOB-PUBLICATION-REVIEW-2026-10-28.md) and [the latest handoff](docs/AI-HANDOFF.md).
The ordinary Next.js commands below remain available. `npm run check:cloudflare` additionally builds and tests a parallel local Workers candidate; it does not deploy. Production deployment is disabled by default and allowed only from main after explicit approval and verified integration.
Historical [release preparation](docs/RELEASE-PREPARATION-2026-10-26.md), [initial database approval](docs/DATABASE-APPROVAL-2026-10-26.md), and [Workers release procedure](docs/CLOUDFLARE-RELEASE.md) remain preserved. The initial migration is already applied; do not run it again. Never upload filled environment files, recovery archives, dependencies or build output. No deployment or main merge is currently authorized.

Free owner-first Kurdish Sorani RTL job website, separate from the older Expo prototype and Bazaro.

## Run locally
Use Node.js >=22.18 with npm: npm ci, npm run dev. On this PC npm is not on PATH, so use:
```powershell
node scripts/tool.mjs npm ci --ignore-scripts
node scripts/tool.mjs npm run check
node scripts/tool.mjs npm run start
```
Open http://127.0.0.1:3100. Landing/onboarding and clearly labeled form previews require no account. /jobs and /favorites now use only real available jobs; an unavailable backend is shown honestly. No fictional job is substituted.
Copy blank .env.example to ignored .env.local only if it does not already exist. The configured project is owner-confirmed wickyjtjhgfzntifuzac. Add its publishable key privately; never use secret/service-role keys. Read docs/SUPABASE-REVIEW.md before enabling auth or saving. Hosted migrations/provider changes need approval.

## Scope and checks
Root landing, /create, /page-setup, /owner, /owner/edit, /p/[handle], private owner job routes and /jobs/[id]. Google callback, page persistence and the initial hosted migration exist. The current owner session can open Add Job. Full hosted publish/fill and independent non-owner JWT acceptance remain unverified. HALDOZ_JOBS_READY stays false/unset until the new migration is approved and applied.
Preserved /jobs and /favorites support keyword/city/shift search and browser-local saved IDs. Self-hosted Vazirmatn/OFL, Sorani RTL, plain CSS and existing reusable cards remain. Haldoz is free: no subscriptions/payments/Wayl/ads/sponsorship. A posting agency's placement fee is disclosed separately; Haldoz does not collect it.
Run node scripts/tool.mjs npm run check for tests, scan, lint, types and build. With server running: node scripts/tool.mjs npm run verify:http and node scripts/verify-owner-routes.mjs. node scripts/inspect-connection.mjs writes only redacted read-only connectivity evidence and exits 1 until configured.
Read AGENTS.md, design.md, docs/CURRENT-STATE.md, docs/MILESTONE-2-REPORT.md and docs/SUPABASE-REVIEW.md. New user documentation lives in docs/. Local QA/backups/caches live in ignored .local/. Current real-browser draft evidence and remaining limits are documented in docs/DRAFT-WORKFLOW-2026-10-23.md. Explore /preview/jobs for clearly labeled browser-local synthetic draft saves; this creates no real account and makes no Supabase writes.

## Source control
Preserve recovery ZIPs and the recovered Desktop original. Work in the existing audit copy on codex/phone-and-release-prep, using tested local commits and authorized normal branch pushes. A draft PR is for code review, not deployment. No force-push, main merge, hosted schema/config changes, deployment or paid services without the corresponding approval.
