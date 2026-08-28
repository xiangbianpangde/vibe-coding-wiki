#!/usr/bin/env node
/**
 * citation-stale-audit.cjs — per-citation lastVerified staleness audit + optional link check.
 *
 * Usage:
 *   node scripts/citation-stale-audit.cjs           # staleness report (markdown), exit 0 always
 *   node scripts/citation-stale-audit.cjs --check   # additionally HTTP-HEAD every seeAlso URL
 *                                                   # (10s timeout, concurrency 5), report
 *                                                   # 4xx/5xx/timeout/error items; exit 0 always
 *   node scripts/citation-stale-audit.cjs --days=60 # override the 90-day staleness threshold
 *
 * Exit code is always 0: this is a report tool, not a CI gate. Problems are flagged
 * in the report output instead.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DEFAULT_STALE_DAYS = 90;
const HEAD_TIMEOUT_MS = 10_000;
const CONCURRENCY = 5;

// ---------------------------------------------------------------------------
// args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const doCheck = args.includes('--check');
const daysArg = args.find((a) => a.startsWith('--days='));
const daysRaw = daysArg ? Number(daysArg.split('=')[1]) : NaN;
const STALE_DAYS = Number.isFinite(daysRaw) ? daysRaw : DEFAULT_STALE_DAYS;

// ---------------------------------------------------------------------------
// load data
// ---------------------------------------------------------------------------
function loadCitations() {
  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => /^terms-L\d+\.json$/.test(f))
    .sort((a, b) => Number(a.match(/L(\d+)/)[1]) - Number(b.match(/L(\d+)/)[1]));

  const rows = []; // { termId, layer, url, name, lastVerified }
  let termCount = 0;
  for (const file of files) {
    const terms = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
    termCount += terms.length;
    for (const t of terms) {
      for (const s of t.seeAlso || []) {
        rows.push({
          termId: t.id,
          layer: t.layer,
          name: s.name,
          url: s.url,
          lastVerified: s.lastVerified || null,
        });
      }
    }
  }
  return { files, termCount, rows };
}

const DAY_MS = 24 * 60 * 60 * 1000;

function ageDays(iso) {
  if (!iso) return null;
  const ms = Date.now() - Date.parse(iso);
  return Number.isNaN(ms) ? null : Math.floor(ms / DAY_MS);
}

// ---------------------------------------------------------------------------
// staleness report (default mode)
// ---------------------------------------------------------------------------
function stalenessReport(rows, termCount, files) {
  const stale = [];
  const missing = [];
  const dates = [];
  for (const r of rows) {
    if (!r.lastVerified) { missing.push(r); continue; }
    dates.push(r.lastVerified);
    const age = ageDays(r.lastVerified);
    if (age === null || age > STALE_DAYS) stale.push({ ...r, age });
  }

  const lines = [];
  lines.push('# Citation staleness audit');
  lines.push('');
  lines.push(`- Generated: ${new Date().toISOString()}`);
  lines.push(`- Layers scanned: ${files.join(', ')}`);
  lines.push(`- Terms: ${termCount}`);
  lines.push(`- Total citations (seeAlso items): ${rows.length}`);
  lines.push(`- Threshold: ${STALE_DAYS} days`);
  lines.push(`- Verified date range: ${dates.length ? `${dates.sort()[0]} … ${dates.sort()[dates.length - 1]}` : 'n/a'}`);
  lines.push('');

  if (missing.length) {
    lines.push(`## ⚠ Citations missing lastVerified (${missing.length})`);
    lines.push('');
    lines.push('| term id | layer | url | lastVerified | days |');
    lines.push('|---|---|---|---|---|');
    for (const r of missing) {
      lines.push(`| ${r.termId} | ${r.layer} | ${r.url} | - | - |`);
    }
    lines.push('');
  }

  if (stale.length) {
    lines.push(`## Stale citations — lastVerified older than ${STALE_DAYS} days (${stale.length})`);
    lines.push('');
    lines.push('| term id | layer | url | lastVerified | days |');
    lines.push('|---|---|---|---|---|');
    for (const r of stale.sort((a, b) => (b.age || 0) - (a.age || 0))) {
      lines.push(`| ${r.termId} | ${r.layer} | ${r.url} | ${r.lastVerified} | ${r.age} |`);
    }
  } else {
    lines.push(`## ✅ No stale citations (all verified within ${STALE_DAYS} days)`);
  }
  lines.push('');

  lines.push('## Summary');
  lines.push('');
  lines.push(`| metric | value |`);
  lines.push(`|---|---|`);
  lines.push(`| terms scanned | ${termCount} |`);
  lines.push(`| citations scanned | ${rows.length} |`);
  lines.push(`| stale (> ${STALE_DAYS}d) | ${stale.length} (${rows.length ? ((stale.length / rows.length) * 100).toFixed(1) : 0}%) |`);
  lines.push(`| missing lastVerified | ${missing.length} |`);
  lines.push('');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// link check (--check mode)
// ---------------------------------------------------------------------------
async function checkUrl(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), HEAD_TIMEOUT_MS);
  const started = Date.now();
  const result = { url, ok: false, status: null, method: 'HEAD', error: null, ms: 0 };
  try {
    const res = await fetch(url, { method: 'HEAD', signal: ctrl.signal, redirect: 'follow' });
    // Some servers reject HEAD outright (405/501) — retry once with GET, discarding the body.
    if (res.status === 405 || res.status === 501) {
      result.method = 'GET';
      const res2 = await fetch(url, { method: 'GET', signal: ctrl.signal, redirect: 'follow' });
      // drain/ignore body; abort frees the socket early
      try { res2.body?.cancel(); } catch { /* ignore */ }
      result.status = res2.status;
      result.ok = res2.ok;
    } else {
      result.status = res.status;
      result.ok = res.ok;
    }
  } catch (err) {
    if (err.name === 'AbortError') result.error = 'timeout';
    else result.error = err.cause?.code || err.message || 'error';
  } finally {
    clearTimeout(timer);
    result.ms = Date.now() - started;
  }
  return result;
}

