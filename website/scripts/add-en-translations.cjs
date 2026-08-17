// Add enShortDesc / enLongDesc to L1 (16) + L3 (53) terms
// 178 词条中优先 L1 + L3 翻译

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// 英文翻译表 (L1 + L3 部分术语)
const EN = {
  // L1 范式
  'vibe-coding': {
    enShortDesc: 'Vibe coding: an AI-assisted programming style where developers describe goals in natural language and accept AI-generated code without deep review.',
    enLongDesc: '<p><strong>Vibe coding</strong> is a term coined by Andrej Karpathy in February 2025, describing an AI-assisted programming style where developers describe goals in natural language and let LLMs generate the code.</p><p>Core practice: <strong>describe → LLM writes code → run → paste errors back → iterate</strong>. Read diffs, skip deep review—prioritize speed.</p><p><strong>Best for:</strong> throwaway prototypes, personal scripts, hackathon projects.<br><strong>Avoid for:</strong> production code, long-lived systems, security-sensitive code.</p>'
  },
  'agentic-programming': {
    enShortDesc: 'Agentic Programming: using LLMs to write all code while still reviewing code and caring about structure (Martin Fowler).',
    enLongDesc: '<p>Software engineering luminary <strong>Martin Fowler</strong> coined this term to draw a sharp boundary with vibe coding.</p><p><strong>Agentic programming</strong> means using LLMs to write all code, but you still <strong>read diffs, care about structure, and review design</strong>.</p><p>Key differentiator from vibe coding: <strong>human accountability stays</strong>.'
  },
  'vibe-engineering': {
    enShortDesc: 'Vibe Engineering (Simon Willison, 2025-10): the opposite of vibe coding—professionals using AI while staying accountable.',
    enLongDesc: '<p>2025-10, Simon Willison coined <strong>vibe engineering</strong>: the opposite of vibe coding—seasoned professionals accelerate work with LLMs <strong>while staying proudly and confidently accountable</strong>.</p><p>Key practices: coding agents (Claude Code / Codex CLI / Gemini CLI), test-first, manual QA, code review, spec-driven.'
  },
  'agentic-engineering': {
    enShortDesc: 'Agentic Engineering (Karpathy 2026-02): the mature form of vibe coding, "more like engineering".',
    enLongDesc: '<p>2026-02, Karpathy announced he wants to retire <strong>vibe coding</strong> and replace it with <strong>agentic engineering</strong>.</p><p>Core idea: <strong>let AI agents work while engineers stay accountable</strong>. Emphasizes spec-driven, guardrails, test-first, verifiable acceptance criteria.'
  },
  'cognitive-debt': {
    enShortDesc: 'Cognitive Debt (Hunt 2026): accumulated cost of AI interactions—context loss, unreliable agent behavior—surpassing technical debt.',
    enLongDesc: '<p>Andrew Hunt (The Pragmatic Programmer) 2026 prediction: <strong>cognitive debt</strong> will replace technical debt as the dominant engineering burden.</p><p>Manifestations: context loss, unreliable agent behavior, prompt archaeology, agent drift.</p><p>Counter-balance: <strong>compounding leverage</strong> via engineering the agentic harness.'
  },
  'pair-programming': {
    enShortDesc: 'AI Pair Programming: AI as the pair programming partner. Kent Beck\'s 1999 concept, modernized with AI agents.',
    enLongDesc: '<p>Pair Programming from Kent Beck\'s 1999 Extreme Programming—two developers, one workstation, Driver and Navigator.</p><p>AI Pair Programming replaces the Navigator with AI: inline completion, context-aware suggestions, multi-turn conversation, rollback support.</p><p>Tools: GitHub Copilot (2021+), Tabnine, Codeium, Cursor, Cody.'
  },
  'software-for-one': {
    enShortDesc: 'Software for One (NYT\'s Kevin Roose): software built for a single user, never published. The vibe coding era\'s signature.',
    enLongDesc: '<p>NYT columnist Kevin Roose coined: vibe coding makes <strong>personalized software</strong> a mass practice.</p><p>Vs. traditional commercial software: never published, never designed for others, optimized for personal workflow, no scalability concerns.'
  },
  'pdd': {
    enShortDesc: 'Prompt-Driven Development: a development style driven by prompts. Karpathy called English "the hottest new programming language".',
    enLongDesc: '<p>Karpathy 2023: <em>"The hottest new programming language is English."</em></p><p><strong>PDD</strong> treats the prompt as specification, not code. Developer role shifts from "writing code" to "writing prompts".</p><p>Relationship to SDD: SDD is the stricter PDD variant—spec.md is the precise prompt.'
  },
  'emotioneering': {
    enShortDesc: 'Emotioneering (Shimmin): pejorative contrast term mocking vibe coding as "not engineering, but emotioneering".',
    enLongDesc: '<p>Shimmin coined <strong>emotioneering</strong> as the pejorative contrast to vibe coding—the field needs <em>"engineering, not emotioneering"</em>.</p><p>Reflects community pushback against vibe coding misuse, driving the rise of vibe engineering and agentic engineering.'
  },
  'orchestration-of-agents': {
    enShortDesc: 'Orchestration of AI Agents: the agentic engineering developer role—shift from "writing code" to "managing AI agents".',
    enLongDesc: '<p>Korlepra coined: in the agentic engineering era, the developer role shifts from <strong>"writing code"</strong> to <strong>"managing AI agents"</strong>—directing an AI team like a manager.</p><p>Responsibilities: write spec.md, design agentic loops, plan QA, code review AI-written code, research methodology.'
  },
  'multi-agent-parallelism': {
    enShortDesc: 'Multi-Agent Parallelism: multiple AI agents working in parallel. Shimmin used this to write a Rust compiler in one week.',
    enLongDesc: '<p>Willison / Shimmin: <strong>run multiple agent instances in parallel</strong>, each on a different problem.</p><p>Shimmin: wrote a working Rust compiler in one week using multi-agent parallelism—impossible for a single agent.</p><p>Challenges: context isolation, result merging, double resource cost, conflict detection.'
  },
  'agentic-workflow': {
    enShortDesc: 'Agentic Workflow (Agarwal): multi-step AI agent execution flow. Without engineering practices it generates tech debt at machine speed.',
    enLongDesc: '<p>Agarwal coined: <strong>agentic workflow</strong> is a multi-step AI agent execution flow. Without engineering practices, it generates tech debt at <strong>machine speed</strong>.</p>'
  },
  'cognitive-debt-vs-tech-debt': {
    enShortDesc: 'Cognitive Debt vs. Technical Debt: Hunt\'s framework. 2025 = tech debt year, 2026 = cognitive debt year.',
    enLongDesc: '<p>Hunt\'s framework: <strong>2025</strong> = technical debt year, <strong>2026</strong> = cognitive debt year. Engineering burden type is migrating.</p>'
  },
  'ai-assisted': {
    enShortDesc: 'AI-Assisted Software Development: the umbrella term for all AI-augmented software development, including vibe coding and agentic programming.',
    enLongDesc: '<p>The broadest umbrella term. All AI-augmented software development activities fall under this, including: vibe coding (natural language → code), agentic programming, AI pair programming, code completion, automated testing, code review.</p>'
  },
  'no-code': {
    enShortDesc: 'No-Code Development Platform: visual drag-drop platforms. Adjacent paradigm to vibe coding.',
    enLongDesc: '<p>No-Code platforms (Bubble, Webflow, Retool) let users build apps via <strong>visual interfaces</strong> without writing code.</p><p>Relationship to vibe coding: adjacent paradigms—both lower the bar to software development, but take different paths—visual config vs natural language.</p>'
  },
  'machine-speed': {
    enShortDesc: 'Machine Speed: the rate at which AI agents generate technical debt. Faster than human by orders of magnitude.',
    enLongDesc: '<p>Agarwal coined: without engineering practices, AI agent workflows generate technical debt at <strong>machine speed</strong>—orders of magnitude faster than human.</p><p>Analogy: "machine speed debt" describes the AI-era accumulation rate of poor-quality code.</p>'
  },
};

let count = 0;
let layers = ['L1']; // 优先 L1（16 词条），L3 后面再扩

for (const layer of layers) {
  const fp = path.join(DATA_DIR, `terms-${layer}.json`);
  const items = JSON.parse(fs.readFileSync(fp, 'utf8'));

  for (const item of items) {
    const en = EN[item.id];
    if (!en) continue;
    item.enShortDesc = en.enShortDesc;
    item.enLongDesc = en.enLongDesc;
    count++;
  }

  fs.writeFileSync(fp, JSON.stringify(items, null, 2));
  console.log(`[en] ${layer}: updated ${count} terms with en translations`);
}

console.log(`[en] Total: ${count} L1 terms got en translations`);
