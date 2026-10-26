# Haldoz design contract — Milestone 1

Approved scope: public Home V1 + reusable compact Job Card + Sorani typography + local Favorites. Owner authorized implementation and this document on 22 October 2026. Entirely free MVP. No auth, payments, Wayl, subscription, advertising, sponsorship, employer workflow or deployment.

## Source and approval
The original Home V2 attachment (image 7) was directly reopened on 22 October, not reconstructed from a summary.
SHA-256: BBE5727C3258B2D3730C1D56A4DE41C2C77B4C7105D6B62AF39A2CD354A950E7.
An ignored local copy is kept at .local/references/home-v2.jpg. The screenshot is a reference, not product code or a claim of font accuracy. No photographed job thumbnails or reference-company logos are shipped.
Earlier 14 attachments contain 11 distinct concepts: 12=5, 13=6, 14=3. Their other workflows remain future scope.

## Typography
Self-host official Vazirmatn variable WOFF2, release v33.003, with its SIL Open Font License. Use actual shaped text, never text baked into images.
Weights: 400 body, 500 controls/labels, 600 headings/salary. Avoid blanket 700/800 or synthetic bold.
Body 16 CSS px, main heading 25–34 depending on width, card title 19, secondary job facts 13 (small timestamps 10–11). Relative/rem sizing should preserve zoom; no fixed-height text containers. Comfortable line-height around 1.7–1.8.
Noto Sans Arabic is the alternative if real device/Sorani review finds Vazirmatn unsuitable; it is not bundled as a second font.
Check ڕ ڵ ۆ ێ ە ک گ چ ژ, connected words, diacritics and long titles. A fluent Sorani reviewer must still confirm copy. Mixed Latin currency/hours must be directionally isolated.
Official source: https://github.com/rastikerdar/vazirmatn

## Colors
| Role | Value | Rule |
|---|---|---|
| Background | #F7FAFF | Light blue-white canvas |
| Surface | #FFFFFF | Cards and controls |
| Brand accent | #3B82F6 | Preserve reference identity; not normal blue text on white |
| Action/text blue | #1D4ED8 | Accessible buttons, links, selected states, salary |
| Light blue | #EAF3FF | Quiet informational surfaces |
| Ink | #253247 | Main text |
| Secondary | #526078 | Darkened from mockup #718096 |
| Decorative border | #E4EAF2 | Nonessential separators |
| Control border | #8493AA | Visible essential input boundaries |

Original #3B82F6/white is 3.68:1; #718096/white is 4.02:1. Normal text needs 4.5:1. #1D4ED8/white is 6.70:1.
Do not use color alone for selected/saved/error states. Focus rings must remain visible. Token calculations do not replace real rendered accessibility checks.

## Icons
One consistent original outline SVG set; generally 16–24 px, stroke 1.7. No icon font/CDN or decorative repeated filled badges.
Interactive areas about 48 CSS px even when glyph is smaller. Functional icons need accessible labels; decorative SVGs are hidden from assistive technology.
Only saved hearts use fill. No nonfunctional hamburger, notifications or onboarding button is shown in this milestone.

## Compact Job Card
Single shared layout across categories: small circular fictional page initial/name; job title; salary and cadence; exact known hours; workplace; short posting age; save button.
No job photograph, fake follower/view statistics, fabricated salary/hours or category-specific card structure.
No fixed aspect ratio or truncation hiding required facts. Compact spacing, fluid height, 12–15 px corners.
Unknown salary/hours and negotiable/flexible values are explicit. Overnight end times say next day.
Card navigation to a future job-details route is withheld rather than simulated. Save/unsave is functional.

## Navigation and filters
Public bottom navigation: Home / Favorites only. RTL places Home on the right. Search is at the top of Home, not another tab.
Favorites are local browser IDs; no account, sync, phone or API. Explain local-only storage and handle denied/quota/corrupt storage.
City + category + explicit declared shift labels combine with keyword search using AND.
No extra marketing hero is added to Home; search directly follows the compact header.
Hours filter uses morning/evening/night/flexible/unspecified labels; exact times remain separate. No inferred full-time classification.
Initial fixture data is fictional, visibly labeled; no real contacts or applicant data.
Six initial cards with incremental reveal; no heavy infinite-scroll library.

## RTL and responsive rules
Document lang=ckb and dir=rtl. CSS logical properties; DOM follows meaningful reading order.
Use bdi dir=ltr for time ranges and IQD values. Do not reverse digits, currency, clock icons or generic icons.
Mobile gutters 16–20 px, responsive single column; desktop can use two columns inside a restrained maximum width.
No horizontal overflow at 320/360/390/412 px. Allow larger text and 200% zoom. Bottom navigation must not cover content; respect safe area.
Reduced-motion preference disables nonessential transitions. No animation library.

