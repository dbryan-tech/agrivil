'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Truck,
  Phone,
  MessageSquare,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Star,
  Check,
} from 'lucide-react'
import { formatGHS } from '@/lib/golden-acres/format'

export default function MobileOrderLiveTrackingScreen() {
  const router = useRouter()
  const [tipped, setTipped] = useState(false)
  const [rating, setRating] = useState(5)

  const steps = [
    { label: 'Harvested at Ejisu Farm', time: '5:30 AM', done: true },
    { label: 'Quality Checked & Scaled at Hub', time: '6:15 AM', done: true },
    { label: 'Out for Delivery with Rider', time: '6:45 AM', done: true, current: true },
    { label: 'Estimated Arrival (KNUST Campus)', time: '7:30 AM', done: false },
  ]

  return (
    <div className="min-h-dvh bg-[#FAF7F0] pb-24 text-[#2B1F17]">
      {/* Header */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between border-b border-[#E0DACB] bg-[#FAF7F0] px-3 sm:px-4 py-2.5"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 10px)' }}
      >
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-base font-extrabold text-[#2B1F17]">Live Order Tracking</h1>
            <p className="text-[10px] text-[#6E6A63]">Order #AGR-88412</p>
          </div>
        </div>
      </header>

      <div className="px-3 sm:px-4 pt-3.5 space-y-3.5">
        {/* Estimated Arrival Hero Card */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E6A63]">
              Status
            </span>
            <span className="rounded-full bg-[#0F7A43]/10 px-2.5 py-0.5 text-[10px] font-extrabold text-[#0F7A43]">
              En Route
            </span>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0F7A43]/10 text-[#0F7A43]">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-[#2B1F17]">
                Arriving at KNUST in 35 mins
              </h2>
              <p className="text-[10px] text-[#6E6A63]">Estimated delivery today at 7:30 AM</p>
            </div>
          </div>
        </div>

        {/* Live Radar Map Representation */}
        <div className="relative h-48 w-full overflow-hidden rounded-3xl bg-[#E7E2D5] border border-[#E0DACB]">
          <div className="absolute inset-0 bg-[radial-gradient(#D5CEBD_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />

          {/* Delivery Hub Dot */}
          <div className="absolute top-1/4 left-1/4 flex flex-col items-center">
            <span className="rounded-md bg-white/90 px-1.5 py-0.5 text-[8px] font-bold text-[#6E6A63] shadow-xs">
              Ejisu Hub
            </span>
            <div className="h-3 w-3 rounded-full bg-[#6E6A63] border border-white" />
          </div>

          {/* Active Courier Moving Dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <span className="rounded-md bg-[#0F7A43] px-2 py-0.5 text-[9px] font-extrabold text-white shadow-md flex items-center gap-1">
              <Truck className="h-3 w-3" /> Courier Kwame
            </span>
            <div className="mt-0.5 h-4 w-4 rounded-full border-2 border-white bg-[#0F7A43] animate-ping" />
          </div>

          {/* Destination Pin */}
          <div className="absolute bottom-1/4 right-1/4 flex flex-col items-center">
            <span className="rounded-md bg-[#7A3F1C] px-1.5 py-0.5 text-[8px] font-extrabold text-white shadow-xs">
              Your Hostel
            </span>
            <div className="h-3.5 w-3.5 rounded-full bg-[#7A3F1C] border border-white" />
          </div>
        </div>

        {/* Timeline Steps */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#6E6A63] pb-3">
            Harvest &amp; Dispatch Timeline
          </h3>

          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      step.done
                        ? 'bg-[#0F7A43] text-white'
                        : step.current
                        ? 'border-2 border-[#0F7A43] bg-white text-[#0F7A43]'
                        : 'bg-[#FAF7F0] text-[#6E6A63] border border-[#E0DACB]'
                    }`}
                  >
                    {step.done ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : idx + 1}
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`h-6 w-0.5 ${
                        step.done ? 'bg-[#0F7A43]' : 'bg-[#E0DACB]'
                      }`}
                    />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-xs font-bold ${
                        step.current ? 'text-[#0F7A43]' : 'text-[#2B1F17]'
                      }`}
                    >
                      {step.label}
                    </h4>
                    <span className="text-[10px] text-[#6E6A63]">{step.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Courier Contact Card */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E6A63]">
            Dispatch Courier
          </span>

          <div className="mt-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[#E0DACB] bg-[#FAF7F0]">
                <Image
                  src="/golden-acres/farmers/kwame-mensah.jpg"
                  alt="Kwame Courier"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#2B1F17]">Kwame Mensah</h4>
                <p className="text-[10px] text-[#6E6A63]">Agrivil Cold-Chain Rider · 4.9 ★</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="tel:0241234567"
                className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-[#0F7A43]/10 text-[#0F7A43]"
              >
                <Phone className="h-4 w-4" />
              </a>
              <a
                href="sms:0241234567"
                className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-[#FAF7F0] text-[#2B1F17] border border-[#E0DACB]"
              >
                <MessageSquare className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Courier Tip Action */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-extrabold text-[#2B1F17]">Tip your rider</h4>
              <p className="text-[10px] text-[#6E6A63]">100% of tips go directly to the rider</p>
            </div>
            <button
              type="button"
              onClick={() => setTipped(!tipped)}
              className={`ga-press rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                tipped
                  ? 'bg-[#0F7A43] text-white'
                  : 'border border-[#E0DACB] bg-[#FAF7F0] text-[#2B1F17]'
              }`}
            >
              {tipped ? 'GH₵5.00 Tipped' : '+ GH₵5.00'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
