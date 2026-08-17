// Inject dark.css + theme.js + theme toggle button into all HTML pages
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

const toggleButton = `<button class="theme-toggle" aria-label="切换主题" type="button">
  <span class="theme-icon-light">☀️</span>
  <span class="theme-icon-dark">🌙</span>
</button>`;

let count = 0;

for (const page of pages) {
  const filePath = path.join(__dirname, '..', page);
  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Add dark.css link (after style.css)
  if (!html.includes('dark.css')) {
    html = html.replace(/<link rel="stylesheet" href="(css\/style\.css|\.\.\/css\/style\.css)">/, (match) => {
      const cssPath = match.includes('../') ? '../css/dark.css' : 'css/dark.css';
      return match + `\n<link rel="stylesheet" href="${cssPath}">`;
    });
  }

  // 2. Add theme.js (before all other scripts)
  if (!html.includes('theme.js')) {
    const themeJs = html.includes('pages/') ? '../js/theme.js' : 'js/theme.js';
    html = html.replace(/<script src="(js\/terms\.js|\.\.\/js\/terms\.js)">/, `<script src="${themeJs}"></script>\n<script src="$1">`);
  }

  // 3. Add theme toggle button (inside .topnav__search container)
  if (!html.includes('theme-toggle')) {
    html = html.replace(/<\/button>\s*<\/div>\s*<\/header>/, `${toggleButton}\n    </div>\n  </header>`);
  }

  fs.writeFileSync(filePath, html);
  count++;
}

console.log(`[theme] Updated ${count} pages with dark mode + toggle button.`);
