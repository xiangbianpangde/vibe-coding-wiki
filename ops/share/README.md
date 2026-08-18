# Vibe Coding Wiki · 推广物料

> Round 1 KEEP + Round 2 KEEP 后启动
> 不要 spam，要真诚

## 文件清单

| 文件 | 平台 | 状态 |
|------|------|------|
| `01-hackernews.md` | HackerNews 普通提交 | 待用 |
| `02-twitter-thread.md` | Twitter / X | 待用 |
| `03-devto-article.md` | dev.to / Medium | 待用 |
| `04-reddit-posts.md` | Reddit 多 sub | 待用 |
| `05-kol-outreach.md` | KOL 1v1 触达 | 待用 |
| `kol-templates.md` | KOL 个性化 mention 模板（T+12h 用） | 待用 |
| `good-first-issue-welcome.md` | GitHub Issue 欢迎评论 | 待用 |
| `06-launch-checklist.md` | Launch checklist（含 Growth Gates） | 待用 |
| `07-monitoring-template.md` | Post-launch 7 天监控模板 | 本文件新增 |

## 启动顺序

```
T+0 (Round 2 KEEP):
  1. dev.to 文章发布（最稳）
  2. HN Show HN 提交
  3. Twitter thread 发布

T+1d:
  4. KOL Tier 1 outreach（Karpathy / Willison / Anthropic）
  5. Reddit r/ClaudeAI / r/programming（24h 内不同 sub）

T+3d:
  6. KOL Tier 2 outreach
  7. Reddit r/MachineLearning / r/coolgithubprojects

T+7d:
  8. Newsletter outreach
  9. awesome-list submissions
```

## 1k star 路径（预估）

| 渠道 | 预估 stars |
|------|-----------|
| HN 首页 | 200-500 |
| KOL RT | 100-300 |
| Reddit r/programming | 100-200 |
| dev.to 文章 | 50-100 |
| Newsletter mention | 50-100 |
| Twitter thread | 30-50 |
| **7 天总计** | **530-1250** |

## 风格原则

- **真诚** > 流量
- **建设性** > 推销
- **数据** > 情绪
- **回复评论** > 发完就跑

## 风险

- ❌ spam → 被 report
- ❌ 假承诺 → 失信
- ❌ 操纵 star → 封号
- ❌ 群发相同文案 → 被识别

## 准备检查表（launch 前）

- [ ] Live site 稳定（Round 2 KEEP）
- [ ] og:image 有效（社交分享有图）
- [ ] Canonical link 全对（SEO 不分裂）
- [ ] sitemap.xml 最新
- [ ] README 顶部徽章完整（给 HN 访客的"专业感"）
- [ ] GitHub repo description 准确
- [ ] Topics / About 设置好

---

## Growth Gates (Sol 设定 — 1k 是 6-12 周 base case)

| 时点 | 目标 | Stretch |
|---|---|---|
| T+24h | 30+ | 100+ |
| T+7d | 100+ | 300+ |
| T+30d | 300+ | 700+ |
| T+90d | 1000 | — |

**重要**：1k 是 base case 6-12 周，不是 14 天必完成。

---

## Post-Launch 7 天监控模板

> 每天 09:00 美东 / 21:00 北京 由 star tracker daemon 自动 + 人工 daily summary。

### 每日必看

| 指标 | 来源 | 关注阈值 |
|------|------|---------|
| Stars | `gh api repos/.../... | jq .stargazers_count` | < T+24h 期望 30 |
| Watchers | `gh api ... | jq .watchers_count` | 应同步增长 |
| Forks | `gh api ... | jq .forks_count` | < 5 = 可能没人用 |
| HN rank | news.ycombinator.com | 维持 top 30 = 持续增长 |
| Twitter impressions | x.com 账号 | 单帖 ≥ 1000 = good signal |
| GitHub referrers | Insights → Traffic | 来源 top 5 站点 |
| Issues | gh issue list --state open | 0 = 没人发现 bug（不一定坏）|

### 每日 30 min 报告格式

```markdown
# Vibe Coding Wiki · Day N Report

**Date**: YYYY-MM-DD
**Total stars**: NN (Δ +N since launch)
**Watchers**: NN
**Forks**: NN

## Channel Performance
- HN: rank N (top X% today)
- Twitter: N impressions
- Reddit: top post N upvotes
- KOL: N mentions/engagements

## Issues / PRs
- Open: N
- New today: N
- Resolved: N

## Highlights
- [positive or negative signals]

## Action items
- [ ] If HN rank dropping: prepare alternative title
- [ ] If KOL responds: thank + add to contributors
- [ ] If issue opened: triage within 24h
```

### 关键信号 (Decision Points)

| 信号 | 行动 |
|------|------|
| T+24h < 10 stars | launch 失败：分析 HN rank / 改标题重投 |
| T+7d < 30 stars | launch 弱：增加 KOL outreach 力度 |
| T+7d > 100 stars | 成功：维持渠道 + 启动 Round 5 内容 |
| HN comments < 5 | 没人讨论：可能 landing page 不够清晰 |
| KOL 公开 RT | 立刻感谢 + 增加 +1 mention 渠道 |
| Issue/PR > 5 | 项目活跃：增加 reviewer 人手 |
