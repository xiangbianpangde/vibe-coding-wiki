// Vibe Coding Wiki · 通用脚本

(function() {
  'use strict';

  // 顶部搜索按钮点击
  document.querySelectorAll('[data-open-search]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('search-modal').classList.add('open');
      setTimeout(() => document.getElementById('search-input').focus(), 50);
    });
  });

  // Esc 关闭 search modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.getElementById('search-modal')?.classList.remove('open');
    }
  });

  // Talk event buttons (feedback)
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-talk-event]');
    if (!btn) return;
    const event = btn.dataset.talkEvent;
    const value = btn.dataset.talkValue;
    if (typeof window.talkSend === 'function') {
      window.talkSend({ event, value, term: location.search });
    }
    btn.style.background = 'var(--c-zhuqing)';
    btn.style.color = 'var(--c-paper)';
    btn.style.borderColor = 'var(--c-zhuqing)';
    setTimeout(() => {
      btn.textContent = '✓ 已记录反馈';
    }, 100);
  });

})();