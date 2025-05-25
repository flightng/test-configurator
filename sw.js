// Simple Service Worker for PWA functionality
const CACHE_NAME = 'fidelity-x-configurator-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Fetch event - for hash routing, we mainly serve the index.html for navigation requests
self.addEventListener('fetch', (event) => {
  // For navigation requests, always serve index.html (hash routing handles the rest)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html')
        .then((response) => {
          return response || fetch('./index.html');
        })
    );
    return;
  }

  // For other requests, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all clients immediately
  self.clients.claim();
}); 