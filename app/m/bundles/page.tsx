'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Repeat, Plus, Check, CheckCircle2, ShoppingBag, ArrowLeft, Sparkles } from 'lucide-react'
import { bundles, products } from '@/lib/golden-acres/data'
import { formatGHS } from '@/lib/golden-acres/format'
import { useCart } from '@/components/golden-acres/cart-context'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'

export default function MobileBundlesScreen() {
  const router = useRouter()
  const { add, count } = useCart()
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
    <div className="relative min-h-dvh w-full bg-[#FAF9F6] pb-28 text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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

      {/* ========================================================
          1. FULL-BLEED TOP HERO BANNER (Bleeds to edges & top)
         ======================================================== */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden rounded-b-[32px] bg-[#0B3B25] shadow-xs">
        <Image
          src="/golden-acres/bundle-box.png"
          alt="Farm Boxes & Subscriptions"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-[1.05] opacity-80 select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />

        {/* Floating Top Navigation Header */}
        <header
          className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-1.5 pt-3"
          style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 14px)' }}
        >
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#211A12] shadow-sm border border-[rgba(33,26,18,0.08)] active:scale-95 transition-transform backdrop-blur-xs"
          >
            <ArrowLeft className="h-4 w-4 stroke-[2.4]" />
          </button>

          <div className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-[#211A12] shadow-sm border border-[rgba(33,26,18,0.08)] backdrop-blur-xs">
            <Repeat className="h-3 w-3 text-[#0B3B25]" />
            <span>Farm Boxes</span>
          </div>

          <Link
            href="/m/cart"
            aria-label="Basket"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#211A12] shadow-sm border border-[rgba(33,26,18,0.08)] active:scale-95 transition-transform backdrop-blur-xs"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#7A3F1C] px-1 text-[9px] font-black text-white shadow-xs">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </Link>
        </header>

        {/* Bottom Banner Info */}
        <div className="absolute bottom-4 left-4 right-4 text-white z-20">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#0B3B25] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs">
            <Sparkles className="h-2.5 w-2.5 text-[#F0A81E]" /> Save up to 20%
          </span>
          <h1 className="mt-1 text-[20px] font-black tracking-tight text-white sm:text-2xl">
            Bundles &amp; Subscriptions
          </h1>
          <p className="text-[11.5px] font-medium text-white/90 line-clamp-1">
            Dawn-fresh curated boxes delivered cold. Pause or cancel anytime.
          </p>
        </div>
      </div>

      <div className="relative px-1.5 pt-3 space-y-2">
        {/* Bundles List */}
        <div className="space-y-3">
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
                className="overflow-hidden rounded-[22px] bg-white shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]"
              >
                {/* Full-bleed Top Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#211A12]">
                  <Image
                    src={bundle.image}
                    alt={bundle.name}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-[#0B3B25] px-2.5 py-0.5 text-[9.5px] font-black text-white shadow-xs">
                    <Repeat className="h-3 w-3" /> {bundle.frequency}
                  </span>
                </div>

                <div className="p-3.5 bg-[#FAF9F6]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[15px] font-black text-[#211A12]">
                      {bundle.name}
                    </h3>
                    <span className="text-[16px] font-black text-[#0B3B25]">
                      {formatGHS(bundle.price)}
                    </span>
                  </div>

                  <p className="mt-0.5 text-[12px] text-[#5C5247] font-medium">
                    {bundle.description}
                  </p>

                  <div className="mt-2.5 rounded-2xl bg-white p-2.5 text-[11.5px] border border-[rgba(33,26,18,0.06)] shadow-2xs">
                    <span className="font-black text-[#8A7E72] text-[9.5px] uppercase tracking-wider">
                      Included in this box:
                    </span>
                    <ul className="mt-1 space-y-1 text-[12px] font-bold text-[#211A12]">
                      {lineItems.map((it, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#0B3B25] shrink-0" />
                          <span>{it.qty}x {it.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSubscribe(bundle)}
                    className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#0B3B25] text-[13px] font-extrabold text-white shadow-xs active:scale-[0.98] transition-transform"
                  >
                    {isDone ? (
                      <>
                        <Check className="h-4 w-4 stroke-[3]" />
                        <span>Added Box to Basket</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4 stroke-[2.4]" />
                        <span>Subscribe &amp; Add Box</span>
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

