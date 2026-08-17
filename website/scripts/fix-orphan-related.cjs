// Fix orphan `related` references — Task 2 prerequisite
// 25 broken references found by tests/unit/data.test.js
// Strategy:
//   - Singular/plural typos → correct the id
//   - References to truly missing concepts → drop (TODO for follow-up)
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Mapping: broken → corrected
const FIXES = {
  'technical-debt':    'tech-debt',          // actual id
  'chain-of-thought':  'cot',                // actual id
  'personal-scenarios':'personal-scenario',  // singular
  'frontend-scenarios':'frontend-scenario',  // singular
  'safety-net':        'safety-net-testing', // actual id
};

// Truly missing targets → drop entirely (TODO: consider creating terms)
const DROP = new Set([
  'agentic-coding',
  'agentic-harness',
  'agentic-loop',
  'continuous-batching',
  'enterprise',
  'evidence-based',
  'open-source',
  'semgrep',
  'snyk',
  'voice-coding',
]);

const layers = ['L1','L2','L3','L4','L5','L6','L7','L8'];
let fixed = 0, dropped = 0, filesModified = new Set();

for (const l of layers) {
  const fp = path.join(DATA_DIR, `terms-${l}.json`);
  const items = JSON.parse(fs.readFileSync(fp, 'utf8'));
  let modified = false;
  for (const t of items) {
    if (!Array.isArray(t.related)) continue;
    const newRel = [];
    for (const r of t.related) {
      if (FIXES[r]) {
        newRel.push(FIXES[r]);
        fixed++;
        modified = true;
      } else if (DROP.has(r)) {
        dropped++;
        modified = true;
        // skip
      } else {
        newRel.push(r);
      }
    }
    if (modified) {
      t.related = newRel;
      filesModified.add(fp);
    }
  }
  if (modified) fs.writeFileSync(fp, JSON.stringify(items, null, 2));
}

console.log(`[fix-orphan-related] Fixed ${fixed} references, dropped ${dropped} orphan references across ${filesModified.size} files`);

// Re-audit
let orphans = 0;
for (const l of layers) {
  const items = JSON.parse(fs.readFileSync(path.join(DATA_DIR, `terms-${l}.json`), 'utf8'));
  for (const t of items) {
    for (const r of (t.related || [])) {
      // check against all
    }
  }
}
const allIds = new Set();
for (const l of layers) {
  const items = JSON.parse(fs.readFileSync(path.join(DATA_DIR, `terms-${l}.json`), 'utf8'));
  for (const t of items) allIds.add(t.id);
}
for (const l of layers) {
  const items = JSON.parse(fs.readFileSync(path.join(DATA_DIR, `terms-${l}.json`), 'utf8'));
  for (const t of items) {
    for (const r of (t.related || [])) {
      if (!allIds.has(r)) orphans++;
    }
  }
}
console.log(`[fix-orphan-related] Remaining orphans: ${orphans}`);
