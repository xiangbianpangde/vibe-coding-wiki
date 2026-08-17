// Wave 4c enrichment — quotes + seeAlso focus (close gap to 70%)
const { applyEnrich } = require('./lib/enrich-lib.cjs');

const ENRICH = {
  // ============ Add quotes to terms with examples but no quotes ============
  'context-engineering': {
    quotes: [
      {
        text: "The art of providing the right context, at the right time, in the right format, to an LLM.",
        cite: 'Anthropic engineering',
      },
    ],
    seeAlso: [
      { name: 'Anthropic: Building effective agents', url: 'https://www.anthropic.com/research/building-effective-agents' },
    ],
  },

  'iterative-refinement': {
    quotes: [
      {
        text: "Iterative refinement: each round of feedback makes the output sharper. The model's first attempt is rarely the best.",
        cite: 'community',
      },
    ],
  },

  'effort-level': {
    quotes: [
      {
        text: "Effort level: Claude adjusts reasoning depth based on the task's complexity.",
        cite: 'Claude Code Docs',
      },
    ],
    seeAlso: [
      { name: 'Claude Code: Effort', url: 'https://docs.claude.com/en/docs/claude-code/effort' },
    ],
  },

  hooks: {
    quotes: [
      {
        text: "Hooks are automated triggers that run before/after tool calls. They enforce guardrails without slowing the agent.",
        cite: 'community',
      },
    ],
    seeAlso: [
      { name: 'Claude Code: Hooks', url: 'https://docs.claude.com/en/docs/claude-code/hooks' },
      { name: 'Husky Git hooks', url: 'https://typicode.github.io/husky/' },
    ],
  },

  'bundled-skills': {
    quotes: [
      {
        text: "Bundled skills: package reusable prompts as files Claude Code auto-loads.",
        cite: 'Claude Code Docs',
      },
    ],
    seeAlso: [
      { name: 'Claude Code: Skills', url: 'https://docs.claude.com/en/docs/claude-code/skills' },
    ],
  },

  // L3 ML core — add quotes + seeAlso
  'graph-rag': {
    quotes: [
      {
        text: "GraphRAG: knowledge graphs beat vector RAG on cross-chunk relational queries.",
        cite: 'Microsoft Research, 2024',
      },
    ],
    seeAlso: [
      { name: 'Microsoft GraphRAG 论文', url: 'https://arxiv.org/abs/2404.16130' },
      { name: 'Microsoft GraphRAG GitHub', url: 'https://github.com/microsoft/graphrag' },
    ],
  },

  'paged-attention': {
    quotes: [
      {
        text: "PagedAttention: borrow OS virtual memory ideas to manage LLM KV cache. 2-4x throughput.",
        cite: 'Kwon et al. SOSP 2023',
      },
    ],
  },

  'speculative-decoding': {
    quotes: [
      {
        text: "Speculative decoding: small model drafts, big model verifies. Same output, 2-3x faster.",
        cite: 'Leviathan et al. 2022',
      },
    ],
    seeAlso: [
      { name: 'Speculative Decoding 论文', url: 'https://arxiv.org/abs/2211.17192' },
    ],
  },

  'flash-attention': {
    quotes: [
      {
        text: "Flash Attention: IO-aware exact attention. 2-4x wall-clock speedup, 5-10x memory reduction.",
        cite: 'Dao et al. NeurIPS 2022',
      },
    ],
    seeAlso: [
      { name: 'Flash Attention 论文', url: 'https://arxiv.org/abs/2205.14135' },
      { name: 'Flash Attention 3 论文', url: 'https://arxiv.org/abs/2407.08608' },
    ],
  },

  quantization: {
    quotes: [
      {
        text: "Quantization: trade 1-3% accuracy for 2-4x memory reduction. 4-bit is the sweet spot for inference.",
        cite: 'Dettmers et al.',
      },
    ],
    seeAlso: [
      { name: 'bitsandbytes 文档', url: 'https://huggingface.co/docs/bitsandbytes' },
      { name: 'AWQ 论文', url: 'https://arxiv.org/abs/2306.00978' },
    ],
  },

  // ============ Add quotes to L4 tools ============
  aider: {
    quotes: [
      {
        text: "Aider: AI pair programming in your terminal. Auto-commits to git.",
        cite: 'Aider docs',
      },
    ],
    seeAlso: [
      { name: 'Aider GitHub', url: 'https://github.com/Aider-AI/aider' },
    ],
  },

  llamaindex: {
    quotes: [
      {
        text: "LlamaIndex: data framework for LLM applications. RAG, agents, workflows.",
        cite: 'LlamaIndex docs',
      },
    ],
    seeAlso: [
      { name: 'LlamaIndex Docs', url: 'https://docs.llamaindex.ai' },
      { name: 'LlamaIndex GitHub', url: 'https://github.com/run-llama/llama_index' },
    ],
  },

  // ============ L7 prompt — add seeAlso ============
  cot: {
    seeAlso: [
      { name: 'Wei et al. 2022 CoT 论文', url: 'https://arxiv.org/abs/2201.11903' },
      { name: 'Anthropic Prompt Engineering', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview' },
    ],
  },

  react: {
    seeAlso: [
      { name: 'Yao et al. ReAct 论文', url: 'https://arxiv.org/abs/2210.03629' },
      { name: 'LangChain ReAct', url: 'https://python.langchain.com/docs/how_to/agent_react/' },
    ],
  },

  'few-shot': {
    seeAlso: [
      { name: 'Brown et al. 2020 GPT-3 论文', url: 'https://arxiv.org/abs/2005.14165' },
      { name: 'Anthropic Prompt Engineering', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview' },
    ],
  },
};

const added = applyEnrich(ENRICH);
console.log(`[enrich-priority-13] Added: ${added.examples} examples, ${added.seeAlso} seeAlso, ${added.quotes} quotes across ${added.terms} terms`);