import type { Metadata } from 'next'
import { BundlesCatalog } from '@/components/golden-acres/bundles/bundles-catalog'

export const metadata: Metadata = {
  title: 'Curated Produce Boxes & Subscriptions | AgriVil',
  description:
    'Hand-packed fresh harvest boxes delivered weekly or on-demand. Weekly Staples, Organic Greens, Jollof Kits, and Seasonal Fruit boxes.',
  openGraph: {
    title: 'Curated Produce Boxes & Subscriptions | AgriVil',
    description:
      'Hand-packed fresh harvest boxes from local Ghanaian farms, delivered once or on recurring schedule.',
  },
}

export default function BundlesPage() {
  return <BundlesCatalog />
}
