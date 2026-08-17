# Vibe Coding Wiki · Operations

GitHub 上线 + Star 增长监控 + 1k 达成追踪。

## 文件

| 文件 | 用途 |
|------|------|
| `star-tracker.sh` | GitHub star 监控（once / daemon / test 三模式） |
| `star-report.py` | 每日 star 报告 + 阶段策略建议 |
| `com.vibecodingwiki.startracker.plist` | macOS launchd daemon 配置（5 分钟轮询） |
| `git-github-bootstrap.sh` | git init + GitHub repo + README/LICENSE/Pages workflow 一键引导 |
| `star-state.json` | 上一次检查的状态（自动生成） |
| `star-tracker.log` | 监控日志 |

## 快速启动

### 1. 上线到 GitHub（一次性）

```bash
cd /Users/xiangbianpangde/Projects/vibe-coding-wiki
ops/git-github-bootstrap.sh
```

这会：
- git init + 创建 README/LICENSE/.gitignore
- 创建 GitHub Issue / PR 模板
- 创建 `.github/workflows/deploy.yml` 自动部署到 Pages
- 通过 `gh` CLI 创建 GitHub repo 并推送

### 2. 启动 Star 监控

**手动单次检查：**
```bash
VC_REPO=xiangbianpangde/vibe-coding-wiki ops/star-tracker.sh once
```

**自测（无需真实 repo）：**
```bash
ops/star-tracker.sh test
```

**daemon 模式（前台运行）：**
```bash
ops/star-tracker.sh daemon
```

**macOS launchd 后台（推荐）：**
```bash
cp ops/com.vibecodingwiki.startracker.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.vibecodingwiki.startracker.plist
launchctl start com.vibecodingwiki.startracker
# 查看日志
tail -f ops/star-tracker.log
```

### 3. 每日报告

```bash
python3 ops/star-report.py
```

输出示例：
```
======================================================================
Vibe Coding Wiki · Star Tracker Daily Report
======================================================================
Repo:      xiangbianpangde/vibe-coding-wiki
Stars:     127 / 1000  (12.7%)
Delta:     +12

→ Next milestone: 250 stars (123 to go)

[██████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 12.7%

Recommended actions for current stage:
  • 🚀 HackerNews Show HN 帖
  • 📱 Twitter/X 长文介绍（带 og:image）
  • 🎬 录一段 1 分钟 demo 视频，嵌 README
```

## 目标策略

| Star 区间 | 策略重点 |
|-----------|---------|
| 0 | git + GitHub repo + README + 部署 |
| 1-10 | 朋友圈 / HN / V2EX 首发，awesome-* 列表 |
| 10-50 | 写博客、newsletter、Show HN |
| 50-100 | 联系 KOL、播客采访、dev.to 投稿 |
| 100-250 | 双语化、邀请贡献者、月度报告 |
| 250-500 | 企业赞助、教程课程、集成扩展 |
| 500-1000 | 冲刺最后 500，social proof，sponsor |
| 1000+ | 🎉 触发首页效应，放大增长 |

## 认证

为提升 GitHub API rate limit（60 → 5000 req/h），建议：

1. https://github.com/settings/tokens 生成 PAT (classic, public_repo scope)
2. 在 launchd plist 设置 `VC_TOKEN` 环境变量

## 通知

达成 1k 时会：
- 写 `reached_target: true` 到 state 文件
- 触发 macOS 原生通知 `osascript`
- 写日志行 `🎉 TARGET REACHED`

## 测试

不需要等 GitHub repo 真实存在也能完整测试：

```bash
ops/star-tracker.sh test    # 模拟 star 增长到 1000
python3 ops/star-report.py  # 报告会显示 "仓库还没建" 阶段策略
```