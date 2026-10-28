# Haldoz form and profile slice — 27 October 2026

## Implemented
- New-page initialization discards supplied contact defaults, even if account/preview props contain a number. Edit mode retains the server-loaded owner's saved contact. The requested Sorani phone placeholder is present. No phone value is imported from Google.
- One phone field, optional same-number WhatsApp and unchecked explicit public-contact consent remain. Raw typing is preserved; actual FormData (including any browser autofill) is validated/normalized on submission. Autofill is a browser action, not an application default; live autofill behavior has not been observed in this slice.
- Removed the separate Check Information button. Save performs validation; errors focus the relevant field. Errors/success messages are not presented while the user edits a stale submission. The server remains authoritative.
- Natural Sorani, Arabic and English display names/spaces are accepted separately from the ASCII handle. Unicode code-point limits match PostgreSQL character counting. Control characters and bidirectional overrides are rejected while natural joining marks are retained. Display names have no Latin-only pattern or forced case conversion.
- Duplicate handles identify the URL field. A concurrent second creation checks the verified owner's saved page before reporting a handle conflict; database errors are not reported as name conflicts.
- Add Job is the single primary owner action. Edit and Copy Link are secondary; dashboard access remains. Draft navigation no longer repeats Add Job.
- Shared owner/public profile has larger readable type, a quieter cover/initial avatar, compact Call/WhatsApp controls and a clear zero-job state. Empty real bios do not show instructional placeholder copy. Guests receive no owner actions.
- Form labels/controls are 16px; supporting text is generally 14px. Optional appearance is collapsed. Optional job salary/time fields were already collapsed and remain so. Approved landing/login, dependency versions, migration SQL and recovered originals were not changed.

## Fresh verification
- 68 automated tests passed, including synthetic PostgreSQL/RLS ownership tests and new phone-default, multilingual-name and handle-conflict cases.
- Credential/path scans and private owner-contact fingerprint scan passed. No private contact values are written to this report.
- ESLint, TypeScript and optimized Next.js production build passed. A restricted-sandbox webpack attempt returned a generic compile failure; the normal Windows process build completed successfully without source workarounds or disabled TLS.
- The production Next server on 127.0.0.1:3100 passed public-route, font, header, 404, owner-route and native unauthenticated profile/draft action checks. Server process has HALDOZ_PAGES_READY=true; saved .env.local remains unchanged.
- Updated vinext build passed. Local workerd on port 3102 passed all four HTTP/authorization scripts with authentication/pages readiness explicitly false. This verifies fail-closed boundaries, not live Cloudflare OAuth or authenticated edge writes. Existing upstream sourcemap/dynamic-import/route-classification warnings remain.
- Read-only hosted counts: one page, one private ownership record, zero drafts and zero active jobs. Initial metadata query mistakenly requested a nonexistent updated_at column; corrected read-only query succeeded. No database changes were made.
- Two anonymous HTTP requests to the actual saved public profile returned 200, matched its saved contact fingerprint and contained neither owner controls nor a demo replacement. This verifies repeated anonymous reads, not a signed-in browser edit.
- Server-rendered New Page phone value is empty; public consent is unchecked. Browser autofill remains a separate unverified behavior.
- Original approved migration SHA-256 remains 8141BA8ED3E60EFF0C717046A51722CAD042EB2067C476886FF57D2855FD5FC7.

## Browser evidence and exact limitation
No new application screenshots were captured in this slice. Do not present older images as current evidence.
The browser connector returned no enabled browsers (IAB unavailable). Native Chrome fallback opened the profile picker and a Guest window, then lost the target with `foreground window did not report a process id`; refreshed inventory showed Chrome no longer running. The cause of closure is unverified. No repeated login or browser retries are needed.
The owner was asked to open http://127.0.0.1:3100/owner in normal Chrome, sign in if necessary and open Edit Profile. Await the actual result. Google exchange success logs and an existing saved page predate this slice; owner editing, reload after edit, draft save/reopen and independent non-owner JWT checks remain unverified here. Never use privileged database writes to simulate them.
After access returns, capture actual 390px and desktop screens; check 320/360/390/412px, keyboard focus, 200% zoom, clipped text, phone autofill, optional sections and submit errors. Keep screenshots containing the owner's contact outside Git.

## Font decision
Retained the approved self-hosted Vazirmatn. Actual bundled font shaping/glyph checks pass for Sorani-specific letters and connected samples. Official Noto Sans Arabic was downloaded only into ignored local QA for comparison; the same sample has no missing glyphs or missing shaped glyphs in either font. This is not a visual readability judgment. Noto's different vertical metrics still need real browser/fluent Sorani review before substitution. The 844,676-byte comparison TTF and the existing 111,152-byte WOFF2 are different formats, so these are not an optimized payload comparison. No second font is shipped.

## Pattern references (adapted, not copied)
- [Linear](https://linear.app/now/how-we-redesigned-the-linear-ui): clearer hierarchy and reduced visual noise.
- [Linktree](https://linktr.ee/help/en/articles/5434136-sharing-your-linktree): readily accessible sharing/copy action.
- [Indeed employer dashboard](https://www.indeed.com/hire/resources/howtohub/employer-dashboard-frequently-asked-questions?co=US&hl=en): separate job management from public viewing.
- [GOV.UK names](https://design-system.service.gov.uk/patterns/names/), [text input](https://design-system.service.gov.uk/components/text-input/) and [errors](https://design-system.service.gov.uk/components/error-message/): natural names, persistent labels and specific actionable errors.
- [Nielsen Norman Group](https://www.nngroup.com/articles/form-design-placeholders/): placeholders do not replace labels.
- [Official Noto font source](https://github.com/google/fonts/tree/main/ofl/notosansarabic).

## Remaining product/release gaps
Publishing/public job details, active-job loading, placement-fee fields/disclosure and genuine banner/avatar uploads remain unfinished. Do not expose upload or publication controls as complete. Initial database grants deliberately prohibit publication; any publication SQL needs separate review/approval. Existing /jobs, /favorites and /preview/* still contain explicitly labeled development fixtures; isolate them from a hosted public release before deploying. No fake statistics or badges were added.
Cloudflare preview is not live. Read docs/CLOUDFLARE-RELEASE.md for verified account/tool status and concrete remaining steps. No main merge, hosted write, Auth setting change or deployment occurred in this slice.
