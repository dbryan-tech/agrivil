'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Repeat, Plus, Check, CheckCircle2, ShoppingBag } from 'lucide-react'
import { bundles, products } from '@/lib/golden-acres/data'
import { formatGHS } from '@/lib/golden-acres/format'
import { useCart } from '@/components/golden-acres/cart-context'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'

export default function MobileBundlesScreen() {
  const { add } = useCart()
  const [subscribedId, setSubscribedId] = useState<string | null>(null)

  function handleSubscribe(bundle: (typeof bundles)[0]) {
    if (bundle.items && bundle.items.length > 0) {
      bundle.items.forEach((it) => {
        const p = products.find((pr) => pr.id === it.productId)
        if (p) add(p, it.qty || 1)
      })
    }
    setSubscribedId(bundle.id)
    setTimeout(() => setSubscribedId(null), 1500)
  }

  return (
    <div className="relative min-h-dvh w-full bg-[#F7F5F0] pb-28 text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Zero Scrollbar Global Styles */}
      <style jsx global>{`
        * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        *::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      `}</style>

      {/* Top warm brand gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(240px,40vh,360px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.14) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      {/* Header */}
      <header className="relative flex items-center justify-between px-5 pt-4 pb-2">
        <h1 className="text-[26px] font-extrabold tracking-tight text-[#211A12]">
          Farm Boxes
        </h1>
        <div className="flex items-center gap-1 text-[11px] font-black text-[#7A3F1C]">
          <Repeat className="h-4 w-4" />
          <span>Save up to 20%</span>
        </div>
      </header>

      <div className="relative px-5 pt-2 space-y-4">
        {/* Value Banner */}
        <div className="rounded-[28px] bg-[#0B3B25] p-5 text-white shadow-md">
          <span className="text-[10px] font-black uppercase tracking-wider text-white/80">
            Subscription Bundles
          </span>
          <h2 className="mt-0.5 text-[16px] font-black">Never run out of fresh staples</h2>
          <p className="mt-1 text-[12px] text-white/80 font-semibold leading-relaxed">
            Curated boxes harvested dawn-fresh and delivered cold to your gate. Pause or cancel anytime.
          </p>
        </div>

        {/* Bundles List */}
        <div className="space-y-4">
          {bundles.map((bundle) => {
            const isDone = subscribedId === bundle.id
            const lineItems = (bundle.items || [])
              .map((it) => {
                const p = products.find((pr) => pr.id === it.productId)
                return p ? { name: p.name, qty: it.qty } : null
              })
              .filter((x): x is { name: string; qty: number } => x !== null)

            return (
              <div
                key={bundle.id}
                className="overflow-hidden rounded-[28px] bg-[#FAF9F6] p-4 shadow-[0_2px_10px_-2px_rgba(33,26,18,0.05),0_8px_20px_-6px_rgba(33,26,18,0.08)] border border-[rgba(33,26,18,0.08)] ring-1 ring-white/90"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-white shadow-2xs border border-[rgba(33,26,18,0.08)]">
                  <Image
                    src={bundle.image}
                    alt={bundle.name}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-[#0B3B25] px-3 py-1 text-[10px] font-black text-white shadow-xs">
                    <Repeat className="h-3 w-3" /> {bundle.frequency}
                  </span>
                </div>

                <div className="mt-3.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[15px] font-extrabold text-[#211A12]">
                      {bundle.name}
                    </h3>
                    <span className="text-[17px] font-black text-[#0B3B25]">
                      {formatGHS(bundle.price)}
                    </span>
                  </div>

                  <p className="mt-1 text-[12px] text-[#5C5247] font-semibold">
                    {bundle.description}
                  </p>

                  <div className="mt-3 rounded-2xl bg-white/80 p-3 text-[12px] border border-[rgba(33,26,18,0.06)]">
                    <span className="font-extrabold text-[#5C5247] text-[11px] uppercase tracking-wider">
                      Includes in this box:
                    </span>
                    <ul className="mt-1.5 space-y-1 text-[12px] font-bold text-[#211A12]">
                      {lineItems.map((it, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#0B3B25]" />
                          <span>{it.qty}x {it.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSubscribe(bundle)}
                    className="mt-3.5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0B3B25] text-[13px] font-extrabold text-white shadow-xs active:scale-[0.98] transition-transform"
                  >
                    {isDone ? (
                      <>
                        <Check className="h-4 w-4 stroke-[3]" />
                        <span>Added Box to Basket</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" />
                        <span>Add Box to Basket</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}

