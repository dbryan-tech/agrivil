import type { ReactNode } from 'react'
import { CartProvider } from '@/components/golden-acres/cart-context'
import { RecentlyViewedProvider } from '@/components/golden-acres/store/recently-viewed'
import { GaHeader } from '@/components/golden-acres/ga-header'
import { GaFooter } from '@/components/golden-acres/ga-footer'

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="ga-root min-h-screen bg-background text-foreground antialiased">
      <CartProvider>
        <RecentlyViewedProvider>
          <GaHeader />
          <main>{children}</main>
          <GaFooter />
        </RecentlyViewedProvider>
      </CartProvider>
    </div>
  )
}
