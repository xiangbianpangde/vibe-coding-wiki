# Vibe Coding Wiki

> **从 Karpathy 创造的"vibe coding"出发 · 178+ 核心术语 · 8 大层级 · 14 类使用场景**

A professional knowledge base for **Vibe Coding** and AI-assisted programming terminology. Built with Chinese traditional color design system (《中国传统色 Studio》).

🌐 **Live Demo**: [https://xiangbianpangde.github.io/vibe-coding-wiki](https://xiangbianpangde.github.io/vibe-coding-wiki) (after deployment)

---

## ✨ 亮点

- 📚 **178+ 核心术语** — Karpathy 2025-2026 + Claude Code 官方词汇表 + 120 LLM 技术术语
- 🏛️ **8 大层级** — Paradigm / Methodology / Tech / Tools / Quality / Risk / Prompt / Scenarios
- 🎨 **中国色设计系统** — 暖纸基底、衬线中文、锐角无圆角（继承《中国传统色 Studio》）
- 🌗 **暗色模式** — 玄青主导，可切换且持久化
- 📊 **数据仪表板** — Stack Overflow 2025 / METR / CodeRabbit / Veracode / GitClear
- ⚖️ **5 范式对比** — Vibe Coding / Responsible VC / Vibe Engineering / Agentic Engineering / Traditional Eng
- 🔍 **⌘K 全局搜索** + 详情页三栏布局 + 9 路由全 200 OK
- 🛤️ **WCAG 2.1 AA** — ARIA / skip-link / 高对比度 / 键盘导航
- 📦 **零构建依赖** — 纯静态 HTML/CSS/JS，部署到任何 CDN

## 🚀 快速开始

```bash
# 克隆
git clone https://github.com/xiangbianpangde/vibe-coding-wiki.git
cd vibe-coding-wiki

# 本地预览
cd website
python3 -m http.server 8765
# 访问 http://localhost:8765
```

## 📂 目录结构

```
vibe-coding-wiki/
├── research/          # 8 篇研究笔记（调研资料）
├── knowledge/         # 5 篇知识库笔记（关系图谱、引用汇总）
├── website/           # 站点源文件
│   ├── index.html           # 首页
│   ├── term.html            # 词条详情页模板（动态 178 词条）
│   ├── favicon.svg          # 品牌图标
│   ├── sitemap.xml          # SEO 站点地图（186 URLs）
│   ├── robots.txt           # 爬虫规则
│   ├── css/                 # 8 个 CSS 文件
│   ├── js/                  # 10 个 JS 文件
│   ├── data/                # 9 个 JSON 数据文件
│   ├── pages/               # 7 个内容页
│   └── scripts/             # 6 个构建/注入脚本
├── ops/               # 4 个运维工具（Star 监控等）
├── reports/           # /talk 生成的验收报告 PDF
├── AUDIT-V2.0.md      # v2.0 审计报告
├── LICENSE            # MIT
└── README.md          # 本文件
```

## 📚 内容统计

| 层级 | 词条数 | 描述 |
|---|---|---|
| L1 范式 | 16 | Vibe Coding / Agentic Engineering / Cognitive Debt |
| L2 方法 | 20 | SDD / Context Engineering / Plan-Verify-Build |
| L3 技术 | 53 | LLM / MCP / RAG / LoRA / MoE / Mamba |
| L4 工具 | 28 | Claude Code / Cursor / LangChain / LlamaIndex |
| L5 质量 | 14 | Guardrails / MVP / YOLO Mode / Auto Mode |
| L6 风险 | 17 | Lethal Trifecta / Vibe Slop / METR / CodeRabbit |
| L7 Prompt | 16 | CoT / ReAct / Few-Shot / Self-Consistency |
| L8 场景 | 14 | 一次性原型 / 生产维护 / 安全敏感 |

**富内容覆盖**：
- 87 词条有代码示例
- 106 词条有直接引文
- 101 词条有外部链接
- 178 词条全部自动生成「相关词条」「演进时间线」「学习路径」

## 🎨 设计系统

继承《中国传统色 Studio》设计哲学：

| 元素 | 颜色 | 用途 |
|---|---|---|
| 乳白 | `#F9F4DC` | 主背景（暖纸） |
| 墨黑 | `#0F1A20` | 主文字 |
| 玄青 | `#2B3A4F` | L1 范式层 |
| 绀青 | `#4F84FF` | L2 方法论层 |
| 竹青 | `#00A86B` | L3 技术层 |
| 石青 | `#2E5D8C` | L4 工具层 |
| 鎏金 | `#D4AF37` | L5 质量层 |
| 朱砂 | `#F43E06` | L6 风险层 |
| 黛色 | `#3B4F5C` | L7 Prompt |
| 浅绛 | `#D9A594` | L8 场景 |

字体：
- 标题：`Noto Serif SC` (衬线)
- 正文：`Avenir Next` / `PingFang SC`
- 数字：`M PLUS Rounded 1c`

## 🚢 部署

### 静态部署（推荐）

任何静态托管都可：

```bash
# Vercel
vercel deploy website

# Netlify
netlify deploy --dir=website

# Cloudflare Pages
wrangler pages deploy website
```

### GitHub Pages

1. Fork 本 repo
2. Settings → Pages → Source: `main` branch / `website` folder
3. 访问 `https://<username>.github.io/vibe-coding-wiki/`

### 自定义域名

在 `website/CNAME` 写入你的域名，DNS 添加 CNAME 记录。

## 🛠️ 开发

### 文件组织

- `website/data/terms-L{1-8}.json` — 178 词条分层数据
- `website/js/terms.js` — 浏览器侧同步加载版本（从 JSON 重建）
- `website/scripts/` — 构建脚本（split-terms / enrich-* / rebuild-terms / inject-*）

### 修改词条

```bash
# 1. 编辑 JSON
vim website/data/terms-L3.json

# 2. 重建 terms.js
node website/scripts/rebuild-terms.js

# 3. 提交
git add website/
git commit -m "feat: update term MCP examples"
```

### 添加新词条

```bash
# 1. 在对应 layer JSON 添加
# 2. 跑重建
node website/scripts/rebuild-terms.js
# 3. 重建 sitemap（如果新词条）
node website/scripts/build-sitemap.js
```

## 🧪 测试

```bash
cd website
npm install                 # 首次安装依赖

# 单元测试（fast，~1s） — vitest + happy-dom
npm run test:unit

# E2E 测试（~2min） — playwright chromium
npm run test:e2e            # 需要先 npx playwright install chromium
```

**测试覆盖**：
- `tests/unit/data.test.js` — 178 词条完整性（字段、layer、related 引用、分布）
- `tests/unit/search.test.js` — 搜索算法（"vibe" ≥ 3 结果、大小写、id 前缀、空白处理）
- `tests/unit/related-algo.test.js` — VC_RELATED_ALGO（5-8 结果、无 orphan 引用、无 self-ref）
- `tests/e2e/term-detail.spec.js` — 参数化访问 178 词条详情页 + TOC 动态性
- `tests/e2e/search.spec.js` — ⌘K 弹窗、搜索结果、Enter 跳转、Escape 关闭
- `tests/e2e/theme.spec.js` — light/dark 切换 + localStorage 持久化
- `tests/e2e/mobile.spec.js` — < 768px 汉堡菜单 + aria-expanded
- `tests/e2e/home.spec.js` — 首页渲染 + og:image meta

**本地 e2e 限制**：playwright chromium 下载需联网。本地装不上时：
- ✅ **方案 A**（推荐）：推 PR 触发 `.github/workflows/test.yml` 在 GitHub Actions 跑
- ✅ **方案 B**：用 `agent_browser` 手动验证关键路径（首页/详情页/搜索/主题/移动端）

## 🔄 CI

- `.github/workflows/test.yml` — PR/push 到 main 触发
  - `unit` job：vitest 24+ 测试
  - `e2e` job：playwright（chromium with deps）+ static server
  - `data-integrity` job：data integrity 守门
- `.github/workflows/deploy.yml` — 自动部署到 GH Pages

## 🗺️ Roadmap

| 阶段 | 状态 | 描述 |
|---|---|---|
| **v2.1** | ✅ 已上线 | 178 词条 · 8 层级 · 14 场景 · GitHub Pages 部署 |
| **v2.1.1** | ✅ 已上线 | 暗色对比度 · og:image · TOC discoverability · 数据完整性修复 |
| **Wave 1-3** | ✅ 已完成 | 79 词条内容扩充（examples 49% / quotes 60% / seeAlso 57%） |
| **Round 1** | 🟡 进行中 | async loading — terms.js (200KB) → 按 layer 异步加载，预期首屏 <60KB |
| **Wave 4** | ⏸️ 等待 | Round 1 KEEP 后启动，推 examples / quotes / seeAlso 到 70%+ |
| **Round 2** | ⏸️ 计划 | Service Worker 离线缓存 — 重复访问加载瞬时化 |
| **Round 3+** | 💭 探索 | SVG sprite 化 / data.js 合并 / SSR / 术语版本历史 |

**1k star 进度**：⭐ 0 / 1000（`launchd` daemon 每 5 分钟查一次，达标自动庆祝）

## 🤝 贡献

欢迎贡献！请：

1. Fork → 创建分支 → 修改
2. 提交前跑：
   ```bash
   node website/scripts/rebuild-terms.js
   ```
3. 提 PR，描述变更

## 📄 License

MIT — 见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- **Karpathy** — 创造 vibe coding 术语
- **Simon Willison** — 创造 vibe engineering 术语
- **Martin Fowler** — 创造 Agentic Programming 术语
- **Andrew Hunt** — 创造 Cognitive Debt 术语
- **Anthropic** — Claude Code 官方词汇表
- **Wikipedia** / **MDN** / **DevDocs** — 设计参考
- **《中国传统色 Studio》** — 设计哲学来源

---

**v2.1 · 2025-08-17 · 11,534 LOC · 7/7 优化项完成**
