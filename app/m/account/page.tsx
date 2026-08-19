'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  User,
  Heart,
  Store,
  UtensilsCrossed,
  MapPin,
  CreditCard,
  Bell,
  Headphones,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Sparkles,
  Repeat,
  Package,
} from 'lucide-react'
import { useSession } from '@/components/golden-acres/auth/session-context'
import { MobileAppBar } from '@/components/golden-acres/mobile/mobile-app-bar'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'

export default function MobileAccountScreen() {
  const router = useRouter()
  const { account, signOut, wishlist } = useSession()

  const userName = account?.name || 'Ewoke Mensah'
  const userEmail = account?.email || 'ewoke@agrivil.gh'

  function handleSignOut() {
    signOut()
    router.push('/m/splash')
  }

  return (
    <div className="min-h-dvh bg-[#FAF7F0] pb-24 text-[#2B1F17]">
      <MobileAppBar title="My Account" showCart />

      <div className="px-3 sm:px-4 py-3.5 space-y-3.5">
        {/* 1. Profile Header Card */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0F7A43] text-xl font-extrabold text-white shadow-md">
              {userName.charAt(0)}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-extrabold text-[#2B1F17]">
                  {userName}
                </h2>
                <span className="rounded-full bg-[#0F7A43]/10 px-2 py-0.5 text-[9px] font-extrabold text-[#0F7A43]">
                  Verified
                </span>
              </div>
              <span className="text-xs text-[#6E6A63]">{userEmail}</span>
              <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-[#7A3F1C]">
                <Sparkles className="h-3 w-3" /> Gold Harvest Member (140 pts)
              </span>
            </div>
          </div>
        </div>

        {/* 2. Quick Links Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <Link
            href="/m/orders"
            className="ga-press flex flex-col rounded-3xl border border-[#E0DACB] bg-white p-3.5 shadow-xs"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#0F7A43]/10 text-[#0F7A43]">
              <Package className="h-4 w-4" />
            </div>
            <span className="mt-2.5 text-xs font-extrabold text-[#2B1F17]">My Orders</span>
            <span className="text-[10px] text-[#6E6A63]">Track &amp; reorder</span>
          </Link>

          <Link
            href="/m/local"
            className="ga-press flex flex-col rounded-3xl border border-[#E0DACB] bg-white p-3.5 shadow-xs"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#7A3F1C]/10 text-[#7A3F1C]">
              <Store className="h-4 w-4" />
            </div>
            <span className="mt-2.5 text-xs font-extrabold text-[#2B1F17]">Local Farms</span>
            <span className="text-[10px] text-[#6E6A63]">Nearby growers</span>
          </Link>
        </div>

        {/* 3. Account Settings Menu */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-2 shadow-xs divide-y divide-[#E0DACB]/60">
          <Link
            href="/m/onboarding/gps"
            className="ga-press flex items-center justify-between p-3 text-xs font-bold text-[#2B1F17]"
          >
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-[#0F7A43]" />
              <span>Delivery Addresses &amp; GPS</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#6E6A63]" />
          </Link>

          <Link
            href="/m/account/notifications"
            className="ga-press flex items-center justify-between p-3 text-xs font-bold text-[#2B1F17]"
          >
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-[#0F7A43]" />
              <span>Notifications &amp; Harvest Alerts</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#6E6A63]" />
          </Link>

          <Link
            href="/m/cart/promo"
            className="ga-press flex items-center justify-between p-3 text-xs font-bold text-[#2B1F17]"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-[#0F7A43]" />
              <span>Coupons &amp; Vouchers</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#6E6A63]" />
          </Link>

          <Link
            href="/m/farmer"
            className="ga-press flex items-center justify-between p-3 text-xs font-bold text-[#0F7A43]"
          >
            <div className="flex items-center gap-3">
              <Store className="h-4 w-4 text-[#0F7A43]" />
              <span>Grower Portal (Sell on Agrivil)</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#6E6A63]" />
          </Link>
        </div>

        {/* 4. Logout Button */}
        <button
          type="button"
          onClick={handleSignOut}
          className="ga-press flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#DC2626]/30 bg-white text-xs font-bold text-[#DC2626] shadow-xs hover:bg-[#DC2626]/5"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>

      <MobileBottomNav />
    </div>
  )
}
