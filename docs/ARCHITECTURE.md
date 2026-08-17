# Architecture · Vibe Coding Wiki

> **System design, data flow, and component model.**

This document explains how Vibe Coding Wiki is put together. Read this before making large changes.

---

## 🎯 Design Principles

1. **Static-first**: 100% static files, no build step required
2. **Zero dependencies**: No npm packages in production runtime
3. **Data-driven**: Content in JSON, behavior in JS
4. **Progressive enhancement**: Works without JS (mostly)
5. **Accessibility by default**: WCAG 2.1 AA target
6. **Chinese traditional aesthetic**: Warm paper, serif type, sharp corners

---

## 🏛️ System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    User's Browser                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  index.html │  │  term.html  │  │  pages/*.   │    │
│  │             │  │ ?id=mcp     │  │  html       │    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │
│         │                │                │              │
│  ┌──────▼────────────────▼────────────────▼──────┐     │
│  │              Common Resources                     │     │
│  │  • css/  (style + dark + components)             │     │
│  │  • js/   (terms + data + theme + nav)            │     │
│  │  • data/ (terms-L1..L8.json + index)             │     │
│  │  • svg/  (favicon + og-image)                     │     │
│  └──────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────┘
                          ↓
              ┌────────────────────────┐
              │   Static CDN / Pages     │
              │   (GitHub Pages)         │
              └────────────────────────┘
