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
        {/* Header */}
        <header className="flex items-center gap-2.5 pb-2.5">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-[16px] font-black text-[#211A12]">Apply Promo Code</h1>
        </header>

        {/* Promo Input Box */}
        <div className="mt-2.5 rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                placeholder="Enter coupon code..."
                className="h-10 w-full rounded-2xl border border-[rgba(33,26,18,0.10)] bg-white pl-9 pr-3 text-[12px] font-bold uppercase tracking-wider text-[#211A12] outline-none focus:border-[#0B3B25]"
              />
              <Tag className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#0B3B25]" />
            </div>

            <button
              type="button"
              onClick={() => handleApply(promoInput || 'FRESHFIRST')}
              className="flex h-10 px-4 items-center justify-center rounded-2xl bg-[#0B3B25] text-[12px] font-extrabold text-white shadow-xs active:scale-95 transition-transform"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Available Vouchers List */}
        <div className="mt-3.5 space-y-2.5">
          <h2 className="text-[10px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
            Available Vouchers
          </h2>

          <div className="space-y-2">
            {vouchers.map((v) => {
              const isSelected = appliedCode === v.code
              return (
                <div
                  key={v.code}
                  className="flex items-center justify-between rounded-[22px] bg-[#FDFDFB] p-3 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-[#0B3B25]/10 px-2 py-0.5 text-[9.5px] font-black text-[#0B3B25]">
                        {v.code}
                      </span>
                      <span className="text-[10px] font-bold text-[#7A3F1C]">{v.savings}</span>
                    </div>
                    <h3 className="text-[13px] font-extrabold text-[#211A12]">{v.title}</h3>
                    <p className="text-[10.5px] font-semibold text-[#5C5247]">{v.desc}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApply(v.code)}
                    className={cn(
                      'flex h-8 px-3.5 items-center justify-center rounded-full text-[11px] font-extrabold transition-all active:scale-95 shadow-2xs',
                      isSelected
                        ? 'bg-[#0B3B25] text-white'
                        : 'border border-[#0B3B25] text-[#0B3B25] hover:bg-[#0B3B25] hover:text-white'
                    )}
                  >
                    {isSelected ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : 'Use'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
