const CACHE_NAME = "jeeplink-v2-offline";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./css/main.css",
  "./assets/images/branding/favicon.png",
  "./assets/vendor/leaflet.css",
  "./assets/vendor/leaflet.js",
  "./assets/vendor/phosphor.css",
];

// Install Event: Downloads files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Fetch Event: Serve from Cache if Offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