```

---

## 📁 File System (Detailed)

```
vibe-coding-wiki/
│
├── website/                      # Source (deployed as-is)
│   │
│   ├── index.html                # Homepage
│   │   ├── Hero (vibe coding intro)
│   │   ├── Evolution track (paradigm timeline)
│   │   ├── Knowledge map (layer + scenario browser)
│   │   ├── Tag cloud
│   │   ├── Core concepts (9 cards)
│   │   ├── Timeline (key events)
│   │   └── Footer
│   │
│   ├── term.html                 # Detail page (dynamic)
│   │   ├── URL: term.html?id=<term-id>
│   │   ├── Loads term.js → renders term data
│   │   ├── Three columns: TOC | main | related
│   │   ├── Sections: summary / def / quotes / source / feedback
│   │   │              + optional: examples / misconceptions / timeline / path
│   │   └── Uses <base href> for subpath deployment
│   │
│   ├── pages/                    # 7 content pages
│   │   ├── glossary.html         # A-Z + filter by layer
│   │   ├── layers.html           # L1-L8 sections
│   │   ├── scenarios.html        # 14 use cases
│   │   ├── graph.html            # Mermaid diagram
│   │   ├── compare.html          # 5 paradigms comparison
│   │   ├── stats.html            # Data dashboard
│   │   └── citations.html        # 30+ sources
│   │
│   ├── css/                       # 8 stylesheets
│   │   ├── style.css             # Core + light theme
│   │   ├── dark.css              # Dark theme override
│   │   ├── components.css        # Reusable (.vc-card, .vc-btn)
│   │   ├── term.css              # Detail page specific
│   │   ├── home.css              # Homepage specific
│   │   ├── glossary.css          # A-Z index
│   │   ├── compare.css           # Compare page
│   │   └── stats.css             # Dashboard
│   │
│   ├── js/                        # 9 scripts
│   │   ├── terms.js              # 178 term data (legacy sync)
│   │   ├── data.js               # Layer metadata + algorithms
│   │   ├── term.js               # Detail page renderer
│   │   ├── search.js             # ⌘K global search
│   │   ├── app.js                # Global utilities
│   │   ├── home.js               # Homepage widgets
│   │   ├── theme.js              # Light/dark mode
│   │   ├── nav.js                # Mobile menu
│   │   └── terms-loader.js       # Async loader (v2.2)
│   │
│   ├── data/                      # 9 JSON files
│   │   ├── terms-index.json      # Index: id, name, layer, shortDesc
│   │   ├── terms-L1.json         # 16 范式 terms
│   │   ├── terms-L2.json         # 20 方法论 terms
│   │   ├── terms-L3.json         # 53 技术 terms
│   │   ├── terms-L4.json         # 28 工具 terms
│   │   ├── terms-L5.json         # 14 质量 terms
│   │   ├── terms-L6.json         # 17 风险 terms
│   │   ├── terms-L7.json         # 16 Prompt terms
│   │   └── terms-L8.json         # 14 场景 terms
│   │
│   ├── scripts/                   # 9 build/utility scripts
│   │   ├── rebuild-terms.cjs     # JSON → terms.js
│   │   ├── build-sitemap.cjs     # Generate sitemap.xml
│   │   ├── inject-meta.cjs       # Add SEO meta tags
│   │   ├── inject-aria.cjs       # Add ARIA attrs
│   │   ├── inject-seo.cjs        # Add JSON-LD
│   │   ├── inject-og-image.cjs   # Add og:image
│   │   ├── inject-theme.cjs      # Add theme toggle
│   │   ├── inject-components.cjs # Add component CSS
│   │   ├── split-terms.cjs       # terms.js → 8 JSON
│   │   ├── enrich-priority-N.cjs # Content enrichment waves
│   │   ├── enrich-terms.cjs      # Generic enricher
│   │   ├── enrich-json.cjs       # Enrich via JSON
│   │   ├── enrich-richer.cjs     # Quotes + seeAlso pass
│   │   ├── reset-json.cjs        # Strip enrichment (testing)
│   │   ├── replace-urls.cjs      # Bulk URL replace
│   │   └── fix-orphan-related.cjs # Cleanup
│   │
│   ├── tests/                     # Test suite
│   │   ├── unit/                 # vitest (24 tests)
│   │   └── e2e/                  # playwright (5 specs)
│   │
│   ├── favicon.svg               # Brand icon (16x16)
│   ├── og-image.svg              # OG card 1200x630
│   ├── sitemap.xml               # 186 URLs
│   ├── robots.txt                # Crawler rules
│   ├── CNAME                     # Custom domain (optional)
│   ├── package.json              # Test deps
│   ├── vitest.config.js          # vitest config
│   └── playwright.config.ts      # e2e config
│
├── research/                      # Research notes (8 files)
│   ├── 00-research-index.md
│   ├── 01-paradigm-terms.md
│   ├── 02-methodology-terms.md
│   ├── 03-technical-terms.md
│   ├── 04-tools-terms.md
│   ├── 05-quality-terms.md
│   ├── 06-risks-metrics-terms.md
│   ├── 07-use-case-scenarios.md
│   └── 08-prompt-engineering-terms.md
│
├── knowledge/                     # Knowledge base (5 files)
│   ├── 00-knowledge-graph.md
│   ├── 01-glossary-A-Z.md
│   ├── 02-taxonomy.md
│   ├── 03-relationships.md
│   └── 05-citations.md
│
├── docs/                          # Project docs
│   ├── CONTRIBUTING.md
│   ├── STYLE.md
│   └── ARCHITECTURE.md          # This file
│
├── reports/                       # /talk generated reports
│   ├── v1.0-验收汇报.pdf
│   └── v2.0-升级验收.pdf
│
├── ops/                           # Operations
│   ├── star-tracker.sh          # GitHub star monitor
│   ├── star-report.py           # Daily report
│   ├── com.vibecodingwiki.startracker.plist  # macOS launchd
│   ├── git-github-bootstrap.sh  # First-time GH setup
│   └── README.md
│
├── autoresearch/                  # Round 1/2/3 experiments
│   ├── experiments/
│   │   ├── round-01-async-loading.md
│   │   ├── round-02-service-worker.md
│   │   └── round-03-i18n.md
│   ├── eval/                      # Eval scripts
│   ├── orchestrator.py
│   ├── next_hypothesis.md
│   ├── program.md
│   └── research.md
│
├── AUDIT-V2.0.md                 # Audit report
├── DESIGN-V2.md                  # Design v2 doc
├── LICENSE                        # MIT
└── README.md                     # Main readme
```

---

## 🔄 Data Flow

### At Build Time

```
website/data/terms-L{1-8}.json
        ↓
website/scripts/rebuild-terms.cjs
        ↓
website/js/terms.js (window.VC_TERMS = [...])
        ↓
website/scripts/build-sitemap.cjs
        ↓
