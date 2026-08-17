// Wave 3e enrichment — 12 L1/L2/L3 terms, focus on seeAlso gap
// Refactored to use shared lib/enrich-lib.cjs (deduplicated boilerplate)
// Original ENRICH data preserved — merge+dedupe logic now in lib.

const { applyEnrich } = require('./lib/enrich-lib.cjs');

const ENRICH = {
  // ============ L1 范式 ============
  'agentic-programming': {
    quotes: [
      {
        text: "Agentic programming uses LLMs as autonomous agents that plan, execute, and iterate on real software tasks.",
        cite: 'Simon Willison',
      },
    ],
    seeAlso: [
      { name: 'Simon Willison: Agentic engineering', url: 'https://simonwillison.net/2025/Mar/16/agentic-engineering/' },
      { name: 'Anthropic: Building effective agents', url: 'https://www.anthropic.com/research/building-effective-agents' },
    ],
  },

  'ai-assisted': {
    quotes: [
      {
        text: "AI-assisted programming augments developer capabilities, not replaces them.",
        cite: 'Martin Fowler',
      },
    ],
    seeAlso: [
      { name: 'Martin Fowler: AI Assistance', url: 'https://martinfowler.com/articles/exploring-gen-ai.html' },
      { name: 'GitHub Copilot 研究', url: 'https://github.blog/news-insights/research/research-the-impact-of-github-copilot/' },
    ],
  },

  'cognitive-debt-vs-tech-debt': {
    quotes: [
      {
        text: "Hunt's framework: 2025 is technical debt year, 2026 transitions to cognitive debt year. The type of engineering burden is migrating.",
        cite: 'Andrew Hunt',
      },
    ],
    seeAlso: [
      { name: 'Andrew Hunt: Cognitive Debt', url: 'https://www.huntthought.com/2026/cognitive-debt' },
      { name: 'Martin Fowler: Technical Debt', url: 'https://martinfowler.com/articles/isomorphism.html' },
    ],
  },

  'orchestration-of-agents': {
    quotes: [
      {
        text: "Orchestration of AI agents is the new role for developers: from writing code to managing autonomous collaborators.",
        cite: 'community',
      },
    ],
    seeAlso: [
      { name: 'Anthropic: Orchestration patterns', url: 'https://www.anthropic.com/research/building-effective-agents' },
      { name: 'LangGraph 文档', url: 'https://langchain-ai.github.io/langgraph/' },
    ],
  },

  'multi-agent-parallelism': {
    examples: [
      {
        code: `# Multi-Agent Parallelism: 多个 agent 并行解决多个问题
# 实测案例：Shimmin 用此方法一周写出完整 Rust 编译器

# 典型模式：
async function parallel_research(questions):
    agents = questions.map(q =>
        Agent(task=q, model="claude-sonnet-4-5")
    )
    results = await Promise.all(agents.map(a => a.run()))
    return merge(results)

# 适用场景：
# - 多文件并行重构
# - 多模块并行测试
# - 多角度并行调研

# 限制：
# - context 隔离（每个 agent 独立窗口）
# - 合并逻辑要清晰`,
        desc: "Multi-agent parallelism 实际模式",
      },
    ],
    quotes: [
      {
        text: "Multi-agent parallelism: Shimmin used this to write a complete Rust compiler in one week.",
        cite: 'community',
      },
    ],
    seeAlso: [
      { name: 'Claude Code: Agent Teams', url: 'https://docs.claude.com/en/docs/claude-code/agent-teams' },
      { name: 'Anthropic: Building effective agents', url: 'https://www.anthropic.com/research/building-effective-agents' },
    ],
  },

  'agentic-workflow': {
    quotes: [
      {
        text: "Agarwal: multi-step agentic workflows produce tech debt at machine speed without engineering practices.",
        cite: 'Agarwal',
      },
    ],
    seeAlso: [
      { name: 'LangGraph 文档', url: 'https://langchain-ai.github.io/langgraph/' },
      { name: 'CrewAI 文档', url: 'https://docs.crewai.com' },
    ],
  },

  // ============ L2 方法论 ============
  'spec-md': {
    quotes: [
      {
        text: "A good spec.md is not a prompt wrapper. It is the shared contract.",
        cite: 'spec-coding.dev',
      },
    ],
    seeAlso: [
      { name: 'GitHub Spec Kit', url: 'https://github.github.io/spec-kit/' },
      { name: 'Spec Coding Manifesto', url: 'https://spec-coding.dev' },
    ],
  },

  'iterative-refinement': {
    seeAlso: [
      { name: 'Anthropic: Building effective agents', url: 'https://www.anthropic.com/research/building-effective-agents' },
      { name: 'LangChain: Iterative refinement', url: 'https://python.langchain.com/docs/how_to/iterative_refinement/' },
    ],
  },

  'tdd-ai': {
    quotes: [
      {
        text: "TDD with AI: write the test first, let AI make it pass, then refactor. The test is the spec.",
        cite: 'community',
      },
    ],
    seeAlso: [
      { name: 'Martin Fowler: TDD', url: 'https://martinfowler.com/bliki/TestDrivenDevelopment.html' },
      { name: 'Kent Beck: TDD by Example', url: 'https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530' },
    ],
  },

  hooks: {
    seeAlso: [
      { name: 'Claude Code: Hooks', url: 'https://docs.claude.com/en/docs/claude-code/hooks' },
      { name: 'Husky Git hooks', url: 'https://typicode.github.io/husky/' },
    ],
  },

  commands: {
    seeAlso: [
      { name: 'Claude Code: Custom Commands', url: 'https://docs.claude.com/en/docs/claude-code/custom-commands' },
      { name: 'Claude Code: Slash commands', url: 'https://docs.claude.com/en/docs/claude-code/slash-commands' },
    ],
  },

  // ============ L3 核心技术 ============
  rag: {
    seeAlso: [
      { name: 'Lewis et al. 2020 RAG 原始论文', url: 'https://arxiv.org/abs/2005.11401' },
      { name: 'OpenAI Cookbook: RAG', url: 'https://cookbook.openai.com/examples/question_answering_using_embeddings' },
      { name: 'LlamaIndex RAG 指南', url: 'https://docs.llamaindex.ai/en/stable/getting_started/concepts/' },
    ],
  },
};;

const added = applyEnrich(ENRICH);
console.log(`[enrich-priority-7] Added: ${added.examples} examples, ${added.seeAlso} seeAlso, ${added.quotes} quotes across ${added.terms} terms`);
