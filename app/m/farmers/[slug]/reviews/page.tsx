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
    <div className="min-h-dvh bg-[#FAF7F0] pb-24 text-[#2B1F17]">
      {/* Header */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between border-b border-[#E0DACB] bg-[#FAF7F0] px-3 sm:px-4 py-2.5"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 10px)' }}
      >
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-base font-extrabold text-[#2B1F17]">Reviews &amp; Ratings</h1>
            <p className="text-[10px] text-[#6E6A63]">{farmer.farmName || farmer.name}</p>
          </div>
        </div>
      </header>

      {/* Review Breakdown Summary */}
      <div className="px-3 sm:px-4 pt-3.5 space-y-3.5">
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-[#2B1F17]">{farmer.rating}</h2>
              <div className="mt-1 flex items-center gap-1 text-xs text-[#7A3F1C]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#FBBF24] text-[#FBBF24]" />
                ))}
              </div>
              <p className="mt-1 text-[10px] text-[#6E6A63]">
                {farmer.reviewCount} verified buyer reviews
              </p>
            </div>

            {/* Rating distribution bar chart */}
            <div className="space-y-1 text-[10px] font-bold text-[#6E6A63] w-36">
              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-0.5">5 <Star className="h-2.5 w-2.5 fill-[#FBBF24] text-[#FBBF24]" /></span>
                <div className="h-2 flex-1 rounded-full bg-[#FAF7F0] overflow-hidden">
                  <div className="h-full bg-[#0F7A43] w-[88%]" />
                </div>
                <span>88%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-0.5">4 <Star className="h-2.5 w-2.5 fill-[#FBBF24] text-[#FBBF24]" /></span>
                <div className="h-2 flex-1 rounded-full bg-[#FAF7F0] overflow-hidden">
                  <div className="h-full bg-[#0F7A43] w-[10%]" />
                </div>
                <span>10%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-0.5">3 <Star className="h-2.5 w-2.5 fill-[#FBBF24] text-[#FBBF24]" /></span>
                <div className="h-2 flex-1 rounded-full bg-[#FAF7F0] overflow-hidden">
                  <div className="h-full bg-[#0F7A43] w-[2%]" />
                </div>
                <span>2%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews List */}
        <div className="space-y-2.5">
          {reviews.map((rev, i) => (
            <div key={i} className="rounded-3xl border border-[#E0DACB] bg-white p-3.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-extrabold text-[#2B1F17]">{rev.author}</span>
                  <CheckCircle2 className="h-3 w-3 fill-[#0F7A43] text-white" />
                </div>
                <span className="text-[10px] text-[#6E6A63]">{rev.date}</span>
              </div>

              <div className="mt-1 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-[#0F7A43]">{rev.location}</span>
                <div className="flex items-center gap-0.5">
                  {[...Array(rev.rating)].map((_, idx) => (
                    <Star key={idx} className="h-2.5 w-2.5 fill-[#FBBF24] text-[#FBBF24]" />
                  ))}
                </div>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-[#2B1F17]">{rev.comment}</p>
            </div>
          ))}
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}
