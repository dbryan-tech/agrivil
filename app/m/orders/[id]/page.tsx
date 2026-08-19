'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
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
  Check,
} from 'lucide-react'
import { formatGHS } from '@/lib/golden-acres/format'

export default function MobileOrderTrackingScreen() {
  const params = useParams<{ id: string }>()
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id || 'AG-12345678'
  const router = useRouter()
  const orderId = rawId || 'AG-12345678'

  const [rating, setRating] = useState(5)
  const [tipped, setTipped] = useState(false)

  const steps = [
    { label: 'Order Placed', time: '8:15 AM', done: true },
    { label: 'Harvest Packed', time: '9:30 AM', done: true },
    { label: 'Out for Delivery', time: '10:45 AM', done: true, current: true },
    { label: 'Delivered', time: 'Est. 11:30 AM', done: false },
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
            <h1 className="text-base font-extrabold text-[#2B1F17]">Order Details</h1>
            <p className="text-[10px] text-[#6E6A63]">#{orderId}</p>
          </div>
        </div>
      </header>

      <div className="px-3 sm:px-4 pt-3.5 space-y-3.5">
        {/* Status Card */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E6A63]">
              Estimated Delivery
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
                Arriving in 35 mins
              </h2>
              <p className="text-[10px] text-[#6E6A63]">Courier on the way to KNUST</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#6E6A63] pb-3">
            Progress
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

        {/* Ordered Items Summary */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs space-y-2 text-xs">
          <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E6A63]">
            Items in this Order
          </h3>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[#2B1F17] font-semibold">Fresh Roma Tomatoes (1.0 kg)</span>
            <span className="font-bold text-[#0F7A43]">{formatGHS(12.0)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#2B1F17] font-semibold">White Yam (2.0 kg est)</span>
            <span className="font-bold text-[#0F7A43]">{formatGHS(20.0)}</span>
          </div>

          <div className="flex items-center justify-between border-t border-[#E0DACB]/60 pt-2 text-sm font-extrabold text-[#2B1F17]">
            <span>Total Paid</span>
            <span className="text-[#0F7A43]">{formatGHS(39.0)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
