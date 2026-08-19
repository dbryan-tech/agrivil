'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

/**
 * MobileBackListener
 * Handles on-device hardware/gesture back navigation for Android/iOS APK wrappers,
 * WebView containers, and progressive web app environments.
 */
export function MobileBackListener() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // 1. Android hardware backbutton event (Capacitor, Cordova, WebView bridge)
    function handleHardwareBack(e: Event) {
      e.preventDefault()

      // Check if any modal or drawer is currently open
      const openModal = document.querySelector('[data-modal-open="true"]')
      if (openModal) {
        const closeBtn = openModal.querySelector<HTMLButtonElement>('[data-modal-close="true"], [aria-label="Close"]')
        if (closeBtn) {
          closeBtn.click()
          return
        }
      }

      // If not on root mobile page (/m), navigate back
      if (pathname && pathname !== '/m') {
        if (window.history.length > 1) {
          router.back()
        } else {
          router.push('/m')
        }
      }
    }

    // 2. Standard popstate listener for web history
    function handlePopState() {
      const openModal = document.querySelector('[data-modal-open="true"]')
      if (openModal) {
        const closeBtn = openModal.querySelector<HTMLButtonElement>('[data-modal-close="true"], [aria-label="Close"]')
        if (closeBtn) {
          closeBtn.click()
        }
      }
    }

    // Attach listeners
    document.addEventListener('backbutton', handleHardwareBack, false)
    window.addEventListener('popstate', handlePopState)

    return () => {
      document.removeEventListener('backbutton', handleHardwareBack, false)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [pathname, router])

  return null
}
