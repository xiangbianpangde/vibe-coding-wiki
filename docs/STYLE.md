# Style Guide · Vibe Coding Wiki

> **Code, content, and design conventions for contributors.**

This document is the style reference for all changes to Vibe Coding Wiki. Following it keeps the codebase consistent and the content high-quality.

---

## 📝 Content Style

### Tone
- **Neutral, factual, descriptive** — not promotional
- **No "I think" or "in my opinion"** — present as established fact or attribute to source
- **No marketing language** — avoid "powerful", "amazing", "revolutionary", "best-in-class"
- **No emoji in body text** — only in section headings and metadata

### Voice
- Write in **third person** or **impersonal** ("Karpathy coined..." not "I think Karpathy...")
- **Direct definitions** — first sentence should be a clear statement
- **Active voice** preferred ("agent calls API" not "API is called by agent")

### Definitions

**Short description** (shortDesc):
- 1-2 sentences, max 200 characters
- Should be understandable in isolation
- First sentence is the canonical definition

```json
"shortDesc": "MCP (Model Context Protocol): Anthropic 2024-11 推出的开放标准，连接 AI Agent 与外部工具/数据源。AI 时代的 USB。"
```

**Long description** (longDesc):
- 200-800 characters, with HTML formatting
- Use `<p>`, `<ul>`, `<ol>`, `<strong>`, `<pre>`, `<blockquote>`
- Structure: definition → characteristics → use cases → history (if applicable)
- Use Chinese punctuation (，。：；？！) — never English punctuation in Chinese text

```json
"longDesc": "<p><strong>MCP</strong>（Model Context Protocol）：Anthropic 2024-11 推出的开放标准。</p><p><strong>类比：</strong>AI 时代的 USB / OpenAPI。</p><p><strong>核心元素：</strong></p><ul><li>MCP Server：暴露工具的进程</li><li>MCP Client：Agent 内置的客户端</li><li>协议：JSON-RPC over stdio / HTTP</li></ul>"
```

### Examples

Examples should be:
- **Real, runnable code** (not pseudo-code)
- **Minimal** (shortest example that demonstrates the concept)
- **Annotated** (use `desc` to explain what it does)

```json
"examples": [
  {
    "code": "claude mcp add --transport stdio --command \"node\" --args \"mcp-server.js\"",
    "desc": "Claude Code 添加 stdio MCP server"
  }
]
```

**Format guidelines**:
- Use `//` for comments (JS/TS), `#` for shell, `--` for SQL
- Indent with 2 spaces (or 4 for nested)
- Use backticks for inline code
- Multi-line: indent continuation 4 spaces

### Quotes

Quotes must be:
- **Verbatim** — copy exact wording from source
- **First-party** — from the author, official docs, or interview
- **Attributed** — include author and source

```json
"quotes": [
  {
    "text": "There is hallucinating. And when it does, it presents its hallucinations as if they were true.",
    "cite": "Simon Willison, 2024-04"
  }
]
```

**Avoid**:
- ❌ Fabricating quotes (use source link to verify)
- ❌ Truncating mid-sentence (use "..." only with [brackets for clarity])
- ❌ Mixing multiple speakers in one quote

### See Also

`seeAlso` links must be **first-party sources**:
- Official documentation (anthropic.com, openai.com)
- Author's personal site (simonwillison.net, karpathy.ai)
- GitHub repositories (github.com/anthropics/...)
- Original research papers (arxiv.org)
- Verifiable news articles (nytimes.com, arstechnica.com)

```json
"seeAlso": [
  { "name": "MCP 官方文档", "url": "https://modelcontextprotocol.io" },
  { "name": "Claude Code Docs", "url": "https://docs.claude.com/en/docs/claude-code" }
]
```

**Avoid**:
- ❌ Medium articles (low authority)
- ❌ Reddit / Twitter / LinkedIn (ephemeral)
- ❌ SEO-spam blogs (low quality)

### Capitalization

| Term | Style | Example |
|---|---|---|
| Product name | Title case | Claude Code, GitHub Copilot, Cursor |
| Generic term | lowercase | context window, agent loop, LLM |
| Acronym | UPPERCASE | LLM, MCP, RAG, AI |
| Layer code | L1, L2, ... L8 | L3 技术层 |
| Person name | Title case | Andrej Karpathy, Simon Willison |
| File path | lowercase | `website/data/terms-L3.json` |

### Punctuation

- **Chinese**: use `，。：；？！` (no English punctuation in Chinese)
- **English**: use `, . : ; ? !` (no Chinese punctuation in English)
- **Numbers**: use Arabic numerals (1, 2, 3) — not Chinese (一二三)
- **Code blocks**: preserve original formatting, do not auto-format

### Date Format

- **Year only**: `2025`
- **Year + month**: `2025-02`
- **Full date**: `2025-02-15`
- **ISO standard for technical**: `2025-02-15T10:30:00Z`

