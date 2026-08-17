'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  MapPin,
  Clock,
  CreditCard,
  Smartphone,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react'
import { useCart } from '@/components/golden-acres/cart-context'
import { formatGHS } from '@/lib/golden-acres/format'

export default function MobileCheckoutScreen() {
  const router = useRouter()
  const { subtotalEstimate, clear } = useCart()

  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'card'>('momo')
  const [momoProvider, setMomoProvider] = useState<'mtn' | 'telecel' | 'at'>('mtn')
  const [deliverySlot, setDeliverySlot] = useState('Tomorrow, 8:00 AM – 12:00 PM')
  const [gpsCode, setGpsCode] = useState('GA-143-3586')
  const [busy, setBusy] = useState(false)
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [orderRef, setOrderRef] = useState('')

  const deliveryFee = subtotalEstimate > 150 ? 0 : 8
  const total = (subtotalEstimate || 34.0) + deliveryFee

  async function handlePlaceOrder() {
    setBusy(true)
    // Simulate instant order dispatch and reference creation
    setTimeout(() => {
      const generatedRef = `AG-${Math.floor(10000000 + Math.random() * 90000000)}`
      setOrderRef(generatedRef)
      setBusy(false)
      setOrderConfirmed(true)
      clear()
    }, 900)
  }

  return (
    <div className="min-h-dvh bg-[#F4F1EA] pb-32 text-[#2B1F17]">
      {/* App Bar */}
      <header
        className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[#E0DACB]/80 bg-[#F4F1EA]/95 px-4 backdrop-blur-md"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-base font-extrabold text-[#2B1F17]">
          Checkout
        </h1>
      </header>

      {/* Body Content */}
      <div className="px-4 pt-4 space-y-4">
        {/* 1. Delivery Address Card */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#6E6A63]">
              Delivery Address
            </span>
            <Link
              href="/m/onboarding/gps"
              className="text-xs font-bold text-[#1E5D3B] hover:underline"
            >
              Change
            </Link>
          </div>

          <div className="mt-3 flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1E5D3B]/10 text-[#1E5D3B]">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-[#2B1F17]">Ewoke Mensah</p>
              <p className="mt-0.5 text-xs font-semibold text-[#1E5D3B]">
                GhanaPostGPS: {gpsCode}
              </p>
              <p className="text-[11px] text-[#6E6A63]">KNUST, Kumasi, Ashanti Region</p>
            </div>
          </div>
        </div>

        {/* 2. Delivery Time Slot Card */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#6E6A63]">
              Delivery Time
            </span>
            <span className="text-[10px] font-bold text-[#8A6B3D]">Cold-Chain Express</span>
          </div>

          <div className="mt-3 flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1E5D3B]/10 text-[#1E5D3B]">
              <Clock className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <select
                value={deliverySlot}
                onChange={(e) => setDeliverySlot(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-[#2B1F17] outline-none"
              >
                <option value="Tomorrow, 8:00 AM – 12:00 PM">Tomorrow, 8:00 AM – 12:00 PM (Morning Slot)</option>
                <option value="Tomorrow, 1:00 PM – 5:00 PM">Tomorrow, 1:00 PM – 5:00 PM (Afternoon Slot)</option>
                <option value="Tomorrow, 5:00 PM – 8:00 PM">Tomorrow, 5:00 PM – 8:00 PM (Evening Slot)</option>
              </select>
              <p className="text-[10px] text-[#6E6A63]">Packed fresh at the hub 1 hour before departure.</p>
            </div>
          </div>
        </div>

        {/* 3. Payment Method Card */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#6E6A63]">
            Payment Method
          </span>

          {/* MoMo Option */}
          <label className="flex items-center justify-between rounded-2xl border border-[#E0DACB] p-3 cursor-pointer has-checked:border-[#1E5D3B] has-checked:bg-[#1E5D3B]/5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FBBF24]/20 text-[#2B1F17]">
                <Smartphone className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#2B1F17]">Mobile Money (MoMo)</span>
                <span className="text-[10px] text-[#6E6A63]">MTN, Telecel, AT Money</span>
              </div>
            </div>
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === 'momo'}
              onChange={() => setPaymentMethod('momo')}
              className="h-4 w-4 accent-[#1E5D3B]"
            />
          </label>

          {/* Card Option */}
          <label className="flex items-center justify-between rounded-2xl border border-[#E0DACB] p-3 cursor-pointer has-checked:border-[#1E5D3B] has-checked:bg-[#1E5D3B]/5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1E5D3B]/10 text-[#1E5D3B]">
                <CreditCard className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#2B1F17]">Debit / Credit Card</span>
                <span className="text-[10px] text-[#6E6A63]">Visa, Mastercard (GHS &amp; USD)</span>
              </div>
            </div>
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === 'card'}
              onChange={() => setPaymentMethod('card')}
              className="h-4 w-4 accent-[#1E5D3B]"
            />
          </label>
        </div>

        {/* 4. Order Summary Card */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 space-y-2 text-xs shadow-xs">
          <div className="flex justify-between text-[#6E6A63]">
            <span>Items Total</span>
            <span className="font-bold text-[#2B1F17]">
              {formatGHS(subtotalEstimate || 34.0)}
            </span>
          </div>
          <div className="flex justify-between text-[#6E6A63]">
            <span>Delivery Fee</span>
            <span className="font-bold text-[#2B1F17]">
              {deliveryFee === 0 ? <span className="text-[#1E5D3B]">FREE</span> : formatGHS(deliveryFee)}
            </span>
          </div>
          <div className="border-t border-[#E0DACB]/60 pt-2 flex justify-between text-sm font-extrabold text-[#2B1F17]">
            <span>Total Payable</span>
            <span className="text-base text-[#1E5D3B]">{formatGHS(total)}</span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Place Order Action */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-[#E0DACB] bg-white/95 p-4 shadow-xl backdrop-blur-md"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 14px)' }}
      >
        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={busy}
          className="ga-press flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#1E5D3B] text-base font-bold text-white shadow-md hover:bg-[#144028] disabled:opacity-50"
        >
          {busy ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Processing Payment...</span>
            </>
          ) : (
            <span>Place Order ({formatGHS(total)})</span>
          )}
        </button>
      </div>

      {/* Order Confirmed Modal */}
      {orderConfirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#1E5D3B]/10 text-[#1E5D3B]">
              <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
            </div>

            <h3 className="ga-headline mt-4 text-2xl font-extrabold text-[#2B1F17]">
              Order Placed!
            </h3>
            <p className="mt-1 text-xs text-[#6E6A63]">
              Your harvest has been dispatched to our partner farms.
            </p>

            <div className="mt-4 rounded-2xl bg-[#F4F1EA] p-3 text-xs">
              <span className="text-[#6E6A63]">Order Reference:</span>
              <p className="text-sm font-extrabold text-[#1E5D3B]">{orderRef}</p>
            </div>

            <div className="mt-6 space-y-2.5">
              <Link
                href={`/m/orders/${orderRef}`}
                className="ga-press flex h-13 w-full items-center justify-center rounded-2xl bg-[#1E5D3B] text-sm font-bold text-white shadow-md"
              >
                Track Delivery
              </Link>
              <Link
                href="/m"
                className="ga-press flex h-11 w-full items-center justify-center rounded-2xl border border-[#E0DACB] text-xs font-bold text-[#6E6A63]"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
