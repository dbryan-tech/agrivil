'use client'

import { useState } from 'react'
import useSWR from 'swr'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts'
import {
  TrendingUp,
  Package,
  Check,
  X,
  ShoppingBag,
  Sprout,
  Loader2,
  TriangleAlert,
  Wallet,
} from 'lucide-react'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import {
  getAdminOverview,
  getPendingListings,
  reviewListing,
  type AdminOverview,
  type PendingListing,
} from '@/app/actions/admin'
import { cedis, pct, formatGHS, shortDate } from '@/lib/golden-acres/format'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { PromotionsSection } from '@/components/golden-acres/dashboard/promotions-section'
import { AnnouncementsSection } from '@/components/golden-acres/dashboard/announcements-section'
import { KycSection } from '@/components/golden-acres/dashboard/kyc-section'
import { ConsoleFrame, ConsoleHeader } from '@/components/golden-acres/staff/console-frame'

type Section =
  | 'overview'
  | 'orders'
  | 'farmers'
  | 'kyc'
  | 'products'
  | 'listings'
  | 'promotions'
  | 'announcements'

const NAV: { key: Section; label: string; badge?: (k: AdminOverview['kpis']) => number; attention?: boolean }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'orders', label: 'Orders', badge: (k) => k.orders },
  { key: 'farmers', label: 'Farmers' },
  { key: 'kyc', label: 'KYC & Sellers', badge: (k) => k.pendingListings, attention: true },
  { key: 'products', label: 'Products' },
  { key: 'listings', label: 'Listings review', badge: (k) => k.pendingListings, attention: true },
  { key: 'promotions', label: 'Promotions' },
  { key: 'announcements', label: 'Announcements' },
]

const STATUS_COLORS: Record<string, string> = {
  delivered: '#0F7A43',
  'out-for-delivery': '#B45309',
  packed: '#3f6d8c',
  confirmed: '#8A7E72',
  placed: '#8A7E72',
  cancelled: '#B91C1C',
}

export function BiDashboard() {
  const [section, setSection] = useState<Section>('overview')

  // Live aggregates, refreshed every 15s so the console tracks the DB.
  const { data, isLoading } = useSWR<AdminOverview>(
    'admin-overview',
    () => getAdminOverview(),
    { refreshInterval: 15000 },
  )

  const kpis = data?.kpis
  const nav = NAV.map((n) => ({
    key: n.key,
    label: n.label,
    badge: n.badge && kpis ? n.badge(kpis) : undefined,
    attention: n.attention,
  }))

  return (
    <ConsoleFrame
      product="Admin console"
      userName="Kofi A."
      userRole="Administrator"
      nav={nav}
      activeKey={section}
      onNavigate={(key) => setSection(key as Section)}
    >
      <ConsoleHeader
        title={NAV.find((n) => n.key === section)?.label}
        lede="Live from the order book · Greater Accra pilot"
        aside={
          kpis && (
            <span className="ga-index inline-flex items-center gap-1.5 rounded-full border border-[rgba(15,122,67,0.3)] px-3 py-1.5 text-[11.5px] font-medium text-[#0F7A43]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0F7A43]/50" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#0F7A43]" />
              </span>
              Live · 15s refresh
            </span>
          )
        }
      />

      {isLoading || !data ? (
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 width={22} height={22} className="animate-spin text-[#8A7E72]" />
        </div>
      ) : (
        <>
          {section === 'overview' && <OverviewSection data={data} onJump={(s) => setSection(s)} />}
          {section === 'orders' && <OrdersSection data={data} />}
          {section === 'farmers' && <FarmersSection data={data} />}
          {section === 'products' && <ProductsSection data={data} />}
          {section === 'kyc' && <KycSection />}
          {section === 'listings' && <ListingsSection />}
          {section === 'promotions' && <PromotionsSection />}
          {section === 'announcements' && <AnnouncementsSection />}
        </>
      )}
    </ConsoleFrame>
  )
}

/* ---------------- Overview: exceptions first ---------------- */

