// Typo Studio service worker: app werkt ook offline
const VERSION = "typo-v54";
const SHELL = ["/", "/fonts/fonts.css", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png", "/icons/apple-touch-icon.png",
  "/img/bg-sunset.jpg", "/img/bg-pier.jpg", "/img/th-sunset.jpg", "/img/th-pier.jpg", "/img/bg-xmas.jpg", "/img/th-xmas.jpg", "/img/bg-pool.jpg", "/img/th-pool.jpg", "/img/bg-golden.jpg", "/img/th-golden.jpg", "/img/bg-agave.jpg", "/img/th-agave.jpg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== "typo-fonts").map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  // Google Fonts: eerst cache, anders netwerk (en bewaren)
  if (url.host === "fonts.googleapis.com" || url.host === "fonts.gstatic.com") {
    e.respondWith(caches.open("typo-fonts").then(async c => {
      const hit = await c.match(e.request); if (hit) return hit;
      const res = await fetch(e.request); if (res.ok || res.type === "opaque") c.put(e.request, res.clone()); return res;
    }));
    return;
  }
  if (url.origin !== location.origin) return;
  // pagina: eerst netwerk (nieuwste versie), offline uit cache
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).then(res => { caches.open(VERSION).then(c => c.put("/", res.clone())); return res; }).catch(() => caches.match("/")));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => { if (res.ok && /^\/(fonts|img|icons)\//.test(url.pathname)) { const c = res.clone(); caches.open(VERSION).then(x => x.put(e.request, c)); } return res; })));
});
