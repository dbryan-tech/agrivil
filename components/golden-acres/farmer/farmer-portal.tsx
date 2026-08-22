'use client'

import { useMemo, useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { SmartImage } from '@/components/golden-acres/smart-image'
import {
  AvatarUpload,
  CoverUpload,
  ProductPhotoUpload,
} from '@/components/golden-acres/image-upload-control'
import { useSession } from '@/components/golden-acres/auth/session-context'
import { useDataStore } from '@/components/golden-acres/store/data-store'
import { FarmerInsights } from '@/components/golden-acres/farmer/farmer-insights'
import { ListSkeleton } from '@/components/golden-acres/ui/skeleton'
import {
  ChartContainer,
  type ChartConfig,
} from '@/components/ui/chart'
import { AreaChart, Area, XAxis, YAxis } from 'recharts'
import { getFarmerLedger } from '@/app/actions/payouts'
import { maskMomoNumber as maskMomo } from '@/lib/golden-acres/momo'
import {
  cedis,
  weight,
  pct,
  shortDate,
  timeOf,
  daysUntil,
  priceLabel,
} from '@/lib/golden-acres/format'
import type {
  Product,
  Farmer,
  StockStatus,
  ProduceCategory,
  FarmerAccount,
} from '@/lib/golden-acres/types'
import {
  Sprout,
  ClipboardList,
  Wifi,
  WifiOff,
  CloudCheck,
  RefreshCw,
  Package,
  CalendarClock,
  Wallet,
  Plus,
  Minus,
  Check,
  TriangleAlert,
  ChevronRight,
  ShieldCheck,
  Leaf,
  Star,
  UserCog,
  Hourglass,
  Save,
} from 'lucide-react'

type Tab = 'today' | 'produce' | 'orders' | 'money' | 'profile'

const TABS: { id: Tab; label: string; icon: typeof Package }[] = [
  { id: 'today', label: 'Today', icon: CalendarClock },
  { id: 'produce', label: 'Produce', icon: Package },
  { id: 'orders', label: 'Orders', icon: ClipboardList },
  { id: 'money', label: 'Money', icon: Wallet },
  { id: 'profile', label: 'Profile', icon: UserCog },
]

export function FarmerPortal() {
  const { account } = useSession()
  const { farmers, getFarmer } = useDataStore()
  const [tab, setTab] = useState<Tab>('today')
  const [online, setOnline] = useState(true)

  // Identity comes from the signed-in farmer; fall back to an active demo
  // supplier so the portal is explorable without logging in.
  const farmer: Farmer =
    (account?.role === 'farmer'
      ? getFarmer((account as FarmerAccount).farmerId)
      : undefined) ??
    farmers[2] ??
    farmers[0]

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-24">
      <PortalHeader farmer={farmer} online={online} setOnline={setOnline} />

      <main className="px-4 pt-4">
        {tab === 'today' && (
          <TodayTab
            farmer={farmer}
            goProduce={() => setTab('produce')}
            goOrders={() => setTab('orders')}
            goMoney={() => setTab('money')}
          />
        )}
        {tab === 'produce' && <InventoryTab farmer={farmer} online={online} />}
        {tab === 'orders' && <OrdersTab farmer={farmer} />}
        {tab === 'money' && <MoneyTab farmer={farmer} />}
        {tab === 'profile' && <ProfileTab farmer={farmer} />}
      </main>

      <BottomNav tab={tab} setTab={setTab} />
    </div>
  )
}

/* ---------------- Header ---------------- */
function PortalHeader({
  farmer,
  online,
  setOnline,
}: {
  farmer: Farmer
  online: boolean
  setOnline: (v: boolean) => void
}) {
  return (
    <header className="ga-dark sticky top-0 z-20 border-b border-white/10 px-4 pb-3 pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-white/25">
            <SmartImage src={farmer.photo} alt={farmer.name} fill />
          </div>
          <div>
            <p className="text-[14.5px] font-semibold leading-tight text-[#FAF9F6]">{farmer.farmName}</p>
            <p className="ga-index mt-0.5 flex items-center gap-1 text-[11.5px] text-[#FAF9F6]/60">
              <Star width={10} height={10} className="fill-[#F0A81E] text-[#F0A81E]" />
              {farmer.rating} · {pct(farmer.onTimeRate, 0)} on-time
            </p>
          </div>
        </div>
        {/* Connectivity toggle — demonstrates the low-bandwidth offline mode */}
        <button
          onClick={() => setOnline(!online)}
          className={`ga-index flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${
            online
              ? 'bg-white/12 text-[#FAF9F6]/85'
              : 'bg-[#B91C1C]/30 text-[#FAF9F6]'
          }`}
          aria-label="Toggle connectivity"
        >
          {online ? (
            <>
              <Wifi width={12} height={12} /> Online
            </>
          ) : (
            <>
              <WifiOff width={12} height={12} /> Offline
            </>
          )}
        </button>
      </div>

      {!online && (
        <p className="mt-2 flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-[11.5px] font-medium text-[#FAF9F6]/85">
          <CloudCheck width={13} height={13} className="text-[#DF8821]" />
          Changes are saved on your phone and will sync when you&apos;re back
          online.
        </p>
      )}
    </header>
  )
}

