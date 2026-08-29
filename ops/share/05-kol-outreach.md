# KOL 推广 · Outreach 模板

> Round 2 KEEP 后启动
> 不发垃圾邮件，1v1 个性化触达

---

## 优先级 KOL 名单（按影响力 + 关联度）

### Tier 1 · 必须触达（直接影响 star 增长曲线）

#### 1. **Andrej Karpathy** (@karpathy)
- **关联度**: ⭐⭐⭐⭐⭐ "vibe coding" 是他造的
- **平台**: X.com / Twitter
- **触达方式**: 公开 quote tweet 比 DM 好（他 DM 不回）
- **钩子**: "I curated all the terms you've introduced — vibe coding, vibe engineering, agentic engineering — into a single glossary. Hope it's useful for the community."
- **预期**: 1% 概率他 RT，10% 概率他 like

#### 2. **Simon Willison** (@simonw)
- **关联度**: ⭐⭐⭐⭐⭐ 创造 "vibe engineering" / "lethal trifecta"，博客读者大多是开发者
- **平台**: X.com + simonwillison.net blog
- **触达方式**: 公开评论他的博客 + 邮件
- **钩子**: "I made a glossary that includes 'lethal trifecta' and 'vibe engineering'. Wanted to share, in case useful for your readers."
- **预期**: 10% 概率他 blog mention，5% 概率他 RT

#### 3. **Anthropic** (@AnthropicAI)
- **关联度**: ⭐⭐⭐⭐⭐ Claude Code 官方词汇 30+ 收录
- **平台**: X.com
- **触达方式**: Twitter mention + 邮件
- **钩子**: "I compiled all the Claude Code terminology (compaction, hooks, MCP, etc.) into an open-source glossary. Hope useful for Claude Code users."
- **预期**: 1% 概率官方 RT

### Tier 2 · 高价值（如果 Tier 1 没回，触达这些）

#### 4. **GitHub** (@github)
- **关联度**: ⭐⭐⭐⭐ 平台方
- **钩子**: "Open source glossary for AI programming era, hosted on GitHub Pages"
- **触达**: Twitter mention + newsletter submission

#### 5. **Hacker News official** (@newsycombinator)
- **关联度**: ⭐⭐⭐⭐ HN front page 是 1k star 的最快路径
- **触达**: Show HN submission（不要 DM）

#### 6. **swyx** (@swyx)
- **关联度**: ⭐⭐⭐⭐ AI engineering thought leader
- **钩子**: "Made a glossary that includes 'cognitive debt' (Hunt 2026) and other terms from your circles"

#### 7. **Simon Wardley** (@swardley)
- **关联度**: ⭐⭐⭐ strategic thinking
- **钩子**: "Mapping the AI programming vocabulary, similar to your maps for cloud"

### Tier 3 · 社区放大（Tier 1/2 成功后触达）

