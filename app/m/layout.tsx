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
        <div className="relative min-h-dvh bg-[#F7F5F0] text-[#211A12] antialiased selection:bg-[#0B3B25]/20 selection:text-[#0B3B25] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="relative mx-auto min-h-dvh max-w-md bg-[#F7F5F0] shadow-2xl sm:border-x sm:border-[rgba(33,26,18,0.08)] overflow-x-hidden">
            {/* Unified Mobile Top Warm Gradient Backdrop for Status Bar & Safe Area */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(260px,45vh,380px)] z-0"
              style={{
                background:
                  'radial-gradient(130% 90% at 50% 0%, rgba(254, 215, 170, 0.45) 0%, rgba(253, 230, 210, 0.25) 40%, rgba(247, 245, 240, 0.6) 80%, rgba(247, 245, 240, 1) 100%)',
              }}
            />
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </div>
      </CompareProvider>
    </CartProvider>
  )
}

