'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Search,
  Package,
  Truck,
  MapPin,
  Phone,
  CreditCard,
  Snowflake,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Leaf,
  ChevronRight,
  ClipboardList,
  X,
  PackageCheck,
  CircleDot,
  ArrowRightCircle,
  Ban,
} from 'lucide-react'
import { issueRefund, type RefundResult } from '@/lib/golden-acres/api'
import { dispatchToThreePL } from '@/app/actions/logistics'
import { useDataStore } from '@/components/golden-acres/store/data-store'
import {
  cedis,
  shortDate,
  timeOf,
  paymentLabel,
} from '@/lib/golden-acres/format'
import type {
  Order,
  OrderStatus,
  FaultParty,
  TrackingEvent,
  SupportTicket,
  TicketStatus,
  TicketAttachment,
} from '@/lib/golden-acres/types'
import { MessageSquare, Headphones, Send, Inbox, Wallet, Loader2, Smartphone, Navigation, Paperclip } from 'lucide-react'
import useSWR, { mutate as globalMutate } from 'swr'
import {
  getPayoutQueue,
  getPayoutBatches,
  runPayoutBatch,
} from '@/app/actions/payouts'
import {
  listAllTickets,
  replyToTicket as replyToTicketAction,
  setTicketStatus as setTicketStatusAction,
} from '@/app/actions/support'
import { FleetMap } from '@/components/golden-acres/ops/fleet-map'

const STATUS_META: Record<
  OrderStatus | 'tracking-assigned',
  { label: string; color: string; bg: string }
> = {
  placed: { label: 'Placed', color: '#8a5a3b', bg: '#f0e4d2' },
  picking: { label: 'Picking', color: '#b8791a', bg: '#f6e8c8' },
  packed: { label: 'Packed', color: '#4f7d2f', bg: '#e2efd2' },
  'tracking-assigned': { label: 'Driver assigned', color: '#2c5238', bg: '#dcebe0' },
  'out-for-delivery': { label: 'Out for delivery', color: '#1f3d2a', bg: '#d4e6d8' },
  delivered: { label: 'Delivered', color: '#2c5238', bg: '#d4e6d8' },
  cancelled: { label: 'Cancelled', color: '#c0492e', bg: '#f3ddd5' },
}

const FAULT_META: Record<FaultParty, { color: string; bg: string }> = {
  None: { color: '#4f7d2f', bg: '#e2efd2' },
  Farmer: { color: '#b8791a', bg: '#f6e8c8' },
  '3PL': { color: '#c0492e', bg: '#f3ddd5' },
  Hub: { color: '#8a5a3b', bg: '#f0e4d2' },
}

function StatusPill({ status }: { status: OrderStatus | 'tracking-assigned' }) {
  const m = STATUS_META[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold"
      style={{ color: m.color, background: m.bg }}
    >
      <CircleDot className="h-3 w-3" />
      {m.label}
    </span>
  )
}

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'attention', label: 'Needs attention' },
  { key: 'delivered', label: 'Delivered' },
] as const
type FilterKey = (typeof FILTERS)[number]['key']

