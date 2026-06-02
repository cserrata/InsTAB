const CACHE_NAME = 'caa-comunicador-v1';
const ASSETS = [
'./',
'./index.html',
'./manifest.json',
'./dexie.min.js',
'./icon.png'
];
// Instal·lació del Service Worker i emmagatzematge dels fitxers base
self.addEventListener('install', (e) => {
e.waitUntil(
caches.open(CACHE_NAME).then((cache) => {
return cache.addAll(ASSETS);
}).then(() => self.skipWaiting())
);
});
// Activació i neteja de memòries cau antigues
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
// Intercepció de peticions per funcionar offline
self.addEventListener('fetch', (e) => {
e.respondWith(
caches.match(e.request).then((cachedResponse) => {
return cachedResponse || fetch(e.request);
})
);
});