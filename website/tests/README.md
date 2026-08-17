# Tests · Vibe Coding Wiki

## Overview

| Type | Tool | Count | Coverage |
|---|---|---|---|
| Unit | vitest + happy-dom | 24 | search algo, data integrity, related-algo |
| E2E  | playwright | 30+ | search modal, term detail, theme, mobile nav, home page |

All tests live under `website/tests/`.

## Run locally

```bash
cd website
npm install
npm run test:unit           # vitest unit tests (fast, ~1s)
npm run test:e2e            # playwright e2e (requires chromium install)
```

### Install Playwright browsers

```bash
npx playwright install chromium
```

If install hangs (network issues, no proxy access), use the CI workflow instead:
- Push to `main` triggers `.github/workflows/test.yml`
- Both unit + e2e run on GitHub-hosted ubuntu-latest

## Unit test files

- `tests/unit/data.test.js` — 178 terms integrity (fields, layer, related refs, distribution)
- `tests/unit/search.test.js` — search algorithm (vague query, ranking, case-insensitive)
- `tests/unit/related-algo.test.js` — VC_RELATED_ALGO (5-8 results, no orphans, no self-refs)

## E2E test files

- `tests/e2e/home.spec.js` — home page rendering + og:image meta
- `tests/e2e/search.spec.js` — Cmd+K modal, results, Enter to navigate, Escape to close
- `tests/e2e/term-detail.spec.js` — parameter-sweep over all 178 term pages (HTTP 200)
- `tests/e2e/theme.spec.js` — light/dark toggle + localStorage persistence
- `tests/e2e/mobile.spec.js` — hamburger menu (< 768px), aria-expanded

## CI

- PR → `main` triggers `Tests` workflow
- Unit tests run first (~5s)
- E2E runs after unit (~2min with chromium install)
- Artifacts: vitest coverage, playwright HTML report, test results

## Static server

Tests use `python3 -m http.server 8765` to serve the static site. Playwright config auto-starts it via `webServer` block.

## Debugging

```bash
# Run single test file
npx vitest run tests/unit/search.test.js

# Run single e2e spec
npx playwright test tests/e2e/search.spec.js --headed

# Show playwright trace
npx playwright show-report
```
