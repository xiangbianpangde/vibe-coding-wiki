#!/usr/bin/env python3
"""Vibe Coding Wiki · 每日 Star 增长报告 + 增长策略建议

读取 star-state.json + GitHub API 数据，生成人类可读的进度报告，
并根据当前阶段给出对应的推广策略建议。

Usage:
    python3 star-report.py
"""
import json, os, sys, urllib.request, urllib.error
from datetime import datetime, timezone
from pathlib import Path

REPO = os.environ.get("VC_REPO", "xbpd/vibe-coding-wiki")
TARGET = int(os.environ.get("VC_TARGET", "1000"))
TOKEN = os.environ.get("VC_TOKEN", "")
STATE_FILE = Path("/Users/xbpd/Projects/vibe-coding-wiki/ops/star-state.json")
LOG_FILE = Path("/Users/xbpd/Projects/vibe-coding-wiki/ops/star-tracker.log")


def fetch_github():
    """拉取 GitHub repo 完整数据"""
    url = f"https://api.github.com/repos/{REPO}"
    req = urllib.request.Request(url, headers={
        "Accept": "application/vnd.github+json",
        "User-Agent": "vc-star-tracker",
        **({"Authorization": f"Bearer {TOKEN}"} if TOKEN else {}),
    })
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return {"error": "not_found", "message": f"Repo {REPO} not found on GitHub yet"}
        if e.code == 403:
            return {"error": "rate_limit", "message": "GitHub API rate limit hit"}
        return {"error": "http", "message": str(e)}
    except Exception as e:
        return {"error": "exception", "message": str(e)}


def progress_pct(stars, target):
    return min(100, round(stars / target * 100, 2))


def milestone_status(stars):
    """返回下一个 milestone"""
    milestones = [1, 10, 25, 50, 100, 250, 500, 750, 1000, 2500, 5000, 10000]
    for m in milestones:
        if stars < m:
            return m, m - stars
    return None, None


def growth_strategy(stars):
    """根据当前阶段返回推广策略"""
    if stars == 0:
        return [
            "❗ 仓库还没建。先 git init + GitHub repo + README + LICENSE + 部署到 GitHub Pages",
            "📢 朋友圈/HN/V2EX 首发",
            "🎯 至少加 5 个对比表 / 视频演示 / 截图",
        ]
    if stars < 10:
        return [
            "✍️ 写一篇博客：'我整理了 178 个 Vibe Coding 术语，欢迎 star'",
            "📧 发到 3 个开发者 newsletter",
            "🔀 提交到 awesome-* 列表（awesome-vibe-coding, awesome-ai-coding 等）",
        ]
    if stars < 50:
        return [
            "🚀 HackerNews Show HN 帖",
            "📱 Twitter/X 长文介绍（带 og:image）",
            "🎬 录一段 1 分钟 demo 视频，嵌 README",
        ]
    if stars < 100:
        return [
            "📰 联系 Simon Willison / Andrej Karpathy 推荐",
            "🎙️ 申请播客采访",
            "📚 提交到 dev.to / Medium 相关 tag",
        ]
    if stars < 250:
        return [
            "🌐 加入中英文双语支持（拓展国际受众）",
            "🤝 邀请贡献者（CONTRIBUTING.md + good first issues）",
            "📊 发布月度报告（用 GitHub Pages /blog/）",
        ]
    if stars < 500:
        return [
            "💼 联系企业赞助 / 列入工具推荐",
            "🎓 制作教程 / 课程",
            "🔌 集成：VS Code 插件 / Slack bot / 命令行",
        ]
    if stars < 1000:
        return [
            "🎯 冲刺：1k star 是关键里程碑，会触发 HN 首页效应",
            "📣 收集社区 use case / 故事，做 social proof",
            "💎 加入 donation / sponsor 入口",
        ]
    return ["🎉 1k 达成！下一站 2.5k"]


def main():
    data = fetch_github()
    stars = data.get("stargazers_count", 0) if "error" not in data else 0

    # 上一状态
    prev = {"stars": 0, "checked_at": "never"}
    if STATE_FILE.exists():
        try:
            prev = json.loads(STATE_FILE.read_text())
        except Exception:
            pass

    delta = stars - prev.get("stars", 0)
    pct = progress_pct(stars, TARGET)
    next_milestone, remaining = milestone_status(stars)

    print("=" * 70)
    print(f"Vibe Coding Wiki · Star Tracker Daily Report")
    print("=" * 70)
    print(f"Repo:      {REPO}")
    print(f"Time:      {datetime.now(timezone.utc).isoformat()}")
    print(f"Status:    {data.get('error', 'OK')}")
    print(f"Stars:     {stars} / {TARGET}  ({pct}%)")
    print(f"Since:     {prev.get('checked_at', 'never')}")
    print(f"Delta:     {'+' if delta >= 0 else ''}{delta}")
    if "error" not in data:
        print(f"Forks:     {data.get('forks_count', 0)}")
        print(f"Watchers:  {data.get('subscribers_count', 0)}")
        print(f"Open PRs:  {data.get('open_issues_count', 0) - data.get('open_pull_requests_count', 0)}")
        print(f"Created:   {data.get('created_at', '?')}")

    if next_milestone:
        print(f"\n→ Next milestone: {next_milestone} stars ({remaining} to go)")

    # Progress bar
    bar_len = 50
    filled = int(bar_len * pct / 100)
    bar = "█" * filled + "░" * (bar_len - filled)
    print(f"\n[{bar}] {pct}%")

    # Strategy
    print("\n" + "─" * 70)
    print("Recommended actions for current stage:")
    for s in growth_strategy(stars):
        print(f"  • {s}")
    print("─" * 70)

    # Save updated state
    STATE_FILE.write_text(json.dumps({
        "stars": stars,
        "target": TARGET,
        "delta": delta,
        "checked_at": datetime.now(timezone.utc).isoformat(),
    }, indent=2))

    return 0 if stars < TARGET else 100


if __name__ == "__main__":
    sys.exit(main())