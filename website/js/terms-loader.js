// Vibe Coding Wiki · Asynchronous term loader
// Loads index first, then loads specific layer JSON on demand.
// Maintains backward compatibility with VC_TERMS API.

(function() {
  'use strict';

  const DATA_PATH = (() => {
    // Detect if we're in /pages/ subdirectory
    const path = location.pathname;
    return path.includes('/pages/') ? '../data/' : 'data/';
  })();

  // Cache for loaded layers
  const layerCache = {};
  const subscribers = new Map();

  // 1. Load index (small, ~56KB)
  async function loadIndex() {
    if (window.VC_TERMS_INDEX) return window.VC_TERMS_INDEX;
    const res = await fetch(DATA_PATH + 'terms-index.json');
    window.VC_TERMS_INDEX = await res.json();
    return window.VC_TERMS_INDEX;
  }

  // 2. Load a single layer
  async function loadLayer(layer) {
    if (layerCache[layer]) return layerCache[layer];
    if (window.__layerLoading[layer]) return window.__layerLoading[layer];

    const promise = fetch(DATA_PATH + `terms-${layer}.json`)
      .then(r => r.json())
      .then(items => {
        layerCache[layer] = items;
        window.__layerLoading[layer] = null;
        // Notify
        (subscribers.get(layer) || []).forEach(fn => fn(items));
        subscribers.delete(layer);
        return items;
      });
    window.__layerLoading[layer] = promise;
    return promise;
  }

  // 3. Get all summaries (for search, glossary, etc.)
  async function getAllSummaries() {
    const idx = await loadIndex();
    return idx.summaries;
  }

  // 4. Get specific term (loads its layer first)
  async function getTerm(id) {
    const idx = await loadIndex();
    const summary = idx.summaries.find(s => s.id === id);
    if (!summary) return null;
    const layer = summary.layer;
    const items = await loadLayer(layer);
    return items.find(t => t.id === id);
  }

  // 5. Get all terms (loads all layers - heavy, use sparingly)
  async function getAllTerms() {
    const layers = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'];
    const all = [];
    for (const l of layers) {
      const items = await loadLayer(l);
      all.push(...items);
    }
    return all;
  }

  // 6. Lazily pre-load only what's needed
  async function preloadLayer(layer) {
    if (layerCache[layer]) return;
    return loadLayer(layer);
  }

  window.__layerLoading = window.__layerLoading || {};

  // Public API
  window.VC_DATA_LOADER = {
    loadIndex,
    loadLayer,
    getAllSummaries,
    getTerm,
    getAllTerms,
    preloadLayer,
  };

  // Backward compat: legacy VC_TERMS still loads synchronously via terms.js
  // But new code can use async loader instead.
})();
