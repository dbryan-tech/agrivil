'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Tag, Check, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function MobileCartPromoScreen() {
  const router = useRouter()
  const [promoInput, setPromoInput] = useState('')
  const [appliedCode, setAppliedCode] = useState<string | null>(null)

  const vouchers = [
    {
      code: 'FRESHFIRST',
      title: 'GH₵10 Off First Harvest',
      desc: 'Valid on your first order of GH₵50 or more.',
      savings: 'GH₵10 OFF',
    },
    {
      code: 'KNUSTFREE',
      title: 'Free Campus Hub Delivery',
      desc: 'Zero delivery fee to all halls and off-campus hostels.',
      savings: 'FREE DELIVERY',
    },
    {
      code: 'LOCALFARM',
      title: '10% Off Direct Farm Crates',
      desc: 'Applicable on any organic grower produce order.',
      savings: '10% OFF',
    },
  ]

  function handleApply(code: string) {
    setAppliedCode(code)
    setTimeout(() => {
      router.push('/m/cart')
    }, 800)
  }

  return (
    <div className="min-h-dvh bg-[#FAF7F0] p-4 text-[#2B1F17] flex flex-col justify-between">
      <div>
        {/* Header */}
        <header className="flex items-center gap-2.5 pb-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-base font-extrabold text-[#2B1F17]">Apply Promo Code</h1>
        </header>

        {/* Promo Input Box */}
        <div className="mt-3 rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                placeholder="Enter coupon code..."
                className="h-11 w-full rounded-2xl border border-[#E0DACB] bg-[#FAF7F0] pl-10 pr-3 text-xs font-bold uppercase tracking-wider text-[#2B1F17] outline-none focus:border-[#0F7A43]"
              />
              <Tag className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#0F7A43]" />
            </div>

            <button
              type="button"
              onClick={() => handleApply(promoInput || 'FRESHFIRST')}
              className="ga-press flex h-11 px-5 items-center justify-center rounded-2xl bg-[#0F7A43] text-xs font-bold text-white shadow-xs"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Available Vouchers List */}
        <div className="mt-4 space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#6E6A63]">
            Available Vouchers
          </h2>

          <div className="space-y-2.5">
            {vouchers.map((v) => {
              const isSelected = appliedCode === v.code
              return (
                <div
                  key={v.code}
                  className="flex items-center justify-between rounded-3xl border border-[#E0DACB] bg-white p-3.5 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-[#0F7A43]/10 px-2 py-0.5 text-[10px] font-extrabold text-[#0F7A43]">
                        {v.code}
                      </span>
                      <span className="text-[10px] font-bold text-[#7A3F1C]">{v.savings}</span>
                    </div>
                    <h3 className="text-xs font-extrabold text-[#2B1F17]">{v.title}</h3>
                    <p className="text-[10px] text-[#6E6A63]">{v.desc}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApply(v.code)}
                    className={cn(
                      'ga-press flex h-8 px-3.5 items-center justify-center rounded-xl text-xs font-bold transition-all',
                      isSelected
                        ? 'bg-[#0B3B25] text-white'
                        : 'border border-[#0F7A43] text-[#0F7A43] hover:bg-[#0F7A43] hover:text-white'
                    )}
                  >
                    {isSelected ? <Check className="h-4 w-4 stroke-[3]" /> : 'Use'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="pt-6">
        <button
          type="button"
          onClick={() => router.push('/m/cart')}
          className="ga-press flex h-13 w-full items-center justify-center rounded-2xl border border-[#E0DACB] bg-white text-xs font-bold text-[#2B1F17] shadow-xs"
        >
          Back to Basket
        </button>
      </div>
    </div>
  )
}
