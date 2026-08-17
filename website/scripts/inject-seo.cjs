// Add JSON-LD structured data to all HTML pages
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

const SITE_NAME = 'Vibe Coding Wiki';
const SITE_DESC = 'Vibe Coding 与 AI 辅助编程的专业术语 Wiki。178+ 词条、8 大层级、14 类场景。';
const SITE_URL = 'https://xbpd.github.io/vibe-coding-wiki';

function buildJsonLd(page) {
  const baseUrl = page.includes('/pages/') ? `${SITE_URL}/pages/${page.split('/').pop()}` : `${SITE_URL}/${page}`;
  const isHome = page === 'index.html';
  const isTerm = page === 'term.html';

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESC,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/pages/glossary.html?search={search_term_string}`,
        'query-input': 'required name=search_term_string'
      },
      inLanguage: ['zh-CN', 'en']
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '首页', item: SITE_URL },
        ...(isHome ? [] : [{ '@type': 'ListItem', position: 2, name: page.replace('.html', '').replace('pages/', '').replace('/', ' › '), item: baseUrl }])
      ]
    }
  ];

  if (isTerm) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'DefinedTermSet',
      name: SITE_NAME + ' · 术语详情页',
      description: SITE_DESC,
      publisher: { '@type': 'Organization', name: SITE_NAME }
    });
  }

  return schemas.map(s => `<script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n</script>`).join('\n');
}

let count = 0;

for (const page of pages) {
  const filePath = path.join(__dirname, '..', page);
  let html = fs.readFileSync(filePath, 'utf8');

  if (!html.includes('application/ld+json')) {
    const jsonLd = buildJsonLd(page);
    html = html.replace('</head>', jsonLd + '\n</head>');
    fs.writeFileSync(filePath, html);
    count++;
  }
}

console.log(`[seo] Added JSON-LD structured data to ${count} pages`);
