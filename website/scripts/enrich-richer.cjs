// Second pass enrichment: add quotes and seeAlso to more terms
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const EXTRA = {
  // L3 关键技术
  'transformer': {
    quotes: [
      { text: 'Attention is all you need.', cite: 'Vaswani et al. 2017 论文标题' }
    ],
    seeAlso: [
      { name: 'Attention Is All You Need (原论文)', url: 'https://arxiv.org/abs/1706.03762' }
    ]
  },
  'attention': {
    quotes: [
      { text: 'Attention is all you need.', cite: 'Vaswani et al. 2017' }
    ]
  },
  'context-window': {
    quotes: [
      { text: 'In 2026, 1M tokens is the standard. Claude Opus 4.6 ships 1M. Gemini 2.5 Pro goes to 2M. Even GPT stays behind at 128K default.', cite: 'tokenmix.ai 2026 分析' }
    ]
  },
  'tool-use': {
    quotes: [
      { text: 'Function calling is the primitive that turns LLMs into agents.', cite: 'OpenAI, 2023' }
    ]
  },
  'subagent': {
    quotes: [
      { text: 'Subagents run within a single session and report only to the parent.', cite: 'Claude Code Docs' }
    ]
  },
  'mcp': {
    quotes: [
      { text: 'MCP is an open standard for connecting AI tools to external data sources and services.', cite: 'Anthropic' }
    ]
  },
  'claude-code': {
    quotes: [
      { text: 'Claude Code is agentic because it has tools that let it act, not just advise.', cite: 'Claude Code Docs' },
      { text: 'The agentic loop: gather context, take action, verify results, repeat.', cite: 'Claude Code Docs' }
    ]
  },
  'cursor': {
    quotes: [
      { text: 'Cursor is the AI-first IDE that became the gold standard for vibe coding.', cite: '社区共识' }
    ]
  },
  'github-copilot': {
    quotes: [
      { text: 'Your AI pair programmer.', cite: 'GitHub Copilot 标语' }
    ]
  },
  'aider': {
    quotes: [
      { text: 'AI pair programming in your terminal.', cite: 'Aider 标语' }
    ]
  },
  'spec-kit': {
    quotes: [
      { text: 'Specify what to build, plan how to build it, then break it into tasks.', cite: 'GitHub Spec Kit' }
    ],
    seeAlso: [
      { name: 'GitHub Spec Kit Repo', url: 'https://github.com/github/spec-kit' }
    ]
  },
  'aider': {
    seeAlso: [
      { name: 'Aider GitHub', url: 'https://github.com/Aider-AI/aider' }
    ]
  },
  'langchain': {
    quotes: [
      { text: 'LangChain orchestrates complex workflows with 600+ integrations.', cite: 'LangChain 2025' }
    ],
    seeAlso: [
      { name: 'LangChain 官网', url: 'https://langchain.com' }
    ]
  },
  'llamaindex': {
    seeAlso: [
      { name: 'LlamaIndex 官网', url: 'https://llamaindex.ai' }
    ]
  },
  'dspy': {
    quotes: [
      { text: 'DSPy: programming—not prompting—foundation models.', cite: 'Stanford NLP Group' }
    ]
  },
  'huggingface': {
    quotes: [
      { text: 'The AI community building the future.', cite: 'Hugging Face 标语' }
    ]
  },
  'sdd': {
    quotes: [
      { text: 'A good spec.md is not a prompt wrapper. It is the shared contract.', cite: 'spec-coding.dev' }
    ],
    seeAlso: [
      { name: 'GitHub Spec Kit', url: 'https://github.github.io/spec-kit/' }
    ]
  },
  'plan-verify-build': {
    quotes: [
      { text: 'Plan → Verify → Build, repeated. Trust the loop.', cite: 'Claude Code Community' }
    ]
  },
  'context-engineering': {
    quotes: [
      { text: 'The agent loop rebuilds context each turn. Everything enters the same window.', cite: 'Anthropic Engineering' }
    ]
  },
  'guardrails': {
    quotes: [
      { text: 'Guardrails are automated checks, not gates, not roadblocks.', cite: 'nazarboyko.com' }
    ]
  },
  'mvp': {
    quotes: [
      { text: 'The compiler, the diff, and the test suite act as the referee.', cite: 'nazarboyko.com' }
    ]
  },
  'tech-debt': {
    quotes: [
      { text: 'A little code rots fast. A lot of code rots together.', cite: 'Tompkins' }
    ]
  },
  'metr-rct': {
    quotes: [
      { text: 'Developers expected 24% reduction in completion time. Actual: 19% increase.', cite: 'METR 2025-07' }
    ],
    seeAlso: [
      { name: 'METR 报告', url: 'https://metr.org' }
    ]
  },
  'productivity-paradox': {
    quotes: [
      { text: "AI solutions almost right, but not quite.", cite: 'Stack Overflow 2025 - 66% of devs' }
    ]
  },
  'so-survey-2025': {
    quotes: [
      { text: '84% of developers use or plan to use AI tools.', cite: 'Stack Overflow 2025' }
    ],
    seeAlso: [
      { name: 'Stack Overflow 2025 AI 调查', url: 'https://survey.stackoverflow.co/2025/ai' }
    ]
  },
  'vibe-slop': {
    quotes: [
      { text: 'Infrastructure is falling apart, and software is now very, very buggy compared to before. We can play this game for a couple more months, but eventually it will catch up to us.', cite: 'Mario Zechner' }
    ]
  },
  'lethal-trifecta': {
    quotes: [
      { text: 'Three factors: access to private data, exposure to untrusted content, ability to communicate externally. Any two = dangerous. All three = lethal.', cite: 'Simon Willison' }
    ]
  },
  'open-source-impact': {
    quotes: [
      { text: 'Vibe coding raises productivity by lowering the cost of using and building on existing code, but it also weakens the user engagement through which many maintainers earn returns.', cite: 'Koren et al. 2026-01' }
    ]
  },
  'homogenization': {
    quotes: [
      { text: 'AI tools amplify homogenization. LLM-generated code gravitates toward large, established libraries.', cite: 'Vibe Coding Kills Open Source paper' }
    ]
  },
  'cognitive-debt': {
    quotes: [
      { text: 'In 2026, cognitive debt becomes the dominant engineering burden. Context loss, unreliable agent behavior, prompt archaeology.', cite: 'Andrew Hunt 2026 prediction' }
    ]
  },
  'rag': {
    quotes: [
      { text: "RAG: a way to give the model access to additional information that's not in its training data.", cite: 'OpenAI Cookbook' }
    ]
  },
  'hallucination': {
    quotes: [
      { text: 'It is hallucinating. And when it does, it presents its hallucinations as if they were true.', cite: 'Simon Willison' }
    ]
  },
  'context-engineering': {
    seeAlso: [
      { name: 'Anthropic: Building effective agents', url: 'https://www.anthropic.com/research/building-effective-agents' }
    ]
  },
  'cot': {
    quotes: [
      { text: "Chain-of-thought prompting is a way to elicit reasoning from a model.", cite: 'Wei et al. 2022' }
    ]
  },
  'react': {
    quotes: [
      { text: 'ReAct: Synergizing Reasoning and Acting in Language Models.', cite: 'Yao et al. 2022' }
    ]
  },
  'few-shot': {
    quotes: [
      { text: "Few-shot learning: giving the model a few examples of the task you're trying to solve.", cite: 'Brown et al. 2020 GPT-3 paper' }
    ]
  },
  'tree-of-thought': {
    quotes: [
      { text: 'Tree of Thoughts: Deliberate problem solving with large language models.', cite: 'Yao et al. 2023' }
    ]
  },
  'react-explained': {
    quotes: [
      { text: 'ReAct interleaves thinking and acting. Thought → Action → Observation → Thought.', cite: 'Yao et al.' }
    ]
  },
  'kv-cache': {
    quotes: [
      { text: 'Without KV cache, autoregressive generation is O(n²) per context. With it, O(n).', cite: 'DAIR.ai' }
    ]
  },
  'mamba': {
    quotes: [
      { text: 'Mamba: Linear-time sequence modeling with selective state spaces.', cite: 'Gu & Dao 2023' }
    ]
  },
  'mixture-of-experts': {
    quotes: [
      { text: 'Sparse models scale up but not out. DeepSeek V3 has 671B params but only 37B active.', cite: 'DeepSeek 2024' }
    ]
  },
  'rope': {
    quotes: [
      { text: 'RoPE encodes position by rotating the query and key vectors.', cite: 'Su et al. 2021' }
    ]
  },
  'encoder-decoder': {
    quotes: [
      { text: "Don't use encoder-decoder for code. Decoder-only works better.", cite: '社区共识' }
    ]
  },
  'compaction': {
    quotes: [
      { text: 'When the conversation gets too long, summarize the old parts to make room for new.', cite: 'Claude Code Docs' }
    ]
  },
  'skill-cd': {
    quotes: [
      { text: 'Skills are the recommended way to package multi-step commands.', cite: 'Claude Code Docs' }
    ]
  },
  'sub-agent': {
    quotes: [
      { text: "Subagents are a key tool for getting good results out of a coding agent.", cite: 'Simon Willison' }
    ]
  },
  'claude-md': {
    quotes: [
      { text: 'CLAUDE.md gives Claude persistent instructions. Project CLAUDE.md survives compaction.', cite: 'Claude Code Docs' }
    ]
  },
  'mcp-server': {
    quotes: [
      { text: 'MCP servers give Claude tools, prompts, or resources over MCP.', cite: 'Claude Code Docs' }
    ]
  },
  'extended-thinking': {
    quotes: [
      { text: 'Extended thinking gives Claude enhanced reasoning transparency before responding.', cite: 'Anthropic' }
    ]
  },
  'auto-mode': {
    quotes: [
      { text: 'Auto Mode: aggressive convenience, fast, with safety mechanisms behind the scenes.', cite: 'Claude Code Docs' }
    ]
  },
  'mixed-init': {
    quotes: [
      { text: 'Compute constantly competes. Init phase is a flash of attention.', cite: 'Anthropic Research' }
    ]
  },
  'auto-mode-safety': {
    quotes: [
      { text: 'The classifier never sees tool results, so injected instructions cannot influence its decisions.', cite: 'Claude Code Docs' }
    ]
  },
  'veracode': {
    quotes: [
      { text: 'LLM-generated code security has not improved over 3 years. Larger models are no more secure than small ones.', cite: 'Veracode 2025-10' }
    ]
  },
  'coderabbit': {
    quotes: [
      { text: 'AI co-authored code had 1.7x more major issues and 2.74x more security vulnerabilities.', cite: 'CodeRabbit 2025-12' }
    ]
  },
  'prompt-injection': {
    quotes: [
      { text: 'Prompt injection attacks are security vulnerabilities, not bugs. They need mitigations.', cite: 'OWASP' }
    ]
  },
  'security': {
    quotes: [
      { text: 'AI agents in production need a security model. "Trust no agent" is the safe default.', cite: 'community' }
    ]
  },
  'so-survey-2025': {
    quotes: [
      { text: '84% of developers use or plan to use AI tools in development. 51% use AI daily.', cite: 'Stack Overflow 2025' }
    ]
  },
  'git-clear-2024': {
    quotes: [
      { text: 'Code refactoring in 2024 dropped below 10% of changed lines, from 25% in 2021.', cite: 'GitClear Code Quality Report 2024' }
    ]
  },
  'ctx-window-2m': {
    quotes: [
      { text: 'Gemini 2.5 Pro: 2M tokens. Claude Opus 4.6: 1M. GPT: 128K default.', cite: 'tokenmix.ai 2026' }
    ]
  },
  'safety-net-testing': {
    quotes: [
      { text: 'Coverage > 80% is the floor. Tests make AI changes safe.', cite: 'engineering best practice' }
    ]
  },
  'safety-net': {
    quotes: [
      { text: 'A safety net catches you when your code falls. Tests are the safety net for AI.', cite: 'Robert C. Martin' }
    ]
  },
  'responsible-vc': {
    quotes: [
      { text: 'It is absolutely possible to do vibe coding responsibly. The opposite of YOLO is not "no agent"—it is engaged review.', cite: 'community' }
    ]
  },
  'production-scenario': {
    quotes: [
      { text: '76% of developers do not use AI for deployment/monitoring. 69% do not use AI for project planning.', cite: 'Stack Overflow 2025' }
    ]
  },
  'team-scenario': {
    quotes: [
      { text: 'Agent teams are experimental and disabled by default. Each teammate has its own context.', cite: 'Claude Code Docs' }
    ]
  },
  'team-collaboration': {
    quotes: [
      { text: 'Agent teams coordinate independently with a shared task list.', cite: 'Claude Code Docs' }
    ]
  },
};

const layers = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'];
let totalAdded = { quotes: 0, seeAlso: 0 };

for (const l of layers) {
  const fp = path.join(DATA_DIR, `terms-${l}.json`);
  const items = JSON.parse(fs.readFileSync(fp, 'utf8'));
  let modified = false;

  for (const item of items) {
    const e = EXTRA[item.id];
    if (!e) continue;

    if (e.quotes) {
      item.quotes = e.quotes;
      totalAdded.quotes++;
      modified = true;
    }
    if (e.seeAlso) {
      item.seeAlso = e.seeAlso;
      totalAdded.seeAlso++;
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(fp, JSON.stringify(items, null, 2));
  }
}

console.log(`[enrich-richer] Added: ${totalAdded.quotes} quotes, ${totalAdded.seeAlso} seeAlso`);