async function checkAll(urls) {
  const results = new Array(urls.length);
  let cursor = 0;
  async function worker() {
    while (cursor < urls.length) {
      const i = cursor++;
      results[i] = await checkUrl(urls[i]);
      process.stderr.write(`  checked ${i + 1}/${urls.length}\r`);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, urls.length) }, worker));
  process.stderr.write('\n');
  return results;
}

async function checkReport(rows) {
  const urls = [...new Set(rows.map((r) => r.url))];
  process.stderr.write(`Checking ${urls.length} unique URLs (HEAD, ${HEAD_TIMEOUT_MS / 1000}s timeout, concurrency ${CONCURRENCY})…\n`);
  const results = await checkAll(urls);
  const byUrl = new Map(results.map((r) => [r.url, r]));

  const bad = results.filter((r) => !r.ok);
  const lines = [];
  lines.push('# Citation link check');
  lines.push('');
  lines.push(`- Generated: ${new Date().toISOString()}`);
  lines.push(`- Unique URLs checked: ${urls.length} (citations: ${rows.length})`);
  lines.push('');
  if (bad.length) {
    lines.push(`## ⚠ Problem URLs (${bad.length})`);
    lines.push('');
    lines.push('| term id | layer | url | status | detail |');
    lines.push('|---|---|---|---|---|');
    for (const r of bad) {
      const owners = rows.filter((x) => x.url === r.url);
      for (const o of owners) {
        const status = r.error ? (r.error === 'timeout' ? 'timeout' : 'error') : `${Math.floor(r.status / 100)}xx ${r.status}`;
        const detail = r.error === 'timeout' ? `no response in ${HEAD_TIMEOUT_MS / 1000}s` : r.error || '';
        lines.push(`| ${o.termId} | ${o.layer} | ${r.url} | ${status} | ${detail} |`);
      }
    }
  } else {
    lines.push('## ✅ All URLs reachable');
  }
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push('| metric | value |');
  lines.push('|---|---|');
  lines.push(`| unique URLs | ${urls.length} |`);
  lines.push(`| ok (2xx/3xx) | ${results.filter((r) => r.ok).length} |`);
  lines.push(`| 4xx | ${results.filter((r) => !r.ok && !r.error && r.status >= 400 && r.status < 500).length} |`);
  lines.push(`| 5xx | ${results.filter((r) => !r.ok && !r.error && r.status >= 500).length} |`);
  lines.push(`| timeout | ${results.filter((r) => r.error === 'timeout').length} |`);
  lines.push(`| network error | ${results.filter((r) => r.error && r.error !== 'timeout').length} |`);
  lines.push('');
  lines.push(bad.length ? '**Note:** dead/stale links found — see table above. (Report-only; exit code 0.)' : '');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------
async function main() {
  const { files, termCount, rows } = loadCitations();
  const report = doCheck ? await checkReport(rows) : stalenessReport(rows, termCount, files);
  console.log(report);
  process.exit(0); // report-only tool: never fail the build
}

main().catch((err) => {
  console.error('audit failed:', err);
  process.exit(1);
});
