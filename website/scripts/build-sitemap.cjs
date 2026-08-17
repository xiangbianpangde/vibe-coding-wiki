// Generate sitemap.xml from terms.js
const fs = require('fs');
const path = require('path');

const termsPath = path.join(__dirname, '..', 'js', 'terms.js');
const termsContent = fs.readFileSync(termsPath, 'utf8');
const matches = [...termsContent.matchAll(/id: '([^']+)'/g)];
const ids = [...new Set(matches.map(m => m[1]))];
const today = new Date().toISOString().split('T')[0];
const base = 'https://vibe-coding-wiki.example.com';

const staticUrls = [
  '',
  'pages/glossary.html',
  'pages/layers.html',
  'pages/scenarios.html',
  'pages/graph.html',
  'pages/compare.html',
  'pages/stats.html',
  'pages/citations.html'
];

const urls = [
  ...staticUrls.map(p => `${base}/${p}`),
  ...ids.map(id => `${base}/term.html?id=${id}`)
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
  </url>`).join('\n')}
</urlset>
`;

const outPath = path.join(__dirname, '..', 'sitemap.xml');
fs.writeFileSync(outPath, xml);
console.log(`[sitemap] Generated ${urls.length} URLs -> ${outPath}`);