function OverviewSection({
  data,
  onJump,
}: {
  data: AdminOverview
  onJump: (s: Section) => void
}) {
  const k = data.kpis

  // Exception feed — "what needs me right now", each row deep-links.
  const exceptions: {
    id: string
    icon: typeof TriangleAlert
    tone: 'alert' | 'warn' | 'info'
    title: string
    meta: string
    section: Section
  }[] = []
  if (k.payoutsDue > 0)
    exceptions.push({
      id: 'payouts',
      icon: Wallet,
      tone: 'alert',
      title: `${k.payoutsDue} payout entries due`,
      meta: `${formatGHS(k.payoutsDue)} waiting inside the 48h window`,
      section: 'orders',
    })
  if (k.pendingListings > 0)
    exceptions.push({
      id: 'listings',
      icon: Package,
      tone: 'warn',
      title: `${k.pendingListings} listings awaiting approval`,
      meta: 'Farmer-submitted produce is invisible to shoppers until reviewed',
      section: 'listings',
    })
  if (k.openTickets > 0)
    exceptions.push({
      id: 'tickets',
      icon: TriangleAlert,
      tone: 'alert',
      title: `${k.openTickets} open support tickets`,
      meta: 'Customers are waiting in the ops console queue',
      section: 'orders',
    })

  return (
    <>
      {/* KPI band — StatBlocks over a hairline */}
      <dl className="grid grid-cols-2 gap-x-8 gap-y-8 border-t border-[rgba(33,26,18,0.08)] pt-6 lg:grid-cols-4">
        <StatBlock value={cedis(k.gmv, { decimals: false })} label="Gross merchandise value" />
        <StatBlock value={k.orders.toLocaleString()} label="Orders" />
        <StatBlock value={pct(k.onTimeRate)} label="On-time delivery" />
        <StatBlock value={cedis(k.avgOrderValue)} label="Avg order value" />
        <StatBlock value={cedis(k.payoutsDue, { decimals: false })} label="Payouts due" />
        <StatBlock value={k.activeCustomers.toLocaleString()} label="Active customers" />
        <StatBlock value={k.openTickets.toLocaleString()} label="Open tickets" />
        <StatBlock value={k.pendingListings.toLocaleString()} label="Pending listings" />
      </dl>

      {/* Exceptions feed */}
      <section aria-label="Exceptions" className="mt-10">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#7A3F1C]">
          Needs attention
        </h2>
        {exceptions.length === 0 ? (
          <p className="mt-3 border-t border-[rgba(33,26,18,0.08)] pt-5 text-[14px] leading-relaxed text-[#5C5247]">
            All clear — no payouts stuck, no listings queued, no open tickets.
          </p>
        ) : (
          <ul className="border-t border-[rgba(33,26,18,0.08)]">
            {exceptions.map((e) => {
              const Icon = e.icon
              return (
                <li key={e.id}>
                  <button
                    onClick={() => onJump(e.section)}
                    className="group flex w-full items-center justify-between gap-4 border-b border-[rgba(33,26,18,0.08)] py-4 text-left"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                          e.tone === 'alert'
                            ? 'border-[rgba(185,28,28,0.35)] text-[#B91C1C]'
                            : 'border-[rgba(180,83,9,0.35)] text-[#B45309]'
                        }`}
                      >
                        <Icon width={14} height={14} />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[14.5px] font-semibold text-[#211A12] transition-colors group-hover:text-[#7A3F1C]">
                          {e.title}
                        </span>
                        <span className="block truncate text-[12.5px] text-[#8A7E72]">{e.meta}</span>
                      </span>
                    </span>
                    <span
                      className={`ga-index shrink-0 rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide ${
                        e.tone === 'alert'
                          ? 'bg-[#B91C1C]/8 text-[#B91C1C]'
                          : 'bg-[#B45309]/10 text-[#B45309]'
                      }`}
                    >
                      Act now
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* Charts below the fold */}
      <section className="mt-12 grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <Takeaway>
            Revenue tracks the harvest calendar — dips align with the minor dry
            season, not with churn.
          </Takeaway>
          {data.revenueSeries.length > 0 ? (
            <ChartContainer
              config={{ value: { label: 'Revenue' } as ChartConfig }}
              className="h-[240px] w-full"
            >
              <AreaChart data={data.revenueSeries} margin={{ left: 4, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-value)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--color-value)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(33,26,18,0.08)" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} stroke="#8A7E72" />
                <YAxis tickLine={false} axisLine={false} width={44} fontSize={11} stroke="#8A7E72" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area dataKey="value" type="monotone" stroke="var(--color-value)" strokeWidth={2} fill="url(#revFill)" />
              </AreaChart>
            </ChartContainer>
          ) : (
            <EmptyChart />
          )}
        </div>

        <div>
          <Takeaway>Fulfilment mix shows where orders sit right now.</Takeaway>
          <ul className="space-y-3">
            {data.ordersByStatus.map((s) => {
              const total = data.ordersByStatus.reduce((a, b) => a + b.count, 0) || 1
              const w = Math.round((s.count / total) * 100)
              return (
                <li key={s.status}>
                  <div className="mb-1 flex items-center justify-between text-[13px]">
                    <span className="font-medium capitalize text-[#211A12]">
                      {s.status.replace('-', ' ')}
                    </span>
                    <span className="ga-index text-[#8A7E72]">{s.count}</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-[rgba(33,26,18,0.08)]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${w}%`, background: STATUS_COLORS[s.status] ?? '#8A7E72' }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="mt-10">
        <RecentOrdersPanel data={data} />
      </section>
    </>
  )
}

function Takeaway({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 max-w-xl border-l-2 border-[#DF8821]/60 pl-3 text-[13px] leading-relaxed text-[#5C5247]">
      {children}
    </p>
  )
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-t border-[rgba(33,26,18,0.08)] pt-3">
      <dd className="ga-index text-[clamp(24px,2.6vw,34px)] font-semibold leading-none tracking-[-0.02em] text-[#211A12]">
        {value}
      </dd>
      <dt className="mt-2 text-[12.5px] font-medium text-[#8A7E72]">{label}</dt>
    </div>
  )
}

/* ---------------- Orders / Farmers / Products ---------------- */

function OrdersSection({ data }: { data: AdminOverview }) {
  return (
    <section className="mt-2">
      <RecentOrdersPanel data={data} expanded />
    </section>
  )
}

function RecentOrdersPanel({ data, expanded }: { data: AdminOverview; expanded?: boolean }) {
  const rows = expanded ? data.recentOrders : data.recentOrders.slice(0, 6)
  return (
    <div>
      {!expanded && (
        <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#8A7E72]">
          Recent orders
        </h2>
      )}
      {rows.length > 0 ? (
        <ul className="border-t border-[rgba(33,26,18,0.08)]">
          {rows.map((o) => (
            <li
              key={o.reference}
              className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1 border-b border-[rgba(33,26,18,0.08)] py-3.5"
            >
              <span className="min-w-0">
                <span className="flex flex-wrap items-baseline gap-x-3">
                  <span className="ga-index text-[14px] font-semibold text-[#211A12]">
                    {o.reference}
                  </span>
                  <span
                    className="text-[12.5px]"
                    style={{ color: STATUS_COLORS[o.status] ?? '#8A7E72' }}
                  >
                    {o.status.replace('-', ' ')}
                  </span>
                </span>
                <span className="ga-index mt-0.5 block truncate text-[12.5px] text-[#8A7E72]">
                  {o.customerName} · {shortDate(o.placedAt)}
                </span>
              </span>
              <span className="ga-index justify-self-end text-[14px] font-semibold text-[#211A12]">
                {formatGHS(o.total)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyRow icon={ShoppingBag} text="No orders yet." />
      )}
    </div>
  )
}

function FarmersSection({ data }: { data: AdminOverview }) {
  return (
    <section className="mt-2">
      <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#8A7E72]">
        Top farmers by gross sales
      </h2>
      {data.topFarmers.length > 0 ? (
        <ol className="border-t border-[rgba(33,26,18,0.08)]">
          {data.topFarmers.map((f, i) => (
            <li
              key={f.farmerId}
              className="flex items-center gap-4 border-b border-[rgba(33,26,18,0.08)] py-3.5"
            >
              <span className="ga-index w-6 shrink-0 text-[12px] font-semibold text-[#8A7E72]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14.5px] font-semibold text-[#211A12]">
                  {f.name}
                </span>
                <span className="ga-index block truncate text-[12.5px] text-[#8A7E72]">
                  {f.farmName} · {f.orders} orders
                </span>
              </span>
              <span className="ga-index shrink-0 text-[14.5px] font-semibold tracking-[-0.02em] text-[#211A12]">
                {formatGHS(f.gross)}
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <EmptyRow icon={Sprout} text="No settled sales yet." />
      )}
    </section>
  )
}

function ProductsSection({ data }: { data: AdminOverview }) {
  return (
    <section className="mt-2">
      <Takeaway>
        Units sold across realised orders — stock the winners deeper next cycle.
      </Takeaway>
      {data.topProducts.length > 0 ? (
        <ChartContainer
          config={{ units: { label: 'Units' } as ChartConfig }}
          className="h-[300px] w-full"
        >
          <BarChart
            data={data.topProducts.map((p) => ({ ...p, short: p.name.split(' ').slice(0, 2).join(' ') }))}
            layout="vertical"
            margin={{ left: 8, right: 16 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="rgba(33,26,18,0.08)" />
            <XAxis type="number" tickLine={false} axisLine={false} fontSize={11} stroke="#8A7E72" />
            <YAxis type="category" dataKey="short" tickLine={false} axisLine={false} width={110} fontSize={11} stroke="#8A7E72" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="units" fill="var(--color-units)" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ChartContainer>
      ) : (
        <EmptyRow icon={Package} text="No product sales yet." />
      )}
    </section>
  )
}

function ListingsSection() {
  const { data, isLoading, mutate } = useSWR<PendingListing[]>(
    'admin-pending-listings',
    () => getPendingListings(),
    { refreshInterval: 10000 },
  )
  const [busy, setBusy] = useState<string | null>(null)

  async function decide(id: string, decision: 'live' | 'rejected') {
    setBusy(id)
    // Optimistically drop the row, then confirm with the server.
    mutate((cur) => (cur ?? []).filter((p) => p.id !== id), { revalidate: false })
    await reviewListing(id, decision)
    setBusy(null)
    mutate()
  }

  return (
    <section className="mt-2">
      <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#8A7E72]">
        Listing approvals
      </h2>
      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <Loader2 width={18} height={18} className="animate-spin text-[#8A7E72]" />
        </div>
      ) : data && data.length > 0 ? (
        <ul className="border-t border-[rgba(33,26,18,0.08)]">
          {data.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-3 border-b border-[rgba(33,26,18,0.08)] py-3"
            >
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[10px] bg-white">
                <SmartImage src={p.image} alt={p.name} fill />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-semibold text-[#211A12]">{p.name}</span>
                <span className="ga-index block truncate text-[12.5px] text-[#8A7E72]">
                  {p.farmerName} · {formatGHS(p.priceMin)}/{p.unit} · {p.category}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5">
                <button
                  onClick={() => decide(p.id, 'live')}
                  disabled={busy === p.id}
                  className="inline-flex h-8 items-center gap-1 rounded-full bg-[#0B3B25] px-3 text-[12px] font-semibold text-white transition-colors hover:bg-[#0F4A2E] disabled:opacity-50"
                >
                  {busy === p.id ? (
                    <Loader2 width={12} height={12} className="animate-spin" />
                  ) : (
                    <Check width={12} height={12} />
                  )}
                  Approve
                </button>
                <button
                  onClick={() => decide(p.id, 'rejected')}
                  disabled={busy === p.id}
                  aria-label={`Reject ${p.name}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(33,26,18,0.15)] text-[#8A7E72] transition-colors hover:border-[rgba(185,28,28,0.4)] hover:text-[#B91C1C] disabled:opacity-50"
                >
                  <X width={14} height={14} />
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyRow icon={Check} text="All caught up. New farmer listings will appear here for approval." />
      )}
    </section>
  )
}

/* ---------------- Small pieces ---------------- */

function EmptyChart() {
  return (
    <div className="flex h-[220px] flex-col items-center justify-center text-center">
      <TrendingUp width={26} height={26} className="text-[#B7AC9E]" />
      <p className="mt-2 text-[13px] text-[#8A7E72]">Not enough data to chart yet.</p>
    </div>
  )
}

function EmptyRow({ icon: Icon, text }: { icon: typeof Check; text: string }) {
  return (
    <div className="flex flex-col items-center border-t border-[rgba(33,26,18,0.08)] py-10 text-center">
      <Icon width={22} height={22} className="text-[#B7AC9E]" />
      <p className="mt-2 text-[13px] text-[#8A7E72]">{text}</p>
    </div>
  )
}

