// Inject Service Worker registration script into all HTML pages
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

const SW_REGISTRATION = `<script>
  // Service Worker registration (Round 2: offline cache)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/vibe-coding-wiki/sw.js', {
        scope: '/vibe-coding-wiki/'
      }).then(reg => {
        console.log('[SW] Registered, scope:', reg.scope);
      }).catch(err => {
        console.warn('[SW] Registration failed:', err);
      });
    });
  }
</script>`;

let count = 0;

for (const page of pages) {
  const filePath = path.join(__dirname, '..', page);
  let html = fs.readFileSync(filePath, 'utf8');

  if (html.includes('navigator.serviceWorker.register')) continue;

  // Insert before closing </body>
  if (html.includes('</body>')) {
    html = html.replace('</body>', `${SW_REGISTRATION}\n</body>`);
    fs.writeFileSync(filePath, html);
    count++;
  }
}

console.log(`[sw] Injected Service Worker registration to ${count} pages`);