export function OpsConsole() {
  const { orders, addRefund } = useDataStore()
  const [selectedRef, setSelectedRef] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterKey>('all')
  // Top-level console section: order fulfilment vs. customer support.
  const [section, setSection] = useState<'orders' | 'support' | 'payouts' | 'fleet'>('orders')
  // On mobile this is a master-detail: 'queue' shows the list, 'detail' the order.
  // On lg+ both panes are always visible and this is ignored.
  const [mobileView, setMobileView] = useState<'queue' | 'detail'>('queue')

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesQuery =
        !query ||
        o.reference.toLowerCase().includes(query.toLowerCase()) ||
        o.customerName.toLowerCase().includes(query.toLowerCase()) ||
        o.address.area.toLowerCase().includes(query.toLowerCase())
      const matchesFilter =
        filter === 'all'
          ? true
          : filter === 'active'
            ? ['placed', 'picking', 'packed', 'out-for-delivery'].includes(o.status)
            : filter === 'attention'
              ? o.fault !== 'None' || o.payment.status === 'partial-refund'
              : o.status === 'delivered'
      return matchesQuery && matchesFilter
    })
  }, [orders, query, filter])

  const selected = orders.find((o) => o.reference === selectedRef) ?? filtered[0]

  // The refund modal builds a full updated order; persist just the new refund
  // to the shared store so it reflects in the customer + BI views too.
  function applyRefund(updated: Order) {
    const newRefund = updated.refunds[updated.refunds.length - 1]
    if (newRefund) addRefund(updated.reference, newRefund)
  }

  const attentionCount = orders.filter(
    (o) => o.fault !== 'None' || o.payment.status === 'partial-refund',
  ).length
  const activeCount = orders.filter((o) =>
    ['placed', 'picking', 'packed', 'out-for-delivery'].includes(o.status),
  ).length

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between gap-2 border-b border-border bg-card px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="ga-display truncate text-base font-semibold leading-none text-foreground sm:text-lg">
              Ops &amp; Support
            </p>
            <p className="truncate text-xs text-muted-foreground">
              AgriVil console
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-sm sm:gap-5">
          <div className="flex items-center gap-2">
            <span className="flex h-7 items-center rounded-full bg-secondary px-2.5 font-bold text-secondary-foreground">
              {activeCount}
            </span>
            <span className="hidden text-muted-foreground sm:inline">active</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="flex h-7 items-center rounded-full px-2.5 font-bold"
              style={{ color: '#c0492e', background: '#f3ddd5' }}
            >
              {attentionCount}
            </span>
            <span className="hidden text-muted-foreground sm:inline">
              need attention
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-secondary px-1.5 py-1.5 sm:px-3">
            <div className="h-7 w-7 rounded-full bg-[var(--ga-gold-soft)]" />
            <span className="hidden font-semibold text-foreground sm:inline">
              Efua A.
            </span>
          </div>
        </div>
      </header>

      {/* Section tabs */}
      <div className="flex items-center gap-1 border-b border-border bg-card px-4 sm:px-6">
        <SectionTab
          active={section === 'orders'}
          onClick={() => setSection('orders')}
          icon={Package}
          label="Orders"
        />
        <SectionTab
          active={section === 'support'}
          onClick={() => setSection('support')}
          icon={Headphones}
          label="Customer support"
        />
        <SectionTab
          active={section === 'payouts'}
          onClick={() => setSection('payouts')}
          icon={Wallet}
          label="Farmer payouts"
        />
        <SectionTab
          active={section === 'fleet'}
          onClick={() => setSection('fleet')}
          icon={Navigation}
          label="Fleet map"
        />
      </div>

      {section === 'support' ? (
        <SupportQueue />
      ) : section === 'payouts' ? (
        <PayoutsConsole />
      ) : section === 'fleet' ? (
        <FleetMap />
      ) : (
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-[380px_1fr]">
        {/* Queue */}
        <aside
          className={`border-b border-border bg-card/60 lg:block lg:border-b-0 lg:border-r ${
            mobileView === 'detail' ? 'hidden' : 'block'
          }`}
        >
          <div className="border-b border-border p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search ref, customer, area…"
                className="ga-input pl-9 text-sm"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    filter === f.key
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-muted'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <ul className="divide-y divide-border">
            {filtered.map((o) => {
              const active = o.reference === selected?.reference
              return (
                <li key={o.id}>
                  <button
                    onClick={() => {
                      setSelectedRef(o.reference)
                      setMobileView('detail')
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                      active ? 'bg-secondary' : 'hover:bg-secondary/50'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{o.reference}</span>
                        {o.fault !== 'None' && (
                          <AlertTriangle
                            className="h-3.5 w-3.5"
                            style={{ color: '#c0492e' }}
                          />
                        )}
                      </div>
                      <p className="truncate text-sm text-muted-foreground">
                        {o.customerName} · {o.address.area}
                      </p>
                      <div className="mt-1.5">
                        <StatusPill status={o.status} />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{cedis(o.total)}</p>
                      <p className="text-xs text-muted-foreground">{timeOf(o.placedAt)}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                </li>
              )
            })}
            {filtered.length === 0 && (
              <li className="px-4 py-10 text-center text-sm text-muted-foreground">
                No orders match.
              </li>
            )}
          </ul>
        </aside>

        {/* Detail */}
        <main
          className={`bg-background p-4 sm:p-6 lg:block ${
            mobileView === 'detail' ? 'block' : 'hidden'
          }`}
        >
          {selected ? (
            <OrderDetail
              order={selected}
              onRefund={applyRefund}
              onBack={() => setMobileView('queue')}
            />
          ) : (
            <p className="text-muted-foreground">Select an order.</p>
          )}
        </main>
      </div>
      )}
    </div>
  )
}

