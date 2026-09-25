const CACHE_NAME = "bizia-v1";
const STATIC_ASSETS = [
  "/",
  "/logo.svg",
  "/manifest.webmanifest",
  "/offline.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  // Pour les requêtes d'API, essayer le réseau d'abord
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ error: "offline", message: "Vous êtes actuellement hors ligne." }),
          { headers: { "Content-Type": "application/json" } }
        );
      })
    );
    return;
  }

  // Pour les pages et assets, Network First avec fallback sur le cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && response.type === "basic") {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          if (event.request.mode === "navigate") {
            return caches.match("/offline.html");
          }
          return new Response("Hors ligne", { status: 503, statusText: "Service Unavailable" });
        });
      })
  );
});
