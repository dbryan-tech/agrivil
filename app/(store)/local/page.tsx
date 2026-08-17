import type { Metadata } from 'next'
import { ShopLocal } from '@/components/golden-acres/local/shop-local'

export const metadata: Metadata = {
  title: 'Shop Local — Proximity Matching by GhanaPostGPS | AgriVil',
  description:
    'Find the closest Ghanaian farmers to your digital address. Calculate exact delivery fees, discover local farms within your radius, and support nearby growers.',
  openGraph: {
    title: 'Shop Local — Farm-to-Hub Proximity Matching | AgriVil',
    description:
      'Enter your GhanaPostGPS code to find fresh produce grown closest to your kitchen.',
  },
}

export default function LocalPage() {
  return <ShopLocal />
}
