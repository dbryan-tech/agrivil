'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Package,
  MapPin,
  MapPinned,
  Repeat,
  User,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Star,
  Play,
  Pause,
  RotateCcw,
  Check,
  X,
  Heart,
  Award,
  Shield,
} from 'lucide-react'
import { useSession } from '@/components/golden-acres/auth/session-context'
import { useCart } from '@/components/golden-acres/cart-context'
import { useDataStore } from '@/components/golden-acres/store/data-store'
import type {
  Account,
  CustomerAccount,
  SavedAddress,
  SubscriptionStatus,
  OrderStatus,
  Order,
} from '@/lib/golden-acres/types'
import { cedis, shortDate, formatGHS } from '@/lib/golden-acres/format'
import { productEstimate } from '@/lib/golden-acres/data'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { AvatarUpload } from '@/components/golden-acres/image-upload-control'
import { SecurityTab } from '@/components/golden-acres/account/security-tab'
import {
  tierFor,
  nextTier,
  tierProgress,
  POINT_VALUE_GHS,
} from '@/lib/golden-acres/loyalty'
import { cn } from '@/lib/utils'

type Tab =
  | 'overview'
  | 'orders'
  | 'favorites'
  | 'rewards'
  | 'addresses'
  | 'boxes'
  | 'profile'
  | 'security'

const STATUS: Record<OrderStatus, { label: string; cls: string }> = {
  placed: { label: 'Placed', cls: 'bg-secondary text-foreground' },
  picking: { label: 'Picking', cls: 'bg-gold/15 text-gold' },
  packed: { label: 'Packed', cls: 'bg-gold/15 text-gold' },
  'out-for-delivery': { label: 'On the way', cls: 'bg-field/15 text-field' },
  delivered: { label: 'Delivered', cls: 'bg-leaf/15 text-leaf' },
  cancelled: { label: 'Cancelled', cls: 'bg-clay/10 text-clay' },
}

const SUB_STATUS: Record<SubscriptionStatus, string> = {
  active: 'bg-leaf/15 text-leaf',
  paused: 'bg-gold/15 text-gold',
  cancelled: 'bg-clay/10 text-clay',
}

