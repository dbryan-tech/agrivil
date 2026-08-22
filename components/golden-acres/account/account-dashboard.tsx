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
import { UnderlineField } from '@/components/golden-acres/system'
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

const STATUS: Record<OrderStatus, { label: string; tone: string }> = {
  placed: { label: 'Placed', tone: 'text-[#8A7E72]' },
  picking: { label: 'Picking', tone: 'text-[#7A3F1C]' },
  packed: { label: 'Packed', tone: 'text-[#7A3F1C]' },
  'out-for-delivery': { label: 'On the way', tone: 'text-[#0B3B25] font-semibold' },
  delivered: { label: 'Delivered', tone: 'text-[#0F7A43] font-semibold' },
  cancelled: { label: 'Cancelled', tone: 'text-[#B91C1C]' },
}

const SUB_TONE: Record<SubscriptionStatus, string> = {
  active: 'text-[#0F7A43] font-semibold',
  paused: 'text-[#7A3F1C]',
  cancelled: 'text-[#B91C1C]',
}

/**
 * Account dashboard (redesigned, docs/redesign/02 §7).
 * Two-pane layout: quiet side nav on canvas (no tab boxes) + content pane.
 * Every server action and context contract preserved verbatim — this is a
 * skin-only rebuild.
 */
export function AccountDashboard() {
  const { account, signOut, updateAccount, wishlist } = useSession()
  const { ordersForCustomer } = useDataStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<Tab>('overview')

  // Deep-link support: /account?tab=favorites focuses a tab directly. The
  // mobile tab bar, notifications and marketing links rely on this.
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

  const nav: { id: Tab; label: string; icon: typeof User; count?: number }[] = [
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
    <main className="min-h-screen bg-[#F7F5F0] pb-20 pt-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Identity header */}
        <header className="ga-rise flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <div className="flex items-center gap-4">
            {customer.avatarImage ? (
              <span className="relative h-14 w-14 overflow-hidden rounded-full ring-1 ring-[rgba(33,26,18,0.08)]">
                <SmartImage
                  src={customer.avatarImage}
                  alt={customer.name}
                  fill
                  className="h-full w-full"
                />
              </span>
            ) : (
              <span
                className="flex h-14 w-14 items-center justify-center rounded-full text-xl font-semibold text-white"
                style={{ background: customer.avatarColor }}
              >
                {customer.name.charAt(0)}
              </span>
            )}
            <div>
              <p className="text-[13px] font-medium text-[#8A7E72]">My account</p>
              <h1 className="ga-display-title mt-0.5 text-[clamp(24px,2.6vw,34px)] text-[#211A12]">
                {customer.name}
              </h1>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-[rgba(33,26,18,0.15)] px-4 text-[13px] font-medium text-[#211A12] transition-colors duration-300 hover:border-[rgba(185,28,28,0.4)] hover:text-[#B91C1C]"
          >
            <LogOut width={15} height={15} />
            Sign out
          </button>
        </header>

        {/* Two-pane body */}
        <div className="mt-10 grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          {/* Side nav — quiet list, no tab boxes */}
          <nav aria-label="Account sections" className="lg:sticky lg:top-28 lg:self-start">
            <ul className="flex gap-x-5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:flex-col lg:gap-y-0.5 lg:overflow-visible lg:pb-0">
              {nav.map((item) => {
                const active = tab === item.id
                const Icon = item.icon
                return (
                  <li key={item.id} className="shrink-0">
                    <button
                      onClick={() => setTab(item.id)}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'group flex w-full items-center gap-2.5 border-b py-2.5 text-left text-[13.5px] transition-colors duration-300 lg:border-b lg:py-2.5',
                        active
                          ? 'border-[#211A12] font-semibold text-[#211A12]'
                          : 'border-transparent font-medium text-[#8A7E72] hover:text-[#3D332A]',
                      )}
                    >
                      <Icon width={15} height={15} className={active ? '' : 'opacity-70'} />
                      <span className="whitespace-nowrap">{item.label}</span>
                      {item.count !== undefined && item.count > 0 && (
                        <span className="ga-index ml-auto hidden text-[11.5px] text-[#8A7E72] sm:inline">
                          {item.count}
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Content pane */}
          <div className="min-w-0">
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
      </div>
    </main>
  )
}

/* ------------------------------ Profile ---------------------------------- */

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
    <section className="ga-rise max-w-xl space-y-10" aria-label="Profile settings">
      <div>
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#8A7E72]">
          Profile photo
        </h2>
        <p className="mt-2 text-[13.5px] text-[#5C5247]">
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

      <div className="space-y-6 border-t border-[rgba(33,26,18,0.08)] pt-8">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#8A7E72]">
          Personal details
        </h2>
        <UnderlineField
          id="pf-name"
          label="Full name"
          value={name}
          onChange={setName}
          autoComplete="name"
        />
        <UnderlineField
          id="pf-email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />
        <UnderlineField
          id="pf-phone"
          label="Mobile number"
          value={phone}
          onChange={setPhone}
          placeholder="+233 24 555 0142"
          inputMode="tel"
          autoComplete="tel"
        />

        <button
          type="button"
          onClick={save}
          disabled={!dirty}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0B3B25] px-8 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-[#0F4A2E] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
        >
          {saved ? (
            <>
              <Check width={16} height={16} /> Saved
            </>
          ) : (
            'Save changes'
          )}
        </button>
      </div>
    </section>
  )
}

/* ------------------------------ Overview ---------------------------------- */

function Overview({
  customer,
  orders,
  setTab,
}: {
  customer: CustomerAccount
  orders: Order[]
  setTab: (t: Tab) => void
}) {
  const nextBox = customer.subscriptions.find(
    (s) => s.status === 'active' && s.nextDelivery,
  )
  const lastOrder = orders[0]
  const stats = [
    { label: 'Loyalty points', value: customer.loyaltyPoints.toLocaleString(), tab: 'rewards' as Tab },
    { label: 'Orders placed', value: String(orders.length), tab: 'orders' as Tab },
    {
      label: 'Active boxes',
      value: String(customer.subscriptions.filter((s) => s.status === 'active').length),
      tab: 'boxes' as Tab,
    },
  ]
  return (
    <div className="ga-rise space-y-12">
      {/* Greeting + next delivery moment */}
      <section aria-label="Summary">
        <h2 className="ga-display-title text-[clamp(22px,2.4vw,30px)] text-[#211A12]">
          {greeting()}, {customer.name.split(' ')[0]}.
        </h2>
        <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-[#5C5247]">
          {nextBox ? (
            <>
              Your{' '}
              <button
                onClick={() => setTab('boxes')}
                className="font-semibold text-[#0B3B25] underline decoration-[rgba(11,59,37,0.35)] underline-offset-4 hover:decoration-[#0B3B25]"
              >
                {nextBox.bundleName}
              </button>{' '}
              arrives {shortDate(nextBox.nextDelivery)}.
            </>
          ) : lastOrder ? (
            <>
              Last order {lastOrder.reference} ·{' '}
              {STATUS[lastOrder.status].label.toLowerCase()}.
            </>
          ) : (
            'Your first fresh basket is one shop away.'
          )}
        </p>
      </section>

      {/* Stats over hairlines */}
      <dl className="grid grid-cols-3 gap-6 border-t border-[rgba(33,26,18,0.08)] pt-6">
        {stats.map((s) => (
          <div key={s.label}>
            <button onClick={() => setTab(s.tab)} className="block text-left transition-opacity hover:opacity-75">
              <dd className="ga-index text-[clamp(26px,3vw,40px)] font-semibold leading-none tracking-[-0.02em] text-[#211A12]">
                {s.value}
              </dd>
              <dt className="mt-2 text-[12.5px] font-medium text-[#8A7E72]">{s.label}</dt>
            </button>
          </div>
        ))}
      </dl>

      <BuyAgain orders={orders} />

      {/* Freshness promise — quiet band, not a card */}
      <section className="border-t border-[rgba(33,26,18,0.08)] pt-8" aria-label="Freshness promise">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#7A3F1C]">
          Freshness Promise
        </h2>
        <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-[#5C5247]">
          Not happy with a batch? Report it from any order and get an instant
          Mobile Money refund — no questions, no waiting.
        </p>
        <button
          onClick={() => setTab('orders')}
          className="mt-4 inline-flex h-10 items-center rounded-full bg-[#0B3B25] px-5 text-[13.5px] font-semibold text-white transition-all duration-300 hover:bg-[#0F4A2E]"
        >
          View orders
        </button>
      </section>
    </div>
  )
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

/* ------------------------------- Orders ----------------------------------- */

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
    <div className="ga-rise">
      <ul className="border-t border-[rgba(33,26,18,0.08)]">
        {orders.map((o) => (
          <li
            key={o.id}
            className="border-b border-[rgba(33,26,18,0.08)] py-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <Link
                  href={`/orders/${o.reference}`}
                  className="ga-index text-[15px] font-semibold text-[#211A12] transition-colors hover:text-[#7A3F1C]"
                >
                  #{o.reference}
                </Link>
                <span className={`text-[13px] ${STATUS[o.status].tone}`}>
                  {STATUS[o.status].label}
                </span>
                <span className="ga-index text-[12.5px] text-[#8A7E72]">
                  {shortDate(o.placedAt)}
                </span>
              </div>
              <span className="ga-index text-[15px] font-semibold text-[#211A12]">
                {cedis(o.total)}
              </span>
            </div>

            {/* Item summary line */}
            <p className="ga-index mt-1 truncate text-[12.5px] text-[#8A7E72]">
              {o.items.map((it) => `${it.qty}× ${it.name}`).join(' · ')}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {o.status === 'delivered' && !o.feedbackAt ? (
                <Link
                  href={`/orders/${o.reference}#feedback`}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[rgba(122,63,28,0.35)] px-4 text-[13px] font-medium text-[#7A3F1C] transition-colors duration-300 hover:bg-[#7A3F1C]/5"
                >
                  <Star width={13} height={13} />
                  Rate &amp; review
                </Link>
              ) : o.status !== 'cancelled' ? (
                <Link
                  href={`/orders/${o.reference}`}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[rgba(33,26,18,0.15)] px-4 text-[13px] font-medium text-[#211A12] transition-colors duration-300 hover:border-[rgba(11,59,37,0.45)] hover:text-[#0B3B25]"
                >
                  <MapPinned width={13} height={13} className="text-[#0B3B25]" />
                  {o.status === 'delivered' ? 'View' : 'Track'}
                </Link>
              ) : null}
              <button
                onClick={() => reorder(o.reference, o.items.map((i) => i.productId))}
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#0B3B25] px-4 text-[13px] font-medium text-white transition-all duration-300 hover:bg-[#0F4A2E]"
              >
                {reordered === o.reference ? (
                  <>
                    <Check width={13} height={13} /> Added
                  </>
                ) : (
                  <>
                    <RotateCcw width={13} height={13} /> Reorder
                  </>
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ----------------------------- Addresses ---------------------------------- */

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
    <div className="ga-rise space-y-6">
      {customer.addresses.length === 0 && !editing && (
        <EmptyState
          icon={MapPin}
          title="No saved addresses"
          body="Save a GhanaPostGPS address to check out faster next time."
        />
      )}

      <ul className="border-t border-[rgba(33,26,18,0.08)]">
        {customer.addresses.map((a) => (
          <li
            key={a.id}
            className="flex items-start justify-between gap-4 border-b border-[rgba(33,26,18,0.08)] py-5"
          >
            <div className="min-w-0">
              <div className="flex items-baseline gap-2.5">
                <span className="text-[15px] font-semibold text-[#211A12]">{a.label}</span>
                {a.isDefault && (
                  <span className="rounded-full bg-[rgba(15,122,67,0.08)] px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-[#0F7A43]">
                    Default
                  </span>
                )}
              </div>
              <p className="mt-1 text-[13.5px] text-[#3D332A]">
                {a.recipient} · {a.phone}
              </p>
              <p className="ga-index mt-0.5 text-[12.5px] text-[#8A7E72]">
                <span className="font-semibold text-[#0B3B25]">{a.ghanaPostGPS}</span> ·{' '}
                {a.area}, {a.region}
              </p>
            </div>
            <div className="flex shrink-0 gap-1 pt-1">
              <button
                onClick={() => setEditing(a)}
                className="rounded-lg p-2 text-[#8A7E72] transition-colors hover:bg-white hover:text-[#211A12]"
                aria-label={`Edit ${a.label} address`}
              >
                <Pencil width={15} height={15} />
              </button>
              <button
                onClick={() => remove(a.id)}
                className="rounded-lg p-2 text-[#8A7E72] transition-colors hover:bg-[#B91C1C]/5 hover:text-[#B91C1C]"
                aria-label={`Delete ${a.label} address`}
              >
                <Trash2 width={15} height={15} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editing ? (
        <AddressForm
          initial={editing === 'new' ? null : editing}
          onCancel={() => setEditing(null)}
          onSave={save}
        />
      ) : (
        <button
          onClick={() => setEditing('new')}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-dashed border-[rgba(33,26,18,0.25)] px-6 text-[13.5px] font-medium text-[#0B3B25] transition-colors duration-300 hover:border-[rgba(11,59,37,0.55)]"
        >
          <Plus width={15} height={15} /> Add address
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
  // ID is minted at first user interaction (save), not at mount, so the render
  // output never depends on wall-clock time (React purity / SSR safety).
  const [form, setForm] = useState<SavedAddress>(
    initial ?? {
      id: '',
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
    <div className="space-y-5 rounded-[20px] border border-[rgba(33,26,18,0.06)] bg-[#FDFDFB] p-6">
      <div className="grid gap-5 sm:grid-cols-2 sm:gap-x-6">
        <UnderlineField id="af-label" label="Label" value={form.label} onChange={(v) => set('label', v)} placeholder="Home, Office" />
        <UnderlineField id="af-recipient" label="Recipient name" value={form.recipient} onChange={(v) => set('recipient', v)} />
        <UnderlineField id="af-phone" label="Phone" value={form.phone} onChange={(v) => set('phone', v)} inputMode="tel" />
        <UnderlineField id="af-gps" label="GhanaPostGPS" value={form.ghanaPostGPS} onChange={(v) => set('ghanaPostGPS', v.toUpperCase())} placeholder="GA-183-4250" />
        <UnderlineField id="af-area" label="Area / neighbourhood" value={form.area} onChange={(v) => set('area', v)} className="sm:col-span-2" />
      </div>
      <label className="flex items-center gap-2 text-[13.5px] font-medium text-[#211A12]">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={(e) => set('isDefault', e.target.checked)}
          className="h-4 w-4 accent-[#0B3B25]"
        />
        Set as default address
      </label>
      <div className="flex gap-2">
        <button
          onClick={() => onSave({ ...form, id: form.id || `addr-${Date.now()}` })}
          disabled={!form.label || !form.ghanaPostGPS}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#0B3B25] px-6 text-[14px] font-semibold text-white transition-all duration-300 hover:bg-[#0F4A2E] disabled:pointer-events-none disabled:opacity-40"
        >
          <Check width={15} height={15} /> Save address
        </button>
        <button
          onClick={onCancel}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[rgba(33,26,18,0.15)] px-5 text-[14px] font-medium text-[#211A12] transition-colors duration-300 hover:border-[rgba(185,28,28,0.4)] hover:text-[#B91C1C]"
        >
          <X width={15} height={15} /> Cancel
        </button>
      </div>
    </div>
  )
}

/* ------------------------------- Boxes ------------------------------------ */

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
    <div className="ga-rise">
      <ul className="border-t border-[rgba(33,26,18,0.08)]">
        {customer.subscriptions.map((s) => (
          <li key={s.id} className="border-b border-[rgba(33,26,18,0.08)] py-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="text-[15px] font-semibold text-[#211A12]">
                {s.bundleName}
              </span>
              <span className={cn('text-[13px] capitalize', SUB_TONE[s.status])}>
                {s.status}
              </span>
            </div>
            <p className="ga-index mt-1 text-[12.5px] text-[#8A7E72]">
              {s.frequency} · {cedis(s.price)} / delivery
              {s.status !== 'cancelled' && ` · next ${shortDate(s.nextDelivery)}`}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {s.status === 'active' && (
                <button
                  onClick={() => setStatus(s.id, 'paused')}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-[rgba(33,26,18,0.15)] px-4 text-[13px] font-medium text-[#211A12] transition-colors duration-300 hover:border-[rgba(122,63,28,0.45)] hover:text-[#7A3F1C]"
                >
                  <Pause width={13} height={13} /> Pause
                </button>
              )}
              {s.status === 'paused' && (
                <button
                  onClick={() => setStatus(s.id, 'active')}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-[#0B3B25] px-4 text-[13px] font-medium text-white transition-all duration-300 hover:bg-[#0F4A2E]"
                >
                  <Play width={13} height={13} /> Resume
                </button>
              )}
              {s.status !== 'cancelled' && (
                <button
                  onClick={() => setStatus(s.id, 'cancelled')}
                  className="inline-flex h-9 items-center justify-center rounded-full px-4 text-[13px] font-medium text-[#B91C1C] transition-colors duration-300 hover:bg-[#B91C1C]/5"
                >
                  Cancel
                </button>
              )}
              {s.status === 'cancelled' && (
                <button
                  onClick={() => setStatus(s.id, 'active')}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-[#0B3B25] px-4 text-[13px] font-medium text-white transition-all duration-300 hover:bg-[#0F4A2E]"
                >
                  <RotateCcw width={13} height={13} /> Reactivate
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ----------------------------- EmptyState --------------------------------- */

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
    <div className="ga-rise flex flex-col items-center py-12 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(33,26,18,0.12)] text-[#5C5247]">
        <Icon width={22} height={22} />
      </span>
      <h3 className="ga-display-title mt-5 text-[20px] text-[#211A12]">{title}</h3>
      <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-[#5C5247]">{body}</p>
      {cta && (
        <Link
          href={cta.href}
          className="mt-6 inline-flex h-11 items-center rounded-full bg-[#0B3B25] px-6 text-[14px] font-semibold text-white transition-all duration-300 hover:bg-[#0F4A2E]"
        >
          {cta.label}
        </Link>
      )}
    </div>
  )
}

/* ------------------------------ BuyAgain ---------------------------------- */

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
    <section aria-label="Buy again" className="border-t border-[rgba(33,26,18,0.08)] pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#8A7E72]">
          Buy again
        </h2>
        <Link
          href="/shop"
          className="text-[13px] font-medium text-[#0B3B25] underline decoration-[rgba(11,59,37,0.35)] underline-offset-4 transition-colors hover:decoration-[#0B3B25]"
        >
          Browse all
        </Link>
      </div>
      <div className="mt-4 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {items.map((p) => {
          const just = added === p.id
          return (
            <div
              key={p.id}
              className="flex w-36 shrink-0 flex-col overflow-hidden rounded-[16px] border border-[rgba(33,26,18,0.05)] bg-[#FDFDFB]"
            >
              <Link href={`/shop/${p.slug}`} className="relative block aspect-square">
                <SmartImage src={p.image} alt={p.name} fill className="object-cover" />
              </Link>
              <div className="flex flex-1 flex-col p-2.5">
                <p className="line-clamp-1 text-[13px] font-semibold text-[#211A12]">{p.name}</p>
                <p className="ga-index text-[12px] text-[#8A7E72]">{formatGHS(productEstimate(p))}</p>
                <button
                  onClick={() => {
                    add(p, 1)
                    setAdded(p.id)
                    setTimeout(() => setAdded((a) => (a === p.id ? null : a)), 1200)
                  }}
                  className="mt-2 inline-flex items-center justify-center gap-1 rounded-full border border-[rgba(33,26,18,0.15)] px-3 py-1.5 text-[12px] font-medium text-[#211A12] transition-all duration-300 hover:border-[rgba(11,59,37,0.45)] hover:text-[#0B3B25]"
                >
                  {just ? <Check width={12} height={12} /> : <Plus width={12} height={12} />}
                  {just ? 'Added' : 'Add'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ------------------------------ Favorites ---------------------------------- */

function Favorites({ setTab }: { setTab: (t: Tab) => void }) {
  void setTab
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
    <div className="ga-rise grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
      {items.map((p) => {
        const just = added === p.id
        return (
          <div key={p.id} className="flex flex-col">
            <Link
              href={`/shop/${p.slug}`}
              className="relative block aspect-square overflow-hidden rounded-[16px] border border-[rgba(33,26,18,0.05)] bg-white"
            >
              <SmartImage src={p.image} alt={p.name} fill className="object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03]" />
            </Link>
            <div className="mt-2.5 flex flex-col">
              <Link
                href={`/shop/${p.slug}`}
                className="line-clamp-1 text-[14px] font-semibold tracking-[-0.01em] text-[#211A12] transition-colors hover:text-[#7A3F1C]"
              >
                {p.name}
              </Link>
              <p className="ga-index mt-0.5 text-[13px] text-[#8A7E72]">
                {formatGHS(productEstimate(p))}
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  onClick={() => {
                    add(p, 1)
                    setAdded(p.id)
                    setTimeout(() => setAdded((a) => (a === p.id ? null : a)), 1200)
                  }}
                  className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-full bg-[#0B3B25] text-[12.5px] font-medium text-white transition-all duration-300 hover:bg-[#0F4A2E]"
                >
                  {just ? <Check width={13} height={13} /> : <Plus width={13} height={13} />}
                  {just ? 'Added' : 'Add'}
                </button>
                <button
                  onClick={() => toggleWishlist(p.id)}
                  aria-label={`Remove ${p.name} from favorites`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[rgba(33,26,18,0.15)] text-[#B91C1C] transition-colors duration-300 hover:bg-[#B91C1C]/5"
                >
                  <Heart width={14} height={14} style={{ fill: 'currentColor' }} />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------- Rewards ----------------------------------- */

function Rewards({ customer, orders }: { customer: CustomerAccount; orders: Order[] }) {
  const points = customer.loyaltyPoints
  const tier = tierFor(points)
  const next = nextTier(points)
  const progress = tierProgress(points)
  const delivered = orders.filter((o) => o.status === 'delivered').length
  const pointsPerCedi = Math.round(1 / POINT_VALUE_GHS)

  return (
    <div className="ga-rise space-y-10">
      {/* Tier band — full-width quiet band in the tier color */}
      <section
        aria-label={`${tier.label} tier`}
        className="overflow-hidden rounded-[24px] p-7 text-white sm:p-9"
        style={{ background: tier.color.startsWith('var') ? undefined : tier.color, backgroundColor: tier.color.startsWith('var') ? '#0B3B25' : tier.color }}
      >
        <p className="text-[13px] font-semibold text-white/70">AgriVil Rewards</p>
        <h2 className="ga-display-title mt-1.5 text-[clamp(24px,2.8vw,36px)]">
          {tier.label} member
        </h2>
        <p className="ga-index mt-2 text-[clamp(30px,3.6vw,44px)] font-semibold leading-none tracking-[-0.02em]">
          {points.toLocaleString()} pts
        </p>

        {next ? (
          <div className="mt-6 max-w-md">
            <div className="flex justify-between text-[12.5px] font-medium text-white/80">
              <span>{tier.label}</span>
              <span>
                {next.label} at {next.threshold.toLocaleString()} pts
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/25">
              <div
                className="h-full rounded-full bg-white transition-[width] duration-700"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <p className="mt-2 text-[12.5px] text-white/80">
              {(next.threshold - points).toLocaleString()} points to {next.label}
            </p>
          </div>
        ) : (
          <p className="mt-4 text-[13.5px] text-white/85">
            You&apos;ve reached the top tier — enjoy the best of AgriVil.
          </p>
        )}
      </section>

      {/* Perks + mechanics as hairline lists */}
      <div className="grid gap-10 sm:grid-cols-2 sm:gap-x-12">
        <div className="border-t border-[rgba(33,26,18,0.08)] pt-5">
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#8A7E72]">
            Your perks
          </h3>
          <ul className="mt-4 space-y-3">
            {tier.perks.map((perk) => (
              <li key={perk} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-[#211A12]">
                <Check width={15} height={15} className="mt-1 shrink-0 text-[#0F7A43]" />
                {perk}
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t border-[rgba(33,26,18,0.08)] pt-5">
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#8A7E72]">
            How points work
          </h3>
          <ul className="mt-4 space-y-3">
            <li className="flex items-start gap-2.5 text-[14px] leading-relaxed text-[#5C5247]">
              <Star width={14} height={14} className="mt-1 shrink-0 fill-[#F0A81E] text-[#F0A81E]" />
              Earn {tier.earnMultiplier.toFixed(2)}× points on every cedi spent ({delivered}{' '}
              {delivered === 1 ? 'order' : 'orders'} delivered so far).
            </li>
            <li className="flex items-start gap-2.5 text-[14px] leading-relaxed text-[#5C5247]">
              <Star width={14} height={14} className="mt-1 shrink-0 fill-[#F0A81E] text-[#F0A81E]" />
              Redeem points at checkout — {pointsPerCedi} points = GH₵1 off your basket.
            </li>
            <li className="flex items-start gap-2.5 text-[14px] leading-relaxed text-[#5C5247]">
              <Star width={14} height={14} className="mt-1 shrink-0 fill-[#F0A81E] text-[#F0A81E]" />
              Points never expire while your account stays active.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
