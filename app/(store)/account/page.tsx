import { Suspense } from 'react'
import type { Metadata } from 'next'
import { AccountDashboard } from '@/components/golden-acres/account/account-dashboard'

export const metadata: Metadata = {
  title: 'My Account — Orders, Addresses & Subscriptions | AgriVil',
  description:
    'Manage your delivery addresses, track live orders, edit produce subscriptions, and view loyalty points on AgriVil.',
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="h-64 animate-pulse rounded-2xl bg-secondary/50" />
        </div>
      }
    >
      <AccountDashboard />
    </Suspense>
  )
}
