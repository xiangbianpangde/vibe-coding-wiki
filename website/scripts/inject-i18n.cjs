// Inject i18n button + i18n.js reference to all HTML pages
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

const LANG_TOGGLE = `<button class="lang-toggle" aria-label="Switch language" type="button">EN</button>`;

let count = 0;

for (const page of pages) {
  const filePath = path.join(__dirname, '..', page);
  let html = fs.readFileSync(filePath, 'utf8');

  // Skip if already has lang toggle
  if (html.includes('lang-toggle')) continue;

  // Inject i18n.js script before theme.js
  if (!html.includes('js/i18n.js') && !html.includes('i18n.js')) {
    const i18nPath = page.includes('/pages/') ? '../js/i18n.js' : 'js/i18n.js';
    html = html.replace(
      /<script src="(js\/theme\.js|\.\.\/js\/theme\.js)">/,
      `<script src="${i18nPath}"></script>\n<script src="$1">`
    );
  }

  // Inject lang-toggle before theme-toggle
  if (html.includes('theme-toggle') && !html.includes('lang-toggle')) {
    html = html.replace(
      /<button class="theme-toggle"/,
      `${LANG_TOGGLE}\n    <button class="theme-toggle"`
    );
  }

  fs.writeFileSync(filePath, html);
  count++;
}

console.log(`[i18n] Injected lang toggle + i18n.js to ${count} pages`);
