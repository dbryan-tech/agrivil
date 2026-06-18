import type { Metadata } from 'next'
import { ShopLocal } from '@/components/golden-acres/local/shop-local'

export const metadata: Metadata = {
  title: 'Shop Local — AgriVil',
  description:
    'Enter your GhanaPostGPS address to discover the farms closest to you for fresher produce and lower delivery fees.',
}

export default function LocalPage() {
  return <ShopLocal />
}
