'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Store,
  Wallet,
  Package,
  TrendingUp,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { products } from '@/lib/golden-acres/data'
import { formatGHS } from '@/lib/golden-acres/format'

export default function MobileFarmerCockpitScreen() {
  const [stockStatus, setStockStatus] = useState<Record<string, boolean>>({
    'p-roma-tomatoes': true,
    'p-sweet-pineapple': true,
    'p-white-yam': true,
    'p-scotch-bonnet': false,
  })

  const [actualWeights, setActualWeights] = useState<Record<string, string>>({
    'item-1': '2.15',
    'item-2': '1.05',
  })

  const farmProducts = products.slice(0, 4)

  function toggleStock(id: string) {
    setStockStatus((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="relative min-h-dvh bg-[#F7F5F0] pb-28 text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Top warm brand gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(240px,40vh,360px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.14) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      {/* App Bar */}
      <header
        className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[rgba(33,26,18,0.08)] bg-[#F7F5F0]/90 px-4 backdrop-blur-md"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 10px)' }}
      >
        <Link
          href="/m/account"
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="flex flex-col text-center">
          <h1 className="text-[15px] font-black text-[#211A12]">
            Farmer Cockpit
          </h1>
          <span className="text-[10.5px] text-[#0B3B25] font-extrabold">Adwoa Sarponaa Farms</span>
        </div>

        <Link
          href="/m"
          className="rounded-full bg-[#0B3B25]/10 px-3 py-1 text-[11px] font-black text-[#0B3B25]"
        >
          Store View
        </Link>
      </header>

      <div className="relative px-5 pt-3 space-y-4">
        {/* 1. MoMo 48h Settlement Balance Card */}
        <div className="rounded-[28px] bg-[#0B3B25] p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-bold text-white/80">Available MoMo Balance</span>
            <span className="rounded-full bg-[#7A3F1C] px-2.5 py-0.5 text-[9.5px] font-black text-white shadow-xs">
              48h Auto-Payout Active
            </span>
          </div>
          <h2 className="mt-2 text-[26px] font-black text-white">
            {formatGHS(2480.0)}
          </h2>
          <p className="mt-1 text-[11.5px] font-semibold text-white/80">
            Next settlement to MTN MoMo (024 123 4567) at 5:00 PM today.
          </p>
        </div>

        {/* 2. Today's Pick List & Variable Weight Reconciler */}
        <div className="rounded-[28px] bg-[#FDFDFB] p-5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(33,26,18,0.06)]">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-[#0B3B25]" />
              <span className="text-[11px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
                Today&apos;s Packing List (2 orders)
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#7A3F1C]">Pickup 10:30 AM</span>
          </div>

          <div className="mt-3 space-y-3">
            {/* Pick Item 1 */}
            <div className="rounded-2xl bg-white p-3.5 shadow-2xs border border-[rgba(33,26,18,0.06)] text-xs">
              <div className="flex justify-between font-extrabold text-[#211A12]">
                <span>Order #AG12345678 — Fresh Tomatoes</span>
                <span className="text-[#0B3B25]">Ordered: 2.0 kg</span>
              </div>
              <p className="mt-0.5 text-[11px] text-[#5C5247] font-semibold">Customer: Ewoke Mensah (KNUST, Kumasi)</p>

              <div className="mt-2.5 flex items-center gap-2">
                <span className="text-[11.5px] font-bold text-[#211A12]">Actual Measured Weight:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={actualWeights['item-1']}
                    onChange={(e) => setActualWeights({ ...actualWeights, 'item-1': e.target.value })}
                    className="h-8 w-16 rounded-xl border border-[rgba(33,26,18,0.12)] bg-[#F7F5F0] text-center font-black text-[#0B3B25] outline-none"
                  />
                  <span className="font-bold text-[#5C5247]">kg</span>
                </div>
                <button
                  type="button"
                  className="ml-auto rounded-full bg-[#0B3B25] px-3.5 py-1.5 text-[11px] font-black text-white shadow-xs active:scale-95"
                >
                  Confirm
                </button>
              </div>
            </div>

            {/* Pick Item 2 */}
            <div className="rounded-2xl bg-white p-3.5 shadow-2xs border border-[rgba(33,26,18,0.06)] text-xs">
              <div className="flex justify-between font-extrabold text-[#211A12]">
                <span>Order #AG12345610 — White Yam</span>
                <span className="text-[#0B3B25]">Ordered: 1.0 tuber</span>
              </div>
              <p className="mt-0.5 text-[11px] text-[#5C5247] font-semibold">Customer: Ama Serwaa (Ahodwo, Kumasi)</p>

              <div className="mt-2.5 flex items-center gap-2">
                <span className="text-[11.5px] font-bold text-[#211A12]">Actual Measured Weight:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={actualWeights['item-2']}
                    onChange={(e) => setActualWeights({ ...actualWeights, 'item-2': e.target.value })}
                    className="h-8 w-16 rounded-xl border border-[rgba(33,26,18,0.12)] bg-[#F7F5F0] text-center font-black text-[#0B3B25] outline-none"
                  />
                  <span className="font-bold text-[#5C5247]">kg</span>
                </div>
                <button
                  type="button"
                  className="ml-auto rounded-full bg-[#0B3B25] px-3.5 py-1.5 text-[11px] font-black text-white shadow-xs active:scale-95"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Fast Stock Availability Toggles */}
        <div className="rounded-[28px] bg-[#FDFDFB] p-5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <h2 className="text-[11px] font-black uppercase tracking-[0.14em] text-[#5C5247] pb-3 border-b border-[rgba(33,26,18,0.06)]">
            Quick Stock Sync (Tap to toggle)
          </h2>

          <div className="mt-3 space-y-2.5">
            {farmProducts.map((p) => {
              const inStock = stockStatus[p.id] ?? true
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-2xl bg-white p-3 shadow-2xs border border-[rgba(33,26,18,0.06)] text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[#F7F5F0]">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[#211A12]">{p.name}</h3>
                      <span className="text-[11px] text-[#0B3B25] font-black">
                        {formatGHS(p.priceMin)} / {p.variableWeight ? 'kg' : p.unit}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleStock(p.id)}
                    className={`rounded-full px-3.5 py-1.5 text-[11px] font-black shadow-xs transition-all active:scale-95 ${
                      inStock
                        ? 'bg-[#0B3B25] text-white'
                        : 'bg-[#DC2626]/10 text-[#DC2626]'
                    }`}
                  >
                    {inStock ? 'In Stock' : 'Sold Out'}
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
