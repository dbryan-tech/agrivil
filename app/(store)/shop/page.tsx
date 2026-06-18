import { Suspense } from 'react'
import { ShopCatalog } from '@/components/golden-acres/shop/shop-catalog'

export const metadata = {
  title: 'Shop Fresh Produce — AgriVil',
  description:
    "Browse today's harvest from Ghana's local farmers. Fresh vegetables, fruits, roots, and greens, priced by weight and delivered cold.",
}

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopCatalog />
    </Suspense>
  )
}
