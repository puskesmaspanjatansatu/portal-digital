const CACHE = 'portal-v1';

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  './icon-192.png',
  './icon-512.png',
  './sigap/',
  './sigap/index.html',
  './pamanpanji/',
  './pamanpanji/index.html',
  './eJadwal/',
  './eJadwal/index.html',
  './SapaPanji/',
  './SapaPanji/index.html'
];

/* Install — pre-cache shell */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

/* Activate — hapus cache lama */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* Fetch — network-first, fallback cache */
self.addEventListener('fetch', e => {

  /* Lewati request non-GET dan cross-origin (GAS iframe dll) */
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        /* Simpan salinan ke cache jika respons valid */
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