---

## 🎨 Design Style

### Color Palette (Chinese Traditional)

| Layer | Color | HEX | Usage |
|---|---|---|---|
| 玄青 | Dark navy | `#2B3A4F` | L1 范式 / 主文字 |
| 绀青 | Bright blue | `#4F84FF` | L2 方法 |
| 竹青 | Emerald | `#00A86B` | L3 技术 / 成功 |
| 石青 | Steel blue | `#2E5D8C` | L4 工具 / 主品牌 |
| 鎏金 | Gold | `#D4AF37` | L5 质量 / 高亮 |
| 朱砂 | Cinnabar red | `#F43E06` | L6 风险 / 警示 |
| 黛色 | Dark gray | `#3B4F5C` | L7 Prompt |
| 浅绛 | Pale rose | `#D9A594` | L8 场景 |
| 乳白 | Paper | `#F9F4DC` | 主背景 |
| 墨黑 | Ink | `#0F1A20` | 主文字 |

**Usage**:
- Don't mix layer colors arbitrarily
- A term's badge should use its layer's color
- Background gradients should be in-paper (warm), not saturated

### Typography

```css
/* 标题 (headings) */
font-family: 'Noto Serif SC', 'Source Han Serif SC', 'Songti SC', STSong, serif;
font-weight: 700 or 900;

/* 正文 (body) */
font-family: 'Avenir Next', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
font-weight: 400;

/* 数字 (numerals) */
font-family: 'M PLUS Rounded 1c', sans-serif;
font-weight: 700;
```

**Don't**:
- ❌ Use more than 3 font families
- ❌ Use Comic Sans / Cursive / Display fonts
- ❌ Use system fonts for Chinese text

### Spacing

```css
--content: 1240px;       /* max content width */
padding: 0 32px;         /* standard horizontal padding */
gap: 16px;               /* standard gap */
margin-bottom: 24px;     /* between sections */
```

### Border Radius

- **Default**: `border-radius: 0` (sharp corners — Chinese tradition)
- **Exception**: 50% for circular elements (avatars, dots)
- **Don't**: use rounded corners on cards / buttons / inputs (breaks the aesthetic)

### Shadow

```css
/* Card elevation */
box-shadow: 0 14px 34px rgba(17, 17, 17, 0.08);

/* Soft elevation (hovers) */
box-shadow: 0 18px 50px rgba(17, 17, 17, 0.06);
```

Use sparingly — Chinese aesthetic prefers flat over skeuomorphic.

---

## 🛠️ Code Style

### JavaScript

```javascript
// ES2020+ (no transpilation needed)
// Use const by default, let when reassignment needed
const FACTOR = 1.618;
let counter = 0;

// Arrow functions preferred for short callbacks
const double = x => x * 2;

// Use template literals, not concatenation
const greeting = `Hello, ${name}!`;

// Object / array destructuring
const { id, name } = term;
const [first, ...rest] = items;

// Use === not ==
if (value === 42) { /* ... */ }

// Use optional chaining
const name = user?.profile?.name;

// Use nullish coalescing
const value = input ?? 'default';
```

**Don't**:
- ❌ Use `var`
- ❌ Use semicolons inconsistently
- ❌ Use `==` (use `===`)
- ❌ Define functions inside loops

### HTML

```html
<!-- Use semantic tags -->
<article> ... </article>
<section> ... </section>
<header> ... </header>
<main> ... </main>

<!-- Always include alt text for images -->
<img src="..." alt="..." />

<!-- Use data-* attributes for JavaScript hooks -->
<button data-action="open-menu">Menu</button>

<!-- Use aria-* for accessibility -->
<button aria-label="Close" aria-expanded="false">×</button>
```

### CSS

```css
/* Use CSS variables for theming */
:root {
  --c-paper: #F9F4DC;
  --c-ink: #0F1A20;
}

/* Group related properties */
.card {
  /* Box model */
  padding: 16px;
  margin-bottom: 24px;
  border: 1px solid var(--c-line);
  
  /* Visual */
  background: var(--c-panel);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  
  /* Typography */
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--c-ink);
  
  /* Motion */
  transition: all 0.2s var(--ease-out-quart);
}

/* BEM naming for components */
.evo-card { }
.evo-card__title { }
.evo-card--early { }
.evo-card__title--accent { }
```

### File Organization

