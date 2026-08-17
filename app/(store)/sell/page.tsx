import type { Metadata } from 'next'
import { SellApplicationForm } from '@/components/golden-acres/sell/sell-application-form'

export const metadata: Metadata = {
  title: 'Sell on AgriVil — Become a verified farmer',
  description:
    'Apply to sell your fresh produce on AgriVil, Ghana’s farm-to-door marketplace. Reach local buyers, get fast MoMo payouts, and earn a verified seller badge.',
}

export default function SellPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <SellApplicationForm />
    </div>
  )
}
