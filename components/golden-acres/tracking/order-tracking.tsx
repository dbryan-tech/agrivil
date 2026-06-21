'use client'

import Link from 'next/link'
import {
  ClipboardList,
  Sprout,
  PackageCheck,
  Bike,
  Home,
  Phone,
  MapPin,
  Snowflake,
  ChevronLeft,
  CircleHelp,
  Truck,
} from 'lucide-react'
import { useDataStore } from '@/components/golden-acres/store/data-store'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { DeliveryMap } from '@/components/golden-acres/tracking/delivery-map'
import { DeliveryFeedback } from '@/components/golden-acres/tracking/delivery-feedback'
import { cedis, timeOf, shortDate } from '@/lib/golden-acres/format'
import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/lib/golden-acres/types'

const STEPS: {
  id: Exclude<OrderStatus, 'cancelled'>
  label: string
  caption: string
  icon: typeof Sprout
}[] = [
  { id: 'placed', label: 'Order placed', caption: 'Routed to the hub', icon: ClipboardList },
  { id: 'picking', label: 'Being picked', caption: 'Farmers harvesting', icon: Sprout },
  { id: 'packed', label: 'Packed', caption: 'Quality-checked', icon: PackageCheck },
  {
    id: 'out-for-delivery',
    label: 'Out for delivery',
    caption: 'Rider on the way',
    icon: Bike,
  },
  { id: 'delivered', label: 'Delivered', caption: 'Enjoy your produce', icon: Home },
]

const ORDER: OrderStatus[] = [
  'placed',
  'picking',
  'packed',
  'out-for-delivery',
  'delivered',
]

function stepIndex(status: OrderStatus) {
  return ORDER.indexOf(status)
}

function etaText(status: OrderStatus, slotWindow: string) {
  switch (status) {
    case 'placed':
    case 'picking':
      return `Arriving in your ${slotWindow} window`
    case 'packed':
      return 'Leaving the hub shortly'
    case 'out-for-delivery':
      return 'Arriving in ~25 min'
    case 'delivered':
      return 'Delivered'
    default:
      return slotWindow
  }
}

