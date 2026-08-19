'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  MoreVertical,
  Home,
  FileText,
  Wallet,
  User,
} from 'lucide-react'
import { formatGHS } from '@/lib/golden-acres/format'
import { cn } from '@/lib/utils'
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
  itemCount: number
  status: 'transit' | 'process' | 'delivered'
}

export default function MobileOrdersScreen() {
  const [tab, setTab] = useState<Tab>('all')
  const [search, setSearch] = useState('')

  // Streaming real AgriVil catalog produce, farmers, hubs, and seed orders
  const orders: RealOrder[] = [
    {
      id: 'GA-24817',
      trackingCode: 'SWFT-7781294',
      title: 'Roma Tomatoes & Plantain Box',
      farmerName: "Auntie Ama's Garden, Koforidua",
      ribbon: 'TRANSIT',
      ribbonTone: 'copper',
      away: '4h Away',
      truckIndex: 2,
      steps: [{ done: true }, { done: true }, { done: true }, { done: false }],
      from: 'Tema Hub, Greater Accra',
      fromDate: 'Today, 6:40 AM',
      to: 'East Legon (GA-183-4250)',
      toDate: 'Estimated Today 4:00 PM',
      image: '/golden-acres/produce/roma-tomatoes-1.png',
      totalGHS: 58.2,
      itemCount: 3,
      status: 'transit',
    },
    {
      id: 'GA-24820',
      trackingCode: 'SWFT-7781305',
      title: 'Red Onions & Scotch Bonnets',
      farmerName: 'Adwoa Sarpong, Sunrise Fields',
      ribbon: 'PROCESS',
      ribbonTone: 'charcoal',
      away: '2d Away',
      truckIndex: 1,
      steps: [{ done: true }, { done: true }, { done: false }, { done: false }],
      from: 'Techiman Hub, Bono',
      fromDate: '18 Oct 25',
      to: 'Osu (GA-155-9920)',
      toDate: 'Estimated 20 Oct 26',
      image: '/golden-acres/produce/red-onions-1.png',
      totalGHS: 56.0,
      itemCount: 4,
      status: 'process',
    },
    {
      id: 'GA-24816',
      trackingCode: 'SWFT-7780981',
      title: 'Sugarloaf Pineapple & Lettuce',
      farmerName: 'Kojo Asante, Riverside Farm',
      ribbon: 'DELIVERED',
      ribbonTone: 'green',
      steps: [{ done: true }, { done: true }, { done: true }, { done: true }],
      from: 'Winneba Hub, Central',
      fromDate: '17 Oct 25',
      to: 'Cantonments (GA-201-7788)',
      toDate: 'Delivered 18 Oct 25',
      image: '/golden-acres/produce/sweet-pineapple-1.png',
      totalGHS: 66.2,
      itemCount: 5,
      status: 'delivered',
    },
    {
      id: 'GA-24809',
      trackingCode: 'SWFT-7780540',
      title: 'White Yam Tubers & Kontomire',
      farmerName: 'Kwame Mensah Family Farm',
      ribbon: 'DELIVERED',
      ribbonTone: 'green',
      steps: [{ done: true }, { done: true }, { done: true }, { done: true }],
      from: 'Ejisu Hub, Ashanti',
      fromDate: '15 Oct 25',
      to: 'Spintex (GA-339-1042)',
      toDate: 'Delivered 17 Oct 25',
      image: '/golden-acres/produce/white-yam.png',
      totalGHS: 33.4,
      itemCount: 3,
      status: 'delivered',
    },
  ]

  const counts = {
    all: orders.length,
    transit: orders.filter((o) => o.status === 'transit').length,
    process: orders.filter((o) => o.status === 'process').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  }

  const filteredOrders = orders.filter((o) => {
    if (tab === 'transit' && o.status !== 'transit') return false
    if (tab === 'process' && o.status !== 'process') return false
    if (tab === 'delivered' && o.status !== 'delivered') return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        o.id.toLowerCase().includes(q) ||
        o.trackingCode.toLowerCase().includes(q) ||
        o.title.toLowerCase().includes(q) ||
        o.farmerName.toLowerCase().includes(q) ||
        o.from.toLowerCase().includes(q) ||
        o.to.toLowerCase().includes(q)
      )
    }
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

      {/* Top clean & bright warm brand gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(200px,36vh,320px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.12) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      {/* Header Row */}
      <div className="relative px-[clamp(14px,2.4vw,20px)] pt-[clamp(8px,1.4vh,16px)] flex items-center justify-between">
        <h1 className="text-[clamp(24px,3.4vh,30px)] font-extrabold tracking-[-0.03em] text-[#211A12] leading-none">
          My Shipping
        </h1>
        <button
          type="button"
          aria-label="Options"
          className="flex h-[clamp(34px,4.5vh,40px)] w-[clamp(34px,4.5vh,40px)] items-center justify-center rounded-full bg-white text-[#211A12] shadow-[0_1px_4px_rgba(33,26,18,0.06)] border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform shrink-0"
        >
          <MoreVertical className="h-[clamp(16px,2.2vh,20px)] w-[clamp(16px,2.2vh,20px)]" />
        </button>
      </div>

      {/* Search Bar - High Contrast Text & Placeholder */}
      <div className="relative mt-[clamp(10px,1.6vh,16px)] px-[clamp(14px,2.4vw,20px)]">
        <div className="flex h-[clamp(44px,5.5vh,50px)] w-full items-center rounded-full bg-white px-[clamp(12px,1.8vw,16px)] shadow-[0_2px_8px_rgba(33,26,18,0.04)] border border-[rgba(33,26,18,0.10)] transition-all focus-within:ring-2 focus-within:ring-[#7A3F1C]">
          <Search className="h-[clamp(16px,2.2vh,19px)] w-[clamp(16px,2.2vh,19px)] text-[#5C5247] stroke-[2.3] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your parcel or farm"
            className="w-full bg-transparent pl-2.5 text-[clamp(13px,1.65vh,15px)] font-medium text-[#211A12] placeholder:text-[#7A6E61] outline-none"
          />
        </div>
      </div>

      {/* Filter Tabs - Calibrated High Visibility Colors */}
      <div className="relative mt-[clamp(8px,1.3vh,14px)] flex gap-[clamp(6px,1vw,10px)] overflow-x-auto px-[clamp(14px,2.4vw,20px)] pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* All */}
        <button
          type="button"
          onClick={() => setTab('all')}
          className={cn(
            'flex shrink-0 items-center gap-1.5 rounded-full px-[clamp(12px,1.8vw,18px)] py-[clamp(5px,0.8vh,8px)] text-[clamp(12px,1.55vh,14px)] font-bold tracking-tight transition-all',
            tab === 'all'
              ? 'bg-[#211A12] text-[#F7F5F0] shadow-xs'
              : 'bg-[#FAF9F6] text-[#3D332A] border border-[rgba(33,26,18,0.10)] shadow-2xs hover:bg-white'
          )}
        >
          <span>All</span>
          <span className={cn('text-[clamp(11px,1.4vh,13px)] font-extrabold', tab === 'all' ? 'text-[#F7F5F0]/85' : 'text-[#5C5247]')}>
            {counts.all}
          </span>
        </button>

        {/* Transit */}
        <button
          type="button"
          onClick={() => setTab('transit')}
          className={cn(
            'flex shrink-0 items-center gap-1.5 rounded-full px-[clamp(12px,1.8vw,18px)] py-[clamp(5px,0.8vh,8px)] text-[clamp(12px,1.55vh,14px)] font-bold tracking-tight transition-all',
            tab === 'transit'
              ? 'bg-[#211A12] text-[#F7F5F0] shadow-xs'
              : 'bg-[#FAF9F6] text-[#3D332A] border border-[rgba(33,26,18,0.10)] shadow-2xs hover:bg-white'
          )}
        >
          <span>Transit</span>
          <span className={cn('text-[clamp(11px,1.4vh,13px)] font-extrabold', tab === 'transit' ? 'text-[#F7F5F0]/85' : 'text-[#5C5247]')}>
            {counts.transit}
          </span>
        </button>

        {/* On Process */}
        <button
          type="button"
          onClick={() => setTab('process')}
          className={cn(
            'flex shrink-0 items-center gap-1.5 rounded-full px-[clamp(12px,1.8vw,18px)] py-[clamp(5px,0.8vh,8px)] text-[clamp(12px,1.55vh,14px)] font-bold tracking-tight transition-all',
            tab === 'process'
              ? 'bg-[#211A12] text-[#F7F5F0] shadow-xs'
              : 'bg-[#FAF9F6] text-[#3D332A] border border-[rgba(33,26,18,0.10)] shadow-2xs hover:bg-white'
          )}
        >
          <span>On Process</span>
          <span className={cn('text-[clamp(11px,1.4vh,13px)] font-extrabold', tab === 'process' ? 'text-[#F7F5F0]/85' : 'text-[#5C5247]')}>
            {counts.process}
          </span>
        </button>

        {/* Delivered */}
        <button
          type="button"
          onClick={() => setTab('delivered')}
          className={cn(
            'flex shrink-0 items-center gap-1.5 rounded-full px-[clamp(12px,1.8vw,18px)] py-[clamp(5px,0.8vh,8px)] text-[clamp(12px,1.55vh,14px)] font-bold tracking-tight transition-all',
            tab === 'delivered'
              ? 'bg-[#211A12] text-[#F7F5F0] shadow-xs'
              : 'bg-[#FAF9F6] text-[#3D332A] border border-[rgba(33,26,18,0.10)] shadow-2xs hover:bg-white'
          )}
        >
          <span>Delivered</span>
          <span className={cn('text-[clamp(11px,1.4vh,13px)] font-extrabold', tab === 'delivered' ? 'text-[#F7F5F0]/85' : 'text-[#5C5247]')}>
            {counts.delivered}
          </span>
        </button>
      </div>

      {/* Cards List - High Contrast Clear Typography */}
      <div className="relative mt-[clamp(8px,1.4vh,14px)] px-[clamp(14px,2.4vw,20px)] space-y-[clamp(10px,1.6vh,16px)]">
        {filteredOrders.map((order) => (
          <Link
            key={order.id}
            href={`/preview/track?id=${order.id}`}
            className="block active:scale-[0.985] transition-transform"
          >
            <div className="relative overflow-hidden rounded-[clamp(22px,2.8vh,28px)] bg-[#FAF9F6] p-[clamp(14px,2vh,20px)] shadow-[0_2px_10px_-2px_rgba(33,26,18,0.05),0_8px_20px_-6px_rgba(33,26,18,0.08)] border border-[rgba(33,26,18,0.08)] ring-1 ring-white/90">
              {/* Diagonal Status Ribbon in Corner */}
              <StatusRibbon label={order.ribbon} tone={order.ribbonTone} />

              {/* Top Row: +40% Borderless Dynamic Product Image Shell + ID + Title + Farmer */}
              <div className="flex items-center gap-[clamp(12px,2vw,16px)] pr-16">
                <ProductImageShell
                  src={order.image}
                  alt={order.title}
                  priority
                />

                <div className="min-w-0 flex-1">
                  <h2 className="text-[clamp(14px,1.8vh,16.5px)] font-extrabold tracking-tight text-[#211A12] leading-snug">
                    ID: {order.id}
                  </h2>
                  <p className="mt-0.5 truncate text-[clamp(12.5px,1.6vh,14.5px)] font-bold text-[#211A12]">
                    {order.title}
                  </p>
                  <p className="truncate text-[clamp(11px,1.4vh,12.5px)] font-semibold text-[#5C5247]">
                    {order.farmerName}
                  </p>
                  <p className="mt-0.5 text-[clamp(11.5px,1.45vh,13.5px)] font-extrabold text-[#0B3B25]">
                    {formatGHS(order.totalGHS)}
                  </p>
                </div>
              </div>

              {/* Middle Row: Dotted Progress Track */}
              <div className="mt-0.5 px-0.5">
                <DottedProgressTrack
                  steps={order.steps}
                  away={order.away}
                  truckIndex={order.truckIndex}
                  tone={order.status === 'delivered' ? 'green' : 'copper'}
                />
              </div>

              {/* Bottom Row: FROM / TO Route + 3D Packaging Boxes */}
              <div className="relative mt-0.5 flex items-end justify-between">
                <div className="grid grid-cols-2 gap-[clamp(8px,1.5vw,16px)] flex-1 pr-1">
                  {/* FROM */}
                  <div>
                    <p className="text-[clamp(9.5px,1.25vh,11px)] font-black uppercase tracking-[0.14em] text-[#5C5247]">
                      FROM
                    </p>
                    <h4 className="mt-0.5 truncate text-[clamp(12px,1.55vh,14px)] font-bold text-[#211A12]">
                      {order.from}
                    </h4>
                    <p className="mt-0.5 text-[clamp(10.5px,1.35vh,12px)] font-semibold text-[#5C5247]">
                      {order.fromDate}
                    </p>
                  </div>

                  {/* TO */}
                  <div>
                    <p className="text-[clamp(9.5px,1.25vh,11px)] font-black uppercase tracking-[0.14em] text-[#5C5247]">
                      TO
                    </p>
                    <h4 className="mt-0.5 truncate text-[clamp(12px,1.55vh,14px)] font-bold text-[#211A12]">
                      {order.to}
                    </h4>
                    <p className="mt-0.5 text-[clamp(10.5px,1.35vh,12px)] font-semibold text-[#5C5247]">
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

      {/* Bottom Navigation Bar */}
      <PreviewBottomNav active="orders" />
    </div>
  )
}
