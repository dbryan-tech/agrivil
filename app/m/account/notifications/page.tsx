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
    <div className="relative min-h-dvh bg-[#F7F5F0] pb-16 text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Top warm brand gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(240px,40vh,360px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.14) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      <MobileAppBar title="Notifications" showBack showCart={false} />

      <div className="relative px-3 py-2.5 space-y-2">
        {notifications.map((n) => {
          const Icon = n.icon
          return (
            <Link
              key={n.id}
              href={n.href}
              className="flex items-start gap-3 rounded-[22px] bg-[#FDFDFB] p-3 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] active:scale-[0.985] transition-transform"
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${n.color}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-[13px] font-extrabold text-[#211A12] truncate">{n.title}</h2>
                  <span className="text-[10px] font-semibold text-[#5C5247] shrink-0 ml-1">{n.time}</span>
                </div>
                <p className="mt-0.5 text-[11px] text-[#5C5247] leading-snug font-medium">{n.desc}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