```
website/
├── index.html           # Single-page entry (homepage)
├── term.html            # Dynamic detail page (term.html?id=...)
├── favicon.svg          # Brand icon
├── og-image.svg         # Open Graph card
├── sitemap.xml          # Auto-generated
├── robots.txt           # Auto-generated
├── CNAME                # Custom domain (optional)
│
├── css/                 # Stylesheets
│   ├── style.css        # Core (light theme + tokens)
│   ├── dark.css         # Dark theme override
│   ├── components.css   # Reusable components
│   ├── term.css         # Detail page
│   ├── home.css         # Homepage
│   ├── glossary.css     # A-Z index
│   ├── compare.css      # Compare page
│   └── stats.css        # Stats dashboard
│
├── js/                  # Scripts
│   ├── terms.js         # 178 terms data (legacy, sync)
│   ├── data.js          # Layer metadata + algorithms
│   ├── term.js          # Detail page renderer
│   ├── search.js        # ⌘K search
│   ├── app.js           # Global utilities
│   ├── home.js          # Homepage widgets
│   ├── theme.js         # Dark/light mode
│   ├── nav.js           # Mobile menu
│   └── terms-loader.js  # Async loader (v2.2)
│
├── data/                # Term data (layer-split)
│   ├── terms-index.json    # Index (id, name, layer, shortDesc)
│   ├── terms-L1.json       # 16 范式层 terms
│   ├── terms-L2.json       # 20 方法论层
│   ├── terms-L3.json       # 53 技术层
│   ├── terms-L4.json       # 28 工具层
│   ├── terms-L5.json       # 14 质量层
│   ├── terms-L6.json       # 17 风险层
│   ├── terms-L7.json       # 16 Prompt
│   └── terms-L8.json       # 14 场景
│
├── pages/               # Static content pages
│   ├── glossary.html       # A-Z + filter
│   ├── layers.html         # L1-L8
│   ├── scenarios.html      # 14 scenarios
│   ├── graph.html          # Mermaid
│   ├── compare.html        # 5 paradigms
│   ├── stats.html          # SO 2025 / METR
│   └── citations.html      # 30+ sources
│
├── scripts/             # Build/utility scripts
│   ├── rebuild-terms.cjs   # JSON → terms.js
│   ├── build-sitemap.cjs   # 186 URLs
│   ├── inject-*.cjs        # meta/aria/seo
│   ├── enrich-*.cjs        # content enrichment
│   └── split-terms.cjs     # terms.js → 8 JSON
│
├── tests/               # Test suite
│   ├── unit/              # vitest
│   └── e2e/               # playwright
│
├── package.json
└── vitest.config.js
```

---

## 🌐 i18n / Localization

- **Primary language**: 简体中文 (zh-CN)
- **Future**: English (planned v2.3)
- **Don't** mix Chinese and English in same sentence
- **Technical terms**: keep English (e.g. "context window" not "上下文窗口")
- **Concept explanations**: use Chinese

```json
{
  "name": "Vibe Coding",          // English technical term
  "zh": "Vibe Coding",            // Chinese (often same as English)
  "shortDesc": "..."               // Chinese explanation
}
```

---

## 🧪 Testing Style

### Unit Test (Vitest)

```javascript
import { describe, it, expect } from 'vitest';
import { search } from '../js/search.js';

describe('search', () => {
  it('returns matching terms for "vibe"', () => {
    const results = search('vibe');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe('vibe-coding');
  });

  it('returns empty array for empty query', () => {
    expect(search('')).toEqual([]);
  });
});
```

### E2E Test (Playwright)

```javascript
import { test, expect } from '@playwright/test';

test('detail page shows examples', async ({ page }) => {
  await page.goto('/term.html?id=mcp');
  await expect(page.locator('#section-examples')).toBeVisible();
  const examples = page.locator('.example-card');
  expect(await examples.count()).toBeGreaterThan(0);
});
```

---

## 📊 Git Commit Style

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>(<scope>): <description>

# Types
feat      # new feature
fix       # bug fix
docs      # documentation only
style     # formatting (no code change)
refactor  # code restructuring
test      # adding tests
chore     # maintenance

# Examples
git commit -m "feat(terms): add 'vibe-engineering' (L1)"
git commit -m "fix(term.html): remove duplicate section-examples ID"
git commit -m "docs(README): add testing section"
git commit -m "chore(data): rebuild terms-index.json"
```

**Don't**:
- ❌ Past tense ("added", "fixed") — use imperative ("add", "fix")
- ❌ Vague descriptions ("update", "fix stuff")
- ❌ Multiple unrelated changes in one commit

---

## 🚀 Performance Style

- **No CDN-only resources** (must work offline after first load)
- **Lazy-load** anything below the fold
- **Defer** non-critical scripts (`<script defer>`)
- **Minify** for production (but keep source readable)
- **Use system fonts** as fallback for Web Fonts

---

## 🔒 Security Style

- **No inline JavaScript** in HTML (CSP violation)
- **No `eval()` / `Function()`** with user input
- **Sanitize** all user input (search queries, feedback)
- **External links**: `rel="noopener noreferrer"`
- **Internal links**: use relative paths (`href="term.html?id=vibe-coding"`)

---

**Questions?** Open an Issue or Discussion on GitHub. 🙏
