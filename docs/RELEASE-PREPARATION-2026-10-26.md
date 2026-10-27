# Haldoz local fixes and first release preparation
Date: 26 October 2026, Asia/Baghdad.

## Source and boundaries
The recovered original remains read-only at C:/Users/shara/Desktop/my-websites/haldoz/2026-10-12/you-are-my-senior-mobile-app/outputs/haldoz.
All 108 entries matched integration-recheck-source-20261024-005039.zip; its SHA-256 is 1D7808C39EB1418CDB9F8775734E35EEE9DC386BA44E31B3473E3B182B9182DF.
Implementation uses the existing work/haldoz-audit/haldoz copy. No new full project copy, unrelated source, cloud write, push or deployment.
The recovered application's uncommitted source is substantially newer than the README-only initial commit d624613. Never replace it with that commit.
The original recovery index and all its backups remain unchanged. Staging/committing the working copy is now authorized by the owner.

## Single-number contact
Page Setup and Edit Profile have one freely typed public phone field and a WhatsApp checkbox.
Default country IQ; 07912345678, +9647912345678 and 9647912345678 normalize to +9647912345678. Formatting spaces, parentheses, periods, hyphens and Arabic/Kurdish digits are supported.
Pinned libphonenumber-js/max validates numbering metadata; arbitrary text, malformed input and extensions are rejected. This does not verify number ownership or the existence of a WhatsApp account.
The raw field is not rewritten on every keystroke. Both preview and server use the canonical number. When WhatsApp is disabled its mapped value is null; no second number is accepted from the form, including forged legacy fields.
The existing RPC/column names are retained for compatibility. SQL requires public_phone and constrains public_whatsapp to either the same number or null.

## Persistence diagnosis and proposal
The confirmed backend is wickyjtjhgfzntifuzac. Fresh management reads show no public application tables or migrations and no Haldoz functions.
A publishable-key Auth settings request succeeded (HTTP 200, Google enabled). This proves API/provider availability, not completed Google token exchange.
HALDOZ_PAGES_READY remains false; page saving is deliberately disabled until the reviewed schema is approved/applied and real authorization/persistence succeeds.
No authentication bypass, service-role client or fake successful save was added.
See DATABASE-APPROVAL-2026-10-26.md for the exact SQL, scope, preflight and recovery requirements.

## Verified behavior and limits
Local unit/controller tests cover normalization, optional WhatsApp, forged fields, page-save success/failure, duplicate handle errors, returning owners and safe database-unavailable states.
PGlite exercises actual PostgreSQL constraints/RLS using synthetic auth roles; it does not certify hosted JWT/PostgREST behavior.
Both the normal Next.js and parallel Workers builds retain the current App Router, Server Actions, proxy, approved landing/login, Jobs/Favorites and self-hosted Sorani font.
Local HTTP checks exercise public assets, private/no-store redirects, cross-origin rejection and real native unauthenticated create/edit/draft-action denial on both runtimes.
Real browser checks verified the one-number form, normalized preview, invalid-number feedback, WhatsApp toggle, job search, font delivery and current screenshots. No hosted page was created.
Fresh real Google sign-in/session/logout, hosted page persistence, real owner/non-owner JWT checks, field performance and physical Android remain unverified.
Development fixtures and disabled publishing are still explicit; this is not a completed live job-board release.

## Public checkpoint
Only Haldoz application/configuration/tests/docs/migrations are candidates. The allowlist and credential scanner exclude environment files except .env.example, dependencies, builds, local QA/recovery archives and unrelated project paths.
The first proper application commit uses the authenticated owner's verified GitHub login/ID and documented ID-based noreply format; no personal email or global Git identity change.
No push, main merge or deployment is authorized by this local checkpoint. Review the external upload manifest before the first push.

## Hosting
See CLOUDFLARE-RELEASE.md. The normal Next.js commands remain available.
Workers configuration is a parallel vinext candidate, not a replacement application. No Cloudflare resource has been created or modified.
