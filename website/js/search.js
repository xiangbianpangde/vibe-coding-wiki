// Vibe Coding Wiki · 搜索功能

(function() {
  'use strict';

  const $input = document.getElementById('search-input');
  const $results = document.getElementById('search-results');
  const $modal = document.getElementById('search-modal');
  let activeIndex = -1;

  if (!$input) return;

  // Delegate pure search to VC_SEARCH_ENGINE (loaded before this script).
  function search(q) {
    if (!q || q.length < 1) { if ($results) $results.innerHTML = ''; return []; }
    const engine = window.VC_SEARCH_ENGINE;
    if (!engine) return [];
    return engine.search(window.VC_DATA || [], q, 14);
  }

  function render(results) {
    if (!$results) return;
    if (!results.length) {
      $results.innerHTML = '<div style="padding:24px;text-align:center;color:var(--c-muted);font-size:13px;">没有匹配的结果</div>';
      return;
    }
    $results.innerHTML = results.map((r, i) => {
      const url = r.url || (window.location.pathname.includes('/pages/') ? '../term.html?id=' + r.id : 'term.html?id=' + r.id);
      return `
      <div class="search-result${i === activeIndex ? ' active' : ''}" data-i="${i}" data-url="${url}">
        <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px;">
          <h5 style="margin:0;flex:1;">${r.zh} <span style="font-weight:400;color:var(--c-muted);font-size:12px;">· ${r.name}</span></h5>
          <span class="search-layer-badge" style="background:${window.VC_LAYERS[r.layer].color};color:#fff;">${window.VC_LAYERS[r.layer].name}</span>
        </div>
        <p style="margin:6px 0 0;">${r.desc}</p>
      </div>
    `}).join('');
  }

  $input.addEventListener('input', e => {
    activeIndex = -1;
    render(search(e.target.value));
  });

  $input.addEventListener('keydown', e => {
    const results = $results.querySelectorAll('.search-result');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, results.length - 1);
      render(search($input.value));
      focusActiveResult();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      render(search($input.value));
      focusActiveResult();
    } else if (e.key === 'Enter') {
      // 改进：如果没有选中，结果有 1 个就打开；否则打开选中的
      if (activeIndex >= 0) {
        e.preventDefault();
        const target = $results.querySelectorAll('.search-result')[activeIndex];
        if (target) location.href = target.dataset.url;
      } else if (results.length === 1) {
        e.preventDefault();
        location.href = results[0].dataset.url;
      }
    } else if (e.key === 'Escape') {
      $modal.classList.remove('open');
    }
  });

  // 滚动并 focus 选中的 result
  function focusActiveResult() {
    setTimeout(() => {
      const items = $results.querySelectorAll('.search-result');
      if (activeIndex >= 0 && items[activeIndex]) {
        items[activeIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        items[activeIndex].setAttribute('aria-selected', 'true');
      }
      items.forEach((it, i) => {
        if (i !== activeIndex) it.removeAttribute('aria-selected');
      });
    }, 0);
  }

  $results.addEventListener('click', e => {
    const target = e.target.closest('.search-result');
    if (target) location.href = target.dataset.url;
  });

  // ⌘K / Ctrl+K
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      $modal.classList.add('open');
      setTimeout(() => $input.focus(), 50);
    }
  });

})();