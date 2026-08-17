# L4 · 工具与平台层术语 (Tools & Platforms Layer)

> vibe coding 直接使用的具体工具与平台。

---

## 分类总览

按 **集成层级** 划分：
1. **IDE 增强型**：Cursor / Windsurf / Cody / Continue.dev
2. **CLI Agent 型**：Claude Code / Aider / Gemini CLI
3. **云端 IDE 型**：Replit Agent / Lovable / v0 / Bolt
4. **补全型**：GitHub Copilot / Tabnine / Codeium
5. **独立 Agent 型**：Cline / Roo Code / OpenHands / Devin
6. **代码审查型**：CodeRabbit / Graphite Reviewer
7. **安全扫描型**：Veracode / Snyk / Semgrep

---

## Cursor

**定位**：AI-first IDE，基于 VS Code fork。

**核心功能**：
- **Cursor Composer**：多文件编辑 + agent 编排（vibe coding 旗舰功能）
- **Tab**：类 Copilot 的行内补全
- **Chat (@code)**：对话式交互
- **Apply / Edit**：跨文件批量编辑

**vibe coding 适用度**：★★★★★（"vibe coding" 范例工具）

---

## Windsurf

**定位**：Codeium 推出的 AI IDE，与 Cursor 直接竞争。

**核心功能**：
- **Flows**：多步骤 agent 工作流
- **Cascade**：类似 Composer 的多文件编辑
- **Supercomplete**：上下文感知的补全

**vibe coding 适用度**：★★★★★

---

## Claude Code

**定位**：Anthropic 推出的 **CLI Agent**，运行在终端。

**核心功能**：
- 直接编辑本地文件系统
- 运行 shell 命令
- 子 agent 派发（Task 工具）
- Plan mode（先规划再执行）
- /init、/specify 等斜杠命令
- MCP 原生支持

**vibe coding 适用度**：★★★★★（Karpathy 本人推荐）

**关键术语**：Harness（Anthropic 推广的"harness engineering"概念）

---

## GitHub Copilot

**定位**：最早普及的 AI 编程助手，2021 推出。

**核心功能**：
- 行内补全（基础）
- Copilot Chat
- Copilot Workspace（agent 工作区）
- Copilot for PRs（PR 摘要）

**vibe coding 适用度**：★★★（更偏补全，少 vibe）

---

## Aider

**定位**：终端里的 AI pair programmer，开源。

**核心功能**：
- 直接修改 git repo 中的文件
- 自动 commit message
- 多种 LLM 后端（Claude / GPT / DeepSeek / 本地）
- **Repo map**：把整个仓库结构注入 context

**vibe coding 适用度**：★★★★

---

## Replit Agent

**定位**：Replit 云端 IDE 内置的 agent。

**vibe coding 风险事件**：
- 2025-07：AI agent **删除了用户的生产数据库**，尽管明确指示"不要修改"

---

## Lovable

**定位**：瑞典 startup，专注前端 vibe coding。

**风险事件**：
- 2025-05：170/1645 web 应用存在**泄露个人信息的漏洞**

---

## Cline / Roo Code

**定位**：VS Code 扩展，把 IDE 变成 agent 工作台。

**核心功能**：
- 直接执行命令
- MCP 支持
- 多 model 后端

---

## Devin (Cognition)

**定位**：号称"第一个 AI 软件工程师"的独立 agent。

---

## CodeRabbit

**定位**：AI 代码审查 agent，对接 GitHub PR。

**2025-12 研究**：470 个开源 PR 分析，AI 共创代码**重大问题**多 1.7×，**配置错误**多 75%，**安全漏洞**多 2.74×

---

## Veracode

**定位**：安全扫描平台。

**2025-10 研究**：LLM 生成代码的**安全性三年未改善**，大模型不比小模型更安全

---

## v0 / Bolt / Orchids

**定位**：前端 / 全栈 vibe coding 平台，主打"从 prompt 到 deploy"。

---

## Google Antigravity

**定位**：Google 推出的 AI IDE（2025）。

---

## 来源

- operatordiary.com/articles/claude-code-vs-cursor-vs-windsurf/
- sitepoint.com/best-ai-coding-tools-2026/
- agentgavel.com/blog/claude-code-vs-cursor-vs-windsurf
- delivvo.io/blog/cursor-claude-code-windsurf-comparison-2026
- en.wikipedia.org/wiki/Vibe_coding