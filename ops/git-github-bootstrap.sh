#!/usr/bin/env bash
# Vibe Coding Wiki · Git + GitHub + Pages 一键引导脚本
# 创建 git repo、commit、GitHub repo、首次 release
#
# Prerequisites:
#   - GitHub CLI: brew install gh && gh auth login
#   - Git: configured with user.name and user.email
#
# Usage:
#   ./git-github-bootstrap.sh

set -euo pipefail

PROJECT_DIR="/Users/xbpd/Projects/vibe-coding-wiki"
REPO_NAME="${VC_REPO_NAME:-vibe-coding-wiki}"
GITHUB_USER="${VC_GITHUB_USER:-xbpd}"
GITHUB_VISIBILITY="${VC_GITHUB_VISIBILITY:-public}"  # public / private

cd "$PROJECT_DIR"

echo "📦 Initializing git repo..."
if [[ ! -d .git ]]; then
  git init
  git branch -M main
else
  echo "  .git already exists, skipping init"
fi

echo "📝 Creating README.md..."
if [[ ! -f README.md ]]; then
  cat > README.md <<'README_EOF'
# Vibe Coding Wiki · 专业术语知识库

> Karpathy 创造的"vibe coding"出发，178+ 核心术语、8 大层级、14 类使用场景、3 大实证研究。为开发者、团队、企业决策者提供工程化的术语参考。

