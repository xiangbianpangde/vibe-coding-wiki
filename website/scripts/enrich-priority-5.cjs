// Wave 3c enrichment — 10 more terms toward 70% coverage
// Refactored to use shared lib/enrich-lib.cjs (deduplicated boilerplate)
// Original ENRICH data preserved — merge+dedupe logic now in lib.

const { applyEnrich } = require('./lib/enrich-lib.cjs');

const ENRICH = {
  // ============ L1 范式 ============
  'cognitive-debt': {
    examples: [
      {
        code: `# Cognitive Debt 与 Technical Debt 的差异
# Technical Debt: 代码债 (编译失败、重复代码、复杂耦合)
# Cognitive Debt: 上下文债 (不知道 AI 改了什么、不知道为什么这样写)

# 典型场景：6 个月后回来接手
def mysterious_function(x):
    # TODO: ??? 不知道干嘛，也不敢动
    return some_unclear_transformation(x)

# Cognitive debt 让团队无法维护 AI 生成的代码
# 解法：spec.md / CLAUDE.md / 严格测试套件 / git history 可追溯`,
        desc: "Cognitive debt vs technical debt 实测对比",
      },
    ],
    quotes: [
      {
        text: "In 2026, cognitive debt becomes the dominant engineering burden. Context loss, unreliable agent behavior, prompt archaeology.",
        cite: 'Andrew Hunt 2026 prediction',
      },
    ],
    seeAlso: [
      { name: 'Andrew Hunt: Cognitive Debt 词条', url: 'https://www.huntthought.com/2026/cognitive-debt' },
      { name: 'Hunt: Technical Debt is Still Real', url: 'https://www.huntthought.com/2026/tech-debt' },
    ],
  },

  'agentic-engineering': {
    examples: [
      {
        code: `# Agentic Engineering 工作流（vs Vibe Coding）
# Vibe Coding: "给我写一个登录页"
# Agentic Engineering: "我需要 OAuth 登录，请按以下规范执行"

# 1. 写 spec.md (含验收标准)
# 2. 用 subagent 并行：frontend / backend / tests
# 3. plan-verify-build 循环：每个 subagent 都跑测试
# 4. 人类 review diff + architecture decisions
# 5. 部署 + 监控`,
        desc: "Agentic engineering vs vibe coding 对比",
      },
    ],
    seeAlso: [
      { name: 'Simon Willison: Agentic engineering', url: 'https://simonwillison.net/2025/Mar/16/agentic-engineering/' },
      { name: 'Martin Fowler: AI-Assisted Engineering', url: 'https://martinfowler.com/articles/exploring-gen-ai.html' },
    ],
  },

  'vibe-engineering': {
    seeAlso: [
      { name: 'Simon Willison: Vibe engineering', url: 'https://simonwillison.net/2025/Oct/7/vibe-engineering/' },
      { name: 'Vibe Coding 词条', url: 'https://simonwillison.net/2025/Feb/2/simulating-pi-with-100-million-lines-of-code/' },
    ],
    quotes: [
      {
        text: "Vibe engineering is vibe coding for people who know what they are doing.",
        cite: 'Simon Willison, 2025-10',
      },
    ],
  },

  // ============ L4 工具（仍空）==========
  'coding-agents': {
    examples: [
      {
        code: `# Coding Agents 通用模式（Claude Code / Codex CLI / Cline / Devin 等）
async function coding_agent(task, repo) {
  loop {
    context = await observe(repo)         // ls / grep / read files
    plan = await llm.think(context, task) // decide next action
    if (plan.action === "finish") return plan.result
    result = await execute(plan.action)   // edit / test / git commit
    if (result.failed) revert()           // safety net
    task = await verify(result, task)     // re-evaluate
  }
}`,
        desc: "Coding agent 通用循环伪代码",
      },
    ],
    quotes: [
      {
        text: "Coding agents autonomously plan, edit, test, and iterate on real software tasks.",
        cite: 'Anthropic / OpenAI docs, 2025',
      },
    ],
    seeAlso: [
      { name: 'Claude Code 文档', url: 'https://docs.claude.com/en/docs/claude-code' },
      { name: 'OpenAI Codex CLI', url: 'https://github.com/openai/codex' },
      { name: 'Anthropic: Building effective agents', url: 'https://www.anthropic.com/research/building-effective-agents' },
    ],
  },

  tabnine: {
    examples: [
      {
        code: `# Tabnine: 本地/云端 AI 代码补全
# 特点：可选本地模型（保护代码不出网）
# 安装：VS Code / JetBrains 扩展市场搜 "Tabnine"
# 模式：
#   - Pro: 云端模型（GPT-class）
#   - Enterprise: 本地模型 + 团队私有训练

def calculate_total(items):
    # Tabnine 自动补全建议：
    # return sum(item.price * item.quantity for item in items)`,
        desc: "Tabnine 本地/云端补全模式",
      },
    ],
    quotes: [
      {
        text: "Tabnine: AI code completion trained on permissively licensed code, with optional on-prem deployment.",
        cite: 'Tabnine.com',
      },
    ],
    seeAlso: [
      { name: 'Tabnine 官网', url: 'https://www.tabnine.com' },
      { name: 'Tabnine Docs', url: 'https://docs.tabnine.com' },
    ],
  },

  'gemini-cli': {
    examples: [
      {
        code: `# Gemini CLI (Google): 终端 agent
$ gemini "为这个 Python 项目添加 README"
# Gemini CLI 会：
# 1. 扫描项目结构
# 2. 生成 README.md 模板
# 3. 在 terminal 中显示 diff
# 4. 等待 y/N 确认

# 也支持 @file 引用：
$ gemini "@main.py 这段代码为什么慢？"`,
        desc: "Gemini CLI 终端 agent 用法",
      },
    ],
    quotes: [
      {
        text: "Gemini CLI: open-source AI agent for your terminal, powered by Gemini 2.5 Pro's 1M context.",
        cite: 'Google AI, 2025',
      },
    ],
    seeAlso: [
      { name: 'Gemini CLI GitHub', url: 'https://github.com/google-gemini/gemini-cli' },
    ],
  },

  // ============ L3 技术概念 ============
  'agent-teams': {
    examples: [
      {
        code: `# Claude Code Agent Teams: 多 agent 协作
# 启动：/agents 命令
# 配置 teammates（每个有独立 context window）
# 共享 task list + worktree

# 典型工作流：
# 1. Lead agent 把任务拆成 3 个子任务
# 2. 分发给 3 个 teammate agent（并行）
# 3. 每个 agent 在自己的 worktree 工作
# 4. 完成后 merge 回主分支`,
        desc: "Claude Code agent teams 并行协作",
      },
    ],
    quotes: [
      {
        text: "Agent teams coordinate independently with a shared task list. Each teammate has its own context.",
        cite: 'Claude Code Docs',
      },
    ],
    seeAlso: [
      { name: 'Claude Code: Agent Teams', url: 'https://docs.claude.com/en/docs/claude-code/agent-teams' },
      { name: 'Claude Code: Subagents', url: 'https://docs.claude.com/en/docs/claude-code/sub-agents' },
    ],
  },

  'mcp-tool-search': {
    examples: [
      {
        code: `# MCP Tool Search (Anthropic, 2025-05)
# 解决：MCP server 多时工具太多塞爆 context
# 用法：把工具描述摘要存在向量库，按需召回

// 旧方式：所有工具描述都进 prompt
const tools = [...100Tools];   // 50K tokens

// 新方式：工具搜索
const relevantTools = await toolSearch(query, topK=10);
// 只把相关的 10 个工具描述进 prompt`,
        desc: "MCP Tool Search 节省 context",
      },
    ],
    quotes: [
      {
        text: "Tool search reduces token usage by 85% when working with many MCP servers.",
        cite: 'Anthropic Engineering, 2025-05',
      },
    ],
    seeAlso: [
      { name: 'Anthropic: Tool Search', url: 'https://www.anthropic.com/engineering/advanced-tool-use' },
      { name: 'MCP 文档', url: 'https://modelcontextprotocol.io' },
    ],
  },

  'system-prompt': {
    examples: [
      {
        code: `# Anthropic system prompt 标准结构
messages = [{
  "role": "user",
  "content": [{
    "type": "text",
    "text": "你是一个严谨的技术文档作者..."
  }, {
    "type": "text",
    "text": "<project_context>...</project_context>",
    "cache_control": {"type": "ephemeral"}   // ← 提示缓存
  }],
  "content": "用户的实际问题"
}]`,
        desc: "Anthropic system prompt + prompt caching",
      },
    ],
    quotes: [
      {
        text: "The system prompt sets the model's behavior. It is the most important lever for output quality.",
        cite: 'Anthropic Prompt Engineering Guide',
      },
    ],
    seeAlso: [
      { name: 'Anthropic Prompt Engineering', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview' },
      { name: 'OpenAI Prompt Engineering', url: 'https://platform.openai.com/docs/guides/prompt-engineering' },
    ],
  },

  chunking: {
    examples: [
      {
        code: `# LangChain: 文档 chunking
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,        # 每个 chunk 1000 字符
    chunk_overlap=200,      # 相邻 chunk 重叠 200 字符（保留上下文）
    separators=["\\n\\n", "\\n", " ", ""],
)

chunks = splitter.split_text(long_document)
print(len(chunks))   # → ~200 chunks

# 选 chunk_size 的经验：
#   - 512: 适合 QA、检索（细粒度）
#   - 1024: 适合大多数 RAG
#   - 2048: 适合长文档摘要`,
        desc: "RecursiveCharacterTextSplitter chunking",
      },
    ],
    quotes: [
      {
        text: "Chunking strategy is the most underrated part of RAG. Wrong chunk size kills retrieval quality.",
        cite: 'LlamaIndex engineering blog',
      },
    ],
    seeAlso: [
      { name: 'LangChain Text Splitters', url: 'https://python.langchain.com/docs/how_to/text_splitters/' },
      { name: 'LlamaIndex Node Parsers', url: 'https://docs.llamaindex.ai/en/stable/module_guides/loading/node_parsers/' },
    ],
  },
};;

const added = applyEnrich(ENRICH);
console.log(`[enrich-priority-5] Added: ${added.examples} examples, ${added.seeAlso} seeAlso, ${added.quotes} quotes across ${added.terms} terms`);
