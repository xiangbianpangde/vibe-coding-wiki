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

It currently has 178 terms organized into 8 layers:
Paradigms → Methodologies → Technologies → Tools → Quality → Risks → Prompting → Scenarios.

For each term I'm trying to include the definition, examples, primary-source quotes, related terms and references. Current coverage is roughly 77% examples, 76% quotes and 79% external references.

The site is deliberately simple: static HTML/CSS/JS, per-layer async loading, offline caching, full-text search, relationship views and an early Chinese/English mode. No account or backend.

The biggest unfinished part is English. The original knowledge base was written in Chinese; L1 is translated and the remaining layers are being reviewed now.

I'd especially appreciate feedback on:
- terms that are missing
- classifications you disagree with
- incorrect attribution or sources
- terminology that shouldn't exist as a separate entry

The repo is MIT licensed and contributions/corrections are welcome.
```

## Key Properties of This Body

| Property | How It's Achieved |
|---|---|
| **Problem framing** | "vocabulary is getting difficult to keep straight" — not "I built a thing" |
| **Specific terms listed** | "vibe coding, agentic coding, context engineering, MCP, spec-driven development, cognitive debt, guardrails, YOLO mode" |
| **Honest limitation** | "biggest unfinished part is English" |
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
2. **Why 178 not 1000?** → 你可回答 "v2.3 计划扩到 250+；178 是 70%+ 富内容门槛"
3. **为什么不自动收录新词?** → 引出 Citation Red Team 这就是为什么

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

1. The terms are deliberately limited (~178) because my goal is depth, not breadth. Each term has on average 2.9 sourced content pieces (examples, quotes, references).

2. The biggest deliberate gap is English. The original was Chinese — I'm doing the translation layer by layer with primary-source verification, not machine translation.

3. I'm specifically NOT doing this with an LLM-only workflow. Every citation is a primary source (author blog, official docs, original paper). You can verify any quote by clicking the source link.

4. Yes, this is mostly me, an AI agent team (coordinator + data enricher + auditor). The architecture choices are documented in /docs/ARCHITECTURE.md.

Happy to discuss omissions or disagreements in the taxonomy — that's the actual point.
```