/* ---------------- Today ---------------- */
function TodayTab({
  farmer,
  goProduce,
  goOrders,
  goMoney,
}: {
  farmer: Farmer
  goProduce: () => void
  goOrders: () => void
  goMoney: () => void
}) {
  const { ordersByFarmer, productsByFarmer } = useDataStore()
  const myOrders = ordersByFarmer(farmer.id)

  const pendingPickup = myOrders.filter(
    (o) => o.status === 'placed' || o.status === 'picking',
  )
  const lowStock = productsByFarmer(farmer.id).filter((p) => p.stockKg <= p.lowStockThreshold)
  const harvestList = useMemo(() => {
    const map = new Map<string, number>()
    myOrders
      .filter((o) => o.status === 'placed' || o.status === 'picking')
      .forEach((o) =>
        o.items
          .filter((it) => it.farmerId === farmer.id)
          .forEach((it) =>
            map.set(
              it.productId,
              (map.get(it.productId) ?? 0) + it.estWeightKg * it.qty,
            ),
          ),
      )
    return Array.from(map.entries()).map(([id, kg]) => ({
      product: productsByFarmer(farmer.id).find((p) => p.id === id),
      kg,
    }))
  }, [myOrders, farmer.id, productsByFarmer])

  // Next payout figure from the ledger is fetched inside MoneyTab; here we
  // show the guarantee promise with the scheduled amount when present.
  return (
    <section className="space-y-6">
      <SectionTitle eyebrow={greeting()} title="Your farm today" />

      {/* Payout hero — one number that matters */}
      <NextPayoutHero farmerId={farmer.id} onOpenMoney={goMoney} />

      {/* Needs-action queue */}
      <div>
        <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#8A7E72]">
          Needs action
        </h3>
        {harvestList.length === 0 && lowStock.length === 0 && myOrders.length === 0 ? (
          <p className="mt-3 border-t border-[rgba(33,26,18,0.08)] pt-5 text-sm leading-relaxed text-[#5C5247]">
            Nothing needs you right now. New baskets that include your produce
            appear here the moment they&apos;re placed.
          </p>
        ) : (
          <ul className="border-t border-[rgba(33,26,18,0.08)]">
            {pendingPickup.length > 0 && (
              <li>
                <button
                  onClick={goOrders}
                  className="group flex w-full items-center justify-between gap-3 border-b border-[rgba(33,26,18,0.08)] py-3.5 text-left"
                >
                  <span className="flex items-center gap-2.5 text-[14.5px] font-medium text-[#211A12]">
                    <span className="ga-index flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#7A3F1C] text-[11px] font-semibold text-white">
                      {pendingPickup.length}
                    </span>
                    {pendingPickup.length === 1 ? 'Order' : 'Orders'} waiting to harvest & pack
                  </span>
                  <ChevronRight width={16} height={16} className="shrink-0 text-[#8A7E72] transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              </li>
            )}
            {harvestList.map(({ product, kg }) => (
              <li
                key={`h-${product?.id ?? kg}`}
                className="flex items-center justify-between gap-3 border-b border-[rgba(33,26,18,0.08)] py-3.5"
              >
                <span className="flex min-w-0 items-center gap-2.5 text-[14.5px] text-[#211A12]">
                  <Leaf width={15} height={15} className="shrink-0 text-[#0F7A43]" />
                  <span className="min-w-0 truncate">
                    Pick {product?.name ?? 'item'} before 7am
                  </span>
                </span>
                <span className="ga-index shrink-0 text-[13.5px] font-semibold text-[#211A12]">
                  {weight(kg)}
                </span>
              </li>
            ))}
            {lowStock.slice(0, 3).map((p) => (
              <li key={`ls-${p.id}`}>
                <button
                  onClick={goProduce}
                  className="group flex w-full items-center justify-between gap-3 border-b border-[rgba(33,26,18,0.08)] py-3.5 text-left"
                >
                  <span className="flex min-w-0 items-center gap-2.5 text-[14.5px] text-[#211A12]">
                    <TriangleAlert width={15} height={15} className="shrink-0 text-[#B45309]" />
                    <span className="min-w-0 truncate">
                      {p.name} running low ({p.stockKg}kg left)
                    </span>
                  </span>
                  <ChevronRight width={16} height={16} className="shrink-0 text-[#8A7E72] transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Deeper views fold here as quiet cards */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={goProduce}
          className="rounded-[16px] border border-[rgba(33,26,18,0.06)] bg-white p-4 text-left transition-colors duration-300 hover:border-[rgba(11,59,37,0.35)]"
        >
          <Package width={17} height={17} className="text-[#0B3B25]" />
          <span className="mt-2 block text-[14px] font-semibold text-[#211A12]">Your produce</span>
          <span className="mt-0.5 block text-[12px] text-[#8A7E72]">Stock &amp; listings</span>
        </button>
        <Link
          href="/farmer?tab=reviews"
          className="rounded-[16px] border border-[rgba(33,26,18,0.06)] bg-white p-4 text-left transition-colors duration-300 hover:border-[rgba(11,59,37,0.35)]"
        >
          <Star width={17} height={17} className="text-[#F0A81E]" />
          <span className="mt-2 block text-[14px] font-semibold text-[#211A12]">
            ★ {farmer.rating} rating
          </span>
          <span className="mt-0.5 block text-[12px] text-[#8A7E72]">{farmer.reviewCount} reviews</span>
        </Link>
      </div>

      {/* Sales trend */}
      <SalesSpark farmer={farmer} />
    </section>
  )
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

/** One primary number: the next payout arriving within the 48h guarantee. */
function NextPayoutHero({
  farmerId,
  onOpenMoney,
}: {
  farmerId: string
  onOpenMoney: () => void
}) {
  const { data } = useSWR(
    farmerId ? ['today-payout', farmerId] : null,
    () => getFarmerLedger(farmerId),
    { revalidateOnFocus: true },
  )
  const ledger = data ?? []
  const scheduled = ledger
    .filter((l) => l.payoutStatus === 'scheduled' || l.payoutStatus === 'processing')
    .reduce((s, l) => s + l.netPayout, 0)
  const nextTs = ledger.find(
    (l) => l.payoutStatus === 'scheduled' || l.payoutStatus === 'processing',
  )?.payoutTimestamp

  return (
    <div className="ga-dark rounded-[20px] p-5">
      <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#FAF9F6]/60">
        Arriving within 48 hours
      </p>
      <p className="ga-index mt-1.5 text-[clamp(30px,8vw,40px)] font-semibold leading-none tracking-[-0.02em] text-[#FAF9F6]">
        {cedis(scheduled)}
      </p>
      <button
        onClick={onOpenMoney}
        className="group mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#FAF9F6]/75 transition-colors hover:text-[#FAF9F6]"
      >
        See your money
        <ChevronRight
          width={14}
          height={14}
          className="transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </button>
      {nextTs && (
        <p className="ga-index mt-2 text-[12px] text-[#FAF9F6]/55">
          Guaranteed by {shortDate(nextTs)}, {timeOf(nextTs)} · MoMo
        </p>
      )}
    </div>
  )
}

/** Compact 14-day sales sparkline (recharts area, quiet axes). */
function SalesSpark({ farmer }: { farmer: Farmer }) {
  const { ordersByFarmer } = useDataStore()
  const orders = ordersByFarmer(farmer.id)

  const series = useMemo(() => {
    const today = new Date()
    const days: { label: string; value: number }[] = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      days.push({ label: `${d.getDate()}/${d.getMonth() + 1}`, value: 0 })
    }
    orders.forEach((o) => {
      const placed = new Date(o.placedAt)
      const diff = Math.floor(
        (today.setHours(0, 0, 0, 0) - new Date(placed).setHours(0, 0, 0, 0)) / 86400000,
      )
      if (diff >= 0 && diff <= 13) {
        const idx = 13 - diff
        const mineTotal = o.items
          .filter((it) => it.farmerId === farmer.id)
          .reduce((s, it) => s + (it.priceFinal ?? it.priceEstimate), 0)
        if (days[idx]) days[idx].value += Math.round(mineTotal)
      }
    })
    return days
  }, [orders, farmer.id])

  const total = series.reduce((s, d) => s + d.value, 0)

  return (
    <section aria-label="Last 14 days of sales" className="border-t border-[rgba(33,26,18,0.08)] pt-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#8A7E72]">
          Last 14 days
        </h3>
        <span className="ga-index text-[15px] font-semibold text-[#211A12]">
          {cedis(total, { decimals: false })}
        </span>
      </div>
      <ChartContainer
        config={{ v: { label: 'Sales' } as ChartConfig }}
        className="mt-2 h-[64px] w-full"
      >
        <AreaChart data={series} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-v)" stopOpacity={0.28} />
              <stop offset="100%" stopColor="var(--color-v)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="label" hide />
          <YAxis hide domain={[0, 'dataMax + 10']} />
          <Area dataKey="v" type="monotone" stroke="var(--color-v)" strokeWidth={2} fill="url(#spark)" />
        </AreaChart>
      </ChartContainer>
    </section>
  )
}

/* ---------------- Inventory ---------------- */
function OrdersTab({ farmer }: { farmer: Farmer }) {
  const { ordersByFarmer, setOrderStatus } = useDataStore()
  const myOrders = ordersByFarmer(farmer.id)
  const active = myOrders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled')
  const done = myOrders.filter((o) => o.status === 'delivered')

  return (
    <section className="space-y-6">
      <SectionTitle eyebrow="Orders" title="Fulfilment" />
      {active.length === 0 && done.length === 0 && (
        <p className="border-t border-[rgba(33,26,18,0.08)] pt-5 text-sm leading-relaxed text-[#5C5247]">
          No orders yet. When a basket includes your produce, it appears here
          with everything you need to pick, pack, and hand over.
        </p>
      )}
      {[...active, ...done].map((o) => {
        const mine = o.items.filter((it) => it.farmerId === farmer.id)
        const canPack = o.status === 'placed' || o.status === 'picking'
        const stepIdx =
          o.status === 'placed' ? 0 : o.status === 'picking' ? 1 : o.status === 'packed' ? 2 : o.status === 'out-for-delivery' ? 3 : 4
        return (
          <article key={o.id} className="border-t border-[rgba(33,26,18,0.08)] pt-4 first:border-0 first:pt-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="ga-index text-[15px] font-semibold text-[#211A12]">{o.reference}</span>
              <span className="ga-index text-[12.5px] text-[#8A7E72]">
                {shortDate(o.slot.date)} · {o.slot.window}
              </span>
            </div>
            {/* fulfilment step tracker */}
            <ol className="mt-3 flex items-center gap-1.5" aria-label={`Fulfilment stage ${stepIdx + 1} of 4`}>
              {['Pick', 'Pack', 'Hub', 'Delivered'].map((label, i) => (
                <li key={label} className="flex flex-1 items-center gap-1.5">
                  <span
                    className={`h-1.5 flex-1 rounded-full ${
                      i <= stepIdx && o.status !== 'cancelled' ? 'bg-[#0B3B25]' : 'bg-[rgba(33,26,18,0.10)]'
                    }`}
                  />
                  <span className="sr-only">{`${label}${i <= stepIdx ? ' done' : ''}`}</span>
                </li>
              ))}
            </ol>
            <ul className="mt-3 space-y-1">
              {mine.map((it) => (
                <li key={it.productId} className="flex items-center justify-between text-[13.5px]">
                  <span className="text-[#211A12]">
                    {it.qty} × {it.name}
                  </span>
                  <span className="ga-index text-[#8A7E72]">{weight(it.estWeightKg * it.qty)}</span>
                </li>
              ))}
            </ul>
            {canPack && (
              <button
                onClick={() => setOrderStatus(o.reference, 'packed')}
                className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#0B3B25] text-[14px] font-semibold text-white transition-all duration-300 hover:bg-[#0F4A2E] active:scale-[0.98]"
              >
                <Check width={15} height={15} /> Mark harvested &amp; packed
              </button>
            )}
          </article>
        )
      })}
    </section>
  )
}

/* ---------------- Money (earnings & payouts) ---------------- */
function MoneyTab({ farmer }: { farmer: Farmer }) {
  // Real settlement ledger from Neon (accrued on delivery, settled by the Ops
  // payout run). SWR keeps it fresh after a payout run elsewhere.
  const { data, isLoading } = useSWR(
    farmer?.id ? ["farmer-ledger", farmer.id] : null,
    () => getFarmerLedger(farmer.id),
    { revalidateOnFocus: true },
  )
  const ledger = data ?? []
  const paidTotal = ledger
    .filter((l) => l.payoutStatus === "paid")
    .reduce((s, l) => s + l.netPayout, 0)
  const scheduled = ledger
    .filter((l) => l.payoutStatus === "scheduled" || l.payoutStatus === "processing")
    .reduce((s, l) => s + l.netPayout, 0)

  return (
    <section className="space-y-6">
      <SectionTitle eyebrow="Money" title="Your payouts" />

      {/* Commission transparency — trust through plain language */}
      <p className="border-l-2 border-[#0F7A43]/40 pl-3 text-[12.5px] leading-relaxed text-[#5C5247]">
        AgriVil keeps a flat commission on each delivered order; everything else
        is yours. Penalties only apply when the hub SOP is missed, and every
        deduction shows its reason.
      </p>

      {/* Sales analytics */}
      <FarmerInsights farmer={farmer} />

      {/* Balance band */}
      <div className="ga-dark rounded-[20px] p-5">
        <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#FAF9F6]/60">
          Paid out to your MoMo wallet
        </p>
        <p className="ga-index mt-1.5 text-[clamp(30px,8vw,40px)] font-semibold leading-none tracking-[-0.02em] text-[#FAF9F6]">
          {cedis(paidTotal)}
        </p>
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5">
          <ShieldCheck width={15} height={15} className="shrink-0 text-[#DF8821]" />
          <p className="text-[12.5px] font-medium text-[#FAF9F6]/90">
            {scheduled > 0
              ? `${cedis(scheduled)} scheduled via MoMo — 48-hour payout guarantee`
              : "All caught up — 48-hour MoMo payout guarantee"}
          </p>
        </div>
        {farmer.momoNumber && (
          <p className="ga-index mt-3 text-[12px] text-[#FAF9F6]/70">
            Payouts to {farmer.momoProvider} {maskMomo(farmer.momoNumber)}
          </p>
        )}
      </div>

      {/* Ledger as hairline rows */}
      <div>
        <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#8A7E72]">
          Transaction history
        </h3>
        {isLoading ? (
          <ListSkeleton rows={3} />
        ) : ledger.length === 0 ? (
          <p className="border-t border-[rgba(33,26,18,0.08)] pt-5 text-sm leading-relaxed text-[#5C5247]">
            No payouts yet. Earnings appear here once your delivered orders are
            settled.
          </p>
        ) : (
          <ul className="border-t border-[rgba(33,26,18,0.08)]">
            {ledger.map((l) => (
              <li key={l.id} className="border-b border-[rgba(33,26,18,0.08)] py-4">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="min-w-0">
                    <p className="ga-index text-[14.5px] font-semibold text-[#211A12]">{l.orderRef}</p>
                    <p className="ga-index mt-0.5 text-[12px] text-[#8A7E72]">
                      {shortDate(l.date)}
                      {l.payoutStatus === "paid" && l.payoutRef
                        ? ` · ref ${l.payoutRef.slice(0, 12)}`
                        : ""}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="ga-index text-[16px] font-semibold tracking-[-0.02em] text-[#211A12]">
                      {cedis(l.netPayout)}
                    </p>
                    <PayoutNote status={l.payoutStatus} ts={l.payoutTimestamp} />
                  </div>
                </div>
                <dl className="ga-index mt-2.5 grid grid-cols-3 gap-2 border-t border-[rgba(33,26,18,0.06)] pt-2.5 text-[12px]">
                  <div>
                    <dt className="text-[#8A7E72]">Gross</dt>
                    <dd className="mt-0.5 font-semibold text-[#211A12]">
                      {cedis(l.grossSales, { decimals: false })}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#8A7E72]">Commission</dt>
                    <dd className="mt-0.5 font-semibold text-[#5C5247]">
                      −{cedis(l.commission, { decimals: false })}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#8A7E72]">SOP penalty</dt>
                    <dd className={`mt-0.5 font-semibold ${l.sopPenalty > 0 ? 'text-[#B45309]' : 'text-[#5C5247]'}`}>
                      {l.sopPenalty ? `−${cedis(l.sopPenalty, { decimals: false })}` : '—'}
                    </dd>
                  </div>
                </dl>
                {l.payoutStatus === "paid" && (l.payoutProvider || l.payoutNumber) && (
                  <p className="ga-index mt-2 text-[12px] text-[#0F7A43]">
                    Paid to {l.payoutProvider} {l.payoutNumber}
                  </p>
                )}
                {l.payoutStatus === "failed" && l.failureReason && (
                  <p className="mt-2 rounded-lg border border-[rgba(185,28,28,0.25)] bg-[#B91C1C]/5 px-2.5 py-1.5 text-[12px] font-medium text-[#B91C1C]">
                    Payout failed: {l.failureReason}. Our team will retry.
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link
        href="/"
        className="flex items-center justify-center gap-1 py-2 text-sm font-medium text-[#8A7E72] transition-colors hover:text-[#211A12]"
      >
        Back to storefront <ChevronRight width={15} height={15} />
      </Link>
    </section>
  )
}

/* ---------------- Produce (inventory + add listing) ---------------- */
function InventoryTab({ farmer, online }: { farmer: Farmer; online: boolean }) {
  const { productsByFarmer, setProductStock } = useDataStore()
  const [view, setView] = useState<'list' | 'add'>('list')
  const mine = productsByFarmer(farmer.id)
  const [stock, setStock] = useState<Record<string, number>>(
    Object.fromEntries(mine.map((p) => [p.id, p.stockKg])),
  )
  const [dirty, setDirty] = useState<Set<string>>(new Set())
  const [syncing, setSyncing] = useState(false)
  const [lastSynced, setLastSynced] = useState<string | null>('just now')

  function adjust(id: string, delta: number) {
    setStock((s) => ({
      ...s,
      [id]: Math.max(0, Math.round(((s[id] ?? 0) + delta) * 10) / 10),
    }))
    setDirty((d) => new Set(d).add(id))
  }

  function sync() {
    setSyncing(true)
    setTimeout(() => {
      // Commit dirty stock changes to the shared store so the storefront,
      // low-stock auto de-list and ops console all reflect live availability.
      dirty.forEach((id) => setProductStock(id, stock[id] ?? 0))
      setSyncing(false)
      setDirty(new Set())
      setLastSynced('just now')
    }, 1000)
  }

  function statusFor(p: Product): StockStatus {
    const s = stock[p.id] ?? 0
    if (s <= 0) return 'delisted'
    if (s <= p.lowStockThreshold) return 'low'
    return 'in-stock'
  }

  return (
    <section className="space-y-4">
      <SectionTitle eyebrow="Produce" title="Your listings" />

      {dirty.size > 0 && (
        <div className="flex items-center justify-between rounded-2xl border border-[var(--ga-gold-soft)] bg-[var(--ga-gold)]/8 p-3">
          <p className="text-sm font-semibold text-[var(--ga-gold)]">
            {dirty.size} change{dirty.size > 1 ? 's' : ''} not synced
          </p>
          <button
            onClick={sync}
            disabled={syncing}
            className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing…' : online ? 'Sync now' : 'Save offline'}
          </button>
        </div>
      )}

      {dirty.size === 0 && lastSynced && (
        <p className="flex items-center gap-1.5 text-xs font-semibold text-[var(--ga-leaf)]">
          <CloudCheck className="h-3.5 w-3.5" /> All synced · {lastSynced}
        </p>
      )}

      {/* Add-listing entry + reviews fold */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setView(view === 'add' ? 'list' : 'add')}
          className="flex items-center justify-center gap-2 rounded-full border border-[rgba(33,26,18,0.15)] py-2.5 text-[13.5px] font-semibold text-[#0B3B25] transition-colors duration-300 hover:border-[rgba(11,59,37,0.5)]"
        >
          <Plus width={15} height={15} /> New listing
        </button>
        <Link
          href="/farmer?tab=reviews"
          className="flex items-center justify-center gap-2 rounded-full border border-[rgba(33,26,18,0.15)] py-2.5 text-[13.5px] font-medium text-[#211A12] transition-colors duration-300 hover:border-[rgba(11,59,37,0.5)]"
        >
          <Star width={14} height={14} className="text-[#F0A81E]" /> Reviews
        </Link>
      </div>

      {view === 'add' && <AddProduceForm farmer={farmer} online={online} onDone={() => setView('list')} />}

      <div className="space-y-3">
        {mine.map((p) => {
          const st = statusFor(p)
          const pending = p.reviewStatus === 'pending'
          return (
            <div
              key={p.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-secondary">
                <SmartImage src={p.image} alt={p.name} fill />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-foreground">{p.name}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-2">
                  {pending ? (
                    <span className="flex items-center gap-1 rounded-full bg-[var(--ga-gold)]/15 px-2 py-0.5 text-[11px] font-bold text-[var(--ga-gold)]">
                      <Hourglass className="h-3 w-3" /> In review
                    </span>
                  ) : (
                    <StockBadge status={st} />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {priceLabel(p)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => adjust(p.id, -1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground active:scale-90"
                  aria-label={`Reduce ${p.name} stock`}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-sm font-bold tabular-nums">
                  {stock[p.id] ?? 0}kg
                </span>
                <button
                  onClick={() => adjust(p.id, 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground active:scale-90"
                  aria-label={`Increase ${p.name} stock`}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ---------------- Add produce (low-bandwidth uploader) ---------------- */
const CATEGORY_OPTIONS: ProduceCategory[] = [
  'Vegetables',
  'Fruits',
  'Roots & Tubers',
  'Leafy Greens',
  'Grains & Legumes',
  'Herbs & Spices',
]

function AddProduceForm({
  farmer,
  online,
  onDone,
}: {
  farmer: Farmer
  online: boolean
  onDone: () => void
}) {
  const { addProduct } = useDataStore()
  const [name, setName] = useState('')
  const [category, setCategory] = useState<ProduceCategory>('Vegetables')
  const [price, setPrice] = useState('')
  const [stockKg, setStockKg] = useState('')
  const [coldChain, setColdChain] = useState(false)
  const [organic, setOrganic] = useState(false)
  const [photo, setPhoto] = useState('')
  const [queued, setQueued] = useState(false)

  const ready = name.trim() && price && stockKg

  function submit() {
    addProduct({
      farmerId: farmer.id,
      name: name.trim(),
      category,
      pricePerKg: Number(price) || 0,
      stockKg: Number(stockKg) || 0,
      refrigerationRequired: coldChain,
      organic,
      image: photo || undefined,
      // Self-service listings from a signed-in farmer go live immediately.
      autoPublish: true,
    })
    setQueued(true)
    setTimeout(() => {
      setQueued(false)
      setName('')
      setPrice('')
      setStockKg('')
      setColdChain(false)
      setOrganic(false)
      setPhoto('')
      onDone()
    }, 1800)
  }

  if (queued) {
    return (
      <section className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ga-leaf)]/15">
          <Check className="h-8 w-8 text-[var(--ga-leaf)]" />
        </div>
        <h2 className="ga-display mt-5 text-2xl font-semibold text-foreground">
          {online ? "It's live in the market!" : 'Saved & queued'}
        </h2>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          {online
            ? 'Your produce is now on the storefront and your public farmer page. Shoppers can add it to their basket right away.'
            : "We'll publish this the moment your phone reconnects. Keep farming!"}
        </p>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <SectionTitle eyebrow="New listing" title="Add produce to sell" />

      {/* Photo — real upload, compressed client-side for low bandwidth */}
      <ProductPhotoUpload value={photo} onChange={setPhoto} />

      <FieldRow label="Produce name">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Sweet Potatoes"
          className="ga-input"
        />
      </FieldRow>

      <FieldRow label="Category">
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                category === c
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-card text-foreground'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </FieldRow>

      <div className="grid grid-cols-2 gap-3">
        <FieldRow label="Price / kg (GH₵)">
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ''))}
            placeholder="0.00"
            inputMode="decimal"
            className="ga-input"
          />
        </FieldRow>
        <FieldRow label="Stock (kg)">
          <input
            value={stockKg}
            onChange={(e) => setStockKg(e.target.value.replace(/[^0-9.]/g, ''))}
            placeholder="0"
            inputMode="decimal"
            className="ga-input"
          />
        </FieldRow>
      </div>

      <div className="flex gap-2">
        <Toggle
          active={coldChain}
          onClick={() => setColdChain((v) => !v)}
          label="Cold-chain"
        />
        <Toggle
          active={organic}
          onClick={() => setOrganic((v) => !v)}
          label="Organic"
        />
      </div>

      <button
        onClick={submit}
        disabled={!ready}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-bold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-50"
      >
        <Sprout className="h-4 w-4" />
        {online ? 'Publish to market' : 'Save offline & queue'}
      </button>
    </section>
  )
}

/* ---------------- Profile customization ---------------- */
function ProfileTab({ farmer }: { farmer: Farmer }) {
  const { updateFarmer } = useDataStore()
  const { account, updateAccount } = useSession()
  const [farmName, setFarmName] = useState(farmer.farmName)
  const [bio, setBio] = useState(farmer.bio)
  const [story, setStory] = useState(farmer.story)
  const [methods, setMethods] = useState(farmer.methods.join(', '))
  const [certs, setCerts] = useState(farmer.certifications.join(', '))
  const [town, setTown] = useState(farmer.town)
  const [saved, setSaved] = useState(false)

  const dirty =
    farmName !== farmer.farmName ||
    bio !== farmer.bio ||
    story !== farmer.story ||
    methods !== farmer.methods.join(', ') ||
    certs !== farmer.certifications.join(', ') ||
    town !== farmer.town

  // Photo + cover save instantly so they go live on the public page right away.
  function setPhoto(dataUrl: string) {
    updateFarmer(farmer.id, { photo: dataUrl })
    if (account?.role === 'farmer') updateAccount({ avatarImage: dataUrl })
  }
  function setCover(dataUrl: string) {
    updateFarmer(farmer.id, { cover: dataUrl })
  }

  function save() {
    updateFarmer(farmer.id, {
      farmName: farmName.trim() || farmer.farmName,
      bio,
      story,
      town,
      methods: methods
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean),
      certifications: certs
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
    })
    // Keep the signed-in farmer account name in sync with the farm name.
    if (account?.role === 'farmer' && farmName.trim()) {
      updateAccount({ farmName: farmName.trim() } as Partial<FarmerAccount>)
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  return (
    <section className="space-y-4">
      <SectionTitle eyebrow="Your profile" title="Tell your farm's story" />
      <p className="-mt-2 text-sm text-muted-foreground">
        This is exactly what shoppers see on your public farmer page. Updates go
        live the moment you save.
      </p>

      <Link
        href={`/farmers/${farmer.slug}`}
        className="flex items-center justify-between rounded-2xl border border-border bg-card p-3 text-sm font-bold text-foreground"
      >
        <span className="flex items-center gap-2">
          <Leaf className="h-4 w-4 text-[var(--ga-leaf)]" /> View my public page
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>

      {/* Cover + profile photo — go live instantly */}
      <div className="rounded-2xl border border-border bg-card p-3">
        <span className="text-sm font-bold text-foreground">
          Cover &amp; profile photo
        </span>
        <div className="relative mt-2">
          <CoverUpload value={farmer.cover} onChange={setCover} />
          <div className="-mt-9 ml-3">
            <AvatarUpload
              value={farmer.photo}
              onChange={setPhoto}
              alt={farmer.name}
              fallback={farmer.name.charAt(0)}
            />
          </div>
        </div>
      </div>

      <FieldRow label="Farm name">
        <input
          value={farmName}
          onChange={(e) => setFarmName(e.target.value)}
          className="ga-input"
        />
      </FieldRow>

      <FieldRow label="Nearest town">
        <input
          value={town}
          onChange={(e) => setTown(e.target.value)}
          className="ga-input"
        />
      </FieldRow>

      <FieldRow label="Short bio (one line)">
        <input
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="ga-input"
        />
      </FieldRow>

      <FieldRow label="Your story">
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          rows={5}
          className="ga-input resize-none"
        />
      </FieldRow>

      <FieldRow label="Growing methods (comma separated)">
        <input
          value={methods}
          onChange={(e) => setMethods(e.target.value)}
          placeholder="Drip irrigation, Companion planting"
          className="ga-input"
        />
      </FieldRow>

      <FieldRow label="Certifications (comma separated)">
        <input
          value={certs}
          onChange={(e) => setCerts(e.target.value)}
          placeholder="Certified Organic, GlobalG.A.P."
          className="ga-input"
        />
      </FieldRow>

      <button
        onClick={save}
        disabled={!dirty}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-bold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-50"
      >
        {saved ? (
          <>
            <Check className="h-4 w-4" /> Saved & published
          </>
        ) : (
          <>
            <Save className="h-4 w-4" /> Save & publish
          </>
        )}
      </button>
    </section>
  )
}

/* ---------------- Bottom nav ---------------- */
function BottomNav({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[rgba(33,26,18,0.08)] bg-[#FAF9F6]/95 backdrop-blur">
      <div
        className="mx-auto grid max-w-md grid-cols-5"
        role="tablist"
        aria-label="Portal sections"
      >
        {TABS.map((t) => {
          const Icon = t.icon
          const active = t.id === tab
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              role="tab"
              aria-selected={active}
              className={`flex flex-col items-center gap-1 py-2.5 text-[10.5px] transition-colors duration-300 ${
                active
                  ? 'font-semibold text-[#211A12]'
                  : 'font-medium text-[#8A7E72]'
              }`}
            >
              <Icon width={19} height={19} />
              <span
                className={`mt-0.5 h-0.5 w-6 rounded-full transition-colors duration-300 ${
                  active ? 'bg-[#211A12]' : 'bg-transparent'
                }`}
              />
              {t.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

/* ---------------- small pieces ---------------- */
function Toggle({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 py-2.5 text-sm font-bold transition-colors ${
        active
          ? 'border-[var(--ga-leaf)] bg-[var(--ga-leaf)]/8 text-[var(--ga-leaf)]'
          : 'border-border bg-card text-muted-foreground'
      }`}
    >
      {active ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      {label}
    </button>
  )
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-[13px] font-semibold text-[#7A3F1C]">{eyebrow}</p>
      <h1 className="ga-display-title mt-1.5 text-[clamp(24px,5vw,30px)] text-[#211A12]">
        {title}
      </h1>
    </div>
  )
}

function FieldRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  )
}


function StockBadge({ status }: { status: StockStatus }) {
  const map: Record<StockStatus, { label: string; cls: string }> = {
    'in-stock': { label: 'In stock', cls: 'bg-[var(--ga-leaf)]/15 text-[var(--ga-leaf)]' },
    low: { label: 'Low', cls: 'bg-[var(--ga-gold)]/15 text-[var(--ga-gold)]' },
    delisted: { label: 'Sold out', cls: 'bg-[var(--ga-terracotta)]/15 text-[var(--ga-terracotta)]' },
    'out-of-stock': { label: 'Out of stock', cls: 'bg-[var(--ga-terracotta)]/15 text-[var(--ga-terracotta)]' },
  }
  const s = map[status]
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${s.cls}`}>
      {s.label}
    </span>
  )
}

function PayoutNote({ status, ts }: { status: string; ts: string }) {
  if (status === 'paid') {
    return (
      <span className="flex items-center justify-end gap-1 text-[11.5px] font-medium text-[#0F7A43]">
        <Check width={12} height={12} /> Paid
      </span>
    )
  }
  if (status === 'failed') {
    return (
      <span className="flex items-center justify-end gap-1 text-[11.5px] font-medium text-[#B91C1C]">
        Failed
      </span>
    )
  }
  if (status === 'processing') {
    return (
      <span className="flex items-center justify-end gap-1 text-[11.5px] font-medium text-[#7A3F1C]">
        Processing
      </span>
    )
  }
  const days = daysUntil(ts)
  return (
    <span className="ga-index flex items-center justify-end gap-1 text-[11.5px] font-medium text-[#7A3F1C]">
      {days <= 0 ? `by ${timeOf(ts)}` : `in ${days}d`}
    </span>
  )
}

