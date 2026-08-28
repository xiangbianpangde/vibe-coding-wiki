#!/usr/bin/env node
/**
 * example-check.cjs — syntax-check code examples embedded in website/data/terms-L*.json
 *
 * Every term may carry an `examples: [{ code, desc }]` array. This script extracts
 * each `code` block, classifies its language (javascript / python / bash / json),
 * and runs a syntax-only check:
 *
 *   javascript -> `node --check` on a temp file (.mjs for ESM/top-level-await, .cjs for require)
 *   python     -> `python3 -B -m py_compile` (skipped with reason `tool-missing` if no python3)
 *   bash       -> `bash -n`
 *   json       -> JSON.parse (fallback: `node --check` wrapped as a JS object literal)
 *
 * Blocks that are obviously NOT independently runnable are marked SKIP, never FAIL:
 *
 *   prose            no code-like tokens at all (no = ( ) { } [ ] ; < > | & ` $ and no URL)
 *   annotation-only  every non-blank line is a `#` or `//` comment
 *   placeholder      <YOUR_API_KEY>-style tokens, YOUR_* literals, xxxx / **** redactions,
 *                    or standalone `...` / `……` / `{ ... }` elision lines
 *   transcript       half or more of the non-blank lines start with `> ` (REPL prompts)
 *   mixed-language   both JS and Python markers present (pseudo-code), or `$ cmd`
 *                    transcript lines mixed with non-transcript code lines
 *   annotation-mixed mixes `#` and `//` comment styles: e.g. JS with `#` comments,
 *                    Python/bash with `//` comments — doc annotation, not runnable as-is
 *   unknown-language code-like but no recognizable language markers
 *   tool-missing     python3 / bash not available on this machine
 *
 * Language detection is deliberately conservative: when in doubt the block is SKIPped
 * (safe direction for a guardrail) rather than risk a false FAIL.
 *
 * Usage:
 *   node scripts/example-check.cjs [--out <path>] [--strict]
 *
 * Output: markdown report on stdout; also written to <path> when --out is given.
 * Exit code: 0 always (guardrail / report mode). With --strict: 1 if any FAIL.
 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const WEBSITE_ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(WEBSITE_ROOT, 'data');

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const argv = process.argv.slice(2);
const strict = argv.includes('--strict');
let outPath = null;
{
  const i = argv.indexOf('--out');
  if (i !== -1 && argv[i + 1]) outPath = path.resolve(process.cwd(), argv[i + 1]);
}

// ---------------------------------------------------------------------------
// Tool availability
// ---------------------------------------------------------------------------
function hasTool(cmd, args) {
  try {
    const r = spawnSync(cmd, args, { timeout: 10000, encoding: 'utf8' });
    return !r.error;
  } catch {
    return false;
  }
}
const HAS_PYTHON3 = hasTool('python3', ['--version']);
const HAS_BASH = hasTool('bash', ['--version']);
const HAS_NODE = hasTool('node', ['--version']);

// ---------------------------------------------------------------------------
// Language signal regexes (high-precision on purpose)
// ---------------------------------------------------------------------------
const PY_STRONG = [
  /\bdef\s+\w+\s*\(/,                          // def foo(
  /^\s*from\s+[\w.]+\s+import\b/m,             // from x import y
  /^\s*import\s+[\w.]+(\s*,\s*[\w.]+)*\s*$/m,  // import os / import a, b
  /\bprint\s*\(/,                              // print(
  /\belif\b/,
  /\b(True|False|None)\b/,
  /\bself\./,
  /^\s*@[\w.]+(\(.*)?\s*$/m,                   // decorator
  /f["'][^"'\n]*\{/,                           // f-string
  /"""/,                                       // triple-quoted string
];
const JS_STRONG = [
  /\b(const|let|var)\s+\w+/,
  /=>/,
  /\bconsole\.(log|error|warn|info|debug)\b/,
  /\brequire\s*\(\s*["']/,
  /^\s*export\s/m,
  /\bfunction\b/,
  /^\s*import\s*\{/m,                          // import { x } from
  /^\s*import\s+\w+\s+from\b/m,                // import x from
  /^\s*import\s*\*\s+as\b/m,
  /^\s*import\s+["']/m,                        // side-effect import
  /\bnew\s+[A-Z]\w*\s*\(/,
  /\b(document|window)\./,
  /\bprocess\.env\b/,
  /\bundefined\b/,
];

// Bash first-token allowlist + structural starters
const BASH_CMDS = new Set(
  ('cd ls pwd npm npx pnpm yarn bun deno node python python3 pip pip3 pipx uv uvx git curl wget ' +
   'mkdir rm rmdir cp mv cat echo export source sudo brew docker kubectl helm terraform tofu aws ' +
   'gcloud az claude gemini ollama ssh scp rsync make chmod chown grep sed awk tar unzip zip open ' +
   'code touch ln which env kill ps head tail wc sort uniq find xargs jq yq htop top df du free ' +
   'whoami date sleep printf test alias unalias history exit return set unset shopt trap wait ' +
   'nohup time apt apt-get dnf yum pacman ffmpeg magick psql mysql sqlite3 redis-cli mongo cargo ' +
   'rustc go javac java dotnet php ruby perl fish zsh bash sh vi vim nano less more gitk tree du')
    .split(/\s+/)
);
const BASH_STARTERS = /^(if|then|else|elif|fi|for|while|until|do|done|case|esac|function|select|time)\b/;

// ---------------------------------------------------------------------------
// Skip heuristics
// ---------------------------------------------------------------------------
const PLACEHOLDER_RE = [
  /<[A-Z][A-Z0-9_]{1,}>/,            // <YOUR_API_KEY>, <API_KEY>
  /<your[-_ ][^>\n]*>/i,             // <your-key>, <Your Name>
  /\bYOUR_[A-Z0-9_]+/,               // YOUR_API_KEY
  /\b[A-Z][A-Z0-9_]*_YOUR[A-Z0-9_]*\b/,
  /\bx{4,}/i,                        // xxxx
  /\*{3,}/,                          // ****
  /^\s*\.{3,}\s*$/,                  // a line that is only "..."
  /^\s*…+\s*$/,                      // a line that is only "……"
  /\{\s*\.{3,}\s*\}/,                // { ... }
  /\[\s*\.{3,}\s*\]/,                // [ ... ]
  /<placeholder[^>]*>/i,
];

function nonBlankLines(code) {
  return code.split('\n').filter((l) => l.trim().length > 0);
}
function isCommentLine(l) {
  return /^\s*(#|\/\/)/.test(l);
}

// ---------------------------------------------------------------------------
// Classification
// ---------------------------------------------------------------------------
/**
 * @returns {{kind:'check', lang:'javascript'|'python'|'bash'|'json', code:string}
 *          |{kind:'skip', reason:string}}
 */
