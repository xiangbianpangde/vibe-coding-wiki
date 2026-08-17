// Wave 3f enrichment — 12 L1/L3 terms, seeAlso + quotes push
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const ENRICH = {
  // ============ L1 paradigm ============
  'vibe-coding': {
    quotes: [
      {
        text: "There's a new kind of coding I call \"vibe coding\", where you fully give in to the vibes, embrace exponentials, and forget that the code even exists.",
        cite: 'Andrej Karpathy, 2025-02-02',
      },
    ],
    seeAlso: [
      { name: 'Karpathy 原始推文', url: 'https://twitter.com/karpathy/status/1886192184808149383' },
      { name: 'Simon Willison: Vibe Coding 词条', url: 'https://simonwillison.net/tags/vibe-coding/' },
    ],
  },

  'software-for-one': {
    quotes: [
      {
        text: "Software for one: write code that solves YOUR specific problem, even if no one else needs it.",
        cite: 'community',
      },
    ],
    seeAlso: [
      { name: 'Simon Willison: Software for one', url: 'https://simonwillison.net/tags/software-for-one/' },
      { name: 'Lovable 官网', url: 'https://lovable.dev' },
    ],
  },

  'no-code': {
    quotes: [
      {
        text: "No-code tools lower the floor of who can build software, but raise the question of what to build.",
        cite: 'community',
      },
    ],
    seeAlso: [
      { name: 'Lovable 官网', url: 'https://lovable.dev' },
      { name: 'v0 官网', url: 'https://v0.dev' },
    ],
  },

  'machine-speed': {
    quotes: [
      {
        text: "Agentic workflows without engineering practices produce tech debt at machine speed.",
        cite: 'Agarwal',
      },
    ],
    seeAlso: [
      { name: 'Andrew Hunt: Cognitive Debt', url: 'https://www.huntthought.com/2026/cognitive-debt' },
    ],
  },

  pdd: {
    quotes: [
      {
        text: "Prompt-Driven Development: let the prompt be the spec.",
        cite: 'community',
      },
    ],
    seeAlso: [
      { name: 'Simon Willison tags', url: 'https://simonwillison.net/tags/prompt-driven-development/' },
    ],
  },

  'pair-programming': {
    quotes: [
      {
        text: "Pair programming with AI: AI writes, human reviews. The compiler, tests, and human judgment are the referees.",
        cite: 'community',
      },
    ],
    seeAlso: [
      { name: 'Martin Fowler: Pair Programming', url: 'https://martinfowler.com/articles/onPairProgramming.html' },
      { name: 'Kent Beck: TDD', url: 'https://martinfowler.com/bliki/TestDrivenDevelopment.html' },
    ],
  },

  emotioneering: {
    quotes: [
      {
        text: "AI in design: using models to evoke specific emotions through UX patterns.",
        cite: 'community',
      },
    ],
    seeAlso: [
      { name: 'Don Norman: Emotional Design', url: 'https://www.jnd.org/dn.ms/EmotionalDesign.html' },
    ],
  },

  // ============ L3 tech core ============
  llm: {
    quotes: [
      {
        text: "An LLM is a function from text to text, trained on the entire internet.",
        cite: 'Andrej Karpathy',
      },
    ],
    seeAlso: [
      { name: 'Andrej Karpathy: Intro to LLMs', url: 'https://www.youtube.com/watch?v=zjkBMFhNj_g' },
      { name: 'OpenAI: LLM 介绍', url: 'https://platform.openai.com/docs/introduction' },
    ],
  },

  'context-window': {
    quotes: [
      {
        text: "In 2026, 1M tokens is the standard. Claude Opus 4.6 ships 1M. Gemini 2.5 Pro goes to 2M. Even GPT stays behind at 128K default.",
        cite: 'tokenmix.ai 2026',
      },
    ],
    seeAlso: [
      { name: 'Anthropic: Context Windows', url: 'https://docs.anthropic.com/en/docs/build-with-claude/context-windows' },
      { name: 'Google Gemini 2.5 Pro 2M', url: 'https://blog.google/technology/google-deepmind/gemini-model-thinking-updates-march-2025/' },
    ],
  },

  subagent: {
    quotes: [
      {
        text: "Subagents are a key tool for getting good results out of a coding agent.",
        cite: 'Simon Willison',
      },
    ],
    seeAlso: [
      { name: 'Claude Code: Subagents', url: 'https://docs.claude.com/en/docs/claude-code/sub-agents' },
      { name: 'Anthropic: Building effective agents', url: 'https://www.anthropic.com/research/building-effective-agents' },
    ],
  },

  'tool-use': {
    quotes: [
      {
        text: "Function calling is the primitive that turns LLMs into agents.",
        cite: 'OpenAI, 2023',
      },
    ],
    seeAlso: [
      { name: 'Anthropic Tool Use', url: 'https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview' },
      { name: 'OpenAI Function Calling', url: 'https://platform.openai.com/docs/guides/function-calling' },
    ],
  },

  // ============ L2 方法论 ============
  'acceptance-criteria': {
    quotes: [
      {
        text: "Acceptance criteria are the machine-checkable spec that makes a user story testable.",
        cite: 'BDD community',
      },
    ],
    seeAlso: [
      { name: 'Martin Fowler: BDD', url: 'https://martinfowler.com/bliki/GivenWhenThen.html' },
      { name: 'GitHub Spec Kit', url: 'https://github.github.io/spec-kit/' },
    ],
  },

  'auto-memory': {
    quotes: [
      {
        text: "Auto memory: Claude automatically recalls relevant context across sessions.",
        cite: 'Claude Code Docs',
      },
    ],
    seeAlso: [
      { name: 'Claude Code: Memory', url: 'https://docs.claude.com/en/docs/claude-code/memory' },
    ],
  },
};

// Apply
const layers = ['L1','L2','L3','L4','L5','L6','L7','L8'];
let added = { examples: 0, seeAlso: 0, quotes: 0, terms: 0 };

for (const l of layers) {
  const fp = path.join(DATA_DIR, `terms-${l}.json`);
  const items = JSON.parse(fs.readFileSync(fp, 'utf8'));
  let fileModified = false;
  for (const item of items) {
    const e = ENRICH[item.id];
    if (!e) continue;
    let termChanged = false;
    if (e.examples) {
      const existing = Array.isArray(item.examples) ? item.examples : [];
      const newOnes = e.examples.filter(n => !existing.some(x => x.code === n.code));
      if (newOnes.length) { item.examples = [...existing, ...newOnes]; added.examples += newOnes.length; termChanged = true; }
    }
    if (e.seeAlso) {
      const existing = Array.isArray(item.seeAlso) ? item.seeAlso : [];
      const newOnes = e.seeAlso.filter(n => !existing.some(x => x.url === n.url));
      if (newOnes.length) { item.seeAlso = [...existing, ...newOnes]; added.seeAlso += newOnes.length; termChanged = true; }
    }
    if (e.quotes) {
      const existing = Array.isArray(item.quotes) ? item.quotes : [];
      const newOnes = e.quotes.filter(n => !existing.some(x => x.text === n.text));
      if (newOnes.length) { item.quotes = [...existing, ...newOnes]; added.quotes += newOnes.length; termChanged = true; }
    }
    if (termChanged) { added.terms++; fileModified = true; }
  }
  if (fileModified) fs.writeFileSync(fp, JSON.stringify(items, null, 2));
}

console.log(`[enrich-priority-8] Added: ${added.examples} examples, ${added.seeAlso} seeAlso, ${added.quotes} quotes across ${added.terms} terms`);
