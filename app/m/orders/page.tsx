'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Search,
  MoreVertical,
  Truck,
  Check,
} from 'lucide-react'
import { formatGHS } from '@/lib/golden-acres/format'
import { cn } from '@/lib/utils'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'
import { PackageBoxes3D } from '@/app/preview/_lib/premium'

type Tab = 'all' | 'transit' | 'process' | 'delivered'

type OrderItem = {
  id: string
  trackingCode: string
  title: string
  farmerName: string
  status: 'TRANSIT' | 'PROCESS' | 'DELIVERED'
  ribbonColor: string
  awayText: string
  truckIndex: number
  steps: { done: boolean }[]
  from: string
  fromDate: string
  to: string
  toDate: string
  image: string
  totalGHS: number
}

const ORDERS: OrderItem[] = [
  {
    id: 'D314315783',
    trackingCode: 'SWFT-7781294',
    title: 'Organic Roma Tomatoes & Garden Eggs',
    farmerName: "Auntie Ama's Certified Farm",
    status: 'TRANSIT',
    ribbonColor: '#E86328',
    awayText: '4h Away',
    truckIndex: 2,
    steps: [{ done: true }, { done: true }, { done: false }, { done: false }],
    from: 'Koforidua Hub',
    fromDate: '18 Oct 25',
    to: 'East Legon, Accra',
    toDate: 'Estimated 19 Oct 26',
    image: '/golden-acres/produce/roma-tomatoes-1.png',
    totalGHS: 68.2,
  },
  {
    id: 'D514315784',
    trackingCode: 'SWFT-6540192',
    title: 'Fresh Pona Yam Tuber & Scotch Bonnet',
    farmerName: 'Kwame Mensah Agro Collective',
    status: 'PROCESS',
    ribbonColor: '#211A12',
    awayText: '2d Away',
    truckIndex: 1,
    steps: [{ done: true }, { done: false }, { done: false }, { done: false }],
    from: 'Ejisu Aggregation Center',
    fromDate: '18 Oct 25',
    to: 'KNUST Gate, Kumasi',
    toDate: 'Estimated 19 Oct 26',
    image: '/golden-acres/produce/white-yam.png',
    totalGHS: 54.0,
  },
  {
    id: 'D314315785',
    trackingCode: 'SWFT-4491028',
    title: 'Sugarloaf Sweet Pineapple & Ginger Box',
    farmerName: 'Volta Green Smallholders',
    status: 'DELIVERED',
    ribbonColor: '#16A34A',
    awayText: 'Delivered',
    truckIndex: 3,
    steps: [{ done: true }, { done: true }, { done: true }, { done: true }],
    from: 'Ho Central Depot',
    fromDate: '16 Oct 25',
    to: 'Airport Residential, Accra',
    toDate: 'Signed by Kofi · 17 Oct',
    image: '/golden-acres/produce/sweet-pineapple-1.png',
    totalGHS: 82.5,
  },
]

