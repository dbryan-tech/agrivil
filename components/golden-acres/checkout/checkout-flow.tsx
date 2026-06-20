'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import {
  useCart,
  unitEstimate,
} from '@/components/golden-acres/cart-context'
import { useSession } from '@/components/golden-acres/auth/session-context'
import { useDataStore } from '@/components/golden-acres/store/data-store'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { formatGHS } from '@/lib/golden-acres/format'
import {
  validateGhanaPostGPS,
  getDeliveryQuote,
  getDeliverySlots,
  type GpsValidation,
} from '@/lib/golden-acres/api'
import {
  placeMomoOrder,
  startCardCheckout,
  confirmCardOrder,
  type PlaceOrderInput,
} from '@/app/actions/orders'
import { validatePromoCode } from '@/app/actions/promotions'
import type {
  DeliverySlot,
  DeliveryQuote,
  PaymentMethod,
  CustomerAccount,
  Order,
} from '@/lib/golden-acres/types'
import {
  ShoppingBasket,
  MapPin,
  CalendarClock,
  Wallet,
  CheckCircle2,
  Loader2,
  Trash2,
  Minus,
  Plus,
  ShieldCheck,
  Snowflake,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  MapPinned,
  Award,
  Tag,
} from 'lucide-react'
import {
  maxRedeemablePoints,
  pointsToCedis,
  MIN_REDEEM_POINTS,
} from '@/lib/golden-acres/loyalty'

type Step = 'cart' | 'delivery' | 'payment' | 'done'

const STEPS: { id: Step; label: string; icon: typeof MapPin }[] = [
  { id: 'cart', label: 'Basket', icon: ShoppingBasket },
  { id: 'delivery', label: 'Delivery', icon: MapPin },
  { id: 'payment', label: 'Payment', icon: Wallet },
  { id: 'done', label: 'Confirmed', icon: CheckCircle2 },
]

const PAYMENT_OPTIONS: {
  id: PaymentMethod
  label: string
  hint: string
}[] = [
  { id: 'momo-mtn', label: 'MTN Mobile Money', hint: 'Approve the prompt on your phone' },
  { id: 'momo-vodafone', label: 'Telecel Cash', hint: 'Approve the prompt on your phone' },
  { id: 'card', label: 'Debit / Credit Card', hint: 'Visa, Mastercard accepted' },
]