export function OrderTracking({ reference }: { reference: string }) {
  const { orderByRef, products, hydrated } = useDataStore()
  const order = orderByRef(reference)

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="h-64 animate-pulse rounded-2xl bg-secondary" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <CircleHelp className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="ga-display mt-6 text-3xl font-semibold text-foreground">
          We can&apos;t find that order
        </h1>
        <p className="mt-2 text-muted-foreground">
          Order <span className="font-bold">{reference}</span> doesn&apos;t match
          anything in your account.
        </p>
        <Link
          href="/account"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-field px-5 py-3 font-bold text-cream"
        >
          Go to my orders
        </Link>
      </div>
    )
  }

  const cancelled = order.status === 'cancelled'
  const idx = stepIndex(order.status)
  const pct = cancelled ? 0 : Math.max(0, idx) / (ORDER.length - 1)
  const { threePL } = order
  const refrigerated = threePL.refrigeration

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      <Link
        href="/account"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Back to my orders
      </Link>

      {/* Hero status */}
      <div className="ga-rise mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-clay">
            Order {order.reference}
          </p>
          <h1 className="ga-display mt-1 text-3xl font-semibold text-foreground sm:text-4xl">
            {cancelled
              ? 'Order cancelled'
              : order.status === 'delivered'
                ? 'Delivered'
                : etaText(order.status, order.slot.window)}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Placed {shortDate(order.placedAt)} · {order.slot.window} delivery
            window
          </p>
        </div>
        {!cancelled && order.status !== 'delivered' && (
          <span className="flex items-center gap-2 rounded-full bg-field/10 px-3 py-1.5 text-sm font-bold text-field">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-field/60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-field" />
            </span>
            Live
          </span>
        )}
      </div>

      {/* Route stepper */}
      {!cancelled && (
        <div className="ga-rise mt-8 rounded-2xl border border-border bg-card p-6">
          <div className="relative">
            <div className="absolute left-0 right-0 top-5 h-1 rounded-full bg-secondary" />
            <div
              className="absolute left-0 top-5 h-1 rounded-full bg-leaf transition-all duration-700"
              style={{ width: `${pct * 100}%` }}
            />
            <ol className="relative flex justify-between">
              {STEPS.map((step, i) => {
                const done = i < idx
                const active = i === idx
                return (
                  <li key={step.id} className="flex flex-col items-center text-center">
                    <span
                      className={cn(
                        'flex h-11 w-11 items-center justify-center rounded-full border-2 bg-card transition-colors',
                        done && 'border-leaf bg-leaf text-cream',
                        active && 'border-field bg-field text-cream',
                        !done && !active && 'border-border text-muted-foreground',
                      )}
                    >
                      <step.icon className="h-5 w-5" />
                    </span>
                    <span
                      className={cn(
                        'mt-2 text-xs font-bold sm:text-sm',
                        active ? 'text-field' : 'text-foreground',
                      )}
                    >
                      {step.label}
                    </span>
                    <span className="hidden text-xs text-muted-foreground sm:block">
                      {step.caption}
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Left: driver + timeline */}
        <div className="space-y-6">
          {/* Post-delivery feedback — rate the order, rider, tip, and produce.
              Shown once delivered; collapses to a summary after submission. */}
          {order.status === 'delivered' && (
            <div id="feedback" className="scroll-mt-24">
              <DeliveryFeedback order={order} />
            </div>
          )}

          {/* Live delivery map — shown once the carrier has the order (tracking
              assigned at dispatch, even while still "packed"). Mounting it here
              starts the poll that flips the order to out-for-delivery. */}
          {order.status !== 'cancelled' &&
            threePL.trackingNumber && <DeliveryMap order={order} />}

          {/* Driver card */}
          {order.status === 'out-for-delivery' && threePL.driverName && (
            <div className="ga-rise rounded-2xl border border-border bg-card p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Your rider{threePL.carrier ? ` · ${threePL.carrier}` : ''}
              </h2>
              <div className="mt-3 flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-field text-xl font-bold text-cream">
                  {threePL.driverName.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-foreground">{threePL.driverName}</p>
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Truck className="h-3.5 w-3.5" /> {threePL.vehicle}
                  </p>
                </div>
                <a
                  href={`tel:${(threePL.driverPhone ?? '').replace(/\s+/g, '')}`}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-leaf text-cream transition-transform hover:-translate-y-0.5"
                  aria-label="Call rider"
                >
                  <Phone className="h-5 w-5" />
                </a>
              </div>
              {threePL.trackingNumber && (
                <p className="mt-3 rounded-lg bg-secondary px-3 py-2 text-xs font-semibold text-foreground">
                  Tracking #{threePL.trackingNumber}
                </p>
              )}
            </div>
          )}

          {/* Timeline */}
          <div className="ga-rise rounded-2xl border border-border bg-card p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Progress
            </h2>
            <ol className="mt-4 space-y-4">
              {[...threePL.events]
                .slice()
                .reverse()
                .map((e, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          'mt-1 h-2.5 w-2.5 rounded-full',
                          i === 0 ? 'bg-leaf' : 'bg-border',
                        )}
                      />
                      {i < threePL.events.length - 1 && (
                        <span className="mt-1 w-px flex-1 bg-border" />
                      )}
                    </div>
                    <div className="-mt-0.5 pb-1">
                      <p className="text-sm font-semibold text-foreground">
                        {e.note}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {timeOf(e.ts)}
                        {e.location ? ` · ${e.location}` : ''}
                      </p>
                    </div>
                  </li>
                ))}
            </ol>
          </div>
        </div>

        {/* Right: order details */}
        <aside className="space-y-6">
          <div className="ga-rise rounded-2xl border border-border bg-card p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Delivering to
            </h2>
            <div className="mt-3 flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-clay" />
              <div>
                <p className="font-semibold text-foreground">{order.address.area}</p>
                <p className="text-sm text-muted-foreground">
                  {order.address.ghanaPostGPS} · {order.address.region}
                </p>
              </div>
            </div>
            {refrigerated && (
              <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-field">
                <Snowflake className="h-3.5 w-3.5" /> Cold-chain packaging
              </p>
            )}
          </div>

          <div className="ga-rise rounded-2xl border border-border bg-card p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              {order.items.length} item{order.items.length > 1 ? 's' : ''}
            </h2>
            <ul className="mt-3 space-y-3">
              {order.items.map((it) => (
                <li key={it.productId} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-secondary">
                    <SmartImage
                      src={
                        it.image ??
                        products.find((p) => p.id === it.productId)?.image ??
                        '/placeholder.svg'
                      }
                      alt={it.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {it.name}
                    </p>
                    <p className="text-xs text-muted-foreground">Qty {it.qty}</p>
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    {cedis(it.priceFinal ?? it.priceEstimate)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="ga-display text-xl font-semibold text-foreground">
                {cedis(order.total)}
              </span>
            </div>
          </div>

          <Link
            href="/help"
            className="ga-rise flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-4 text-sm font-bold text-foreground transition-colors hover:bg-secondary"
          >
            <CircleHelp className="h-4 w-4 text-clay" /> Need help with this order?
          </Link>
        </aside>
      </div>
    </div>
  )
}
