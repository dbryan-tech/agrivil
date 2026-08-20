'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Phone,
  CreditCard,
  Smartphone,
  Lock,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react'
import { formatGHS } from '@/lib/golden-acres/format'
import { cn } from '@/lib/utils'
import { PackageBoxes3D } from '@/app/preview/_lib/premium'

type PaymentMethod = 'momo' | 'telecel' | 'card' | 'cod'

export default function MobileCheckoutScreen() {
  const [method, setMethod] = useState<PaymentMethod>('momo')
  const [phone, setPhone] = useState('024 555 0142')
  const [success, setSuccess] = useState(false)

  const total = 68.2

  return (
    <div className="relative min-h-dvh w-full bg-[#F7F5F0] pb-32 text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(200px,36vh,320px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.12) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[rgba(33,26,18,0.08)] bg-[#F7F5F0]/90 px-5 py-3 backdrop-blur-md">
        <Link
          href="/preview/cart"
          aria-label="Back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#211A12] shadow-[0_1px_4px_rgba(33,26,18,0.06)] border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-[17px] font-extrabold tracking-tight text-[#211A12]">
          Secure Checkout
        </h1>
        <div className="flex items-center gap-1 text-[11px] font-bold text-[#0B3B25]">
          <Lock className="h-3.5 w-3.5" />
          <span>SSL 256</span>
        </div>
      </header>

      <div className="relative px-5 pt-3 space-y-4">
        {/* Delivery Address Card */}
        <div className="rounded-[28px] bg-[#FDFDFB] p-5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(33,26,18,0.06)]">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
              Delivery Destination
            </span>
            <button
              type="button"
              className="text-[11px] font-bold text-[#7A3F1C] hover:underline"
            >
              Edit
            </button>
          </div>
          <div className="mt-3 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0B3B25]/10 text-[#0B3B25]">
              <MapPin className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-[14px] font-extrabold text-[#211A12]">
                Nana Adjei · +233 24 555 0142
              </h4>
              <p className="text-[12px] font-bold text-[#7A3F1C]">
                GhanaPostGPS: GA-183-4250
              </p>
              <p className="text-[11.5px] font-semibold text-[#5C5247]">
                East Legon, House 14, Near American House, Accra
              </p>
            </div>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="rounded-[28px] bg-[#FDFDFB] p-5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
            Payment Method
          </span>
          <div className="mt-3 space-y-2.5">
            {/* MTN MoMo */}
            <button
              type="button"
              onClick={() => setMethod('momo')}
              className={cn(
                'flex w-full items-center justify-between rounded-2xl p-3.5 text-left transition-all border',
                method === 'momo'
                  ? 'bg-white border-[#0B3B25] ring-2 ring-[#0B3B25]/20 shadow-xs'
                  : 'bg-white/60 border-[rgba(33,26,18,0.08)]'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FDB813]/20 text-[#211A12] font-black text-[12px]">
                  MTN
                </div>
                <div>
                  <h4 className="text-[13px] font-extrabold text-[#211A12]">
                    MTN Mobile Money
                  </h4>
                  <p className="text-[11px] font-semibold text-[#5C5247]">
                    Prompt sent directly to {phone}
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  'h-5 w-5 rounded-full border-2 flex items-center justify-center',
                  method === 'momo'
                    ? 'border-[#0B3B25] bg-[#0B3B25]'
                    : 'border-[rgba(33,26,18,0.3)]'
                )}
              >
                {method === 'momo' && (
                  <div className="h-2 w-2 rounded-full bg-white" />
                )}
              </div>
            </button>

            {/* Telecel Cash */}
            <button
              type="button"
              onClick={() => setMethod('telecel')}
              className={cn(
                'flex w-full items-center justify-between rounded-2xl p-3.5 text-left transition-all border',
                method === 'telecel'
                  ? 'bg-white border-[#0B3B25] ring-2 ring-[#0B3B25]/20 shadow-xs'
                  : 'bg-white/60 border-[rgba(33,26,18,0.08)]'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E60000]/15 text-[#E60000] font-black text-[11px]">
                  T-Cash
                </div>
                <div>
                  <h4 className="text-[13px] font-extrabold text-[#211A12]">
                    Telecel Cash
                  </h4>
                  <p className="text-[11px] font-semibold text-[#5C5247]">
                    Vodafone / Telecel prompt
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  'h-5 w-5 rounded-full border-2 flex items-center justify-center',
                  method === 'telecel'
                    ? 'border-[#0B3B25] bg-[#0B3B25]'
                    : 'border-[rgba(33,26,18,0.3)]'
                )}
              >
                {method === 'telecel' && (
                  <div className="h-2 w-2 rounded-full bg-white" />
                )}
              </div>
            </button>

            {/* Card */}
            <button
              type="button"
              onClick={() => setMethod('card')}
              className={cn(
                'flex w-full items-center justify-between rounded-2xl p-3.5 text-left transition-all border',
                method === 'card'
                  ? 'bg-white border-[#0B3B25] ring-2 ring-[#0B3B25]/20 shadow-xs'
                  : 'bg-white/60 border-[rgba(33,26,18,0.08)]'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7A3F1C]/15 text-[#7A3F1C]">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-[13px] font-extrabold text-[#211A12]">
                    Debit Card (Visa / Mastercard)
                  </h4>
                  <p className="text-[11px] font-semibold text-[#5C5247]">
                    Secured by Paystack / Hubtel
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  'h-5 w-5 rounded-full border-2 flex items-center justify-center',
                  method === 'card'
                    ? 'border-[#0B3B25] bg-[#0B3B25]'
                    : 'border-[rgba(33,26,18,0.3)]'
                )}
              >
                {method === 'card' && (
                  <div className="h-2 w-2 rounded-full bg-white" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Order Parcel Summary */}
        <div className="rounded-[28px] bg-[#FDFDFB] p-5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
                Order Items
              </span>
              <h4 className="mt-1 text-[14px] font-extrabold text-[#211A12]">
                3 Produce Items (4.6 kg)
              </h4>
              <p className="flex items-center gap-1 text-[12px] font-semibold text-[#5C5247]">
                <span>Tema Cold Hub</span>
                <ArrowRight className="h-3 w-3 text-[#7A3F1C]" />
                <span>East Legon</span>
              </p>
            </div>
            <PackageBoxes3D size={68} />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Place Order Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[rgba(33,26,18,0.08)] bg-[#F7F5F0]/95 px-5 pt-3 pb-[clamp(18px,2.8vh,24px)] backdrop-blur-md shadow-[0_-4px_20px_rgba(33,26,18,0.04)]">
        <button
          type="button"
          onClick={() => setSuccess(true)}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0B3B25] py-3.5 text-[15px] font-black text-white shadow-md active:scale-[0.98] transition-transform"
        >
          <Lock className="h-4 w-4" />
          <span>Pay {formatGHS(total)} with MoMo</span>
        </button>
      </div>

      {/* Success Modal Simulation */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[32px] bg-[#FDFDFB] p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0B3B25] text-white shadow-md">
              <CheckCircle2 className="h-9 w-9 stroke-[2.5]" />
            </div>
            <h3 className="mt-4 text-[20px] font-black tracking-tight text-[#211A12]">
              Order Confirmed!
            </h3>
            <p className="mt-1 text-[13px] font-semibold text-[#5C5247]">
              MoMo prompt approved. Your produce is scheduled for dawn picking at Auntie Ama's Garden.
            </p>
            <div className="my-4 flex justify-center">
              <PackageBoxes3D size={78} />
            </div>
            <Link
              href="/preview/orders"
              className="block w-full rounded-full bg-[#211A12] py-3 text-[14px] font-extrabold text-white shadow-sm"
            >
              View in My Shipping
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