export default function MobileOrdersScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const counts = {
    all: ORDERS.length,
    transit: ORDERS.filter((o) => o.status === 'TRANSIT').length,
    process: ORDERS.filter((o) => o.status === 'PROCESS').length,
    delivered: ORDERS.filter((o) => o.status === 'DELIVERED').length,
  }

  const filtered = ORDERS.filter((order) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'transit' && order.status === 'TRANSIT') ||
      (activeTab === 'process' && order.status === 'PROCESS') ||
      (activeTab === 'delivered' && order.status === 'DELIVERED')

    const q = searchQuery.trim().toLowerCase()
    const matchesSearch =
      !q ||
      order.id.toLowerCase().includes(q) ||
      order.trackingCode.toLowerCase().includes(q) ||
      order.title.toLowerCase().includes(q) ||
      order.farmerName.toLowerCase().includes(q)

    return matchesTab && matchesSearch
  })

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

      {/* Top warm brand radiant gradient backdrop (Seamless Harvest Glow) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(280px,48vh,400px)] z-0"
        style={{
          background:
            'radial-gradient(130% 95% at 50% 0%, rgba(223, 136, 33, 0.20) 0%, rgba(240, 168, 30, 0.08) 35%, rgba(247, 245, 240, 0.6) 75%, rgba(247, 245, 240, 1) 100%)',
        }}
      />

      {/* Header Bar */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between border-b border-[rgba(33,26,18,0.06)] bg-[#FAF9F6]/90 px-1.5 py-2.5 backdrop-blur-md transition-colors"
        style={{
          paddingTop: 'max(env(safe-area-inset-top, 0px), 36px)',
          paddingBottom: '12px',
        }}
      >
        <h1 className="text-[24px] font-black tracking-tight text-[#211A12]">
          My Shipping
        </h1>
        <button
          type="button"
          aria-label="Menu"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#211A12] shadow-xs border border-[rgba(33,26,18,0.06)] active:scale-95 transition-transform"
        >
          <MoreVertical className="h-4.5 w-4.5" />
        </button>
      </header>

      {/* Search Bar */}
      <div className="relative px-1.5 pt-2">
        <div className="flex h-11 w-full items-center gap-2.5 rounded-full bg-white px-4 shadow-2xs border border-[rgba(33,26,18,0.06)]">
          <Search className="h-4 w-4 text-[#5C5247] stroke-[2.2]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your parcel"
            className="w-full bg-transparent text-[13px] text-[#211A12] placeholder-[#8A7E72] outline-none font-medium"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="relative px-1.5 pt-2.5 overflow-x-auto [scrollbar-width:none]">
        <div className="flex gap-1.5 min-w-max pb-1">
          {[
            { key: 'all' as const, label: 'All', count: counts.all },
            { key: 'transit' as const, label: 'Transit', count: counts.transit },
            { key: 'process' as const, label: 'On Process', count: counts.process },
            { key: 'delivered' as const, label: 'Delivered', count: counts.delivered },
          ].map((t) => {
            const isActive = activeTab === t.key
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key)}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11.5px] font-extrabold transition-all active:scale-95 shadow-2xs',
                  isActive
                    ? 'bg-[#211A12] text-white shadow-xs'
                    : 'bg-white text-[#5C5247] border border-[rgba(33,26,18,0.08)] hover:text-[#211A12]'
                )}
              >
                <span>{t.label}</span>
                <span
                  className={cn(
                    'flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-black',
                    isActive ? 'bg-white/20 text-white' : 'bg-[#F7F5F0] text-[#5C5247]'
                  )}
                >
                  {t.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Orders List */}
      <div className="relative px-1.5 pt-2 space-y-2">
        {filtered.map((order) => (
          <Link
            key={order.id}
            href={`/m/orders/track`}
            className="group relative block overflow-hidden rounded-[24px] bg-white p-3.5 shadow-[0_2px_14px_rgba(0,0,0,0.04)] border border-[rgba(33,26,18,0.04)] active:scale-[0.985] transition-all"
          >
            {/* Top-Right Diagonal Ribbon Badge */}
            <div className="pointer-events-none absolute -right-9 top-3.5 z-20 w-32 rotate-45 text-center shadow-xs">
              <div
                className="py-[3px] text-center"
                style={{ backgroundColor: order.ribbonColor }}
              >
                <span className="text-[9.5px] font-black uppercase tracking-[0.14em] text-white antialiased">
                  {order.status}
                </span>
              </div>
            </div>

            {/* Top Row: Thumbnail + ID + Product Title */}
            <div className="flex items-center gap-3 pr-14">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#F7F5F0] flex items-center justify-center p-1.5">
                <Image
                  src={order.image}
                  alt={order.title}
                  fill
                  sizes="48px"
                  className="object-contain p-0.5"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-black text-[#211A12]">
                  ID: {order.id}
                </div>
                <div className="truncate text-[11.5px] font-semibold text-[#5C5247]">
                  {order.title}
                </div>
              </div>
            </div>

            {/* Middle Row: Dotted Progress Track */}
            <div className="relative mt-2.5 pt-4 pb-1">
              <div className="absolute left-3 right-3 top-[23px] flex items-center">
                <div className="h-[2px] w-full border-t-2 border-dotted border-[rgba(33,26,18,0.22)]" />
              </div>

              <div className="relative flex items-center justify-between">
                {order.steps.map((step, idx) => {
                  const isTruck = idx === order.truckIndex
                  const isDone = step.done && !isTruck
                  const activeColor = order.ribbonColor

                  return (
                    <div key={idx} className="relative flex flex-col items-center">
                      {isTruck && order.awayText && (
                        <div className="absolute -top-4.5 whitespace-nowrap">
                          <span className="text-[10px] font-black text-[#211A12]">
                            {order.awayText}
                          </span>
                        </div>
                      )}

                      <div
                        className={cn(
                          'z-10 flex h-6 w-6 items-center justify-center rounded-full transition-all shadow-xs',
                          (isDone || isTruck) ? 'text-white' : 'border-2 border-[rgba(33,26,18,0.20)] bg-white text-[#5C5247]'
                        )}
                        style={{
                          backgroundColor: isDone || isTruck ? activeColor : '#FFFFFF',
                        }}
                      >
                        {isTruck ? (
                          <Truck className="h-3 w-3 stroke-[2.5]" />
                        ) : isDone ? (
                          <Check className="h-3 w-3 stroke-[3]" />
                        ) : (
                          <Check className="h-2.5 w-2.5 stroke-[2] text-[#8A7E72]" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Bottom Row: FROM / TO */}
            <div className="mt-2.5 border-t border-[rgba(33,26,18,0.06)] pt-2.5">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[9.5px] font-black uppercase tracking-wider text-[#8A7E72]">
                    FROM
                  </span>
                  <p className="text-[12.5px] font-black text-[#211A12] leading-tight">
                    {order.from}
                  </p>
                  <span className="text-[10px] text-[#5C5247] font-semibold">{order.fromDate}</span>
                </div>

                <div className="text-right">
                  <span className="text-[9.5px] font-black uppercase tracking-wider text-[#8A7E72]">
                    TO
                  </span>
                  <p className="text-[12.5px] font-black text-[#211A12] leading-tight">
                    {order.to}
                  </p>
                  <span className="text-[10px] text-[#5C5247] font-semibold">{order.toDate}</span>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between border-t border-[rgba(33,26,18,0.04)] pt-1.5 text-[11.5px]">
                <span className="text-[#5C5247] font-bold">Total Bill</span>
                <span className="font-black text-[#0B3B25]">{formatGHS(order.totalGHS)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <MobileBottomNav />
    </div>
  )
}
