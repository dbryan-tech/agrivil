'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search,
  Truck,
  Package,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShoppingBasket,
  ChevronRight,
} from 'lucide-react'
import { useDataStore } from '@/components/golden-acres/store/data-store'
import { useSession } from '@/components/golden-acres/auth/session-context'
import { formatGHS, shortDate } from '@/lib/golden-acres/format'
import type { OrderStatus } from '@/lib/golden-acres/types'

const STATUS_BADGE: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  placed: {
    label: 'Order Placed',
    className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  picking: {
    label: 'Harvesting & Picking',
    className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  packed: {
    label: 'Quality Packed',
    className: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  },
  'out-for-delivery': {
    label: 'Out for Delivery',
    className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  delivered: {
    label: 'Delivered',
    className: 'bg-emerald-600/15 text-emerald-700 dark:text-emerald-300',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  },
}

export default function OrdersIndexPage() {
  const router = useRouter()
  const { orders } = useDataStore()
  const { session, role } = useSession()
  const [lookupRef, setLookupRef] = useState('')

  function handleLookup(e: React.FormEvent) {
    e.preventDefault()
    const clean = lookupRef.trim().toUpperCase()
    if (clean) {
      router.push(`/orders/${encodeURIComponent(clean)}`)
    }
  }

  // Filter orders for the signed in customer if available, else show recent orders
  const myOrders =
    session && role === 'customer'
      ? orders.filter(
          (o) =>
            o.customerPhone === session.account.phone ||
            (session.account as { orderRefs?: string[] }).orderRefs?.includes(
              o.reference,
            ),
        )
      : orders.slice(0, 6)

  return (
    <div className="mx-auto max-w-5xl px-2 py-6 sm:px-3 lg:px-4">
      {/* Header */}
      <div className="text-center">
        <p className="ga-kicker font-extrabold text-[#7A3F1C]">Live Fulfillment</p>
        <h1 className="ga-headline mt-2 text-3xl font-black tracking-tight text-[#211A12] sm:text-4xl">
          Track your fresh harvest
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-sm sm:text-base text-[#5C5247]">
          Follow your perishable produce from farm harvest to hub cold-chain
          sorting, right to your doorstep.
        </p>

        {/* Quick lookup form */}
        <form
          onSubmit={handleLookup}
          className="mx-auto mt-8 flex max-w-md items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C5247]" />
            <input
              type="text"
              value={lookupRef}
              onChange={(e) => setLookupRef(e.target.value)}
              placeholder="e.g. GA-24817"
              aria-label="Order reference number"
              className="h-12 w-full rounded-full border border-black/[0.08] bg-white pl-10 pr-4 text-sm font-medium text-[#211A12] outline-none transition-all placeholder:text-[#5C5247]/60 focus:border-[#0B3B25] focus:ring-2 focus:ring-[#0B3B25]/20 shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="ga-press inline-flex h-12 items-center gap-1.5 rounded-full bg-[#0B3B25] px-6 text-sm font-black text-white shadow-sm transition-all hover:bg-[#072618]"
          >
            Track <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Orders List */}
      <div className="mt-14 space-y-4">
        <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
          <h2 className="ga-headline text-xl font-black text-[#211A12]">
            {session ? 'Your Recent Orders' : 'Recent Marketplace Deliveries'}
          </h2>
          <Link
            href="/shop"
            className="text-xs font-extrabold text-[#0B3B25] transition-colors hover:underline"
          >
            Shop more produce &rarr;
          </Link>
        </div>

        {myOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-black/[0.12] py-16 text-center bg-white/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EDE8DF] text-[#5C5247]">
              <ShoppingBasket className="h-6 w-6" />
            </div>
            <p className="mt-4 font-black text-[#211A12]">No orders yet</p>
            <p className="mt-1 text-xs sm:text-sm text-[#5C5247]">
              Browse our fresh farm produce and place your first order.
            </p>
            <Link
              href="/shop"
              className="ga-press mt-5 inline-flex items-center gap-2 rounded-full bg-[#0B3B25] px-5 py-2.5 text-xs font-black text-white shadow-sm hover:bg-[#072618]"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-3.5">
            {myOrders.map((order) => {
              const badge =
                STATUS_BADGE[order.status] ?? STATUS_BADGE.placed

              return (
                <div
                  key={order.reference}
                  className="flex flex-col justify-between gap-4 rounded-[20px] border border-black/[0.04] bg-white p-5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] transition-all sm:flex-row sm:items-center"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-black text-[#211A12]">
                        #{order.reference}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wide ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5C5247]">
                      <span>Placed on {shortDate(order.placedAt)}</span>
                      <span>&bull;</span>
                      <span>
                        {order.items.length} item
                        {order.items.length === 1 ? '' : 's'}
                      </span>
                      <span>&bull;</span>
                      <span className="font-black text-[#211A12]">
                        {formatGHS(order.total)}
                      </span>
                      <span>&bull;</span>
                      <span>{order.address.area}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/orders/${order.reference}`}
                      className="ga-press inline-flex h-9 items-center gap-1.5 rounded-full border border-black/[0.06] bg-[#F7F5F0] px-4 text-xs font-black text-[#211A12] transition-all hover:bg-[#EDE8DF]"
                    >
                      <Truck className="h-3.5 w-3.5 text-[#0B3B25]" /> Track
                      Delivery
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
