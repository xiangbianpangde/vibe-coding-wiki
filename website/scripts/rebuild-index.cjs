// Rebuild terms-index.json from current data/*.json (does NOT touch per-layer JSONs)
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const layers = ['L1','L2','L3','L4','L5','L6','L7','L8'];

const byLayer = {};
const terms = [];
let withExamples = 0, withQuotes = 0, withSeeAlso = 0, totalExamples = 0, totalQuotes = 0;

for (const l of layers) {
  const fp = path.join(DATA_DIR, `terms-${l}.json`);
  if (!fs.existsSync(fp)) continue;
  const items = JSON.parse(fs.readFileSync(fp, 'utf8'));
  byLayer[l] = items.length;
  for (const t of items) {
    terms.push(t);
    if (t.examples) { withExamples++; totalExamples += t.examples.length; }
    if (t.quotes)   { withQuotes++;   totalQuotes   += t.quotes.length; }
    if (t.seeAlso)  { withSeeAlso++; }
  }
}

const index = {
  meta: {
    total: terms.length,
    byLayer,
    stats: { withExamples, withQuotes, withSeeAlso, totalExamples, totalQuotes },
    generated: new Date().toISOString(),
  },
  summaries: terms.map(t => ({
    id: t.id,
    name: t.name,
    zh: t.zh,
    layer: t.layer,
    shortDesc: (t.shortDesc || '').substring(0, 100),
    category: t.category,
    tags: (t.tags || []).slice(0, 3),
  })),
};

const outPath = path.join(DATA_DIR, 'terms-index.json');
fs.writeFileSync(outPath, JSON.stringify(index, null, 2));
console.log(`[rebuild-index] ${terms.length} summaries, ${withExamples} with examples, ${withQuotes} with quotes, ${withSeeAlso} with seeAlso`);
console.log(`[rebuild-index] Wrote ${outPath}`);
