'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Repeat, Plus, Check, CheckCircle2 } from 'lucide-react'
import { bundles, products } from '@/lib/golden-acres/data'
import { formatGHS } from '@/lib/golden-acres/format'
import { useCart } from '@/components/golden-acres/cart-context'
import { MobileAppBar } from '@/components/golden-acres/mobile/mobile-app-bar'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'

export default function MobileBundlesScreen() {
  const { add } = useCart()
  const [subscribedId, setSubscribedId] = useState<string | null>(null)

  function handleSubscribe(bundle: (typeof bundles)[0]) {
    // Add all products in the box to cart
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
    <div className="min-h-dvh bg-[#FAF7F0] pb-24 text-[#2B1F17]">
      <MobileAppBar title="Boxes & Subscriptions" showSearch showCart />

      <div className="px-3 sm:px-4 py-3.5 space-y-3.5">
        <div className="rounded-3xl bg-[#0F7A43] p-4 text-white shadow-xs">
          <h2 className="text-sm font-extrabold">Never run out of fresh staples</h2>
          <p className="mt-1 text-xs text-white/80">
            Save up to 20% on curated boxes delivered every week or month. Pause or cancel anytime.
          </p>
        </div>

        <div className="space-y-3.5">
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
                className="overflow-hidden rounded-3xl border border-[#E0DACB] bg-white p-3.5 shadow-xs"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#FAF7F0]">
                  <Image
                    src={bundle.image}
                    alt={bundle.name}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-[#0F7A43] px-2.5 py-0.5 text-[10px] font-extrabold text-white">
                    <Repeat className="h-3 w-3 text-[#A3E635]" /> {bundle.frequency}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-[#2B1F17]">
                      {bundle.name}
                    </h3>
                    <span className="text-base font-extrabold text-[#0F7A43]">
                      {formatGHS(bundle.price)}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-[#6E6A63]">
                    {bundle.description}
                  </p>

                  <div className="mt-3 rounded-2xl bg-[#FAF7F0] p-2.5 text-xs">
                    <span className="font-bold text-[#6E6A63]">Includes in box:</span>
                    <ul className="mt-1 space-y-0.5 text-[11px] font-medium text-[#2B1F17]">
                      {lineItems.map((it, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-[#0F7A43]" />
                          <span>{it.qty}x {it.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSubscribe(bundle)}
                    className="ga-press mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#0F7A43] text-xs font-bold text-white shadow-xs hover:bg-[#0B3B25]"
                  >
                    {isDone ? (
                      <>
                        <Check className="h-4 w-4 stroke-[3]" />
                        <span>Added Box to Basket</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
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
