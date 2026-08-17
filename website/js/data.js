// Vibe Coding Wiki · v2.0 数据层（从 terms.js 派生）
// 保持旧 API 兼容性，但实际数据来自 VC_TERMS

(function() {
  if (!window.VC_TERMS) {
    console.warn('VC_TERMS not loaded');
    window.VC_DATA = [];
    window.VC_LAYERS = {};
    window.VC_SCENARIOS = {};
    return;
  }

  // === 相关词条推荐算法 ===
  // 策略：合并 4 个信号
  // 1. 手工指定 related（高权重）
  // 2. 同 layer 且同 category（高权重）
  // 3. 共享 ≥2 个 tags（中权重）
  // 4. 引用关系（双向加强）
  window.VC_RELATED_ALGO = function(term, allTerms, minCount = 5, maxCount = 8) {
    const id = term.id;
    const related = new Map(); // id -> score

    const source = allTerms.filter(t => t.id !== id);

    // 信号 1：手工 related（最强）
    (term.related || []).forEach(rid => {
      related.set(rid, 100);
    });

    // 信号 2：同 layer + 同 category
    source.forEach(t => {
      if (t.layer === term.layer && t.category === term.category) {
        related.set(t.id, Math.max(related.get(t.id) || 0, 60));
      }
    });

    // 信号 3：共享 tags
    const termTags = new Set(term.tags || []);
    source.forEach(t => {
      if (termTags.size === 0) return;
      const shared = (t.tags || []).filter(tg => termTags.has(tg)).length;
      if (shared >= 2) {
        const score = shared * 15;
        related.set(t.id, Math.max(related.get(t.id) || 0, score));
      }
    });

    // 信号 4：双向引用（如果 t.related 包含当前 term，给 boost）
    source.forEach(t => {
      if ((t.related || []).includes(id)) {
        related.set(t.id, (related.get(t.id) || 0) + 40);
      }
    });

    // 排序取 top N
    return [...related.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxCount)
      .map(([rid]) => rid);
  };

  // === 拓展稀疏词条（在 load 时计算） ===
  const SPARSE_MIN = 5;
  window.VC_TERMS.forEach(t => {
    if (!t.related || t.related.length < SPARSE_MIN) {
      const merged = new Set(t.related || []);
      const algoResults = window.VC_RELATED_ALGO(t, window.VC_TERMS, 5, 8);
      algoResults.forEach(rid => merged.add(rid));
      t.related = [...merged].slice(0, 8);
    }
  });

  // VC_DATA: 旧版搜索数据格式（基于 VC_TERMS）
  window.VC_DATA = window.VC_TERMS.map(t => ({
    id: t.id,
    name: t.name,
    zh: t.zh,
    layer: t.layer,
    desc: t.shortDesc,
    longDesc: t.shortDesc,
    url: `term.html?id=${t.id}`,
    tags: t.tags || [],
    category: t.category,
    related: t.related || []
  }));

  // VC_LAYERS: 8 大层级定义
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

  // VC_SCENARIOS: 场景定义
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

  console.log('VC_DATA loaded:', window.VC_DATA.length, 'terms');
})();