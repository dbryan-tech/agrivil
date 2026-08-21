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
    <div className="relative min-h-dvh w-full bg-[#FAF9F6] pb-28 text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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

      {/* Top warm brand radiant gradient backdrop (Seamless Harvest Glow) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(280px,48vh,400px)] z-0"
        style={{
          background:
            'radial-gradient(130% 95% at 50% 0%, rgba(223, 136, 33, 0.20) 0%, rgba(240, 168, 30, 0.08) 35%, rgba(247, 245, 240, 0.6) 75%, rgba(247, 245, 240, 1) 100%)',
        }}
      />

      {/* Header */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-1.5 py-2.5 border-b border-[rgba(33,26,18,0.06)] bg-[#FAF9F6]/90 backdrop-blur-md transition-colors"
        style={{
          paddingTop: 'max(env(safe-area-inset-top, 0px), 36px)',
          paddingBottom: '12px',
        }}
      >
        <h1 className="text-[20px] font-black tracking-tight text-[#211A12]">
          My Profile
        </h1>
        <div className="flex items-center gap-1.5 rounded-full bg-[#0B3B25]/10 px-2.5 py-0.5 text-[10.5px] font-black text-[#0B3B25]">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Verified Buyer</span>
        </div>
      </header>

      <div className="relative px-1.5 pt-3.5 space-y-3.5">
        {/* 1. Profile Member Header (Direct on background, circular avatar, zero card box) */}
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#0B3B25] text-xl font-black text-white shadow-sm">
            {userName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-[18px] font-black text-[#211A12] truncate">
              {userName}
            </h2>
            <p className="text-[12px] font-semibold text-[#5C5247] truncate">{userEmail}</p>
            <div className="mt-1 flex items-center gap-1 text-[11px] font-black text-[#7A3F1C]">
              <Award className="h-3.5 w-3.5" />
              <span>Gold Harvest Member · 140 pts</span>
            </div>
          </div>
        </div>

        {/* 2. Quick Action Links (Direct on background, zero card box, zero borders) */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <Link
            href="/m/orders"
            className="flex items-center gap-2.5 py-1 active:opacity-75 transition-opacity"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0B3B25]/10 text-[#0B3B25]">
              <Package className="h-4.5 w-4.5 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <span className="block text-[13px] font-black text-[#211A12] truncate">My Shipping</span>
              <span className="block text-[10.5px] font-semibold text-[#5C5247] truncate">Track &amp; history</span>
            </div>
          </Link>

          <Link
            href="/m/farmers"
            className="flex items-center gap-2.5 py-1 active:opacity-75 transition-opacity"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7A3F1C]/10 text-[#7A3F1C]">
              <Store className="h-4.5 w-4.5 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <span className="block text-[13px] font-black text-[#211A12] truncate">Local Growers</span>
              <span className="block text-[10.5px] font-semibold text-[#5C5247] truncate">Smallholder farms</span>
            </div>
          </Link>
        </div>

        {/* 3. Account Menu (Direct on background with subtle dividers) */}
        <div className="pt-2 divide-y divide-[rgba(33,26,18,0.08)]">
          <Link
            href="/m/onboarding/gps"
            className="flex items-center justify-between py-3.5 text-[13px] font-black text-[#211A12] active:bg-black/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#0B3B25]/10 text-[#0B3B25]">
                <MapPin className="h-4 w-4 stroke-[2.4]" />
              </div>
              <span>Delivery Addresses &amp; GPS</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#8A7E72]" />
          </Link>

          <Link
            href="/m/account/notifications"
            className="flex items-center justify-between py-3.5 text-[13px] font-black text-[#211A12] active:bg-black/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#0B3B25]/10 text-[#0B3B25]">
                <Bell className="h-4 w-4 stroke-[2.4]" />
              </div>
              <span>Notifications &amp; Harvest Alerts</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#8A7E72]" />
          </Link>

          <Link
            href="/m/cart/promo"
            className="flex items-center justify-between py-3.5 text-[13px] font-black text-[#211A12] active:bg-black/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#0B3B25]/10 text-[#0B3B25]">
                <CreditCard className="h-4 w-4 stroke-[2.4]" />
              </div>
              <span>Coupons &amp; Direct Vouchers</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#8A7E72]" />
          </Link>

          <Link
            href="/m/farmer"
            className="flex items-center justify-between py-3.5 text-[13px] font-black text-[#0B3B25] active:bg-black/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#0B3B25]/10 text-[#0B3B25]">
                <Store className="h-4 w-4 stroke-[2.4]" />
              </div>
              <span>Grower Portal (Sell on AgriVil)</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#0B3B25]" />
          </Link>
        </div>

        {/* 4. Sign Out Button (Preserved as a standalone card/button) */}
        <div className="pt-3">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[rgba(220,38,38,0.25)] bg-white text-[13px] font-black text-[#DC2626] shadow-sm active:scale-[0.98] transition-transform"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}

