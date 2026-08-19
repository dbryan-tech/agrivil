'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Check, Package, Calendar, Truck, ShieldCheck } from 'lucide-react'
import { farmers } from '@/lib/golden-acres/data'
import { formatGHS } from '@/lib/golden-acres/format'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'
import { cn } from '@/lib/utils'

export default function MobileFarmerBulkOrderScreen() {
  const router = useRouter()
  const params = useParams<{ slug: string }>()
  const rawSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || ''
  const farmer = farmers.find((f) => f.slug === rawSlug) || farmers[0]

  const [crateSize, setCrateSize] = useState<'10kg' | '25kg' | '50kg'>('25kg')
  const [crateCount, setCrateCount] = useState(2)
  const [submitted, setSubmitted] = useState(false)

  const pricePerCrate = crateSize === '10kg' ? 110 : crateSize === '25kg' ? 250 : 480
  const estimatedTotal = pricePerCrate * crateCount

  if (submitted) {
    return (
      <div className="relative min-h-dvh bg-[#F7F5F0] p-3 text-[#211A12] flex flex-col justify-between select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* Top warm brand gradient backdrop */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(240px,40vh,360px)]"
          style={{
            background:
              'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.14) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
          }}
        />

        <div className="relative">
          <header className="flex items-center pb-2.5">
            <button
              type="button"
              onClick={() => router.push(`/m/farmers/${farmer.slug}`)}
              aria-label="Back"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          </header>

          <div className="mt-12 flex flex-col items-center justify-center text-center px-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0B3B25] text-white shadow-lg animate-bounce">
              <Check className="h-8 w-8 stroke-[3]" />
            </div>

            <h1 className="mt-4 text-[22px] font-black text-[#211A12]">
              Bulk Quote Requested!
            </h1>
            <p className="mt-1.5 text-[12px] font-semibold text-[#5C5247] max-w-xs">
              {farmer.name} will prepare a wholesale dispatch invoice and confirm harvest schedule.
            </p>
          </div>
        </div>

        <div className="relative pt-4">
          <button
            type="button"
            onClick={() => router.push(`/m/farmers/${farmer.slug}`)}
            className="flex h-12 w-full items-center justify-center rounded-full bg-[#0B3B25] text-[13.5px] font-extrabold text-white shadow-md active:scale-[0.98] transition-transform"
          >
            Return to Farm Profile
          </button>
        </div>
      </div>
    )
  }

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
            <h1 className="text-[16px] font-black text-[#211A12]">Bulk &amp; Crate Order</h1>
            <p className="text-[10.5px] font-semibold text-[#5C5247]">{farmer.farmName || farmer.name}</p>
          </div>
        </div>
      </header>

      {/* Form Content */}
      <div className="relative px-3 pt-3 space-y-2.5">
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <h2 className="text-[10px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
            Select Crate / Sack Size
          </h2>

          <div className="mt-2.5 grid grid-cols-3 gap-2">
            {[
              { size: '10kg' as const, label: '10 kg Crate', price: 110 },
              { size: '25kg' as const, label: '25 kg Sack', price: 250 },
              { size: '50kg' as const, label: '50 kg Bag', price: 480 },
            ].map((opt) => (
              <button
                key={opt.size}
                type="button"
                onClick={() => setCrateSize(opt.size)}
                className={cn(
                  'flex flex-col items-center justify-center rounded-2xl p-2.5 transition-all active:scale-95 shadow-2xs',
                  crateSize === opt.size
                    ? 'bg-[#0B3B25] text-white'
                    : 'border border-[rgba(33,26,18,0.08)] bg-white text-[#211A12]'
                )}
              >
                <Package className="h-4 w-4" />
                <span className="mt-1 text-[12px] font-black">{opt.size}</span>
                <span className="text-[9.5px] font-semibold opacity-80">{formatGHS(opt.price)}</span>
              </button>
            ))}
          </div>

          {/* Crate Count Stepper */}
          <div className="mt-3.5 flex items-center justify-between border-t border-[rgba(33,26,18,0.06)] pt-2.5">
            <span className="text-[12px] font-extrabold text-[#211A12]">Number of Crates/Bags</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCrateCount(Math.max(1, crateCount - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(33,26,18,0.10)] bg-white text-[#211A12] active:scale-95 font-bold"
              >
                -
              </button>
              <span className="text-[14px] font-black text-[#211A12]">{crateCount}</span>
              <button
                type="button"
                onClick={() => setCrateCount(crateCount + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(33,26,18,0.10)] bg-white text-[#211A12] active:scale-95 font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] space-y-1.5 text-xs">
          <div className="flex justify-between text-[#5C5247] text-[11.5px] font-semibold">
            <span>Unit Wholesale Rate</span>
            <span className="font-bold text-[#211A12]">{formatGHS(pricePerCrate)} / unit</span>
          </div>
          <div className="flex justify-between text-[#5C5247] text-[11.5px] font-semibold">
            <span>Total Units</span>
            <span className="font-bold text-[#211A12]">{crateCount} {crateSize} units</span>
          </div>
          <div className="flex justify-between font-black text-[#211A12] border-t border-[rgba(33,26,18,0.06)] pt-2 text-[13.5px]">
            <span>Estimated Wholesale Total</span>
            <span className="text-[#0B3B25]">{formatGHS(estimatedTotal)}</span>
          </div>
        </div>

        {/* Submit Quote Button */}
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          className="flex h-12 w-full items-center justify-center rounded-full bg-[#0B3B25] text-[13.5px] font-extrabold text-white shadow-md active:scale-[0.98] transition-transform"
        >
          Request Bulk Quote ({formatGHS(estimatedTotal)})
        </button>
      </div>

      <MobileBottomNav />
    </div>
  )
}
