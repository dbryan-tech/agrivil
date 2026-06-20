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
  Users,
  Truck,
  Leaf,
  DollarSign,
  Package,
  Check,
  X,
  ShoppingBag,
  LayoutGrid,
  Sprout,
  Wallet,
  LifeBuoy,
  ClipboardCheck,
  Loader2,
  ReceiptText,
  BadgePercent,
  Megaphone,
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

type Section =
  | 'overview'
  | 'orders'
  | 'farmers'
  | 'products'
  | 'listings'
  | 'promotions'
  | 'announcements'

const NAV: { id: Section; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'orders', label: 'Orders', icon: ReceiptText },
  { id: 'farmers', label: 'Farmers', icon: Sprout },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'listings', label: 'Listings', icon: ClipboardCheck },
  { id: 'promotions', label: 'Promotions', icon: BadgePercent },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
]

const STATUS_COLORS: Record<string, string> = {
  delivered: '#4f7d2f',
  'out-for-delivery': '#b8791a',
  packed: '#3f6d8c',
  confirmed: '#6b7280',
  placed: '#6b7280',
  cancelled: '#c0492e',
}

export function BiDashboard() {
  const [section, setSection] = useState<Section>('overview')

  // Live aggregates, refreshed every 15s so the console tracks the DB.
  const { data, isLoading } = useSWR<AdminOverview>(
    'admin-overview',
    () => getAdminOverview(),
    { refreshInterval: 15000 },
  )

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="shrink-0 border-b border-border bg-card/60 lg:w-60 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Leaf className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="ga-display text-lg font-semibold text-foreground">AgriVil</p>
            <p className="text-xs text-muted-foreground">Admin console</p>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:pb-0">
          {NAV.map((n) => {
            const active = section === n.id
            return (
              <button
                key={n.id}
                onClick={() => setSection(n.id)}
                className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary'
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="ga-display text-3xl font-semibold leading-none text-foreground">
              {NAV.find((n) => n.id === section)?.label}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Live from the order book · Greater Accra pilot
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Live
          </span>
        </header>

        {isLoading || !data ? (
          <div className="flex h-[60vh] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {section === 'overview' && <OverviewSection data={data} />}
            {section === 'orders' && <OrdersSection data={data} />}
            {section === 'farmers' && <FarmersSection data={data} />}
            {section === 'products' && <ProductsSection data={data} />}
            {section === 'listings' && <ListingsSection />}
            {section === 'promotions' && <PromotionsSection />}
            {section === 'announcements' && <AnnouncementsSection />}
          </>
        )}
      </main>
    </div>
  )
}

function OverviewSection({ data }: { data: AdminOverview }) {
  const k = data.kpis
  return (
    <>
      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={DollarSign} label="Gross merchandise value" value={cedis(k.gmv, { decimals: false })} />
        <KpiCard icon={ShoppingBag} label="Orders" value={k.orders.toLocaleString()} />
        <KpiCard icon={Users} label="Active customers" value={k.activeCustomers.toLocaleString()} />
        <KpiCard icon={Truck} label="On-time delivery" value={pct(k.onTimeRate)} />
        <KpiCard icon={DollarSign} label="Avg order value" value={cedis(k.avgOrderValue)} />
        <KpiCard icon={Wallet} label="Payouts due" value={cedis(k.payoutsDue, { decimals: false })} />
        <KpiCard icon={LifeBuoy} label="Open tickets" value={k.openTickets.toLocaleString()} />
        <KpiCard icon={ClipboardCheck} label="Pending listings" value={k.pendingListings.toLocaleString()} />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Panel title="Monthly revenue" subtitle="Realised GMV by month (GH₵)">
          {data.revenueSeries.length > 0 ? (
            <ChartContainer
              config={{ value: { label: 'Revenue', color: 'var(--chart-2)' } } satisfies ChartConfig}
              className="h-[260px] w-full"
            >
              <AreaChart data={data.revenueSeries} margin={{ left: 4, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-value)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-value)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} width={44} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area dataKey="value" type="monotone" stroke="var(--color-value)" strokeWidth={2.5} fill="url(#revFill)" />
              </AreaChart>
            </ChartContainer>
          ) : (
            <EmptyChart />
          )}
        </Panel>

        <Panel title="Orders by status" subtitle="Current fulfilment mix">
          <ul className="space-y-2.5">
            {data.ordersByStatus.map((s) => {
              const total = data.ordersByStatus.reduce((a, b) => a + b.count, 0) || 1
              const w = Math.round((s.count / total) * 100)
              return (
                <li key={s.status}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-semibold capitalize text-foreground">
                      {s.status.replace('-', ' ')}
                    </span>
                    <span className="text-muted-foreground">{s.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${w}%`, background: STATUS_COLORS[s.status] ?? '#6b7280' }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </Panel>
      </section>

      <section className="mt-5">
        <RecentOrdersPanel data={data} />
      </section>
    </>
  )
}

function OrdersSection({ data }: { data: AdminOverview }) {
  return (
    <section className="mt-6">
      <RecentOrdersPanel data={data} expanded />
    </section>
  )
}

function RecentOrdersPanel({ data, expanded }: { data: AdminOverview; expanded?: boolean }) {
  const rows = expanded ? data.recentOrders : data.recentOrders.slice(0, 6)
  return (
    <Panel title="Recent orders" subtitle="Newest orders across the marketplace">
      {rows.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-2 pr-3 font-semibold">Reference</th>
                <th className="pb-2 pr-3 font-semibold">Customer</th>
                <th className="pb-2 pr-3 font-semibold">Placed</th>
                <th className="pb-2 pr-3 font-semibold">Status</th>
                <th className="pb-2 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((o) => (
                <tr key={o.reference}>
                  <td className="py-2.5 pr-3 font-semibold text-foreground">{o.reference}</td>
                  <td className="py-2.5 pr-3 text-muted-foreground">{o.customerName}</td>
                  <td className="py-2.5 pr-3 text-muted-foreground">{shortDate(o.placedAt)}</td>
                  <td className="py-2.5 pr-3">
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-semibold capitalize"
                      style={{
                        color: STATUS_COLORS[o.status] ?? '#6b7280',
                        background: `${STATUS_COLORS[o.status] ?? '#6b7280'}1a`,
                      }}
                    >
                      {o.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-bold text-foreground">{formatGHS(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon={ShoppingBag} text="No orders yet." />
      )}
    </Panel>
  )
}

function FarmersSection({ data }: { data: AdminOverview }) {
  return (
    <section className="mt-6">
      <Panel title="Top farmers" subtitle="Ranked by gross sales (settlement ledger)">
        {data.topFarmers.length > 0 ? (
          <ul className="space-y-2.5">
            {data.topFarmers.map((f, i) => (
              <li
                key={f.farmerId}
                className="flex items-center justify-between gap-3 rounded-lg bg-secondary px-3 py-3 text-sm"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-card text-xs font-bold text-muted-foreground">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">{f.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{f.farmName} · {f.orders} orders</p>
                  </div>
                </div>
                <span className="shrink-0 font-bold text-foreground">{formatGHS(f.gross)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={Sprout} text="No settled sales yet." />
        )}
      </Panel>
    </section>
  )
}

function ProductsSection({ data }: { data: AdminOverview }) {
  return (
    <section className="mt-6">
      <Panel title="Top products" subtitle="By units sold across realised orders">
        {data.topProducts.length > 0 ? (
          <ChartContainer
            config={{ units: { label: 'Units', color: 'var(--chart-1)' } } satisfies ChartConfig}
            className="h-[320px] w-full"
          >
            <BarChart
              data={data.topProducts.map((p) => ({ ...p, short: p.name.split(' ').slice(0, 2).join(' ') }))}
              layout="vertical"
              margin={{ left: 8, right: 16 }}
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="short" tickLine={false} axisLine={false} width={110} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="units" fill="var(--color-units)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ChartContainer>
        ) : (
          <EmptyState icon={Package} text="No product sales yet." />
        )}
      </Panel>
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
    <section className="mt-6">
      <Panel title="Listing approvals" subtitle="Farmer-submitted produce awaiting review">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : data && data.length > 0 ? (
          <ul className="space-y-3">
            {data.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-background p-2.5"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-secondary">
                  <SmartImage src={p.image} alt={p.name} fill />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">{p.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {p.farmerName} · {formatGHS(p.priceMin)}/{p.unit} · {p.category}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    onClick={() => decide(p.id, 'live')}
                    disabled={busy === p.id}
                    className="ga-press inline-flex h-8 items-center gap-1 rounded-full bg-primary px-3 text-xs font-bold text-primary-foreground disabled:opacity-50"
                  >
                    {busy === p.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                    Approve
                  </button>
                  <button
                    onClick={() => decide(p.id, 'rejected')}
                    disabled={busy === p.id}
                    aria-label={`Reject ${p.name}`}
                    className="ga-press inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={Check} text="All caught up. New farmer listings will appear here for approval." />
        )}
      </Panel>
    </section>
  )
}

function KpiCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users
  label: string
  value: string
}) {
  return (
    <div className="ga-card-hover rounded-2xl border border-border bg-card p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <p className="ga-display mt-3 text-3xl text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4">
        <h2 className="ga-display text-xl text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </div>
  )
}

function EmptyChart() {
  return (
    <div className="flex h-[260px] flex-col items-center justify-center text-center">
      <TrendingUp className="h-8 w-8 text-muted-foreground/40" />
      <p className="mt-2 text-sm text-muted-foreground">Not enough data to chart yet.</p>
    </div>
  )
}

function EmptyState({ icon: Icon, text }: { icon: typeof Check; text: string }) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <Icon className="h-8 w-8 text-muted-foreground/50" />
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  )
}
