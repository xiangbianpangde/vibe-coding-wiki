// Rebuild terms.js from split JSON files
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const OUT_PATH = path.join(__dirname, '..', 'js', 'terms.js');

const layers = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'];
const layerNames = {
  L1: '范式层', L2: '方法论层', L3: '技术概念层', L4: '工具平台层',
  L5: '质量治理层', L6: '风险度量层', L7: 'Prompt Engineering', L8: '场景层'
};

let all = [];
for (const l of layers) {
  const items = JSON.parse(fs.readFileSync(path.join(DATA_DIR, `terms-${l}.json`), 'utf8'));
  all.push(...items);
}
console.log(`[rebuild] Loaded ${all.length} terms from ${layers.length} layer files`);

// Group by layer for sections
const byLayer = {};
for (const t of all) {
  if (!byLayer[t.layer]) byLayer[t.layer] = [];
  byLayer[t.layer].push(t);
}

let output = `// Vibe Coding Wiki · v2.0 完整词条数据
// 共 200+ 词条，按 L1-L8 完整覆盖

window.VC_TERMS = [
`;

for (const l of layers) {
  const items = byLayer[l] || [];
  output += `
  // ============ ${l} · ${layerNames[l]} (${items.length} 个) ============
`;
  for (const t of items) {
    output += `  {\n`;
    // Output fields in stable order
    const fields = ['id', 'name', 'zh', 'layer', 'category', 'tags', 'shortDesc', 'longDesc', 'related', 'source', 'coinedBy', 'coinedDate', 'quotes', 'seeAlso', 'examples', 'version'];
    for (const f of fields) {
      if (!(f in t)) continue;
      let val = t[f];
      if (Array.isArray(val)) {
        if (val.length === 0) continue;
        if (typeof val[0] === 'object') {
          // Pretty print JSON arrays of objects
          const json = JSON.stringify(val, null, 2);
          output += `    ${f}: ${json.replace(/\n/g, '\n    ')},\n`;
        } else {
          output += `    ${f}: ${JSON.stringify(val)},\n`;
        }
      } else if (typeof val === 'string') {
        // Use template literal if contains newlines, otherwise quoted
        if (val.includes('\n') || val.includes('`')) {
          output += `    ${f}: \`${val.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`,\n`;
        } else {
          output += `    ${f}: ${JSON.stringify(val)},\n`;
        }
      } else {
        output += `    ${f}: ${JSON.stringify(val)},\n`;
      }
    }
    output += `  },\n`;
  }
}

output += `];

console.log('VC_TERMS loaded:', window.VC_TERMS.length, 'terms');
`;

fs.writeFileSync(OUT_PATH, output);
console.log(`[rebuild] Wrote ${output.length} bytes to ${OUT_PATH}`);
console.log(`[rebuild] Verified: ${(output.match(/    id: '/g) || []).length} terms`);