## Known mockup corrections
- Replace excessive bold/malformed AI text with real font rendering.
- Shrink oversized cards; keep all comparable facts.
- Darken action and secondary colors for contrast; keep pale borders only for decoration.
- Do not reproduce huge marketing panels or nonfunctional page-creation/menu actions.
- Do not display invented follower/view counts or verification badges.
- Keep public profiles and operational dashboards distinct in later milestones.
- Later forms require meaningful privacy notices and unselected consent; no private employer phone copying to public drafts.
- New Google registration later needs a separate Page Setup after authentication.
- No online seeker application form in the website MVP.

## Validation and change control
Test actual browser interactions and inspect desktop/mobile renders, font loading, focus/zoom, storage failure and reduced motion. Real Android Chrome/TalkBack is separate from desktop viewport emulation.
Target future mobile field p75 LCP <=2.5s, INP <=200ms, CLS <=0.1; do not claim field performance from local lab checks.
Significant product/navigation/design changes require owner agreement. Record approved amendments here and actual results in docs/CURRENT-STATE.md.

Font delivery implementation: explicit same-origin /fonts/Vazirmatn-variable.woff2 preload and CSS @font-face. The initial next/font build emitted a valid font/CSS but an empty preload manifest in this Windows build; explicit preload avoids relying on that generated manifest. Fallback metric overrides come from that build's local-font output. No runtime font CDN request.

## Approved owner-first amendment — 22 October 2026
Root / is now a compact owner-first landing; discovery is retained at /jobs with Favorites at /favorites. This supersedes the earlier Home-only root rule. Existing tokens, Vazirmatn, RTL, restrained icons, 48px targets and no fake verification/statistics remain.
Create Page onboarding and public-field setup use the directly reopened original onboarding/public-profile references. PublicProfile is shared across preview and actual public route. Preview is explicitly not published, with no active contact actions. Form disclosure starts unchecked; Google account details are never auto-filled into public identity/contact.
Optional branding in this slice is a constrained color and initial. No image upload, fake office photography, followers, QR-generation promise or job-publishing control. No paid features. Buttons with missing real configuration remain disabled with a visible explanation.
Public contact numbers/handles isolate LTR text; profile biography wraps and preserves line breaks. CSS uses responsive single-column mobile and two-column desktop form/preview with no fixed text heights. These new layouts still need real browser/screen-reader/Sorani visual review: current session has no available browser surface. Do not describe CSS intent as a passed viewport test.

## FINAL landing/login references — approved 23 October 2026
The owner approved only / and /create for this task. Directly inspected attachments: 1-1000084544.png is the landing content; 2-1000084543.jpg is Google-login content despite reversed labels in the request. Hashes/comparison/evidence in docs/TWO-SCREEN-REVIEW-2026-10-23.md. These references supersede earlier landing marketing/profile-preview design.
Use a small blue هەڵدۆز text wordmark, white header, pale canvas, compact copy and minimal real navigation. No simulated browser/device chrome, illustrative URL, giant profile/marketing panels, alternative login methods or generated mockups. Landing CTA is exactly پەڕە دروست بکە. Login h1 is exactly پەڕەی خۆت دروست بکە.
Single existing self-hosted Vazirmatn: 400 body, 500 controls, 600 headings/wordmark. At 390px: 26px wordmark, 28px landing h1, 26px login h1, 15px body. Normal Arabic tracking, logical RTL spacing, visible focus and >=48px targets. Actual 390px captures now exist; not screenshot-derived text.
Workflow retained for a later reviewed task: Google Login -> Page Setup -> My Page -> Edit Profile -> Publish Job -> Copy Public Link. Successful creation must eventually expose clear owner actions; do not add dead buttons in this two-screen scope. Public profiles stay accessible without login. STOP for review before continuing that workflow.

## Local draft milestone — 23 October 2026
Approved landing/login frozen. Reuse existing light-blue tokens and self-hosted Vazirmatn for dashboard/form/review; 16px job-form controls/labels, 14px help, logical RTL layouts, >=48px controls, 320px wrapping, keyboard focus. Essential title/city before optional details; salary/hours disclosure optional. Never fabricate unknown salary/hours or views. Saved drafts are explicitly unpublished and have no public share link. Development workspace has a persistent explicit fixture notice; genuine authenticated pages do not include fixture identity/warnings. Actual mobile browser tests and screenshots recorded in DRAFT-WORKFLOW-2026-10-23.md.