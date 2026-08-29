# Hacker News Submission · Sol-Reviewed

## Recommended Submit Type

**普通 HN submission** （不是 Show HN）。理由：HN 官方规则对 Show HN 限制为"users can play with"——glossary / knowledge base 不属于此类别。普通帖更合适。

## Title (recommended)

```
Vibe Coding Wiki: 178 terms for AI-assisted programming
```

评分 9/10。
- 简洁（HN 用户喜欢）
- "Vibe Coding Wiki" 是产品名 + 定位
- "178 terms" 是精确数字（不是"200+"）
- "AI-assisted programming" 描述用途

## Title (alternative if you want Show HN)

```
Show HN: Vibe Coding Wiki – an interactive glossary of 178 AI coding terms
```

评分 8.5/10。
- 加 "interactive glossary" 区分 Wikipedia-style
- "AI coding" 更 HN 化

## Body (3 段式 · Sol 提供的 9.5/10 版本)

```text
I built this because the vocabulary around AI-assisted programming is getting difficult to keep straight.

"Vibe coding", agentic coding, context engineering, MCP, spec-driven development, cognitive debt, guardrails, YOLO mode — the terms are spreading across blog posts, documentation, papers and tool communities, but I couldn't find one place that showed how they relate.

So I started building a taxonomy rather than another list.

It currently has 178 official terms organized into 8 layers (plus 1 community proposal on the pending track):
Paradigms → Methodologies → Technologies → Tools → Quality → Risks → Prompting → Scenarios.

For each term I'm trying to include the definition, examples, primary-source quotes, related terms and references. Current coverage: ~88% of terms have examples, ~87% have quotes, ~90% have external references.

The site is deliberately simple: static HTML/CSS/JS, per-layer async loading, offline caching, full-text search, relationship views and full Chinese/English mode (every entry is bilingual). No account or backend.

Two things I put real effort into because glossaries live or die by trust:

1. Citation hygiene. All 295 external references carry lastVerified timestamps, and a 90-day re-verification audit flags anything that drifts stale (currently 0 stale). I don't claim the links are never broken — I claim the audit catches it when they break.

2. Example honesty. Every code example is syntax-checked by a guardrail in CI (72 checked: 50 python / 8 js / 10 bash / 4 json — all passing). Made-up snippets are exactly the thing that would poison a reference like this.

The English layer is my current focus. The zh→en coverage is complete (179/179 entries), and the 10 core terms were rewritten English-first against their primary sources; I'm extending that treatment to the rest of the glossary.

I'd especially appreciate feedback on:
- terms that are missing
- classifications you disagree with
- incorrect attribution or sources
- terminology that shouldn't exist as a separate entry

The repo is MIT licensed, and contributions/corrections are welcome — new terms can enter through the pending track (⏳ badge) and get promoted after verification.
```

## Key Properties of This Body

| Property | How It's Achieved |
|---|---|
| **Problem framing** | "vocabulary is getting difficult to keep straight" — not "I built a thing" |
| **Specific terms listed** | "vibe coding, agentic coding, context engineering, MCP, spec-driven development, cognitive debt, guardrails, YOLO mode" |
| **Honest limitation** | "The English layer is my current focus" + audit caveat: "I don't claim the links are never broken — I claim the audit catches it when they break" |
| **Trust signals** | trust-mechanics beat feature lists: citation timestamps, syntax-checked examples, pending track |
| **Invites critique** | 4 specific feedback questions |
| **Low ego** | "MIT licensed and contributions/corrections are welcome" |

## Why It Works (vs Original)

| Original (8dd40f0) | Sol-Reviewed |
|---|---|
| "I built 178 terms" | "I built this because..." |
| Lists features | Lists problems + design decisions |
| Pitch | Honest assessment + invitation critique |
| "Full SEO / dark mode" | "deliberately simple / no backend" |
| No weakness admitted | "Unfinished English" |

## First Comment Strategy (重要)

HN 用户会问你 3 个问题：
1. **Why a taxonomy, not a list?** → 你可回答 "因为 taxonomy 显示关系，list 只是堆砌"
2. **Why 178 not 1000?** → 你可回答 "178 官方词条是 80%+ 富内容门槛；另有 1 个 community proposal 走 pending 轨道（software-3.0），验证晋升后才计入官方"
3. **为什么引用可信?** → "295 条引用全部带 lastVerified 时间戳 + 90 天复审审计；示例代码经语法 guardrail（50 py / 8 js / 10 bash / 4 json 全过）— 这就是回答"

## Timing

| 时机 | 美东时间 |
|---|---|
| 周二 - 周四 | 09:00 - 11:00 |
| 避开周一（信息过载）周五（专注整理） |  |
| 截稿前 7 天在 HN 看 5 个类似帖的 upvote 曲线 |  |

## Don't

- ❌ Ask friends to upvote (HN detects this)
- ❌ Use "Show HN" if it's a knowledge base (HN 规则)
- ❌ Mention "178 terms" in title (too many dimensions)
- ❌ Reply to every comment (looks desperate)
- ❌ Post first version with too many issues (HN users find WEAK)

## HTTP 测试

```bash
# 立刻测试你的 HN 内容
gh api -X POST https://hacker-news.firebaseio.com/v0/item/30597874.json \
  -d '{"text":"test"}' 2>&1 | head -3
```

## KOL 触达 (5 天后)

- **目标**: Karpathy / Willison / Anthropic / Simon Willison 个人
- **方式**: Twitter / Email
- **timing**: HN 帖 2-3 天后（确保他们能查到讨论）
- **template**: 在 ops/share/05-kol-outreach.md

## Personal First Comment (立即准备)

```text
Author here. A few clarifications:

1. The terms are deliberately limited (178 official) because my goal is depth, not breadth. Each term has on average ~3.5 sourced content pieces (examples, quotes, references).

2. The glossary is fully bilingual zh/en. The core 10 terms were rewritten English-first against primary sources; that treatment is now spreading to the remaining entries.

3. I'm specifically NOT doing this with an LLM-only workflow. Citations point to first-party sources (author blogs, official docs, papers), all 295 of them timestamped and re-verified every 90 days. Code examples are syntax-checked, not hallucinated.

4. Yes, this is mostly me, an AI agent team (coordinator + data enricher + auditor). The architecture choices are documented in /docs/ARCHITECTURE.md.

Happy to discuss omissions or disagreements in the taxonomy — that's the actual point.
```
