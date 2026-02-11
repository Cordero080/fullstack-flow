// Service Worker for NUMENEON PWA
const CACHE_NAME = "numeneon-v1";

// Assets to cache on install
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192x192.svg",
  "/icons/icon-512x512.svg",
];

// ==================== PUSH NOTIFICATIONS & BADGING ====================

// Handle push notifications (from server)
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  const title = data.title || "NUMENEON";
  const options = {
    body: data.body || "You have a new notification",
    icon: "/icons/icon-192x192.svg",
    badge: "/icons/icon-72x72.svg",
    tag: data.tag || "numeneon-notification",
    data: data.url || "/",
    vibrate: [100, 50, 100],
  };

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options),
      // Update badge count
      updateBadge(data.unreadCount),
    ]),
  );
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // If app is already open, focus it
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            return client.focus();
          }
        }
        // Otherwise open new window
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data || "/");
        }
      }),
  );
});

// Update app badge count
async function updateBadge(count) {
  if ("setAppBadge" in navigator) {
    try {
      if (count > 0) {
        await navigator.setAppBadge(count);
      } else {
        await navigator.clearAppBadge();
      }
    } catch (err) {
      console.log("Badge update failed:", err);
    }
  }
}

// Listen for messages from the main app to update badge
self.addEventListener("message", (event) => {
  if (event.data?.type === "UPDATE_BADGE") {
    updateBadge(event.data.count);
  }
  if (event.data?.type === "CLEAR_BADGE") {
    updateBadge(0);
  }
});

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("📦 Caching static assets");
      return cache.addAll(STATIC_ASSETS);
    }),
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name)),
      );
    }),
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  // Skip API calls - always go to network
  if (event.request.url.includes("/api/")) return;

  // Skip WebSocket connections
  if (event.request.url.includes("/ws/")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response before caching
        const responseClone = response.clone();

        // Cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }

        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // If HTML request, return cached index.html for SPA routing
          if (event.request.headers.get("accept")?.includes("text/html")) {
            return caches.match("/index.html");
          }

          return new Response("Offline", { status: 503 });
        });
      }),
  );
});
