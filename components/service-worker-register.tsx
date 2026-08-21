'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            // Check for updates periodically
            reg.addEventListener('updatefound', () => {
              const installingWorker = reg.installing
              if (installingWorker) {
                installingWorker.addEventListener('statechange', () => {
                  if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('[AgriVil] New content available, cached for speed.')
                  }
                })
              }
            })
          })
          .catch((err) => {
            console.warn('[AgriVil] SW registration error:', err)
          })
      })
    }
  }, [])

  return null
}
