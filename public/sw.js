// AgriVil Enterprise High-Speed Service Worker v2
// Multi-Tier Segregated Caching for Next.js, Web & Android Capacitor WebView

const STATIC_CACHE = 'agrivil-static-v2'
const IMAGE_CACHE = 'agrivil-images-v2'
const PAGE_CACHE = 'agrivil-pages-v2'
const DATA_CACHE = 'agrivil-data-v2'

const ALL_CACHES = [STATIC_CACHE, IMAGE_CACHE, PAGE_CACHE, DATA_CACHE]

// Pre-cached critical shells and high-frequency assets
const PRECACHE_STATIC = [
  '/',
  '/m',
  '/m/categories',
  '/m/shop',
  '/m/farmers',
  '/m/recipes',
  '/m/bundles',
  '/m/cart',
  '/m/orders',
  '/m/account',
  '/favicon.ico',
  '/icon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/agrivil-mark.svg',
  '/agrivil-logo.svg',
  '/manifest.webmanifest',
]

const PRECACHE_IMAGES = [
  '/golden-acres/produce/aromatic-rice.webp',
  '/golden-acres/produce/roma-tomatoes-1.webp',
  '/golden-acres/produce/sweet-pineapple-1.webp',
  '/golden-acres/produce/white-yam.webp',
  '/golden-acres/produce/scotch-bonnet.webp',
  '/golden-acres/produce/sweet-potato.webp',
  '/golden-acres/produce/fresh-maize.webp',
  '/golden-acres/bundle-box.webp',
  '/golden-acres/recipes/ghana-jollof.webp',
  '/golden-acres/farmers/auntie-ama.webp',
  '/golden-acres/farmers/kwame-mensah.webp',
]

// 1. Install Event: Cache critical shells & top assets immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(PRECACHE_STATIC).catch((err) => {
          console.warn('[AgriVil SW] Static pre-cache warning:', err)
        })
      }),
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.addAll(PRECACHE_IMAGES).catch((err) => {
          console.warn('[AgriVil SW] Image pre-cache warning:', err)
        })
      }),
    ]).then(() => self.skipWaiting())
  )
})

// 2. Activate Event: Clean old cache versions and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (!ALL_CACHES.includes(key)) {
            console.log('[AgriVil SW] Purging obsolete cache:', key)
            return caches.delete(key)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// 3. Fetch Handler: Strategy based on request type
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET, cross-origin non-CDN, and mutation APIs
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return
  }

  // Skip API mutations and auth endpoints
  if (url.pathname.startsWith('/api/auth') || url.pathname.startsWith('/api/paystack') || url.pathname.startsWith('/api/stripe')) {
    return
  }

  // A. STATIC ASSETS & NEXT.JS JS/CSS CHUNKS -> Cache First (Immutable)
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.ttf') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css')
  ) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request)
        if (cached) return cached

        try {
          const networkResponse = await fetch(request)
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone())
          }
          return networkResponse
        } catch {
          return cached || new Response('', { status: 503 })
        }
      })
    )
    return
  }

  // B. IMAGES & MEDIA -> Cache First with Network Fallback (Permanent Image Caching)
  if (
    url.pathname.startsWith('/golden-acres/') ||
    url.pathname.startsWith('/_next/image') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.avif') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico')
  ) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cached = await cache.match(request)
        if (cached) return cached

        try {
          const networkResponse = await fetch(request)
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone())
          }
          return networkResponse
        } catch {
          return cached || new Response('', { status: 404 })
        }
      })
    )
    return
  }

  // C. HTML PAGES & NEXT.JS RSC PAYLOADS -> Stale While Revalidate
  // Serves instant cached page on click, updates in background for zero-delay navigation
  if (
    request.mode === 'navigate' ||
    url.pathname.startsWith('/m') ||
    url.pathname === '/' ||
    url.searchParams.has('_rsc') ||
    request.headers.get('accept')?.includes('text/html') ||
    request.headers.get('accept')?.includes('text/x-component')
  ) {
    event.respondWith(
      caches.open(PAGE_CACHE).then(async (cache) => {
        const cached = await cache.match(request)

        const networkFetch = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone())
            }
            return networkResponse
          })
          .catch(() => cached)

        return cached || networkFetch
      })
    )
    return
  }

  // D. DEFAULT: Network with cache fallback
  event.respondWith(
    caches.open(DATA_CACHE).then(async (cache) => {
      try {
        const networkResponse = await fetch(request)
        if (networkResponse && networkResponse.status === 200) {
          cache.put(request, networkResponse.clone())
        }
        return networkResponse
      } catch {
        const cached = await cache.match(request)
        return cached || new Response('Offline', { status: 503 })
      }
    })
  )
})
