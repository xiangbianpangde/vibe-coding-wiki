# Contributing to Vibe Coding Wiki

> **How to add / improve / fix terms in the Vibe Coding knowledge base.**

Thank you for your interest in contributing! 🎉 This document is the definitive guide to contributing to Vibe Coding Wiki.

## 🎯 What We're Looking For

| Type | Examples | Priority |
|---|---|---|
| **New term** | New AI tool, new concept, new framework | ⭐⭐⭐ |
| **Enrichment** | examples, quotes, seeAlso for existing terms | ⭐⭐⭐ |
| **Correction** | Wrong definition, outdated info, broken link | ⭐⭐⭐ |
| **New layer / category** | Suggest restructuring | ⭐ |
| **Translation** | English version (planned v2.3) | ⭐ |
| **Bug report** | Site broken, accessibility issue | ⭐⭐⭐ |

## 🚀 Quick Start (5 min)

```bash
# 1. Fork the repo
# 2. Clone
git clone https://github.com/YOUR_USERNAME/vibe-coding-wiki.git
cd vibe-coding-wiki

# 3. Create branch
git checkout -b feat/your-contribution

# 4. Make changes (see workflows below)

# 5. Verify locally
cd website
python3 -m http.server 8765
# Open http://localhost:8765
# Or: open term.html?id=mcp

# 6. Run tests
npm install
npm test

# 7. Commit + push
git commit -m "feat: add term XYZ with examples"
git push origin feat/your-contribution

# 8. Open Pull Request on GitHub
```

## 📝 Workflow 1: Add a New Term

New terms are added as JSON in `website/data/terms-L{1-8}.json` (one file per layer).

### Step 1: Choose the layer

```
L1 范式 (paradigm)     - L4 工具 (tools)
L2 方法论 (methodology) - L5 质量 (quality)
L3 技术 (tech)          - L6 风险 (risk)
L7 Prompt               - L8 场景 (scenarios)
```

### Step 2: Check existing terms

```bash
# Search for similar terms first
grep -i "your-concept" website/data/terms-L*.json
```

### Step 3: Add term entry

Append to the appropriate layer JSON file. Required fields:

```json
{
  "id": "your-term-id",         // lowercase-kebab-case, MUST be unique
  "name": "Your Term",          // English name
  "zh": "你的术语",              // Chinese name
  "layer": "L3",                // MUST be a valid layer
  "category": "tech",           // sub-category (any string)
  "tags": ["tech", "core"],     // array, used for related search
  "shortDesc": "One-line definition.",
  "longDesc": "<p>Full HTML definition with multiple paragraphs.</p><p>With code blocks.</p>",
  "related": ["other-term-id", "another-term-id"],
  "coinedBy": "Author Name",    // optional
  "coinedDate": "2025-01",      // optional
  "quotes": [                   // optional
    {
      "text": "Direct quote text.",
      "cite": "Author, Source (Year)"
    }
  ],
  "examples": [                 // optional
    {
      "code": "actual code here",
      "desc": "What this code does"
    }
  ],
  "seeAlso": [                  // optional, 1st-party sources only
    {
      "name": "Document Title",
      "url": "https://official-url.example.com"
    }
  ]
}
```

### Step 4: Rebuild terms.js

```bash
node website/scripts/rebuild-terms.cjs
```

This regenerates `website/js/terms.js` from all layer JSONs.

### Step 5: Test locally

```bash
cd website
python3 -m http.server 8765
# Open http://localhost:8765/term.html?id=your-term-id
```

Verify:
- [ ] Title shows correctly
- [ ] Related terms appear in right sidebar
- [ ] Examples render with syntax highlighting
- [ ] Quotes show with attribution
- [ ] See also links are clickable

### Step 6: Add to sitemap

```bash
node website/scripts/build-sitemap.cjs
```

### Step 7: Commit

```bash
git add website/data/website/js/website/sitemap.xml
git commit -m "feat(terms): add 'Your Term' (L3)"
git push origin feat/your-term
```

## 📝 Workflow 2: Enrich an Existing Term

Add examples / quotes / seeAlso to existing terms.

### Step 1: Find the term

```bash
grep -l "vibe-coding" website/data/terms-*.json
```

### Step 2: Add fields (don't replace existing!)

The `enrich-priority-*.cjs` scripts use a **merge** strategy — they add new content without overwriting your existing fields. Always add, never replace.

### Step 3: Rebuild + test

Same as Workflow 1 steps 4-7.

## 📝 Workflow 3: Fix a Bug or Inaccuracy

1. **Verify the issue**: open the term page, reproduce the bug
2. **Locate the data**: most issues are in `website/data/terms-L*.json`
3. **Edit minimally**: change only what's wrong
4. **Justify in commit message**: "fix: correct MCP definition (was 'USB' should be 'OpenAPI')"
5. **PR description**: link to the issue / source you used to verify the correction

## 🧪 Workflow 4: Code Changes

Code changes (JS / CSS / HTML) require:

1. **Test locally first** (load in browser, check 3+ terms)
2. **Run vitest**: `npm test` (must pass 24/24)
3. **Avoid breaking changes** to existing term IDs
4. **Update affected docs** (ARCHITECTURE.md / STYLE.md)

For **larger changes** (new components, new pages, refactoring):
- Discuss in an Issue first
- Get approval from maintainers
- Break into smaller PRs

## ✅ Quality Standards

### Definition Quality
- **Short description**: 1-2 sentences, max 200 chars
- **Long description**: 200-800 chars, with HTML formatting
- **Examples**: Real, runnable code (not pseudo-code)
- **Quotes**: First-party sources (authors, official docs)
- **See also**: Only first-party (official docs, GitHub repos, original papers)

### Code Quality
- **No external dependencies** (we're 100% static)
- **No CDN-only resources** that block offline use
- **All Chinese characters use UTF-8**
- **No proprietary emoji** — use Unicode standard

### ID Naming
- Lowercase, kebab-case
- No spaces, no underscores
- No numbers unless essential
- Examples: `claude-code`, `mcp`, `agentic-engineering`

## 🚫 What NOT to Contribute

- **Marketing copy** — terms should be neutral, not promotional
- **Speculative / unverified claims** — needs primary source
- **Personal opinions** — belongs in a blog, not a glossary
- **Duplicate terms** — check existing first
- **Unreleased / vaporware products** — wait until stable
- **Off-topic content** (not related to AI coding / vibe coding)

## 🔍 Code Review Process

All PRs go through:

1. **Automated checks** (vitest 24/24 + Playwright e2e)
2. **Data validation** (term-schema check)
3. **Style review** (matches STYLE.md)
4. **Maintainer approval** (1-2 reviewers)

Typical timeline: 1-3 days for first review.

## 📞 Contact

- **Issues**: GitHub Issues (preferred for transparency)
- **Discussions**: GitHub Discussions (for questions / ideas)
- **Direct**: [@your-twitter](https://twitter.com/...) (for sensitive / private)

## 🙏 Code of Conduct

- Be respectful and constructive
- Critique ideas, not people
- Welcome newcomers
- Assume good faith
- Credit original sources

## 📜 License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](../LICENSE).

---

**Thank you for making Vibe Coding Wiki better!** 🚀
