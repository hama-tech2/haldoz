# Haldoz dependency review — 22 October 2026

## Installed and reproduced
Runtime: Next 16.4.2, React/React DOM 19.3.1.
Development: TypeScript 5.9.3, ESLint 9.39.5, eslint-config-next 16.4.2 and pinned Node/React type packages; exact versions in package.json/package-lock.json.
Node >=22.18.0 (this PC 24.19.0). npm is existing workspace 12.2.0; no global installation.
Clean npm ci --ignore-scripts passed; the final dependency tree has no invalid peers. npm caches/temp stay under .local; Next build output is ignored .next.
Production tests/lint/types/build pass. This does not certify all vendored code or future cloud dependencies.

## Remaining advisory
The complete audit reports 5 high affected package entries, not five independent vulnerabilities:
eslint-config-next -> @next/eslint-plugin-next -> fast-glob -> micromatch -> braces.
The root advisory is GHSA-vfj7-8cjw-p6xm, nested-pattern stack-exhaustion denial of service:
https://github.com/advisories/GHSA-vfj7-8cjw-p6xm

The current production-only audit reports ZERO findings. The observed affected chain is development lint tooling. Keep lint/build inputs trusted; do not expose glob evaluation of untrusted input as a network service. No full formal exploit reachability assessment was performed.
npm suggested downgrading eslint-config-next to 14.2.35 via force fix. That is not an appropriate compatible fix for Next 16 and was NOT applied.
Raw snapshots: .local/audit-initial.json, .local/audit-final.json, .local/audit-production.json.

## Lint ecosystem support mismatch
ESLint 9.39.5 emits a no-longer-supported warning.
Checked current ESLint 10.13.0: lint itself ran, but npm ls reported ELSPROBLEMS because eslint-plugin-import 2.32.0, jsx-a11y 6.10.2 and react 7.37.5 do not declare compatibility with 10.
Restored compatible 9.39.5; final npm ls --all is valid, lint passes. Do not hide this limitation, force peer resolution, or describe the unsupported-version warning as fixed.
Revisit supported compatible upstream releases before a public release. No automatic major framework/linter changes.

## Script policy and certificates
npm's default policy blocked unrs-resolver@1.12.2 postinstall. No permission expansion; a clean install with lifecycle scripts ignored still passed lint/build using available platform packages.
Registry TLS initially failed with UNABLE_TO_VERIFY_LEAF_SIGNATURE. Process-only --use-system-ca resolved it with normal verification. No strict-ssl=false or insecure TLS environment setting.
