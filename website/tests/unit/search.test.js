// Search engine unit tests — pure function via window.VC_SEARCH_ENGINE
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Window } from 'happy-dom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', '..', 'data');

let allData = [];

beforeAll(() => {
  // Load all layer JSONs and merge into VC_DATA shape (id/name/zh/desc/layer)
  const layers = ['L1','L2','L3','L4','L5','L6','L7','L8'];
  for (const l of layers) {
    const items = JSON.parse(readFileSync(join(DATA_DIR, `terms-${l}.json`), 'utf8'));
    for (const t of items) {
      allData.push({
        id: t.id, name: t.name, zh: t.zh, desc: t.shortDesc || '', layer: t.layer,
      });
    }
  }
  // Install search-engine in happy-dom window
  const win = new Window({ url: 'http://localhost/' });
  globalThis.window = win;
  globalThis.document = win.document;
  // Manually eval the search-engine IIFE
  const engineSrc = readFileSync(join(__dirname, '..', '..', 'js', 'search-engine.js'), 'utf8');
  // eslint-disable-next-line no-new-func
  new Function(engineSrc).call(globalThis);
});

describe('Search engine (VC_SEARCH_ENGINE.search)', () => {
  it('returns [] for empty query', () => {
    const r = globalThis.window.VC_SEARCH_ENGINE.search(allData, '', 14);
    expect(r).toEqual([]);
  });

  it('returns [] for whitespace-only query', () => {
    const r = globalThis.window.VC_SEARCH_ENGINE.search(allData, '   ', 14);
    expect(r).toEqual([]);
  });

  it('searching "vibe" returns ≥ 3 results', () => {
    const r = globalThis.window.VC_SEARCH_ENGINE.search(allData, 'vibe', 14);
    expect(r.length).toBeGreaterThanOrEqual(3);
    // Sanity check: every result must mention "vibe" in name/zh/desc
    for (const item of r) {
      const haystack = (item.name + ' ' + item.zh + ' ' + item.desc).toLowerCase();
      expect(haystack).toContain('vibe');
    }
  });

  it('searching "mcp" returns MCP-related terms (id, name, or desc match)', () => {
    const r = globalThis.window.VC_SEARCH_ENGINE.search(allData, 'mcp', 14);
    expect(r.length).toBeGreaterThanOrEqual(2);
    const ids = r.map(x => x.id);
    expect(ids).toContain('mcp');
  });

  it('Chinese query "护栏" returns guardrails / 安全 related terms', () => {
    const r = globalThis.window.VC_SEARCH_ENGINE.search(allData, '护栏', 14);
    expect(r.length).toBeGreaterThanOrEqual(1);
  });

  it('search is case-insensitive', () => {
    const lower = globalThis.window.VC_SEARCH_ENGINE.search(allData, 'claude', 14);
    const upper = globalThis.window.VC_SEARCH_ENGINE.search(allData, 'CLAUDE', 14);
    expect(lower.map(x => x.id).sort()).toEqual(upper.map(x => x.id).sort());
  });

  it('ranked matches: exact id-prefix wins over substring', () => {
    // "guardrail" should put guardrails before any term where guardrail is substring of desc
    const r = globalThis.window.VC_SEARCH_ENGINE.search(allData, 'guardrail', 14);
    expect(r[0].id).toBe('guardrails');
  });

  it('id-search via hyphenation: "spec kit" matches id "spec-kit"', () => {
    const r = globalThis.window.VC_SEARCH_ENGINE.search(allData, 'spec kit', 14);
    expect(r.length).toBeGreaterThanOrEqual(1);
    expect(r.map(x => x.id)).toContain('spec-kit');
  });

  it('respects limit parameter', () => {
    const r = globalThis.window.VC_SEARCH_ENGINE.search(allData, 'a', 5);
    expect(r.length).toBeLessThanOrEqual(5);
  });

  it('does not mutate the input array', () => {
    const snapshot = JSON.stringify(allData);
    globalThis.window.VC_SEARCH_ENGINE.search(allData, 'mcp', 14);
    expect(JSON.stringify(allData)).toBe(snapshot);
  });
});
