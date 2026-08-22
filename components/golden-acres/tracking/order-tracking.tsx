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
  Check,
  Camera,
} from 'lucide-react'
import { useDataStore } from '@/components/golden-acres/store/data-store'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { DeliveryMap } from '@/components/golden-acres/tracking/delivery-map'
import { DeliveryFeedback } from '@/components/golden-acres/tracking/delivery-feedback'
import { cedis, formatGHS, timeOf, shortDate } from '@/lib/golden-acres/format'
import { HUB } from '@/lib/golden-acres/data'
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
      return `Arriving ${slotWindow}`
    case 'picking':
      return `Arriving in your ${slotWindow} window`
    case 'packed':
      return 'Leaving the hub shortly'
    case 'out-for-delivery':
      return 'Arriving in about 25 minutes'
    case 'delivered':
      return 'Delivered.'
    default:
      return slotWindow
  }
}

/**
 * Order tracking (redesigned, docs/redesign/02 §6).
 * Hero status → FROM→TO route line → dotted progress timeline → live map +
 * driver → items with estimate-vs-actual weight reconciliation → payment
 * summary → issue entry. Polling/logistics wiring untouched.
 */
export function OrderTracking({ reference }: { reference: string }) {
  const { orderByRef, products, hydrated } = useDataStore()
  const order = orderByRef(reference)

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
        <div className="h-64 animate-pulse rounded-[20px] bg-white/60" />
      </div>
    )
  }

  if (!order) {
    return (
      <main className="min-h-[70vh] bg-[#F7F5F0] pb-20 pt-32">
        <div className="mx-auto max-w-xl px-5 text-center sm:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(33,26,18,0.12)]">
            <CircleHelp width={22} height={22} className="text-[#5C5247]" />
          </div>
          <h1 className="ga-display-title mt-6 text-[clamp(26px,3vw,36px)] text-[#211A12]">
            We can&apos;t find that order.
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[#5C5247]">
            Order <span className="ga-index font-semibold text-[#211A12]">{reference}</span>{' '}
            doesn&apos;t match anything in your account.
          </p>
          <Link
            href="/orders"
            className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-[#0B3B25] px-8 text-[15px] font-semibold text-white transition-all hover:bg-[#0F4A2E]"
          >
            Go to my orders
          </Link>
        </div>
      </main>
    )
  }

  const cancelled = order.status === 'cancelled'
  const idx = stepIndex(order.status)
  const pct = cancelled ? 0 : Math.max(0, idx) / (ORDER.length - 1)
  const { threePL: t } = order
  const refrigerated = t.refrigeration
  const delivered = order.status === 'delivered'

  // Weight reconciliation is real once picking completes.
  const reconciled =
    order.items.some((it) => it.finalWeightKg != null || it.priceFinal != null)

  const paymentLabel =
    order.payment.method === 'card'
      ? 'Card'
      : order.payment.method === 'momo-mtn'
        ? 'MTN Mobile Money'
        : order.payment.method === 'momo-vodafone'
          ? 'Vodafone Cash'
          : order.payment.method

  return (
    <main className="min-h-screen bg-[#F7F5F0] pb-20 pt-32">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#8A7E72] transition-colors hover:text-[#211A12]"
        >
          <ChevronLeft width={15} height={15} /> Back to my orders
        </Link>

        {/* ---------- Hero status ---------- */}
        <header className="ga-rise mt-5">
          <p className="ga-index text-[13px] font-semibold uppercase tracking-[0.08em] text-[#7A3F1C]">
            Order {order.reference}
          </p>
          <h1 className="ga-display-title mt-2 text-[clamp(28px,3.4vw,44px)] text-[#211A12]">
            {cancelled
              ? 'Order cancelled.'
              : etaText(order.status, order.slot.window)}
          </h1>
          <p className="ga-index mt-2 text-[14px] text-[#5C5247]">
            Placed {shortDate(order.placedAt)} · {order.slot.window} delivery
            window · {paymentLabel}
          </p>
        </header>

        {/* ---------- FROM → TO route line ---------- */}
        {!cancelled && (
          <div className="ga-rise mt-9 flex items-center gap-3" aria-hidden="true">
            <span className="flex min-w-0 flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8A7E72]">From</span>
              <span className="truncate text-[14px] font-semibold text-[#211A12]">{HUB.name}</span>
            </span>
            <span className="relative mx-1 h-px flex-1 bg-[rgba(33,26,18,0.18)]">
              {/* truck rides the line at progress */}
              <span
                className="absolute -top-[7px] flex h-[15px] w-[15px] items-center justify-center rounded-full bg-[#0B3B25] text-white transition-all duration-700"
                style={{ left: `calc(${Math.round(pct * 100)}% - 7px)` }}
              >
                <Truck width={9} height={9} />
              </span>
            </span>
            <span className="flex min-w-0 flex-col text-right">
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8A7E72]">To</span>
              <span className="truncate text-[14px] font-semibold text-[#211A12]">
                {order.address.area}
              </span>
            </span>
          </div>
        )}

        {/* ---------- Dotted progress timeline ---------- */}
        {!cancelled && (
          <nav aria-label="Delivery progress" className="ga-rise mt-10">
            <ol className="relative flex justify-between">
              {/* dotted base track */}
              <span
                aria-hidden="true"
                className="absolute left-5 right-5 top-[19px] border-t-2 border-dotted border-[rgba(33,26,18,0.18)]"
              />
              {/* solid travelled overlay */}
              <span
                aria-hidden="true"
                className="absolute left-5 top-[19px] h-[2px] rounded-full bg-[#0B3B25] transition-all duration-700"
                style={{ width: `calc((100% - 40px) * ${pct})` }}
              />
              {STEPS.map((step, i) => {
                const done = i < idx
                const active = i === idx
                const Icon = step.icon
                return (
                  <li
                    key={step.id}
                    className="relative z-10 flex w-20 flex-col items-center text-center"
                    aria-current={active ? 'step' : undefined}
                  >
                    <span
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition-colors duration-500',
                        (done || active)
                          ? 'bg-[#0B3B25] text-white'
                          : 'border-2 border-[rgba(33,26,18,0.18)] bg-white text-[#8A7E72]',
                      )}
                    >
                      {active && !done ? (
                        <Icon width={17} height={17} />
                      ) : (
                        <Check width={16} height={16} strokeWidth={3} />
                      )}
                    </span>
                    <span
                      className={cn(
                        'mt-2.5 text-[12px] leading-tight font-semibold',
                        active ? 'text-[#211A12]' : done ? 'text-[#3D332A]' : 'text-[#8A7E72]',
                      )}
                    >
                      {step.label}
                    </span>
                    <span className="mt-0.5 hidden text-[11px] leading-tight text-[#8A7E72] sm:block">
                      {active && !cancelled && !delivered
                        ? t.etaMinutes != null && i === 3
                          ? `~${t.etaMinutes} min away`
                          : step.caption
                        : step.caption}
                    </span>
                  </li>
                )
              })}
            </ol>
          </nav>
        )}

        {cancelled && (
          <div className="ga-rise mt-8 rounded-[16px] border border-[rgba(185,28,28,0.25)] bg-[#B91C1C]/5 px-5 py-4 text-[14px] font-medium text-[#B91C1C]">
            This order was cancelled. If you were charged, any refund appears in
            your Mobile Money statement within 24 hours.
          </div>
        )}

        {/* ---------- Main grid ---------- */}
        <div className="ga-rise mt-10 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
          {/* Left column */}
          <div className="space-y-8">
            {delivered && (
              <section aria-label="Rate your delivery">
                <DeliveryFeedback order={order} />
              </section>
            )}

            {order.status !== 'cancelled' && t.trackingNumber && (
              <DeliveryMap order={order} />
            )}

            {/* Driver */}
            {order.status === 'out-for-delivery' && t.driverName && (
              <section
                aria-label="Your rider"
                className="rounded-[20px] border border-[rgba(33,26,18,0.06)] bg-[#FDFDFB] p-5"
              >
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8A7E72]">
                  Your rider{t.carrier ? ` · ${t.carrier}` : ''}
                </h2>
                <div className="mt-3 flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0B3B25] text-[17px] font-semibold text-white">
                    {t.driverName.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold text-[#211A12]">
                      {t.driverName}
                    </p>
                    <p className="ga-index mt-0.5 flex items-center gap-1.5 text-[13px] text-[#8A7E72]">
                      <Truck width={13} height={13} /> {t.vehicle}
                      {t.trackingNumber ? ` · #${t.trackingNumber}` : ''}
                    </p>
                  </div>
                  {t.driverPhone && (
                    <a
                      href={`tel:${t.driverPhone.replace(/\s+/g, '')}`}
                      aria-label={`Call ${t.driverName}`}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0B3B25] text-white transition-transform hover:-translate-y-0.5"
                    >
                      <Phone width={17} height={17} />
                    </a>
                  )}
                </div>
              </section>
            )}

            {/* Progress events */}
            {t.events.length > 0 && !cancelled && (
              <section aria-label="Progress history" className="pt-2">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8A7E72]">
                  Progress
                </h2>
                <ol className="mt-4 space-y-0">
                  {[...t.events]
                    .slice()
                    .reverse()
                    .map((e, i, arr) => (
                      <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
                        {/* connector */}
                        {i < arr.length - 1 && (
                          <span
                            aria-hidden="true"
                            className="absolute left-[5px] top-4 h-full w-px bg-[rgba(33,26,18,0.10)]"
                          />
                        )}
                        <span
                          aria-hidden="true"
                          className={cn(
                            'relative z-10 mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full',
                            i === 0 ? 'bg-[#0B3B25]' : 'bg-[rgba(33,26,18,0.18)]',
                          )}
                        />
                        <div className="-mt-0.5 min-w-0">
                          <p className="text-[14px] font-medium text-[#211A12]">{e.note}</p>
                          <p className="ga-index mt-0.5 text-[12.5px] text-[#8A7E72]">
                            {timeOf(e.ts)}
                            {e.location ? ` · ${e.location}` : ''}
                          </p>
                        </div>
                      </li>
                    ))}
                </ol>
              </section>
            )}

            {/* Proof of delivery */}
            {delivered && t.pod && (
              <section
                aria-label="Proof of delivery"
                className="rounded-[20px] border border-[rgba(33,26,18,0.06)] bg-[#FDFDFB] p-5"
              >
                <h2 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8A7E72]">
                  <Camera width={13} height={13} /> Proof of delivery
                </h2>
                <div className="mt-3 flex items-center gap-4">
                  {t.pod.photo && (
                    <span className="relative h-20 w-20 overflow-hidden rounded-[14px] border border-[rgba(33,26,18,0.06)]">
                      <SmartImage src={t.pod.photo} alt="Proof of delivery photo" fill className="object-cover" />
                    </span>
                  )}
                  <div className="min-w-0 text-[13px] text-[#5C5247]">
                    <p>
                      Captured{' '}
                      <span className="ga-index font-medium text-[#211A12]">
                        {shortDate(t.pod.capturedAt)}
                      </span>
                    </p>
                    <p className="ga-index mt-0.5 flex items-center gap-1">
                      <MapPin width={12} height={12} /> geo-tagged at your address
                    </p>
                    {t.pod.signature && (
                      <p className="mt-0.5">Signed on arrival</p>
                    )}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Right column */}
          <aside className="space-y-8">
            {/* Items with weight reconciliation */}
            <section aria-label="Order items" className="border-t border-[rgba(33,26,18,0.08)] pt-5">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8A7E72]">
                {order.items.length} {order.items.length > 1 ? 'items' : 'item'}
              </h2>
              <ul className="mt-4 space-y-4">
                {order.items.map((it) => {
                  const hasFinal = it.finalWeightKg != null
                  return (
                    <li key={it.productId} className="flex items-start gap-3">
                      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[12px] border border-[rgba(33,26,18,0.05)] bg-white">
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
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-medium text-[#211A12]">
                          {it.name}
                        </span>
                        <span className="ga-index mt-0.5 block text-[12.5px] text-[#8A7E72]">
                          Qty {it.qty}
                          {it.estWeightKg > 0 &&
                            (hasFinal
                              ? ` · ${it.finalWeightKg ?? it.estWeightKg} kg picked`
                              : ` · ≈${it.estWeightKg} kg`)}
                        </span>
                        {it.refrigerationRequired && (
                          <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-[#0B3B25]">
                            <Snowflake width={11} height={11} /> Cold-chain
                          </span>
                        )}
                      </span>
                      <span className="ga-index shrink-0 pt-0.5 text-right text-[14px] font-semibold text-[#211A12]">
                        {cedis(it.priceFinal ?? it.priceEstimate)}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </section>

            {/* Payment summary */}
            <section
              aria-label="Payment summary"
              className="border-t border-[rgba(33,26,18,0.08)] pt-5"
            >
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8A7E72]">
                Payment · {paymentLabel}
              </h2>
              <dl className="ga-index mt-3 space-y-2 text-[13.5px]">
                <div className="flex justify-between">
                  <dt className="text-[#5C5247]">Subtotal (est.)</dt>
                  <dd className="font-medium text-[#211A12]">
                    {formatGHS(order.subtotalEstimate)}
                  </dd>
                </div>
                {reconciled && order.subtotalFinal != null && (
                  <div className="flex justify-between">
                    <dt className="text-[#5C5247]">Subtotal (actual)</dt>
                    <dd className="font-medium text-[#211A12]">
                      {formatGHS(order.subtotalFinal)}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-[#5C5247]">Delivery</dt>
                  <dd className="font-medium text-[#211A12]">
                    {formatGHS(order.deliveryFee)}
                  </dd>
                </div>
                {refrigerated && (
                  <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#0B3B25]">
                    <Snowflake width={12} height={12} /> Cold-chain packaging included
                  </div>
                )}
                <div className="flex items-baseline justify-between border-t border-[rgba(33,26,18,0.08)] pt-3">
                  <dt className="text-[14px] font-semibold text-[#211A12]">Total</dt>
                  <dd className="ga-index text-[20px] font-semibold tracking-[-0.02em] text-[#211A12]">
                    {cedis(order.total)}
                  </dd>
                </div>
              </dl>
              {reconciled && (
                <p className="mt-2.5 text-[12px] leading-relaxed text-[#8A7E72]">
                  Variable-weight items were reconciled to the exact weight
                  picked at the hub. Differences are refunded automatically.
                </p>
              )}
            </section>

            {/* Delivering to */}
            <section aria-label="Delivery address" className="border-t border-[rgba(33,26,18,0.08)] pt-5">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8A7E72]">
                Delivering to
              </h2>
              <p className="mt-3 flex items-start gap-2 text-[14px]">
                <MapPin width={15} height={15} className="mt-0.5 shrink-0 text-[#7A3F1C]" />
                <span>
                  <span className="block font-medium text-[#211A12]">
                    {order.address.area}
                  </span>
                  <span className="ga-index mt-0.5 block text-[12.5px] text-[#8A7E72]">
                    {order.address.ghanaPostGPS} · {order.address.region}
                  </span>
                </span>
              </p>
            </section>

            {/* Issue entry point */}
            <Link
              href={`/help?ref=${encodeURIComponent(order.reference)}`}
              className="group flex items-center justify-between rounded-full border border-[rgba(33,26,18,0.15)] px-5 py-3.5 text-[13.5px] font-medium text-[#211A12] transition-colors duration-300 hover:border-[rgba(11,59,37,0.45)] hover:text-[#0B3B25]"
            >
              <span className="flex items-center gap-2">
                <CircleHelp width={15} height={15} className="text-[#7A3F1C]" />
                Something wrong with this order?
              </span>
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                ›
              </span>
            </Link>
          </aside>
        </div>
      </div>
    </main>
  )
}
