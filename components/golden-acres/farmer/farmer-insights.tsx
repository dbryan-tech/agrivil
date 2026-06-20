'use client'

import { useMemo } from 'react'
import useSWR from 'swr'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { TrendingUp, Package, Wallet, Star } from 'lucide-react'
import { useDataStore } from '@/components/golden-acres/store/data-store'
import { getFarmerLedger } from '@/app/actions/payouts'
import { cedis } from '@/lib/golden-acres/format'
import type { Farmer } from '@/lib/golden-acres/types'

const STATUS_COLORS: Record<string, string> = {
  placed: 'var(--ga-gold)',
  picking: 'var(--ga-field)',
  packed: 'var(--ga-leaf)',
  'out-for-delivery': 'var(--ga-copper)',
  delivered: 'var(--ga-leaf)',
  cancelled: 'var(--ga-terracotta)',
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function FarmerInsights({ farmer }: { farmer: Farmer }) {
  const { ordersByFarmer, productsByFarmer } = useDataStore()
  const orders = ordersByFarmer(farmer.id)
  const mine = productsByFarmer(farmer.id)

  const { data: ledger } = useSWR(
    farmer?.id ? ['farmer-ledger-insights', farmer.id] : null,
    () => getFarmerLedger(farmer.id),
  )

  // Revenue across the last 7 days from this farmer's lines.
  const revenueSeries = useMemo(() => {
    const today = new Date()
    const days: { label: string; value: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      days.push({ label: DAY_LABELS[d.getDay()], value: 0 })
    }
    orders.forEach((o) => {
      const placed = new Date(o.placedAt)
      const diff = Math.floor(
        (today.setHours(0, 0, 0, 0) - new Date(placed).setHours(0, 0, 0, 0)) /
          86400000,
      )
      if (diff >= 0 && diff <= 6) {
        const idx = 6 - diff
        const mineTotal = o.items
          .filter((it) => it.farmerId === farmer.id)
          .reduce((s, it) => s + (it.priceFinal ?? it.priceEstimate), 0)
        if (days[idx]) days[idx].value += Math.round(mineTotal)
      }
    })
    return days
  }, [orders, farmer.id])

  // Units sold by product (top 5).
  const unitsByProduct = useMemo(() => {
    const map = new Map<string, number>()
    orders.forEach((o) =>
      o.items
        .filter((it) => it.farmerId === farmer.id)
        .forEach((it) => map.set(it.name, (map.get(it.name) ?? 0) + it.qty)),
    )
    return Array.from(map.entries())
      .map(([name, units]) => ({ name: name.length > 14 ? name.slice(0, 13) + '…' : name, units }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 5)
  }, [orders, farmer.id])

  // Order status mix (donut).
  const statusMix = useMemo(() => {
    const map = new Map<string, number>()
    orders.forEach((o) => map.set(o.status, (map.get(o.status) ?? 0) + 1))
    return Array.from(map.entries()).map(([status, count]) => ({ status, count }))
  }, [orders])

  const weekRevenue = revenueSeries.reduce((s, d) => s + d.value, 0)
  const weekUnits = unitsByProduct.reduce((s, d) => s + d.units, 0)
  const paidTotal = (ledger ?? [])
    .filter((l) => l.payoutStatus === 'paid')
    .reduce((s, l) => s + l.netPayout, 0)

  const kpis = [
    { label: 'Revenue (7d)', value: cedis(weekRevenue, { decimals: false }), icon: TrendingUp },
    { label: 'Units sold (7d)', value: String(weekUnits), icon: Package },
    { label: 'Paid out', value: cedis(paidTotal, { decimals: false }), icon: Wallet },
    { label: 'Rating', value: farmer.rating.toFixed(1), icon: Star },
  ]

  return (
    <section className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--ga-gold)]">
          Insights
        </p>
        <h1 className="ga-display mt-1 text-2xl font-semibold text-foreground">
          How your farm is performing
        </h1>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-border bg-card p-4">
            <k.icon className="h-4 w-4 text-[var(--ga-gold)]" />
            <p className="ga-display mt-2 text-2xl font-semibold text-foreground">{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue trend */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="text-sm font-bold text-foreground">Revenue · last 7 days</h3>
        <ChartContainer
          config={{ value: { label: 'Revenue', color: 'var(--ga-field)' } } satisfies ChartConfig}
          className="mt-3 h-[180px] w-full"
        >
          <AreaChart data={revenueSeries} margin={{ left: 4, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="farmRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-value)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-value)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
            <YAxis tickLine={false} axisLine={false} width={34} fontSize={11} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area dataKey="value" type="monotone" stroke="var(--color-value)" strokeWidth={2.5} fill="url(#farmRev)" />
          </AreaChart>
        </ChartContainer>
      </div>

      {/* Top products */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="text-sm font-bold text-foreground">Best sellers · units</h3>
        {unitsByProduct.length > 0 ? (
          <ChartContainer
            config={{ units: { label: 'Units', color: 'var(--ga-gold)' } } satisfies ChartConfig}
            className="mt-3 h-[180px] w-full"
          >
            <BarChart data={unitsByProduct} layout="vertical" margin={{ left: 8, right: 12 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={90} fontSize={11} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="units" fill="var(--color-units)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ChartContainer>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">No sales recorded yet.</p>
        )}
      </div>

      {/* Status mix donut */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="text-sm font-bold text-foreground">Order status mix</h3>
        {statusMix.length > 0 ? (
          <div className="flex items-center gap-4">
            <ChartContainer config={{}} className="h-[150px] w-[150px]">
              <PieChart>
                <Pie data={statusMix} dataKey="count" nameKey="status" innerRadius={38} outerRadius={64} paddingAngle={2}>
                  {statusMix.map((s) => (
                    <Cell key={s.status} fill={STATUS_COLORS[s.status] ?? '#6b7280'} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <ul className="flex-1 space-y-1.5">
              {statusMix.map((s) => (
                <li key={s.status} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 capitalize text-foreground">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLORS[s.status] ?? '#6b7280' }} />
                    {s.status.replace('-', ' ')}
                  </span>
                  <span className="font-bold text-foreground">{s.count}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">No orders yet.</p>
        )}
      </div>
    </section>
  )
}
