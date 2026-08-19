'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { formatGHS } from '@/lib/golden-acres/format'
import { cn } from '@/lib/utils'
import { ProductImageShell, PackageBoxes3D } from '@/app/preview/_lib/premium'

type CartItem = {
  id: string
  name: string
  farmer: string
  unit: string
  price: number
  qty: number
  image: string
}

export default function MobileCartScreen() {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: 'p1',
      name: 'Fresh Roma Tomatoes',
      farmer: "Auntie Ama's Garden",
      unit: '1 kg',
      price: 12.0,
      qty: 2,
      image: '/golden-acres/produce/roma-tomatoes-1.png',
    },
    {
      id: 'p4',
      name: 'Shade-Cured Ripe Plantain',
      farmer: 'Kwame Mensah Farm',
      unit: '1 bunch',
      price: 18.0,
      qty: 1,
      image: '/golden-acres/produce/ripe-plantain-1.png',
    },
    {
      id: 'p2',
      name: 'Techiman Red Onions',
      farmer: 'Adwoa Sarpong Farm',
      unit: '1 kg net',
      price: 10.0,
      qty: 1,
      image: '/golden-acres/produce/red-onions-1.png',
    },
  ])

  const [deliverySlot, setDeliverySlot] = useState('today-pm')

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const next = item.qty + delta
            return next > 0 ? { ...item, qty: next } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    )
  }

  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0)
  const deliveryFee = 15.0
  const discount = 5.0
  const total = subtotal + deliveryFee - discount

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

      {/* Header Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[rgba(33,26,18,0.08)] bg-[#F7F5F0]/90 px-5 py-3 backdrop-blur-md">
        <Link
          href="/preview/home"
          aria-label="Back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#211A12] shadow-[0_1px_4px_rgba(33,26,18,0.06)] border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-[17px] font-extrabold tracking-tight text-[#211A12]">
            My Farm Basket
          </h1>
          <p className="text-[11px] font-bold text-[#5C5247] text-center">
            {items.length} items from 3 Ghanaian farms
          </p>
        </div>
        <div className="w-10" />
      </header>

      <div className="relative px-5 pt-3 space-y-4">
        {/* Delivery Address Pill */}
        <div className="flex items-center justify-between rounded-2xl bg-white/80 p-3 shadow-2xs border border-[rgba(33,26,18,0.08)]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0B3B25]/10 text-[#0B3B25]">
              <MapPin className="h-4 w-4 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#5C5247]">
                Delivering to
              </span>
              <p className="text-[13px] font-extrabold text-[#211A12]">
                KNUST Campus, Kumasi (GA-183-4250)
              </p>
            </div>
          </div>
          <button
            type="button"
            className="text-[11px] font-bold text-[#7A3F1C] hover:underline"
          >
            Change
          </button>
        </div>

        {/* Cart Items List */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative flex items-center justify-between overflow-hidden rounded-[24px] bg-[#FAF9F6] p-4 shadow-[0_2px_10px_-2px_rgba(33,26,18,0.05),0_8px_20px_-6px_rgba(33,26,18,0.08)] border border-[rgba(33,26,18,0.08)] ring-1 ring-white/90"
            >
              <div className="flex items-center gap-3.5 flex-1 pr-2">
                <ProductImageShell src={item.image} alt={item.name} />
                <div className="min-w-0 flex-1">
                  <h4 className="text-[14px] font-extrabold text-[#211A12] truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] font-bold text-[#7A3F1C]">
                    {item.farmer}
                  </p>
                  <p className="text-[11px] font-semibold text-[#5C5247]">
                    {item.unit} · {formatGHS(item.price)} each
                  </p>
                  <p className="mt-1 text-[13px] font-black text-[#0B3B25]">
                    {formatGHS(item.price * item.qty)}
                  </p>
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-2 rounded-full bg-white px-2.5 py-1 shadow-2xs border border-[rgba(33,26,18,0.10)]">
                <button
                  type="button"
                  onClick={() => updateQty(item.id, -1)}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FAF9F6] text-[#211A12] active:scale-90"
                >
                  {item.qty === 1 ? (
                    <Trash2 className="h-3 w-3 text-[#7A3F1C]" />
                  ) : (
                    <Minus className="h-3 w-3" />
                  )}
                </button>
                <span className="min-w-4 text-center text-[12px] font-black text-[#211A12]">
                  {item.qty}
                </span>
                <button
                  type="button"
                  onClick={() => updateQty(item.id, 1)}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FAF9F6] text-[#211A12] active:scale-90"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cold-Chain Guarantee Card */}
        <div className="rounded-[28px] bg-[#FAF9F6] p-4 shadow-[0_2px_10px_-2px_rgba(33,26,18,0.05),0_8px_20px_-6px_rgba(33,26,18,0.08)] border border-[rgba(33,26,18,0.08)] ring-1 ring-white/90">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0B3B25]/10 text-[#0B3B25]">
              <Truck className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-[13px] font-extrabold text-[#211A12]">
                Insulated Cold-Chain Packaging
              </h4>
              <p className="text-[11px] font-semibold text-[#5C5247]">
                Produce packed with reusable gel ice packs. Delivered at &lt; 8°C.
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Slot Selector */}
        <div className="rounded-[28px] bg-[#FAF9F6] p-5 shadow-[0_2px_10px_-2px_rgba(33,26,18,0.05),0_8px_20px_-6px_rgba(33,26,18,0.08)] border border-[rgba(33,26,18,0.08)] ring-1 ring-white/90">
          <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
            Select Delivery Window
          </span>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setDeliverySlot('today-pm')}
              className={cn(
                'rounded-2xl p-3 text-left transition-all border',
                deliverySlot === 'today-pm'
                  ? 'bg-[#211A12] text-white border-[#211A12] shadow-sm'
                  : 'bg-white text-[#211A12] border-[rgba(33,26,18,0.10)]'
              )}
            >
              <p className="text-[12px] font-extrabold">Today Afternoon</p>
              <p
                className={cn(
                  'text-[11px] mt-0.5',
                  deliverySlot === 'today-pm' ? 'text-white/80' : 'text-[#5C5247]'
                )}
              >
                2:00 PM – 5:00 PM
              </p>
            </button>

            <button
              type="button"
              onClick={() => setDeliverySlot('tomorrow-am')}
              className={cn(
                'rounded-2xl p-3 text-left transition-all border',
                deliverySlot === 'tomorrow-am'
                  ? 'bg-[#211A12] text-white border-[#211A12] shadow-sm'
                  : 'bg-white text-[#211A12] border-[rgba(33,26,18,0.10)]'
              )}
            >
              <p className="text-[12px] font-extrabold">Tomorrow Dawn</p>
              <p
                className={cn(
                  'text-[11px] mt-0.5',
                  deliverySlot === 'tomorrow-am' ? 'text-white/80' : 'text-[#5C5247]'
                )}
              >
                8:00 AM – 11:00 AM
              </p>
            </button>
          </div>
        </div>

        {/* Price Breakdown Summary */}
        <div className="rounded-[28px] bg-[#FAF9F6] p-5 shadow-[0_2px_10px_-2px_rgba(33,26,18,0.05),0_8px_20px_-6px_rgba(33,26,18,0.08)] border border-[rgba(33,26,18,0.08)] ring-1 ring-white/90 space-y-2">
          <div className="flex justify-between text-[13px] font-semibold text-[#5C5247]">
            <span>Produce Subtotal</span>
            <span className="font-extrabold text-[#211A12]">{formatGHS(subtotal)}</span>
          </div>
          <div className="flex justify-between text-[13px] font-semibold text-[#5C5247]">
            <span>Cold-Chain Delivery</span>
            <span className="font-extrabold text-[#211A12]">{formatGHS(deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-[13px] font-semibold text-[#0B3B25]">
            <span>Direct Farm Promo Discount</span>
            <span className="font-extrabold">-{formatGHS(discount)}</span>
          </div>
          <div className="flex justify-between text-[16px] font-black text-[#211A12] pt-2 border-t border-[rgba(33,26,18,0.08)]">
            <span>Total to Pay</span>
            <span className="text-[#0B3B25] text-[18px]">{formatGHS(total)}</span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Checkout Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[rgba(33,26,18,0.08)] bg-[#F7F5F0]/95 px-5 pt-3 pb-[clamp(18px,2.8vh,24px)] backdrop-blur-md shadow-[0_-4px_20px_rgba(33,26,18,0.04)]">
        <Link
          href="/preview/checkout"
          className="flex w-full items-center justify-between rounded-full bg-[#0B3B25] px-6 py-3.5 text-white shadow-md active:scale-[0.98] transition-transform"
        >
          <div className="text-left">
            <span className="text-[10px] font-black uppercase tracking-wider text-white/80">
              Total ({items.length} items)
            </span>
            <p className="text-[16px] font-black leading-none">{formatGHS(total)}</p>
          </div>
          <div className="flex items-center gap-1.5 text-[14px] font-black">
            <span>Proceed to Checkout</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </Link>
      </div>
    </div>
  )
}
