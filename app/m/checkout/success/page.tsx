'use client'

import { useRouter } from 'next/navigation'
import { Check, Truck, MapPin, Clock, ArrowRight, ShieldCheck } from 'lucide-react'

export default function MobileOrderSuccessScreen() {
  const router = useRouter()

  const timeline = [
    { label: 'Harvested at Ejisu Farm', time: '5:30 AM', done: true },
    { label: 'Quality Checked & Scaled at Hub', time: '6:15 AM', done: true },
    { label: 'Out for Delivery with Rider', time: '6:45 AM', active: true },
    { label: 'Estimated Arrival (KNUST Campus)', time: '7:30 AM', pending: true },
  ]

  return (
    <div className="min-h-dvh bg-[#FAF7F0] p-4 text-[#2B1F17] pb-12 flex flex-col justify-between">
      <div>
        {/* Giant Green Checkmark Animation */}
        <div className="mt-6 flex flex-col items-center justify-center text-center px-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0F7A43] text-white shadow-lg animate-bounce">
            <Check className="h-10 w-10 stroke-[3]" />
          </div>

          <h1 className="ga-headline mt-4 text-2xl font-extrabold text-[#2B1F17]">
            Order Confirmed!
          </h1>
          <p className="text-xs text-[#6E6A63]">
            Order Ref: <strong className="text-[#2B1F17]">#AGR-88412</strong>
          </p>
        </div>

        {/* Estimated Arrival Banner */}
        <div className="mt-6 flex items-center justify-between rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0F7A43]/10 text-[#0F7A43]">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E6A63]">
                Estimated Delivery
              </span>
              <h2 className="text-sm font-extrabold text-[#0F7A43]">Today, 7:30 AM (in 35 mins)</h2>
            </div>
          </div>
        </div>

        {/* Live Timeline Tracking */}
        <div className="mt-4 rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#6E6A63] pb-3">
            Farm-to-Door Progress
          </h3>

          <div className="space-y-4">
            {timeline.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      step.done
                        ? 'bg-[#0F7A43] text-white'
                        : step.active
                        ? 'border-2 border-[#0F7A43] bg-white text-[#0F7A43] animate-pulse'
                        : 'bg-[#FAF7F0] text-[#6E6A63] border border-[#E0DACB]'
                    }`}
                  >
                    {step.done ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : i + 1}
                  </div>
                  {i < timeline.length - 1 && (
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
                        step.active ? 'text-[#0F7A43]' : 'text-[#2B1F17]'
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
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-6">
        <button
          type="button"
          onClick={() => router.push('/m/orders/track')}
          className="ga-press flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#0F7A43] text-sm font-bold text-white shadow-md hover:bg-[#0B3B25]"
        >
          <Truck className="h-4 w-4" /> Track Rider Live on Map
        </button>

        <button
          type="button"
          onClick={() => router.push('/m')}
          className="ga-press flex h-12 w-full items-center justify-center rounded-2xl border border-[#E0DACB] bg-white text-xs font-bold text-[#2B1F17] shadow-xs"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}
