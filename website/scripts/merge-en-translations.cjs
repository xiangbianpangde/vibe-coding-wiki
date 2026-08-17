// Round 4: Merge en-translations.json into terms-L*.json
const fs = require('fs');
const path = require('path');

const TRANS_FILE = path.join(__dirname, '..', 'lang', 'en-translations.json');
const DATA_DIR = path.join(__dirname, '..', 'data');

const en = JSON.parse(fs.readFileSync(TRANS_FILE, 'utf8'));
delete en._comment;

const layers = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'];
let totalMerged = 0;
let totalAdded = 0;

for (const layer of layers) {
  const fp = path.join(DATA_DIR, `terms-${layer}.json`);
  const items = JSON.parse(fs.readFileSync(fp, 'utf8'));
  let modified = false;

  for (const item of items) {
    const e = en[item.id];
    if (!e) continue;
    totalMerged++;
    let changed = false;
    if (e.enShortDesc && !item.enShortDesc) {
      item.enShortDesc = e.enShortDesc;
      changed = true;
    }
    if (e.enLongDesc && !item.enLongDesc) {
      item.enLongDesc = e.enLongDesc;
      changed = true;
    }
    if (changed) {
      totalAdded++;
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(fp, JSON.stringify(items, null, 2));
    console.log(`[merge] ${layer}: updated`);
  } else {
    console.log(`[merge] ${layer}: no changes`);
  }
}

console.log(`[merge] Total: merged ${totalMerged} entries, added ${totalAdded} new translations`);
