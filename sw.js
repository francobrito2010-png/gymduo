/* GymDuo — Service Worker (offline con caché). */
const CACHE = 'gymduo-v5'
const ASSETS = [
  './', './index.html', './styles.css',
  './firebase.js', './exercises.js', './geometry.js', './eximg.js', './plan.js', './sync.js', './app.js',
  './manifest.webmanifest', './icon.svg',
  './icon-192.png', './icon-512.png', './icon-180.png'
]

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', e => {
  const req = e.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  // No cachear Firebase/Firestore: siempre red (sincroniza al reconectar)
  if (url.hostname.includes('googleapis.com') || url.hostname.includes('gstatic.com')) return
  // Assets locales: cache-first; navegación: red con fallback a caché
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone()
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {})
      return res
    }).catch(() => caches.match('./index.html')))
  )
})
