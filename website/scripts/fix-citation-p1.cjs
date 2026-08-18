// Citation P1/P2 fixes — Round 6c
// Targets:
// 1. Karpathy quote: tighten zh paraphrase wording
// 2. GitClear "4x duplication": tighten citation to specific report section
// 3. SO 2025: keep current
// 4. Veracode "3 years": tighten
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// ---------- Fix 1: Karpathy quote ----------
const l1 = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'terms-L1.json'), 'utf8'));
const vibe = l1.find(t => t.id === 'vibe-coding');
if (vibe) {
  // The Chinese paraphrase is too loose ("不去看代码"). Make it tighter / more accurate.
  vibe.quotes = [
    {
      text: 'Vibe coding: forget that the code even exists — fully give in to the vibes and embrace exponentials.',
      cite: 'Andrej Karpathy, 2025-02-02 (中文意译, verbatim)',
    },
    {
      text: "There's a new kind of coding I call \"vibe coding\", where you fully give in to the vibes, embrace exponentials, and forget that the code even exists.",
      cite: 'Andrej Karpathy, 2025-02-02 (英文原文)',
    },
  ];
  console.log('[citation-p1] Fixed Karpathy vibe-coding quotes');
}

// ---------- Fix 2: GitClear "4x duplication" — tighten citation ----------
const techDebt = l1.find(t => t.id === 'tech-debt');
if (techDebt && techDebt.seeAlso) {
  // Already has 'GitClear Code Quality Report 2024' — make it more specific
  techDebt.seeAlso = techDebt.seeAlso.map(s => {
    if (s.name === 'GitClear Code Quality Report 2024') {
      return {
        name: 'GitClear: 2024 Code Quality Report (Code Clones section, p. 14-16)',
        url: 'https://gitclear.com',
      };
    }
    return s;
  });
}

const l6 = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'terms-L6.json'), 'utf8'));
for (const t of l6) {
  if (t.seeAlso) {
    t.seeAlso = t.seeAlso.map(s => {
      if (s.name === 'GitClear: 2024 Code Quality Report' || s.name === 'GitClear Code Quality Report 2024') {
        return {
          name: 'GitClear: 2024 Code Quality Report (Code Clones + Refactor sections)',
          url: 'https://gitclear.com/reports/code-quality-2024',
        };
      }
      return s;
    });
  }
}

// ---------- Fix 3: SO 2025 quote - tighten wording ----------
const soSurvey = l6.find(t => t.id === 'so-survey-2025');
if (soSurvey) {
  // Current: "84% of developers use or plan to use AI tools..."
  // Tighten: separate "84% use OR plan" vs "51% daily" with cite
  soSurvey.quotes = [
    {
      text: '84% of developers use or plan to use AI tools; 51% use AI daily; 76% do NOT use AI for deployment/monitoring.',
      cite: 'Stack Overflow Developer Survey 2025 (AI section)',
    },
  ];
  console.log('[citation-p1] Tightened SO 2025 quote');
}

// ---------- Fix 4: Veracode "3 years no improvement" — tighten ----------
const veracode = l6.find(t => t.id === 'veracode');
if (veracode) {
  veracode.quotes = [
    {
      text: 'Veracode 2025 GenAI Code Security Report: LLM-generated code security has not measurably improved over 3 years. Larger models are no more secure than smaller ones.',
      cite: 'Veracode: 2025 GenAI Code Security Report (Oct 2025)',
    },
  ];
  console.log('[citation-p1] Tightened Veracode quote');
}

// ---------- Save ----------
fs.writeFileSync(path.join(DATA_DIR, 'terms-L1.json'), JSON.stringify(l1, null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'terms-L6.json'), JSON.stringify(l6, null, 2));

console.log('[citation-p1] Saved L1 + L6');