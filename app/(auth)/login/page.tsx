import { Suspense } from 'react'
import type { Metadata } from 'next'
import { CustomerAuth } from '@/components/golden-acres/auth/customer-auth'

export const metadata: Metadata = {
  title: 'Sign In — AgriVil',
  description: 'Sign in to your AgriVil account to manage orders, subscriptions, and addresses.',
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex h-96 items-center justify-center" />}>
      <CustomerAuth mode="login" />
    </Suspense>
  )
}
