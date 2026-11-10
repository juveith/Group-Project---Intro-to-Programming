// Push (OneSignal) + Offline-Cache für NOVAFit
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// Zahl am App-Symbol: bei Trainings-Erinnerung und Nachfrage eine "1" setzen
self.addEventListener("push", e => {
  try{
    const t = e.data ? e.data.text() : "";
    if(/dein Training!|schon trainiert/.test(t) && self.navigator && self.navigator.setAppBadge){
      e.waitUntil(self.navigator.setAppBadge(1).catch(() => {}));
    }
  }catch(_){}
});

const CACHE = "novafit-v2";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png", "./OneSignalSDKWorker.js", "./img/campus-1.svg", "./img/campus-2.svg", "./img/gym.svg", "./img/run.svg", "./img/yoga.svg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  // Eigene Seite: erst Netz (für Updates), sonst Cache
  if (url.origin === location.origin) {
    e.respondWith(
      fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
        .catch(() => caches.match(e.request).then(r => r || caches.match("./index.html")))
    );
    return;
  }
  // Schriften: Cache zuerst
  if (/fonts\.(googleapis|gstatic)\.com/.test(url.host)) {
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })));
  }
});
