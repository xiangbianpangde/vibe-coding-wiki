// Vibe Coding Wiki · Static data layer
// Round 1 (v2.2): VC_TERMS and VC_DATA are populated asynchronously by
// terms-loader.js. This file now only provides the static VC_LAYERS and
// VC_SCENARIOS lookup tables. Legacy enrichment logic moved to terms-loader.

(function() {
  'use strict';

  // 8 大层级定义
  window.VC_LAYERS = {
    L1: { name: '范式层', en: 'Paradigm', color: '#2B3A4F', desc: 'Vibe Coding / Agentic Engineering / Cognitive Debt 等' },
    L2: { name: '方法论层', en: 'Methodology', color: '#4F84FF', desc: 'SDD / Context Engineering / Plan-Verify-Build 等' },
    L3: { name: '技术概念层', en: 'Technical', color: '#00A86B', desc: 'LLM / Agent Loop / MCP / Hallucination 等' },
    L4: { name: '工具平台层', en: 'Tools', color: '#2E5D8C', desc: 'Cursor / Claude Code / Windsurf 等 30+ 工具' },
    L5: { name: '质量治理层', en: 'Quality', color: '#D4AF37', desc: 'Guardrails / YOLO Mode / MVP 等' },
    L6: { name: '风险度量层', en: 'Risks', color: '#F43E06', desc: 'Technical Debt / Vibe Slop / Lethal Trifecta' },
    L7: { name: 'Prompt Engineering', en: 'Prompt', color: '#3B4F5C', desc: 'Few-Shot / CoT / ReAct 等' },
    L8: { name: '场景层', en: 'Scenarios', color: '#D9A594', desc: '原型 / 生产 / 重构 / 安全 等 14 类场景' }
  };

  // 场景定义
  window.VC_SCENARIOS = {
    'proto-scenario':    { name: '一次性原型', vibe: 5, terms: ['Vibe Coding', 'Cursor', 'Lovable', 'Iterative Refinement'] },
    'personal-scenario': { name: '个人工具',   vibe: 5, terms: ['Vibe Coding', 'YOLO Mode', 'Few-Shot'] },
    'production-scenario':{ name: '生产维护', vibe: 1, terms: ['Agentic Programming', 'MVP', 'Guardrails', 'SDD', 'Code Review'] },
    'refactor-scenario': { name: '大型重构',   vibe: 2, terms: ['Subagent', 'Plan-Verify-Build', 'Context Engineering', 'Safety Net Testing'] },
    'security-scenario': { name: '安全敏感',   vibe: 0, terms: ['Lethal Trifecta', 'Veracode', 'Snyk', 'Prompt Injection'] },
    'learning-scenario': { name: '学习探索',   vibe: 4, terms: ['Vibe Coding', 'Few-Shot', 'Chain-of-Thought'] },
    'team-scenario':     { name: '团队协作',   vibe: 3, terms: ['Copilot', 'Cursor', 'CodeRabbit', 'Spec.md'] },
    'testing-scenario':  { name: '测试编写',   vibe: 2, terms: ['TDD with AI', 'Safety Net Testing', 'Test Suite as Referee'] },
    'debug-scenario':    { name: '调试排错',   vibe: 3, terms: ['Iterative Refinement', 'Failure Mode Analysis'] },
    'docs-scenario':     { name: '文档注释',   vibe: 4, terms: ['Few-Shot', 'Spec.md as Contract'] },
    'frontend-scenario': { name: '前端 Vibe Coding', vibe: 4, terms: ['Lovable', 'v0', 'Cursor Composer'] },
    'data-scenario':     { name: '数据分析',   vibe: 3, terms: ['Code Interpreter', 'Computer Use'] },
    'onboarding-scenario': { name: '代码库入门', vibe: 3, terms: ['Claude Code', 'Cursor', 'Context Engineering'] },
    'migration-scenario':{ name: '框架迁移',   vibe: 2, terms: ['Subagent', 'Plan-Verify-Build', 'Safety Net Testing'] }
  };

  console.log('VC_LAYERS loaded:', Object.keys(window.VC_LAYERS).length, 'layers,',
              'VC_SCENARIOS loaded:', Object.keys(window.VC_SCENARIOS).length, 'scenarios');
})();