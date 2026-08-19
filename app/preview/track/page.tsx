'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Truck,
  Phone,
  MessageSquare,
  Check,
  Star,
} from 'lucide-react'
import { formatGHS } from '@/lib/golden-acres/format'
import { cn } from '@/lib/utils'
import { PackageBoxes3D, ProductImageShell } from '@/app/preview/_lib/premium'

export default function MobileOrderLiveTrackingScreen() {
  const [tipped, setTipped] = useState(false)

  // Real AgriVil 3PL Cold-Chain Timeline Events
  const steps = [
    { label: 'Harvested at Koforidua Farm (Auntie Ama)', time: '6:40 AM', done: true },
    { label: 'FEFO Quality Check & Packed with Ice Packs', time: '9:10 AM', done: true },
    { label: 'Dispatched with Ibrahim Salifu (Van GR 4821-22)', time: '1:20 PM', done: true, current: true },
    { label: 'Estimated Delivery at East Legon (GA-183-4250)', time: '4:00 PM', done: false },
  ]

  return (
    <div className="relative min-h-dvh bg-[#F7F5F0] pb-24 text-[#211A12] select-none antialiased [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
        className="pointer-events-none absolute inset-x-0 top-0 h-64"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.12) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[rgba(33,26,18,0.08)] bg-[#F7F5F0]/90 px-5 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href="/preview/orders"
            aria-label="Back"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#211A12] shadow-[0_1px_4px_rgba(33,26,18,0.06)] border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-[17px] font-extrabold tracking-tight text-[#211A12]">
              Live Tracking
            </h1>
            <p className="text-[12px] font-bold text-[#5C5247]">
              Order ID: GA-24817 (SWFT-7781294)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-[#7A3F1C]/10 px-3 py-1 text-[11px] font-black text-[#7A3F1C]">
          <span className="h-2 w-2 rounded-full bg-[#7A3F1C] animate-pulse" />
          IN TRANSIT
        </div>
      </header>

      <div className="relative px-5 pt-4 space-y-4">
        {/* Estimated Arrival Hero */}
        <div className="rounded-[28px] bg-[#FAF9F6] p-5 shadow-[0_2px_10px_-2px_rgba(33,26,18,0.05),0_8px_20px_-6px_rgba(33,26,18,0.08)] border border-[rgba(33,26,18,0.08)] ring-1 ring-white/90">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#7A3F1C]/10 text-[#7A3F1C]">
              <Truck className="h-6 w-6 stroke-[2.4]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-black uppercase tracking-[0.14em] text-[#7A3F1C]">
                4 Hours Away · Cold-Chain Active
              </span>
              <h2 className="text-[17px] font-extrabold leading-tight tracking-tight text-[#211A12]">
                Arriving Today by 4:00 PM
              </h2>
              <p className="mt-0.5 text-[12px] font-semibold text-[#5C5247]">
                East Legon, GA-183-4250 (3 stops ahead)
              </p>
            </div>
          </div>
        </div>

        {/* Visual GPS Route Representation */}
        <div className="relative h-56 w-full overflow-hidden rounded-[28px] bg-[#EAE5DC] border border-[rgba(33,26,18,0.10)] shadow-[0_4px_16px_-4px_rgba(33,26,18,0.08)]">
          {/* Map Grid Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(122,63,28,0.12)_1.5px,transparent_1.5px)] [background-size:22px_22px] opacity-70" />
          
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(122,63,28,0.15) 0%, rgba(11,59,37,0.10) 60%, rgba(247,245,240,0.2) 100%)',
            }}
          />

          {/* Dotted Curved Route Line */}
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path
              d="M18 32 C 38 28, 48 48, 82 72"
              fill="none"
              stroke="#7A3F1C"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="2 3"
            />
          </svg>

          {/* Origin: Tema Aggregation Hub */}
          <div className="absolute top-[22%] left-[12%] flex flex-col items-center">
            <span className="rounded-md bg-white/95 px-2 py-0.5 text-[9px] font-black text-[#3D332A] shadow-sm border border-[rgba(33,26,18,0.10)]">
              Tema Hub
            </span>
            <div className="mt-1 h-3.5 w-3.5 rounded-full bg-[#5C5247] ring-4 ring-white shadow-sm" />
          </div>

          {/* Active Courier Delivery Marker */}
          <div className="absolute top-[48%] left-[50%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center z-10">
            <span className="flex items-center gap-1 rounded-full bg-[#7A3F1C] px-2.5 py-0.5 text-[9px] font-black text-white shadow-md">
              <Truck className="h-3 w-3 stroke-[2.5]" /> Driver Ibrahim (Van)
            </span>
            <div className="relative mt-1">
              <span className="absolute -inset-1 rounded-full bg-[#7A3F1C]/40 animate-ping" />
              <div className="relative h-4 w-4 rounded-full border-2 border-white bg-[#7A3F1C] shadow-sm" />
            </div>
          </div>

          {/* Destination: East Legon */}
          <div className="absolute bottom-[18%] right-[12%] flex flex-col items-center">
            <span className="rounded-md bg-[#0B3B25] px-2 py-0.5 text-[9px] font-black text-white shadow-md">
              East Legon (GA-183)
            </span>
            <div className="mt-1 h-4 w-4 rounded-full bg-[#0B3B25] ring-4 ring-white shadow-sm" />
          </div>
        </div>

        {/* Step-by-Step Delivery Timeline */}
        <div className="rounded-[28px] bg-[#FAF9F6] p-5 shadow-[0_2px_10px_-2px_rgba(33,26,18,0.05),0_8px_20px_-6px_rgba(33,26,18,0.08)] border border-[rgba(33,26,18,0.08)] ring-1 ring-white/90">
          <h3 className="pb-3 text-[11px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
            Cold-Chain Dispatch Timeline
          </h3>
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3.5">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black',
                      step.done && !step.current && 'bg-[#0B3B25] text-white',
                      step.current && 'bg-[#7A3F1C] text-white shadow-sm ring-2 ring-[#7A3F1C]/20',
                      !step.done && !step.current && 'border border-[rgba(33,26,18,0.22)] bg-[#FAF9F6] text-[#5C5247]'
                    )}
                  >
                    {step.done && !step.current ? (
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    ) : step.current ? (
                      <Truck className="h-3.5 w-3.5 stroke-[2.5]" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={cn(
                        'h-6 w-0.5',
                        step.done ? 'bg-[#0B3B25]' : 'bg-[rgba(33,26,18,0.18)]'
                      )}
                    />
                  )}
                </div>
                <div className="flex flex-1 items-center justify-between pt-0.5">
                  <h4
                    className={cn(
                      'text-[14px] font-bold tracking-tight',
                      step.current ? 'text-[#7A3F1C]' : step.done ? 'text-[#211A12]' : 'text-[#5C5247]'
                    )}
                  >
                    {step.label}
                  </h4>
                  <span className="text-[12px] font-bold text-[#5C5247]">
                    {step.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Driver Card */}
        <div className="rounded-[28px] bg-[#FAF9F6] p-5 shadow-[0_2px_10px_-2px_rgba(33,26,18,0.05),0_8px_20px_-6px_rgba(33,26,18,0.08)] border border-[rgba(33,26,18,0.08)] ring-1 ring-white/90">
          <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
            Assigned Cold-Chain Driver
          </span>
          <div className="mt-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-white shadow-2xs border border-[rgba(33,26,18,0.10)]">
                <Image
                  src="/golden-acres/farmers/kwame-mensah.jpg"
                  alt="Ibrahim Salifu"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-[14px] font-extrabold tracking-tight text-[#211A12]">
                  Ibrahim Salifu
                </h4>
                <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-semibold text-[#5C5247]">
                  Refrigerated Van · GR 4821-22
                  <span className="flex items-center gap-0.5 text-[#7A3F1C] font-black">
                    <Star className="h-3 w-3 fill-[#7A3F1C]" /> 4.9
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="tel:0245550142"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(11,59,37,0.12)] text-[#0B3B25] active:scale-95 transition-transform"
                aria-label="Call Driver"
              >
                <Phone className="h-4 w-4" />
              </a>
              <a
                href="sms:0245550142"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#211A12] shadow-sm border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
                aria-label="Message Driver"
              >
                <MessageSquare className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Real Produce Package Summary with +40% Product Image Shell */}
        <div className="rounded-[28px] bg-[#FAF9F6] p-5 shadow-[0_2px_10px_-2px_rgba(33,26,18,0.05),0_8px_20px_-6px_rgba(33,26,18,0.08)] border border-[rgba(33,26,18,0.08)] ring-1 ring-white/90">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <ProductImageShell
                src="/golden-acres/produce/roma-tomatoes-1.png"
                alt="Roma Tomatoes"
              />
              <div>
                <span className="text-[11px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
                  Produce Box Details
                </span>
                <h4 className="mt-0.5 text-[15px] font-extrabold text-[#211A12]">
                  Roma Tomatoes (2kg) &amp; Plantain
                </h4>
                <p className="text-[12px] font-semibold text-[#5C5247]">
                  GH₵58.20 · Paid via MTN MoMo · 4.6 kg
                </p>
              </div>
            </div>
            <PackageBoxes3D size={64} />
          </div>
        </div>

        {/* Tip Driver Card */}
        <div className="rounded-[28px] bg-[#F7F5F0] p-5 shadow-[0_2px_10px_-2px_rgba(33,26,18,0.05),0_8px_20px_-6px_rgba(33,26,18,0.08)] border border-[rgba(33,26,18,0.09)] ring-1 ring-white/80">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-[13px] font-extrabold tracking-tight text-[#211A12]">
                Tip Ibrahim (Driver)
              </h4>
              <p className="mt-0.5 text-[11px] font-semibold text-[#5C5247]">
                100% of tips go directly to the cold-chain rider
              </p>
            </div>
            <button
              type="button"
              onClick={() => setTipped(!tipped)}
              className={cn(
                'rounded-xl px-4 py-2 text-[12px] font-black transition-all active:scale-95',
                tipped
                  ? 'bg-[#0B3B25] text-white shadow-sm'
                  : 'bg-white text-[#211A12] border border-[rgba(33,26,18,0.12)] hover:bg-[#FAF8F5]'
              )}
            >
              {tipped ? 'GH₵5.00 Tipped ✓' : '+ GH₵5.00'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
