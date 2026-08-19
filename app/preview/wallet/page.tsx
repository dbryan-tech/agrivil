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
    },
    {
      id: 'tx2',
      title: 'MTN MoMo Top-Up',
      desc: 'Auto-credited from +233 24 555 0142',
      amount: 100.0,
      date: 'Yesterday, 4:20 PM',
      type: 'credit',
    },
    {
      id: 'tx3',
      title: 'Cold-Chain Partial Refund',
      desc: 'Kontomire wilted transit protection',
      amount: 12.0,
      date: '16 Oct 25, 2:10 PM',
      type: 'refund',
    },
    {
      id: 'tx4',
      title: 'Produce Order #GA-24809',
      desc: 'White Yam & Kontomire',
      amount: -33.4,
      date: '15 Oct 25, 8:00 AM',
      type: 'debit',
    },
  ]

  const handleTopUp = (amt: number) => {
    setBalance((prev) => prev + amt)
    setTopupAmount(amt)
    setTimeout(() => setTopupAmount(null), 2500)
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
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(220px,38vh,340px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.14) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[rgba(33,26,18,0.08)] bg-[#F7F5F0]/90 px-5 py-3 backdrop-blur-md">
        <Link
          href="/preview/home"
          aria-label="Back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#211A12] shadow-[0_1px_4px_rgba(33,26,18,0.06)] border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-[17px] font-extrabold tracking-tight text-[#211A12]">
          AgriVil Wallet
        </h1>
        <div className="flex items-center gap-1 text-[11px] font-bold text-[#0B3B25]">
          <ShieldCheck className="h-4 w-4" />
          <span>Protected</span>
        </div>
      </header>

      <div className="relative px-5 pt-3 space-y-4">
        {/* Main Balance Hero Card */}
        <div className="relative overflow-hidden rounded-[28px] bg-[#211A12] p-6 text-white shadow-lg">
          <span className="text-[11px] font-black uppercase tracking-[0.14em] text-white/70">
            Available Balance
          </span>
          <h2 className="mt-1 text-[32px] font-black tracking-tight text-white">
            {formatGHS(balance)}
          </h2>
          <p className="mt-1 text-[12px] font-medium text-white/70">
            Linked to MTN MoMo · 024 555 0142
          </p>

          {/* Quick Top-Up Pills */}
          <div className="mt-5 border-t border-white/10 pt-4">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-white/60">
              Quick Top Up
            </span>
            <div className="mt-2 flex gap-2">
              {[20, 50, 100].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleTopUp(amt)}
                  className="flex-1 rounded-full bg-white/15 py-2 text-[12px] font-extrabold text-white hover:bg-white/25 active:scale-95 transition-all"
                >
                  + GH₵{amt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Top-up Notification Pill */}
        {topupAmount && (
          <div className="rounded-2xl bg-[#0B3B25] p-3 text-center text-white font-extrabold text-[13px] shadow-sm animate-fade-in">
            ✓ Added {formatGHS(topupAmount)} via MTN Mobile Money!
          </div>
        )}

        {/* Recent Transactions List */}
        <div className="rounded-[28px] bg-[#FAF9F6] p-5 shadow-[0_2px_10px_-2px_rgba(33,26,18,0.05),0_8px_20px_-6px_rgba(33,26,18,0.08)] border border-[rgba(33,26,18,0.08)] ring-1 ring-white/90">
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
      </div>

      {/* Bottom Navigation */}
      <PreviewBottomNav active="wallet" />
    </div>
  )
}
