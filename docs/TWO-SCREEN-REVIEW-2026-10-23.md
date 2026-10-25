# Haldoz approved two-screen implementation — 23 October 2026

## Scope and references
Only the existing / landing and /create login screens were redesigned. No mockup generation, new sign-in method, owner-workflow implementation, hosted write, migration application, push or deployment.
Both attached files were directly opened. The request's labels are reversed relative to image content: 1-1000084544.png contains the landing reference; 2-1000084543.jpg contains the Google-login reference. Content was mapped to the matching routes.
Reference SHA256:
- Landing image: b4ea0d3c244a40c86b936728ec8bf3ce1a8c876ffa9a0ca5e26862e9baf66010
- Login image: abc2d56c982f6cf71d6f7b87e0017097910c51c7259dcdef3429ede67d59aacf

## Actual changes
- src/app/page.tsx: compact landing, small blue Kurdish wordmark, one heading/supporting sentence, exact CTA پەڕە دروست بکە, real /create and /jobs links.
- src/app/create/page.tsx: exact heading پەڕەی خۆت دروست بکە, one Google-only sign-in button, brief explanation, back/public-jobs navigation and honest unavailable/error states.
- src/components/entry-header.tsx: small shared header for these two routes only; decorative multicolor Google mark. No briefcase brand tile or extra English brand line.
- src/app/entry.css: isolated two-screen styles. Existing owner.css, SiteHeader, job search/cards/Favorites, Page Setup, profiles, auth handlers, migrations and dependencies were not modified by this task.
Removed the landing's large fictional profile preview, marketing steps/trust panels and lengthy copy, plus the login benefit list/form-preview CTA. Preserved all existing functionality elsewhere.
No simulated iPhone/Safari UI, illustrative haldoz.com address, large decorative waves, extra authentication options or fake working login.

## Typography and comparison
Kept the existing single self-hosted Vazirmatn variable font, rather than adding another font/download. Its fresh glyph/shaping test passes for Sorani-specific letters and mixed Latin/digits. Actual browser font check true, computed family Vazirmatn, no synthetic bitmap text.
At 390 CSS px: wordmark 26px/600; landing heading 28px/600; login heading 26px/600; body 15px/400; controls 15–16px/500; normal Arabic letter spacing. 600 is reserved for the wordmark/headings, not body copy.
Compared directly with the attached references: same blue-wordmark/white-header/pale-background identity, landing aligned RTL, login centered, Google button and back access retained. Reduced reference text size/top spacing, removed browser chrome and oversized marketing areas, used accessible #1D4ED8 actions rather than the reference's lighter normal-text blue.
No font replacement was necessary after actual rendering/glyph inspection; fluent owner judgment of Sorani typography remains part of review.

## Fresh automated verification
node scripts/tool.mjs npm run check: exit 0. 26/26 tests, basic working/index credential scan, ESLint --max-warnings=0, next typegen/tsc and optimized production build passed.
Existing synthetic PostgreSQL authorization tests also passed; this does not prove hosted RLS/JWT/OAuth.
node scripts/tool.mjs npm run verify:http: passed six routes 200, missing route 404, RTL/lang/noindex, headers, all referenced local assets and WOFF2 delivery.
Landing HTML 7,999 bytes (previous local slice 20,663), login 11,713 bytes (previous 14,076). HTML-referenced JS gzip estimate 176,509 bytes on both; font 111,152 bytes. These are local estimates, not field Web Vitals or a claim of low-end device performance.
node scripts/verify-owner-routes.mjs: passed unavailable login/save states, unselected disclosure, cross-origin POST denial, callback destination restriction, reserved handle 404 and honest backend-unavailable state.
No dependencies changed or fresh dependency audit run in this styling task. Prior dev-tool advisory remains in DEPENDENCY-REVIEW.md.

## Real browser evidence — new, not historical
Actual in-app Chromium browser against the rebuilt/restarted production server http://127.0.0.1:3100.
- At 390x844, innerWidth/clientWidth/scrollWidth all exactly 390 on both pages; one h1 on each.
- Header links/back targets >=48px; landing CTA 52px; sole Google button 54px and disabled; no password inputs or other login methods.
- Both routes had zero horizontal overflow at 320, 390 and 1024 CSS pixels. Layout metrics: .local/qa/two-screen-layout-20261023.json.
- Landing Create Page -> /create worked; header back -> / worked; login public-jobs link -> /jobs worked without authentication.
- Keyboard Tab showed 3px #1D4ED8 outline with 4px offset on the jobs link.
- Existing jobs browser remained functional: Arabic ك search كۆمپیوتەر matched one Sorani computer-support result; clearing restored the list. Favorites opened with its two existing saved jobs. No saved data was added/removed.
- Captured page warning/error logs empty.
- Actual JPEG screenshots: .local/qa/landing-final-390-20261023.jpg and login-final-390-20261023.jpg, both 390x844 viewport captures. The screenshots contain real DOM text, not AI/mockups.
Landing and login tabs were left open as deliverables; temporary viewport override reset.
UNVERIFIED: physical Android/TalkBack, actual 200% browser zoom, fluent-language approval, field performance.

## Supabase and Google status
Fresh value-redacted local check: publishable key still absent; HALDOZ_AUTH_READY=false. Owner was asked asynchronously to fill only the existing key field in ignored .env.local; local styling work continued. No pointless unauthenticated connection retry was made.
The owner previously reported kurdish-jobs in Google's Client IDs field, which is not a valid Web OAuth Client ID. This hosted field was not independently read/changed. Google login remains disabled and unverified. No OAuth attempt, auth-user creation or cloud setting change occurred.
Before real login: save the confirmed publishable key privately; create/use a real Google Web OAuth Client ID ending .apps.googleusercontent.com with its secret in Supabase only; Google redirect https://wickyjtjhgfzntifuzac.supabase.co/auth/v1/callback; preserve/add Supabase allowed app redirect http://127.0.0.1:3100/auth/callback. Review the shared project's existing settings before approved changes. Enable local auth only after configuration review, then test the real consent/callback flow.
HALDOZ_PAGES_READY remains false; hosted migration/security-review gates remain separate. See SUPABASE-REVIEW.md. No claim that Google-enabled settings alone prove credentials work.

## Git / recovery / continuation
Branch milestone/home-v1; HEAD d624613ed7c3a3db2c15a7cde8f83b835d243ab1. Original 33 staged entries preserved; no commit/push/reset/discard.
Pre-change copies of the two routes: .local/qa/two-screen-before-20261023/. Earlier complete recovery ZIPs preserved.
Final source snapshot/checkpoint: .local/qa/two-screen-final-source-20261023.zip and two-screen-checkpoint-20261023.json. Environment files/build outputs/node_modules/QA are excluded from the source ZIP.
DONE: two local screens, reference comparison, real 390px screenshots, checks/build and browser navigation.
UNVERIFIED: Google login and hosted connection, native-device/accessibility/language/field checks above.
MISSING/BLOCKED: key/provider configuration; real end-to-end owner flow remains outside this design task.
STOP here for owner review. Approved future journey is Google -> Page Setup -> My Page -> Edit Profile -> Publish Job -> Copy Public Link; do not implement those next actions or continue Dashboard/publishing before review.
NEXT OWNER ACTION: review the two real browser screenshots.
