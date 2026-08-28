// Fix P0 citation issues found by Citation Red Team (Sol oracle 164990ee)
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Fix 1: arXiv ID for vibe-slop + open-source-impact + homogenization
// 2601.12345 → 2601.15494 (per Sol: paper is by Miklós Koren et al, 2026-01-21)
const ARXIV_ID = '2601.15494';
const ARXIV_URL = `https://arxiv.org/abs/${ARXIV_ID}`;

const fixes = [];

// === Fix L1: agentic-programming + agentic-engineering ===
// agentic-programming: Fowler 2025 → 2026-05
// agentic-engineering: Simon URL 修正 (2026-03-15)
const l1Path = path.join(DATA_DIR, 'terms-L1.json');
const l1 = JSON.parse(fs.readFileSync(l1Path, 'utf8'));

const agProg = l1.find(t => t.id === 'agentic-programming');
if (agProg) {
  agProg.coinedDate = '2026-05';
  fixes.push('L1/agentic-programming: coinedDate 2025 → 2026-05');
}

const agEng = l1.find(t => t.id === 'agentic-engineering');
if (agEng) {
  // 改 URL 2025/Mar/16 → 2026-03-15
  agEng.seeAlso = (agEng.seeAlso || []).map(s => {
    if (s.url && s.url.includes('2025/Mar/16')) {
      return { ...s, url: 'https://simonwillison.net/2026/Mar/15/agentic-engineering/' };
    }
    return s;
  });
  // 删 "预计 2026 年底 agentic engineering 主导" 的预测性描述 — 保留其他 quote
  if (agEng.longDesc) {
    agEng.longDesc = agEng.longDesc
      .replace(/预计\s*2026\s*年底[^。<]*/g, '')
      .replace(/[\s\n]{2,}/g, '\n\n')
      .trim();
  }
  fixes.push('L1/agentic-engineering: URL fix + remove prediction');
}

// vibe-coding: 改 quote 标记
const vc = l1.find(t => t.id === 'vibe-coding');
if (vc && vc.quotes) {
  vc.quotes = vc.quotes.map(q => {
    if (q.cite && q.cite.includes('Karpathy 2025-02 原文')) {
      return { ...q, cite: 'Karpathy 2025-02（中文意译）' };
    }
    return q;
  });
  fixes.push('L1/vibe-coding: cite "原文" → "中文意译"');
}

fs.writeFileSync(l1Path, JSON.stringify(l1, null, 2));
console.log(`[fix] L1: ${fixes.length} 项修复`);
fixes.forEach(f => console.log('  ✓', f));

// === Fix L6: vibe-slop + open-source-impact + homogenization ===
// + cognitive-debt 系列 + security
const l6Path = path.join(DATA_DIR, 'terms-L6.json');
const l6 = JSON.parse(fs.readFileSync(l6Path, 'utf8'));

const fixArxiv = (term, fixesList) => {
  if (!term) return;
  // 改 source 中的 arXiv ID
  if (term.source && term.source.includes('2601.12345')) {
    term.source = term.source.replace('2601.12345', ARXIV_ID);
    fixesList.push(`L6/${term.id}: source arXiv ID fix`);
  }
  if (term.seeAlso) {
    term.seeAlso = term.seeAlso.map(s => {
      if (s.url && s.url.includes('2601.12345')) {
        return { ...s, url: ARXIV_URL };
      }
      return s;
    });
  }
  // 改 longDesc 中对 paper 的描述
  if (term.longDesc) {
    term.longDesc = term.longDesc
      .replace(/2601\.12345/g, ARXIV_ID)
      .replace(/研究 OSS 生态平衡[^。<]*。?/g, '模型分析了开源生态平衡。')
      .replace(/LLM 倾向于选择[^。<]*。/g, '论文模型预测了这种趋势。');
  }
};

