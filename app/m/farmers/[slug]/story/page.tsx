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
          <h1 className="text-[16px] font-black text-[#211A12]">Farmer Story</h1>
        </div>
      </header>

      {/* Hero Cover */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#211A12]">
        <Image
          src={farmer.photo}
          alt={farmer.name}
          fill
          priority
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#211A12] via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#0B3B25] px-2.5 py-0.5 text-[9.5px] font-black text-white shadow-xs">
            <CheckCircle2 className="h-3 w-3" /> Third-Generation Grower
          </span>
          <h2 className="mt-1 text-[20px] font-black text-white sm:text-2xl">
            {farmer.farmName || farmer.name}
          </h2>
          <p className="text-[11.5px] text-white/90 font-medium">{farmer.town}, {farmer.region}</p>
        </div>
      </div>

      {/* Story Content */}
      <div className="relative px-3 pt-3 space-y-2.5">
        {/* Quote Card */}
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <div className="flex items-start gap-2.5">
            <Quote className="h-5 w-5 shrink-0 text-[#0B3B25]/40" />
            <p className="text-[12px] italic leading-relaxed text-[#211A12]">
              &ldquo;A tomato remembers how it was treated. If you nurture the red earth with care at dawn, it returns the sweetness by noon.&rdquo;
            </p>
          </div>
          <span className="mt-2 block text-right text-[10px] font-extrabold text-[#7A3F1C]">
            — {farmer.name}
          </span>
        </div>

        {/* Narrative */}
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] space-y-2 text-[12px] text-[#5C5247] leading-relaxed font-medium">
          <h3 className="font-black uppercase tracking-[0.14em] text-[10px] text-[#211A12]">
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
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <h3 className="text-[10px] font-black uppercase tracking-[0.14em] text-[#211A12] pb-2">
            Farming Methods &amp; Standards
          </h3>

          <div className="space-y-2 text-[12px]">
            {(farmer.methods || ['Hand-harvested at dawn', 'Crop rotation with legumes', 'Drip irrigation', 'Low-spray integrated pest management']).map((m) => (
              <div key={m} className="flex items-center gap-2">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0B3B25]/10 text-[#0B3B25]">
                  <Leaf className="h-3 w-3" />
                </div>
                <span className="font-extrabold text-[#211A12]">{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href={`/m/farmers/${farmer.slug}`}
          className="flex h-12 w-full items-center justify-center rounded-full bg-[#0B3B25] text-[13px] font-extrabold text-white shadow-md active:scale-[0.98] transition-transform"
        >
          View Farm Profile &amp; Harvest
        </Link>
      </div>

      <MobileBottomNav />
    </div>
  )
}
