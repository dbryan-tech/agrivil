import { Suspense } from 'react'
import { ShopCatalog } from '@/components/golden-acres/shop/shop-catalog'
import { RecentlyViewedRail } from '@/components/golden-acres/shop/recently-viewed-rail'

export const metadata = {
  title: 'Shop Fresh Produce — AgriVil',
  description:
    "Browse today's harvest from Ghana's local farmers. Fresh vegetables, fruits, roots, and greens, priced by weight and delivered cold.",
}

export default function ShopPage() {
  return (
    <>
      <Suspense fallback={null}>
        <ShopCatalog />
      </Suspense>
      <div className="mx-auto max-w-7xl px-2 pb-6 sm:px-3 lg:px-4">
        <RecentlyViewedRail />
      </div>
    </>
  )
}
