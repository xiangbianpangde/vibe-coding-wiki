// Inject og:image and twitter:image meta tags into all HTML pages
// Idempotent: only adds if missing.
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

const OG_IMAGE_REL = 'og-image.svg';
const OG_IMAGE_ABS = 'https://vibe-coding-wiki.example.com/og-image.svg';
const OG_IMAGE_ALT_REL = '../og-image.svg';   // from /pages/*.html
const OG_IMAGE_ALT_ABS = 'https://vibe-coding-wiki.example.com/og-image.svg';

const ogImageTags = (rel) => `
  <meta property="og:image" content="${OG_IMAGE_ABS}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Vibe Coding Wiki · 178 词条 · 8 层级 · 14 场景">
  <meta property="og:image:type" content="image/svg+xml">
  <meta name="twitter:image" content="${OG_IMAGE_ABS}">
  <meta name="twitter:image:alt" content="Vibe Coding Wiki · 178 词条 · 8 层级 · 14 场景">
`;

let updated = 0, skipped = 0;

for (const page of pages) {
  const filePath = path.join(__dirname, '..', page);
  let html = fs.readFileSync(filePath, 'utf8');

  // Idempotency check: skip if og:image already exists
  if (html.includes('property="og:image"')) {
    console.log(`[og-image] Skip ${page} (already has og:image)`);
    skipped++;
    continue;
  }

  // Insert after the og:site_name line (or twitter:card as fallback)
  const target = '<meta property="og:site_name" content="Vibe Coding Wiki">';
  if (html.includes(target)) {
    html = html.replace(target, target + ogImageTags());
  } else {
    // Fallback: insert after twitter:card
    const tcTarget = /<meta name="twitter:card"[^>]*>/;
    html = html.replace(tcTarget, (m) => m + ogImageTags());
  }

  fs.writeFileSync(filePath, html);
  console.log(`[og-image] Updated ${page}`);
  updated++;
}

console.log(`[og-image] Updated ${updated} pages, skipped ${skipped} already-injected pages`);
