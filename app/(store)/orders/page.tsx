'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ArrowRight, ShoppingBasket, Package } from 'lucide-react'
import { useDataStore } from '@/components/golden-acres/store/data-store'
import { useSession } from '@/components/golden-acres/auth/session-context'
import { formatGHS, shortDate } from '@/lib/golden-acres/format'
import type { OrderStatus } from '@/lib/golden-acres/types'

const STATUS_LABEL: Record<OrderStatus, string> = {
  placed: 'Order placed',
  picking: 'Harvesting',
  packed: 'Packed at hub',
  'out-for-delivery': 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const STATUS_TONE: Record<OrderStatus, string> = {
  placed: 'text-[#8A7E72]',
  picking: 'text-[#7A3F1C]',
  packed: 'text-[#7A3F1C]',
  'out-for-delivery': 'text-[#0B3B25] font-semibold',
  delivered: 'text-[#0F7A43] font-semibold',
  cancelled: 'text-[#B91C1C]',
}

/**
 * Orders index (redesigned, docs/redesign/02 §6).
 * Editorial header with ref-lookup, then hairline list rows: reference,
 * date, status as quiet text (color-only never), total, Track link.
 */
export default function OrdersIndexPage() {
  const router = useRouter()
  const { orders } = useDataStore()
  const { session, role } = useSession()
  const [lookupRef, setLookupRef] = useState('')

  function handleLookup(e: React.FormEvent) {
    e.preventDefault()
    const clean = lookupRef.trim().toUpperCase()
    if (clean) router.push(`/orders/${encodeURIComponent(clean)}`)
  }

  // Signed-in customers see their own orders; guests see recent marketplace
  // deliveries (existing behavior preserved).
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
    <main className="min-h-[70vh] bg-[#F7F5F0] pb-20 pt-32">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        {/* Editorial header */}
        <p className="text-[13px] font-semibold text-[#7A3F1C]">Your orders</p>
        <h1 className="ga-display-title mt-2 text-[clamp(30px,3.6vw,48px)] text-[#211A12]">
          Track your fresh harvest.
        </h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[#5C5247]">
          Follow your produce from farm harvest to hub cold-chain sorting,
          right to your doorstep.
        </p>

        {/* Ref lookup */}
        <form onSubmit={handleLookup} className="mt-8 flex max-w-md items-center gap-3">
          <div className="relative flex-1">
            <Search
              width={16}
              height={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A7E72]"
            />
            <input
              type="text"
              value={lookupRef}
              onChange={(e) => setLookupRef(e.target.value)}
              placeholder="Order reference, e.g. GA-24817"
              aria-label="Order reference number"
              className="h-12 w-full rounded-full border border-[rgba(33,26,18,0.14)] bg-white pl-11 pr-4 text-[14px] font-medium text-[#211A12] outline-none transition-colors placeholder:text-[#B7AC9E] focus:border-[#0B3B25]"
            />
          </div>
          <button
            type="submit"
            aria-label="Track order"
            className="group flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0B3B25] text-white transition-all hover:bg-[#0F4A2E] active:scale-95"
          >
            <ArrowRight width={17} height={17} />
          </button>
        </form>

        {/* List */}
        <div className="mt-14">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#8A7E72]">
            {session && role === 'customer' ? 'Recent orders' : 'Recent marketplace deliveries'}
          </h2>

          {myOrders.length === 0 ? (
            <div className="mt-6 border-t border-[rgba(33,26,18,0.08)] pt-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(33,26,18,0.12)]">
                <ShoppingBasket width={22} height={22} className="text-[#5C5247]" />
              </div>
              <p className="ga-display-title mt-5 text-[22px]">No orders yet</p>
              <p className="mx-auto mt-2 max-w-xs text-[14px] leading-relaxed text-[#5C5247]">
                Place your first order and it will appear here for tracking and
                one-tap reordering.
              </p>
              <Link
                href="/shop"
                className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-[#0B3B25] px-8 text-[15px] font-semibold text-white transition-all hover:bg-[#0F4A2E]"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            <ul className="mt-6 border-t border-[rgba(33,26,18,0.08)]">
              {myOrders.map((order) => (
                <li key={order.reference}>
                  <Link
                    href={`/orders/${order.reference}`}
                    className="group grid grid-cols-[1fr_auto] items-center gap-x-5 gap-y-2 border-b border-[rgba(33,26,18,0.08)] py-5 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="ga-index text-[15px] font-semibold text-[#211A12] transition-colors group-hover:text-[#7A3F1C]">
                          #{order.reference}
                        </span>
                        <span className={`text-[13px] ${STATUS_TONE[order.status]}`}>
                          {STATUS_LABEL[order.status]}
                        </span>
                      </div>
                      <p className="ga-index mt-1 text-[12.5px] text-[#8A7E72]">
                        {shortDate(order.placedAt)} · {order.items.length}{' '}
                        {order.items.length === 1 ? 'item' : 'items'} ·{' '}
                        {formatGHS(order.total)} · {order.address.area}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 justify-self-end whitespace-nowrap rounded-full border border-[rgba(33,26,18,0.15)] px-4 py-2 text-[13px] font-medium text-[#211A12] transition-colors duration-300 group-hover:border-[rgba(11,59,37,0.45)] group-hover:text-[#0B3B25]">
                      <Package width={14} height={14} />
                      <span className="hidden sm:inline">Track</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  )
}