export function CheckoutFlow() {
  const { lines, count, subtotalEstimate, setQty, remove, clear } = useCart()
  const { account, refresh } = useSession()
  const { ingestOrder } = useDataStore()
  const [step, setStep] = useState<Step>('cart')

  // delivery state
  const [gpsCode, setGpsCode] = useState('')
  const [gps, setGps] = useState<GpsValidation | null>(null)
  const [quote, setQuote] = useState<DeliveryQuote | null>(null)
  const [validating, setValidating] = useState(false)
  const [slots, setSlots] = useState<DeliverySlot[]>([])
  const [slotId, setSlotId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [prefilled, setPrefilled] = useState(false)

  // payment state
  const [method, setMethod] = useState<PaymentMethod>('momo-mtn')
  const [paying, setPaying] = useState(false)
  const [reference, setReference] = useState<string | null>(null)
  const [redeem, setRedeem] = useState(false)
  const [payError, setPayError] = useState<string | null>(null)
  // Promo / discount code state.
  const [promoInput, setPromoInput] = useState('')
  const [promo, setPromo] = useState<{ code: string; discount: number; label: string } | null>(null)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [promoChecking, setPromoChecking] = useState(false)

  useEffect(() => {
    getDeliverySlots().then(setSlots)
  }, [])

  // Handle the return from Stripe hosted checkout. On success we confirm the
  // order server-side (verifies the Stripe session is paid) and show the
  // confirmation. We use the human reference stashed before redirecting.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const card = params.get('card')
    if (!card) return

    // Clean the query params so a refresh doesn't re-trigger this.
    const clean = () =>
      window.history.replaceState({}, '', window.location.pathname)

    if (card === 'cancel') {
      setStep('payment')
      setMethod('card')
      setPayError('Card payment was cancelled. You can try again or pick another method.')
      clean()
      return
    }

    if (card === 'success') {
      const ref = sessionStorage.getItem('ga-card-ref')
      sessionStorage.removeItem('ga-card-ref')
      clean()
      if (!ref) {
        setPayError('We could not match your card payment. Please check your orders.')
        return
      }
      setPaying(true)
      confirmCardOrder(ref)
        .then((res) => {
          if (res.ok && res.reference) {
            finalizeOrder(res.reference, res.order)
          } else {
            setStep('payment')
            setMethod('card')
            setPayError(res.error ?? 'We could not confirm your card payment.')
          }
        })
        .finally(() => setPaying(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Prefill from the signed-in customer's default saved address so a logged-in
  // shopper can check out in a couple of taps.
  useEffect(() => {
    if (prefilled || !account || account.role !== 'customer') return
    const customer = account as CustomerAccount
    const addr =
      customer.addresses.find((a) => a.isDefault) ?? customer.addresses[0]
    setName(addr?.recipient ?? customer.name)
    setPhone(addr?.phone ?? customer.phone ?? '')
    if (addr?.ghanaPostGPS) setGpsCode(addr.ghanaPostGPS)
    setPrefilled(true)
  }, [account, prefilled])

  // Auto-validate a prefilled address the first time the delivery step opens.
  useEffect(() => {
    if (step === 'delivery' && gpsCode && !gps && !validating) {
      void runValidate(gpsCode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const refrigerated = lines.some((l) => l.product.refrigerationRequired)
  const deliveryFee = quote?.servesArea ? quote.fee : 0
  const preDiscountTotal = subtotalEstimate + deliveryFee

  // Loyalty redemption: customers can apply points for cedi-off, capped to the
  // order total and their balance (minimum threshold applies).
  const availablePoints =
    account?.role === 'customer' ? (account as CustomerAccount).loyaltyPoints : 0
  const redeemablePoints = maxRedeemablePoints(availablePoints, preDiscountTotal)
  const canRedeem = redeemablePoints >= MIN_REDEEM_POINTS
  const pointsUsed = redeem && canRedeem ? redeemablePoints : 0
  const pointsDiscount = pointsToCedis(pointsUsed)
  // Promo discount is recomputed against the live subtotal so editing the cart
  // after applying a code keeps the math honest; the server re-validates too.
  const promoDiscount = promo
    ? Math.min(promo.discount, Math.max(0, subtotalEstimate))
    : 0
  const total = Math.max(0, preDiscountTotal - pointsDiscount - promoDiscount)
  const selectedSlot = slots.find((s) => s.id === slotId)

  async function applyPromo() {
    const code = promoInput.trim()
    if (!code) return
    setPromoChecking(true)
    setPromoError(null)
    const res = await validatePromoCode(code, subtotalEstimate)
    setPromoChecking(false)
    if (res.ok && res.promo) {
      setPromo({
        code: res.promo.code,
        discount: res.promo.discount,
        label: res.promo.description || res.promo.code,
      })
      setPromoError(null)
    } else {
      setPromo(null)
      setPromoError(res.error ?? 'That code is not valid.')
    }
  }

  function clearPromo() {
    setPromo(null)
    setPromoInput('')
    setPromoError(null)
  }

  async function runValidate(code: string) {
    setValidating(true)
    setQuote(null)
    const res = await validateGhanaPostGPS(code)
    setGps(res)
    if (res.valid && res.point) {
      setQuote(await getDeliveryQuote(res.point))
    }
    setValidating(false)
  }

  async function handleValidate() {
    await runValidate(gpsCode)
  }

  // Build the server payload. Crucially the client sends only product ids +
  // quantities — never prices — so the server recomputes authoritative totals.
  function buildOrderInput(): PlaceOrderInput | null {
    if (!selectedSlot || !gps?.point) return null
    return {
      customerName: name,
      customerPhone: phone,
      items: lines.map((l) => ({ productId: l.product.id, qty: l.qty })),
      address: {
        ghanaPostGPS: gpsCode,
        area: gps.area ?? 'Greater Accra',
        lat: gps.point.lat,
        lng: gps.point.lng,
      },
      slot: { date: selectedSlot.date, window: selectedSlot.window },
      method,
      deliveryFee,
      redeemPoints: redeem && canRedeem,
      promoCode: promo?.code,
    }
  }

  // Shared success path: mirror the server-persisted order into the in-memory
  // store, refresh the account (loyalty + order history come from the DB now),
  // show the confirmation, and clear the basket.
  function finalizeOrder(ref: string, order?: Order) {
    if (order) ingestOrder(order)
    refresh()
    setReference(ref)
    setStep('done')
    clear()
  }

  async function handlePay() {
    const input = buildOrderInput()
    if (!input) return
    setPayError(null)
    if (method === 'card') {
      // Stripe HOSTED checkout: create a session server-side (secret key only,
      // no publishable key needed) and redirect the browser to Stripe's page.
      // On return, Stripe sends the shopper back to /checkout?card=success&ref=…
      setPaying(true)
      try {
        const origin = window.location.origin
        const res = await startCardCheckout(input, {
          successUrl: `${origin}/checkout?card=success&ref={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${origin}/checkout?card=cancel`,
        })
        if (res.ok && res.checkoutUrl && res.reference) {
          // Stash the human reference so we can finalize on return; the URL
          // carries the Stripe session id which confirmCardOrder maps back.
          sessionStorage.setItem('ga-card-ref', res.reference)
          window.location.href = res.checkoutUrl
          return
        }
        setPayError(res.error ?? 'Could not start card checkout.')
        setPaying(false)
      } catch (e) {
        setPayError(e instanceof Error ? e.message : 'Could not start card checkout.')
        setPaying(false)
      }
      return
    }
    setPaying(true)
    try {
      // Simulated MoMo charge happens server-side; order persists immediately.
      const res = await placeMomoOrder(input)
      if (res.ok && res.reference) {
        finalizeOrder(res.reference, res.order)
      } else {
        setPayError(res.error ?? 'Mobile Money payment failed.')
      }
    } catch (e) {
      setPayError(e instanceof Error ? e.message : 'Payment failed.')
    } finally {
      setPaying(false)
    }
  }

  const canProceedDelivery =
    gps?.valid &&
    quote?.servesArea &&
    slotId &&
    name.trim().length > 1 &&
    phone.trim().length >= 9

  // ---------- Empty basket ----------
  if (count === 0 && step !== 'done') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <ShoppingBasket className="h-7 w-7 text-[var(--ga-gold)]" />
        </div>
        <h1 className="ga-display mt-6 text-3xl font-semibold text-foreground">
          Your basket is empty
        </h1>
        <p className="mt-2 text-muted-foreground">
          Fresh from the farm is just a few taps away.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          Browse the market <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <Stepper step={step} />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="ga-rise">
          {step === 'cart' && (
            <CartStep
              lines={lines}
              setQty={setQty}
              remove={remove}
              onNext={() => setStep('delivery')}
            />
          )}

          {step === 'delivery' && (
            <DeliveryStep
              gpsCode={gpsCode}
              setGpsCode={setGpsCode}
              gps={gps}
              quote={quote}
              validating={validating}
              onValidate={handleValidate}
              slots={slots}
              slotId={slotId}
              setSlotId={setSlotId}
              name={name}
              setName={setName}
              phone={phone}
              setPhone={setPhone}
              refrigerated={refrigerated}
              canProceed={!!canProceedDelivery}
              onBack={() => setStep('cart')}
              onNext={() => setStep('payment')}
            />
          )}

          {step === 'payment' && (
            <PaymentStep
              method={method}
              setMethod={setMethod}
              phone={phone}
              paying={paying}
              total={total}
              canRedeem={canRedeem}
              redeem={redeem}
              setRedeem={setRedeem}
              redeemablePoints={redeemablePoints}
              potentialDiscount={pointsToCedis(redeemablePoints)}
              onBack={() => setStep('delivery')}
              onPay={handlePay}
              payError={payError}
            />
          )}

          {step === 'done' && (
            <DoneStep
              reference={reference}
              name={name}
              slot={selectedSlot}
              area={gps?.area}
            />
          )}
        </div>

        {step !== 'done' && (
          <OrderSummary
            subtotal={subtotalEstimate}
            deliveryFee={deliveryFee}
            pointsDiscount={pointsDiscount}
            promo={promo}
            promoDiscount={promoDiscount}
            promoInput={promoInput}
            promoError={promoError}
            promoChecking={promoChecking}
            onPromoInput={setPromoInput}
            onApplyPromo={applyPromo}
            onClearPromo={clearPromo}
            total={total}
            quote={quote}
            slot={selectedSlot}
            refrigerated={refrigerated}
          />
        )}
      </div>
    </div>
  )
}

/* ---------------- Stepper ---------------- */
function Stepper({ step }: { step: Step }) {
  const activeIndex = STEPS.findIndex((s) => s.id === step)
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {STEPS.map((s, i) => {
        const done = i < activeIndex
        const active = i === activeIndex
        const Icon = s.icon
        return (
          <div key={s.id} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors ${
                  active
                    ? 'border-[var(--ga-gold)] bg-[var(--ga-gold)] text-white'
                    : done
                      ? 'border-[var(--ga-leaf)] bg-[var(--ga-leaf)] text-white'
                      : 'border-border bg-card text-muted-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span
                className={`hidden text-sm font-bold sm:inline ${
                  active || done ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-6 sm:w-12 ${
                  done ? 'bg-[var(--ga-leaf)]' : 'bg-border'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ---------------- Cart step ---------------- */
function CartStep({
  lines,
  setQty,
  remove,
  onNext,
}: {
  lines: ReturnType<typeof useCart>['lines']
  setQty: ReturnType<typeof useCart>['setQty']
  remove: ReturnType<typeof useCart>['remove']
  onNext: () => void
}) {
  return (
    <section>
      <h1 className="ga-display text-3xl font-semibold text-foreground">
        Your basket
      </h1>
      <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
        {lines.map((l) => (
          <div key={l.product.id} className="flex gap-4 p-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-secondary">
              <SmartImage src={l.product.image} alt={l.product.name} fill />
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-foreground">{l.product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {l.product.variableWeight
                      ? `≈ ${l.product.estWeightKg} kg · ${formatGHS(l.product.pricePerKg)}/kg`
                      : `Per ${l.product.unit}`}
                  </p>
                  {l.product.refrigerationRequired && (
                    <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[var(--ga-field)]">
                      <Snowflake className="h-3 w-3" /> Cold-chain
                    </span>
                  )}
                </div>
                <button
                  onClick={() => remove(l.product.id)}
                  className="text-muted-foreground transition-colors hover:text-[var(--ga-terracotta)]"
                  aria-label={`Remove ${l.product.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="flex items-center gap-1 rounded-full border border-border">
                  <button
                    onClick={() => setQty(l.product.id, l.qty - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-foreground hover:bg-secondary"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-bold tabular-nums">
                    {l.qty}
                  </span>
                  <button
                    onClick={() => setQty(l.product.id, l.qty + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-foreground hover:bg-secondary"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <span className="font-extrabold text-foreground">
                  {formatGHS(unitEstimate(l.product) * l.qty)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onNext}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 sm:w-auto"
      >
        Continue to delivery <ArrowRight className="h-4 w-4" />
      </button>
    </section>
  )
}

/* ---------------- Delivery step ---------------- */
function DeliveryStep({
  gpsCode,
  setGpsCode,
  gps,
  quote,
  validating,
  onValidate,
  slots,
  slotId,
  setSlotId,
  name,
  setName,
  phone,
  setPhone,
  refrigerated,
  canProceed,
  onBack,
  onNext,
}: {
  gpsCode: string
  setGpsCode: (v: string) => void
  gps: GpsValidation | null
  quote: DeliveryQuote | null
  validating: boolean
  onValidate: () => void
  slots: DeliverySlot[]
  slotId: string | null
  setSlotId: (id: string) => void
  name: string
  setName: (v: string) => void
  phone: string
  setPhone: (v: string) => void
  refrigerated: boolean
  canProceed: boolean
  onBack: () => void
  onNext: () => void
}) {
  const outOfArea = gps?.valid && quote && !quote.servesArea
  const invalid = gps && !gps.valid

  return (
    <section>
      <h1 className="ga-display text-3xl font-semibold text-foreground">
        Where should we deliver?
      </h1>

      {/* contact */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Full name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Akosua Mensah"
            className="ga-input"
          />
        </Field>
        <Field label="Phone number">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="024 000 0000"
            inputMode="tel"
            className="ga-input"
          />
        </Field>
      </div>

      {/* GhanaPostGPS */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <label className="flex items-center gap-2 text-sm font-bold text-foreground">
          <MapPin className="h-4 w-4 text-[var(--ga-gold)]" />
          GhanaPostGPS digital address
        </label>
        <p className="mt-1 text-sm text-muted-foreground">
          We use your GPS code to match the nearest farms and confirm we deliver
          to your area.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={gpsCode}
            onChange={(e) => setGpsCode(e.target.value.toUpperCase())}
            placeholder="GA-183-4250"
            className="ga-input flex-1 font-semibold tracking-wide"
          />
          <button
            onClick={onValidate}
            disabled={validating || gpsCode.trim().length < 6}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {validating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Validate'
            )}
          </button>
        </div>

        {invalid && (
          <p className="mt-3 flex items-center gap-2 rounded-lg bg-[var(--ga-terracotta)]/10 px-3 py-2 text-sm font-semibold text-[var(--ga-terracotta)]">
            <AlertTriangle className="h-4 w-4" /> That doesn&apos;t look like a
            valid GhanaPostGPS code. Format: GA-183-4250.
          </p>
        )}

        {outOfArea && (
          <p className="mt-3 flex items-center gap-2 rounded-lg bg-[var(--ga-gold)]/10 px-3 py-2 text-sm font-semibold text-[var(--ga-gold)]">
            <AlertTriangle className="h-4 w-4" /> We&apos;re not in{' '}
            {gps?.area} yet — join the waitlist and we&apos;ll notify you at
            launch.
          </p>
        )}

        {gps?.valid && quote?.servesArea && (
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-[var(--ga-leaf)]/10 px-3 py-2.5 text-sm">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ga-leaf)]" />
            <span className="font-semibold text-[var(--ga-field-deep)]">
              Great — we deliver to {gps.area}. {quote.distanceFromHubKm} km from{' '}
              {quote.hubName}. {quote.etaWindow} delivery available.
            </span>
          </div>
        )}
      </div>

      {/* slots */}
      {gps?.valid && quote?.servesArea && (
        <div className="mt-6">
          <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <CalendarClock className="h-4 w-4 text-[var(--ga-gold)]" />
            Choose a delivery window
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {slots.map((s) => {
              const active = s.id === slotId
              const date = new Date(s.date)
              return (
                <button
                  key={s.id}
                  onClick={() => setSlotId(s.id)}
                  className={`rounded-xl border-2 p-4 text-left transition-colors ${
                    active
                      ? 'border-[var(--ga-gold)] bg-[var(--ga-gold)]/5'
                      : 'border-border bg-card hover:border-[var(--ga-gold-soft)]'
                  }`}
                >
                  <p className="font-bold text-foreground">
                    {date.toLocaleDateString('en-GB', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">{s.window}</p>
                  <p className="mt-1 text-xs font-semibold text-[var(--ga-leaf)]">
                    {s.capacityRemaining} slots left
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {refrigerated && (
        <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-[var(--ga-field)]">
          <Snowflake className="h-4 w-4" /> Your basket includes cold-chain items
          — they ship in temperature-controlled packaging.
        </p>
      )}

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-sm font-bold text-muted-foreground hover:text-foreground"
        >
          ← Back to basket
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue to payment <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  )
}

/* ---------------- Payment step ---------------- */
function PaymentStep({
  method,
  setMethod,
  phone,
  paying,
  total,
  canRedeem,
  redeem,
  setRedeem,
  redeemablePoints,
  potentialDiscount,
  onBack,
  onPay,
  payError,
}: {
  method: PaymentMethod
  setMethod: (m: PaymentMethod) => void
  phone: string
  paying: boolean
  total: number
  canRedeem: boolean
  redeem: boolean
  setRedeem: (v: boolean) => void
  redeemablePoints: number
  potentialDiscount: number
  onBack: () => void
  onPay: () => void
  payError: string | null
}) {
  return (
    <section>
      <h1 className="ga-display text-3xl font-semibold text-foreground">
        How would you like to pay?
      </h1>

      {canRedeem && (
        <button
          type="button"
          onClick={() => setRedeem(!redeem)}
          aria-pressed={redeem}
          className={`mt-6 flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-colors ${
            redeem
              ? 'border-[var(--ga-leaf)] bg-[var(--ga-leaf)]/5'
              : 'border-border bg-card hover:border-[var(--ga-leaf)]/50'
          }`}
        >
          <div
            className={`flex h-5 w-5 items-center justify-center rounded-md border-2 ${
              redeem ? 'border-[var(--ga-leaf)] bg-[var(--ga-leaf)]' : 'border-border'
            }`}
          >
            {redeem && <CheckCircle2 className="h-4 w-4 text-white" />}
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-[var(--ga-gold)]" />
            <div>
              <p className="font-bold text-foreground">
                Redeem {redeemablePoints.toLocaleString()} loyalty points
              </p>
              <p className="text-sm text-muted-foreground">
                Save {formatGHS(potentialDiscount)} on this order
              </p>
            </div>
          </div>
        </button>
      )}
      <p className="mt-2 text-muted-foreground">
        Pay securely with Mobile Money or card. You&apos;re only charged the
        estimate now — final weight is reconciled on delivery.
      </p>

      <div className="mt-6 space-y-3">
        {PAYMENT_OPTIONS.map((opt) => {
          const active = opt.id === method
          return (
            <button
              key={opt.id}
              onClick={() => setMethod(opt.id)}
              className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-colors ${
                active
                  ? 'border-[var(--ga-gold)] bg-[var(--ga-gold)]/5'
                  : 'border-border bg-card hover:border-[var(--ga-gold-soft)]'
              }`}
            >
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  active ? 'border-[var(--ga-gold)]' : 'border-border'
                }`}
              >
                {active && (
                  <div className="h-2.5 w-2.5 rounded-full bg-[var(--ga-gold)]" />
                )}
              </div>
              <div>
                <p className="font-bold text-foreground">{opt.label}</p>
                <p className="text-sm text-muted-foreground">{opt.hint}</p>
              </div>
              <Wallet className="ml-auto h-5 w-5 text-muted-foreground" />
            </button>
          )
        })}
      </div>

      {method !== 'card' && phone && (
        <p className="mt-4 text-sm text-muted-foreground">
          A prompt will be sent to <span className="font-bold">{phone}</span>.
        </p>
      )}

      <div className="mt-6 flex items-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-[var(--ga-field-deep)]">
        <ShieldCheck className="h-4 w-4 text-[var(--ga-leaf)]" />
        Protected by the AgriVil Freshness Promise — instant refund on any
        bad batch.
      </div>

      {payError && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border-2 border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-semibold text-destructive">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          {payError}
        </div>
      )}

      {method === 'card' && (
        <p className="mt-4 text-sm text-muted-foreground">
          You&apos;ll be redirected to our secure Stripe payment page to enter
          your card details, then brought right back to confirm your order.
        </p>
      )}

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-sm font-bold text-muted-foreground hover:text-foreground"
        >
          ← Back to delivery
        </button>
        <button
          onClick={onPay}
          disabled={paying}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--ga-gold)] px-6 py-3.5 font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-70"
        >
          {paying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />{' '}
              {method === 'card' ? 'Redirecting to secure checkout…' : 'Processing…'}
            </>
          ) : (
            <>{method === 'card' ? 'Pay by card' : `Pay ${formatGHS(total)}`}</>
          )}
        </button>
      </div>
    </section>
  )
}

/* ---------------- Done step ---------------- */
function DoneStep({
  reference,
  name,
  slot,
  area,
}: {
  reference: string | null
  name: string
  slot?: DeliverySlot
  area?: string
}) {
  return (
    <section className="ga-rise text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--ga-leaf)]/15">
        <CheckCircle2 className="h-10 w-10 text-[var(--ga-leaf)]" />
      </div>
      <h1 className="ga-display mt-6 text-4xl font-semibold text-foreground">
        Order confirmed!
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Thank you{name ? `, ${name.split(' ')[0]}` : ''} — your fresh produce is
        on its way.
      </p>

      <div className="mx-auto mt-8 max-w-md rounded-2xl border border-border bg-card p-6 text-left">
        <Row label="Order reference" value={reference ?? '—'} bold />
        {slot && (
          <Row
            label="Delivery window"
            value={`${new Date(slot.date).toLocaleDateString('en-GB', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            })}, ${slot.window}`}
          />
        )}
        {area && <Row label="Delivering to" value={area} />}
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-[var(--ga-gold)]/10 px-3 py-2.5 text-sm font-semibold text-[var(--ga-gold)]">
          <Sparkles className="h-4 w-4" />
          We&apos;ll text you tracking updates at each step.
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {reference && (
          <Link
            href={`/orders/${reference}`}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--ga-field)] px-6 py-3 font-bold text-cream transition-transform hover:-translate-y-0.5"
          >
            <MapPinned className="h-4 w-4" /> Track order
          </Link>
        )}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          Continue shopping
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-bold text-foreground transition-colors hover:bg-secondary"
        >
          Back to home
        </Link>
      </div>
    </section>
  )
}

/* ---------------- Order summary ---------------- */
function OrderSummary({
  subtotal,
  deliveryFee,
  pointsDiscount,
  promo,
  promoDiscount,
  promoInput,
  promoError,
  promoChecking,
  onPromoInput,
  onApplyPromo,
  onClearPromo,
  total,
  quote,
  slot,
  refrigerated,
}: {
  subtotal: number
  deliveryFee: number
  pointsDiscount: number
  promo: { code: string; discount: number; label: string } | null
  promoDiscount: number
  promoInput: string
  promoError: string | null
  promoChecking: boolean
  onPromoInput: (v: string) => void
  onApplyPromo: () => void
  onClearPromo: () => void
  total: number
  quote: DeliveryQuote | null
  slot?: DeliverySlot
  refrigerated: boolean
}) {
  return (
    <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
      <h2 className="ga-display text-xl font-semibold text-foreground">
        Order summary
      </h2>
      <dl className="mt-4 space-y-2.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal (est.)</dt>
          <dd className="font-bold text-foreground">{formatGHS(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Delivery</dt>
          <dd className="font-bold text-foreground">
            {quote?.servesArea ? formatGHS(deliveryFee) : '—'}
          </dd>
        </div>
        {pointsDiscount > 0 && (
          <div className="flex justify-between">
            <dt className="flex items-center gap-1.5 text-[var(--ga-leaf)]">
              <Award className="h-3.5 w-3.5" /> Points redeemed
            </dt>
            <dd className="font-bold text-[var(--ga-leaf)]">
              −{formatGHS(pointsDiscount)}
            </dd>
          </div>
        )}
        {promoDiscount > 0 && promo && (
          <div className="flex justify-between">
            <dt className="flex items-center gap-1.5 text-[var(--ga-leaf)]">
              <Tag className="h-3.5 w-3.5" /> {promo.code}
            </dt>
            <dd className="font-bold text-[var(--ga-leaf)]">
              −{formatGHS(promoDiscount)}
            </dd>
          </div>
        )}
        {refrigerated && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--ga-field)]">
            <Snowflake className="h-3.5 w-3.5" /> Cold-chain packaging included
          </div>
        )}
      </dl>

      {/* Promo code */}
      <div className="mt-4 border-t border-border pt-4">
        {promo ? (
          <div className="flex items-center justify-between rounded-xl bg-[var(--ga-leaf)]/10 px-3 py-2.5">
            <div className="flex items-center gap-2 text-sm">
              <Tag className="h-4 w-4 text-[var(--ga-leaf)]" />
              <span className="font-bold text-foreground">{promo.code}</span>
              <span className="text-muted-foreground">applied</span>
            </div>
            <button
              type="button"
              onClick={onClearPromo}
              className="text-xs font-bold text-muted-foreground underline-offset-2 hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <div>
            <div className="flex gap-2">
              <input
                value={promoInput}
                onChange={(e) => onPromoInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    onApplyPromo()
                  }
                }}
                placeholder="Promo code"
                aria-label="Promo code"
                className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold uppercase tracking-wide text-foreground outline-none focus:border-[var(--ga-gold)]"
              />
              <button
                type="button"
                onClick={onApplyPromo}
                disabled={promoChecking || !promoInput.trim()}
                className="ga-scale-interactive shrink-0 rounded-xl bg-[var(--ga-field-deep)] px-4 py-2 text-sm font-bold text-[var(--ga-cream)] disabled:opacity-50"
              >
                {promoChecking ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
              </button>
            </div>
            {promoError && (
              <p className="mt-1.5 text-xs font-semibold text-[var(--ga-deal)]">
                {promoError}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
        <span className="font-bold text-foreground">Total (est.)</span>
        <span className="ga-display text-2xl font-semibold text-foreground">
          {formatGHS(total)}
        </span>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Variable-weight items are charged on the estimate. We reconcile to the
        exact weight at the hub and refund any difference automatically.
      </p>
      {slot && (
        <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[var(--ga-field-deep)]">
          <CalendarClock className="h-3.5 w-3.5" />
          {new Date(slot.date).toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          })}
          , {slot.window}
        </p>
      )}
    </aside>
  )
}

/* ---------------- small helpers ---------------- */
function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

function Row({
  label,
  value,
  bold,
}: {
  label: string
  value: string
  bold?: boolean
}) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={`text-sm ${bold ? 'font-extrabold text-[var(--ga-gold)]' : 'font-semibold text-foreground'}`}
      >
        {value}
      </span>
    </div>
  )
}
