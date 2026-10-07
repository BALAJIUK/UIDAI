// PART 3 — Offline PWA support.
// Strategy for GET /api/credentials: network-first, cache the latest
// response, fall back to cache when offline, then to a safe fallback.
// Only GET requests are handled. Identity-related responses are cached
// on-device only; see README section "Security considerations".

const API_CACHE = 'credentials-api-v1'
const OFFLINE_FALLBACK = JSON.stringify([])

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(caches.open(API_CACHE))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== API_CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return // never cache mutations

  const url = new URL(request.url)
  if (url.pathname !== '/api/credentials') return

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone()
          caches.open(API_CACHE).then((cache) => cache.put(request, copy))
        }
        return response
      })
      .catch(async () => {
        const cached = await caches.match(request)
        if (cached) return cached
        return new Response(OFFLINE_FALLBACK, {
          status: 200,
          headers: { 'Content-Type': 'application/json', 'X-Offline-Fallback': 'true' },
        })
      }),
  )
})
