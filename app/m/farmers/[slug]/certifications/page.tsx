'use client'

import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, ShieldCheck, Leaf, Sparkles, Truck, CheckCircle2 } from 'lucide-react'
import { farmers } from '@/lib/golden-acres/data'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'

export default function MobileFarmerCertificationsScreen() {
  const router = useRouter()
  const params = useParams<{ slug: string }>()
  const rawSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || ''
  const farmer = farmers.find((f) => f.slug === rawSlug) || farmers[0]

  const standards = [
    {
      title: 'GhanaGAP Certified',
      icon: ShieldCheck,
      badge: 'Official Audit Passed',
      desc: 'Certified under the Ghana Good Agricultural Practices protocol, verifying pesticide residue safety, clean water irrigation, and hygienic field handling.',
    },
    {
      title: '100% Organic Soil Practices',
      icon: Leaf,
      badge: 'Certified Organic',
      desc: 'Soil enriched exclusively with natural on-farm compost and legume crop rotation. No synthetic fertilizers or artificial ripeners used.',
    },
    {
      title: 'Cold-Chain Hub Transport',
      icon: Truck,
      badge: 'Active Cold Preservation',
      desc: 'Morning harvest is transferred directly into temperature-controlled vans (<12°C) to eliminate moisture loss and field heat deterioration.',
    },
    {
      title: 'Fair Trade & Local Community',
      icon: Sparkles,
      badge: '100% Direct Payout',
      desc: 'Every harvest payout is settled directly into the farmer\'s mobile money wallet without predatory broker middlemen deductions.',
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
            <h1 className="text-[16px] font-black text-[#211A12]">Farming Standards</h1>
            <p className="text-[10.5px] font-semibold text-[#5C5247]">{farmer.farmName || farmer.name}</p>
          </div>
        </div>
      </header>

      {/* Standards List */}
      <div className="relative px-3 pt-3 space-y-2.5">
        <p className="text-[12px] font-medium text-[#5C5247]">
          All verified badges and quality protocols enforced across {farmer.name}&apos;s farm plots.
        </p>

        <div className="space-y-2">
          {standards.map((std, i) => {
            const Icon = std.icon
            return (
              <div key={i} className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B3B25]/10 text-[#0B3B25]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-[13px] font-extrabold text-[#211A12]">{std.title}</h3>
                  </div>

                  <span className="rounded-full bg-[#0B3B25]/10 px-2 py-0.5 text-[9.5px] font-black text-[#0B3B25]">
                    {std.badge}
                  </span>
                </div>

                <p className="mt-2 text-[12px] text-[#5C5247] leading-relaxed">
                  {std.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}
