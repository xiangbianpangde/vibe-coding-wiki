// Enrich JSON data files with examples/quotes/seeAlso
// Then rebuild terms.js from updated JSON
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const src = fs.readFileSync(path.join(__dirname, 'enrich-terms.js'), 'utf8');

// Extract ENRICHMENT object from the script
const match = src.match(/const ENRICHMENT = (\{[\s\S]*?\});/);
if (!match) {
  console.error('Could not extract ENRICHMENT');
  process.exit(1);
}

const ENRICHMENT = eval('(' + match[1] + ')');
console.log(`[enrich-json] Loaded ${Object.keys(ENRICHMENT).length} enrichment entries`);

const layers = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'];
let totalAdded = { examples: 0, quotes: 0, seeAlso: 0 };

for (const l of layers) {
  const fp = path.join(DATA_DIR, `terms-${l}.json`);
  const items = JSON.parse(fs.readFileSync(fp, 'utf8'));
  let modified = false;

  for (const item of items) {
    const e = ENRICHMENT[item.id];
    if (!e) continue;

    if (e.examples) {
      // 合并：如果已有则加，否则替换
      if (item.examples && item.examples.length > 0) {
        item.examples = item.examples.concat(e.examples);
      } else {
        item.examples = e.examples;
      }
      totalAdded.examples++;
      modified = true;
    }
    if (e.quotes) {
      if (item.quotes && item.quotes.length > 0) {
        item.quotes = item.quotes.concat(e.quotes);
      } else {
        item.quotes = e.quotes;
      }
      totalAdded.quotes++;
      modified = true;
    }
    if (e.seeAlso) {
      if (item.seeAlso && item.seeAlso.length > 0) {
        item.seeAlso = item.seeAlso.concat(e.seeAlso);
      } else {
        item.seeAlso = e.seeAlso;
      }
      totalAdded.seeAlso++;
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(fp, JSON.stringify(items, null, 2));
    console.log(`[enrich-json] Updated ${l} (${items.length} terms)`);
  }
}

console.log(`[enrich-json] Added: ${totalAdded.examples} examples, ${totalAdded.quotes} quotes, ${totalAdded.seeAlso} seeAlso`);
