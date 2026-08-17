import type { ReactNode } from 'react'
import { CartProvider } from '@/components/golden-acres/cart-context'
import { CompareProvider } from '@/components/golden-acres/compare/compare-context'
import { RecentlyViewedProvider } from '@/components/golden-acres/store/recently-viewed'
import { MiniCart } from '@/components/golden-acres/cart/mini-cart'
import { CompareTray } from '@/components/golden-acres/compare/compare-tray'
import { CommandPalette } from '@/components/golden-acres/command-palette'
import { MobileTabBar } from '@/components/golden-acres/mobile-tab-bar'
import { AnnouncementBar } from '@/components/golden-acres/announcement-bar'
import { GaHeader } from '@/components/golden-acres/ga-header'
import { GaFooter } from '@/components/golden-acres/ga-footer'

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="ga-root min-h-screen bg-background text-foreground antialiased">
      <CartProvider>
        <CompareProvider>
          <RecentlyViewedProvider>
            <AnnouncementBar />
            <GaHeader />
            <main className="pb-16 lg:pb-0">{children}</main>
            <GaFooter />
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
