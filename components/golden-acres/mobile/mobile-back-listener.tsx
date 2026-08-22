'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

/**
 * MobileBackListener
 * Handles on-device hardware/gesture back navigation for Android/iOS APK wrappers,
 * Capacitor/Cordova containers, and progressive web app environments.
 */
export function MobileBackListener() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    function handleBackAction() {
      // 1. Check if any modal, drawer, or dialog is currently open
      const openModal = document.querySelector(
        '[data-modal-open="true"], [role="dialog"], .fixed.inset-0.z-50'
      )
      if (openModal) {
        const closeBtn = openModal.querySelector<HTMLButtonElement>(
          '[data-modal-close="true"], [aria-label="Close"], [aria-label="Back"]'
        )
        if (closeBtn) {
          closeBtn.click()
          return true
        }
      }

      // 2. If not on root mobile page (/m or /m/splash), navigate back
      if (pathname && pathname !== '/m' && pathname !== '/m/splash') {
        if (window.history.length > 1) {
          router.back()
        } else {
          router.push('/m')
        }
        return true
      }

      return false
    }

    // 1. Android hardware backbutton event (Cordova / Capacitor bridge)
    function handleHardwareBack(e: Event) {
      e.preventDefault()
      handleBackAction()
    }

    // 2. Standard popstate listener for web history
    function handlePopState() {
      const openModal = document.querySelector(
        '[data-modal-open="true"], [role="dialog"]'
      )
      if (openModal) {
        const closeBtn = openModal.querySelector<HTMLButtonElement>(
          '[data-modal-close="true"], [aria-label="Close"]'
        )
        if (closeBtn) {
          closeBtn.click()
        }
      }
    }

    // 3. Expose global bridge for native Android WebView evaluation
    ;(window as unknown as Record<string, unknown>).onBackPressed = () => {
      return handleBackAction()
    }
    ;(window as unknown as Record<string, unknown>).__agrivilBack = () => {
      return handleBackAction()
    }

    // 4. Capacitor App plugin listener if available
    type CapacitorPlugin = {
      addListener?: (
        event: string,
        cb: (payload: { canGoBack: boolean }) => void,
      ) => Promise<{ remove: () => void }>
    }
    let capacitorListener: { remove: () => void } | null = null
    const capApp = (
      window as unknown as {
        Capacitor?: { Plugins?: { App?: CapacitorPlugin } }
      }
    ).Capacitor?.Plugins?.App
    if (capApp && typeof capApp.addListener === 'function') {
      capApp.addListener('backButton', ({ canGoBack }: { canGoBack: boolean }) => {
        const handled = handleBackAction()
        if (!handled && canGoBack) {
          window.history.back()
        }
      }).then((handle) => {
        capacitorListener = handle
      }).catch(() => {})
    }

    // Attach listeners
    document.addEventListener('backbutton', handleHardwareBack, false)
    window.addEventListener('popstate', handlePopState)

    return () => {
      document.removeEventListener('backbutton', handleHardwareBack, false)
      window.removeEventListener('popstate', handlePopState)
      if (capacitorListener && typeof capacitorListener.remove === 'function') {
        capacitorListener.remove()
      }
    }
  }, [pathname, router])

  return null
}
