const CACHE_NAME = 'meteo-cavanweb-v2'; // <-- Cambia versione (da v1 a v2) quando aggiorni l'app
const ASSETS_TO_CACHE = [
  './openwmap2.html',
  './manifest.json',
  './SfondoN2.png',
  './SfondoN-512.png'
];

// Fase di installazione: salva i file in cache
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Fase di attivazione: pulisce le vecchie cache salvate in precedenza
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Elimino la vecchia cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Gestione delle richieste: prende i file aggiornati dalla rete o dalla cache
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Se la rete risponde, aggiorna la cache al volo
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, response.clone());
          return response;
        });
      })
      .catch(() => {
        // Se sei offline, usa la versione in cache
        return caches.match(e.request);
      })
  );
});
