'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  User,
  Heart,
  Store,
  MapPin,
  CreditCard,
  Bell,
  LogOut,
  ChevronRight,
  Sparkles,
  Package,
  ShieldCheck,
  Award,
} from 'lucide-react'
import { useSession } from '@/components/golden-acres/auth/session-context'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'

export default function MobileAccountScreen() {
  const router = useRouter()
  const { account, signOut } = useSession()

  const userName = account?.name || 'Ewoke Mensah'
  const userEmail = account?.email || 'ewoke@agrivil.gh'

  function handleSignOut() {
    signOut()
    router.push('/m/splash')
  }

  return (
    <div className="relative min-h-dvh w-full bg-[#F7F5F0] pb-28 text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(240px,40vh,360px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.14) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      {/* Header */}
      <header className="relative flex items-center justify-between px-3 pt-3 pb-1.5">
        <h1 className="text-[22px] font-black tracking-tight text-[#211A12]">
          My Profile
        </h1>
        <div className="flex items-center gap-1.5 rounded-full bg-[#0B3B25]/10 px-2.5 py-0.5 text-[10.5px] font-black text-[#0B3B25]">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Verified Buyer</span>
        </div>
      </header>

      <div className="relative px-3 pt-2.5 space-y-2.5">
        {/* 1. Profile Member Card */}
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B3B25] text-lg font-black text-white shadow-sm">
              {userName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] font-black text-[#211A12] truncate">
                  {userName}
                </h2>
              </div>
              <p className="text-[11.5px] font-semibold text-[#5C5247] truncate">{userEmail}</p>
              <div className="mt-1 flex items-center gap-1 text-[10.5px] font-black text-[#7A3F1C]">
                <Award className="h-3.5 w-3.5" />
                <span>Gold Harvest Member · 140 pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Quick Action Grid */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/m/orders"
            className="flex flex-col rounded-[22px] bg-[#FDFDFB] p-3 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] active:scale-[0.98] transition-transform"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#0B3B25]/10 text-[#0B3B25]">
              <Package className="h-4.5 w-4.5 stroke-[2.2]" />
            </div>
            <span className="mt-2.5 text-[13.5px] font-extrabold text-[#211A12]">My Shipping</span>
            <span className="text-[10.5px] font-semibold text-[#5C5247]">Live track &amp; history</span>
          </Link>

          <Link
            href="/m/farmers"
            className="flex flex-col rounded-[22px] bg-[#FDFDFB] p-3 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] active:scale-[0.98] transition-transform"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#7A3F1C]/10 text-[#7A3F1C]">
              <Store className="h-4.5 w-4.5 stroke-[2.2]" />
            </div>
            <span className="mt-2.5 text-[13.5px] font-extrabold text-[#211A12]">Local Growers</span>
            <span className="text-[10.5px] font-semibold text-[#5C5247]">Smallholder farms</span>
          </Link>
        </div>

        {/* 3. Account Menu */}
        <div className="overflow-hidden rounded-[24px] bg-[#FDFDFB] p-1.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] divide-y divide-[rgba(33,26,18,0.06)]">
          <Link
            href="/m/onboarding/gps"
            className="flex items-center justify-between p-3 text-[12.5px] font-extrabold text-[#211A12] active:bg-black/5 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#0B3B25]/10 text-[#0B3B25]">
                <MapPin className="h-3.5 w-3.5 stroke-[2.4]" />
              </div>
              <span>Delivery Addresses &amp; GPS</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#5C5247]" />
          </Link>

          <Link
            href="/m/account/notifications"
            className="flex items-center justify-between p-3 text-[12.5px] font-extrabold text-[#211A12] active:bg-black/5 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#0B3B25]/10 text-[#0B3B25]">
                <Bell className="h-3.5 w-3.5 stroke-[2.4]" />
              </div>
              <span>Notifications &amp; Harvest Alerts</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#5C5247]" />
          </Link>

          <Link
            href="/m/cart/promo"
            className="flex items-center justify-between p-3 text-[12.5px] font-extrabold text-[#211A12] active:bg-black/5 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#0B3B25]/10 text-[#0B3B25]">
                <CreditCard className="h-3.5 w-3.5 stroke-[2.4]" />
              </div>
              <span>Coupons &amp; Direct Vouchers</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#5C5247]" />
          </Link>

          <Link
            href="/m/farmer"
            className="flex items-center justify-between p-3 text-[12.5px] font-extrabold text-[#0B3B25] active:bg-black/5 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#0B3B25]/10 text-[#0B3B25]">
                <Store className="h-3.5 w-3.5 stroke-[2.4]" />
              </div>
              <span>Grower Portal (Sell on AgriVil)</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#0B3B25]" />
          </Link>
        </div>

        {/* 4. Logout Button */}
        <button
          type="button"
          onClick={handleSignOut}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[rgba(220,38,38,0.25)] bg-white text-[12.5px] font-extrabold text-[#DC2626] shadow-2xs active:scale-[0.98] transition-transform"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>

      <MobileBottomNav />
    </div>
  )
}

