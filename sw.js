const CACHE_NAME = 'instab-cache-v2-neteja';
const ASSETS = [
'./',
'./index.html',
'./manifest.json',
'./dexie.min.js',
'./icon.png'
];

// Instal·lació i forçat d'actualització immediata
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Neteja radical de memòries cau antigues per evitar bloquejos de base de dades
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercepció de peticions de xarxa
self.addEventListener('fetch', (e) => {
  // Si la petició és per a l'API d'ARASAAC, no la guardis a la memòria cau local de l'App (necessita internet real)
  if (e.request.url.includes('arasaac.org')) {
    return fetch(e.request);
  }
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
