'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ChevronRight,
  ArrowRight,
  RotateCcw,
} from 'lucide-react'
import { seedOrders } from '@/lib/golden-acres/data'
import { formatGHS } from '@/lib/golden-acres/format'
import { MobileAppBar } from '@/components/golden-acres/mobile/mobile-app-bar'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'
import { cn } from '@/lib/utils'

export default function MobileOrdersScreen() {
  const [tab, setTab] = useState<'all' | 'ongoing' | 'completed' | 'cancelled'>('all')

  const orders = [
    {
      id: 'AG-12345678',
      date: 'May 22, 2026',
      status: 'out_for_delivery',
      statusLabel: 'Out for Delivery',
      eta: 'Arriving 11:30 AM',
      itemsCount: 3,
      total: 42.0,
      image: '/golden-acres/produce/roma-tomatoes-1.png',
      isOngoing: true,
    },
    {
      id: 'AG-12345610',
      date: 'May 20, 2026',
      status: 'delivered',
      statusLabel: 'Delivered',
      eta: 'Delivered May 20',
      itemsCount: 2,
      total: 38.5,
      image: '/golden-acres/produce/sweet-pineapple-1.png',
      isOngoing: false,
    },
    {
      id: 'AG-12345590',
      date: 'May 18, 2026',
      status: 'delivered',
      statusLabel: 'Delivered',
      eta: 'Delivered May 18',
      itemsCount: 4,
      total: 27.0,
      image: '/golden-acres/produce/white-yam.png',
      isOngoing: false,
    },
    {
      id: 'AG-12345560',
      date: 'May 16, 2026',
      status: 'cancelled',
      statusLabel: 'Cancelled',
      eta: 'Cancelled by user',
      itemsCount: 1,
      total: 18.0,
      image: '/golden-acres/produce/avocado.png',
      isOngoing: false,
    },
  ]

  const filteredOrders = orders.filter((o) => {
    if (tab === 'ongoing') return o.isOngoing
    if (tab === 'completed') return o.status === 'delivered'
    if (tab === 'cancelled') return o.status === 'cancelled'
    return true
  })

  return (
    <div className="min-h-dvh bg-[#F4F1EA] pb-24 text-[#2B1F17]">
      <MobileAppBar title="My Orders" showSearch showCart />

      {/* Tabs */}
      <div className="flex border-b border-[#E0DACB]/80 bg-[#F4F1EA] px-4 pt-2">
        {(['all', 'ongoing', 'completed', 'cancelled'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              'flex-1 py-3 text-xs font-bold capitalize transition-colors border-b-2',
              tab === t
                ? 'border-[#1E5D3B] text-[#1E5D3B]'
                : 'border-transparent text-[#6E6A63] hover:text-[#2B1F17]'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="px-4 py-4 space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="mt-16 text-center">
            <Package className="mx-auto h-12 w-12 text-[#6E6A63]/50" />
            <h3 className="mt-3 text-sm font-bold text-[#2B1F17]">No {tab} orders</h3>
            <p className="mt-1 text-xs text-[#6E6A63]">Orders you place will appear here in real-time.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isOut = order.status === 'out_for_delivery'
            const isDelivered = order.status === 'delivered'

            return (
              <Link
                key={order.id}
                href={`/m/orders/${order.id}`}
                className="ga-press block rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs hover:border-[#1E5D3B]/40"
              >
                <div className="flex items-center justify-between border-b border-[#E0DACB]/60 pb-3">
                  <div>
                    <span className="text-xs font-extrabold text-[#2B1F17]">
                      #{order.id}
                    </span>
                    <p className="text-[10px] text-[#6E6A63]">{order.date}</p>
                  </div>
                  <span className="text-sm font-extrabold text-[#1E5D3B]">
                    {formatGHS(order.total)}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#F4F1EA]">
                      <Image
                        src={order.image}
                        alt="Produce"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        {isOut && <Truck className="h-3.5 w-3.5 text-[#E67A2E] animate-bounce" />}
                        {isDelivered && <CheckCircle2 className="h-3.5 w-3.5 text-[#1E5D3B]" />}
                        <span
                          className={cn(
                            'text-xs font-bold',
                            isOut && 'text-[#E67A2E]',
                            isDelivered && 'text-[#1E5D3B]',
                            order.status === 'cancelled' && 'text-[#DC2626]'
                          )}
                        >
                          {order.statusLabel}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#6E6A63]">{order.eta}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-[#1E5D3B]">
                    <span>Track</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>

      <MobileBottomNav />
    </div>
  )
}
