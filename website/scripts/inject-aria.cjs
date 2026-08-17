// Inject ARIA attributes for accessibility
const fs = require('fs');
const path = require('path');

const pages = [
  'index.html',
  'term.html',
  'pages/citations.html',
  'pages/compare.html',
  'pages/glossary.html',
  'pages/graph.html',
  'pages/layers.html',
  'pages/scenarios.html',
  'pages/stats.html',
];

let count = 0;

for (const page of pages) {
  const filePath = path.join(__dirname, '..', page);
  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Add role="navigation" to topnav
  html = html.replace(/<nav class="topnav__links">/, '<nav class="topnav__links" role="navigation" aria-label="主导航">');

  // 2. Add aria-label to search input
  html = html.replace(/<input type="text" id="search-input" placeholder="([^"]*)"/, (m, p) => `<input type="text" id="search-input" placeholder="${p}" aria-label="搜索术语，输入后按 Enter 跳转到结果"`);

  // 3. Add aria-label to search modal
  html = html.replace(/<div id="search-modal" class="search-modal"/, '<div id="search-modal" class="search-modal" role="dialog" aria-modal="true" aria-labelledby="search-modal-title"');
  html = html.replace(/<input type="text" id="search-input"/, '<h2 id="search-modal-title" class="sr-only">搜索术语</h2>\n<input type="text" id="search-input"');

  // 4. Add role="search" to search containers
  html = html.replace(/<div class="search-modal__inner">/, '<div class="search-modal__inner" role="search">');

  // 5. Add aria-label to theme toggle
  html = html.replace(/<button class="theme-toggle" aria-label="(.*?)">/, '<button class="theme-toggle" aria-label="切换暗色/浅色主题，按 Enter 切换">');

  // 6. Add aria-current to active nav links
  html = html.replace(/<a href="([^"]+)" class="active">([^<]+)<\/a>/g, '<a href="$1" class="active" aria-current="page">$2</a>');

  // 7. Add aria-label to footer links
  html = html.replace(/<footer class="footer">/, '<footer class="footer" role="contentinfo">');

  // 8. Add lang to html if missing (already in all pages)
  // 9. Add aria-busy / live to dynamic regions
  html = html.replace(/<div id="search-results" class="search-results">/, '<div id="search-results" class="search-results" role="listbox" aria-live="polite">');

  // 10. Add visually-hidden helper class for SR-only
  // (already defined in some pages)

  fs.writeFileSync(filePath, html);
  count++;
}

console.log(`[aria] Added ARIA attributes to ${count} pages`);
