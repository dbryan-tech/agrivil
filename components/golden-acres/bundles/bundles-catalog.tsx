'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { useCart } from '@/components/golden-acres/cart-context'
import { useSession } from '@/components/golden-acres/auth/session-context'
import { bundles, products } from '@/lib/golden-acres/data'
import { formatGHS } from '@/lib/golden-acres/format'
import { Price } from '@/components/golden-acres/system'
import type { Bundle, SubscriptionBox, CustomerAccount } from '@/lib/golden-acres/types'
import { Check, ShoppingBasket, CalendarClock, Loader2, ArrowRight } from 'lucide-react'

const FREQ_LABEL: Record<string, string> = {
  'one-time': 'One-time',
  weekly: 'Weekly',
  biweekly: 'Every 2 weeks',
  monthly: 'Monthly',
}

export function BundlesCatalog() {
  return (
    <main className="min-h-screen bg-[#F7F5F0] pb-20 pt-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <header className="max-w-2xl">
          <p className="text-[13px] font-semibold text-[#7A3F1C]">Curated boxes</p>
          <h1 className="ga-display-title mt-2 text-[clamp(30px,3.6vw,48px)] text-[#211A12]">
            Bundles &amp; subscriptions.
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[#5C5247]">
            Hand-packed boxes from our farmers, delivered once or on repeat.
            Subscribe and your box arrives fresh each cycle — skip, pause, or
            cancel anytime from your account.
          </p>
        </header>

        <div className="mt-12 space-y-16">
          {bundles.map((bundle) => (
            <BundleRow key={bundle.id} bundle={bundle} />
          ))}
        </div>
      </div>
    </main>
  )
}

function BundleRow({ bundle }: { bundle: Bundle }) {
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
  const popular = bundle.popular

  return (
    <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] border border-[rgba(33,26,18,0.05)] bg-white shadow-[0_1px_2px_rgba(33,26,18,0.04),0_8px_24px_rgba(33,26,18,0.05)]">
        <SmartImage
          src={bundle.image}
          alt={bundle.name}
          fill
          className="object-cover"
        />
        {popular && (
          <span className="absolute left-4 top-4 rounded-full bg-[#FAF9F6]/95 px-3 py-1.5 text-[11px] font-semibold text-[#211A12] shadow-sm">
            Most popular
          </span>
        )}
      </div>

      {/* Story */}
      <div>
        {isSub && (
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-[#7A3F1C]">
            {FREQ_LABEL[bundle.frequency]} subscription
          </p>
        )}
        <h2 className="ga-display-title mt-1.5 text-[clamp(24px,2.8vw,36px)] text-[#211A12]">
          {bundle.name}
        </h2>
        <p className="mt-3 text-[14.5px] leading-relaxed text-[#5C5247]">
          {bundle.description}
        </p>

        {/* Contents as quiet text list */}
        <ul className="mt-5 space-y-1.5">
          {lineItems.map((it) => (
            <li key={it.name} className="flex items-baseline gap-2 text-[13.5px] text-[#3D332A]">
              <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-[#DF8821]" />
              <span>
                {it.qty}× {it.name}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-baseline gap-2">
          <Price amount={bundle.price} size="lg" per={isSub ? 'per delivery' : undefined} />
          <span className="text-[13px] text-[#8A7E72]">{bundle.serves}</span>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={addBox}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-[rgba(33,26,18,0.15)] text-[15px] font-semibold text-[#211A12] transition-all duration-300 hover:border-[rgba(11,59,37,0.45)] hover:text-[#0B3B25] active:scale-[0.98]"
          >
            {added ? (
              <>
                <Check width={16} height={16} /> Added to basket
              </>
            ) : (
              <>
                <ShoppingBasket width={16} height={16} /> Add box
              </>
            )}
          </button>
          {isSub && (
            <button
              type="button"
              onClick={subscribe}
              disabled={subscribing || subscribed}
              className="group inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#0B3B25] text-[15px] font-semibold text-white transition-all duration-300 hover:bg-[#0F4A2E] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
            >
              {subscribing ? (
                <Loader2 width={16} height={16} className="animate-spin" />
              ) : subscribed ? (
                <>
                  <Check width={16} height={16} /> Subscribed
                </>
              ) : (
                <>
                  <CalendarClock width={16} height={16} /> Subscribe
                  <ArrowRight
                    width={15}
                    height={15}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </>
              )}
            </button>
          )}
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-[#8A7E72]">
          Subscriptions skip, pause, or cancel anytime — controls live in your
          account under My Boxes.
        </p>
      </div>
    </article>
  )
}
