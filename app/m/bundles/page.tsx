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
    <div className="min-h-dvh bg-[#F4F1EA] pb-24 text-[#2B1F17]">
      <MobileAppBar title="Boxes & Subscriptions" showSearch showCart />

      <div className="px-4 py-4 space-y-4">
        <div className="rounded-3xl bg-[#1E5D3B] p-4 text-white shadow-xs">
          <h2 className="text-sm font-extrabold">Never run out of fresh staples</h2>
          <p className="mt-1 text-xs text-white/80">
            Save up to 20% on curated boxes delivered every week or month. Pause or cancel anytime.
          </p>
        </div>

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
                className="overflow-hidden rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#F4F1EA]">
                  <Image
                    src={bundle.image}
                    alt={bundle.name}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-[#A3E635] px-2.5 py-0.5 text-[10px] font-extrabold text-[#144028]">
                    <Repeat className="h-3 w-3" /> {bundle.frequency}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-extrabold text-[#2B1F17]">
                      {bundle.name}
                    </h3>
                    <span className="text-sm font-extrabold text-[#1E5D3B]">
                      {formatGHS(bundle.price)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#6E6A63]">{bundle.description}</p>
                </div>

                {/* Box contents list */}
                {lineItems.length > 0 && (
                  <div className="mt-3 rounded-2xl bg-[#F4F1EA] p-3 text-[11px]">
                    <span className="font-bold text-[#8A6B3D]">Includes {bundle.items.length} items:</span>
                    <ul className="mt-1 space-y-0.5 text-[#2B1F17]">
                      {lineItems.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>• {item.name}</span>
                          <span className="font-semibold text-[#6E6A63]">x{item.qty}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleSubscribe(bundle)}
                  className="ga-press mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#1E5D3B] text-xs font-bold text-white shadow-sm hover:bg-[#144028]"
                >
                  {isDone ? (
                    <>
                      <Check className="h-4 w-4 stroke-[3]" />
                      <span>Added to Basket</span>
                    </>
                  ) : (
                    <span>Subscribe ({formatGHS(bundle.price)} / delivery)</span>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}
