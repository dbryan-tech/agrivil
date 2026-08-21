'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  Truck,
  Phone,
  MessageSquare,
  Check,
  Store,
  MapPin,
  Clock,
  ShieldCheck,
} from 'lucide-react'
import { formatGHS } from '@/lib/golden-acres/format'
import { cn } from '@/lib/utils'
import { PackageBoxes3D } from '@/app/preview/_lib/premium'

function TrackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('id') || 'AGR-88412'
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('agrivil_orders') || '[]')
        const found = stored.find((o: any) => o.id === orderId)
        if (found) {
          setOrder(found)
        }
      } catch (e) {
        console.error(e)
      }
    }
  }, [orderId])

  return (
    <div className="relative min-h-dvh w-full bg-[#EAE6DE] text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex flex-col justify-between">
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

      {/* ========================================================
          TOP HALF: VECTOR STREET MAP
         ======================================================== */}
      <div className="relative h-[48vh] min-h-[300px] w-full overflow-hidden bg-[#EAE6DE]">
        {/* Floating Top Navigation Header */}
        <header
          className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-3.5 pt-3"
          style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 12px)' }}
        >
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#211A12] shadow-sm border border-[rgba(33,26,18,0.06)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
          </button>

          <h1 className="text-[16px] font-black tracking-tight text-[#211A12]">
            Track Delivery
          </h1>

          <button
            type="button"
            onClick={() => router.push('/m/orders')}
            aria-label="All Orders"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#211A12] shadow-sm border border-[rgba(33,26,18,0.06)] active:scale-95 transition-transform"
          >
            <Store className="h-4 w-4" />
          </button>
        </header>

        {/* Vector Street Map SVG Graphics */}
        <svg
          className="absolute inset-0 h-full w-full object-cover"
          viewBox="0 0 600 480"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="600" height="480" fill="#EFEBE4" />
          
          <rect x="60" y="70" width="70" height="90" rx="4" fill="#E2DDD5" />
          <rect x="150" y="70" width="80" height="90" rx="4" fill="#E2DDD5" />
          <rect x="250" y="70" width="90" height="90" rx="4" fill="#E2DDD5" />
          <rect x="360" y="70" width="110" height="90" rx="4" fill="#E2DDD5" />

          <rect x="60" y="180" width="70" height="100" rx="4" fill="#E2DDD5" />
          <rect x="150" y="180" width="80" height="100" rx="4" fill="#E2DDD5" />
          <rect x="250" y="180" width="90" height="100" rx="4" fill="#E2DDD5" />
          <rect x="360" y="180" width="110" height="100" rx="4" fill="#E2DDD5" />

          <rect x="60" y="300" width="160" height="90" rx="4" fill="#E2DDD5" />
          <rect x="240" y="300" width="100" height="90" rx="4" fill="#E2DDD5" />

          {/* Road Network Grid */}
          <line x1="0" y1="50" x2="600" y2="50" stroke="#FFFFFF" strokeWidth="12" />
          <line x1="0" y1="170" x2="600" y2="170" stroke="#FFFFFF" strokeWidth="14" />
          <line x1="0" y1="290" x2="600" y2="290" stroke="#FFFFFF" strokeWidth="14" />
          <line x1="0" y1="400" x2="600" y2="400" stroke="#FFFFFF" strokeWidth="12" />

          <line x1="45" y1="0" x2="45" y2="480" stroke="#FFFFFF" strokeWidth="10" />
          <line x1="140" y1="0" x2="140" y2="480" stroke="#FFFFFF" strokeWidth="12" />
          <line x1="240" y1="0" x2="240" y2="480" stroke="#FFFFFF" strokeWidth="14" />
          <line x1="350" y1="0" x2="350" y2="480" stroke="#FFFFFF" strokeWidth="14" />
          <line x1="480" y1="0" x2="480" y2="480" stroke="#FFFFFF" strokeWidth="12" />

          {/* Real Dispatch Route Curve Line (Orange Glow Track) */}
          <path
            d="M140 380 L240 290 L240 170 L350 170 L480 230"
            stroke="#DF8821"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="8 6"
          />

          {/* Delivery Origin Marker Pin (Farm Hub) */}
          <circle cx="140" cy="380" r="10" fill="#0B3B25" />
          <circle cx="140" cy="380" r="5" fill="#FFFFFF" />

          {/* Live Rider Location Pin (Moving Truck) */}
          <circle cx="350" cy="170" r="14" fill="#DF8821" className="animate-ping opacity-75" />
          <circle cx="350" cy="170" r="12" fill="#DF8821" />
          <circle cx="350" cy="170" r="6" fill="#FFFFFF" />

          {/* Destination Marker Pin (Customer Address) */}
          <circle cx="480" cy="230" r="10" fill="#7A3F1C" />
          <circle cx="480" cy="230" r="5" fill="#FFFFFF" />
        </svg>

        {/* Live Delivery Floating Badge */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between rounded-2xl bg-white/95 px-3.5 py-2.5 shadow-md border border-[rgba(33,26,18,0.06)] backdrop-blur-xs">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0B3B25]/10 text-[#0B3B25]">
              <Truck className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="text-[13px] font-black text-[#211A12]">
                Kofi Mensah · AgriVil Courier
              </div>
              <div className="text-[10.5px] font-semibold text-[#5C5247]">
                Toyota Chilled Van (GW-4821-24)
              </div>
            </div>
          </div>
          <span className="rounded-full bg-[#0B3B25] px-2.5 py-0.5 text-[10px] font-black text-white">
            On Time
          </span>
        </div>
      </div>

      {/* ========================================================
          BOTTOM HALF: ORDER INFO DRAWER
         ======================================================== */}
      <div className="relative z-30 rounded-t-[32px] bg-white px-4 pt-3.5 pb-6 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] space-y-3">
        {/* Drawer Pull Handle */}
        <div className="mx-auto h-1 w-12 rounded-full bg-[#E5E0D8]" />

        {/* 1. Driver Profile Row */}
        <div className="flex items-center justify-between pb-2 border-b border-[rgba(33,26,18,0.06)]">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-[#0B3B25]/20 bg-[#F7F5F0]">
              <Image
                src="/golden-acres/farmers/kojo-asante.jpg"
                alt="Courier"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold text-[#5C5247]">Express Dispatch</span>
                <span className="flex items-center text-[10.5px] font-black text-[#F0A81E]">
                  ★ 4.9
                </span>
              </div>
              <h2 className="text-[15px] font-black tracking-tight text-[#211A12]">
                Kofi Mensah
              </h2>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <a
              href="tel:0245550142"
              aria-label="Call Courier"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#211A12] text-white shadow-xs active:scale-90 transition-transform"
            >
              <Phone className="h-4 w-4" />
            </a>
            <a
              href="sms:0245550142"
              aria-label="Message Courier"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#211A12] text-white shadow-xs active:scale-90 transition-transform"
            >
              <MessageSquare className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* 2. In-Transit Status Banner Pill */}
        <div className="flex items-center justify-between rounded-2xl bg-[#FFF5ED] border border-[#FDE6D2] px-3.5 py-2.5">
          <div className="flex items-center gap-2 text-[12px] font-bold text-[#E86328]">
            <span className="h-2 w-2 rounded-full bg-[#E86328] animate-pulse" />
            <span>In transit - arriving in 35 mins</span>
          </div>
          <span className="text-[12px] font-black text-[#E86328]">
            Cold-Chain Active
          </span>
        </div>

        {/* 3. Booking Details Row */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8A7E72]">
              Order ID
            </span>
            <h3 className="text-[18px] font-black tracking-tight text-[#211A12]">
              {order?.id || orderId}
            </h3>
          </div>

          <span className="rounded-full bg-[#0B3B25] px-3 py-1 text-[11px] font-black text-white shadow-xs">
            {order?.status || 'In Transit'}
          </span>
        </div>

        {/* 4. Origin / Destination Route Info */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[rgba(33,26,18,0.06)]">
          <div className="space-y-0.5">
            <span className="text-[9.5px] font-black uppercase tracking-wider text-[#8A7E72]">
              From (Pack Hub)
            </span>
            <p className="text-[12px] font-extrabold text-[#211A12] truncate">
              {order?.from || 'Ejisu Aggregation Center, Ashanti'}
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9.5px] font-black uppercase tracking-wider text-[#8A7E72]">
              To (Delivery Address)
            </span>
            <p className="text-[12px] font-extrabold text-[#211A12] truncate">
              {order?.to || 'East Legon, Accra (GA-183-4250)'}
            </p>
          </div>
        </div>

        {/* 5. Produce Basket Items */}
        <div className="rounded-2xl bg-[#F7F5F0] p-3 space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#5C5247]">
            Items in this delivery
          </span>
          <p className="text-[12.5px] font-black text-[#211A12]">
            {order?.title || 'Organic Roma Tomatoes, Scotch Bonnet & Yam Tuber'}
          </p>
          {order?.totalGHS && (
            <p className="text-[11px] font-bold text-[#0B3B25]">
              Total Paid: {formatGHS(order.totalGHS)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MobileOrderLiveTrackingScreen() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[#EAE6DE]" />}>
      <TrackContent />
    </Suspense>
  )
}
