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
            <h1 className="text-base font-extrabold text-[#2B1F17]">Farming Standards</h1>
            <p className="text-[10px] text-[#6E6A63]">{farmer.farmName || farmer.name}</p>
          </div>
        </div>
      </header>

      {/* Standards List */}
      <div className="px-3 sm:px-4 pt-3.5 space-y-3">
        <p className="text-xs text-[#6E6A63]">
          All verified badges and quality protocols enforced across {farmer.name}&apos;s farm plots.
        </p>

        <div className="space-y-2.5">
          {standards.map((std, i) => {
            const Icon = std.icon
            return (
              <div key={i} className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F7A43]/10 text-[#0F7A43]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-xs font-extrabold text-[#2B1F17]">{std.title}</h3>
                  </div>

                  <span className="rounded-full bg-[#0F7A43]/10 px-2 py-0.5 text-[9px] font-bold text-[#0F7A43]">
                    {std.badge}
                  </span>
                </div>

                <p className="mt-2 text-xs text-[#6E6A63] leading-relaxed">
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
