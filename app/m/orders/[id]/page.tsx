'use client'

import { use, useState } from 'react'
import Link from 'next/link'
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
  Camera,
  Star,
} from 'lucide-react'
import { formatGHS } from '@/lib/golden-acres/format'

export default function MobileOrderTrackingScreen({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const orderId = resolvedParams.id || 'AG-12345678'

  const [rating, setRating] = useState(5)
  const [tipped, setTipped] = useState(false)

  const steps = [
    { label: 'Order Placed', time: '8:15 AM', done: true },
    { label: 'Harvest Packed', time: '9:30 AM', done: true },
    { label: 'Out for Delivery', time: '10:45 AM', done: true, current: true },
    { label: 'Delivered', time: 'Est. 11:30 AM', done: false },
  ]

  return (
    <div className="min-h-dvh bg-[#F4F1EA] pb-24 text-[#2B1F17]">
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
        <div className="flex flex-col">
          <h1 className="text-sm font-extrabold text-[#2B1F17]">
            Order Tracking
          </h1>
          <span className="text-[10px] text-[#6E6A63]">#{orderId}</span>
        </div>
      </header>

      <div className="px-4 py-4 space-y-4">
        {/* 1. Status Banner */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-[#E67A2E]">
            <Truck className="h-5 w-5 animate-bounce" />
            <span className="text-xs font-extrabold uppercase tracking-wider">
              Out for Delivery
            </span>
          </div>
          <h2 className="mt-1 text-lg font-extrabold text-[#2B1F17]">
            Arriving between 11:00 AM – 12:00 PM
          </h2>
          <p className="mt-0.5 text-xs text-[#6E6A63]">
            Your rider is on the way in a temperature-controlled cold vehicle.
          </p>

          {/* Stepper Progress */}
          <div className="mt-6 flex items-center justify-between relative">
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-[#E0DACB] -z-0" />
            <div className="absolute top-4 left-4 right-1/3 h-0.5 bg-[#1E5D3B] -z-0" />

            {steps.map((step, idx) => (
              <div key={step.label} className="relative z-10 flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    step.done
                      ? 'bg-[#1E5D3B] text-white'
                      : 'border-2 border-[#E0DACB] bg-white text-[#6E6A63]'
                  }`}
                >
                  {step.done ? (
                    <CheckCircle2 className="h-4 w-4 stroke-[3]" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <span className="mt-1.5 text-[10px] font-bold text-[#2B1F17]">
                  {step.label}
                </span>
                <span className="text-[9px] text-[#6E6A63]">{step.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Driver & Logistics Partner Card */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-[#E0DACB] bg-[#1E5D3B]/10">
                <Image
                  src="/golden-acres/hero-farmer.jpg"
                  alt="Driver Kofi Addo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-[#2B1F17]">Kofi Addo</h3>
                <p className="text-[10px] text-[#6E6A63]">AgriVil Logistics Partner</p>
                <div className="mt-0.5 flex items-center gap-1 text-[10px] text-[#8A6B3D] font-bold">
                  <Star className="h-3 w-3 fill-[#FBBF24] text-[#FBBF24]" />
                  <span>4.9 (142 deliveries)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="tel:+233241234567"
                className="ga-press flex h-10 w-10 items-center justify-center rounded-full bg-[#1E5D3B] text-white shadow-xs"
                title="Call rider"
              >
                <Phone className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/233241234567"
                target="_blank"
                rel="noopener noreferrer"
                className="ga-press flex h-10 w-10 items-center justify-center rounded-full border border-[#E0DACB] bg-white text-[#2B1F17]"
                title="WhatsApp rider"
              >
                <MessageSquare className="h-4 w-4 text-[#1E5D3B]" />
              </a>
            </div>
          </div>
        </div>

        {/* 3. Simulated Live Route Map */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#6E6A63]">
              Live Delivery Route
            </span>
            <span className="text-[10px] font-bold text-[#1E5D3B] flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#1E5D3B] animate-ping" />
              GPS Connected
            </span>
          </div>

          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#EBE6DA]">
            <Image
              src="/golden-acres/delivery.png"
              alt="Live route map"
              fill
              className="object-cover"
            />
            {/* Dynamic Rider Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 rounded-full bg-[#1E5D3B] px-3 py-1 text-[10px] font-extrabold text-white shadow-xl animate-pulse">
              <Truck className="h-3.5 w-3.5" />
              <span>Rider 4 mins away</span>
            </div>
          </div>
        </div>

        {/* 4. Proof of Delivery & Security Guarantee */}
        <div className="flex items-center gap-3 rounded-2xl bg-[#DDE4C5]/50 p-3.5 text-xs font-semibold text-[#144028]">
          <ShieldCheck className="h-5 w-5 shrink-0 text-[#1E5D3B]" />
          <span>
            Contactless delivery with geo-tagged Proof of Delivery (POD) photo capture upon handover.
          </span>
        </div>

        {/* 5. Help & Support Link */}
        <div className="pt-2 text-center">
          <Link
            href="/help"
            className="text-xs font-bold text-[#6E6A63] hover:text-[#1E5D3B]"
          >
            Need help with this delivery? Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
