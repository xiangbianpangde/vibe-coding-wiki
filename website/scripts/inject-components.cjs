// Inject components.css and nav.js into all HTML pages
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

  // Add components.css after dark.css
  if (!html.includes('components.css')) {
    const cssPath = page.includes('/pages/') ? '../css/components.css' : 'css/components.css';
    html = html.replace(
      /<link rel="stylesheet" href="(css\/dark\.css|\.\.\/css\/dark\.css)">/,
      (match) => match + `\n<link rel="stylesheet" href="${cssPath}">`
    );
  }

  // Add nav.js before app.js
  if (!html.includes('nav.js')) {
    const jsPath = page.includes('/pages/') ? '../js/nav.js' : 'js/nav.js';
    html = html.replace(/<script src="(js\/theme\.js|\.\.\/js\/theme\.js)">/, `<script src="${jsPath}"></script>\n<script src="$1">`);
  }

  fs.writeFileSync(filePath, html);
  count++;
}

console.log(`[components] Injected components.css + nav.js into ${count} pages`);