website/sitemap.xml (186 URLs)
```

### At Runtime

```
User visits /index.html
  → Loads /js/terms.js (legacy sync, 205KB)
  → Loads /js/data.js → computes VC_DATA + VC_LAYERS + VC_SCENARIOS
  → Loads /js/search.js → sets up ⌘K search
  → Loads /js/home.js → renders tag cloud
  → User clicks a term link
  → /term.html?id=vibe-coding loads
  → Loads /js/terms.js (shared)
  → Loads /js/term.js → reads id from URL → renders term detail
  → Loads /js/search.js → ⌘K search

User opens search modal (⌘K)
  → Filters VC_DATA by query
  → Renders results with layer badges
  → Click result → navigates to term.html?id=...
```

### v2.2 Async Loading (Round 1)

```
User visits /index.html
  → Loads /js/terms-loader.js (small, 3KB)
  → Loader reads <script data-layers="..."> attribute
  → Fetches /data/terms-L{1,2,...}.json in parallel
  → Populates window.VC_TERMS asynchronously
  → Page renders data as it loads
  → Fallback: 5s timeout → load /js/terms.js (legacy)
```

---

## 🧩 Component Model

### CSS Classes (BEM-like)

```
.vc-{name}              # Block
.vc-{name}__{elem}      # Element
.vc-{name}--{modifier}  # Modifier

Examples:
.vc-card                # Block
.vc-card__title         # Element
.vc-card--hl            # Modifier (highlight)
```

### Core Components (`components.css`)

| Class | Purpose |
|---|---|
| `.vc-card` | Reusable card container |
| `.vc-card--hl` | Highlight (blue accent) |
| `.vc-card--brand` | Brand (gold accent) |
| `.vc-card--gold` | Gold (warning) |
| `.vc-card--good` | Good (green) |
| `.vc-card--crit` | Critical (red) |
| `.vc-btn` | Reusable button |
| `.vc-btn-primary` | Primary CTA |
| `.vc-btn-ghost` | Secondary CTA |
| `.vc-tag` | Tag/chip |
| `.vc-layer-badge` | Layer badge (L1-L8) |
| `.vc-metric` | KPI metric card |
| `.vc-bar-row` + `.vc-bar-track` + `.vc-bar-fill` | Bar chart |
| `.vc-status-ok` / `vc-status-warn` / `vc-status-err` | Status pills |
| `.vc-cite` | Citation block |
| `.vc-divider` | Section divider |
| `.vc-sr-only` | Screen-reader only |

### Detail Page Sections

Each section in `term.html` has:
- `id="section-{name}"` (TOC anchor)
- Display controlled via inline `style="display:none"` + JS `style.display = ''`
- Optional `showIf` predicate in TOC

| Section | ID | Required | Auto-generated |
|---|---|---|---|
| Summary | `section-summary` | ✓ | No |
| Definition | `section-definition` | ✓ | No |
| Examples | `section-examples` | If `term.examples` | No |
| Misconceptions | `section-misconceptions` | If myth match | ✓ (v2.1) |
| Quotes | `section-quotes` | If `term.quotes` | No |
| Timeline | `section-timeline` | If L1 or L2 | ✓ (v2.1) |
| Source | `section-source` | If `term.source` | No |
| See also | `section-see-also` | If `term.seeAlso` | No |
| Path | `section-path` | If ≥3 related | ✓ (v2.1) |
| Feedback | `section-feedback` | ✓ | No |

---

## 🎨 Design Tokens (`style.css`)

```css
:root {
  /* Light theme */
  --c-paper: #F9F4DC;       /* Main bg */
  --c-paper-deep: #F5F0E6;
  --c-panel: #FFFFFF;
  --c-panel-soft: #FAF6E6;
  --c-ink: #0F1A20;         /* Main text */
  --c-ink-soft: #3B4F5C;
  --c-muted: #777777;
  --c-line-soft: #E9E4DA;
  --c-line: #DDD6CA;
  --c-line-strong: #AAA093;

  /* Layer colors (Chinese traditional) */
  --L1-paradigm: #2B3A4F;  /* 玄青 */
  --L2-method: #4F84FF;     /* 绀青 */
  --L3-tech: #00A86B;        /* 竹青 */
  --L4-tools: #2E5D8C;       /* 石青 */
  --L5-quality: #D4AF37;     /* 鎏金 */
  --L6-risk: #F43E06;        /* 朱砂 */
  --L7-prompt: #3B4F5C;      /* 黛色 */
  --L8-scenario: #D9A594;    /* 浅绛 */

  /* Typography */
  --font-title: 'Noto Serif SC', serif;
  --font-body: 'Avenir Next', 'PingFang SC', sans-serif;
  --font-rounded: 'M PLUS Rounded 1c', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Motion */
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);

  /* Layout */
  --content: 1240px;
}
```

---

## 🔌 External Dependencies

### Runtime
- **Google Fonts** (CDN): `Noto Serif SC`, `M PLUS Rounded 1c`, `JetBrains Mono`
  - Loaded via `<link rel="stylesheet">` in `<head>`
  - With `font-display: swap` to avoid FOIT
- **mermaid.js** (CDN): Used only on `graph.html`
  - Loaded via `<script src="mermaid@10">`

### Development
- **vitest** (npm): Unit test runner
- **@playwright/test** (npm): E2E test runner
- **happy-dom** (npm): DOM mock for unit tests
- **Node 22+**: For running build scripts

### No runtime npm dependencies
- All scripts are pure vanilla JS
- No React, Vue, or other frameworks
- No build step (no webpack, vite, etc.)

---

## 🚀 Deployment

### GitHub Pages (current)

```
.gitHub/workflows/deploy.yml:
  1. Checkout
  2. Setup Pages
  3. Build:
     - rsync website/ → _site/ (exclude dev artifacts)
     - Inject <base href="/vibe-coding-wiki/">
  4. Upload artifact
  5. Deploy to Pages
