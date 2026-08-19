'use client'

import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Star, CheckCircle2 } from 'lucide-react'
import { farmers } from '@/lib/golden-acres/data'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'

export default function MobileFarmerReviewsScreen() {
  const router = useRouter()
  const params = useParams<{ slug: string }>()
  const rawSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || ''
  const farmer = farmers.find((f) => f.slug === rawSlug) || farmers[0]

  const reviews = [
    {
      author: 'Akosua Boakye',
      location: 'KNUST, Kumasi',
      rating: 5,
      date: '2 days ago',
      comment: 'The Roma tomatoes and sweet plantain were incredibly fresh. You can tell they were picked the same morning.',
    },
    {
      author: 'Kofi Mensah',
      location: 'Ahodwo, Kumasi',
      rating: 5,
      date: '1 week ago',
      comment: 'Great quality and clean produce. Packaging was cold and spotless.',
    },
    {
      author: 'Ebenezer Osei',
      location: 'Asokwa, Kumasi',
      rating: 4,
      date: '2 weeks ago',
      comment: 'Good produce and prompt delivery from the local farm hub.',
    },
    {
      author: 'Naa Adjeley',
      location: 'Tech Junction, Kumasi',
      rating: 5,
      date: '3 weeks ago',
      comment: 'Always reliable. The fresh garden eggs and pepper are top tier for Ghanaian soups.',
    },
  ]

  return (
    <div className="relative min-h-dvh bg-[#F7F5F0] pb-24 text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Top warm brand gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(240px,40vh,360px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.14) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      {/* Header */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between border-b border-[rgba(33,26,18,0.06)] bg-[#F7F5F0]/90 backdrop-blur-md px-3 py-2.5"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 10px)' }}
      >
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-[16px] font-black text-[#211A12]">Reviews &amp; Ratings</h1>
            <p className="text-[10.5px] font-semibold text-[#5C5247]">{farmer.farmName || farmer.name}</p>
          </div>
        </div>
      </header>

      {/* Review Breakdown Summary */}
      <div className="relative px-3 pt-3 space-y-2.5">
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-[#211A12]">{farmer.rating}</h2>
              <div className="mt-1 flex items-center gap-1 text-xs text-[#7A3F1C]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#F0A81E] text-[#F0A81E]" />
                ))}
              </div>
              <p className="mt-1 text-[10.5px] font-medium text-[#5C5247]">
                {farmer.reviewCount} verified buyer reviews
              </p>
            </div>

            {/* Rating distribution bar chart */}
            <div className="space-y-1 text-[10px] font-bold text-[#5C5247] w-36">
              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-0.5">5 <Star className="h-2.5 w-2.5 fill-[#F0A81E] text-[#F0A81E]" /></span>
                <div className="h-1.5 flex-1 rounded-full bg-[#F7F5F0] overflow-hidden">
                  <div className="h-full bg-[#0B3B25] w-[88%]" />
                </div>
                <span>88%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-0.5">4 <Star className="h-2.5 w-2.5 fill-[#F0A81E] text-[#F0A81E]" /></span>
                <div className="h-1.5 flex-1 rounded-full bg-[#F7F5F0] overflow-hidden">
                  <div className="h-full bg-[#0B3B25] w-[10%]" />
                </div>
                <span>10%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-0.5">3 <Star className="h-2.5 w-2.5 fill-[#F0A81E] text-[#F0A81E]" /></span>
                <div className="h-1.5 flex-1 rounded-full bg-[#F7F5F0] overflow-hidden">
                  <div className="h-full bg-[#0B3B25] w-[2%]" />
                </div>
                <span>2%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews List */}
        <div className="space-y-2">
          {reviews.map((rev, i) => (
            <div key={i} className="rounded-[22px] bg-[#FDFDFB] p-3 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12.5px] font-extrabold text-[#211A12]">{rev.author}</span>
                  <CheckCircle2 className="h-3 w-3 fill-[#0B3B25] text-white" />
                </div>
                <span className="text-[10px] font-semibold text-[#5C5247]">{rev.date}</span>
              </div>

              <div className="mt-1 flex items-center justify-between">
                <span className="text-[10.5px] font-bold text-[#0B3B25]">{rev.location}</span>
                <div className="flex items-center gap-0.5">
                  {[...Array(rev.rating)].map((_, idx) => (
                    <Star key={idx} className="h-2.5 w-2.5 fill-[#F0A81E] text-[#F0A81E]" />
                  ))}
                </div>
              </div>

              <p className="mt-1.5 text-[12px] leading-relaxed text-[#211A12] font-medium">{rev.comment}</p>
            </div>
          ))}
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}
