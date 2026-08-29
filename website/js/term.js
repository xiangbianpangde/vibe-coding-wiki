// Vibe Coding Wiki · 词条详情页逻辑
// Round 1 (v2.2): waits for VC_TERMS via VC_WHEN_TERMS_READY

function initTermPage() {
  'use strict';

  // 只在详情页运行
  const layout = document.querySelector('.term-layout');
  if (!layout) return;

  const params = new URLSearchParams(location.search);
  const id = params.get('id') || location.hash.replace('#', '');
  const term = (window.VC_TERMS || []).find(t => t.id === id);

  if (!term) {
    layout.innerHTML = `
      <div></div>
      <article class="term-main" id="main-content" tabindex="-1">
        <h1 class="term-header__title">未找到词条 "${id}"</h1>
        <p>请检查 URL 或返回 <a href="pages/glossary.html">A-Z 词条表</a>。</p>
      </article>
      <div></div>
    `;
    return;
  }

  // Set document title
  document.title = `${term.zh} · Vibe Coding Wiki`;

  // Layer info
  const layer = window.VC_LAYERS ? window.VC_LAYERS[term.layer] : null;
  const layerColor = layer ? layer.color : '#0F1A20';
  const layerName = layer ? layer.name : term.layer;

  // ======== Breadcrumb ========
  const breadcrumb = document.getElementById('breadcrumb');
  breadcrumb.innerHTML = `
    <a href="index.html">首页</a>
    <span class="sep">›</span>
    <a href="pages/glossary.html">词条</a>
    <span class="sep">›</span>
    <a href="pages/layers.html#${term.layer}">${layerName}</a>
    <span class="sep">›</span>
    <span>${term.zh}</span>
  `;

  // ======== Header ========
  const tagsEl = document.getElementById('term-tags');
  tagsEl.innerHTML = `
    <span class="term-header__tag term-header__tag--layer" style="background:${layerColor};border-color:${layerColor};">${term.layer} · ${layerName}</span>
    ${(term.tags || []).slice(0, 4).map(t => `<span class="term-header__tag">#${t}</span>`).join('')}
    <span class="term-header__tag">${term.category || 'core'}</span>
  `;

  // Title: 智能组合中英文标题，避免双层括号
  const termTitle = document.getElementById('term-title');
  if (term.zh === term.name) {
    termTitle.textContent = term.name;
  } else if (term.name.includes('(') || term.name.includes('（')) {
    // name 本身已含括号，不重复包裹
    termTitle.textContent = `${term.zh} · ${term.name}`;
  } else {
    termTitle.textContent = `${term.zh} (${term.name})`;
  }

  // i18n: pick description based on current language
  const isEnglish = document.documentElement.getAttribute('data-lang') === 'en';

  // R7 dual-track: pending badge next to title (bilingual, follows lang-toggle via page reload)
  if (term.status === 'pending') {
    const pendingBadge = document.createElement('span');
    pendingBadge.className = 'term-header__pending';
    pendingBadge.textContent = isEnglish ? '⏳ Pending review' : '⏳ 待验证';
    pendingBadge.title = isEnglish
      ? 'Proposed by the community; not yet verified'
      : '社区提案，尚未通过验证';
    termTitle.appendChild(pendingBadge);
  }

  const shortDesc = isEnglish && term.enShortDesc ? term.enShortDesc : term.shortDesc;
  const longDesc = isEnglish && term.enLongDesc ? term.enLongDesc : term.longDesc;

  document.getElementById('term-subtitle').textContent = shortDesc;

  // Header meta
  const metaParts = [];
  if (term.coinedBy) metaParts.push(`<span><strong>造词者：</strong>${term.coinedBy}</span>`);
  if (term.coinedDate) metaParts.push(`<span><strong>时间：</strong>${term.coinedDate}</span>`);
  document.getElementById('term-header-meta').innerHTML = metaParts.join('');

  // Sol #4: Edit this page / Report issue — 动态设置正确 layer
  const editLayer = term.layer || 'L1';
  const termId = term.id;
  document.querySelectorAll('.js-edit-term').forEach(a => {
    a.href = `https://github.com/xiangbianpangde/vibe-coding-wiki/edit/main/website/data/terms-${editLayer}.json`;
  });
  document.querySelectorAll('.js-report-term').forEach(a => {
    a.href = `https://github.com/xiangbianpangde/vibe-coding-wiki/issues/new?title=${encodeURIComponent(`[${termId}] 内容问题`)}&labels=term`;
  });

  // ======== TOC ========
  const tocSections = [
    { id: 'section-summary',    label: '摘要' },
    { id: 'section-definition', label: '详细定义' },
    { id: 'section-examples',   label: '例句 / 代码示例',   showIf: () => term.examples && term.examples.length },
    { id: 'section-misconceptions', label: '⚠️ 常见误解',  showIf: () => term.misconceptions && term.misconceptions.length },
    { id: 'section-quotes',     label: '相关引文',         showIf: () => term.quotes && term.quotes.length },
    { id: 'section-timeline',   label: '⏳ 演进时间线',    showIf: () => term.timeline && term.timeline.length },
    { id: 'section-source',     label: '引用与来源' },
    { id: 'section-path',       label: '🛤️ 学习路径',      showIf: () => term.path && term.path.length },
    { id: 'section-feedback',   label: '反馈' },
  ].filter(s => !s.showIf || s.showIf());
  document.getElementById('toc-list').innerHTML = tocSections.map(s =>
    `<li><a href="#${s.id}">${s.label}</a></li>`
  ).join('');

  // ======== Meta (left aside) ========
  let metaHTML = '<dl>';
  metaHTML += `<dt>词条 ID</dt><dd><code>${term.id}</code></dd>`;
  metaHTML += `<dt>层级</dt><dd>${term.layer} ${layerName}</dd>`;
  metaHTML += `<dt>分类</dt><dd>${term.category || '—'}</dd>`;
  if (term.coinedBy) metaHTML += `<dt>造词者</dt><dd>${term.coinedBy}</dd>`;
  if (term.coinedDate) metaHTML += `<dt>造词时间</dt><dd>${term.coinedDate}</dd>`;
  metaHTML += `<dt>更新版本</dt><dd>v2.0 · 2025-08-17</dd>`;
  metaHTML += '</dl>';
  document.getElementById('term-meta').innerHTML = metaHTML;

  // ======== Summary ========
  document.getElementById('term-summary').innerHTML = `<p>${shortDesc}</p>`;

  // ======== i18n: Translate section titles & UI labels ========
  function applyI18n() {
    if (typeof window.VC_I18N === 'undefined') return;
    const t = window.VC_I18N.t;
    // Section titles
    ['summary', 'definition', 'quotes', 'source', 'examples', 'misconceptions', 'timeline', 'path', 'feedback'].forEach(s => {
      const el = document.getElementById(`section-${s}`)?.querySelector('h2');
      if (el) el.textContent = t(`term.section_${s}`);
    });
    // Right rail headings
    const relatedH4 = document.querySelector('.term-related h4');
    if (relatedH4) relatedH4.textContent = t('term.related');
    const sameLayerH4 = Array.from(document.querySelectorAll('.term-related h4')).pop();
    if (sameLayerH4 && sameLayerH4 !== relatedH4) sameLayerH4.textContent = t('term.same_layer');
  }
  applyI18n();

  // ======== Long Description ========
  document.getElementById('term-long-desc').innerHTML = longDesc || '<p>暂无详细定义。</p>';

  // ======== Related (同时用于右栏 + 学习路径) ========
  const related = (term.related || [])
    .map(rid => (window.VC_TERMS || []).find(t => t.id === rid))
    .filter(Boolean);

  // ======== Quotes ========
  const quotesEl = document.getElementById('term-quotes');
  if (term.quotes && term.quotes.length) {
    quotesEl.innerHTML = term.quotes.map((q, i) => `
      <div class="quote-card">
        <div class="quote-card__text">"${q.text}"</div>
        <div class="quote-card__cite">— ${q.cite}</div>
        <button class="quote-copy-btn" data-quote-index="${i}" aria-label="Copy quote">📋 Copy</button>
      </div>
    `).join('');
    // 绑定复制按钮
    quotesEl.querySelectorAll('.quote-copy-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const idx = parseInt(btn.dataset.quoteIndex, 10);
        const q = term.quotes[idx];
        const text = `"${q.text}"\n— ${q.cite}`;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => {
            btn.textContent = '✅ Copied';
            setTimeout(() => { btn.textContent = '📋 Copy'; }, 2000);
          });
        } else {
          // Fallback
          const ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
          btn.textContent = '✅ Copied';
          setTimeout(() => { btn.textContent = '📋 Copy'; }, 2000);
        }
      });
    });
  } else {
    quotesEl.innerHTML = '<p class="text-faint">暂无相关引文。</p>';
  }

  // ======== Source & See Also ========
  const sourceEl = document.getElementById('term-source');
  if (term.source) {
    sourceEl.innerHTML = `<strong>主要来源：</strong>${term.source}`;
    sourceEl.style.display = '';
  } else {
    sourceEl.style.display = 'none';
  }

  const seeAlsoEl = document.getElementById('term-see-also');
  if (term.seeAlso && term.seeAlso.length) {
    seeAlsoEl.innerHTML = '<ul>' + term.seeAlso.map(s =>
      `<li><a href="${s.url}" target="_blank" rel="noopener">${s.name} ↗</a></li>`
    ).join('') + '</ul>';
    seeAlsoEl.style.display = '';
  } else {
    seeAlsoEl.style.display = 'none';
  }

  // ======== 常见误解（自动生成） ========
  const misconceptionsEl = document.getElementById('term-misconceptions');
  const misconceptionsSection = document.getElementById('section-misconceptions');
  if (misconceptionsEl) {
    const myths = generateMyths(term);
    if (myths.length) {
      misconceptionsEl.innerHTML = myths.map((m, i) => `
        <div class="misconception-card">
          <div class="misconception-badge">误解 ${i + 1}</div>
          <div class="misconception-title">${m.myth}</div>
          <div class="misconception-reality"><strong>事实：</strong>${m.reality}</div>
        </div>
      `).join('');
      misconceptionsSection.style.display = '';
    } else {
      misconceptionsSection.style.display = 'none';
    }
  }

  // ======== 演进时间线（自动生成） ========
  const timelineEl = document.getElementById('term-timeline');
  const timelineSection = document.getElementById('section-timeline');
  if (timelineEl) {
    const timeline = generateTimeline(term);
    if (timeline.length) {
      timelineEl.innerHTML = timeline.map(t => `
        <div class="timeline-row">
          <div class="timeline-row-date">${t.date}</div>
          <div class="timeline-row-content">${t.event}</div>
        </div>
      `).join('');
      timelineSection.style.display = '';
    } else {
      timelineSection.style.display = 'none';
    }
  }

  // ======== 学习路径（基于 related 自动生成） ========
  const pathEl = document.getElementById('term-path');
  const pathSection = document.getElementById('section-path');
  if (pathEl && related.length >= 3) {
    const pathItems = related.slice(0, 3).map((r, i) => `
      <a href="term.html?id=${r.id}" class="path-step">
        <div class="path-step-num">${i + 1}</div>
        <div class="path-step-content">
          <strong>${r.zh}</strong>
          <span>${r.name}</span>
        </div>
      </a>
    `).join('');
    if (pathItems) {
      pathEl.innerHTML = `<div class="path-steps">${pathItems}</div>`;
      pathSection.style.display = '';
    } else {
      pathSection.style.display = 'none';
    }
  } else if (pathSection) {
    pathSection.style.display = 'none';
  }

  // ======== 增强：误解与时间线 ========
  function generateMyths(term) {
    const myths = [];
    // 根据 layer 和 category 生成常见误解
    if (term.layer === 'L1' && term.category === 'paradigm') {
      myths.push({
        myth: `${term.zh} 就是用 AI 完全代替人写代码。`,
        reality: `${term.zh} 是一种工作风格 / 范式，不等同于"放弃代码"或"AI 全自动"。人类始终是责任主体。`
      });
    }
    if (term.id === 'vibe-coding') {
      myths.push({
        myth: 'vibe coding 适合生产代码。',
        reality: 'Karpathy 自己说"不读代码"。生产代码需要严格 guardrails、code review、可维护性。'
      });
      myths.push({
        myth: 'vibe coding 是"用 AI 写代码"的同义词。',
        reality: 'vibe coding 是 Karpathy 创造的特定术语，意思是"忘了代码存在"。AI 辅助编程有很多其他形态。'
      });
    }
    if (term.id === 'mcp') {
      myths.push({
        myth: 'MCP 是 Anthropic 专有。',
        reality: 'MCP 是开放标准，Anthropic 发起但由社区共同维护，可被任何 LLM 工具实现。'
      });
    }
    if (term.id === 'hallucination') {
      myths.push({
        myth: '大模型不会产生幻觉。',
        reality: '幻觉是 LLM 的固有特性——模型在不确定时会"编造"看似合理的内容。RAG、guardrails、human review 是必需的。'
      });
    }
    if (term.id === 'rag') {
      myths.push({
        myth: 'RAG 能彻底解决幻觉。',
        reality: 'RAG 大幅降低幻觉但不能完全消除。检索质量、context 长度、prompt engineering 都影响效果。'
      });
    }
    if (term.id === 'yolo-mode') {
      myths.push({
        myth: 'YOLO Mode 是 vibe coding 的代名词。',
        reality: 'YOLO Mode 是 vibe coding 的极端子集——完全关闭审批。vibe coding 也可以负责任地进行。'
      });
    }
    if (term.id === 'guardrails') {
      myths.push({
        myth: 'Guardrails 是审查委员会。',
        reality: 'Guardrails 是自动化检查，不是审批流程。它们廉价运行、失败响亮。'
      });
    }
    if (term.id === 'lethal-trifecta') {
      myths.push({
        myth: 'Lethal Trifecta 只是"提示注入"的另一种说法。',
        reality: '它是三个独立风险的组合识别框架——任意两个组合就是危险，三个全占才能致命。'
      });
    }
    if (term.id === 'claude-code') {
      myths.push({
        myth: 'Claude Code = IDE 内聊天。',
        reality: 'Claude Code 是 terminal-native agentic 工具，能跑命令、编辑文件、subagent 派发、MCP 集成。'
      });
    }
    if (term.id === 'cursor') {
      myths.push({
        myth: 'Cursor = Copilot.',
        reality: 'Cursor 是 VS Code fork，多文件编辑 + agent 编排（Composer）是核心差异。'
      });
    }
    return myths;
  }

  function generateTimeline(term) {
    const timeline = [];
    if (term.coinedBy) {
      timeline.push({
        date: term.coinedDate || '—',
        event: `<strong>${term.coinedBy}</strong> 创造 / 普及该术语`
      });
    }
    // 推断 2025-2026 关键事件
    if (term.layer === 'L1') {
      timeline.push({
        date: '2025-02',
        event: 'Karpathy 创造 "vibe coding" 术语，开启全新范式讨论'
      });
      timeline.push({
        date: '2025-10',
        event: 'Willison 提出 "vibe engineering" 作为对立面'
      });
      timeline.push({
        date: '2026-02',
        event: 'Karpathy 提出 "agentic engineering" 取代 vibe coding'
      });
    }
    if (term.id === 'mcp') {
      timeline.push({
        date: '2024-11',
        event: 'Anthropic 发布 MCP 开放协议'
      });
      timeline.push({
        date: '2025',
        event: '数百个 MCP server 进入生态'
      });
    }
    if (term.id === 'claude-code') {
      timeline.push({
        date: '2025-02',
        event: 'Claude Code 首发，Karpathy 强烈推荐'
      });
      timeline.push({
        date: '2025-08',
        event: '30+ 官方术语进入生态（CLAUDE.md / Hooks / Compaction 等）'
      });
    }
    if (term.id === 'cursor') {
      timeline.push({
        date: '2023',
        event: 'Cursor 1.0 发布，基于 VS Code fork'
      });
      timeline.push({
        date: '2025',
        event: 'Composer 多文件编辑成为业界标杆'
      });
    }
    if (term.id === 'metr-rct' || term.id === 'productivity-paradox') {
      timeline.push({
        date: '2025-07',
        event: 'METR 发布 RCT：AI 实际 +19% 时间（预期 -24%）'
      });
    }
    if (term.id === 'cognitive-debt' || term.id === 'cognitive-debt-detail') {
      timeline.push({
        date: '2026',
        event: 'Hunt 预测：cognitive debt 取代 technical debt 成为主导'
      });
    }
    return timeline;
  }

  // ======== Examples ========
  const examplesEl = document.getElementById('term-examples');
  const examplesSection = document.getElementById('section-examples');
  if (examplesEl && term.examples && term.examples.length) {
    examplesEl.innerHTML = term.examples.map((ex, i) => `
      <div class="example-card">
        <div class="example-card__head">
          <span class="example-card__num">示例 ${i + 1}</span>
          ${ex.desc ? `<div class="example-card__desc">${ex.desc}</div>` : ''}
        </div>
        <pre class="example-card__code"><code>${ex.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
      </div>
    `).join('');
    examplesSection.style.display = '';
  } else if (examplesSection) {
    examplesSection.style.display = 'none';
  }

  // ======== Related (right aside) ========
  const relatedListEl = document.getElementById('related-list');
  if (related.length) {
    relatedListEl.innerHTML = related.map(r => {
      const rl = window.VC_LAYERS ? window.VC_LAYERS[r.layer] : null;
      return `
        <a href="term.html?id=${r.id}" class="related-card" style="border-left-color:${rl ? rl.color : 'var(--c-line)'};">
          <strong>${r.zh}</strong>
          <span>${r.name}</span>
          <small>${r.shortDesc.substring(0, 60)}${r.shortDesc.length > 60 ? '...' : ''}</small>
        </a>
      `;
    }).join('');
  } else {
    relatedListEl.innerHTML = '<p class="text-faint" style="font-size:12px;">暂无相关词条</p>';
  }

  // ======== Same Layer ========
  const sameLayer = (window.VC_TERMS || [])
    .filter(t => t.layer === term.layer && t.id !== term.id)
    .slice(0, 8);

  document.getElementById('same-layer-list').innerHTML = sameLayer.map(r => {
    return `
      <a href="term.html?id=${r.id}" class="related-card">
        <strong>${r.zh}</strong>
        <span>${r.name}</span>
      </a>
    `;
  }).join('');
}

// Wait for VC_TERMS (loaded async by terms-loader.js), then run.
if (window.VC_WHEN_TERMS_READY) {
  window.VC_WHEN_TERMS_READY(initTermPage);
} else {
  // Fallback: terms-loader.js not loaded, try to run immediately
  initTermPage();
}
// 监听 i18n 切换事件，刷新当前详情页以应用新语言
window.addEventListener('vclang-change', () => {
  const id = new URLSearchParams(location.search).get('id') || location.hash.replace('#', '');
  if (id && window.VC_TERMS) {
    // 简单方式：刷新页面
    location.reload();
  }
});
