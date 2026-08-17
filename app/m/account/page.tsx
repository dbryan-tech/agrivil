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
    <div className="min-h-dvh bg-[#F4F1EA] pb-24 text-[#2B1F17]">
      <MobileAppBar title="My Account" showCart />

      <div className="px-4 py-4 space-y-4">
        {/* 1. Profile Header Card */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-5 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1E5D3B] text-xl font-extrabold text-white shadow-md">
              {userName.charAt(0)}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-extrabold text-[#2B1F17]">
                  {userName}
                </h2>
                <span className="rounded-full bg-[#A3E635] px-2 py-0.5 text-[9px] font-extrabold text-[#144028]">
                  Verified
                </span>
              </div>
              <span className="text-xs text-[#6E6A63]">{userEmail}</span>
              <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-[#8A6B3D]">
                <Sparkles className="h-3 w-3" /> Gold Harvest Member (140 pts)
              </span>
            </div>
          </div>
        </div>

        {/* 2. Quick Action Grid (Saved Items, Farmers, Recipes, Boxes) */}
        <div className="grid grid-cols-2 gap-2.5">
          <Link
            href="/account?tab=favorites"
            className="ga-press flex items-center gap-3 rounded-2xl border border-[#E0DACB] bg-white p-3 shadow-xs"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#DC2626]/10 text-[#DC2626]">
              <Heart className="h-4 w-4 fill-[#DC2626]" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-[#2B1F17]">Saved Items</span>
              <p className="text-[10px] text-[#6E6A63]">{wishlist.length} items</p>
            </div>
          </Link>

          <Link
            href="/m/farmers"
            className="ga-press flex items-center gap-3 rounded-2xl border border-[#E0DACB] bg-white p-3 shadow-xs"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1E5D3B]/10 text-[#1E5D3B]">
              <Store className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-[#2B1F17]">My Farmers</span>
              <p className="text-[10px] text-[#6E6A63]">4 saved</p>
            </div>
          </Link>

          <Link
            href="/m/recipes"
            className="ga-press flex items-center gap-3 rounded-2xl border border-[#E0DACB] bg-white p-3 shadow-xs"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E67A2E]/10 text-[#E67A2E]">
              <UtensilsCrossed className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-[#2B1F17]">Saved Recipes</span>
              <p className="text-[10px] text-[#6E6A63]">3 recipes</p>
            </div>
          </Link>

          <Link
            href="/m/bundles"
            className="ga-press flex items-center gap-3 rounded-2xl border border-[#E0DACB] bg-white p-3 shadow-xs"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8A6B3D]/10 text-[#8A6B3D]">
              <Repeat className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-[#2B1F17]">Subscriptions</span>
              <p className="text-[10px] text-[#6E6A63]">Weekly box</p>
            </div>
          </Link>
        </div>

        {/* 3. Settings & Management List */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white divide-y divide-[#E0DACB]/60 shadow-xs text-xs">
          <Link
            href="/m/onboarding/gps"
            className="ga-press flex items-center justify-between p-4 hover:bg-[#F4F1EA]/50"
          >
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-[#1E5D3B]" />
              <span className="font-bold text-[#2B1F17]">Delivery Addresses (GhanaPostGPS)</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#6E6A63]" />
          </Link>

          <Link
            href="/m/account/notifications"
            className="ga-press flex items-center justify-between p-4 hover:bg-[#F4F1EA]/50"
          >
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-[#1E5D3B]" />
              <span className="font-bold text-[#2B1F17]">Notification Center</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#6E6A63]" />
          </Link>

          <Link
            href="/help"
            className="ga-press flex items-center justify-between p-4 hover:bg-[#F4F1EA]/50"
          >
            <div className="flex items-center gap-3">
              <Headphones className="h-4 w-4 text-[#1E5D3B]" />
              <span className="font-bold text-[#2B1F17]">Help &amp; Instant Refund Desk</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#6E6A63]" />
          </Link>

          <Link
            href="/privacy"
            className="ga-press flex items-center justify-between p-4 hover:bg-[#F4F1EA]/50"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4 text-[#1E5D3B]" />
              <span className="font-bold text-[#2B1F17]">Privacy &amp; Security (Act 843)</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#6E6A63]" />
          </Link>
        </div>

        {/* 4. Switch to Farmer Mode */}
        <div className="rounded-3xl border border-[#1E5D3B]/30 bg-[#1E5D3B]/5 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1E5D3B] text-white">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-[#2B1F17]">Farmer Mode</h3>
                <p className="text-[10px] text-[#6E6A63]">Manage inventory, pickups &amp; MoMo payouts</p>
              </div>
            </div>

            <Link
              href="/m/farmer"
              className="ga-press rounded-xl bg-[#1E5D3B] px-3.5 py-2 text-xs font-bold text-white shadow-xs"
            >
              Open
            </Link>
          </div>
        </div>

        {/* 5. Sign Out Button */}
        <button
          type="button"
          onClick={handleSignOut}
          className="ga-press flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#DC2626]/20 bg-white text-xs font-bold text-[#DC2626] shadow-xs hover:bg-[#DC2626]/5"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>

      <MobileBottomNav />
    </div>
  )
}
