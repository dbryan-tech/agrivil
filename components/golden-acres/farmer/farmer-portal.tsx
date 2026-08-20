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
import { FarmerReviewsTab } from '@/components/golden-acres/farmer/farmer-reviews-tab'
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
  Clock,
  ChevronRight,
  ShieldCheck,
  Leaf,
  Star,
  UserCog,
  Hourglass,
  Save,
  Snowflake,
} from 'lucide-react'

type Tab = 'today' | 'inventory' | 'add' | 'earnings' | 'reviews' | 'profile'

const TABS: { id: Tab; label: string; icon: typeof Package }[] = [
  { id: 'today', label: 'Today', icon: CalendarClock },
  { id: 'inventory', label: 'Stock', icon: Package },
  { id: 'add', label: 'Add', icon: Plus },
  { id: 'earnings', label: 'Earnings', icon: Wallet },
  { id: 'reviews', label: 'Reviews', icon: Star },
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
        {tab === 'today' && <TodayTab farmer={farmer} />}
        {tab === 'inventory' && <InventoryTab farmer={farmer} online={online} />}
        {tab === 'add' && <AddProduceTab farmer={farmer} online={online} />}
        {tab === 'earnings' && <EarningsTab farmer={farmer} />}
        {tab === 'reviews' && <FarmerReviewsTab farmer={farmer} />}
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
    <header className="sticky top-0 z-20 border-b border-border bg-[var(--ga-field-deep)] px-4 pb-3 pt-4 text-[var(--ga-cream)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-[var(--ga-gold-soft)]">
            <SmartImage src={farmer.photo} alt={farmer.name} fill />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">{farmer.farmName}</p>
            <p className="flex items-center gap-1 text-xs text-[var(--ga-cream)]/70">
              <Star className="h-3 w-3 fill-[var(--ga-gold-soft)] text-[var(--ga-gold-soft)]" />
              {farmer.rating} · {pct(farmer.onTimeRate, 0)} on-time
            </p>
          </div>
        </div>
        {/* Connectivity toggle — demonstrates the low-bandwidth offline mode */}
        <button
          onClick={() => setOnline(!online)}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
            online
              ? 'bg-[var(--ga-leaf)]/25 text-[var(--ga-cream)]'
              : 'bg-[var(--ga-terracotta)]/30 text-[var(--ga-cream)]'
          }`}
          aria-label="Toggle connectivity"
        >
          {online ? (
            <>
              <Wifi className="h-3.5 w-3.5" /> Online
            </>
          ) : (
            <>
              <WifiOff className="h-3.5 w-3.5" /> Offline
            </>
          )}
        </button>
      </div>

      {!online && (
        <p className="mt-2 flex items-center gap-1.5 rounded-lg bg-[var(--ga-cream)]/10 px-2.5 py-1.5 text-xs font-semibold">
          <CloudCheck className="h-3.5 w-3.5 text-[var(--ga-gold-soft)]" />
          Changes are saved on your phone and will sync when you&apos;re back
          online.
        </p>
      )}
    </header>
  )
}

/* ---------------- Today / Orders ---------------- */
function TodayTab({ farmer }: { farmer: Farmer }) {
  const { ordersByFarmer, productsByFarmer, setOrderStatus } = useDataStore()
  const myProductIds = productsByFarmer(farmer.id).map((p) => p.id)
  const myOrders = ordersByFarmer(farmer.id)

  const pendingPickup = myOrders.filter(
    (o) => o.status === 'placed' || o.status === 'picking',
  )
  const harvestList = useMemo(() => {
    const map = new Map<string, number>()
    pendingPickup.forEach((o) =>
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
  }, [myOrders])

  return (
    <section className="space-y-5">
      <SectionTitle
        eyebrow="Good morning"
        title={`${myOrders.length} order${myOrders.length === 1 ? '' : 's'} include your produce`}
      />

      {/* Harvest list — what to pick this morning */}
      {harvestList.length > 0 && (
        <div className="rounded-2xl border border-[var(--ga-gold-soft)] bg-[var(--ga-gold)]/8 p-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--ga-gold)]">
            <Leaf className="h-4 w-4" /> Harvest list — pick before 7am
          </h3>
          <ul className="mt-3 space-y-2">
            {harvestList.map(({ product, kg }) => (
              <li
                key={product?.id ?? kg}
                className="flex items-center justify-between text-sm"
              >
                <span className="font-semibold text-foreground">
                  {product?.name ?? 'Item'}
                </span>
                <span className="font-bold text-[var(--ga-field-deep)]">
                  {weight(kg)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Order cards */}
      <div className="space-y-3">
        {myOrders.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
            No orders yet today. New baskets that include your produce will
            appear here automatically.
          </p>
        )}
        {myOrders.map((o) => {
          const mine = o.items.filter((it) => it.farmerId === farmer.id)
          return (
            <div
              key={o.id}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-foreground">{o.reference}</p>
                  <p className="text-xs text-muted-foreground">
                    {shortDate(o.slot.date)} · {o.slot.window}
                  </p>
                </div>
                <StatusPill status={o.status} />
              </div>
              <ul className="mt-3 space-y-1.5 border-t border-border pt-3">
                {mine.map((it) => (
                  <li
                    key={it.productId}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-foreground">
                      {it.qty} × {it.name}
                    </span>
                    <span className="flex items-center gap-2 text-muted-foreground">
                      {weight(it.estWeightKg * it.qty)}
                      {it.refrigerationRequired && (
                        <Snowflake className="h-3.5 w-3.5 text-[#0B3B25]" />
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              {(o.status === 'placed' || o.status === 'picking') && (
                <button
                  onClick={() => setOrderStatus(o.reference, 'packed')}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98]"
                >
                  <Check className="h-4 w-4" /> Mark as harvested & packed
                </button>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ---------------- Inventory ---------------- */
function InventoryTab({ farmer, online }: { farmer: Farmer; online: boolean }) {
  const { productsByFarmer, setProductStock } = useDataStore()
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
      <SectionTitle eyebrow="Inventory" title="Today's available stock" />

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

function AddProduceTab({ farmer, online }: { farmer: Farmer; online: boolean }) {
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

/* ---------------- Earnings / Ledger ---------------- */
function EarningsTab({ farmer }: { farmer: Farmer }) {
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
    <section className="space-y-5">
      <SectionTitle eyebrow="Earnings" title="Your payouts" />

      {/* Sales analytics — revenue trend, best sellers, fulfilment mix */}
      <FarmerInsights farmer={farmer} />

      {/* Balance card */}
      <div className="rounded-2xl bg-[var(--ga-field-deep)] p-5 text-[var(--ga-cream)]">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ga-cream)]/60">
          Paid out to your MoMo wallet
        </p>
        <p className="ga-display mt-1 text-4xl font-semibold">
          {cedis(paidTotal)}
        </p>
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-[var(--ga-cream)]/10 px-3 py-2.5">
          <ShieldCheck className="h-4 w-4 shrink-0 text-[var(--ga-gold-soft)]" />
          <p className="text-xs font-semibold">
            {scheduled > 0
              ? `${cedis(scheduled)} scheduled via MoMo — 48-hour payout guarantee`
              : "All caught up — 48-hour MoMo payout guarantee"}
          </p>
        </div>
        {farmer.momoNumber && (
          <p className="mt-3 text-xs text-[var(--ga-cream)]/70">
            Payouts to {farmer.momoProvider} {maskMomo(farmer.momoNumber)}
          </p>
        )}
      </div>

      {/* Ledger */}
      <div>
        <h3 className="mb-2 text-sm font-bold text-foreground">
          Transaction history
        </h3>
        {isLoading ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Loading your ledger…
          </div>
        ) : ledger.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No payouts yet. Earnings appear here once your delivered orders are
            settled.
          </div>
        ) : (
          <div className="divide-y divide-border rounded-2xl border border-border bg-card">
            {ledger.map((l) => (
              <div key={l.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-foreground">{l.orderRef}</p>
                    <p className="text-xs text-muted-foreground">
                      {shortDate(l.date)}
                      {l.payoutStatus === "paid" && l.payoutRef
                        ? ` · ref ${l.payoutRef.slice(0, 12)}`
                        : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-[var(--ga-field-deep)]">
                      {cedis(l.netPayout)}
                    </p>
                    <PayoutPill status={l.payoutStatus} ts={l.payoutTimestamp} />
                  </div>
                </div>
                <dl className="mt-2 grid grid-cols-3 gap-2 border-t border-border pt-2 text-center text-xs">
                  <Stat label="Gross" value={cedis(l.grossSales, { decimals: false })} />
                  <Stat
                    label="Commission"
                    value={`−${cedis(l.commission, { decimals: false })}`}
                    muted
                  />
                  <Stat
                    label="SOP penalty"
                    value={l.sopPenalty ? `−${cedis(l.sopPenalty, { decimals: false })}` : '—'}
                    warn={l.sopPenalty > 0}
                  />
                </dl>
                {l.payoutStatus === "failed" && l.failureReason && (
                  <p className="mt-2 rounded-lg bg-[var(--ga-clay)]/10 px-2.5 py-1.5 text-xs font-semibold text-[var(--ga-clay)]">
                    Payout failed: {l.failureReason}. Our team will retry.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Link
        href="/"
        className="flex items-center justify-center gap-1 py-2 text-sm font-bold text-muted-foreground"
      >
        Back to storefront <ChevronRight className="h-4 w-4" />
      </Link>
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
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t border-border bg-card/95 backdrop-blur">
      <div className="grid grid-cols-6">
        {TABS.map((t) => {
          const Icon = t.icon
          const active = t.id === tab
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-col items-center gap-1 py-3 text-[10px] font-bold transition-colors ${
                active ? 'text-[var(--ga-gold)]' : 'text-muted-foreground'
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                  active ? 'bg-[var(--ga-gold)]/12' : ''
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>
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
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--ga-gold)]">
        {eyebrow}
      </p>
      <h1 className="ga-display mt-1 text-2xl font-semibold text-foreground">
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

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; Icon: typeof Clock }> = {
    placed: { label: 'New', cls: 'bg-[var(--ga-gold)]/15 text-[var(--ga-gold)]', Icon: Clock },
    picking: { label: 'Picking', cls: 'bg-[var(--ga-field)]/15 text-[var(--ga-field)]', Icon: Leaf },
    packed: { label: 'Packed', cls: 'bg-[var(--ga-leaf)]/15 text-[var(--ga-leaf)]', Icon: Package },
    'out-for-delivery': { label: 'On route', cls: 'bg-[var(--ga-field)]/15 text-[var(--ga-field)]', Icon: Clock },
    delivered: { label: 'Delivered', cls: 'bg-[var(--ga-leaf)]/15 text-[var(--ga-leaf)]', Icon: Check },
    cancelled: { label: 'Cancelled', cls: 'bg-[var(--ga-terracotta)]/15 text-[var(--ga-terracotta)]', Icon: TriangleAlert },
  }
  const s = map[status] ?? map.placed
  const Icon = s.Icon
  return (
    <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${s.cls}`}>
      <Icon className="h-3 w-3" /> {s.label}
    </span>
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

