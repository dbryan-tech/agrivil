'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, Truck, Clock, ArrowRight, ShieldCheck, MapPin } from 'lucide-react'
import { formatGHS } from '@/lib/golden-acres/format'

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref') || 'AGR-88412'
  const [lastOrder, setLastOrder] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('agrivil_last_order') || 'null')
        if (stored) {
          setLastOrder(stored)
        }
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  const timeline = [
    { label: 'Harvested at Ejisu Farm', time: '5:30 AM', done: true },
    { label: 'Quality Checked & Scaled at Hub', time: '6:15 AM', done: true },
    { label: 'Out for Delivery with Rider', time: '6:45 AM', active: true },
    { label: 'Estimated Arrival (Doorstep)', time: '7:30 AM', pending: true },
  ]

  return (
    <div className="relative min-h-dvh bg-[#F7F5F0] px-3 py-4 text-[#211A12] pb-10 flex flex-col justify-between select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Top warm brand gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(240px,40vh,360px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.14) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      <div className="relative space-y-3">
        {/* Giant Green Checkmark Animation */}
        <div className="mt-4 flex flex-col items-center justify-center text-center px-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0B3B25] text-white shadow-lg animate-bounce">
            <Check className="h-8 w-8 stroke-[3]" />
          </div>

          <h1 className="mt-3 text-[24px] font-black text-[#211A12]">
            Order Confirmed!
          </h1>
          <p className="text-[11.5px] font-semibold text-[#5C5247]">
            Order Ref: <strong className="text-[#211A12]">#{ref}</strong>
          </p>
        </div>

        {/* Estimated Arrival Banner */}
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0B3B25]/10 text-[#0B3B25]">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[9.5px] font-black uppercase tracking-wider text-[#5C5247]">
                Estimated Delivery
              </span>
              <h2 className="text-[13.5px] font-black text-[#0B3B25]">Today (Arriving in ~35 mins)</h2>
            </div>
          </div>
        </div>

        {/* Order Details Preview */}
        {lastOrder && (
          <div className="rounded-[24px] bg-white p-3.5 shadow-2xs border border-[rgba(33,26,18,0.06)] space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#5C5247]">
              Order Contents
            </span>
            <p className="text-[12.5px] font-black text-[#211A12] line-clamp-2">
              {lastOrder.title}
            </p>
            {lastOrder.totalGHS && (
              <p className="text-[11.5px] font-extrabold text-[#0B3B25]">
                Total: {formatGHS(lastOrder.totalGHS)}
              </p>
            )}
          </div>
        )}

        {/* Live Timeline Tracking */}
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <h3 className="text-[10px] font-black uppercase tracking-[0.14em] text-[#5C5247] pb-2.5 border-b border-[rgba(33,26,18,0.06)]">
            Farm-to-Door Progress
          </h3>

          <div className="mt-3 space-y-3">
            {timeline.map((step, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black ${
                      step.done
                        ? 'bg-[#0B3B25] text-white'
                        : step.active
                        ? 'border-2 border-[#0B3B25] bg-white text-[#0B3B25] animate-pulse'
                        : 'bg-[#F7F5F0] text-[#5C5247] border border-[rgba(33,26,18,0.10)]'
                    }`}
                  >
                    {step.done ? <Check className="h-3 w-3 stroke-[3]" /> : i + 1}
                  </div>
                  {i < timeline.length - 1 && (
                    <div
                      className={`h-5 w-0.5 ${
                        step.done ? 'bg-[#0B3B25]' : 'bg-[rgba(33,26,18,0.10)]'
                      }`}
                    />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-[12px] font-extrabold ${
                        step.active ? 'text-[#0B3B25]' : 'text-[#211A12]'
                      }`}
                    >
                      {step.label}
                    </h4>
                    <span className="text-[10px] font-semibold text-[#5C5247]">{step.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative space-y-2 pt-4">
        <button
          type="button"
          onClick={() => router.push(`/m/orders/track?id=${encodeURIComponent(ref)}`)}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0B3B25] text-[13.5px] font-extrabold text-white shadow-md active:scale-[0.98] transition-transform"
        >
          <Truck className="h-4 w-4" /> Track Rider Live on Map
        </button>

        <button
          type="button"
          onClick={() => router.push('/m/orders')}
          className="flex h-11 w-full items-center justify-center rounded-full border border-[rgba(33,26,18,0.12)] bg-white text-[12px] font-extrabold text-[#211A12] shadow-2xs active:scale-[0.98] transition-transform"
        >
          View All Orders
        </button>
      </div>
    </div>
  )
}

export default function MobileOrderSuccessScreen() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[#F7F5F0]" />}>
      <SuccessContent />
    </Suspense>
  )
}
