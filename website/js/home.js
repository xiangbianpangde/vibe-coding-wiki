// Vibe Coding Wiki · 首页标签云

(function() {
  'use strict';

  // 统计所有 tag 频率
  const tagCounts = {};
  (window.VC_TERMS || []).forEach(t => {
    (t.tags || []).forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const tags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50); // 取前 50

  const max = Math.max(...tags.map(([, c]) => c));
  const min = Math.min(...tags.map(([, c]) => c));

  function size(count) {
    const ratio = (count - min) / Math.max(1, max - min);
    return 12 + ratio * 16; // 12-28px
  }

  function color(count) {
    const ratio = (count - min) / Math.max(1, max - min);
    if (ratio > 0.7) return 'var(--c-zhusha)';
    if (ratio > 0.4) return 'var(--c-shihqing)';
    if (ratio > 0.2) return 'var(--c-liujin)';
    return 'var(--c-zhuqing)';
  }

  const cloud = document.getElementById('tag-cloud');
  if (!cloud) return;

  cloud.innerHTML = tags.map(([tag, count]) => `
    <a href="pages/glossary.html?tag=${encodeURIComponent(tag)}" class="tag-chip" style="font-size:${size(count)}px;color:${color(count)};">
      #${tag}
      <span class="tag-chip__count">${count}</span>
    </a>
  `).join('');

})();