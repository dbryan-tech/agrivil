import type { ReactNode } from 'react'
import { AnnouncementBar } from '@/components/golden-acres/announcement-bar'
import { GaHeader } from '@/components/golden-acres/ga-header'
import { GaFooter } from '@/components/golden-acres/ga-footer'
import { CartProvider } from '@/components/golden-acres/cart-context'
import { MiniCart } from '@/components/golden-acres/cart/mini-cart'
import { CompareProvider } from '@/components/golden-acres/compare/compare-context'
import { CompareTray } from '@/components/golden-acres/compare/compare-tray'
import { CommandPalette } from '@/components/golden-acres/command-palette'
import { MobileTabBar } from '@/components/golden-acres/mobile-tab-bar'

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <CompareProvider>
        <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary pb-16 lg:pb-0">
          <AnnouncementBar />
          <GaHeader />
          <main className="flex-1">{children}</main>
          <GaFooter />
          <MiniCart />
          <CompareTray />
          <CommandPalette />
          <MobileTabBar />
        </div>
      </CompareProvider>
    </CartProvider>
  )
}
