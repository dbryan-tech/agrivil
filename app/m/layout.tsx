import type { Metadata, Viewport } from 'next'
import { CartProvider } from '@/components/golden-acres/cart-context'
import { CompareProvider } from '@/components/golden-acres/compare/compare-context'

export const metadata: Metadata = {
  title: 'AgriVil Mobile — Fresh Harvest Ghana',
  description: "Ghana's mobile virtual farmers' market. Farm-to-door fresh produce delivered to your door.",
  applicationName: 'AgriVil',
  manifest: '/manifest.webmanifest',
}

export const viewport: Viewport = {
  themeColor: '#0F7A43',
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
        <div className="min-h-dvh bg-[#FAF7F0] text-[#2B1F17] antialiased selection:bg-[#0F7A43]/20 selection:text-[#0F7A43]">
          <div className="mx-auto min-h-dvh max-w-md bg-[#FAF7F0] shadow-2xl sm:border-x sm:border-[#E0DACB]">
            {children}
          </div>
        </div>
      </CompareProvider>
    </CartProvider>
  )
}
