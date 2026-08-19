'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, CheckCircle2, Leaf, Sparkles, Quote } from 'lucide-react'
import { farmers } from '@/lib/golden-acres/data'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'

export default function MobileFarmerStoryScreen() {
  const router = useRouter()
  const params = useParams<{ slug: string }>()
  const rawSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || ''
  const farmer = farmers.find((f) => f.slug === rawSlug) || farmers[0]

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
          <h1 className="text-base font-extrabold text-[#2B1F17]">Farmer Story</h1>
        </div>
      </header>

      {/* Hero Cover */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#2B1F17]">
        <Image
          src={farmer.photo}
          alt={farmer.name}
          fill
          priority
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2B1F17] via-transparent to-transparent" />
        <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#0F7A43] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
            <CheckCircle2 className="h-3 w-3" /> Third-Generation Grower
          </span>
          <h2 className="ga-headline mt-1 text-xl font-extrabold text-white sm:text-2xl">
            {farmer.farmName || farmer.name}
          </h2>
          <p className="text-xs text-white/90">{farmer.town}, {farmer.region}</p>
        </div>
      </div>

      {/* Story Content */}
      <div className="px-3 sm:px-4 pt-4 space-y-3.5">
        {/* Quote Card */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <div className="flex items-start gap-3">
            <Quote className="h-6 w-6 shrink-0 text-[#0F7A43]/40" />
            <p className="text-xs italic leading-relaxed text-[#2B1F17]">
              &ldquo;A tomato remembers how it was treated. If you nurture the red earth with care at dawn, it returns the sweetness by noon.&rdquo;
            </p>
          </div>
          <span className="mt-2 block text-right text-[10px] font-bold text-[#7A3F1C]">
            — {farmer.name}
          </span>
        </div>

        {/* Narrative */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs space-y-2.5 text-xs text-[#6E6A63] leading-relaxed">
          <h3 className="font-extrabold uppercase tracking-wider text-[10px] text-[#2B1F17]">
            Roots &amp; Heritage
          </h3>
          <p>
            {farmer.story || farmer.bio}
          </p>
          <p>
            Operating across generational family plots in {farmer.town}, the farm employs local youths and women harvesters, combining traditional soil wisdom with modern drip irrigation to ensure continuous supply through both wet and dry seasons.
          </p>
        </div>

        {/* Cultivation Standards List */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#2B1F17] pb-2">
            Farming Methods &amp; Standards
          </h3>

          <div className="space-y-2 text-xs">
            {(farmer.methods || ['Hand-harvested at dawn', 'Crop rotation with legumes', 'Drip irrigation', 'Low-spray integrated pest management']).map((m) => (
              <div key={m} className="flex items-center gap-2">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0F7A43]/10 text-[#0F7A43]">
                  <Leaf className="h-3 w-3" />
                </div>
                <span className="font-semibold text-[#2B1F17]">{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href={`/m/farmers/${farmer.slug}`}
          className="ga-press flex h-12 w-full items-center justify-center rounded-2xl bg-[#0F7A43] text-xs font-bold text-white shadow-md hover:bg-[#0B3B25]"
        >
          View Farm Profile &amp; Harvest
        </Link>
      </div>

      <MobileBottomNav />
    </div>
  )
}
