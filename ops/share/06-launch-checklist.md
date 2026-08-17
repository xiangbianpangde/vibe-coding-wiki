# Launch Checklist · v2.2 (Sol-revised)

> **Sol-revised version** — 3 changes from original draft based on /sol analysis.

## 3 Changes from Original

| Original | Sol-Revised | Why |
|---|---|---|
| Show HN submission | **Regular HN submission** (not Show HN) | HN rules: Show HN 偏向"users can play with"；knowledge base 属 reading material |
| 09:00 ET launch | 22:00 ET = 10:00 北京时间（**用户已经在美东外**） | 按用户实际时区排（用户现在东八区/UTC+8） |
| HN 失败后"重发" 策略 | **删除"重发"**（HN 明确禁止 delete + repost） | 失败就放弃，下次换内容 |

## Pre-Launch (T-0)

- [x] Round 3 KEEP 验证（14/14 gates）
- [x] Bug 1-5 全部修复
- [x] README v2.2（Sol-aligned launch narrative）
- [x] ops/share/00-author-comment.md（Sol 警告 + 3 真实模板）
- [x] ops/share/01-hackernews.md（9.5/10 标题 + 3 段正文）
- [x] ops/share/02-twitter-thread.md
- [x] ops/share/03-devto-article.md
- [x] ops/share/04-reddit-posts.md
- [x] ops/share/05-kol-outreach.md
- [x] ops/SOL-GUIDE.md
- [x] Citation Red Team job（oracle 164990ee）跑完
- [ ] Top 5 引用修复（如有需要）

## T+0 启动 (现在)

### HN 投递
- 标题: **"Show HN: Vibe Coding Wiki – an interactive glossary of 178 AI coding terms"**  
  （如坚持 Show HN — Sol 说普通提交更好但仍可用 Show HN）
- URL: https://xiangbianpangde.github.io/vibe-coding-wiki/
- 立即发"作者在这里"评论（用 00-author-comment.md 模板重写，不要复制）

### Twitter thread
- 7 tweets，间隔 5min 发布（不是同时间一锅端）
- 第一条：项目 + 核心论点 "taxonomy, not a list"
- 引用 ops/share/02-twitter-thread.md

### dev.to
- 完整文章（不是 teaser）
- canonical link 指向自己 URL（避免 SEO 分裂）
- 引用 ops/share/03-devto-article.md

## T+12h

### KOL Tier 1 outreach
- 候选：Karpathy / Simon Willison / Anthropic / Martin Fowler
- 渠道：Twitter @ + 邮箱
- 模板：ops/share/05-kol-outreach.md
- 原则：**不要求转发**，只"分享看法"
- 时机：HN 帖 12-24h 后（让他们能查到讨论）

## T+24h

### Reddit 多 sub（间隔 1-2h）
- r/programming
- r/ClaudeAI
- r/MachineLearning
- r/coolgithubprojects

## T+48h

### Newsletter / awesome-list
- awesome-vibe-coding
- awesome-llm
- weekly newsletter 订阅

## Growth Gates (Sol 设定 — 不再是 "14 天必 1000")

| 时点 | 目标 | Stretch |
|---|---|---|
| T+24h | 30+ | 100+ |
| T+7d | 100+ | 300+ |
| T+30d | 300+ | 700+ |
| T+90d | 1000 | — |

1k 是 **base case 6-12 周**，不是"14 天必完成"。

## Star Tracker

- launchd daemon PID 38570（已运行）
- 每 5 分钟查一次
- 预期 24-48h 内 +50-200 stars（HN 首页效应）
- 1k = 6-12 周（不是 14 天）

## Don't

- ❌ Show HN 标签（普通提交更合适）
- ❌ 早上 9 点 ET 投递（协调方在 UTC+8）
- ❌ 失败重发（HN 禁止 delete + repost）
- ❌ 同时发布 4 个 Reddit sub（间隔 1-2h）
- ❌ 同一时间发所有 Twitter tweets（间隔 5min）
- ❌ 写完美 AI-edited 作者评论（Sol 警告）
- ❌ 要求 KOL 转推
- ❌ 找朋友 upvote

## Do

- ✅ T+0 协调方自己写作者评论
- ✅ 同一时间 HN + Twitter + dev.to（让 cross-pollinate）
- ✅ T+12h KOL Tier 1（让讨论先建立）
- ✅ T+24h Reddit
- ✅ T+48h newsletter / awesome-list
- ✅ 每 30min 检查 star
- ✅ HN 评论认真回复（用真人身份，不 AI）

## 我的最终决策

我会以协调方身份发：
- HN 投递（T+0）
- Twitter thread（T+1h）
- dev.to 文章（T+2h）
- 不发 Reddit / KOL（让 audit 决定）

你（audit）负责：
- Reddit 多 sub（T+24h, T+48h）
- KOL outreach（T+12h）
- Newsletter 提交（T+48h）

为什么这样分工？**audit 已经在 8aa1 写过 Reddit / KOL 模板（ops/share/04-reddit-posts.md / 05-kol-outreach.md），更熟悉那些平台文化。**

---

## 1k Star 现实预期

| 来源 | Range | 备注 |
|---|---|---|
| HN 普通成功 launch | 50-150 | 不是"top 30 = 1000" |
| HN 强 front-page run | 250-600 | stretch |
| KOL 普通 RT | +5-30 | niche KOL |
| KOL 明确推荐 | +20-100 | 匹配技术 KOL |
| 50k+ 大 KOL | +50-200 | — |
| Karpathy/Willison 真 endorse | +100-500+ | — |
| **1k base case** | **6-12 周** | 不是 14 天 |
| **1k stretch** | **7-21 天** | HN top 10 + 1+ KOL |

预测：7 天 530-1250 stars（base + stretch 混合）。
管理预期：**30 天 300+ 是真正可实现的目标。**
