// Vibe Coding Wiki · Pure search engine
// Extracted from search.js so it can be unit-tested.
// Exposed on window.VC_SEARCH_ENGINE for backward compatibility.

(function() {
  'use strict';

  /**
   * Pure search function over VC_DATA-shaped records.
   * @param {Array<{id,name,zh,desc,layer?}>} all - term records
   * @param {string} q - search query
   * @param {number} limit - max results to return
   * @returns {Array} ranked matches
   */
  function search(all, q, limit = 14) {
    if (q == null) return [];
    q = String(q).toLowerCase().trim();
    if (q.length < 1) return [];
    const matched = all.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.zh.includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.id.includes(q.replace(/\s+/g, '-'))
    );
    matched.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const aRank = aName.startsWith(q) ? 0 : (a.zh.includes(q) ? 1 : (aName.includes(q) ? 2 : 3));
      const bRank = bName.startsWith(q) ? 0 : (b.zh.includes(q) ? 1 : (bName.includes(q) ? 2 : 3));
      return aRank - bRank;
    });
    return matched.slice(0, limit);
  }

  window.VC_SEARCH_ENGINE = { search };
})();
