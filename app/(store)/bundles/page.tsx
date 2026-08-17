import type { Metadata } from 'next'
import { BundlesCatalog } from '@/components/golden-acres/bundles/bundles-catalog'

export const metadata: Metadata = {
  title: 'Bundles & Subscriptions — AgriVil',
  description:
    'Hand-packed produce boxes from Ghanaian farmers, delivered once or on repeat. Subscribe and save.',
}

export default function BundlesPage() {
  return <BundlesCatalog />
}
