# Reddit · 多 Subreddit 帖

> 推到 Reddit 多个相关子社区
> 不要 spam，每个 subreddit 发 1 次即可
> Round 2 KEEP 后再投

---

## Sub-Reddits 优先级

| Subreddit | 订阅数 | 相关度 | 适合度 | 备注 |
|-----------|--------|--------|--------|------|
| r/programming | 6M | 高 | ⭐⭐⭐⭐⭐ | 主推 |
| r/MachineLearning | 800K | 高 | ⭐⭐⭐⭐ | ML 角度 |
| r/ClaudeAI | 25K | 高 | ⭐⭐⭐⭐⭐ | Claude Code 用户 |
| r/ChatGPTCoding | 12K | 高 | ⭐⭐⭐⭐ | AI coding 社区 |
| r/singularity | 1.2M | 中 | ⭐⭐⭐ | 讨论 AI 影响 |
| r/artificial | 200K | 中 | ⭐⭐⭐ | AI 通用 |
| r/opensource | 300K | 中 | ⭐⭐⭐ | 关注开源 |
| r/webdev | 2M | 中 | ⭐⭐⭐ | 技术栈角度 |
| r/ExperiencedDevs | 200K | 中 | ⭐⭐⭐ | 资深开发者 |
| r/coolgithubprojects | 100K | 高 | ⭐⭐⭐⭐⭐ | 周报 |
| r/SideProject | 80K | 中 | ⭐⭐⭐ | 副业项目 |

---

## r/programming 帖（首选）

### Title

**Show: I curated 178 AI programming terms in 8 layers — from "vibe coding" to "agentic engineering"**

或更短：**Show HN: Vibe Coding Wiki — 178 terms for AI-assisted programming**

### Body

```
I built a Wikipedia-style glossary for Vibe Coding / AI-assisted programming:
https://xiangbianpangde.github.io/vibe-coding-wiki/

178 terms across 8 layers:
- L1 Paradigm: vibe coding, agentic engineering, cognitive debt
- L2 Methodology: SDD, context engineering, plan-verify-build
- L3 Technical: LLM, agent loop, MCP, hallucination
- L4 Tools: Cursor, Claude Code, Windsurf, Aider (30+ tools)
- L5 Quality: guardrails, YOLO mode, MVP
- L6 Risk: technical debt, vibe slop, lethal trifecta
- L7 Prompt: few-shot, CoT, ReAct
- L8 Scenarios: prototype, production, refactor, security

Each term has:
- Real examples (code, prompts)
- Original quotes (Karpathy, Willison, Anthropic, etc.)
- Authoritative see-also (Wikipedia, arXiv, official docs)

Coverage:
- 54% have examples
- 60% have direct quotes
- 57% have external links

Engineering:
- Pure static site, no build step
- First-paint JS: 220KB → 30KB via per-layer async loading
- Chinese traditional color design system
- Full JSON-LD / OG / sitemap
- GitHub Pages, MIT licensed

I want this to be the canonical glossary for the AI programming era — like MDN for the web, Wikipedia for general knowledge. Currently working toward 70% data coverage.

Feedback welcome. PRs especially welcome — adding terms is just editing JSON.

Code: https://github.com/xiangbianpangde/vibe-coding-wiki
Demo: https://xiangbianpangde.github.io/vibe-coding-wiki/
```

---

## r/MachineLearning 帖

### Title

**Resource: 178-term glossary for AI-assisted programming (vibe coding, agentic engineering, MCP, ...)**

### Body

