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
    <div className="min-h-dvh bg-[#F4F1EA] pb-24 text-[#2B1F17]">
      {/* App Bar */}
      <header
        className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#E0DACB]/80 bg-[#F4F1EA]/95 px-4 backdrop-blur-md"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <Link
          href="/m/account"
          aria-label="Back"
          className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="flex flex-col text-center">
          <h1 className="text-sm font-extrabold text-[#2B1F17]">
            Farmer Cockpit
          </h1>
          <span className="text-[10px] text-[#1E5D3B] font-bold">Adwoa Sarponaa Farms</span>
        </div>

        <Link
          href="/m"
          className="rounded-full bg-[#1E5D3B]/10 px-2.5 py-1 text-[10px] font-bold text-[#1E5D3B]"
        >
          Store View
        </Link>
      </header>

      <div className="px-4 py-4 space-y-4">
        {/* 1. MoMo 48h Settlement Balance Card */}
        <div className="rounded-3xl bg-[#1E5D3B] p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/80">Available MoMo Balance</span>
            <span className="rounded-full bg-[#A3E635] px-2 py-0.5 text-[9px] font-extrabold text-[#144028]">
              48h Auto-Payout Active
            </span>
          </div>
          <h2 className="mt-2 text-2xl font-extrabold text-white">
            {formatGHS(2480.0)}
          </h2>
          <p className="mt-1 text-[11px] text-white/80">
            Next settlement to MTN MoMo (024 123 4567) at 5:00 PM today.
          </p>
        </div>

        {/* 2. Today's Pick List & Variable Weight Reconciler */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E0DACB]/60">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-[#1E5D3B]" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#2B1F17]">
                Today&apos;s Packing List (2 orders)
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#E67A2E]">Pickup 10:30 AM</span>
          </div>

          <div className="mt-3 space-y-3">
            {/* Pick Item 1 */}
            <div className="rounded-2xl bg-[#F4F1EA] p-3 text-xs">
              <div className="flex justify-between font-extrabold text-[#2B1F17]">
                <span>Order #AG12345678 — Fresh Tomatoes</span>
                <span className="text-[#1E5D3B]">Ordered: 2.0 kg</span>
              </div>
              <p className="mt-0.5 text-[10px] text-[#6E6A63]">Customer: Ewoke Mensah (KNUST, Kumasi)</p>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#2B1F17]">Actual Measured Weight:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={actualWeights['item-1']}
                    onChange={(e) => setActualWeights({ ...actualWeights, 'item-1': e.target.value })}
                    className="h-8 w-16 rounded-xl border border-[#E0DACB] bg-white text-center font-bold text-[#1E5D3B] outline-none"
                  />
                  <span className="font-bold text-[#6E6A63]">kg</span>
                </div>
                <button
                  type="button"
                  className="ga-press ml-auto rounded-xl bg-[#1E5D3B] px-3 py-1.5 text-[10px] font-bold text-white shadow-xs"
                >
                  Confirm Weight
                </button>
              </div>
            </div>

            {/* Pick Item 2 */}
            <div className="rounded-2xl bg-[#F4F1EA] p-3 text-xs">
              <div className="flex justify-between font-extrabold text-[#2B1F17]">
                <span>Order #AG12345610 — White Yam</span>
                <span className="text-[#1E5D3B]">Ordered: 1.0 tuber</span>
              </div>
              <p className="mt-0.5 text-[10px] text-[#6E6A63]">Customer: Ama Serwaa (Ahodwo, Kumasi)</p>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#2B1F17]">Actual Measured Weight:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={actualWeights['item-2']}
                    onChange={(e) => setActualWeights({ ...actualWeights, 'item-2': e.target.value })}
                    className="h-8 w-16 rounded-xl border border-[#E0DACB] bg-white text-center font-bold text-[#1E5D3B] outline-none"
                  />
                  <span className="font-bold text-[#6E6A63]">kg</span>
                </div>
                <button
                  type="button"
                  className="ga-press ml-auto rounded-xl bg-[#1E5D3B] px-3 py-1.5 text-[10px] font-bold text-white shadow-xs"
                >
                  Confirm Weight
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Fast Stock Availability Toggles */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#2B1F17] pb-3 border-b border-[#E0DACB]/60">
            Quick Stock Sync (Tap to toggle)
          </h2>

          <div className="mt-3 space-y-2.5">
            {farmProducts.map((p) => {
              const inStock = stockStatus[p.id] ?? true
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-2xl bg-[#F4F1EA] p-2.5 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[#2B1F17]">{p.name}</h3>
                      <span className="text-[10px] text-[#1E5D3B] font-bold">
                        {formatGHS(p.priceMin)} / {p.variableWeight ? 'kg' : p.unit}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleStock(p.id)}
                    className={`ga-press rounded-xl px-3 py-1.5 text-[10px] font-extrabold shadow-xs transition-colors ${
                      inStock
                        ? 'bg-[#1E5D3B] text-white'
                        : 'bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/30'
                    }`}
                  >
                    {inStock ? 'In Stock (Active)' : 'Sold Out (Hidden)'}
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
