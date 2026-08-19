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

export default function MobileCheckoutScreen() {
  const router = useRouter()
  const { subtotalEstimate, clear } = useCart()

  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'card' | 'cod'>('momo')
  const [momoProvider, setMomoProvider] = useState<'mtn' | 'telecel' | 'at'>('mtn')
  const [momoPhone, setMomoPhone] = useState('024 123 4567')
  const [deliverySlot, setDeliverySlot] = useState('Today, 6:00 AM – 9:00 AM (Dawn Fresh)')
  const [gpsCode, setGpsCode] = useState('GA-143-3586')
  const [busy, setBusy] = useState(false)

  const deliveryFee = subtotalEstimate > 150 ? 0 : 5
  const packagingFee = 2
  const finalTotal = (subtotalEstimate || 34.0) + deliveryFee + packagingFee

  async function handlePlaceOrder() {
    setBusy(true)
    setTimeout(() => {
      clear()
      router.push('/m/checkout/success')
    }, 900)
  }

  return (
    <div className="min-h-dvh bg-[#FAF7F0] pb-32 text-[#2B1F17]">
      {/* Header Bar */}
      <header
        className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[#E0DACB] bg-[#FAF7F0] px-4"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 8px)' }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-base font-extrabold text-[#2B1F17]">Checkout</h1>
          <p className="text-[10px] text-[#6E6A63]">Direct Farm Dispatch</p>
        </div>
      </header>

      <div className="px-3 sm:px-4 pt-3.5 space-y-3.5">
        {/* 1. Delivery Address Card */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E6A63]">
              Delivering To
            </span>
            <span className="text-[10px] font-bold text-[#0F7A43]">KNUST Hub Radius</span>
          </div>

          <div className="mt-2.5 flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#0F7A43]/10 text-[#0F7A43]">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <h2 className="text-xs font-extrabold text-[#2B1F17]">University Hall (Katanga), Room B12</h2>
              <p className="text-[10px] text-[#6E6A63]">KNUST Campus, Kumasi</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded-md bg-[#FAF7F0] px-2 py-0.5 text-[9px] font-bold text-[#7A3F1C] border border-[#E0DACB]">
                  GPS: {gpsCode}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Delivery Time Window */}
        <Link
          href="/m/checkout/schedule"
          className="ga-press flex items-center justify-between rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#0F7A43]/10 text-[#0F7A43]">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E6A63]">
                Delivery Window
              </span>
              <h2 className="text-xs font-extrabold text-[#2B1F17]">{deliverySlot}</h2>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-[#6E6A63]" />
        </Link>

        {/* 3. Payment Method Card */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E6A63]">
            Payment Method
          </span>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { id: 'momo' as const, label: 'Mobile Money', icon: Smartphone },
              { id: 'card' as const, label: 'Bank Card', icon: CreditCard },
              { id: 'cod' as const, label: 'Cash / COD', icon: CheckCircle2 },
            ].map((p) => {
              const Icon = p.icon
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPaymentMethod(p.id)}
                  className={cn(
                    'ga-press flex flex-col items-center justify-center rounded-2xl p-2.5 border transition-all text-center',
                    paymentMethod === p.id
                      ? 'border-[#0F7A43] bg-[#0F7A43] text-white shadow-xs'
                      : 'border-[#E0DACB] bg-[#FAF7F0] text-[#2B1F17]'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="mt-1 text-[10px] font-bold">{p.label}</span>
                </button>
              )
            })}
          </div>

          {/* MoMo Provider Selection */}
          {paymentMethod === 'momo' && (
            <div className="mt-3 space-y-2.5 border-t border-[#E0DACB]/60 pt-3">
              <div className="flex gap-2">
                {[
                  { id: 'mtn' as const, label: 'MTN MoMo' },
                  { id: 'telecel' as const, label: 'Telecel Cash' },
                  { id: 'at' as const, label: 'AT Money' },
                ].map((prov) => (
                  <button
                    key={prov.id}
                    type="button"
                    onClick={() => setMomoProvider(prov.id)}
                    className={cn(
                      'ga-press flex-1 rounded-xl py-1.5 text-[10px] font-extrabold border transition-all',
                      momoProvider === prov.id
                        ? 'border-[#0F7A43] bg-[#0F7A43] text-white'
                        : 'border-[#E0DACB] bg-[#FAF7F0] text-[#2B1F17]'
                    )}
                  >
                    {prov.label}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#6E6A63]">
                  Wallet Phone Number
                </label>
                <input
                  type="tel"
                  value={momoPhone}
                  onChange={(e) => setMomoPhone(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-[#E0DACB] bg-[#FAF7F0] px-3 text-xs font-bold text-[#2B1F17] outline-none focus:border-[#0F7A43]"
                />
              </div>
            </div>
          )}
        </div>

        {/* 4. Order Summary */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs space-y-2 text-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E6A63]">
            Order Summary
          </span>

          <div className="flex justify-between text-[#6E6A63] pt-1">
            <span>Produce Subtotal</span>
            <span className="font-bold text-[#2B1F17]">{formatGHS(subtotalEstimate || 34.0)}</span>
          </div>

          <div className="flex justify-between text-[#6E6A63]">
            <span>Hub Dispatch Delivery</span>
            <span className="font-bold text-[#2B1F17]">{formatGHS(deliveryFee)}</span>
          </div>

          <div className="flex justify-between text-[#6E6A63]">
            <span>Cold-Chain Packaging</span>
            <span className="font-bold text-[#2B1F17]">{formatGHS(packagingFee)}</span>
          </div>

          <div className="flex justify-between font-extrabold text-[#2B1F17] border-t border-[#E0DACB]/60 pt-2 text-sm">
            <span>Total Payable</span>
            <span className="text-[#0F7A43]">{formatGHS(finalTotal)}</span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t border-[#E0DACB] bg-[#FAF7F0]/95 p-3 backdrop-blur-md">
        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={busy}
          className="ga-press flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#0F7A43] text-sm font-bold text-white shadow-md hover:bg-[#0B3B25] disabled:opacity-50"
        >
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Prompting MoMo Wallet...</span>
            </>
          ) : (
            <span>Pay {formatGHS(finalTotal)} via Mobile Money</span>
          )}
        </button>
      </div>
    </div>
  )
}