const vibeSlop = l6.find(t => t.id === 'vibe-slop');
if (vibeSlop) {
  fixArxiv(vibeSlop, fixes);
  // 改 coinedBy attribution（更弱化）
  if (vibeSlop.coinedBy === 'Mario Zechner') {
    vibeSlop.coinedBy = '社区用法 (popularized by Mario Zechner / Armin Ronacher)';
    fixes.push('L6/vibe-slop: coinedBy 弱化为社区用法');
  }
}

const openSource = l6.find(t => t.id === 'open-source-impact');
if (openSource) {
  fixArxiv(openSource, fixes);
  // 移除 "论文证明的两个实例" 这类不准确表述
  if (openSource.longDesc) {
    openSource.longDesc = openSource.longDesc
      .replace(/论文\s*证明[^。<]*。/g, '论文模型分析')
      .replace(/受影响项目[^。<]*?cURL[^。<]*?Ghostty[^。<]*。/g, '受影响项目（独立事件证据）：cURL（结束 bug bounty）/ Ghostty（移至邀请制）。');
  }
  fixes.push('L6/open-source-impact: 移除 "论文证明" 不准确表述');
}

const homogen = l6.find(t => t.id === 'homogenization');
if (homogen) {
  fixArxiv(homogen, fixes);
  fixes.push('L6/homogenization: 弱化论文为 "模型预测"');
}

// cognitive-debt 系列：删除 Hunt attribution
const cogDebt = l6.find(t => t.id === 'cognitive-debt-detail');
if (cogDebt) {
  delete cogDebt.coinedBy;
  delete cogDebt.coinedDate;
  if (cogDebt.longDesc) {
    cogDebt.longDesc = cogDebt.longDesc
      .replace(/Andrew Hunt[^。<]*Hunt[^。<]*。/g, '在 2025–2026 期间，多位研究者使用过 "cognitive debt" 这一表达，但具体 coinage 暂未确认。');
  }
  fixes.push('L6/cognitive-debt-detail: 删除 Hunt attribution (无 primary source)');
}

const cogDebtVs = l6.find(t => t.id === 'cognitive-debt-vs-tech-debt');
if (cogDebtVs) {
  if (cogDebtVs.longDesc) {
    cogDebtVs.longDesc = cogDebtVs.longDesc
      .replace(/Hunt 框架[^。<]*。?/g, '讨论中')
      .replace(/2025 是技术债年，2026 转向认知债年。?/g, '一种叙事');
  }
  fixes.push('L6/cognitive-debt-vs-tech-debt: 删除 "Hunt 框架" + 年份对照');
}

// security: Veracode 措辞修正
const security = l6.find(t => t.id === 'security');
if (security && security.longDesc) {
  security.longDesc = security.longDesc
    .replace(/3 年未改善/g, 'security pass rate 在 2023-2025 期间维持在 45-55%')
    .replace(/×2\.74/g, '最高达 2.74×')
    .replace(/470 个开源 PR 分析/g, '470 个 PR 样本 (CodeRabbit 2025-12 报告)');
  fixes.push('L6/security: Veracode/CodeRabbit 措辞收紧');
}

fs.writeFileSync(l6Path, JSON.stringify(l6, null, 2));
console.log(`[fix] L6: ${fixes.filter(f => f.startsWith('L6/')).length} 项修复`);

// === Fix README footer date ===
const readmePath = path.join(__dirname, '..', '..', 'README.md');
let readme = fs.readFileSync(readmePath, 'utf8');
const beforeDate = readme.match(/2025-08-17|2026-08-17/g);
readme = readme.replace(/2025-08-17/g, '2026-08-17');
const afterDate = readme.match(/2025-08-17|2026-08-17/g);
fs.writeFileSync(readmePath, readme);
console.log(`[fix] README: ${beforeDate?.length} '2025-08-17' → '2026-08-17' (date 修正)`);

console.log('\n=== All P0 fixes applied ===');
fixes.forEach(f => console.log('  ✓', f));
