import { Suspense } from 'react'
import { ShopCatalog } from '@/components/golden-acres/shop/shop-catalog'
import { RecentlyViewedRail } from '@/components/golden-acres/shop/recently-viewed-rail'

export const metadata = {
  title: 'Shop Fresh Produce — AgriVil',
  description:
    "Browse today's harvest from Ghana's local farmers. Fresh vegetables, fruits, roots, and greens, priced by weight and delivered cold.",
}

/**
 * Shop listing (redesigned, docs/redesign/02 §3). The editorial header is
 * server-rendered so it paints instantly and appears in the prerendered HTML;
 * the interactive catalog (filters, search, grid) hydrates below it.
 */
export default function ShopPage() {
  return (
    <main className="bg-[#F7F5F0]">
      {/* Server-rendered editorial header */}
      <header className="mx-auto max-w-7xl px-5 pb-2 pt-10 sm:px-8 sm:pt-12">
        <p className="text-[13px] font-semibold text-[#7A3F1C]">The market</p>
        <h1 className="ga-display-title mt-2 text-[clamp(30px,3.6vw,48px)] text-[#211A12]">
          All produce
        </h1>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-[#5C5247]">
          Live listings from Ghanaian growers — priced by weight, freshness
          dated, and delivered cold from the Tema hub.
        </p>
      </header>

      <Suspense fallback={null}>
        <ShopCatalog />
      </Suspense>

      <div className="mx-auto max-w-7xl px-5 pb-10 sm:px-8">
        <RecentlyViewedRail />
      </div>
    </main>
  )
}