function PayoutPill({ status, ts }: { status: string; ts: string }) {
  if (status === 'paid') {
    return (
      <span className="flex items-center justify-end gap-1 text-[11px] font-bold text-[var(--ga-leaf)]">
        <Check className="h-3 w-3" /> Paid
      </span>
    )
  }
  if (status === 'failed') {
    return (
      <span className="flex items-center justify-end gap-1 text-[11px] font-bold text-[var(--ga-clay)]">
        <Clock className="h-3 w-3" /> Failed
      </span>
    )
  }
  if (status === 'processing') {
    return (
      <span className="flex items-center justify-end gap-1 text-[11px] font-bold text-[var(--ga-gold)]">
        <Clock className="h-3 w-3" /> Processing
      </span>
    )
  }
  const days = daysUntil(ts)
  return (
    <span className="flex items-center justify-end gap-1 text-[11px] font-bold text-[var(--ga-gold)]">
      <Clock className="h-3 w-3" />
      {days <= 0 ? `by ${timeOf(ts)}` : `in ${days}d`}
    </span>
  )
}

function Stat({
  label,
  value,
  muted,
  warn,
}: {
  label: string
  value: string
  muted?: boolean
  warn?: boolean
}) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={`mt-0.5 font-bold ${
          warn
            ? 'text-[var(--ga-terracotta)]'
            : muted
              ? 'text-muted-foreground'
              : 'text-foreground'
        }`}
      >
        {value}
      </dd>
    </div>
  )
}
