import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Farmer Portal — AgriVil',
  description:
    'Mobile-first inventory sync, low-bandwidth produce uploads, and 48-hour guaranteed payouts for AgriVil farmers.',
}

export default function FarmerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="ga-root min-h-screen bg-background text-foreground antialiased">
      {children}
    </div>
  )
}
