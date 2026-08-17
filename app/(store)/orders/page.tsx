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
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center">
        <p className="ga-eyebrow text-primary">Live Fulfillment</p>
        <h1 className="ga-display mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Track your fresh harvest
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
          Follow your perishable produce from farm harvest to hub cold-chain
          sorting, right to your doorstep.
        </p>

        {/* Quick lookup form */}
        <form
          onSubmit={handleLookup}
          className="mx-auto mt-8 flex max-w-md items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={lookupRef}
              onChange={(e) => setLookupRef(e.target.value)}
              placeholder="e.g. GA-24817"
              aria-label="Order reference number"
              className="h-12 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            type="submit"
            className="ga-press inline-flex h-12 items-center gap-1.5 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            Track <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Orders List */}
      <div className="mt-14 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="ga-display text-xl font-semibold text-foreground">
            {session ? 'Your Recent Orders' : 'Recent Marketplace Deliveries'}
          </h2>
          <Link
            href="/shop"
            className="text-xs font-semibold text-primary transition-colors hover:underline"
          >
            Shop more produce &rarr;
          </Link>
        </div>

        {myOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
              <ShoppingBasket className="h-6 w-6" />
            </div>
            <p className="mt-4 font-semibold text-foreground">No orders yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse our fresh farm produce and place your first order.
            </p>
            <Link
              href="/shop"
              className="ga-press mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {myOrders.map((order) => {
              const badge =
                STATUS_BADGE[order.status] ?? STATUS_BADGE.placed

              return (
                <div
                  key={order.reference}
                  className="ga-card-hover flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5 transition-all sm:flex-row sm:items-center"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-foreground">
                        #{order.reference}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>Placed on {shortDate(order.placedAt)}</span>
                      <span>&bull;</span>
                      <span>
                        {order.items.length} item
                        {order.items.length === 1 ? '' : 's'}
                      </span>
                      <span>&bull;</span>
                      <span className="font-semibold text-foreground">
                        {formatGHS(order.total)}
                      </span>
                      <span>&bull;</span>
                      <span>{order.address.area}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/orders/${order.reference}`}
                      className="ga-press inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-4 text-xs font-bold text-foreground transition-all hover:bg-secondary"
                    >
                      <Truck className="h-3.5 w-3.5 text-primary" /> Track
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
