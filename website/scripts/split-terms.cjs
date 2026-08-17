// Split terms.js into per-layer JSON files for lazy loading
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'js', 'terms.js');
const OUT_DIR = path.join(__dirname, '..', 'data');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const src = fs.readFileSync(SRC, 'utf8');

// Remove the trailing console.log
const cleaned = src.replace(/console\.log\([^)]+\);?\s*$/, '');

// Wrap and eval to get the array
const wrapped = `(function() { return [${cleaned.match(/window\.VC_TERMS = \[([\s\S]*?)\];/)[1]}]; })();`;
const terms = eval(wrapped);

console.log(`[split] Parsed ${terms.length} terms`);

// Group by layer
const byLayer = {};
const byId = {};
let examples = 0, quotes = 0, seeAlso = 0, withExamples = 0, withQuotes = 0, withSeeAlso = 0;

for (const t of terms) {
  const layer = t.layer || 'L0';
  if (!byLayer[layer]) byLayer[layer] = [];
  byLayer[layer].push(t);
  byId[t.id] = { ...t, longDesc: undefined, examples: undefined }; // summary only for index

  // Stats
  if (t.examples) {
    withExamples++;
    examples += t.examples.length;
  }
  if (t.quotes) {
    withQuotes++;
    quotes += t.quotes.length;
  }
  if (t.seeAlso) {
    withSeeAlso++;
  }
}

// Write per-layer detail files
for (const [layer, items] of Object.entries(byLayer)) {
  const fp = path.join(OUT_DIR, `terms-${layer}.json`);
  fs.writeFileSync(fp, JSON.stringify(items, null, 2));
  console.log(`[split] ${layer}: ${items.length} terms -> ${fp}`);
}

// Write index (id -> light summary, layer distribution)
const index = {
  meta: {
    total: terms.length,
    byLayer: Object.fromEntries(Object.entries(byLayer).map(([k, v]) => [k, v.length])),
    stats: {
      withExamples,
      withQuotes,
      withSeeAlso,
      totalExamples: examples,
      totalQuotes: quotes,
    },
    generated: new Date().toISOString(),
  },
  summaries: terms.map(t => ({
    id: t.id,
    name: t.name,
    zh: t.zh,
    layer: t.layer,
    shortDesc: t.shortDesc.substring(0, 100),
    category: t.category,
    tags: (t.tags || []).slice(0, 3),
  })),
};
fs.writeFileSync(path.join(OUT_DIR, 'terms-index.json'), JSON.stringify(index, null, 2));
console.log(`[split] Index: ${terms.length} summaries -> ${path.join(OUT_DIR, 'terms-index.json')}`);

console.log(`[split] Stats: ${withExamples} with examples, ${withQuotes} with quotes, ${withSeeAlso} with seeAlso`);
console.log('[split] Done. Total size:');
let total = 0;
for (const f of fs.readdirSync(OUT_DIR)) {
  const sz = fs.statSync(path.join(OUT_DIR, f)).size;
  total += sz;
  console.log(`  ${f}: ${sz} bytes`);
}
console.log(`  Total: ${total} bytes (${(total/1024).toFixed(1)} KB)`);
