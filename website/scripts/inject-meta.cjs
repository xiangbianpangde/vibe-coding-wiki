// Inject favicon, OG meta, skip-link to all HTML pages
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
  'pages/stats.html'
];

const metaBlock = `  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <meta name="theme-color" content="#F9F4DC">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Vibe Coding Wiki · 专业术语知识库">
  <meta property="og:description" content="Vibe Coding 与 AI 辅助编程的专业术语 Wiki。178+ 词条、8 大层级、14 类场景。">
  <meta property="og:site_name" content="Vibe Coding Wiki">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Vibe Coding Wiki">
  <meta name="twitter:description" content="178+ 词条 · 8 层级 · 14 场景 · 30+ 权威来源">
  <link rel="canonical" href="https://xiangbianpangde.github.io/vibe-coding-wiki/">
  <link rel="sitemap" type="application/xml" href="sitemap.xml">
  <meta name="robots" content="index,follow">`;

const skipLink = '<a class="skip-link" href="#main-content">跳至正文</a>';

for (const page of pages) {
  const filePath = path.join(__dirname, '..', page);
  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Inject meta block (after <title> or after first <meta charset>)
  if (html.includes('name="description"')) {
    html = html.replace(/<meta name="description"[^>]*>/, (match) => match + '\n' + metaBlock);
  } else {
    html = html.replace(/<title>([^<]*)<\/title>/, `<title>$1</title>\n${metaBlock}`);
  }

  // 2. Inject skip-link (after <body>)
  if (!html.includes('skip-link')) {
    html = html.replace(/<body>/, '<body>\n' + skipLink);
  }

  fs.writeFileSync(filePath, html);
  console.log(`[meta] Updated ${page}`);
}

console.log('Done.');
