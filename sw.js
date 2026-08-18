// ReadBuddy Service Worker — enables offline use & installability (PWA)
const CACHE_NAME = 'readbuddy-v3';
const ASSETS = ['./', './index.html', './style.css', './app.js', './manifest.json'];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(names => Promise.all(names.map(n => n !== CACHE_NAME ? caches.delete(n) : null)))
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  // Network-first for same-origin, cache fallback
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(response => {
      const clone = response.clone();
      caches.open(CACHE_NAME).then(cache => { try { cache.put(e.request, clone); } catch(e) {} });
      return response;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