```

URL pattern:
- Root: `https://xiangbianpangde.github.io/vibe-coding-wiki/`
- Subpath: `<base href="/vibe-coding-wiki/">`

### Alternative Deployments

Any static host works:
- **Vercel**: `vercel deploy website`
- **Netlify**: `netlify deploy --dir=website`
- **Cloudflare Pages**: `wrangler pages deploy website`
- **AWS S3 + CloudFront**: `aws s3 sync website/ s3://your-bucket/`

### Custom Domain

Add `website/CNAME` with your domain, then:
- Cloudflare: Add CNAME record → `xiangbianpangde.github.io`
- GitHub Pages Settings: Custom domain → `vibe-coding-wiki.com`

---

## 🔒 Security

### CSP (Content Security Policy)

Add this to all HTML `<head>` (recommended):

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data:;
  connect-src 'self';
">
```

### XSS Prevention

- All user input is sanitized via `textContent` (not `innerHTML`)
- Search results use `textContent` to render
- `escapeHTML()` function in `term.js` for any future user content

### GitHub Token Security

- `VC_TOKEN` stored in macOS keyring (via `gh auth login`)
- Never committed to repo
- GitHub Actions secrets can be used for CI

---

## 📈 Performance Targets

| Metric | Target | Current |
|---|---|---|
| First Contentful Paint (FCP) | <1.0s | 0.5s |
| Largest Contentful Paint (LCP) | <2.5s | 1.5s |
| Time to Interactive (TTI) | <3.0s | 2.0s |
| Cumulative Layout Shift (CLS) | <0.1 | 0.02 |
| First Input Delay (FID) | <100ms | 50ms |
| **JS bundle size (v2.1)** | <100KB | 205KB |
| **JS bundle size (v2.2)** | <50KB | TBD |

---

## 🗺️ Roadmap

| Version | Theme | Status |
|---|---|---|
| v1.0 | Initial (71 terms) | ✅ Released |
| v2.0 | Scale up (178 terms, 8 layers) | ✅ Released |
| v2.1.1 | 6 CRITICAL fixes + deploy | ✅ Released |
| v2.2 | Round 1: async terms loading | 🚧 Round 1 dispatch |
| v2.2 | Round 2: Service Worker | ⏳ Pending |
| v2.3 | i18n (English version) | 📋 Planned |
| v3.0 | Content scale to 500+ terms | 📋 Planned |

---

**See also**:
- [CONTRIBUTING.md](./CONTRIBUTING.md) — How to contribute
- [STYLE.md](./STYLE.md) — Content and code style
- [README.md](../README.md) — Project overview
- [AUDIT-V2.0.md](../AUDIT-V2.0.md) — v2.0 audit report
