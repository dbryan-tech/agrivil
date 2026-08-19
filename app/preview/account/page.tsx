'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  User,
  Wallet,
  MapPin,
  FileText,
  ShieldCheck,
  Bell,
  Heart,
  ChevronRight,
  HelpCircle,
  LogOut,
  Award,
  Sparkles,
} from 'lucide-react'
import { formatGHS } from '@/lib/golden-acres/format'
import { cn } from '@/lib/utils'
import { PreviewBottomNav } from '@/app/preview/_lib/premium'

export default function MobileAccountScreen() {
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
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(220px,38vh,340px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.12) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      {/* Header */}
      <header className="relative px-5 pt-4 pb-2 flex items-center justify-between">
        <h1 className="text-[26px] font-extrabold tracking-tight text-[#211A12]">
          My Account
        </h1>
        <Link
          href="/preview/home"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#211A12] shadow-[0_1px_4px_rgba(33,26,18,0.06)] border border-[rgba(33,26,18,0.10)] active:scale-95"
        >
          <Bell className="h-4 w-4 stroke-[2.2]" />
        </Link>
      </header>

      <div className="relative px-5 pt-2 space-y-4">
        {/* Profile Card */}
        <div className="rounded-[28px] bg-[#FDFDFB] p-5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#211A12] text-white shadow-md text-[20px] font-black">
              EN
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0B3B25] text-white ring-2 ring-white">
                <ShieldCheck className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="text-[17px] font-black text-[#211A12]">
                  Ewoke Nana
                </h2>
                <span className="rounded-md bg-[#7A3F1C]/10 px-2 py-0.5 text-[9.5px] font-black uppercase text-[#7A3F1C]">
                  Gold Member
                </span>
              </div>
              <p className="mt-0.5 text-[12px] font-semibold text-[#5C5247]">
                +233 24 555 0142 · Kumasi Hub
              </p>
              <p className="text-[11px] font-bold text-[#0B3B25]">
                GhanaPostGPS: GA-183-4250
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[rgba(33,26,18,0.06)] pt-3 text-center">
            <div>
              <p className="text-[16px] font-black text-[#211A12]">12</p>
              <p className="text-[10px] font-bold text-[#5C5247] uppercase tracking-wider">
                Orders
              </p>
            </div>
            <div>
              <p className="text-[16px] font-black text-[#0B3B25]">GH₵140</p>
              <p className="text-[10px] font-bold text-[#5C5247] uppercase tracking-wider">
                Saved
              </p>
            </div>
            <div>
              <p className="text-[16px] font-black text-[#7A3F1C]">4</p>
              <p className="text-[10px] font-bold text-[#5C5247] uppercase tracking-wider">
                Farms
              </p>
            </div>
          </div>
        </div>

        {/* AgriVil Wallet Card Shortcut */}
        <Link href="/preview/wallet" className="block active:scale-[0.985] transition-transform">
          <div className="flex items-center justify-between rounded-[24px] bg-[#211A12] p-4 text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-white/70">
                  AgriVil Wallet Balance
                </span>
                <p className="text-[18px] font-black text-white leading-none mt-0.5">
                  GH₵120.00
                </p>
              </div>
            </div>
            <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-extrabold text-white">
              Top Up →
            </span>
          </div>
        </Link>

        {/* Menu Items Group */}
        <div className="rounded-[28px] bg-[#FDFDFB] p-2 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <Link
            href="/preview/orders"
            className="flex items-center justify-between p-3.5 hover:bg-white/50 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-[#7A3F1C]" />
              <span className="text-[14px] font-extrabold text-[#211A12]">
                My Shipping &amp; Orders
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#5C5247]" />
          </Link>

          <Link
            href="/preview/farmers"
            className="flex items-center justify-between p-3.5 hover:bg-white/50 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-[#0B3B25]" />
              <span className="text-[14px] font-extrabold text-[#211A12]">
                Saved Ghanaian Farms
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#5C5247]" />
          </Link>

          <div className="flex items-center justify-between p-3.5 hover:bg-white/50 rounded-2xl transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-[#7A3F1C]" />
              <span className="text-[14px] font-extrabold text-[#211A12]">
                Saved GPS Delivery Addresses
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#5C5247]" />
          </div>

          <div className="flex items-center justify-between p-3.5 hover:bg-white/50 rounded-2xl transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-5 w-5 text-[#5C5247]" />
              <span className="text-[14px] font-extrabold text-[#211A12]">
                Cold-Chain Support &amp; Help
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#5C5247]" />
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-3.5 text-[13px] font-bold text-[#7A3F1C] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
        >
          <LogOut className="h-4 w-4" />
          <span>Log Out of AgriVil</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <PreviewBottomNav active="account" />
    </div>
  )
}
