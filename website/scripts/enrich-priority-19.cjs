// Wave 6b — Round 6 L8 Scenarios deep-dive (10 terms)
// Real-world scenarios with concrete workflows + tools
const { applyEnrich } = require('./lib/enrich-lib.cjs');

const ENRICH = {
  'personal-scenario': {
    examples: [
      {
        code: `# Personal Tool Scenario: 只给自己用的工具
# 特征：
# - 单用户，不需要 auth / 多租户
# - 可以接受低质量（自己用坏了自己修）
# - 快速迭代，throw-away OK
# - 数据存本地（隐私）

# 典型工作流（2-3 小时做完）：
1. 在 Lovable / v0 描述想法
2. 生成代码 → 本地 git clone
3. 跑起来 + 修小 bug（Claude Code）
4. 用 1-2 周，坏了就重写

# 工具栈：
# - 前端: Lovable / v0 / Cursor Composer
# - 后端: Supabase / Cloudflare Workers
# - 部署: Vercel / Netlify / Cloudflare Pages
# - 数据: SQLite / LocalStorage

# 例：个人记账 / 习惯追踪 / 读书笔记 / RSS reader
# YOLO mode 完全 OK，因为只影响你自己`,
        desc: "Personal tool 典型工作流",
      },
    ],
    quotes: [
      {
        text: "Software for one: build apps for yourself, not for distribution. Vibe coding's sweet spot.",
        cite: 'Kevin Roose',
      },
    ],
    seeAlso: [
      { name: 'Lovable', url: 'https://lovable.dev' },
      { name: 'v0', url: 'https://v0.dev' },
      { name: 'Simon Willison: Software for One', url: 'https://simonwillison.net/tags/software-for-one/' },
    ],
  },

  'refactor-scenario': {
    examples: [
      {
        code: `# Refactor Scenario: 大规模代码重构
# 风险最高，必须有 safety net

# Pre-checklist:
# - 测试覆盖 ≥ 80%（关键模块 100%）
# - 类型系统启用（TypeScript strict / mypy --strict）
# - CI 必须绿
# - 有 rollback 机制（git revert / feature flag）

# Claude Code refactor 工作流：
1. /agents security-reviewer (subagent)
   - 找安全敏感代码路径
2. plan-verify-build 循环
   - 每次 refactor 跑全套测试
3. 小 PR（< 500 行 diff）
   - 减少 review 负担
4. 每 5 步自动 checkpoint
   - 可回退

# 实战：jQuery → React migration
# - 1 个 lead agent + 3 个 subagent (frontend / backend / tests)
# - 每个 subagent 在独立 worktree
# - 完成后 merge + 跑集成测试`,
        desc: "Refactor scenario safety-first 工作流",
      },
    ],
    quotes: [
      {
        text: "Refactor without tests = rewriting in production. Coverage > 80% is the floor, critical modules 100%.",
        cite: 'Robert C. Martin',
      },
    ],
    seeAlso: [
      { name: 'Claude Code: Subagents', url: 'https://docs.claude.com/en/docs/claude-code/sub-agents' },
      { name: 'Martin Fowler: Refactoring', url: 'https://martinfowler.com/books/refactoring.html' }
    ],
  },

  'learning-scenario': {
    examples: [
      {
        code: `# Learning Scenario: 学新技术 / 新语言 / 探索性编程
# 特点：低风险 / 高探索 / 失败 OK

# AI 加速学习路径：
# 1. 解释概念
prompt = "用 3 个真实代码例子解释 Rust 的所有权机制"

# 2. 对比已知
prompt = "对比 Rust ownership 和 Python GC，写出 3 个迁移建议"

# 3. 实战练习
prompt = "给我 5 个 Rust 练习题，从易到难，每题配答案"

# 4. Debug 帮助
prompt = "这段 Rust 代码为什么编译失败？\n[你的代码]"

# 工具：
# - Claude Code: /init（生成 CLAUDE.md 包含项目 context）
# - Cursor: Composer (ask "implement X step by step")
# - 学习 GitHub repo: 用 Claude Code /init + 全局 read`,
        desc: "Learning scenario 4 步 AI 加速路径",
      },
    ],
    quotes: [
      {
        text: "Use AI as a tutor while learning new tech. Vibe coding is well-suited for exploration.",
        cite: 'community',
      },
    ],
    seeAlso: [
      { name: 'Anthropic Prompt Library', url: 'https://docs.anthropic.com/en/resources/prompt-library/library' }
    ],
  },

  'team-scenario': {
    examples: [
      {
        code: `# Team Scenario: 多开发者 + PR 流程 + CI
# 关键：AI 提速但必须保持 review gate

# 团队 .claude/CLAUDE.md 模板：
\`\`\`markdown
# Project Conventions

## Code style
- 2-space indent (团队共识)
- TypeScript strict mode
- No semicolons (Prettier)

## Architecture
- Frontend: Next.js 14 App Router
- Backend: Fastify + PostgreSQL
- Monorepo: pnpm workspaces

## Do NOT
- 不要直接 push main
- 不要绕过 PR review
- 不要跳过 CI checks

## Required for every PR
- Tests added/updated
- CHANGELOG entry
- 2 approvals
\`\`\`

# 工作流：
# 1. AI 写代码 → 本地分支
# 2. claude --permission-mode default 保持审批
# 3. PR + 2 同事 review
# 4. CI 通过 → merge

# 关键：CLAUDE.md 是团队 source of truth`,
        desc: "Team scenario .claude/CLAUDE.md 模板",
      },
    ],
    quotes: [
      {
        text: "Team scenario: shared codebase, code review, CI/CD. CLAUDE.md is the source of truth for conventions.",
        cite: 'community',
      },
    ],
    seeAlso: [
      { name: 'Claude Code: Memory', url: 'https://docs.claude.com/en/docs/claude-code/memory' },
      { name: 'GitHub CODEOWNERS', url: 'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-rules/customizing-your-repository/about-code-owners' }
    ],
  },

  'testing-scenario': {
    examples: [
      {
        code: `# Testing Scenario: AI 写测试
# 风险最低的任务之一（test 自身会被运行验证）

# 1. 给函数 → AI 写 tests
code = """
def calculate_discount(price, tier):
    discounts = {'silver': 0.1, 'gold': 0.2, 'platinum': 0.3}
    return price * (1 - discounts.get(tier, 0))
"""

tests = llm(f"""
Write pytest tests for this function. Cover:
- Normal cases (silver/gold/platinum)
- Edge cases (invalid tier, price=0)
- Type errors
- Idempotency

\`\`\`python
{code}
\`\`\`
""")

# 2. 跑测试验证
import subprocess
result = subprocess.run(["pytest", "-xvs"], capture_output=True, text=True)
assert result.returncode == 0, f"Tests failed:\\n{result.stdout}"

# 优势：tests 必须可运行，AI 错就立刻暴露
# CI 友好：直接 commit`,
        desc: "Testing scenario AI 写 + 跑测试",
      },
    ],
    quotes: [
      {
        text: "AI writing tests is a relatively safe task: tests are self-verifying. Good first AI use case.",
        cite: 'community',
      },
    ],
    seeAlso: [
      { name: 'pytest', url: 'https://docs.pytest.org' },
      { name: 'Anthropic Prompt: Test Generation', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-system-prompts' }
    ],
  },

  'debug-scenario': {
    examples: [
      {
        code: `# Debug Scenario: 复现 + 修复 bug
# AI 加速：比纯人工快 2-3x

# Claude Code 实战 debug 工作流：
# 1. 复现（用 test 锁住）
$ claude "/reproduce-bug 'memory leak in worker pool'"

# 2. 找 root cause（不是猜）
$ claude "/analyze-log logs/worker-pool.log"
# 输出：
# - Symptom: 内存每 1h 涨 50MB
# - Recent change: 3 天前升级 redis client 4 → 5
# - Root cause hypothesis: redis 5 默认开启 connection pool，
#   但我们的 wrapper 没正确关闭

# 3. 加 test（防 regression）
$ claude "/add-test memory-leak-regression"
# Claude: "Added test_regression.py::test_pool_closes"

# 4. 修复 + 验证
$ claude "/fix-and-verify"
# - 修复: 添加 redis_client.close() 到 shutdown
# - 验证: 4h 内存稳定 200MB ±5MB
# - 测试: 12 passed

# 关键：root cause 不是猜，是 log 证据`,
        desc: "Debug scenario 4 步 Claude Code 工作流",
      },
    ],
    quotes: [
      {
        text: "Debug with AI: AI helps reproduce bugs, suggest fixes, write regression tests. Iterative refinement with the agent.",
        cite: 'community',
      },
    ],
    seeAlso: [
      { name: 'Claude Code: Slash Commands', url: 'https://docs.claude.com/en/docs/claude-code/slash-commands' }
    ],
  },

  'docs-scenario': {
    examples: [
      {
        code: `# Docs Scenario: 写 README / API 文档
# AI 强项之一（low risk, high value）

# 1. Code → Docs 反向
prompt = """
Generate a README for this Python module:

\`\`\`python
[module code]
\`\`\`

Include:
- 1-sentence description
- Installation
- Quickstart (5 lines of code)
- API reference (per public function)
- 1 example use case
- License (MIT)
"""

# 2. Doc strings
prompt = """
Add docstrings to all public functions in this file.
Format: Google style (Args, Returns, Raises, Example).
Be specific about types.
"""

# 3. Doc 同步代码 → CI 步骤
# - 每次 PR 自动检查 doc vs code signature
# - 漂移 → CI fail

# 优势：AI 写得快 + 准确（基于 code）
# 风险低：doc 错不会 crash 系统`,
        desc: "Docs scenario 3 步 AI 工作流",
      },
    ],
    quotes: [
      {
        text: "AI excels at generating documentation from code. Low risk, high value. Good CI step.",
        cite: 'community',
      },
    ],
    seeAlso: [
      { name: 'Google Python Style Guide', url: 'https://google.github.io/styleguide/pyguide.html' }
    ],
  },

  'frontend-scenario': {
    examples: [
      {
        code: `# Frontend Scenario: UI 组件 / 页面
# AI 工具最强场景之一（visual iteration loop）

# 推荐工具栈（2026）：
# - Lovable: 描述 → 全栈 React + Tailwind + shadcn/ui
# - v0: 描述 → React + Tailwind 组件
# - Cursor Composer: 多文件编辑
# - Claude Code: terminal agent

# 工作流示例：
# 1. 描述（在 Lovable）
prompt = "SaaS dashboard for project tracking. Sidebar nav, top stats cards, project list with Kanban toggle."

# 2. 调优（在 Lovable 或 v0）
prompt = "Make the sidebar collapsible. Add dark mode toggle."

# 3. 提取代码（copy to repo）
# 4. 自定义（Claude Code / Cursor）
# - 接入真实 API
# - 加 auth
# - 写组件 tests (vitest + Testing Library)

# 5. 部署（Vercel / Netlify）

# 时间：几小时 → 几天（vs 几周纯人工）`,
        desc: "Frontend scenario 现代工作流",
      },
    ],
    quotes: [
      {
        text: "Frontend is vibe coding's strongest use case: visual iteration loop, mostly safe.",
        cite: 'community',
      },
    ],
    seeAlso: [
      { name: 'Lovable', url: 'https://lovable.dev' },
      { name: 'v0', url: 'https://v0.dev' }
    ],
  },

  'data-scenario': {
    examples: [
      {
        code: `# Data Scenario: LLM 做数据分析 / SQL / 可视化
# 工具：
# - ChatGPT Code Interpreter: 上传 CSV → 自然语言 query
# - Claude with tools (Read + Bash): 读数据 → 写 SQL → 跑 query
# - LangChain SQL Agent: 自然语言 → SQL → 自动执行

# 工作流示例（SQL Agent）：
agent = create_sql_agent(llm, db=sqlalchemy.create_engine(postgres_url))

result = agent.run("""
哪些用户在上个月减少了订阅？
- 列出 user_id, churn_date, previous_tier, days_active
- 按 previous_tier 分组
- 输出 CSV
""")

# 风险：
# 1. SQL injection（用 parameterized queries）
# 2. 数据隐私（敏感字段脱敏）
# 3. 大查询 timeout（设 LIMIT + timeout）
# 4. 写操作权限（默认 readonly）`,
        desc: "Data scenario SQL Agent 工作流 + 风险",
      },
    ],
    quotes: [
      {
        text: "Data scenario: LLM-powered data analysis, code interpreters, SQL generation. Privacy is the main concern.",
        cite: 'community',
      },
    ],
    seeAlso: [
      { name: 'LangChain SQL Agent', url: 'https://python.langchain.com/docs/how_to/sql_agent' },
      { name: 'OpenAI Code Interpreter', url: 'https://platform.openai.com/docs/assistants/tools/code-interpreter' }
    ],
  },

  'onboarding-scenario': {
    examples: [
      {
        code: `# Onboarding Scenario: 快速理解陌生代码库
# Claude Code /init 是 killer feature

# 1. /init → 生成 CLAUDE.md
$ cd /path/to/unfamiliar-codebase
$ claude
> /init

# Claude 自动：
# - 读 README, package.json, 主要文件
# - 生成 CLAUDE.md 含：
#   - 项目概述（1-2 段）
#   - 架构图（ASCII）
#   - 关键文件清单
#   - 开发命令（dev, test, build）
#   - 约定（命名 / 风格）

# 2. 提问
$ claude "where is the auth flow implemented?"
$ claude "what's the data model for User?"
$ claude "how do I add a new endpoint?"

# 时间：1-2h 入门（vs 几天纯人工）`,
        desc: "Onboarding scenario /init killer feature",
      },
    ],
    quotes: [
      {
        text: "Use /init to generate CLAUDE.md as onboarding doc. AI reads the codebase, summarizes, answers questions.",
        cite: 'Claude Code Docs',
      },
    ],
    seeAlso: [
      { name: 'Claude Code: /init', url: 'https://docs.claude.com/en/docs/claude-code/init' }
    ],
  },

  'migration-scenario': {
    examples: [
      {
        code: `# Migration Scenario: 框架 / 语言迁移
# 高难度任务，需要严格 safety net

# 典型迁移：React Class → React Hooks / Python 2 → 3 / REST → GraphQL

# Claude Code 多 subagent 协作：
$ claude "Migrate src/components/ from React class to hooks. Tests must stay green."

# Claude 自动：
# 1. plan: 列出所有 class components
# 2. spawn 多个 subagent (parallel):
#    - subagent A: migrate Button.jsx + tests
#    - subagent B: migrate Form.jsx + tests
#    - subagent C: migrate Modal.jsx + tests
# 3. 每个 subagent in own worktree
# 4. 完成 → merge to main

# Safety nets:
# - 全套测试必须绿
# - 视觉回归（Playwright snapshots）
# - 灰度发布（feature flag）

# 时间：几周 → 几天`,
        desc: "Migration scenario 多 subagent 并行",
      },
    ],
    quotes: [
      {
        text: "Migration scenario: large-scale code transformation. AI helps but needs comprehensive tests. Use subagents per module.",
        cite: 'community',
      },
    ],
    seeAlso: [
      { name: 'Claude Code: Agent Teams', url: 'https://docs.claude.com/en/docs/claude-code/agent-teams' }
    ],
  },
};

const added = applyEnrich(ENRICH);
console.log(`[enrich-priority-19] Added: ${added.examples} examples, ${added.seeAlso} seeAlso, ${added.quotes} quotes across ${added.terms} terms`);