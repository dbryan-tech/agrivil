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
  ChevronRight,
} from 'lucide-react'
import { useCart } from '@/components/golden-acres/cart-context'
import { formatGHS } from '@/lib/golden-acres/format'
import { cn } from '@/lib/utils'
import { PackageBoxes3D } from '@/app/preview/_lib/premium'

export default function MobileCheckoutScreen() {
  const router = useRouter()
  const { subtotalEstimate, clear } = useCart()

  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'card' | 'cod'>('momo')
  const [momoProvider, setMomoProvider] = useState<'mtn' | 'telecel' | 'at'>('mtn')
  const [momoPhone, setMomoPhone] = useState('024 123 4567')
  const [deliverySlot, setDeliverySlot] = useState('Today, 2:00 PM – 5:00 PM (Afternoon Dispatch)')
  const [gpsCode, setGpsCode] = useState('GA-183-4250')
  const [busy, setBusy] = useState(false)

  const deliveryFee = subtotalEstimate > 150 ? 0 : 8
  const packagingFee = 0
  const discount = subtotalEstimate > 0 ? 5.0 : 0
  const finalTotal = Math.max(0, (subtotalEstimate || 34.0) + deliveryFee + packagingFee - discount)

  async function handlePlaceOrder() {
    setBusy(true)
    setTimeout(() => {
      clear()
      router.push('/m/checkout/success')
    }, 900)
  }

  return (
    <div className="relative min-h-dvh w-full bg-[#F7F5F0] pb-36 text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Zero Scrollbar Global Styles */}
      <style jsx global>{`
        * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        *::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      `}</style>

      {/* Top warm brand gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(240px,40vh,360px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.14) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      {/* Header Bar */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between border-b border-[rgba(33,26,18,0.08)] bg-[#F7F5F0]/90 px-3 py-2.5 backdrop-blur-md"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 10px)' }}
      >
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-[16px] font-black tracking-tight text-[#211A12]">
              Order Checkout
            </h1>
            <p className="text-[11px] font-bold text-[#5C5247]">
              Direct Farm Dispatch
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-black text-[#0B3B25]">
          <ShieldCheck className="h-4 w-4" />
          <span>SSL Secured</span>
        </div>
      </header>

      <div className="relative px-3 pt-2.5 space-y-2.5">
        {/* 1. Delivery Address Card */}
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <div className="flex items-center justify-between pb-1.5 border-b border-[rgba(33,26,18,0.06)]">
            <span className="text-[9.5px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
              DELIVERING TO
            </span>
            <Link
              href="/m/onboarding/gps"
              className="text-[11px] font-bold text-[#7A3F1C] hover:underline"
            >
              Edit Address
            </Link>
          </div>

          <div className="mt-2.5 flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#0B3B25]/10 text-[#0B3B25]">
              <MapPin className="h-4 w-4 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[13.5px] font-extrabold text-[#211A12]">
                University Hall (Katanga), Room B12
              </h2>
              <p className="mt-0.5 text-[11.5px] font-semibold text-[#5C5247]">
                KNUST Campus, Kumasi
              </p>
              <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-0.5 text-[10.5px] font-black text-[#7A3F1C] shadow-2xs border border-[rgba(33,26,18,0.08)]">
                GhanaPostGPS: {gpsCode}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Delivery Time Window */}
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#7A3F1C]/10 text-[#7A3F1C]">
                <Clock className="h-4 w-4 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[9.5px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
                  DELIVERY WINDOW
                </span>
                <h3 className="text-[12.5px] font-extrabold text-[#211A12] mt-0.5">
                  {deliverySlot}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Payment Method Card */}
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <span className="text-[9.5px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
            CHOOSE PAYMENT METHOD
          </span>

          <div className="mt-2.5 grid grid-cols-3 gap-1.5">
            {[
              { id: 'momo' as const, label: 'Mobile Money', icon: Smartphone },
              { id: 'card' as const, label: 'Card / Visa', icon: CreditCard },
              { id: 'cod' as const, label: 'Cash / COD', icon: CheckCircle2 },
            ].map((p) => {
              const Icon = p.icon
              const active = paymentMethod === p.id
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPaymentMethod(p.id)}
                  className={cn(
                    'flex flex-col items-center justify-center rounded-2xl p-2.5 border transition-all text-center active:scale-95',
                    active
                      ? 'border-[#0B3B25] bg-[#0B3B25] text-white shadow-xs'
                      : 'border-[rgba(33,26,18,0.10)] bg-white text-[#211A12]'
                  )}
                >
                  <Icon className="h-4 w-4 stroke-[2.2]" />
                  <span className="mt-1 text-[10.5px] font-extrabold">{p.label}</span>
                </button>
              )
            })}
          </div>

          {/* MoMo Provider Selection Sub-Panel */}
          {paymentMethod === 'momo' && (
            <div className="mt-3 pt-2.5 border-t border-[rgba(33,26,18,0.06)] space-y-2.5">
              <span className="text-[9.5px] font-black uppercase tracking-wider text-[#5C5247]">
                Select Network
              </span>
              <div className="flex gap-1.5">
                {[
                  { id: 'mtn' as const, label: 'MTN MoMo', color: '#FFCC00' },
                  { id: 'telecel' as const, label: 'Telecel Cash', color: '#E60000' },
                  { id: 'at' as const, label: 'AT Money', color: '#0055AA' },
                ].map((net) => (
                  <button
                    key={net.id}
                    type="button"
                    onClick={() => setMomoProvider(net.id)}
                    className={cn(
                      'flex-1 rounded-xl py-1.5 text-center text-[10.5px] font-extrabold border transition-all',
                      momoProvider === net.id
                        ? 'border-[#0B3B25] bg-white text-[#0B3B25] ring-2 ring-[#0B3B25]/20 shadow-xs'
                        : 'border-[rgba(33,26,18,0.10)] bg-[#F7F5F0] text-[#5C5247]'
                    )}
                  >
                    {net.label}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-[9.5px] font-black uppercase tracking-wider text-[#5C5247]">
                  MoMo Prompt Number
                </label>
                <input
                  type="tel"
                  value={momoPhone}
                  onChange={(e) => setMomoPhone(e.target.value)}
                  className="mt-1 flex h-10 w-full rounded-2xl border border-[rgba(33,26,18,0.10)] bg-white px-3 text-[12.5px] font-extrabold text-[#211A12] shadow-2xs outline-none focus:border-[#0B3B25]"
                />
              </div>
            </div>
          )}
        </div>

        {/* 4. Parcel Summary Card */}
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <div className="flex items-center justify-between pb-2 border-b border-[rgba(33,26,18,0.06)]">
            <span className="text-[9.5px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
              PAYMENT BREAKDOWN
            </span>
            <PackageBoxes3D size={46} />
          </div>

          <div className="mt-2.5 space-y-1.5 text-[12.5px]">
            <div className="flex justify-between font-semibold text-[#5C5247]">
              <span>Produce Subtotal</span>
              <span className="font-extrabold text-[#211A12]">{formatGHS(subtotalEstimate || 34.0)}</span>
            </div>
            <div className="flex justify-between font-semibold text-[#5C5247]">
              <span>Cold-Chain Courier Fee</span>
              <span className="font-extrabold text-[#211A12]">{formatGHS(deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-semibold text-[#0B3B25]">
              <span>Farm Direct Coupon</span>
              <span className="font-extrabold">-{formatGHS(discount)}</span>
            </div>
            <div className="flex justify-between text-[15px] font-black text-[#211A12] pt-2 border-t border-[rgba(33,26,18,0.08)]">
              <span>Final Total</span>
              <span className="text-[#0B3B25] text-[17px]">{formatGHS(finalTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Place Order Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[rgba(33,26,18,0.08)] bg-[#F7F5F0]/95 px-3 pt-2.5 pb-[clamp(16px,2.5vh,22px)] backdrop-blur-md shadow-[0_-4px_20px_rgba(33,26,18,0.04)]">
        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={busy}
          className="flex w-full items-center justify-between rounded-full bg-[#0B3B25] px-5 py-3 text-white shadow-md active:scale-[0.98] transition-transform disabled:opacity-75"
        >
          <div className="text-left">
            <span className="text-[9.5px] font-black uppercase tracking-wider text-white/80">
              Confirm &amp; Authorize
            </span>
            <p className="text-[15px] font-black leading-none">{formatGHS(finalTotal)}</p>
          </div>
          <div className="flex items-center gap-2 text-[13px] font-black">
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Authorizing MoMo...</span>
              </>
            ) : (
              <>
                <span>Place Order</span>
                <ChevronRight className="h-4 w-4 stroke-[3]" />
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  )
}
