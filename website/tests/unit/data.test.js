// Data integrity test — all 178 terms have required fields
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', '..', 'data');
const REQUIRED_FIELDS = ['id', 'name', 'zh', 'layer', 'shortDesc', 'longDesc', 'related', 'tags'];
const LAYERS = ['L1','L2','L3','L4','L5','L6','L7','L8'];

let allTerms = [];
let byId = new Map();

beforeAll(() => {
  for (const l of LAYERS) {
    const items = JSON.parse(readFileSync(join(DATA_DIR, `terms-${l}.json`), 'utf8'));
    for (const t of items) {
      allTerms.push(t);
      byId.set(t.id, t);
    }
  }
});

describe('Data integrity', () => {
  it('loads all 178 terms across 8 layer files', () => {
    expect(allTerms.length).toBe(178);
  });

  it('every term has all required fields', () => {
    const offenders = [];
    for (const t of allTerms) {
      for (const f of REQUIRED_FIELDS) {
        if (!(f in t)) {
          offenders.push(`${t.id} missing ${f}`);
        }
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });

  it('every term.id is unique', () => {
    const seen = new Map();
    const dups = [];
    for (const t of allTerms) {
      if (seen.has(t.id)) dups.push(`${t.id} appears in both ${seen.get(t.id)} and current`);
      seen.set(t.id, t.layer);
    }
    expect(dups, dups.join('\n')).toEqual([]);
  });

  it('every term has a valid layer (L1-L8)', () => {
    const bad = allTerms.filter(t => !LAYERS.includes(t.layer));
    expect(bad.map(t => t.id)).toEqual([]);
  });

  it('shortDesc and longDesc are non-empty strings', () => {
    const bad = allTerms.filter(t =>
      typeof t.shortDesc !== 'string' || t.shortDesc.length < 5 ||
      typeof t.longDesc !== 'string' || t.longDesc.length < 10
    );
    expect(bad.map(t => `${t.id}: short=${t.shortDesc?.length}/long=${t.longDesc?.length}`)).toEqual([]);
  });

  it('related references resolve to existing terms', () => {
    const orphans = [];
    for (const t of allTerms) {
      for (const rid of (t.related || [])) {
        if (!byId.has(rid)) orphans.push(`${t.id} → ${rid}`);
      }
    }
    expect(orphans, orphans.slice(0,10).join('\n')).toEqual([]);
  });

  it('tags is a non-empty array of strings', () => {
    const bad = [];
    for (const t of allTerms) {
      if (!Array.isArray(t.tags) || t.tags.length === 0) bad.push(`${t.id}: empty tags`);
      else if (!t.tags.every(x => typeof x === 'string')) bad.push(`${t.id}: non-string tag`);
    }
    expect(bad).toEqual([]);
  });

  it('distribution across layers is reasonable (each layer ≥ 10 terms)', () => {
    const counts = {};
    for (const t of allTerms) counts[t.layer] = (counts[t.layer] || 0) + 1;
    for (const l of LAYERS) {
      expect(counts[l] || 0, `layer ${l} too sparse`).toBeGreaterThanOrEqual(10);
    }
  });
});