export function AccountDashboard() {
  const { account, signOut, updateAccount, wishlist } = useSession()
  const { ordersForCustomer } = useDataStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<Tab>('overview')

  // Deep-link support: /account?tab=favorites focuses a tab directly (used by
  // the mobile tab bar, notifications and marketing links). "wishlist" is an
  // accepted alias for the Favorites tab.
  useEffect(() => {
    const raw = searchParams.get('tab')
    if (!raw) return
    const normalized = raw === 'wishlist' ? 'favorites' : raw
    const valid: Tab[] = [
      'overview',
      'orders',
      'favorites',
      'rewards',
      'addresses',
      'boxes',
      'profile',
      'security',
    ]
    if ((valid as string[]).includes(normalized)) setTab(normalized as Tab)
  }, [searchParams])

  const customer = account as CustomerAccount
  const myOrders = useMemo(
    () =>
      ordersForCustomer({
        phone: customer.phone,
        refs: customer.orderRefs,
      }).sort((a, b) => (a.placedAt < b.placedAt ? 1 : -1)),
    [customer.orderRefs, customer.phone, ordersForCustomer],
  )

  const tabs: { id: Tab; label: string; icon: typeof User; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'Orders', icon: Package, count: myOrders.length },
    { id: 'favorites', label: 'Favorites', icon: Heart, count: wishlist.length },
    { id: 'rewards', label: 'Rewards', icon: Award },
    { id: 'addresses', label: 'Addresses', icon: MapPin, count: customer.addresses.length },
    { id: 'boxes', label: 'My Boxes', icon: Repeat, count: customer.subscriptions.length },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  function handleSignOut() {
    signOut()
    router.push('/')
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      {/* Header */}
      <div className="ga-rise flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {customer.avatarImage ? (
            <span className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-gold/30">
              <SmartImage
                src={customer.avatarImage}
                alt={customer.name}
                fill
                className="h-full w-full"
              />
            </span>
          ) : (
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-cream"
              style={{ background: customer.avatarColor }}
            >
              {customer.name.charAt(0)}
            </span>
          )}
          <div>
            <h1 className="ga-display text-2xl font-semibold text-foreground">{customer.name}</h1>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-2 overflow-x-auto border-b border-border pb-px">
        {tabs.map((t) => {
          const active = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors',
                active
                  ? 'border-field text-field'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
              {t.count !== undefined && (
                <span className="rounded-full bg-secondary px-1.5 text-xs font-bold text-foreground">
                  {t.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-8">
        {tab === 'overview' && <Overview customer={customer} orders={myOrders} setTab={setTab} />}
        {tab === 'orders' && <Orders orders={myOrders} />}
        {tab === 'favorites' && <Favorites setTab={setTab} />}
        {tab === 'rewards' && <Rewards customer={customer} orders={myOrders} />}
        {tab === 'addresses' && (
          <Addresses customer={customer} updateAccount={updateAccount} />
        )}
        {tab === 'boxes' && <Boxes customer={customer} updateAccount={updateAccount} />}
        {tab === 'profile' && (
          <ProfileSettings customer={customer} updateAccount={updateAccount} />
        )}
        {tab === 'security' && <SecurityTab />}
      </div>
    </div>
  )
}

function ProfileSettings({
  customer,
  updateAccount,
}: {
  customer: CustomerAccount
  updateAccount: (patch: Partial<Account>) => void
}) {
  const [name, setName] = useState(customer.name)
  const [email, setEmail] = useState(customer.email ?? '')
  const [phone, setPhone] = useState(customer.phone ?? '')
  const [saved, setSaved] = useState(false)

  const dirty =
    name.trim() !== customer.name ||
    email.trim() !== (customer.email ?? '') ||
    phone.trim() !== (customer.phone ?? '')

  function setAvatar(dataUrl: string) {
    updateAccount({ avatarImage: dataUrl })
  }

  function save() {
    updateAccount({
      name: name.trim() || customer.name,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  return (
    <div className="ga-rise max-w-xl space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="ga-display text-lg font-semibold text-foreground">
          Profile photo
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a photo so the team recognises you on delivery.
        </p>
        <div className="mt-4">
          <AvatarUpload
            value={customer.avatarImage}
            onChange={setAvatar}
            fallback={customer.name.charAt(0)}
            alt={customer.name}
          />
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <h2 className="ga-display text-lg font-semibold text-foreground">
          Personal details
        </h2>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-foreground">
            Full name
          </span>
          <input
            className="ga-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-foreground">
            Email
          </span>
          <input
            type="email"
            className="ga-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-foreground">
            Mobile number
          </span>
          <input
            inputMode="tel"
            className="ga-input"
            placeholder="+233 24 555 0142"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
          />
        </label>

        <button
          type="button"
          onClick={save}
          disabled={!dirty}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-field text-base font-bold text-cream transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" /> Saved
            </>
          ) : (
            'Save changes'
          )}
        </button>
      </div>
    </div>
  )
}

function Overview({
  customer,
  orders,
  setTab,
}: {
  customer: CustomerAccount
  orders: Order[]
  setTab: (t: Tab) => void
}) {
  const stats = [
    { label: 'Loyalty points', value: customer.loyaltyPoints.toLocaleString(), icon: Star },
    { label: 'Orders placed', value: String(orders.length), icon: Package },
    {
      label: 'Active boxes',
      value: String(customer.subscriptions.filter((s) => s.status === 'active').length),
      icon: Repeat,
    },
  ]
  return (
    <div className="ga-rise space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
            <s.icon className="h-5 w-5 text-gold" />
            <p className="mt-3 ga-display text-3xl font-semibold text-foreground">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
      <BuyAgain orders={orders} />
      <div className="rounded-2xl border border-border bg-field p-6 text-cream">
        <p className="text-sm font-semibold uppercase tracking-wider text-gold">
          Freshness Promise
        </p>
        <p className="mt-2 max-w-lg text-pretty leading-relaxed">
          Not happy with a batch? Report it from any order and get an instant Mobile Money
          refund — no questions, no waiting.
        </p>
        <button
          onClick={() => setTab('orders')}
          className="mt-4 rounded-full bg-cream px-5 py-2 text-sm font-bold text-field transition-transform hover:-translate-y-0.5"
        >
          View orders
        </button>
      </div>
    </div>
  )
}

function Orders({ orders }: { orders: Order[] }) {
  const { add } = useCart()
  const { products: catalog } = useDataStore()
  const [reordered, setReordered] = useState<string | null>(null)

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No orders yet"
        body="When you place your first order, it'll show up here for easy tracking and reordering."
        cta={{ label: 'Start shopping', href: '/shop' }}
      />
    )
  }

  function reorder(ref: string, productIds: string[]) {
    productIds.forEach((id) => {
      const p = catalog.find((c) => c.id === id)
      if (p) add(p, 1)
    })
    setReordered(ref)
    setTimeout(() => setReordered((r) => (r === ref ? null : r)), 1800)
  }

  return (
    <div className="ga-rise space-y-4">
      {orders.map((o) => (
        <div key={o.id} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-bold text-foreground">{o.reference}</p>
              <p className="text-sm text-muted-foreground">{shortDate(o.placedAt)}</p>
            </div>
            <span
              className={cn(
                'rounded-full px-3 py-1 text-xs font-bold',
                STATUS[o.status].cls,
              )}
            >
              {STATUS[o.status].label}
            </span>
          </div>
          <ul className="mt-4 space-y-1.5 text-sm text-foreground">
            {o.items.map((it) => (
              <li key={it.productId} className="flex justify-between">
                <span>
                  {it.qty} × {it.name}
                </span>
                <span className="text-muted-foreground">
                  {cedis(it.priceFinal ?? it.priceEstimate)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <span className="text-sm text-muted-foreground">
              Total <span className="font-bold text-foreground">{cedis(o.total)}</span>
            </span>
            <div className="flex items-center gap-2">
              {o.status !== 'cancelled' && (
                <Link
                  href={`/orders/${o.reference}`}
                  className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-bold text-foreground transition-colors hover:bg-secondary"
                >
                  <MapPinned className="h-4 w-4 text-field" />
                  {o.status === 'delivered' ? 'View' : 'Track'}
                </Link>
              )}
              <button
                onClick={() => reorder(o.reference, o.items.map((i) => i.productId))}
                className="flex items-center gap-1.5 rounded-full bg-field px-4 py-2 text-sm font-bold text-cream transition-transform hover:-translate-y-0.5"
              >
                {reordered === o.reference ? (
                  <>
                    <Check className="h-4 w-4" /> Added
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-4 w-4" /> Reorder
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function Addresses({
  customer,
  updateAccount,
}: {
  customer: CustomerAccount
  updateAccount: (patch: Partial<CustomerAccount>) => void
}) {
  const [editing, setEditing] = useState<SavedAddress | 'new' | null>(null)

  function save(addr: SavedAddress) {
    const exists = customer.addresses.some((a) => a.id === addr.id)
    let next = exists
      ? customer.addresses.map((a) => (a.id === addr.id ? addr : a))
      : [...customer.addresses, addr]
    if (addr.isDefault) next = next.map((a) => ({ ...a, isDefault: a.id === addr.id }))
    updateAccount({ addresses: next })
    setEditing(null)
  }
  function remove(id: string) {
    updateAccount({ addresses: customer.addresses.filter((a) => a.id !== id) })
  }

  return (
    <div className="ga-rise space-y-4">
      {customer.addresses.length === 0 && !editing && (
        <EmptyState
          icon={MapPin}
          title="No saved addresses"
          body="Save a GhanaPostGPS address to check out faster next time."
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {customer.addresses.map((a) => (
          <div key={a.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">{a.label}</span>
                {a.isDefault && (
                  <span className="rounded-full bg-leaf/15 px-2 py-0.5 text-xs font-bold text-leaf-ink">
                    Default
                  </span>
                )}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditing(a)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  aria-label="Edit address"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(a.id)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-clay/10 hover:text-clay"
                  aria-label="Delete address"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm text-foreground">{a.recipient}</p>
            <p className="text-sm text-muted-foreground">{a.phone}</p>
            <p className="mt-1 text-sm font-semibold text-field">{a.ghanaPostGPS}</p>
            <p className="text-sm text-muted-foreground">
              {a.area}, {a.region}
            </p>
          </div>
        ))}
      </div>

      {editing ? (
        <AddressForm
          initial={editing === 'new' ? null : editing}
          onCancel={() => setEditing(null)}
          onSave={save}
        />
      ) : (
        <button
          onClick={() => setEditing('new')}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border text-sm font-semibold text-field transition-colors hover:bg-secondary"
        >
          <Plus className="h-4 w-4" /> Add address
        </button>
      )}
    </div>
  )
}

function AddressForm({
  initial,
  onCancel,
  onSave,
}: {
  initial: SavedAddress | null
  onCancel: () => void
  onSave: (a: SavedAddress) => void
}) {
  const [form, setForm] = useState<SavedAddress>(
    initial ?? {
      id: `addr-${Date.now()}`,
      label: '',
      recipient: '',
      phone: '',
      ghanaPostGPS: '',
      area: '',
      region: 'Greater Accra',
      isDefault: false,
    },
  )
  const set = (k: keyof SavedAddress, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <input className="ga-input" placeholder="Label (Home, Office)" value={form.label} onChange={(e) => set('label', e.target.value)} />
        <input className="ga-input" placeholder="Recipient name" value={form.recipient} onChange={(e) => set('recipient', e.target.value)} />
        <input className="ga-input" placeholder="Phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
        <input className="ga-input" placeholder="GhanaPostGPS (GA-183-4250)" value={form.ghanaPostGPS} onChange={(e) => set('ghanaPostGPS', e.target.value)} />
        <input className="ga-input sm:col-span-2" placeholder="Area / neighbourhood" value={form.area} onChange={(e) => set('area', e.target.value)} />
      </div>
      <label className="mt-3 flex items-center gap-2 text-sm font-medium text-foreground">
        <input type="checkbox" checked={form.isDefault} onChange={(e) => set('isDefault', e.target.checked)} className="h-4 w-4 accent-[var(--ga-field)]" />
        Set as default address
      </label>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onSave(form)}
          disabled={!form.label || !form.ghanaPostGPS}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-field text-sm font-bold text-cream disabled:opacity-60"
        >
          <Check className="h-4 w-4" /> Save address
        </button>
        <button onClick={onCancel} className="flex h-11 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold text-foreground hover:bg-secondary">
          <X className="h-4 w-4" /> Cancel
        </button>
      </div>
    </div>
  )
}

function Boxes({
  customer,
  updateAccount,
}: {
  customer: CustomerAccount
  updateAccount: (patch: Partial<CustomerAccount>) => void
}) {
  function setStatus(id: string, status: SubscriptionStatus) {
    updateAccount({
      subscriptions: customer.subscriptions.map((s) =>
        s.id === id ? { ...s, status } : s,
      ),
    })
  }

  if (customer.subscriptions.length === 0) {
    return (
      <EmptyState
        icon={Repeat}
        title="No produce boxes yet"
        body="Subscribe to a weekly or biweekly box and never run out of fresh staples."
        cta={{ label: 'Browse boxes', href: '/shop' }}
      />
    )
  }

  return (
    <div className="ga-rise grid gap-4 sm:grid-cols-2">
      {customer.subscriptions.map((s) => (
        <div key={s.id} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="font-bold text-foreground">{s.bundleName}</p>
            <span className={cn('rounded-full px-3 py-1 text-xs font-bold capitalize', SUB_STATUS[s.status])}>
              {s.status}
            </span>
          </div>
          <p className="mt-1 text-sm capitalize text-muted-foreground">
            {s.frequency} · {cedis(s.price)} / delivery
          </p>
          {s.status !== 'cancelled' && (
            <p className="mt-2 text-sm text-foreground">
              Next delivery <span className="font-semibold">{shortDate(s.nextDelivery)}</span>
            </p>
          )}
          <div className="mt-4 flex gap-2">
            {s.status === 'active' && (
              <button onClick={() => setStatus(s.id, 'paused')} className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border py-2 text-sm font-semibold text-foreground hover:bg-secondary">
                <Pause className="h-4 w-4" /> Pause
              </button>
            )}
            {s.status === 'paused' && (
              <button onClick={() => setStatus(s.id, 'active')} className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-field py-2 text-sm font-bold text-cream">
                <Play className="h-4 w-4" /> Resume
              </button>
            )}
            {s.status !== 'cancelled' && (
              <button onClick={() => setStatus(s.id, 'cancelled')} className="flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-clay hover:bg-clay/10">
                Cancel
              </button>
            )}
            {s.status === 'cancelled' && (
              <button onClick={() => setStatus(s.id, 'active')} className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-field py-2 text-sm font-bold text-cream">
                <RotateCcw className="h-4 w-4" /> Reactivate
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({
  icon: Icon,
  title,
  body,
  cta,
}: {
  icon: typeof Package
  title: string
  body: string
  cta?: { label: string; href: string }
}) {
  return (
    <div className="ga-rise flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-field">
        <Icon className="h-7 w-7" />
      </span>
      <h3 className="ga-display mt-4 text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">{body}</p>
      {cta && (
        <a
          href={cta.href}
          className="mt-5 rounded-full bg-field px-6 py-2.5 text-sm font-bold text-cream transition-transform hover:-translate-y-0.5"
        >
          {cta.label}
        </a>
      )}
    </div>
  )
}

// ---- Buy again: most-recently purchased items, one-tap re-add ----
function BuyAgain({ orders }: { orders: Order[] }) {
  const { add } = useCart()
  const { products: catalog } = useDataStore()
  const [added, setAdded] = useState<string | null>(null)

  // Dedupe productIds across orders, newest first.
  const ids: string[] = []
  for (const o of orders) {
    for (const it of o.items) {
      if (!ids.includes(it.productId)) ids.push(it.productId)
    }
  }
  const items = ids
    .map((id) => catalog.find((c) => c.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p) && p!.reviewStatus === 'live')
    .slice(0, 8)

  if (items.length === 0) return null

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="ga-display text-lg font-semibold text-foreground">Buy again</h2>
        <Link href="/shop" className="text-sm font-semibold text-field hover:underline">
          Browse all
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {items.map((p) => {
          const just = added === p.id
          return (
            <div
              key={p.id}
              className="flex w-36 shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-background"
            >
              <Link href={`/shop/${p.slug}`} className="relative block aspect-square">
                <SmartImage src={p.image} alt={p.name} fill className="object-cover" />
              </Link>
              <div className="flex flex-1 flex-col p-2.5">
                <p className="line-clamp-1 text-sm font-semibold text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">{formatGHS(productEstimate(p))}</p>
                <button
                  onClick={() => {
                    add(p, 1)
                    setAdded(p.id)
                    setTimeout(() => setAdded((a) => (a === p.id ? null : a)), 1200)
                  }}
                  className="mt-2 flex items-center justify-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-foreground transition-colors hover:bg-field hover:text-cream"
                >
                  {just ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  {just ? 'Added' : 'Add'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---- Favorites tab: saved produce with quick add + remove ----
function Favorites({ setTab }: { setTab: (t: Tab) => void }) {
  const { wishlist, toggleWishlist } = useSession()
  const { products: catalog } = useDataStore()
  const { add } = useCart()
  const [added, setAdded] = useState<string | null>(null)

  const items = wishlist
    .map((id) => catalog.find((c) => c.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="No favorites yet"
        body="Tap the heart on any produce to save it here for quick reordering."
        cta={{ label: 'Browse produce', href: '/shop' }}
      />
    )
  }

  return (
    <div className="ga-rise grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((p) => {
        const just = added === p.id
        return (
          <div
            key={p.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
          >
            <Link href={`/shop/${p.slug}`} className="relative block aspect-square">
              <SmartImage src={p.image} alt={p.name} fill className="object-cover" />
            </Link>
            <div className="flex flex-1 flex-col p-3">
              <Link href={`/shop/${p.slug}`}>
                <p className="line-clamp-1 font-semibold text-foreground">{p.name}</p>
              </Link>
              <p className="text-sm text-muted-foreground">{formatGHS(productEstimate(p))}</p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => {
                    add(p, 1)
                    setAdded(p.id)
                    setTimeout(() => setAdded((a) => (a === p.id ? null : a)), 1200)
                  }}
                  className="flex flex-1 items-center justify-center gap-1 rounded-full bg-field px-3 py-2 text-sm font-bold text-cream transition-transform hover:-translate-y-0.5"
                >
                  {just ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {just ? 'Added' : 'Add'}
                </button>
                <button
                  onClick={() => toggleWishlist(p.id)}
                  aria-label={`Remove ${p.name} from favorites`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-[var(--ga-terracotta)] transition-colors hover:bg-secondary"
                >
                  <Heart className="h-4 w-4" style={{ fill: 'currentColor' }} />
                </button>
              </div>
            </div>
          </div>
        )
      })}
      <button
        onClick={() => setTab('orders')}
        className="hidden"
        aria-hidden
      />
    </div>
  )
}

// ---- Rewards tab: loyalty tier progress + how points work ----
function Rewards({ customer, orders }: { customer: CustomerAccount; orders: Order[] }) {
  const points = customer.loyaltyPoints
  const tier = tierFor(points)
  const next = nextTier(points)
  const progress = tierProgress(points)
  const delivered = orders.filter((o) => o.status === 'delivered').length
  const pointsPerCedi = Math.round(1 / POINT_VALUE_GHS)

  return (
    <div className="ga-rise space-y-6">
      {/* Tier card */}
      <div
        className="overflow-hidden rounded-2xl p-6 text-cream"
        style={{ background: tier.color }}
      >
        <p className="text-sm font-semibold uppercase tracking-wider opacity-80">
          AgriVil Rewards
        </p>
        <div className="mt-1 flex items-baseline gap-2">
          <Award className="h-6 w-6" />
          <h2 className="ga-display text-3xl font-semibold">{tier.label} member</h2>
        </div>
        <p className="mt-2 ga-display text-4xl font-bold">{points.toLocaleString()} pts</p>

        {next ? (
          <div className="mt-5">
            <div className="flex justify-between text-sm opacity-90">
              <span>{tier.label}</span>
              <span>{next.label} at {next.threshold.toLocaleString()} pts</span>
            </div>
            <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-cream/25">
              <div
                className="h-full rounded-full bg-cream"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <p className="mt-2 text-sm opacity-90">
              {(next.threshold - points).toLocaleString()} points to {next.label}
            </p>
          </div>
        ) : (
          <p className="mt-4 text-sm opacity-90">
            You&apos;ve reached the top tier — enjoy the best of AgriVil.
          </p>
        )}
      </div>

      {/* Perks + how it works */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="ga-display text-lg font-semibold text-foreground">Your perks</h3>
          <ul className="mt-3 space-y-2 text-sm text-foreground">
            {tier.perks.map((perk) => (
              <li key={perk} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf" />
                {perk}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="ga-display text-lg font-semibold text-foreground">How points work</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Star className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              Earn {tier.earnMultiplier.toFixed(2)}× points on every cedi spent ({delivered} orders delivered so far).
            </li>
            <li className="flex items-start gap-2">
              <Star className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              Redeem points at checkout — {pointsPerCedi} points = GH₵1 off your basket.
            </li>
            <li className="flex items-start gap-2">
              <Star className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              Points never expire while your account stays active.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
