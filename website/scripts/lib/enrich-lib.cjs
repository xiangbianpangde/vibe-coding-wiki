// Shared enrichment library — used by all enrich-priority-N.cjs scripts
// Pure: takes ENRICH object, applies to data/terms-*.json, writes back.
// Idempotent: merge+dedupe by code/url/text signature.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const LAYERS = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'];

/**
 * Apply an ENRICH object to all matching terms across all layer files.
 * ENRICH shape: { 'term-id': { examples?, quotes?, seeAlso? }, ... }
 * @param {Object} enrich - term-id → { examples, quotes, seeAlso } map
 * @returns {{ examples: number, seeAlso: number, quotes: number, terms: number }}
 */
function applyEnrich(enrich) {
  const added = { examples: 0, seeAlso: 0, quotes: 0, terms: 0 };

  for (const l of LAYERS) {
    const fp = path.join(DATA_DIR, `terms-${l}.json`);
    const items = JSON.parse(fs.readFileSync(fp, 'utf8'));
    let fileModified = false;

    for (const item of items) {
      const e = enrich[item.id];
      if (!e) continue;
      let termChanged = false;

      if (e.examples) {
        const existing = Array.isArray(item.examples) ? item.examples : [];
        const newOnes = e.examples.filter(n => !existing.some(x => x.code === n.code));
        if (newOnes.length) {
          item.examples = [...existing, ...newOnes];
          added.examples += newOnes.length;
          termChanged = true;
        }
      }
      if (e.seeAlso) {
        const existing = Array.isArray(item.seeAlso) ? item.seeAlso : [];
        const newOnes = e.seeAlso.filter(n => !existing.some(x => x.url === n.url));
        if (newOnes.length) {
          item.seeAlso = [...existing, ...newOnes];
          added.seeAlso += newOnes.length;
          termChanged = true;
        }
      }
      if (e.quotes) {
        const existing = Array.isArray(item.quotes) ? item.quotes : [];
        const newOnes = e.quotes.filter(n => !existing.some(x => x.text === n.text));
        if (newOnes.length) {
          item.quotes = [...existing, ...newOnes];
          added.quotes += newOnes.length;
          termChanged = true;
        }
      }
      if (termChanged) {
        added.terms++;
        fileModified = true;
      }
    }

    if (fileModified) fs.writeFileSync(fp, JSON.stringify(items, null, 2));
  }

  return added;
}

/**
 * Generate a wave-N enrichment script body.
 * Convenience helper for new scripts:
 *   const body = makeEnrichScript(ENRICH, 'wave 11');
 *   fs.writeFileSync('scripts/enrich-priority-11.cjs', body);
 */
function makeEnrichScript(enrich, label) {
  return `// ${label} enrichment — auto-generated from lib/enrich-lib.cjs
// Usage: node scripts/enrich-priority-N.cjs
const { applyEnrich } = require('./lib/enrich-lib.cjs');

const ENRICH = ${JSON.stringify(enrich, null, 2)};

const added = applyEnrich(ENRICH);
console.log(\`[${label}] Added: \${added.examples} examples, \${added.seeAlso} seeAlso, \${added.quotes} quotes across \${added.terms} terms\`);
`;
}

module.exports = { applyEnrich, makeEnrichScript, DATA_DIR, LAYERS };
