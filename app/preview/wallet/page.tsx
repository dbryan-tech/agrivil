'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  ShieldCheck,
  RotateCcw,
  Check,
} from 'lucide-react'
import { formatGHS } from '@/lib/golden-acres/format'
import { cn } from '@/lib/utils'
import { PreviewBottomNav } from '@/app/preview/_lib/premium'

export default function MobileWalletScreen() {
  const [balance, setBalance] = useState(120.0)
  const [topupAmount, setTopupAmount] = useState<number | null>(null)

  const transactions = [
    {
      id: 'tx1',
      title: 'Produce Order #GA-24817',
      desc: 'Roma Tomatoes & Plantain Box',
      amount: -58.2,
      date: 'Today, 6:45 AM',
      type: 'debit',
      badge: 'Cold-Chain Fulfilled',
    },
    {
      id: 'tx2',
      title: 'MoMo Wallet Auto Top-Up',
      desc: 'MTN Mobile Money (055***4567)',
      amount: 100.0,
      date: 'Yesterday, 4:15 PM',
      type: 'credit',
      badge: 'Instant',
    },
    {
      id: 'tx3',
      title: 'FEFO Weight Adjustment Refund',
      desc: 'Cassava (Actual: 4.6kg vs Est: 5.0kg)',
      amount: 4.8,
      date: 'Aug 14, 2:30 PM',
      type: 'refund',
      badge: 'Auto-Reconciled',
    },
    {
      id: 'tx4',
      title: 'Produce Order #GA-23901',
      desc: 'Garden Eggs & Habanero Batch',
      amount: -42.0,
      date: 'Aug 10, 11:20 AM',
      type: 'debit',
      badge: 'Delivered',
    },
  ]

  const handleTopup = (amt: number) => {
    setBalance((prev) => prev + amt)
    setTopupAmount(amt)
    setTimeout(() => setTopupAmount(null), 3000)
  }

  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col bg-[#F7F5F0] text-[#211A12] pb-24 [scrollbar-width:none]">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[rgba(33,26,18,0.06)] bg-[#FAF9F6]/95 px-4 py-3 backdrop-blur-md">
        <Link
          href="/preview/shop"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.08)] active:scale-95 transition-transform"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7A3F1C]">
            FARM DIRECT BALANCE
          </span>
          <h1 className="text-[16px] font-black tracking-tight text-[#211A12]">
            AgriVil Wallet
          </h1>
        </div>
        <div className="h-9 w-9" />
      </header>

      <main className="flex-1 px-4 pt-4 space-y-4">
        {/* Wallet Balance Hero Card */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#0B3B25] via-[#0D442B] to-[#082819] p-6 text-white shadow-[0_8px_30px_rgba(11,59,37,0.25)]">
          {/* Subtle geometric pattern overlay */}
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#F0A81E]/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 h-44 w-44 rounded-full bg-[#7A3F1C]/15 blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-white/90 backdrop-blur-md">
                <ShieldCheck className="h-3.5 w-3.5 text-[#F0A81E]" />
                FEFO Escrow Protected
              </span>
              <span className="text-[11px] font-bold text-white/70">
                Ghana MoMo Ready
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[12px] font-bold tracking-wider text-white/70 uppercase">
                Available Produce Balance
              </span>
              <div className="text-[36px] font-black tracking-tight text-white leading-none">
                {formatGHS(balance)}
              </div>
            </div>

            <p className="text-[11px] font-medium text-white/80 leading-relaxed">
              Instant 1-tap checkout for all harvest batches. Unpicked weight differences are automatically refunded back to this wallet upon doorstep delivery.
            </p>
          </div>
        </div>

        {/* Quick Top-Up Bar */}
        <div className="rounded-[28px] bg-[#FDFDFB] p-4 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
              Instant MoMo Top-Up
            </span>
            <span className="text-[11px] font-bold text-[#0B3B25]">
              No Network Fees
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[20, 50, 100].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => handleTopup(amt)}
                className="flex flex-col items-center justify-center rounded-2xl bg-[#FAF9F6] py-3 border border-[rgba(33,26,18,0.06)] shadow-2xs hover:bg-white hover:border-[#0B3B25]/30 active:scale-95 transition-all"
              >
                <span className="text-[10px] font-bold text-[#5C5247]">Add</span>
                <span className="text-[14px] font-black text-[#0B3B25]">+{formatGHS(amt)}</span>
              </button>
            ))}
          </div>

          <div className="pt-1">
            <div className="flex items-center gap-2 rounded-2xl bg-[#EDE8DF]/50 p-2.5 text-[11px] font-semibold text-[#5C5247]">
              <CreditCard className="h-4 w-4 text-[#7A3F1C] shrink-0" />
              <span>Supports MTN MoMo, Telecel Cash, and Bank Cards</span>
            </div>
          </div>
        </div>

        {/* Top-up Notification Pill */}
        {topupAmount && (
          <div className="flex items-center justify-center gap-1.5 rounded-2xl bg-[#0B3B25] p-3 text-center text-white font-extrabold text-[13px] shadow-sm animate-fade-in">
            <Check className="h-4 w-4" /> Added {formatGHS(topupAmount)} via MTN Mobile Money!
          </div>
        )}

        {/* Recent Transactions List */}
        <div className="rounded-[28px] bg-[#FDFDFB] p-5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(33,26,18,0.06)]">
            <h3 className="text-[12px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
              Transaction History
            </h3>
            <span className="text-[11px] font-bold text-[#7A3F1C]">October 2025</span>
          </div>

          <div className="mt-3 space-y-3.5">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-2xl',
                      tx.type === 'debit'
                        ? 'bg-[#7A3F1C]/10 text-[#7A3F1C]'
                        : tx.type === 'credit'
                        ? 'bg-[#0B3B25]/10 text-[#0B3B25]'
                        : 'bg-[#211A12]/10 text-[#211A12]'
                    )}
                  >
                    {tx.type === 'debit' ? (
                      <ArrowUpRight className="h-5 w-5" />
                    ) : tx.type === 'credit' ? (
                      <ArrowDownLeft className="h-5 w-5" />
                    ) : (
                      <RotateCcw className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-[13.5px] font-extrabold text-[#211A12]">
                      {tx.title}
                    </h4>
                    <p className="text-[11.5px] font-semibold text-[#5C5247]">
                      {tx.desc} · {tx.date}
                    </p>
                  </div>
                </div>

                <span
                  className={cn(
                    'text-[14px] font-black',
                    tx.amount > 0 ? 'text-[#0B3B25]' : 'text-[#211A12]'
                  )}
                >
                  {tx.amount > 0 ? `+${formatGHS(tx.amount)}` : formatGHS(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <PreviewBottomNav active="wallet" />
    </div>
  )
}