```
I curate a glossary of AI/ML-adjacent terms that didn't have a canonical home:
https://xiangbianpangde.github.io/vibe-coding-wiki/

Coverage of ML/LLM terms:
- LLM / Transformer / Attention / Token / Context window
- Fine-tuning / LoRA / QLoRA / RLHF / DPO
- Hallucination / KV-cache / Mamba / Mixture-of-experts / RoPE
- Agent / Subagent / Agent loop / Tool use / Function calling
- RAG / GraphRAG / Chunking / Embedding

Plus AI-programming tools and concepts:
- Cursor / Claude Code / Windsurf / Aider / Tabnine / Copilot
- MCP (Model Context Protocol) / Tool search / Channel
- Prompt engineering / Few-shot / CoT / ReAct / TOT
- Empirical studies: METR RCT, CodeRabbit, GitClear, Stack Overflow 2025

Each entry has examples + quotes + external references.
Code: github.com/xiangbianpangde/vibe-coding-wiki
MIT licensed, free to fork and extend.
```

---

## r/ClaudeAI 帖

### Title

**I catalogued all the Claude Code terminology (compaction, hooks, MCP, ...) into a glossary**

### Body

```
While learning Claude Code I kept hitting terms that weren't in the official docs:
- Compaction / Auto-memory / CLAUDE.md
- Hooks / Checkpoint / Permission Mode
- Effort Level / Output Style / Plan Mode
- Bundled Skills / Commands / Agentic Harness
- MCP / Tool Search / Connector / Channel

So I made a glossary: https://xiangbianpangde.github.io/vibe-coding-wiki/

178 terms total, with examples and authoritative see-also links.
Especially useful if you're coming to Claude Code from Cursor / Copilot.

Code: github.com/xiangbianpangde/vibe-coding-wiki
PRs welcome.
```

---

## r/coolgithubprojects 帖

### Title

**Vibe Coding Wiki — 178-term glossary for AI-assisted programming, MIT licensed**

### Body

```
GitHub: https://github.com/xiangbianpangde/vibe-coding-wiki
Live: https://xiangbianpangde.github.io/vibe-coding-wiki/

A Wikipedia-style glossary for the AI programming era:
- 178 terms, 8 layers, 14 use-case scenarios
- 30+ authoritative sources (Karpathy, Willison, Anthropic, ...)
- Pure static site, GitHub Pages, MIT
- 85% first-paint JS reduction via per-layer async loading
- JSON-LD / OG / sitemap / full SEO

Looking for contributors — adding terms is just JSON editing.
```

---

## r/SideProject 帖

### Title

**My side project: a glossary for Vibe Coding, AI agents, and 178 other terms**

### Body

```
I built https://xiangbianpangde.github.io/vibe-coding-wiki/ as a side project
over the past few weeks. It's a curated glossary for AI-assisted programming.

What's interesting about it (imho):
1. The vocabulary of AI programming is exploding (vibe coding → vibe engineering
   → agentic engineering in 12 months) and needs a canonical home.
2. Each term has real examples + original quotes + external references —
   not just a Wikipedia stub.
3. Engineering choices: pure static, 85% first-paint JS reduction, Chinese
   color design system.

Looking for:
- Contributors to add terms (JSON editing)
- Feedback on the curation
- Co-maintainers for translation (English version incoming)

GitHub: github.com/xiangbianpangde/vibe-coding-wiki
```

---

## 时间策略

- **r/programming**: 周三 美东 9:00 AM
- **r/MachineLearning**: 周二 美东 8:00 AM
- **r/ClaudeAI**: 任何时间（流量小）
- **r/coolgithubprojects**: 周日（周报时间）
- **r/SideProject**: 周一晚

## 注意事项

- ❌ 不要同一天发所有 sub（spam 风险）
- ❌ 不要用 affiliate / referral link
- ❌ 不要 self-promotion 超过 1 次/24h
- ✅ 每个 sub 帖定制内容（不要复制粘贴）
- ✅ 主动回复评论（Reddit 算法奖励互动）
- ✅ 24h 后检查 karma 反馈，必要时调整措辞

## Karma 风险

- Reddit 对新账号 / 低 karma 账号敏感
- 如果账号 < 100 karma，可能被自动 shadowban
- 建议: 先在 sub 评论其他帖攒 karma 再发
- 或让协调方（高 karma 账号）发主要 sub