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
      <div className="min-h-dvh bg-[#FAF7F0] p-4 text-[#2B1F17] flex flex-col justify-between">
        <header className="flex items-center">
          <button
            type="button"
            onClick={() => router.push(`/m/farmers/${farmer.slug}`)}
            aria-label="Back"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        </header>

        <div className="flex flex-col items-center justify-center text-center px-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0F7A43] text-white shadow-lg animate-bounce">
            <Check className="h-10 w-10 stroke-[3]" />
          </div>

          <h1 className="ga-headline mt-5 text-2xl font-extrabold text-[#2B1F17]">
            Bulk Quote Requested!
          </h1>
          <p className="mt-2 text-xs text-[#6E6A63] max-w-xs">
            {farmer.name} will prepare a wholesale dispatch invoice and confirm harvest schedule.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => router.push(`/m/farmers/${farmer.slug}`)}
            className="ga-press flex h-13 w-full items-center justify-center rounded-2xl bg-[#0F7A43] text-sm font-bold text-white shadow-md hover:bg-[#0B3B25]"
          >
            Return to Farm Profile
          </button>
        </div>
      </div>
    )
  }

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
            <h1 className="text-base font-extrabold text-[#2B1F17]">Bulk &amp; Crate Order</h1>
            <p className="text-[10px] text-[#6E6A63]">{farmer.farmName || farmer.name}</p>
          </div>
        </div>
      </header>

      {/* Form Content */}
      <div className="px-3 sm:px-4 pt-3.5 space-y-3.5">
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#6E6A63]">
            Select Crate / Sack Size
          </h2>

          <div className="mt-3 grid grid-cols-3 gap-2">
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
                  'ga-press flex flex-col items-center justify-center rounded-2xl p-3 border transition-all',
                  crateSize === opt.size
                    ? 'border-[#0F7A43] bg-[#0F7A43] text-white shadow-xs'
                    : 'border-[#E0DACB] bg-[#FAF7F0] text-[#2B1F17]'
                )}
              >
                <Package className="h-4 w-4" />
                <span className="mt-1 text-xs font-extrabold">{opt.size}</span>
                <span className="text-[9px] opacity-80">{formatGHS(opt.price)}</span>
              </button>
            ))}
          </div>

          {/* Crate Count Stepper */}
          <div className="mt-4 flex items-center justify-between border-t border-[#E0DACB]/60 pt-3">
            <span className="text-xs font-bold text-[#2B1F17]">Number of Crates/Bags</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCrateCount(Math.max(1, crateCount - 1))}
                className="ga-press flex h-8 w-8 items-center justify-center rounded-full border border-[#E0DACB] bg-[#FAF7F0] text-[#2B1F17]"
              >
                -
              </button>
              <span className="text-sm font-extrabold text-[#2B1F17]">{crateCount}</span>
              <button
                type="button"
                onClick={() => setCrateCount(crateCount + 1)}
                className="ga-press flex h-8 w-8 items-center justify-center rounded-full border border-[#E0DACB] bg-[#FAF7F0] text-[#2B1F17]"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs space-y-2 text-xs">
          <div className="flex justify-between text-[#6E6A63]">
            <span>Unit Wholesale Rate</span>
            <span className="font-bold text-[#2B1F17]">{formatGHS(pricePerCrate)} / unit</span>
          </div>
          <div className="flex justify-between text-[#6E6A63]">
            <span>Total Units</span>
            <span className="font-bold text-[#2B1F17]">{crateCount} {crateSize} units</span>
          </div>
          <div className="flex justify-between font-extrabold text-[#2B1F17] border-t border-[#E0DACB]/60 pt-2 text-sm">
            <span>Estimated Wholesale Total</span>
            <span className="text-[#0F7A43]">{formatGHS(estimatedTotal)}</span>
          </div>
        </div>

        {/* Submit Quote Button */}
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          className="ga-press flex h-13 w-full items-center justify-center rounded-2xl bg-[#0F7A43] text-sm font-bold text-white shadow-md hover:bg-[#0B3B25]"
        >
          Request Bulk Quote ({formatGHS(estimatedTotal)})
        </button>
      </div>

      <MobileBottomNav />
    </div>
  )
}
