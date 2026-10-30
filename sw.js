self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('meteo-realtime-v1').then((cache) => {
      return cache.addAll([
        './openwmap2.html',
        './SfondoN-512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
