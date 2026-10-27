
/* Gita AI service worker — offline shell only. API calls always hit the network. */

const CACHE = "gita-shell-v4";

const SHELL = [
  "/",
  "/icon-512.png",
  "/gita-portrait.jpg",
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("gita-shell-") && key !== CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // API requests must always use the network.
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();

            event.waitUntil(
              caches
                .open(CACHE)
                .then((cache) => cache.put(request, copy))
                .catch(() => {})
            );
          }

          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;

          return (
            (await caches.match("/")) ||
            new Response(
              "You are offline. Please reconnect and try again.",
              {
                status: 503,
                headers: { "Content-Type": "text/plain; charset=utf-8" },
              }
            )
          );
        })
    );

    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();

          event.waitUntil(
            caches
              .open(CACHE)
              .then((cache) => cache.put(request, copy))
              .catch(() => {})
          );
        }

        return response;
      });
    })
  );
});
