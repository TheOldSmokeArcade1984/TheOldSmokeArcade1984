const CACHE_NAME = 'oldsmoke-os-v10.0';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest-v3.json',
    './icon-192.png',
    './icon-256.png',
    './icon-512.png',
    './VT323-Regular.woff2'
];

// Installazione e salvataggio in cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('[SW v10.0] Caching asset principali');
            return cache.addAll(ASSETS_TO_CACHE);
        })
        .then(() => self.skipWaiting())
    );
});

// Pulizia cache vecchie (elimina versioni precedenti 6.x)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[SW v10.0] Eliminazione vecchia cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Ascolto messaggi per aggiornamento manuale dall'interfaccia OS
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Intercettazione richieste (Strategia: Network First con Fallback Cache)
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