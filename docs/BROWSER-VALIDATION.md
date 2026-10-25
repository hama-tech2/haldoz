# Haldoz Milestone 1 browser validation

22 October 2026; real in-app Chromium-based browser on Windows, production build on http://127.0.0.1:3100. Fictional data only. Browser viewport emulation is NOT an Android phone test.

## Verified interactions
- Home initially shows 6 of 12 jobs and a real Load More button; reveals all 12.
- Entered Arabic variant كۆمپیوتەر -> one Sorani computer-support result.
- Selected هەولێر + فرۆشتن + بەیانی -> exactly فرۆشیار.
- Added a nonmatching search -> zero results and recovery control. Reset restores full results.
- Saved sales job -> real /favorites route -> exactly saved job. Full browser reload + hydration retained it.
- Removed saved job -> empty Favorites prompt and real link to Home.
- Keyboard Tab from search reached city. Computed visible focus outline was 3px rgb(29,78,216). ArrowDown/Enter changed city to هەولێر and 5 results.
- All screenshots/flows use real rendered DOM, not generated images.
- Final captured browser warn/error log: empty.

## Layout and font
| Requested width | Document client/content width | Horizontal overflow | Selector height | First card |
|---|---|---|---|---|
| 320 | 305 / 305 | No | 48px | 190px |
| 360 | 345 / 345 | No | 48px | 190px |
| 390 | 375 / 375 | No | 48px | 190px |
| 412 | 397 / 397 | No | 48px | 190px |
| 1024 | 1009 / 1009 | No | 48px | 197px |

Scrollbar accounts for the narrower client width.
Final font-family: Vazirmatn, Vazirmatn Fallback, Tahoma, Arial, sans-serif. Browser font check true; same-origin preload present and HTTP-delivered WOFF2 validated. Glyph/shaping coverage is independently checked in tests/font.test.mjs.
Mobile 390x844 and desktop 1024x900 screenshots: .local/qa/home-mobile.jpg and home-desktop.jpg.
Original Home reference directly reopened; local reference hash documented in design.md.

## Boundaries
Actual 200% browser zoom was attempted through a keyboard probe but no viewport/pixel ratio change occurred; UNVERIFIED. Do not substitute responsive widths for actual zoom.
Android Chrome, TalkBack, other browsers, reduced-motion user-preference activation, low-bandwidth timing, Lighthouse and field p75 Web Vitals remain UNVERIFIED.
Reduced-motion handling is present in CSS but preference behavior was not exercised in this browser.
Blocked/corrupt storage, external-tab refresh and route remount fallback are synthetic tests; not browser privacy-setting changes.
Sorani wording and visual preference require fluent owner review.
The initial Favorites exact-name locator stopped matching once the visible saved count became part of the accessible name; re-inspected DOM and used the correct updated name. No evidence of a broken navigation action.
