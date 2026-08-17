import type { Metadata } from 'next'
import { SellApplicationForm } from '@/components/golden-acres/sell/sell-application-form'

export const metadata: Metadata = {
  title: 'Sell on AgriVil — Partner as a Verified Farmer | AgriVil',
  description:
    'Join Ghana’s leading digital farm-to-door network. Get guaranteed 48-hour MoMo payouts, cold-chain transport support, and direct access to Accra buyers.',
  openGraph: {
    title: 'Sell on AgriVil — Direct Farm-to-Consumer Market Access',
    description:
      'Partner with AgriVil. Transparent pricing, reliable pickup, and fast Mobile Money settlement for Ghanaian farmers.',
  },
}

export default function SellPage() {
  return <SellApplicationForm />
}
