const CACHE_NAME = 'instab-cache-v1';
const ASSETS = [
  '/InsTAB/',
  '/InsTAB/index.html',
  '/InsTAB/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/dexie/3.2.4/dexie.min.js'
];

// Instal·lació del Service Worker i desat de fitxers bàsics
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activació del Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Escuita de peticions (Obligatori per a que Chrome el consideri PWA)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
