// Offline cache for NOVAFit. The file keeps its old name, so apps already on a home screen keep their service worker.

const CACHE = "novafit-v65";
// Text recognition for run screenshots (a few MB, fixed version): own cache, so app updates don't download it again
const OCR_CACHE = "novafit-ocr-v1";
const FILES = ["./", "./index.html", "./exercises.js", "./plan.js", "./app.js", "./run.js", "./muscles.js", "./yoga.js", "./progress.js", "./tour.js", "./i18n.js", "./i18n-data.js", "./guide.js", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png", "./OneSignalSDKWorker.js", "./img/campus-1.svg", "./img/campus-2.svg", "./img/gym.svg", "./img/run.svg", "./img/yoga.svg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== OCR_CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  // Strava connection (Netlify Function): always live, never cached
  if (url.origin === location.origin && url.pathname.startsWith("/.netlify/")) return;
  // Own pages: network first (for updates), otherwise cache
  if (url.origin === location.origin) {
    e.respondWith(
      fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
        .catch(() => caches.match(e.request).then(r => r || caches.match("./index.html")))
    );
    return;
  }
  // Text recognition: cache first, so it works offline after the first screenshot
  if (url.host === "cdn.jsdelivr.net" && /tesseract/.test(url.pathname)) {
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => { if (r.ok || r.type === "opaque") { const copy = r.clone(); caches.open(OCR_CACHE).then(c => c.put(e.request, copy)); } return r; })));
    return;
  }
  // Fonts: cache first
  if (/fonts\.(googleapis|gstatic)\.com/.test(url.host)) {
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })));
  }
});
