import type { Metadata, Viewport } from 'next'
import { CartProvider } from '@/components/golden-acres/cart-context'
import { CompareProvider } from '@/components/golden-acres/compare/compare-context'
import { MobileBackListener } from '@/components/golden-acres/mobile/mobile-back-listener'

export const metadata: Metadata = {
  title: 'AgriVil Mobile — Fresh Harvest Ghana',
  description: "Ghana's mobile virtual farmers' market. Farm-to-door fresh produce delivered to your door.",
  applicationName: 'AgriVil',
  manifest: '/manifest.webmanifest',
}

export const viewport: Viewport = {
  themeColor: '#0B3B25',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function MobileAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      <CompareProvider>
        <MobileBackListener />
        <div className="min-h-dvh bg-[#F7F5F0] text-[#211A12] antialiased selection:bg-[#0B3B25]/20 selection:text-[#0B3B25] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="mx-auto min-h-dvh max-w-md bg-[#F7F5F0] shadow-2xl sm:border-x sm:border-[rgba(33,26,18,0.08)]">
            {children}
          </div>
        </div>
      </CompareProvider>
    </CartProvider>
  )
}

