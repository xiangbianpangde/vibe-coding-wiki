// Reset JSON data files by removing all examples/quotes/seeAlso
// (so we can re-enrich with the merge logic)
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const layers = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'];

const resettable = ['examples', 'quotes', 'seeAlso'];

for (const l of layers) {
  const fp = path.join(DATA_DIR, `terms-${l}.json`);
  const items = JSON.parse(fs.readFileSync(fp, 'utf8'));
  for (const item of items) {
    for (const k of resettable) delete item[k];
  }
  fs.writeFileSync(fp, JSON.stringify(items, null, 2));
  console.log(`[reset] ${l}: ${items.length} terms cleaned`);
}
console.log('[reset] Done');
