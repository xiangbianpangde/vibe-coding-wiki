// Vibe Coding Wiki · Asynchronous term loader
// Loads index first, then loads specific layer JSON on demand.
// Maintains backward compatibility with VC_TERMS API.
// Round 1 (v2.2): auto-loads from script tag's data-layers attribute,
// populates window.VC_TERMS + window.VC_DATA, dispatches vc-terms-ready.

(function() {
  'use strict';

  const DATA_PATH = (() => {
    const path = location.pathname;
    return path.includes('/pages/') ? '../data/' : 'data/';
  })();

  const LAYERS = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'];
  const layerCache = {};
  const subscribers = new Map();
  window.__layerLoading = window.__layerLoading || {};

  // ---------- Core async API ----------

  async function loadIndex() {
    if (window.VC_TERMS_INDEX) return window.VC_TERMS_INDEX;
    const res = await fetch(DATA_PATH + 'terms-index.json');
    window.VC_TERMS_INDEX = await res.json();
    return window.VC_TERMS_INDEX;
  }

  async function loadLayer(layer) {
    if (layerCache[layer]) return layerCache[layer];
    if (window.__layerLoading[layer]) return window.__layerLoading[layer];

    const promise = fetch(DATA_PATH + `terms-${layer}.json`)
      .then(r => r.json())
      .then(items => {
        layerCache[layer] = items;
        window.__layerLoading[layer] = null;
        (subscribers.get(layer) || []).forEach(fn => fn(items));
        subscribers.delete(layer);
        return items;
      });
    window.__layerLoading[layer] = promise;
    return promise;
  }

  async function getAllSummaries() {
    const idx = await loadIndex();
    return idx.summaries;
  }

  async function getTerm(id) {
    const idx = await loadIndex();
    const summary = idx.summaries.find(s => s.id === id);
    if (!summary) return null;
    const items = await loadLayer(summary.layer);
    return items.find(t => t.id === id);
  }

  async function getAllTerms() {
    const all = [];
    for (const l of LAYERS) {
      const items = await loadLayer(l);
      all.push(...items);
    }
    return all;
  }

  // ---------- Related-terms algorithm ----------
  // Exposed on window so consumers (and tests) can call it directly.
  // Strategy: merge 4 signals
  //   1. manual `related` (weight 100)
  //   2. same layer + same category (weight 60)
  //   3. shared >=2 tags (weight = shared * 15)
  //   4. bidirectional reference (weight +40)
  function relatedAlgo(term, allTerms, minCount = 5, maxCount = 8) {
    const id = term.id;
    const related = new Map();
    const source = allTerms.filter(t => t.id !== id);

    (term.related || []).forEach(rid => related.set(rid, 100));

    source.forEach(t => {
      if (t.layer === term.layer && t.category === term.category) {
        related.set(t.id, Math.max(related.get(t.id) || 0, 60));
      }
    });

    const termTags = new Set(term.tags || []);
    source.forEach(t => {
      if (termTags.size === 0) return;
      const shared = (t.tags || []).filter(tg => termTags.has(tg)).length;
      if (shared >= 2) {
        related.set(t.id, Math.max(related.get(t.id) || 0, shared * 15));
      }
    });

    source.forEach(t => {
      if ((t.related || []).includes(id)) {
        related.set(t.id, (related.get(t.id) || 0) + 40);
      }
    });

    return [...related.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxCount)
      .map(([rid]) => rid);
  }

  // ---------- Round 1: auto-load from script tag ----------

  /**
   * Read data-layers attribute from <script src="js/terms-loader.js">,
   * fetch those layers in parallel, populate VC_TERMS + VC_DATA,
   * and dispatch vc-terms-ready event.
   * Idempotent: only runs once.
   */
  async function loadFromScriptTag() {
    if (window.__vcLoaderRan) return window.__vcLoaderRan;
    window.__vcLoaderRan = (async () => {
      const script = document.querySelector('script[data-layers]');
      const layersAttr = script?.dataset.layers || LAYERS.join(',');
      const layers = layersAttr.split(',').map(s => s.trim()).filter(Boolean);

      // Fetch in parallel
      const fetched = await Promise.all(layers.map(l => loadLayer(l)));
      const terms = fetched.flat();

      // Populate window.VC_TERMS
      window.VC_TERMS = terms;

      // Build VC_DATA in the same shape as legacy data.js
      window.VC_DATA = terms.map(t => ({
        id: t.id,
        name: t.name,
        zh: t.zh,
        layer: t.layer,
        desc: t.shortDesc,
        longDesc: t.shortDesc,
        url: `term.html?id=${t.id}`,
        tags: t.tags || [],
        category: t.category,
        related: t.related || []
      }));

      // Run related-algo enrichment
      terms.forEach(t => {
        if (!t.related || t.related.length < 5) {
          const merged = new Set(t.related || []);
          relatedAlgo(t, terms, 5, 8).forEach(rid => merged.add(rid));
          t.related = [...merged].slice(0, 8);
        }
      });

      // Notify all consumers waiting on this event
      document.dispatchEvent(new CustomEvent('vc-terms-ready', {
        detail: { terms, layers }
      }));
      return terms;
    })();
    return window.__vcLoaderRan;
  }

  /**
   * Helper for consumer scripts: run callback when VC_TERMS is ready.
   * If already ready, runs immediately. If not, waits for vc-terms-ready event.
   */
  function whenTermsReady(callback) {
    if (window.VC_TERMS && window.VC_TERMS.length > 0) {
      callback();
    } else {
      document.addEventListener('vc-terms-ready', () => callback(), { once: true });
    }
  }

  // ---------- Public API ----------
  window.VC_DATA_LOADER = {
    loadIndex,
    loadLayer,
    getAllSummaries,
    getTerm,
    getAllTerms,
    loadFromScriptTag,
    whenTermsReady,
    preloadLayer: (layer) => layerCache[layer] ? null : loadLayer(layer),
  };

  // Expose aliases for consumers + tests
  window.VC_WHEN_TERMS_READY = whenTermsReady;
  window.VC_RELATED_ALGO = relatedAlgo;

  // Auto-start on DOMContentLoaded only if a script tag opted in via data-layers
  if (document.querySelector('script[data-layers]')) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => loadFromScriptTag());
    } else {
      loadFromScriptTag();
    }
  }
})();
