import { FarmersGridLive } from '@/components/golden-acres/farmers/farmers-grid-live'
import { farmers } from '@/lib/golden-acres/data'

export const metadata = {
  title: 'Meet the Farmers — AgriVil',
  description:
    'The growers behind your food. Meet the local Ghanaian farmers partnering with AgriVil to bring fresh produce to your door.',
}

/**
 * Farmers directory (redesigned, docs/redesign/06 §3) — story-first editorial
 * grid; every product card's farm attribution lands here.
 */
export default function FarmersPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F0] pb-20 pt-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <header className="max-w-2xl">
          <p className="text-[13px] font-semibold text-[#7A3F1C]">Meet the growers</p>
          <h1 className="ga-display-title mt-2 text-[clamp(30px,3.6vw,48px)] text-[#211A12]">
            The hands behind your harvest.
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[#5C5247]">
            Every basket traces back to a real farm. Get to know the people
            growing your food — their methods, their land, and their promise of
            freshness.
          </p>
        </header>

        <FarmersGridLive seed={farmers} />
      </div>
    </main>
  )
}
