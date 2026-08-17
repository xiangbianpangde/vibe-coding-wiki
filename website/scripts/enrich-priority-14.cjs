// Wave 4d — push quotes + seeAlso past 70% target
const { applyEnrich } = require('./lib/enrich-lib.cjs');

const ENRICH = {
  // ============ Add quotes (6 terms to close quotes gap) ============
  'manifest-file': {
    quotes: [
      {
        text: "A manifest file is the contract between your project and the AI: dependencies, scripts, version constraints.",
        cite: 'community',
      },
    ],
  },

  'managed-settings': {
    quotes: [
      {
        text: "Managed settings: IT pushes Claude Code config to all engineers via MDM. One config, one team.",
        cite: 'Claude Code Docs',
      },
    ],
    seeAlso: [
      { name: 'Claude Code: Settings', url: 'https://docs.claude.com/en/docs/claude-code/settings' },
    ],
  },

  'negative-prompting': {
    quotes: [
      {
        text: "Negative prompting: tell the model what NOT to do. Useful for safety constraints and style.",
        cite: 'community',
      },
    ],
    seeAlso: [
      { name: 'Anthropic Prompt Engineering', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview' },
    ],
  },

  decomposition: {
    quotes: [
      {
        text: "Decomposition: break complex tasks into smaller subtasks. The model handles each better than the whole.",
        cite: 'community',
      },
    ],
    seeAlso: [
      { name: 'Least-to-Most Prompting (Zhou et al. 2022)', url: 'https://arxiv.org/abs/2205.10625' },
    ],
  },

  'proto-scenario': {
    quotes: [
      {
        text: "Prototype scenarios: build fast, validate, throw away. The code is disposable.",
        cite: 'community',
      },
    ],
  },

  'security-scenario': {
    quotes: [
      {
        text: "Security-sensitive work: never use AI agents without guardrails. The lethal trifecta is real.",
        cite: 'Simon Willison',
      },
    ],
    seeAlso: [
      { name: 'Simon Willison: Lethal Trifecta', url: 'https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/' },
    ],
  },

  // ============ Add seeAlso (close seeAlso gap) ============
  // L3 technical core — 9 terms
  'reranker': {
    seeAlso: [
      { name: 'Cohere Rerank 文档', url: 'https://docs.cohere.com/docs/rerank-2' },
      { name: 'Sentence-BERT Cross-Encoder', url: 'https://www.sbert.net/examples/applications/cross-encoder/README.html' },
    ],
  },

  hyde: {
    seeAlso: [
      { name: 'HyDE 论文 (Gao et al. 2022)', url: 'https://arxiv.org/abs/2212.10496' },
    ],
  },

  'prompt-caching': {
    seeAlso: [
      { name: 'Anthropic: Prompt Caching', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching' },
    ],
  },

  peft: {
    seeAlso: [
      { name: 'HuggingFace PEFT', url: 'https://huggingface.co/docs/peft/index' },
    ],
  },

  rlaif: {
    seeAlso: [
      { name: 'RLAIF 论文 (Lee et al. 2023)', url: 'https://arxiv.org/abs/2309.00267' },
    ],
  },

  'orpo': {
    seeAlso: [
      { name: 'ORPO 论文 (Hong et al. 2024)', url: 'https://arxiv.org/abs/2403.07691' },
    ],
  },

  ipo: {
    seeAlso: [
      { name: 'IPO 论文 (Azar et al. 2023)', url: 'https://arxiv.org/abs/2310.12036' },
    ],
  },

  'constrained-decoding': {
    seeAlso: [
      { name: 'Outlines 库', url: 'https://github.com/outlines-dev/outlines' },
    ],
  },

  sampling: {
    seeAlso: [
      { name: 'HuggingFace: Generation 策略', url: 'https://huggingface.co/docs/transformers/generation_strategies' },
    ],
  },

  // Also close some seeAlso gaps in other layers
  'coderabbit': {
    seeAlso: [
      { name: 'CodeRabbit 官网', url: 'https://www.coderabbit.ai' },
    ],
  },

  veracode: {
    seeAlso: [
      { name: 'Veracode: 2025 GenAI Code Security Report', url: 'https://www.veracode.com/blog/2025-genai-code-security-report/' },
    ],
  },
};

const added = applyEnrich(ENRICH);
console.log(`[enrich-priority-14] Added: ${added.examples} examples, ${added.seeAlso} seeAlso, ${added.quotes} quotes across ${added.terms} terms`);