'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
  const [tipped, setTipped] = useState(false)

  // Real AgriVil 3PL Cold-Chain Timeline Events
  const steps = [
    { label: 'Harvested at Koforidua Farm (Auntie Ama)', time: '6:40 AM', done: true },
    { label: 'FEFO Quality Check & Packed with Ice Packs', time: '9:10 AM', done: true },
    { label: 'Dispatched with Ibrahim Salifu (Van GR 4821-22)', time: '1:20 PM', done: true, current: true },
    { label: 'Estimated Delivery at East Legon (GA-183-4250)', time: '4:00 PM', done: false },
  ]

  return (
    <div className="relative min-h-dvh bg-[#F7F5F0] pb-24 text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.15) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      {/* Header */}
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
              Live Tracking
            </h1>
            <p className="text-[11px] font-bold text-[#5C5247]">
              Order ID: GA-24817 (SWFT-7781294)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-[#7A3F1C]/10 px-2.5 py-0.5 text-[10px] font-black text-[#7A3F1C]">
          <span className="h-2 w-2 rounded-full bg-[#7A3F1C] animate-pulse" />
          IN TRANSIT
        </div>
      </header>

      <div className="relative px-3 pt-2.5 space-y-2.5">
        {/* Estimated Arrival Hero */}
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#7A3F1C]/10 text-[#7A3F1C]">
              <Truck className="h-5 w-5 stroke-[2.4]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#7A3F1C]">
                4 Hours Away · Cold-Chain Active
              </span>
              <h2 className="text-[16px] font-black leading-tight tracking-tight text-[#211A12]">
                Arriving Today by 4:00 PM
              </h2>
              <p className="mt-0.5 text-[11.5px] font-semibold text-[#5C5247]">
                East Legon, GA-183-4250 (3 stops ahead)
              </p>
            </div>
          </div>
        </div>

        {/* Visual GPS Route Representation */}
        <div className="relative h-48 w-full overflow-hidden rounded-[24px] bg-[#EAE5DC] shadow-[0_4px_16px_-4px_rgba(33,26,18,0.08)]">
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
            <span className="rounded-md bg-white/95 px-2 py-0.5 text-[9px] font-black text-[#3D332A] shadow-sm">
              Tema Hub
            </span>
            <div className="mt-1 h-3 w-3 rounded-full bg-[#5C5247] ring-4 ring-white shadow-sm" />
          </div>

          {/* Active Courier Delivery Marker */}
          <div className="absolute top-[48%] left-[50%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center z-10">
            <span className="flex items-center gap-1 rounded-full bg-[#7A3F1C] px-2.5 py-0.5 text-[9px] font-black text-white shadow-md">
              <Truck className="h-3 w-3 stroke-[2.5]" /> Driver Ibrahim (Van)
            </span>
            <div className="relative mt-1">
              <span className="absolute -inset-1 rounded-full bg-[#7A3F1C]/40 animate-ping" />
              <div className="relative h-3.5 w-3.5 rounded-full border-2 border-white bg-[#7A3F1C] shadow-sm" />
            </div>
          </div>

          {/* Destination: East Legon */}
          <div className="absolute bottom-[18%] right-[12%] flex flex-col items-center">
            <span className="rounded-md bg-[#0B3B25] px-2 py-0.5 text-[9px] font-black text-white shadow-md">
              East Legon (GA-183)
            </span>
            <div className="mt-1 h-3.5 w-3.5 rounded-full bg-[#0B3B25] ring-4 ring-white shadow-sm" />
          </div>
        </div>

        {/* Step-by-Step Delivery Timeline */}
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <h3 className="pb-2.5 text-[10.5px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
            Cold-Chain Dispatch Timeline
          </h3>
          <div className="space-y-3">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black',
                      step.done && !step.current && 'bg-[#0B3B25] text-white',
                      step.current && 'bg-[#7A3F1C] text-white shadow-sm ring-2 ring-[#7A3F1C]/20',
                      !step.done && !step.current && 'border border-[rgba(33,26,18,0.18)] bg-[#FDFDFB] text-[#5C5247]'
                    )}
                  >
                    {step.done && !step.current ? (
                      <Check className="h-3 w-3 stroke-[3]" />
                    ) : step.current ? (
                      <Truck className="h-3 w-3 stroke-[2.5]" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={cn(
                        'h-5 w-0.5',
                        step.done ? 'bg-[#0B3B25]' : 'bg-[rgba(33,26,18,0.18)]'
                      )}
                    />
                  )}
                </div>
                <div className="flex flex-1 items-center justify-between pt-0.5">
                  <h4
                    className={cn(
                      'text-[13px] font-bold tracking-tight',
                      step.current ? 'text-[#7A3F1C]' : step.done ? 'text-[#211A12]' : 'text-[#5C5247]'
                    )}
                  >
                    {step.label}
                  </h4>
                  <span className="text-[11px] font-bold text-[#5C5247]">
                    {step.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Driver Card */}
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <span className="text-[9.5px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
            Assigned Cold-Chain Driver
          </span>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl bg-white shadow-2xs">
                <Image
                  src="/golden-acres/farmers/kwame-mensah.jpg"
                  alt="Ibrahim Salifu"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-[13.5px] font-extrabold tracking-tight text-[#211A12]">
                  Ibrahim Salifu
                </h4>
                <p className="mt-0.5 flex items-center gap-1.5 text-[10.5px] font-semibold text-[#5C5247]">
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
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(11,59,37,0.12)] text-[#0B3B25] active:scale-95 transition-transform"
                aria-label="Call Driver"
              >
                <Phone className="h-4 w-4" />
              </a>
              <a
                href="sms:0245550142"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#211A12] shadow-sm active:scale-95 transition-transform"
                aria-label="Message Driver"
              >
                <MessageSquare className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Real Produce Package Summary with Product Image Shell */}
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ProductImageShell
                src="/golden-acres/produce/roma-tomatoes-1.png"
                alt="Roma Tomatoes"
              />
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
                  Produce Box Details
                </span>
                <h4 className="text-[14px] font-extrabold text-[#211A12]">
                  Fresh Farm Box (4.2 kg)
                </h4>
                <p className="text-[11.5px] font-semibold text-[#7A3F1C]">
                  3 items · Insulated packaging
                </p>
              </div>
            </div>
            <PackageBoxes3D size={58} />
          </div>
        </div>

        {/* Support & Rider Tip */}
        <div className="flex items-center justify-between gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => setTipped(!tipped)}
            className={cn(
              'flex-1 rounded-full py-2.5 text-center text-[12px] font-extrabold transition-all shadow-2xs active:scale-95',
              tipped
                ? 'bg-[#0B3B25] text-white'
                : 'bg-white text-[#211A12]'
            )}
          >
            {tipped ? '✓ GH₵5 Tip Added' : '+ GH₵5 Rider Tip'}
          </button>
          <a
            href="tel:0302000000"
            className="rounded-full bg-white px-4 py-2.5 text-[12px] font-extrabold text-[#5C5247] shadow-2xs active:scale-95 transition-transform"
          >
            Need Help?
          </a>
        </div>
      </div>
    </div>
  )
}
