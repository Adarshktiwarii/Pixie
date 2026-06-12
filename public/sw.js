const CACHE_NAME = 'pixie-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Simple network-first caching strategy for basic offline support
  // This satisfies the PWA install criteria on Android devices.
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Don't cache API calls or anything but GET requests
        if (event.request.method !== 'GET') {
          return response;
        }
        
        // Clone the response and cache it
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