[![Stars](https://img.shields.io/github/stars/xbpd/vibe-coding-wiki?style=flat-square)](https://github.com/xbpd/vibe-coding-wiki/stargazers)
[![Forks](https://img.shields.io/github/forks/xbpd/vibe-coding-wiki?style=flat-square)](https://github.com/xbpd/vibe-coding-wiki/network)
[![License](https://img.shields.io/github/license/xbpd/vibe-coding-wiki?style=flat-square)](LICENSE)
[![Pages](https://img.shields.io/badge/GitHub-Pages-blue?style=flat-square)](https://xbpd.github.io/vibe-coding-wiki/)

## ✨ 特色

- **178+ 核心术语** — 覆盖 Vibe Coding、Agentic Engineering、Cognitive Debt 等 2025-2026 最新概念
- **8 大层级** — 范式层 / 方法论层 / 技术概念层 / 工具平台层 / 质量治理层 / 风险度量层 / Prompt 工程层 / 场景层
- **14 类使用场景** — 原型 / 个人工具 / 生产维护 / 大型重构 / 安全敏感 / 学习探索 / 团队协作 等
- **3 大实证研究** — METR RCT、CodeRabbit、GitClear 生产力悖论
- **中国色设计** — 玄青黑底 + 鎏金暖白 + 朱砂点缀，暗色模式原生支持
- **完整 SEO** — favicon / OG / Twitter / sitemap / robots / JSON-LD (WebSite + BreadcrumbList + DefinedTermSet)
- **零依赖** — 纯静态站，可托管 GitHub Pages / Vercel / Netlify / Cloudflare Pages

## 🚀 快速开始

### 在线浏览
👉 https://xbpd.github.io/vibe-coding-wiki/

### 本地预览
```bash
cd website
python3 -m http.server 8765
# 访问 http://localhost:8765
```

## 📚 词条索引

| 层级 | 名称 | 词条数 |
|------|------|--------|
| L1 范式层 | Vibe Coding / Agentic Engineering / Cognitive Debt | 16 |
| L2 方法论层 | SDD / Context Engineering / Plan-Verify-Build | 20 |
| L3 技术概念层 | LLM / Agent Loop / MCP / Hallucination | 53 |
| L4 工具平台层 | Cursor / Claude Code / Windsurf / Aider | 28 |
| L5 质量治理层 | Guardrails / YOLO Mode / MVP | 14 |
| L6 风险度量层 | Technical Debt / Vibe Slop / Lethal Trifecta | 17 |
| L7 Prompt Engineering | Few-Shot / CoT / ReAct | 16 |
| L8 场景层 | 原型 / 生产 / 重构 / 安全 / 学习 / 团队 | 14 |

## 🗂️ 词条详情示例

- [Vibe Coding](https://xbpd.github.io/vibe-coding-wiki/term.html?id=vibe-coding) — Karpathy 创造的"忘了代码存在"开发风格
- [MCP](https://xbpd.github.io/vibe-coding-wiki/term.html?id=mcp) — Anthropic Model Context Protocol 开放协议
- [Cognitive Debt](https://xbpd.github.io/vibe-coding-wiki/term.html?id=cognitive-debt) — Hunt 2026 提出的认知负担累积
- [Lethal Trifecta](https://xbpd.github.io/vibe-coding-wiki/term.html?id=lethal-trifecta) — Simon Willison 警示的"致命三件套"

## 🤝 贡献

欢迎提交 [Issue](https://github.com/xbpd/vibe-coding-wiki/issues) 和 [PR](https://github.com/xbpd/vibe-coding-wiki/pulls)！

词条数据在 `website/js/terms.js`，按 layer 分到 `website/data/terms-L*.json`。

## 📜 许可证

MIT © 2025 xbpd
README_EOF
  echo "  ✓ README.md created"
fi

echo "📝 Creating LICENSE (MIT)..."
if [[ ! -f LICENSE ]]; then
  cat > LICENSE <<'LICENSE_EOF'
MIT License

Copyright (c) 2025 xbpd

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
LICENSE_EOF
  echo "  ✓ LICENSE created"
fi

echo "📝 Creating .gitignore..."
cat > .gitignore <<'GITIGNORE_EOF'
.DS_Store
node_modules/
*.log
ops/star-state.json
ops/star-tracker*.log
.vscode/
.idea/
*.swp
*.bak
*.tmp
GITIGNORE_EOF
echo "  ✓ .gitignore created"

echo "📝 Creating GitHub Pages workflow..."
mkdir -p .github/workflows
cat > .github/workflows/deploy.yml <<'WORKFLOW_EOF'
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./website

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
WORKFLOW_EOF
echo "  ✓ .github/workflows/deploy.yml created"

echo "📝 Creating GitHub Issue templates..."
mkdir -p .github/ISSUE_TEMPLATE
cat > .github/ISSUE_TEMPLATE/term-suggestion.md <<'ISSUE_EOF'
---
name: 新词条建议
about: 建议添加新的 Vibe Coding / AI 编程术语
title: '[TERM] '
labels: enhancement, content
assignees: ''
---

## 词条名
中文 / English

## 所属层级
L1 / L2 / L3 / L4 / L5 / L6 / L7 / L8

## 简短描述（一句话）
<!-- e.g. "Karpathy 创造的术语：用自然语言描述意图，由 LLM 自动生成源码的开发风格" -->

## 详细描述（200-500 字）
<!-- 起源 / 核心特征 / 适用场景 / 不适用场景 -->

## 主要来源（≥1 个权威引用）
- [ ] Karpathy / Anthropic / OpenAI / Simon Willison 等原始来源
- [ ] 论文 / 博客 / Twitter / YouTube 链接

## 关联词条（≥3 个）
<!-- related: ["...", "...", "..."] -->
ISSUE_EOF

cat > .github/ISSUE_TEMPLATE/bug.md <<'ISSUE_EOF'
---
name: Bug 报告
about: 报告网站 bug
title: '[BUG] '
labels: bug
---

## 复现步骤
1.
2.
3.

## 预期
## 实际
## 截图
## 浏览器 / 设备
ISSUE_EOF

cat > .github/pull_request_template.md <<'PR_EOF'
## 变更类型
- [ ] 新词条
- [ ] 词条数据修正
- [ ] Bug 修复
- [ ] UI / 样式
- [ ] SEO / 性能
- [ ] 文档

## 关联 Issue
Closes #

## 变更说明

## 自检清单
- [ ] 本地 `python3 -m http.server` 已测试
- [ ] 截图（如有 UI 变更）
- [ ] 数据合规（如有词条数据变更）
PR_EOF
echo "  ✓ GitHub templates created"

echo ""
echo "📦 Committing..."
git add -A
git -c user.email=vc-bot@example.com -c user.name="vc-bot" commit -m "feat: initial v2.1 release

- 178 terms across 8 layers
- Dark theme with Chinese color palette
- SEO complete: favicon + OG + sitemap + JSON-LD
- Accessibility: skip-link + ARIA + keyboard nav
- Auto-generated misconception/timeline/learning-path" 2>&1 | tail -5

echo ""
echo "🚀 Creating GitHub repo via gh CLI..."
if command -v gh >/dev/null 2>&1; then
  if gh repo view "$GITHUB_USER/$REPO_NAME" >/dev/null 2>&1; then
    echo "  ⚠️  Repo already exists at $GITHUB_USER/$REPO_NAME, skipping create"
  else
    gh repo create "$GITHUB_USER/$REPO_NAME" \
      --"$GITHUB_VISIBILITY" \
      --source=. \
      --remote=origin \
      --description="Vibe Coding 与 AI 辅助编程的专业术语 Wiki · 178+ 词条 · 8 大层级 · 14 类场景" \
      --homepage="https://$GITHUB_USER.github.io/$REPO_NAME/" \
      --push 2>&1 | tail -10 || echo "  ⚠️  gh repo create failed. Run manually: gh repo create $GITHUB_USER/$REPO_NAME --public --source=. --push"
  fi
else
  echo "  ⚠️  gh CLI not installed. Install via: brew install gh"
  echo "  Then: gh auth login && gh repo create $GITHUB_USER/$REPO_NAME --public --source=. --push"
fi

echo ""
echo "=========================================="
echo "✅ Bootstrap complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "  1. Verify: gh repo view $GITHUB_USER/$REPO_NAME --web"
echo "  2. Enable Pages: Settings → Pages → Source: gh-pages"
echo "  3. Start star tracker:"
echo "       ops/star-tracker.sh daemon &"
echo "  4. Run daily report:"
echo "       python3 ops/star-report.py"