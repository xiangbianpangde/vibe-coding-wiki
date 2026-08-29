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
```

### 🆕 Or: file an issue first

Not ready to code? File an issue using our templates:

| Type | Template |
|---|---|
| 📚 Propose a new term | [`.github/ISSUE_TEMPLATE/new_term.md`](../.github/ISSUE_TEMPLATE/new_term.md) |
| 🔍 Fix a citation | [`.github/ISSUE_TEMPLATE/citation_fix.md`](../.github/ISSUE_TEMPLATE/citation_fix.md) |
| 🌐 Improve translation | [`.github/ISSUE_TEMPLATE/translation.md`](../.github/ISSUE_TEMPLATE/translation.md) |
| 🐛 Report a bug | [`.github/ISSUE_TEMPLATE/bug_report.md`](../.github/ISSUE_TEMPLATE/bug_report.md) |
| 💡 Suggest a feature | [`.github/ISSUE_TEMPLATE/feature_request.md`](../.github/ISSUE_TEMPLATE/feature_request.md) |
| 📝 Submit code change | [`.github/PULL_REQUEST_TEMPLATE.md`](../.github/PULL_REQUEST_TEMPLATE.md) |
git push origin feat/your-contribution

# 8. Open Pull Request on GitHub
```

## 🛤️ Dual-Track Submission (R7)

Every term follows a two-track lifecycle: **自由提案 → pending 展示 → 验证晋升正式**。

```
Free proposal (issue / PR)   →   status: "pending"   →   verification   →   official entry
(no status field needed)          displayed with ⏳ badge      (source + citation      (remove "status")
                                  after official terms          checked by maintainer)
```

### How the pending badge works

- A term JSON with top-level `"status": "pending"` is treated as **proposed, not yet verified**
- On **term detail pages**: the title shows a `⏳ 待验证 / Pending review` badge (follows the lang toggle)
- On the **A-Z glossary**: pending terms are sorted **after** official terms within each letter group and carry the same badge
- **Official counts never change**: stats page / home metrics count only official terms (178).
  The glossary count line shows official terms plus a separate pending count.

### Verification → promotion

When a pending term's wording, sources, and facts are verified:

1. Remove the `"status": "pending"` field from its JSON
2. Enrich it to the full schema (quotes / examples / seeAlso per Workflow 2)
3. Rebuild (`node website/scripts/rebuild-terms.cjs` + `rebuild-index.cjs`) and commit

---

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

> 🛤️ **Proposing an unverified term?** Add top-level `"status": "pending"` — it will render
> with the ⏳ badge, sort after official terms, and stay out of official counts until
> promoted. See the Dual-Track Submission section above.

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

## 🌟 How to File a Good First Issue (Maintainer Guide)

> If you're a maintainer looking to create onboarding-friendly issues for new contributors, follow this template.

### When to Create a Good First Issue

Good First Issues are **scoped, well-defined, 1-3 file changes** that:
- Touch **1 term file** (e.g., `terms-L3.json`) OR **1 module** (e.g., `js/search.js`)
- Don't require deep domain knowledge
- Have a clear "done" criterion
- Can be completed in < 2 hours

**Good candidates**:
- Add `lastVerified` field to 1 term
- Verify 1 primary source URL
- Add 1 missing `seeAlso` reference
- Fix 1 broken anchor link
- Add 1 missing `examples` for a high-traffic term
- Improve 1 enShortDesc translation

**Bad candidates** (don't label "good first issue"):
- Multi-term refactors
- New feature implementation
- Anything touching `prepare.py` / `runner.py` / `evaluate.py` (FROZEN files)

### Issue Template (Maintainer)

```markdown
## [Good First Issue] <verb> <object>

### What
<1-2 sentences describing the task>

### Why
<1 sentence explaining the impact>

### Where
- File path: `website/data/terms-L<N>.json` (or other)
- Specific terms: `term-id-1`, `term-id-2`, ...

### Done When
- [ ] Specific checkable outcome
- [ ] PR opened with `Closes #<this-issue>`

### Estimated Time
<number> minutes

### Difficulty
Beginner (no prior knowledge required)
```

### Auto-Post Welcome Comment

After creating a Good First Issue, post this welcome comment:

```bash
ISSUE_NUM=<n>
gh issue comment $ISSUE_NUM --body-file ops/share/good-first-issue-welcome.md
```

This gives new contributors a structured starting point with:
- Where to find docs (`docs/CONTRIBUTING.md`)
- Which file to edit
- How to test locally
- How to open a PR

### Active Good First Issues (Current)

See [GitHub Issues labeled "good first issue"](https://github.com/xiangbianpangde/vibe-coding-wiki/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) for current onboarding tasks.

Maintenance cadence: review weekly, label new candidates from incoming issues.

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