function SectionTab({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: typeof Package
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`-mb-px flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition-colors ${
        active
          ? 'border-primary text-foreground'
          : 'border-transparent text-muted-foreground hover:text-foreground'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

function OrderDetail({
  order,
  onRefund,
  onBack,
}: {
  order: Order
  onRefund: (o: Order) => void
  onBack: () => void
}) {
  const [refundOpen, setRefundOpen] = useState(false)
  const [dispatching, setDispatching] = useState(false)
  const { advanceOrder, setOrderStatus, applyServerOrder } = useDataStore()
  const fault = FAULT_META[order.fault]
  const refundedTotal = order.refunds.reduce((s, r) => s + r.amount, 0)

  const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
    placed: 'Start picking',
    picking: 'Mark packed',
    packed: 'Dispatch to 3PL',
    'out-for-delivery': 'Mark delivered',
  }
  const nextLabel = NEXT_LABEL[order.status]

  // Packed orders are handed to the carrier via the 3PL dispatch action (assigns
  // a rider + tracking number and persists to Neon). Every other step is the
  // in-store optimistic advance. The delivery leg itself is driven by the webhook.
  const handleNext = async () => {
    if (order.status === 'packed') {
      setDispatching(true)
      try {
        const res = await dispatchToThreePL(order.reference)
        if (res.ok && res.order) applyServerOrder(res.order)
        else console.log('[v0] dispatchToThreePL failed:', res.error)
      } finally {
        setDispatching(false)
      }
      return
    }
    advanceOrder(order.reference)
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Mobile back to queue */}
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground lg:hidden"
      >
        <ChevronRight className="h-4 w-4 rotate-180" />
        Back to queue
      </button>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="ga-display text-2xl font-semibold text-foreground sm:text-3xl">
              {order.reference}
            </h1>
            <StatusPill status={order.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed {shortDate(order.placedAt)} at {timeOf(order.placedAt)} ·{' '}
            {order.items.length} items · slot {order.slot.window}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold"
            style={{ color: fault.color, background: fault.bg }}
          >
            <ShieldCheck className="h-4 w-4" />
            Fault: {order.fault}
          </span>
          {nextLabel && (
            <button
              onClick={handleNext}
              disabled={dispatching}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--ga-field)] px-4 py-2 text-sm font-bold text-cream transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ArrowRightCircle className="h-4 w-4" />
              {dispatching ? 'Dispatching…' : nextLabel}
            </button>
          )}
          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <button
              onClick={() => setOrderStatus(order.reference, 'cancelled')}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-bold text-foreground transition-colors hover:bg-secondary"
            >
              <Ban className="h-4 w-4" />
              Cancel
            </button>
          )}
          <button
            onClick={() => setRefundOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--ga-terracotta)] px-4 py-2 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            <RotateCcw className="h-4 w-4" />
            Instant refund
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_1fr]">
        {/* Left column */}
        <div className="space-y-5">
          {/* Customer + payment */}
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Customer &amp; payment
            </h2>
            <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <Info icon={ClipboardList} label="Customer" value={order.customerName} />
              <Info icon={Phone} label="Phone" value={order.customerPhone} />
              <Info
                icon={MapPin}
                label="Delivery"
                value={`${order.address.area} · ${order.address.ghanaPostGPS}`}
              />
              <Info
                icon={CreditCard}
                label="Payment"
                value={`${paymentLabel(order.payment.method)} · ${order.payment.status}`}
              />
            </div>
          </section>

          {/* Items with weight reconciliation */}
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Items &amp; weight reconciliation
            </h2>
            <ul className="divide-y divide-border">
              {order.items.map((it) => {
                const reconciled =
                  it.finalWeightKg != null && it.finalWeightKg !== it.estWeightKg
                return (
                  <li key={it.productId} className="flex items-center gap-3 py-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                      {it.refrigerationRequired ? (
                        <Snowflake className="h-4 w-4 text-[var(--ga-field)]" />
                      ) : (
                        <Package className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground">{it.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {it.qty} {it.unit} · est. {it.estWeightKg} kg
                        {reconciled && (
                          <span className="ml-1 font-semibold text-[var(--ga-gold)]">
                            → final {it.finalWeightKg} kg
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">
                        {cedis(it.priceFinal ?? it.priceEstimate)}
                      </p>
                      {it.priceFinal != null && it.priceFinal !== it.priceEstimate && (
                        <p className="text-xs text-muted-foreground line-through">
                          {cedis(it.priceEstimate)}
                        </p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
            <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
              <Row
                label="Subtotal"
                value={cedis(order.subtotalFinal ?? order.subtotalEstimate)}
              />
              <Row label="Delivery fee" value={cedis(order.deliveryFee)} />
              {refundedTotal > 0 && (
                <Row
                  label="Refunded"
                  value={`– ${cedis(refundedTotal)}`}
                  accent="#c0492e"
                />
              )}
              <div className="flex items-center justify-between pt-1 text-base font-extrabold text-foreground">
                <span>Total</span>
                <span>{cedis(order.total - refundedTotal)}</span>
              </div>
            </div>
          </section>

          {/* Refund history */}
          {order.refunds.length > 0 && (
            <section className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                Refund history
              </h2>
              <ul className="space-y-3">
                {order.refunds.map((r) => (
                  <li key={r.id} className="flex items-start gap-3 text-sm">
                    <RotateCcw className="mt-0.5 h-4 w-4 text-[var(--ga-terracotta)]" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">
                          {cedis(r.amount)} · {r.type}
                        </span>
                        <span
                          className="rounded-full px-2 py-0.5 text-xs font-bold"
                          style={{
                            color: FAULT_META[r.fault].color,
                            background: FAULT_META[r.fault].bg,
                          }}
                        >
                          {r.fault}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{r.reason}</p>
                      <p className="text-xs text-muted-foreground">
                        {shortDate(r.issuedAt)} · {timeOf(r.issuedAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right column — 3PL tracking */}
        <div>
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-1 text-sm font-bold uppercase tracking-wide text-muted-foreground">
              3PL tracking
            </h2>
            <div className="mb-4 rounded-lg bg-secondary p-3 text-sm">
              {order.threePL.trackingNumber ? (
                <>
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <Truck className="h-4 w-4 text-[var(--ga-field)]" />
                    {order.threePL.trackingNumber}
                  </div>
                  <p className="mt-1 text-muted-foreground">
                    {order.threePL.driverName} · {order.threePL.vehicle}
                  </p>
                  {order.threePL.refrigeration && (
                    <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[var(--ga-field)]">
                      <Snowflake className="h-3 w-3" /> Cold-chain active
                    </p>
                  )}
                </>
              ) : (
                <p className="inline-flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" /> Awaiting driver assignment
                </p>
              )}
            </div>

            <Timeline events={order.threePL.events} />

            {order.threePL.pod && (
              <div className="mt-4 rounded-lg border border-border p-3">
                <p className="mb-1 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--ga-field)]">
                  <PackageCheck className="h-4 w-4" /> Proof of delivery
                </p>
                <p className="text-xs text-muted-foreground">
                  Signed by {order.threePL.pod.signature} ·{' '}
                  {timeOf(order.threePL.pod.capturedAt)}
                </p>
              </div>
            )}
          </section>
        </div>
      </div>

      {refundOpen && (
        <RefundDialog
          order={order}
          onClose={() => setRefundOpen(false)}
          onDone={onRefund}
        />
      )}
    </div>
  )
}

function Timeline({ events }: { events: TrackingEvent[] }) {
  return (
    <ol className="relative ml-1 space-y-4 border-l-2 border-border pl-4">
      {events.map((e, i) => {
        const last = i === events.length - 1
        return (
          <li key={i} className="relative">
            <span
              className="absolute -left-[1.43rem] top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full"
              style={{ background: last ? 'var(--ga-field)' : 'var(--border)' }}
            >
              {last && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
            </span>
            <p className="text-sm font-semibold text-foreground">
              {STATUS_META[e.status].label}
            </p>
            <p className="text-sm text-muted-foreground">{e.note}</p>
            <p className="text-xs text-muted-foreground">
              {timeOf(e.ts)}
              {e.location ? ` · ${e.location}` : ''}
            </p>
          </li>
        )
      })}
    </ol>
  )
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold text-foreground">{value}</p>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: string
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold" style={accent ? { color: accent } : undefined}>
        {value}
      </span>
    </div>
  )
}

const FAULT_OPTIONS: FaultParty[] = ['3PL', 'Farmer', 'Hub', 'None']

function RefundDialog({
  order,
  onClose,
  onDone,
}: {
  order: Order
  onClose: () => void
  onDone: (o: Order) => void
}) {
  const maxRefund = order.total
  const [type, setType] = useState<'full' | 'partial'>('partial')
  const [amount, setAmount] = useState<number>(
    Math.round(order.deliveryFee * 100) / 100,
  )
  const [fault, setFault] = useState<FaultParty>(order.fault === 'None' ? '3PL' : order.fault)
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<RefundResult | null>(null)

  const effectiveAmount = type === 'full' ? maxRefund : amount

  async function submit() {
    setSubmitting(true)
    const res = await issueRefund({
      reference: order.reference,
      amount: effectiveAmount,
      reason: reason || 'Customer-reported quality issue.',
      fault,
      type,
    })
    // optimistic local apply against typed boundary result
    const updated: Order = {
      ...order,
      fault,
      payment: {
        ...order.payment,
        status: type === 'full' ? 'refunded' : 'partial-refund',
      },
      refunds: [
        ...order.refunds,
        {
          id: res.refundId,
          amount: effectiveAmount,
          reason: reason || 'Customer-reported quality issue.',
          fault,
          type,
          issuedAt: new Date().toISOString(),
        },
      ],
    }
    setResult(res)
    setSubmitting(false)
    onDone(updated)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        {result ? (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ga-leaf)]/15">
              <CheckCircle2 className="h-7 w-7 text-[var(--ga-leaf)]" />
            </div>
            <h3 className="ga-display mt-3 text-2xl font-semibold text-foreground">
              Refund issued
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{result.message}</p>
            <div className="mt-4 rounded-lg bg-secondary p-3 text-left text-sm">
              <Row label="Refund ID" value={result.refundId} />
              <Row label="Amount" value={cedis(effectiveAmount)} />
              <Row label="Reversed to" value={result.reversedTo} />
            </div>
            <button
              onClick={onClose}
              className="mt-5 w-full rounded-full bg-primary py-2.5 font-bold text-primary-foreground"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="ga-display text-2xl font-semibold text-foreground">
                Instant refund
              </h3>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-muted-foreground hover:bg-secondary"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {order.reference} · {order.customerName}
            </p>

            <div className="mt-4 space-y-4">
              <div className="flex gap-2">
                {(['partial', 'full'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex-1 rounded-lg border py-2 text-sm font-bold capitalize transition-colors ${
                      type === t
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-foreground hover:bg-secondary'
                    }`}
                  >
                    {t} refund
                  </button>
                ))}
              </div>

              {type === 'partial' && (
                <div>
                  <label className="mb-1 block text-sm font-semibold text-foreground">
                    Amount (max {cedis(maxRefund)})
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={maxRefund}
                    value={amount}
                    onChange={(e) =>
                      setAmount(
                        Math.min(maxRefund, Math.max(0, Number(e.target.value))),
                      )
                    }
                    className="ga-input"
                  />
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-semibold text-foreground">
                  Fault attribution
                </label>
                <div className="flex flex-wrap gap-2">
                  {FAULT_OPTIONS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFault(f)}
                      className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                        fault === f
                          ? 'text-white'
                          : 'bg-secondary text-secondary-foreground hover:bg-muted'
                      }`}
                      style={
                        fault === f
                          ? { background: FAULT_META[f].color }
                          : undefined
                      }
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Attribution drives SOP penalties and farmer/3PL scorecards.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-foreground">
                  Reason
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={2}
                  placeholder="e.g. Tomatoes bruised on arrival — cold-chain gap."
                  className="ga-input resize-none"
                />
              </div>

              <button
                onClick={submit}
                disabled={submitting || effectiveAmount <= 0}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--ga-terracotta)] py-3 font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {submitting ? (
                  'Processing reversal…'
                ) : (
                  <>
                    <RotateCcw className="h-4 w-4" />
                    Refund {cedis(effectiveAmount)} now
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const TICKET_STATUS_META: Record<
  TicketStatus,
  { label: string; color: string; bg: string }
> = {
  open: { label: 'Open', color: '#c0492e', bg: '#f3ddd5' },
  pending: { label: 'Pending', color: '#b8791a', bg: '#f6e8c8' },
  resolved: { label: 'Resolved', color: '#4f7d2f', bg: '#e2efd2' },
}

function SupportQueue() {
  // Live queue, polled every 4s so new customer messages surface automatically.
  const { data: tickets, mutate } = useSWR<SupportTicket[]>(
    'ops-tickets',
    () => listAllTickets(),
    { refreshInterval: 4000 },
  )
  const [selectedRef, setSelectedRef] = useState<string | null>(null)
  const [mobileView, setMobileView] = useState<'queue' | 'detail'>('queue')
  const [reply, setReply] = useState('')
  const [pending, setPending] = useState<TicketAttachment[]>([])
  const [uploading, setUploading] = useState(false)
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const list = tickets ?? []
  const selected =
    list.find((t) => t.reference === selectedRef) ?? list[0]
  const openCount = list.filter((t) => t.status !== 'resolved').length
  const msgCount = selected?.messages.length ?? 0

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgCount, selected?.reference])

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('folder', 'support')
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const json = await res.json()
        if (res.ok) {
          setPending((p) => [
            ...p,
            { url: json.url, name: file.name, contentType: file.type, size: file.size },
          ])
        }
      }
    } finally {
      setUploading(false)
    }
  }

  async function send() {
    if (!selected || sending) return
    if (!reply.trim() && pending.length === 0) return
    setSending(true)
    const res = await replyToTicketAction({
      reference: selected.reference,
      body: reply.trim(),
      attachments: pending,
    })
    setSending(false)
    if (res.ok && res.ticket) {
      setReply('')
      setPending([])
      // Optimistically update the selected ticket within the cached list.
      mutate(
        (cur) =>
          (cur ?? []).map((t) => (t.reference === res.ticket!.reference ? res.ticket! : t)),
        { revalidate: false },
      )
    }
  }

  async function changeStatus(status: TicketStatus) {
    if (!selected) return
    const res = await setTicketStatusAction(selected.reference, status)
    if (res.ok && res.ticket) {
      mutate(
        (cur) =>
          (cur ?? []).map((t) => (t.reference === res.ticket!.reference ? res.ticket! : t)),
        { revalidate: false },
      )
    }
  }

  if (!tickets) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (list.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-12 text-center">
        <Inbox className="h-10 w-10 text-muted-foreground/50" />
        <p className="mt-3 font-semibold text-foreground">No support tickets</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Customer requests from the Help Centre will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="grid flex-1 grid-cols-1 lg:grid-cols-[380px_1fr]">
      {/* Ticket list */}
      <aside
        className={`border-b border-border bg-card/60 lg:block lg:border-b-0 lg:border-r ${
          mobileView === 'detail' ? 'hidden' : 'block'
        }`}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <p className="font-semibold text-foreground">Tickets</p>
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">
            {openCount} open
          </span>
        </div>
        <ul className="divide-y divide-border">
          {list.map((t) => {
            const active = t.reference === selected?.reference
            const m = TICKET_STATUS_META[t.status]
            return (
              <li key={t.id}>
                <button
                  onClick={() => {
                    setSelectedRef(t.reference)
                    setMobileView('detail')
                  }}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                    active ? 'bg-secondary/60' : 'hover:bg-secondary/40'
                  }`}
                >
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary">
                    <MessageSquare className="h-4 w-4 text-[var(--ga-field)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-foreground">
                        {t.reference}
                      </span>
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                        style={{ color: m.color, background: m.bg }}
                      >
                        {m.label}
                      </span>
                    </div>
                    <p className="truncate text-sm text-foreground">{t.subject}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {t.customerName} · {t.category}
                    </p>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </aside>

      {/* Ticket detail */}
      <main
        className={`flex flex-col bg-background lg:flex ${
          mobileView === 'detail' ? 'flex' : 'hidden'
        }`}
      >
        {selected ? (
          <div className="flex h-full flex-col">
            <div className="border-b border-border bg-card/40 p-4 sm:p-6">
              <button
                onClick={() => setMobileView('queue')}
                className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground lg:hidden"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Back to tickets
              </button>

              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="ga-display text-xl font-semibold text-foreground sm:text-2xl">
                    {selected.subject}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selected.reference} · {selected.customerName}
                    {selected.orderRef ? ` · ${selected.orderRef}` : ''}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  {(['open', 'pending', 'resolved'] as TicketStatus[]).map((s) => {
                    const m = TICKET_STATUS_META[s]
                    const on = selected.status === s
                    return (
                      <button
                        key={s}
                        onClick={() => changeStatus(s)}
                        className="ga-press rounded-full px-3 py-1 text-xs font-bold transition-colors"
                        style={
                          on
                            ? { color: m.color, background: m.bg }
                            : { color: 'var(--muted-foreground)', background: 'var(--secondary)' }
                        }
                      >
                        {m.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Conversation */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-6"
            >
              {selected.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.author === 'support' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.author === 'support'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-foreground'
                    }`}
                  >
                    <p className="mb-0.5 text-xs font-semibold opacity-80">
                      {msg.authorName}
                    </p>
                    {msg.body && <p className="whitespace-pre-wrap leading-relaxed">{msg.body}</p>}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {msg.attachments.map((a, i) => (
                          <a
                            key={i}
                            href={a.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block h-20 w-20 overflow-hidden rounded-lg border border-border/50"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={a.url || '/placeholder.svg'}
                              alt={a.name}
                              className="h-full w-full object-cover"
                            />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Reply */}
            <div className="border-t border-border bg-card/40 p-4">
              {pending.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {pending.map((a, i) => (
                    <div
                      key={i}
                      className="relative h-14 w-14 overflow-hidden rounded-lg border border-border"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={a.url || '/placeholder.svg'} alt={a.name} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPending((p) => p.filter((_, idx) => idx !== i))}
                        aria-label={`Remove ${a.name}`}
                        className="absolute right-0.5 top-0.5 rounded-full bg-foreground/70 p-0.5 text-background"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-end gap-2">
                <label className="ga-press inline-flex h-11 cursor-pointer items-center rounded-full border border-border bg-background px-3 text-muted-foreground">
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Paperclip className="h-4 w-4" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={(e) => handleUpload(e.target.files)}
                  />
                </label>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={2}
                  placeholder="Type a reply to the customer…"
                  className="ga-input flex-1 resize-none"
                />
                <button
                  onClick={send}
                  disabled={(!reply.trim() && pending.length === 0) || sending}
                  className="ga-press inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 font-semibold text-primary-foreground disabled:opacity-50"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Send
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="p-6 text-muted-foreground">Select a ticket.</p>
        )}
      </main>
    </div>
  )
}

/* ============================= Farmer payouts ============================= */

function PayoutsConsole() {
  const { data: queue, isLoading: queueLoading } = useSWR(
    'payout-queue',
    () => getPayoutQueue(),
  )
  const { data: batches } = useSWR('payout-batches', () => getPayoutBatches(8))

  const [running, setRunning] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [result, setResult] = useState<{
    paid: number
    failed: number
    total: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const dueCount = queue?.dueCount ?? 0
  const dueTotal = queue?.dueTotal ?? 0
  const groups = queue?.byFarmer ?? []

  async function handleRun() {
    setRunning(true)
    setError(null)
    setResult(null)
    const res = await runPayoutBatch()
    setRunning(false)
    setConfirming(false)
    if (!res.ok || !res.batch) {
      setError(res.error ?? 'Payout run failed')
      return
    }
    setResult({
      paid: res.batch.paidCount,
      failed: res.batch.failedCount,
      total: res.batch.totalPaid,
    })
    // Refresh queue, batch history, and every farmer ledger view.
    globalMutate('payout-queue')
    globalMutate('payout-batches')
    globalMutate(
      (key) => Array.isArray(key) && key[0] === 'farmer-ledger',
      undefined,
      { revalidate: true },
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 space-y-6 p-4 sm:p-6">
      {/* Run card */}
      <div className="rounded-2xl bg-[var(--ga-field-deep)] p-5 text-[var(--ga-cream)] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ga-cream)]/60">
              Pending settlement
            </p>
            <p className="ga-display mt-1 text-4xl font-semibold">
              {cedis(dueTotal)}
            </p>
            <p className="mt-1 text-sm text-[var(--ga-cream)]/70">
              {dueCount} {dueCount === 1 ? 'entry' : 'entries'} ·{' '}
              {queue?.farmerCount ?? 0}{' '}
              {(queue?.farmerCount ?? 0) === 1 ? 'farmer' : 'farmers'}
            </p>
          </div>
          <Wallet className="h-8 w-8 shrink-0 text-[var(--ga-gold-soft)]" />
        </div>

        <button
          onClick={() => setConfirming(true)}
          disabled={dueCount === 0 || running}
          className="ga-press mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--ga-gold)] px-5 font-bold text-[var(--ga-field-deep)] disabled:opacity-50"
        >
          {running ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Sending MoMo payouts…
            </>
          ) : (
            <>
              <Smartphone className="h-5 w-5" />
              {dueCount === 0 ? 'No payouts due' : `Run payouts · ${cedis(dueTotal)}`}
            </>
          )}
        </button>
        <p className="mt-2 text-center text-xs text-[var(--ga-cream)]/55">
          Disburses each farmer&apos;s net earnings to their Mobile Money wallet.
        </p>
      </div>

      {/* Result / error banners */}
      {result && (
        <div className="flex items-center gap-3 rounded-xl border border-[var(--ga-leaf)]/30 bg-[var(--ga-leaf)]/10 px-4 py-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--ga-leaf)]" />
          <p className="text-sm font-semibold text-foreground">
            Paid {cedis(result.total)} to {result.paid}{' '}
            {result.paid === 1 ? 'farmer' : 'farmers'}.
            {result.failed > 0 && (
              <span className="text-[var(--ga-clay)]">
                {' '}
                {result.failed} failed and will retry next run.
              </span>
            )}
          </p>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-[var(--ga-clay)]/30 bg-[var(--ga-clay)]/10 px-4 py-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-[var(--ga-clay)]" />
          <p className="text-sm font-semibold text-[var(--ga-clay)]">{error}</p>
        </div>
      )}

      {/* Queue grouped by farmer */}
      <section>
        <h3 className="mb-2 text-sm font-bold text-foreground">
          Who gets paid
        </h3>
        {queueLoading ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Loading settlement queue…
          </div>
        ) : groups.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Nothing pending. Delivered orders accrue here automatically.
          </div>
        ) : (
          <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
            {groups.map((g) => (
              <li
                key={g.farmerId}
                className="flex items-center justify-between gap-3 p-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-bold text-foreground">
                    {g.farmerName}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Smartphone className="h-3 w-3" />
                    {g.momoProvider ?? 'No MoMo'}{' '}
                    {g.momoNumberMasked ?? '— add a payout number'}
                    {' · '}
                    {g.entryCount} {g.entryCount === 1 ? 'order' : 'orders'}
                  </p>
                </div>
                <p className="shrink-0 font-extrabold text-[var(--ga-field-deep)]">
                  {cedis(g.net)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Recent runs */}
      {batches && batches.length > 0 && (
        <section>
          <h3 className="mb-2 text-sm font-bold text-foreground">
            Recent payout runs
          </h3>
          <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
            {batches.map((b) => (
              <li
                key={b.id}
                className="flex items-center justify-between gap-3 p-4"
              >
                <div>
                  <p className="font-semibold text-foreground">
                    {shortDate(b.createdAt)} · {timeOf(b.createdAt)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {b.paidCount} paid
                    {b.failedCount > 0 && ` · ${b.failedCount} failed`}
                  </p>
                </div>
                <p className="font-bold text-[var(--ga-leaf)]">
                  {cedis(b.totalPaid)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Confirm dialog */}
      {confirming && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-2xl bg-card p-5 shadow-xl">
            <h4 className="text-lg font-bold text-foreground">
              Run {cedis(dueTotal)} in payouts?
            </h4>
            <p className="mt-1 text-sm text-muted-foreground">
              This sends {dueCount} settlement{dueCount === 1 ? '' : 's'} to{' '}
              {queue?.farmerCount ?? 0}{' '}
              {(queue?.farmerCount ?? 0) === 1 ? 'farmer' : 'farmers'} via Mobile
              Money. Farmers are notified by SMS.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setConfirming(false)}
                disabled={running}
                className="ga-press h-11 flex-1 rounded-full bg-secondary font-semibold text-secondary-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleRun}
                disabled={running}
                className="ga-press inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-primary font-bold text-primary-foreground disabled:opacity-50"
              >
                {running ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                  </>
                ) : (
                  'Confirm payouts'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
