// Vibe Coding Wiki · i18n (Round 3)
// Bilingual: 简体中文 (zh-CN) ↔ English
// Strategy: term data has enShortDesc / enLongDesc; UI strings in i18n dictionary

(function() {
  'use strict';

  const STORAGE_KEY = 'vc-lang';
  const DEFAULT_LANG = 'zh';

  // UI strings (both languages)
  const UI = {
    zh: {
      nav: { home: '首页', glossary: '词条 A-Z', layers: '分层', scenarios: '场景', graph: '关系图谱', compare: '对比', stats: '数据', sources: '来源' },
      search: { placeholder: '搜索术语（中文 / 英文 / 缩写）…', empty: '没有匹配的结果', title: '搜索术语' },
      theme: { light: '切换到深色', dark: '切换到浅色' },
      term: { section_summary: '摘要', section_definition: '详细定义', section_quotes: '相关引文', section_source: '引用与来源', section_feedback: '反馈', section_timeline: '演进时间线', section_path: '学习路径', section_examples: '例句 / 代码示例', section_misconceptions: '常见误解', related: '相关词条', same_layer: '同层级', tags: '标签', category: '分类', coined_by: '造词者', coined_date: '造词时间', version: '更新版本' },
      common: { learn_more: '了解更多', view_details: '查看详情', all: '全部' },
    },
    en: {
      nav: { home: 'Home', glossary: 'Glossary', layers: 'Layers', scenarios: 'Scenarios', graph: 'Graph', compare: 'Compare', stats: 'Stats', sources: 'Sources' },
      search: { placeholder: 'Search terms (Chinese / English / abbreviation)…', empty: 'No matching results', title: 'Search Terms' },
      theme: { light: 'Switch to dark', dark: 'Switch to light' },
      term: { section_summary: 'Summary', section_definition: 'Definition', section_quotes: 'Quotes', section_source: 'References', section_feedback: 'Feedback', section_timeline: 'Timeline', section_path: 'Learning Path', section_examples: 'Examples', section_misconceptions: 'Misconceptions', related: 'Related Terms', same_layer: 'Same Layer', tags: 'Tags', category: 'Category', coined_by: 'Coined by', coined_date: 'Coined', version: 'Version' },
      common: { learn_more: 'Learn more', view_details: 'View details', all: 'All' },
    }
  };

  // 1. Get initial language
  function getInitialLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'zh' || stored === 'en') return stored;
    return DEFAULT_LANG;
  }

  // 2. Apply language to <html>
  function applyLang(lang) {
    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'zh-CN');
    document.documentElement.setAttribute('data-lang', lang);
    localStorage.setItem(STORAGE_KEY, lang);
    updateToggleButton(lang);
    // Notify term.js to re-render
    window.dispatchEvent(new CustomEvent('vclang-change', { detail: { lang } }));
  }

  // 3. Toggle
  function toggleLang() {
    const current = document.documentElement.getAttribute('data-lang') || 'zh';
    applyLang(current === 'zh' ? 'en' : 'zh');
  }

  // 4. Get current
  function getLang() {
    return document.documentElement.getAttribute('data-lang') || 'zh';
  }

  // 5. Get UI string by path
  function t(path) {
    const lang = getLang();
    const parts = path.split('.');
    let result = UI[lang];
    for (const p of parts) {
      result = result?.[p];
      if (!result) return path;
    }
    return result;
  }

  // 6. Update toggle button
  function updateToggleButton(lang) {
    const btn = document.querySelector('.lang-toggle');
    if (btn) {
      btn.textContent = lang === 'en' ? '中文' : 'EN';
      btn.setAttribute('aria-label', lang === 'en' ? 'Switch to Chinese' : 'Switch to English');
    }
  }

  // 6.5 Apply static translations (data-zh / data-en attribute)
  function applyStaticTranslations(lang) {
    document.querySelectorAll('[data-zh][data-en]').forEach(el => {
      el.textContent = lang === 'en' ? el.dataset.en : el.dataset.zh;
    });
  }

  // 7. Initialize
  applyLang(getInitialLang());
  // 初始语言静态翻译
  setTimeout(() => applyStaticTranslations(getInitialLang()), 0);

  // 8. Attach handler
  function attachHandler() {
    const btn = document.querySelector('.lang-toggle');
    if (btn) {
      btn.addEventListener('click', toggleLang);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachHandler);
  } else {
    attachHandler();
  }

  // 9. Public API
  window.VC_I18N = {
    t,
    getLang,
    setLang: applyLang,
    toggle: toggleLang,
    UI,
  };
})();