function classify(rawCode) {
  let code = rawCode.trim();
  if (!code) return { kind: 'skip', reason: 'prose' };

  const lines = nonBlankLines(code);
  const commentLines = lines.filter(isCommentLine).length;

  // 1. placeholder / elision
  for (const re of PLACEHOLDER_RE) {
    if (re.test(code)) return { kind: 'skip', reason: 'placeholder' };
  }

  // 2. REPL transcript (> prompt)
  const gtLines = lines.filter((l) => /^\s*>\s/.test(l)).length;
  if (gtLines > 0 && gtLines * 2 >= lines.length) {
    return { kind: 'skip', reason: 'transcript' };
  }

  // 3. comment-only block (nothing runnable)
  if (commentLines === lines.length) {
    return { kind: 'skip', reason: 'annotation-only' };
  }

  // 4. `$ cmd` transcript mixed with other code lines -> pseudo/doc snippet
  const dollarLines = lines.filter((l) => /^\s*\$\s+/.test(l)).length;
  const otherCodeLines = lines.filter(
    (l) => !/^\s*\$\s+/.test(l) && !isCommentLine(l)
  ).length;
  if (dollarLines > 0 && otherCodeLines > 0) {
    return { kind: 'skip', reason: 'mixed-language' };
  }

  // 5. prose: no line carries any code-like punctuation
  const codePunct = /[=(){}[\];<>|&`$]|:\/\//;
  if (!lines.some((l) => codePunct.test(l))) {
    return { kind: 'skip', reason: 'prose' };
  }

  // 6. JSON: block starts with { or [ (after stripping leading comment lines)
  //    and has a quoted key -> JSON.parse; fallback to JS object-literal check.
  const codeNoLeadingComments = code
    .split('\n')
    .filter((l) => !/^\s*(\/\/|#)/.test(l))
    .join('\n')
    .trim();
  if (/^[{[]/.test(codeNoLeadingComments) && /["']\s*:/.test(codeNoLeadingComments)) {
    return { kind: 'check', lang: 'json', code: codeNoLeadingComments };
  }

  // 7. mixed JS+Python markers -> pseudo-code
  const pyHits = PY_STRONG.filter((re) => re.test(code)).length;
  const jsHits = JS_STRONG.filter((re) => re.test(code)).length;
  if (pyHits > 0 && jsHits > 0) {
    return { kind: 'skip', reason: 'mixed-language' };
  }
  // `#` comments (non-shebang) and `//` comments are language-specific; a block
  // using the wrong style for its language is a doc annotation, not runnable code.
  const hashComments = lines.some((l) => /^\s*#/.test(l) && !/^\s*#!/.test(l));
  const slashComments = lines.some((l) => /^\s*\/\//.test(l));
  if (pyHits > 0) {
    if (slashComments) return { kind: 'skip', reason: 'annotation-mixed' };
    return { kind: 'check', lang: 'python', code };
  }
  if (jsHits > 0) {
    if (hashComments) return { kind: 'skip', reason: 'annotation-mixed' };
    return { kind: 'check', lang: 'javascript', code };
  }

  // 8. bash: shebang / `$ cmd` only / known command or structural starter per line
  if (/^\s*#!/.test(code)) return { kind: 'check', lang: 'bash', code };
  if (dollarLines > 0 && otherCodeLines === 0) {
    const stripped = lines
      .map((l) => l.replace(/^\s*\$\s+/, ''))
      .filter((l) => l.trim().length > 0)
      .join('\n');
    return { kind: 'check', lang: 'bash', code: stripped };
  }
  // Bash needs at least one line starting with a known command; option/pipe/
  // assignment lines may only accompany it (prevents misreading markdown/prose
  // list items starting with `-` as shell).
  const codeLines = lines.filter((l) => !isCommentLine(l));
  const hasKnownCmd = codeLines.some((l) => BASH_CMDS.has(l.trim().split(/\s+/)[0]));
  const looksBash =
    hasKnownCmd &&
    codeLines.every((l) => {
      const t = l.trim();
      const first = t.split(/\s+/)[0];
      return (
        BASH_CMDS.has(first) ||
        BASH_STARTERS.test(t) ||
        /^\w+=/.test(t) ||          // VAR=value assignment
        /^[-|)&;{[(]/.test(t)       // option/pipe/continuation style line
      );
    });
  if (looksBash) {
    if (slashComments) return { kind: 'skip', reason: 'annotation-mixed' };
    return { kind: 'check', lang: 'bash', code };
  }

  return { kind: 'skip', reason: 'unknown-language' };
}

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------
function cleanErr(stderr, tmpFile) {
  const txt = String(stderr || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.split('\n')[0])
    .join(' | ')
    .split(tmpFile).join('<tmp>');
  return txt.slice(0, 300) || 'unknown error';
}

function makeTempFile(ext, content) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'example-check-'));
  const file = path.join(dir, `snippet${ext}`);
  fs.writeFileSync(file, content);
  return { dir, file };
}
function rmTemp(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
}

/** node --check; wraps `{`-leading code in parens so object literals parse. */
function checkJavascript(code) {
  const useCjs = /\brequire\s*\(\s*["']/.test(code);
  const ext = useCjs ? '.cjs' : '.mjs';
  const toCheck = /^\s*\{/.test(code.trim()) ? `(${code})` : code;
  const { dir, file } = makeTempFile(ext, toCheck);
  try {
    const r = spawnSync('node', ['--check', file], { timeout: 20000, encoding: 'utf8' });
    if (r.status === 0) return { ok: true };
    return { ok: false, error: cleanErr(r.stderr, file) };
  } finally {
    rmTemp(dir);
  }
}

function checkPython(code) {
  const { dir, file } = makeTempFile('.py', code);
  try {
    const r = spawnSync('python3', ['-B', '-m', 'py_compile', file], {
      timeout: 20000,
      encoding: 'utf8',
    });
    if (r.status === 0) return { ok: true };
    return { ok: false, error: cleanErr(r.stderr, file) };
  } finally {
    rmTemp(dir);
  }
}

function checkBash(code) {
  const { dir, file } = makeTempFile('.sh', code);
  try {
    const r = spawnSync('bash', ['-n', file], { timeout: 20000, encoding: 'utf8' });
    if (r.status === 0) return { ok: true };
    return { ok: false, error: cleanErr(r.stderr, file) };
  } finally {
    rmTemp(dir);
  }
}

function checkJson(code) {
  try {
    JSON.parse(code);
    return { ok: true };
  } catch (e) {
    // Fallback: doc snippets labeled .json often use JS-object syntax
    // (unquoted keys / trailing commas). Accept if it parses as a JS literal.
    const js = checkJavascript(code);
    if (js.ok) return { ok: true, note: 'not strict JSON, valid as JS object literal' };
    return { ok: false, error: cleanErr(String(e.message), '') };
  }
}

// ---------------------------------------------------------------------------
// Scan
// ---------------------------------------------------------------------------
const SKIP_RULE_DOC = {
  prose: 'no code-like tokens (no `=(){}[];<>|&` and no URL) — natural-language description',
  'annotation-only': 'every non-blank line is a `#` or `//` comment — nothing runnable',
  placeholder: 'contains `<YOUR_API_KEY>`-style tokens, `YOUR_*`, `xxxx`/`****`, or `...`/`{ ... }` elision',
  transcript: '≥ half of non-blank lines start with `> ` (REPL/session transcript)',
  'mixed-language': 'both JS and Python markers (pseudo-code), or `$ cmd` transcript mixed with code lines',
  'annotation-mixed': 'mixes `#` and `//` comment styles for the detected language (JS with `#`, Python/bash with `//`) — doc annotation, not runnable as-is',
  'unknown-language': 'code-like content but no recognizable language markers',
  'tool-missing': 'python3/bash unavailable on this machine — check skipped',
};

function main() {
  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => /^terms-L\d+\.json$/.test(f))
    .sort((a, b) => Number(a.match(/L(\d+)/)[1]) - Number(b.match(/L(\d+)/)[1]));
  if (files.length === 0) {
    console.error(`No terms-L*.json found in ${DATA_DIR}`);
    process.exit(2);
  }

  const results = [];
  let termsScanned = 0;

  for (const f of files) {
    const terms = JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8'));
    for (const term of terms) {
      if (!Array.isArray(term.examples)) continue;
      termsScanned++;
      term.examples.forEach((ex, idx) => {
        const code = typeof ex.code === 'string' ? ex.code : '';
        const base = {
          file: f,
          termId: term.id || '(no id)',
          termName: term.name || '',
          idx,
        };
        const c = classify(code);
        if (c.kind === 'skip') {
          results.push({ ...base, status: 'SKIP', reason: c.reason, lang: null });
          return;
        }
        const lang = c.lang;
        if (lang === 'python' && !HAS_PYTHON3) {
          results.push({ ...base, status: 'SKIP', reason: 'tool-missing', lang, detail: 'python3' });
          return;
        }
        if (lang === 'bash' && !HAS_BASH) {
          results.push({ ...base, status: 'SKIP', reason: 'tool-missing', lang, detail: 'bash' });
          return;
        }
        let res;
        if (lang === 'javascript') res = HAS_NODE ? checkJavascript(c.code) : { ok: false, error: 'node not available' };
        else if (lang === 'python') res = checkPython(c.code);
        else if (lang === 'bash') res = checkBash(c.code);
        else res = checkJson(c.code);
        results.push({
          ...base,
          status: res.ok ? 'PASS' : 'FAIL',
          lang,
          note: res.note || null,
          error: res.ok ? null : res.error,
        });
      });
    }
  }

  // ------- aggregation -------
  const langs = ['javascript', 'python', 'bash', 'json'];
  const agg = {};
  for (const l of langs) agg[l] = { PASS: 0, FAIL: 0, SKIP: 0 };
  const skipReasons = {};
  for (const r of results) {
    if (r.status === 'SKIP') {
      skipReasons[r.reason] = (skipReasons[r.reason] || 0) + 1;
      if (r.reason === 'tool-missing' && r.lang) agg[r.lang].SKIP++;
    } else {
      agg[r.lang][r.status]++;
    }
  }
  const fails = results.filter((r) => r.status === 'FAIL');

  const langLabel = { javascript: 'javascript (node --check)', python: 'python (py_compile)', bash: 'bash (bash -n)', json: 'json (JSON.parse)' };
  const L = [];
  L.push('# Example Code Check Report');
  L.push('');
  L.push(`- **Generated**: ${new Date().toISOString()}`);
  L.push(`- **Scope**: \`website/data/terms-L*.json\` (L1–L${files.length}), terms with \`examples[]\``);
  L.push(`- **Terms with examples**: ${termsScanned} · **Examples total**: ${results.length}`);
  L.push(`- **Mode**: ${strict ? '`strict` (exit 1 on any FAIL)' : '`guardrail` (report-only, always exit 0)'}`);
  L.push('');
  L.push('## Summary');
  L.push('');
  L.push('| Language | Check | PASS | FAIL | SKIP |');
  L.push('|---|---|---:|---:|---:|');
  for (const l of langs) {
    const a = agg[l];
    L.push(`| ${l} | ${langLabel[l]} | ${a.PASS} | ${a.FAIL} | ${a.SKIP} |`);
  }
  const tot = Object.values(agg).reduce(
    (s, a) => ({ PASS: s.PASS + a.PASS, FAIL: s.FAIL + a.FAIL, SKIP: s.SKIP + a.SKIP }),
    { PASS: 0, FAIL: 0, SKIP: 0 }
  );
  L.push(`| **Total** | | **${tot.PASS}** | **${tot.FAIL}** | **${tot.SKIP}** |`);
  L.push('');

  L.push('## SKIP reasons');
  L.push('');
  const skipEntries = Object.entries(skipReasons).sort((a, b) => b[1] - a[1]);
  if (skipEntries.length === 0) {
    L.push('_none_');
  } else {
    L.push('| Reason | Count | Rule |');
    L.push('|---|---:|---|');
    for (const [reason, count] of skipEntries) {
      L.push(`| ${reason} | ${count} | ${SKIP_RULE_DOC[reason] || '—'} |`);
    }
  }
  L.push('');

  L.push('## FAIL list');
  L.push('');
  if (fails.length === 0) {
    L.push('_none — all checked examples passed their syntax check._');
  } else {
    L.push(`| Term | Example | Language | Error |`);
    L.push(`|---|---|---|---|`);
    for (const f2 of fails) {
      const name = f2.termName ? ` (${f2.termName})` : '';
      L.push(`| \`${f2.termId}\`${name} | #${f2.idx} | ${f2.lang} | ${String(f2.error).replace(/\|/g, '\\|')} |`);
    }
  }
  L.push('');
  L.push('## Methodology');
  L.push('');
  L.push('- Syntax-only checks: `node --check` (temp `.mjs` for ESM/top-level-await, `.cjs` for `require()`), `python3 -B -m py_compile`, `bash -n`, `JSON.parse`.');
  L.push('- JSON blocks starting `{`/`[` with unquoted keys or trailing commas fall back to a JS object-literal check and are noted, not failed.');
  L.push('- Language detection uses high-precision markers (`def `/`import x`/`print(`/`True|False|None` for Python; `const`/`=>`/`console.`/`import {` for JS; shebang / known command words / `VAR=value` for bash).');
  L.push('- A block whose comment style contradicts its language (JS with `#` lines, Python/bash with `//` lines) is SKIPped as doc annotation.');
  L.push('- Bash requires at least one line starting with a known command; `-`-prefixed list/continuation lines alone never establish bash.');
  L.push('- When detection is ambiguous the block is SKIPped, never FAILed — SKIP is the safe direction for a guardrail. See SKIP rules above.');
  L.push('- Exit code: `0` by default (guardrail); with `--strict`, `1` when FAIL > 0.');
  L.push('');

  const report = L.join('\n');
  console.log(report);
  if (outPath) {
    fs.writeFileSync(outPath, report);
    console.error(`Report written to ${outPath}`);
  }

  if (strict && fails.length > 0) process.exit(1);
  process.exit(0);
}

main();
