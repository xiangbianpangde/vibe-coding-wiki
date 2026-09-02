// Vibe Coding Wiki · Service Worker (Round 2)
// Strategy: cache-first for static assets, network-first for HTML/data
// Goal: instant repeat visits, offline-first experience

const CACHE_VERSION = 'vc-wiki-v3.0.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DATA_CACHE = `${CACHE_VERSION}-data`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

// Static assets to precache on install
const PRECACHE_URLS = [
  '/vibe-coding-wiki/',
  '/vibe-coding-wiki/index.html',
  '/vibe-coding-wiki/term.html',
  '/vibe-coding-wiki/favicon.svg',
  '/vibe-coding-wiki/og-image.svg',
  '/vibe-coding-wiki/css/style.css',
  '/vibe-coding-wiki/css/dark.css',
  '/vibe-coding-wiki/css/components.css',
  '/vibe-coding-wiki/css/home.css',
  '/vibe-coding-wiki/css/term.css',
  '/vibe-coding-wiki/css/glossary.css',
  '/vibe-coding-wiki/css/compare.css',
  '/vibe-coding-wiki/css/stats.css',
  '/vibe-coding-wiki/js/terms.js',
  '/vibe-coding-wiki/js/data.js',
  '/vibe-coding-wiki/js/term.js',
  '/vibe-coding-wiki/js/search.js',
  '/vibe-coding-wiki/js/app.js',
  '/vibe-coding-wiki/js/home.js',
  '/vibe-coding-wiki/js/theme.js',
  '/vibe-coding-wiki/js/nav.js',
  // Data index
  '/vibe-coding-wiki/data/terms-index.json',
];

// Install: precache static assets
self.addEventListener('install', event => {
  console.log('[SW] Installing', CACHE_VERSION);
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS).catch(err => {
        console.warn('[SW] Some assets failed to precache:', err);
      }))
      .then(() => self.skipWaiting())
  );
});

// Activate: cleanup old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating', CACHE_VERSION);
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => !key.startsWith(CACHE_VERSION))
          .map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

// Fetch: cache-first for static, network-first for HTML/data
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Strategy by file type
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request));
  } else if (isDataLayer(url.pathname)) {
    event.respondWith(networkFirstWithCache(request, DATA_CACHE));
  } else if (isPage(url.pathname)) {
    event.respondWith(networkFirstWithCache(request, RUNTIME_CACHE));
  } else {
    event.respondWith(networkFirstWithCache(request, RUNTIME_CACHE));
  }
});

// === Strategies ===

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    // Offline fallback for HTML
    if (request.headers.get('accept').includes('text/html')) {
      return caches.match('/vibe-coding-wiki/index.html');
    }
    throw err;
  }
}

async function networkFirstWithCache(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) {
      console.log('[SW] Network failed, serving from cache:', request.url);
      return cached;
    }
    // Offline fallback
    if (request.headers.get('accept').includes('text/html')) {
      return caches.match('/vibe-coding-wiki/index.html');
    }
    throw err;
  }
}

// === Helpers ===

function isStaticAsset(pathname) {
  return /\.(css|js|svg|png|jpg|jpeg|gif|woff2|woff|ttf|eot)$/.test(pathname);
}

function isDataLayer(pathname) {
  return pathname.startsWith('/vibe-coding-wiki/data/');
}

function isPage(pathname) {
  return pathname.endsWith('.html') || pathname.endsWith('/');
}

// === Message handling ===

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data?.type === 'CLEAR_CACHE') {
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => event.ports[0]?.postMessage({ cleared: true }));
  }
  if (event.data?.type === 'CACHE_STATS') {
    caches.keys().then(async keys => {
      const stats = {};
      for (const key of keys) {
        const cache = await caches.open(key);
        const keys = await cache.keys();
        stats[key] = keys.length;
      }
      event.ports[0]?.postMessage({ stats });
    });
  }
});

// Periodic background sync (clean up old responses)
self.addEventListener('periodicsync', event => {
  if (event.tag === 'cleanup-caches') {
    event.waitUntil(cleanupOldCaches());
  }
});

async function cleanupOldCaches() {
  const allKeys = await caches.keys();
  for (const key of allKeys) {
    if (!key.startsWith(CACHE_VERSION)) {
      await caches.delete(key);
    }
  }
}

console.log('[SW] Service worker loaded:', CACHE_VERSION);
