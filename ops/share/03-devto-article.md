# dev.to / Medium · 长文章模板

> 推到 dev.to / Medium
> Round 1 KEEP + Round 2 KEEP 后再投（确保性能优化宣传属实）

---

## 标题候选（选 1 个）

A. **I curated 178 AI programming terms — here's what I learned about the Vibe Coding era**
B. Why I built a 178-term glossary for Vibe Coding, Agentic Engineering, and the AI programming vocabulary
C. The Vibe Coding era glossary: from Karpathy's "vibe coding" to "agentic engineering" in 12 months

---

## 文章正文（约 1500 字）

### Intro (150 字)

In February 2025, Andrej Karpathy coined "vibe coding" — a term for using LLMs to generate code while barely looking at it. Twelve months later, the vocabulary of AI-assisted programming has exploded: "vibe engineering", "agentic engineering", "cognitive debt", "lethal trifecta", "context engineering", "compaction", "MCP" — and dozens more.

I couldn't find a canonical glossary. So I built one.

### The problem (200 字)

The vocabulary of AI-assisted programming is fragmented:
- Karpathy tweets a new term, gets 50k likes, nobody captures it
- Anthropic ships "compaction" in Claude Code, it shows up in their changelog, then nowhere else
- Simon Willison writes a 4,000-word essay introducing "lethal trifecta"
- A startup founder creates a new product with "guardrails" branding, no Wikipedia entry

Developers spend hours Googling "what is X" for these terms. Newcomers give up entirely.

Worse: the terms evolve. "Vibe coding" → "vibe engineering" → "agentic engineering" — within 12 months, three versions of the same concept. Each introduces nuances the previous didn't.

### What I built (300 字)

[Vibe Coding Wiki](https://xiangbianpangde.github.io/vibe-coding-wiki/) — 178 official curated terms (plus 1 on the pending track), 8 layers, 14 use-case scenarios.

**Coverage by layer:**
- L1 Paradigm: Vibe Coding / Agentic Engineering / Cognitive Debt (16 terms)
- L2 Methodology: SDD / Context Engineering / Plan-Verify-Build (20 terms)
- L3 Technical: LLM / Agent Loop / MCP / Hallucination (53 terms)
- L4 Tools: Cursor / Claude Code / Windsurf / Aider / 30+ tools (28 terms)
- L5 Quality: Guardrails / YOLO Mode / MVP (14 terms)
- L6 Risk: Technical Debt / Vibe Slop / Lethal Trifecta (17 terms)
- L7 Prompt Engineering: Few-Shot / CoT / ReAct (16 terms)
- L8 Scenarios: Prototype / Production / Refactor / Security (14 terms)

Each term includes:
- **Examples**: Real code/prompts (not made up) — syntax-checked by a CI guardrail, currently 72/72 passing
- **Quotes**: Original Karpathy / Willison / Anthropic citations
- **See Also**: Authoritative external links (Wikipedia, arXiv, official docs), each with a lastVerified timestamp

**Coverage now**: 88% of terms have examples, 87% have direct quotes, 90% have external references. Full zh/en bilingual coverage — all 179 entries ship in both languages.

### Engineering decisions (300 字)

Some choices worth explaining:

**Pure static site, zero npm.** No build step, no framework. Just HTML + CSS + vanilla JS. Total payload is ~250KB. Deploys to GitHub Pages for free.

**First-paint JS dropped 85%.** Originally `terms.js` was 200KB and loaded synchronously on every page. I refactored to per-layer async loading: `terms-loader.js` reads a `data-layers` attribute, fetches only what's needed. A term detail page now loads ~30KB on first visit, not 220KB.

**Chinese color design system.** The aesthetic comes from "中国传统色 Studio" — 玄青 (#11100E) for dark mode paper, 鎏金 (#F0CB5E) for highlights, 朱砂 (#C04851) for warnings. Looks distinctive without being gimmicky.

**JSON-LD everywhere.** WebSite + BreadcrumbList + DefinedTermSet schema. Helps Google understand the content structure for rich results.

**Static, but tested.** Playwright end-to-end suites and vitest data-integrity tests run against every change (term-detail smoke across all 179 ids included). Two more guardrails protect the data itself:

**Example syntax guardrail.** Every code example runs through `npm run check:examples` — Python via `py_compile`, JS via `node --check`, bash via `bash -n`, JSON via `JSON.parse`. 72 checked so far (50 python / 8 js / 10 bash / 4 json), 0 failures. A glossary that ships hallucinated code examples would poison its own reason to exist.

**Citation recency audit.** All 295 external references carry per-citation lastVerified timestamps, and `npm run audit:citations` re-verifies against a 90-day threshold (with optional HTTP link checks). The audit is a report tool rather than a gate — but it means citation rot gets found, not assumed away. I deliberately don't claim "zero dead links"; I claim the mechanism that catches them when they appear.

**Dual-track contributions.** Term proposals land with a ⏳ pending badge (visible on the site, sorted after official entries) and are promoted to official only after their wording and sources are verified. The official count stays clean — currently 178 official + 1 pending (software-3.0).

### What's next (200 字)

The roadmap:
- **EN-first polish rollout** — the 10 core terms were rewritten English-first rather than translated; extending that to all 179 entries
- **Community pending track** — proposals with ⏳ badges are already live; growing contributor inflow through easier templates
- **RSS / Atom** for term update notifications
- **Lighthouse 95+** across the board

Star count goal: 1,000 on GitHub. The biggest lever right now is making the content discoverable to developers outside the Claude Code / Cursor bubble — that's the next marketing push.

### Why this matters (150 字)

The AI programming era needs a shared vocabulary. When a senior engineer says "we hit cognitive debt on the refactor", a junior shouldn't need 30 minutes of Googling to understand the sentence.

Glossaries are infrastructure. Wikipedia, MDN, DevDocs — all built this kind of canonical reference for their domains. AI-assisted programming deserves the same.

[Star on GitHub →](https://github.com/xiangbianpangde/vibe-coding-wiki)
[Try it live →](https://xiangbianpangde.github.io/vibe-coding-wiki/)

---

## Tags (dev.to)

`#ai` `#programming` `#vibecoding` `#claudecode` `#llm` `#opensource` `#webdev` `#github`

## Canonical / cross-post

发布到：
1. dev.to (主)
2. Medium (cross-post, canonical link 指向 dev.to)
3. Hashnode (optional)
4. 个人 blog（如有）

canonical link 全部指向 dev.to 文章。

## 配图（3-5 张）

1. 主页 hero 截图（带 og:image）
2. glossary 词条密度截图
3. 关系图谱（graph.html）
4. 暗色模式截图
5. 详情页（含 examples section）

## 推广节奏

- Round 1 KEEP + Round 2 KEEP → 发布 dev.to
- HN Show HN 同日发布 dev.to
- Twitter thread 引用 dev.to 文章
- LinkedIn 也发（不同角度，更"thought leadership"）

## 时间

- 最佳发布: 周二到周四 美东 8:00-10:00 AM
- dev.to 阅读峰值: 周三上午
- HN 同步发布