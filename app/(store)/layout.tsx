import type { ReactNode } from 'react'
import { CartProvider } from '@/components/golden-acres/cart-context'
import { CompareProvider } from '@/components/golden-acres/compare/compare-context'
import { RecentlyViewedProvider } from '@/components/golden-acres/store/recently-viewed'
import { MiniCart } from '@/components/golden-acres/cart/mini-cart'
import { CompareTray } from '@/components/golden-acres/compare/compare-tray'
import { CommandPalette } from '@/components/golden-acres/command-palette'
import { MobileTabBar } from '@/components/golden-acres/mobile-tab-bar'
import { SiteHeader } from '@/components/golden-acres/system/site-header'
import { SiteFooter } from '@/components/golden-acres/system/site-footer'

/**
 * Store layout (redesigned, docs/redesign/01 §3.7).
 * - SiteHeader/SiteFooter: the new frosted header + forest-green footer.
 *   The old three-tier GaHeader/AnnouncementBar stack is retired for web.
 * - Data providers, mini-cart, compare tray, command palette and the mobile
 *   tab bar are unchanged — same contracts, new chrome.
 */
export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="ga-root min-h-screen bg-background text-foreground antialiased">
      <CartProvider>
        <CompareProvider>
          <RecentlyViewedProvider>
            <SiteHeader />
            <main className="pb-16 lg:pb-0">{children}</main>
            <SiteFooter />
            <MiniCart />
            <CompareTray />
            <CommandPalette />
            <MobileTabBar />
          </RecentlyViewedProvider>
        </CompareProvider>
      </CartProvider>
    </div>
  )
}
