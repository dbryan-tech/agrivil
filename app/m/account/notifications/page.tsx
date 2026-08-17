'use client'

import Link from 'next/link'
import { ArrowLeft, Bell, CheckCircle2, Truck, CreditCard, Sparkles } from 'lucide-react'
import { MobileAppBar } from '@/components/golden-acres/mobile/mobile-app-bar'

export default function MobileNotificationsScreen() {
  const notifications = [
    {
      id: '1',
      title: 'Your order #AG12345678 is out for delivery',
      desc: 'Rider Kofi Addo is on the way in a cold-chain van.',
      time: '2 mins ago',
      icon: Truck,
      color: 'text-[#E67A2E] bg-[#E67A2E]/10',
      href: '/m/orders/AG-12345678',
    },
    {
      id: '2',
      title: 'Payment of GHS 38.50 successful',
      desc: 'Mobile Money payment confirmed for order #AG12345610.',
      time: '2 days ago',
      icon: CreditCard,
      color: 'text-[#1E5D3B] bg-[#1E5D3B]/10',
      href: '/m/orders/AG-12345610',
    },
    {
      id: '3',
      title: 'Fresh harvest from Adwoa Sarponaa Farms',
      desc: 'New Roma tomatoes and garden eggs picked this morning.',
      time: '3 days ago',
      icon: Sparkles,
      color: 'text-[#8A6B3D] bg-[#8A6B3D]/10',
      href: '/m/farmers/adwoa-sarponaa-farms',
    },
    {
      id: '4',
      title: 'Weekly Subscription Box Reminder',
      desc: 'Your Friday staples box will dispatch at 8:00 AM.',
      time: '4 days ago',
      icon: CheckCircle2,
      color: 'text-[#1E5D3B] bg-[#1E5D3B]/10',
      href: '/m/bundles',
    },
  ]

  return (
    <div className="min-h-dvh bg-[#F4F1EA] pb-12 text-[#2B1F17]">
      <MobileAppBar title="Notifications" showBack showCart={false} />

      <div className="px-4 py-4 space-y-3">
        {notifications.map((n) => {
          const Icon = n.icon
          return (
            <Link
              key={n.id}
              href={n.href}
              className="ga-press flex items-start gap-3.5 rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs hover:border-[#1E5D3B]/40"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${n.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-[#2B1F17]">{n.title}</h3>
                </div>
                <p className="mt-0.5 text-[11px] leading-relaxed text-[#6E6A63]">{n.desc}</p>
                <span className="mt-2 block text-[9px] font-semibold text-[#8A6B3D]">{n.time}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
