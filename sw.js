const CACHE_NAME = 'oldsmoke-os-v6.13';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest-v3.json',
    './icon-192.png',
    './icon-256.png',
    './icon-512.png'
];

// Installazione e salvataggio in cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('[SW v6.13] Caching asset principali');
            return cache.addAll(ASSETS_TO_CACHE);
        })
        .then(() => self.skipWaiting())
    );
});

// Pulizia cache vecchie (rimuoverà in automatico v6.12 e precedenti)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[SW v6.13] Eliminazione vecchia cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Intercettazione richieste (Strategia: Network First, Fallback to Cache)
self.addEventListener('fetch', (event) => {
    if (!event.request.url.startsWith(self.location.origin)) {
        return; 
    }

    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});