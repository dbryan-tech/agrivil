// AgriVil High-Performance Service Worker for Web & Mobile APK
const CACHE_NAME = 'agrivil-v1'
const STATIC_ASSETS = [
  '/',
  '/m',
  '/m/categories',
  '/m/orders',
  '/m/cart',
  '/m/account',
  '/favicon.ico',
  '/icon.png',
  '/agrivil-mark.svg',
  '/agrivil-logo.svg',
  '/manifest.webmanifest',
]

// Install Event: Pre-cache critical shells & assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[AgriVil SW] Pre-cache non-fatal error:', err)
      })
    })
  )
  self.skipWaiting()
})

// Activate Event: Clean up stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch Event: Stale-While-Revalidate for images & pages, Cache-First for hashed assets
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // 1. Skip non-GET requests, chrome-extension, and API endpoints
  if (request.method !== 'GET' || !url.protocol.startsWith('http') || url.pathname.startsWith('/api/')) {
    return
  }

  // 2. Cache-First for Next.js immutable static chunks & fonts (_next/static, fonts.gstatic.com)
  if (url.pathname.startsWith('/_next/static/') || url.hostname.includes('fonts.gstatic') || url.pathname.endsWith('.woff2') || url.pathname.endsWith('.woff')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse
          return fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone())
            }
            return networkResponse
          })
        })
      })
    )
    return
  }

  // 3. Stale-While-Revalidate for images, icons, and pages
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone())
            }
            return networkResponse
          })
          .catch(() => cachedResponse)

        return cachedResponse || fetchPromise
      })
    })
  )
})
