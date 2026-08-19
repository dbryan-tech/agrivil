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
  Clock,
  MapPin,
  ShieldCheck,
  Star,
  Check,
} from 'lucide-react'
import { formatGHS } from '@/lib/golden-acres/format'
import { cn } from '@/lib/utils'
import { PackageBoxes3D, ProductImageShell } from '@/app/preview/_lib/premium'

export default function MobileOrderTrackingScreen() {
  const params = useParams<{ id: string }>()
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id || 'GA-24817'
  const router = useRouter()
  const orderId = rawId || 'GA-24817'

  const steps = [
    { label: 'Harvested at Farm', time: '6:40 AM', done: true },
    { label: 'FEFO Checked & Packed Cold', time: '9:10 AM', done: true },
    { label: 'Dispatched with Driver', time: '1:20 PM', done: true, current: true },
    { label: 'Estimated Delivery', time: '4:00 PM', done: false },
  ]

  return (
    <div className="relative min-h-dvh bg-[#F7F5F0] pb-24 text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Header */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between border-b border-[rgba(33,26,18,0.08)] bg-[#F7F5F0]/90 px-5 py-3 backdrop-blur-md"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 12px)' }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-[17px] font-extrabold text-[#211A12]">Order Details</h1>
            <p className="text-[11px] font-bold text-[#5C5247]">#{orderId}</p>
          </div>
        </div>
        <Link
          href="/m/orders/track"
          className="rounded-full bg-[#7A3F1C]/10 px-3 py-1 text-[11px] font-black text-[#7A3F1C]"
        >
          Live Map →
        </Link>
      </header>

      <div className="relative px-5 pt-4 space-y-4">
        {/* Status Card */}
        <div className="rounded-[28px] bg-[#FDFDFB] p-5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#7A3F1C]/10 text-[#7A3F1C]">
              <Truck className="h-6 w-6 stroke-[2.4]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-black uppercase tracking-[0.14em] text-[#7A3F1C]">
                In Transit · Cold-Chain Active
              </span>
              <h2 className="text-[17px] font-extrabold leading-tight text-[#211A12]">
                Arriving Today by 4:00 PM
              </h2>
              <p className="mt-0.5 text-[12px] font-semibold text-[#5C5247]">
                Refrigerated Van · East Legon Gate
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="rounded-[28px] bg-[#FDFDFB] p-5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <h3 className="pb-3 text-[11px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
            Progress Timeline
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
                      !step.done && !step.current && 'border border-[rgba(33,26,18,0.18)] bg-[#FDFDFB] text-[#5C5247]'
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
                  <span className="text-[12px] font-bold text-[#5C5247]">{step.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ordered Items Summary */}
        <div className="rounded-[28px] bg-[#FDFDFB] p-5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[rgba(33,26,18,0.06)]">
            <h3 className="text-[11px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
              Items in this Order
            </h3>
            <PackageBoxes3D size={48} />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <ProductImageShell
                src="/golden-acres/produce/roma-tomatoes-1.png"
                alt="Roma Tomatoes"
                className="h-12 w-12 rounded-xl"
              />
              <div>
                <h4 className="text-[13.5px] font-extrabold text-[#211A12]">Roma Tomatoes</h4>
                <p className="text-[11px] font-semibold text-[#5C5247]">1.0 kg · Auntie Ama</p>
              </div>
            </div>
            <span className="font-extrabold text-[13px] text-[#0B3B25]">{formatGHS(12.0)}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <ProductImageShell
                src="/golden-acres/produce/white-yam.png"
                alt="White Yam"
                className="h-12 w-12 rounded-xl"
              />
              <div>
                <h4 className="text-[13.5px] font-extrabold text-[#211A12]">White Yam</h4>
                <p className="text-[11px] font-semibold text-[#5C5247]">2.0 kg est · Kwame Mensah</p>
              </div>
            </div>
            <span className="font-extrabold text-[13px] text-[#0B3B25]">{formatGHS(20.0)}</span>
          </div>

          <div className="flex items-center justify-between border-t border-[rgba(33,26,18,0.08)] pt-2.5 text-[15px] font-black text-[#211A12]">
            <span>Total Paid</span>
            <span className="text-[#0B3B25]">{formatGHS(39.0)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

