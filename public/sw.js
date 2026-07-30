self.options = {
    "domain": "3nbf4.com",
    "zoneId": 11456131
}
self.lary = ""

try {
  importScripts('https://3nbf4.com/act/files/service-worker.min.js?r=sw')
} catch (error) {
  console.warn('Could not load external SW script:', error)
}

// PWA Logic to satisfy PWABuilder
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response('Network error occurred.', {
        status: 408,
        headers: { 'Content-Type': 'text/plain' },
      });
    })
  );
});