- LangChain / LlamaIndex 官方账号
- Cursor / Claude Code 官方账号
- 各大 AI Newsletter (TLDR AI, The Rundown AI, Ben's Bites)
- awesome-list 维护者

---

## Outreach 模板（Twitter DM / Mention）

### 模板 1 · 致 Karpathy / Willison（私人化）

```
@<handle> Made a curated glossary of all the AI programming terms
introduced in 2025-2026 — vibe coding, vibe engineering, agentic
engineering, cognitive debt, lethal trifecta, etc.

178 official terms · 8 layers · fully bilingual zh/en · MIT licensed
295 citations, all timestamped + re-verified on a 90-day audit

Open source: https://github.com/xiangbianpangde/vibe-coding-wiki

Hope it's useful for the community.
```

### 模板 2 · 致 Anthropic / 工具方

```
@<handle> Compiled all the Claude Code terminology into an open-source
glossary — compaction, hooks, MCP, permission modes, etc.

178 official terms (+1 pending proposal), MIT licensed, free to extend.
Every citation carries a lastVerified timestamp and a 90-day audit
keeps them fresh.

Repo: github.com/xiangbianpangde/vibe-coding-wiki

Let me know if useful for your docs.
```

### 模板 3 · 致 Newsletter / Aggregator

```
Subject: Vibe Coding Wiki — 178-term glossary for AI-assisted programming

Hi <name>,

I built a curated glossary for the AI programming era — 178 official
terms (plus 1 pending community proposal) across 8 layers (paradigm /
methodology / technical / tools / quality / risk / prompt / scenarios).

Each term has real examples, original quotes, and authoritative
references. Coverage today: 88% examples / 87% quotes / 90% references.
All 295 citations carry lastVerified timestamps and are re-verified
on a 90-day rolling audit; code examples are syntax-checked in CI.
The whole glossary is bilingual zh/en.

Live: https://xiangbianpangde.github.io/vibe-coding-wiki/
Code: https://github.com/xiangbianpangde/vibe-coding-wiki

Could be useful for your readers. Happy to provide a longer write-up
or co-author a piece if interested.

Thanks,
<name>
```

---

## 触达时间表

| 阶段 | 时间 | 动作 |
|------|------|------|
| Pre-launch | T-7d | 准备所有模板，列出 KOL 联系方式 |
| Soft launch | T-3d | 在个人 Twitter 提及，不链接 |
| Public launch | T-0 | HN Show HN + dev.to + Twitter thread + Reddit |
| Outreach 1 | T+1d | 给 Tier 1 KOL 发私人 mention（不 RT 自己） |
| Outreach 2 | T+3d | 给 Tier 2 KOL |
| Outreach 3 | T+7d | Newsletter + awesome-list 维护者 |
| Sustaining | T+14d+ | 持续 dev.to 写第二篇 / 第三篇 |

## 风险 / 不要做

- ❌ 不要给 100 个 KOL 发同样的 mention（会被报告 spam）
- ❌ 不要用 bot 工具批量发送
- ❌ 不要承诺回报（"star 我，我帮你 RT"）
- ❌ 不要在 KOL 的评论区连发多条
- ✅ 每次 mention 都要个性化（提到他具体贡献的术语）
- ✅ 等待 KOL 自己判断是否回应
- ✅ 如果 7 天没回，不要再追

## 成功指标

| 指标 | 目标 |
|------|------|
| Karpathy Willison Anthropic 任何 1 人 RT | 100-500 stars |
| HN Show HN 首页 | 500-2000 stars |
| dev.to 文章 1k+ 阅读 | 50-100 stars |
| Reddit 任一帖 +50 upvotes | 100-300 stars |
| Newsletter mention 1 个 | 50-100 stars |
| **综合 7 天目标** | **1000-3000 stars** |

## 1k star 路径

```
起点: 0 stars

Week 1:
  HN front page (Show HN):     + 200-500
  Willison RT / blog mention: + 100-300
  Anthropic engagement:       + 50-100
  Reddit r/programming:       + 100-200
  dev.to article:             + 50-100
  Twitter thread:             + 30-50
                          ===========
  Week 1 总计:                 500-1200 stars

Week 2+:
  Newsletter mentions:        + 100-200
  Sustained organic:          + 50-100 / 周
                          ===========
  Week 2 总计:                 650-1500 stars

→ 7-14 天达到 1k star 目标
```

## 关键提醒

1. **不要假承诺**: "Willison 一定会 RT" — 他不一定
2. **不要 spam**: KOL 一次 outreach 没回就放手
3. **不要催**: 不要写 "please RT"
4. **要真诚**: 你建这个 glossary 是真心的，分享给社区
5. **要 follow-up**: 如果 KOL 真的 mention 你，立即感谢 + 提供更多细节

## Tracking

每次 outreach 记录到 `ops/share/outreach-log.md`：
- KOL 名字
- 触达时间
- 平台（Twitter / Email / Blog）
- 回复状态
- 后续动作

## 不要做 — 警告

- ❌ 不要伪造 KOL 引用（如 "Karpathy 推荐了..." 如果没真的推荐）
- ❌ 不要假装是 Anthropic 官方项目
- ❌ 不要在 KOL 没回复前就 @"他帮我推广了"
- ❌ 不要操纵 star 数（GitHub 会封号）