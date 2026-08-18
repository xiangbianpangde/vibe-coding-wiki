// Fix residual Hunt attribution in cognitive-debt (L1)
const fs = require('fs');
const path = require('path');

const l1Path = path.join(__dirname, '..', 'data', 'terms-L1.json');
const l1 = JSON.parse(fs.readFileSync(l1Path, 'utf8'));

const cogDebt = l1.find(t => t.id === 'cognitive-debt');
if (cogDebt) {
  delete cogDebt.coinedBy;
  delete cogDebt.coinedDate;
  if (cogDebt.longDesc) {
    cogDebt.longDesc = cogDebt.longDesc
      .replace(/Andrew Hunt[^。<]*Hunt[^。<]*。/g, '在 2025–2026 期间，多位研究者使用过 "cognitive debt" 这一表达，但具体 coinage 暂未确认。');
  }
  console.log('[fix] cognitive-debt: removed Hunt attribution');
}

fs.writeFileSync(l1Path, JSON.stringify(l1, null, 2));
console.log('[fix] L1.json updated');
