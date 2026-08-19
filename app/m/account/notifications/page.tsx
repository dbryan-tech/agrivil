'use client'

import Link from 'next/link'
import { ArrowLeft, Bell, CheckCircle2, Truck, CreditCard, Sparkles } from 'lucide-react'
import { MobileAppBar } from '@/components/golden-acres/mobile/mobile-app-bar'

export default function MobileNotificationsScreen() {
  const notifications = [
    {
      id: '1',
      title: 'Your order #AG-88412 is out for delivery',
      desc: 'Courier Kwame Mensah is en route in an insulated cold-chain van.',
      time: '2 mins ago',
      icon: Truck,
      color: 'text-[#0F7A43] bg-[#0F7A43]/10',
      href: '/m/orders/track',
    },
    {
      id: '2',
      title: 'Payment of GH₵38.50 successful',
      desc: 'MTN Mobile Money payment confirmed for order #AG-12345610.',
      time: '2 days ago',
      icon: CreditCard,
      color: 'text-[#0F7A43] bg-[#0F7A43]/10',
      href: '/m/orders/AG-12345610',
    },
    {
      id: '3',
      title: 'Fresh harvest from Adwoa Sarpomaa Farms',
      desc: 'New Roma tomatoes and garden eggs picked this morning at dawn.',
      time: '3 days ago',
      icon: Sparkles,
      color: 'text-[#7A3F1C] bg-[#7A3F1C]/10',
      href: '/m/farmers/adwoa-sarpong',
    },
    {
      id: '4',
      title: 'Weekly Harvest Box Reminder',
      desc: 'Your Friday staples crate will dispatch at 7:00 AM.',
      time: '4 days ago',
      icon: CheckCircle2,
      color: 'text-[#0F7A43] bg-[#0F7A43]/10',
      href: '/m/bundles',
    },
  ]

  return (
    <div className="min-h-dvh bg-[#FAF7F0] pb-12 text-[#2B1F17]">
      <MobileAppBar title="Notifications" showBack showCart={false} />

      <div className="px-3 sm:px-4 py-3.5 space-y-2.5">
        {notifications.map((n) => {
          const Icon = n.icon
          return (
            <Link
              key={n.id}
              href={n.href}
              className="ga-press flex items-start gap-3 rounded-3xl border border-[#E0DACB] bg-white p-3.5 shadow-xs hover:border-[#0F7A43]/40"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${n.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-extrabold text-[#2B1F17]">{n.title}</h2>
                  <span className="text-[9px] text-[#6E6A63]">{n.time}</span>
                </div>
                <p className="mt-1 text-[11px] text-[#6E6A63] leading-snug">{n.desc}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
