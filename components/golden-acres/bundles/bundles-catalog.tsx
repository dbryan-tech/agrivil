'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { Reveal } from '@/components/golden-acres/reveal'
import { useCart } from '@/components/golden-acres/cart-context'
import { useSession } from '@/components/golden-acres/auth/session-context'
import { bundles, products } from '@/lib/golden-acres/data'
import { formatGHS } from '@/lib/golden-acres/format'
import type { Bundle, SubscriptionBox, CustomerAccount } from '@/lib/golden-acres/types'
import { Repeat, Check, ShoppingBasket, CalendarClock, Sparkles, Loader2 } from 'lucide-react'

const FREQ_LABEL: Record<string, string> = {
  'one-time': 'One-time',
  weekly: 'Weekly',
  biweekly: 'Every 2 weeks',
  monthly: 'Monthly',
}

export function BundlesCatalog() {
  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <section className="border-b border-black/[0.04] bg-[#EDE8DF]/40">
        <div className="mx-auto max-w-7xl px-2 py-6 sm:px-3 lg:px-4">
          <p className="text-xs font-black uppercase tracking-wider text-[#7A3F1C]">Curated boxes</p>
          <h1 className="ga-headline mt-2 text-balance text-3xl font-black text-[#211A12] sm:text-4xl">
            Bundles &amp; <em className="text-[#0B3B25]">subscriptions</em>
          </h1>
          <p className="mt-2 max-w-2xl text-pretty text-sm sm:text-base leading-relaxed text-[#5C5247]">
            Hand-packed boxes from our farmers, delivered once or on repeat. Subscribe and your box
            arrives fresh each cycle — pause or cancel anytime.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-2 py-5 sm:px-3 lg:px-4">
        <div className="grid gap-6 lg:grid-cols-2">
          {bundles.map((bundle, i) => (
            <Reveal key={bundle.id} delay={i * 60} as="article">
              <BundleCard bundle={bundle} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}

function BundleCard({ bundle }: { bundle: Bundle }) {
  const router = useRouter()
  const { add } = useCart()
  const { session, role, updateAccount } = useSession()
  const [added, setAdded] = useState(false)
  const [subscribing, setSubscribing] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const lineItems = bundle.items
    .map((it) => {
      const p = products.find((pr) => pr.id === it.productId)
      return p ? { name: p.name, qty: it.qty } : null
    })
    .filter((x): x is { name: string; qty: number } => x !== null)

  function addBox() {
    bundle.items.forEach((it) => {
      const p = products.find((pr) => pr.id === it.productId)
      if (p) add(p, it.qty)
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  function subscribe() {
    if (!session || role !== 'customer') {
      router.push(`/login?next=/bundles`)
      return
    }
    setSubscribing(true)
    const customer = session.account as CustomerAccount
    const next = new Date()
    next.setDate(next.getDate() + 3)
    const sub: SubscriptionBox = {
      id: `sub-${bundle.id}-${Date.now()}`,
      bundleId: bundle.id,
      bundleName: bundle.name,
      frequency: bundle.frequency,
      price: bundle.price,
      nextDelivery: next.toISOString(),
      status: 'active',
    }
    setTimeout(() => {
      updateAccount({ subscriptions: [...customer.subscriptions, sub] })
      setSubscribing(false)
      setSubscribed(true)
    }, 700)
  }

  const isSub = bundle.frequency !== 'one-time'

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[24px] border border-black/[0.04] bg-[#FDFDFB] shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
      <div id={bundle.slug} className="relative aspect-[16/9] overflow-hidden">
        <SmartImage src={bundle.image} alt={bundle.name} className="h-full w-full object-cover" />
        <div className="absolute left-4 top-4 flex gap-2">
          {bundle.popular && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#F0A81E] px-3 py-1 text-xs font-black text-[#211A12] shadow-xs">
              <Sparkles className="size-3" /> Popular
            </span>
          )}
          {isSub && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#0B3B25] px-3 py-1 text-xs font-black capitalize text-white shadow-xs">
              <Repeat className="size-3 stroke-[2.5]" /> {FREQ_LABEL[bundle.frequency]}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h2 className="ga-headline text-2xl font-black text-[#211A12]">{bundle.name}</h2>
          <span className="shrink-0 rounded-full bg-[#EDE8DF] px-3 py-1 text-xs font-extrabold text-[#211A12]">
            {bundle.serves}
          </span>
        </div>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-[#5C5247]">
          {bundle.description}
        </p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {lineItems.map((it) => (
            <li
              key={it.name}
              className="rounded-lg bg-[#EDE8DF] px-2.5 py-1 text-xs font-bold text-[#211A12]"
            >
              {it.qty}× {it.name}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-end justify-between pt-6">
          <div>
            <span className="ga-headline text-3xl font-black text-[#211A12]">
              {formatGHS(bundle.price)}
            </span>
            {isSub && <span className="text-xs font-medium text-[#5C5247]"> / delivery</span>}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={addBox}
            className="ga-press flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-black/[0.08] bg-white font-extrabold text-[#211A12] hover:bg-[#F7F5F0] shadow-xs"
          >
            {added ? (
              <>
                <Check className="size-4" /> Added
              </>
            ) : (
              <>
                <ShoppingBasket className="size-4" /> Add box
              </>
            )}
          </button>
          {isSub && (
            <button
              type="button"
              onClick={subscribe}
              disabled={subscribing || subscribed}
              className="ga-press flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#0B3B25] font-extrabold text-white hover:bg-[#072618] shadow-sm disabled:opacity-70"
            >
              {subscribing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : subscribed ? (
                <>
                  <Check className="size-4" /> Subscribed
                </>
              ) : (
                <>
                  <CalendarClock className="size-4" /> Subscribe
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
