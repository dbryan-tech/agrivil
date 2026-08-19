'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  MoreVertical,
} from 'lucide-react'
import { formatGHS } from '@/lib/golden-acres/format'
import { cn } from '@/lib/utils'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'
import {
  StatusRibbon,
  PackageBoxes3D,
  DottedProgressTrack,
  ProductImageShell,
  type RibbonTone,
} from '@/app/preview/_lib/premium'

type Tab = 'all' | 'transit' | 'process' | 'delivered'

type RealOrder = {
  id: string
  trackingCode: string
  title: string
  farmerName: string
  ribbon: string
  ribbonTone: RibbonTone
  away?: string
  truckIndex?: number
  steps: { done: boolean }[]
  from: string
  fromDate: string
  to: string
  toDate: string
  image: string
  totalGHS: number
}

const ORDERS: RealOrder[] = [
  {
    id: 'GA-24817',
    trackingCode: 'SWFT-7781294',
    title: 'Organic Roma Tomatoes & Garden Eggs',
    farmerName: "Auntie Ama's Certified Farm (Koforidua)",
    ribbon: 'IN TRANSIT',
    ribbonTone: 'copper',
    away: '4 hours away',
    truckIndex: 2,
    steps: [{ done: true }, { done: true }, { done: false }, { done: false }],
    from: 'Koforidua Hub, Eastern Region',
    fromDate: 'Dawn Picked · 6:40 AM',
    to: 'East Legon, GA-183-4250, Accra',
    toDate: 'Est. 4:00 PM Today',
    image: '/golden-acres/produce/roma-tomatoes-1.png',
    totalGHS: 68.2,
  },
  {
    id: 'GA-24804',
    trackingCode: 'SWFT-6540192',
    title: 'Fresh Pona Yam Tuber & Scotch Bonnet',
    farmerName: 'Kwame Mensah Agro Collective (Ejisu)',
    ribbon: 'DISPATCH READY',
    ribbonTone: 'green',
    away: 'Departs 2:30 PM',
    truckIndex: 1,
    steps: [{ done: true }, { done: false }, { done: false }, { done: false }],
    from: 'Ejisu Aggregation Center, Ashanti',
    fromDate: 'FEFO Checked · 9:15 AM',
    to: 'KNUST Campus Gate, Kumasi',
    toDate: 'Tomorrow 9:00 AM',
    image: '/golden-acres/produce/white-yam.png',
    totalGHS: 54.0,
  },
  {
    id: 'GA-24761',
    trackingCode: 'SWFT-4491028',
    title: 'Sugarloaf Sweet Pineapple & Ginger Box',
    farmerName: 'Volta Green Smallholders (Ho)',
    ribbon: 'DELIVERED',
    ribbonTone: 'charcoal',
    truckIndex: 3,
    steps: [{ done: true }, { done: true }, { done: true }, { done: true }],
    from: 'Ho Central Depot, Volta',
    fromDate: 'Harvested May 18',
    to: 'Airport Residential, Accra',
    toDate: 'Signed by Kofi · May 19',
    image: '/golden-acres/produce/sweet-pineapple-1.png',
    totalGHS: 82.5,
  },
]

export default function MobileOrdersScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('all')

  const filtered = ORDERS.filter((o) => {
    if (activeTab === 'transit') return o.ribbonTone === 'copper'
    if (activeTab === 'process') return o.ribbonTone === 'green'
    if (activeTab === 'delivered') return o.ribbonTone === 'charcoal'
    return true
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

      {/* Top warm brand gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(240px,40vh,360px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.14) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      {/* Header Bar */}
      <header className="relative flex items-center justify-between px-5 pt-4 pb-2">
        <h1 className="text-[26px] font-extrabold tracking-tight text-[#211A12]">
          My Shipping
        </h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search Orders"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
          >
            <Search className="h-4 w-4 stroke-[2.4]" />
          </button>
          <button
            type="button"
            aria-label="Menu"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="relative px-5 pt-2">
        <div className="flex gap-2 rounded-2xl bg-[#FDFDFB] p-1 shadow-2xs">
          {(
            [
              { key: 'all', label: 'All Orders' },
              { key: 'transit', label: 'In Transit' },
              { key: 'process', label: 'Processing' },
              { key: 'delivered', label: 'Delivered' },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              className={cn(
                'flex-1 rounded-xl py-2 text-center text-[12px] font-bold transition-all',
                activeTab === t.key
                  ? 'bg-white text-[#211A12] shadow-xs'
                  : 'text-[#5C5247] hover:text-[#211A12]'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="relative px-5 pt-4 space-y-4">
        {filtered.map((order) => (
          <Link
            key={order.id}
            href={`/m/orders/track`}
            className="group relative block overflow-hidden rounded-[28px] bg-[#FDFDFB] p-5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] active:scale-[0.985] transition-all"
          >
            {/* Top-Right Diagonal Ribbon */}
            <StatusRibbon text={order.ribbon} tone={order.ribbonTone} />

            {/* Top Row: +40% Borderless Dynamic Product Image Shell + ID + Title + Farmer */}
            <div className="flex items-center gap-[clamp(12px,2vw,16px)] pr-16">
              <ProductImageShell
                src={order.image}
                alt={order.title}
                priority
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#5C5247]">
                  <span className="text-[#211A12] font-extrabold">{order.trackingCode}</span>
                  <span>·</span>
                  <span className="text-[#7A3F1C]">{order.id}</span>
                </div>
                <h3 className="mt-0.5 truncate text-[14.5px] font-black text-[#211A12] leading-tight">
                  {order.title}
                </h3>
                <p className="truncate text-[11.5px] font-semibold text-[#5C5247]">
                  {order.farmerName}
                </p>
                <p className="mt-0.5 text-[12.5px] font-black text-[#0B3B25]">
                  {formatGHS(order.totalGHS)}
                </p>
              </div>
            </div>

            {/* Dotted Cold-Chain Progress Track */}
            <div className="mt-4 pt-1">
              <DottedProgressTrack
                awayText={order.away}
                steps={order.steps}
                activeTruckIndex={order.truckIndex}
              />
            </div>

            {/* Origin & Destination Information */}
            <div className="mt-4 border-t border-[rgba(33,26,18,0.06)] pt-3.5">
              <div className="flex items-end justify-between">
                <div className="min-w-0 flex-1 space-y-2.5 pr-3">
                  <div>
                    <span className="text-[9.5px] font-black uppercase tracking-[0.16em] text-[#5C5247]">
                      FROM (COLD HUB)
                    </span>
                    <h4 className="mt-0.5 truncate text-[13px] font-bold text-[#211A12]">
                      {order.from}
                    </h4>
                    <p className="mt-0.5 text-[11.5px] font-semibold text-[#5C5247]">
                      {order.fromDate}
                    </p>
                  </div>

                  <div>
                    <span className="text-[9.5px] font-black uppercase tracking-[0.16em] text-[#5C5247]">
                      DELIVERY DESTINATION
                    </span>
                    <h4 className="mt-0.5 truncate text-[13px] font-bold text-[#211A12]">
                      {order.to}
                    </h4>
                    <p className="mt-0.5 text-[11.5px] font-semibold text-[#5C5247]">
                      {order.toDate}
                    </p>
                  </div>
                </div>

                {/* 3D Stacked Cardboard Packaging Boxes */}
                <div className="shrink-0 -mb-2 -mr-2">
                  <PackageBoxes3D size={84} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}

