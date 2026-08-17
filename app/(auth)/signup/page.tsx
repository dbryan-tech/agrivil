import { Suspense } from 'react'
import type { Metadata } from 'next'
import { CustomerAuth } from '@/components/golden-acres/auth/customer-auth'

export const metadata: Metadata = {
  title: 'Create Account — AgriVil',
  description: 'Create an AgriVil account to get farm-to-door fresh produce delivered in Accra.',
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex h-96 items-center justify-center" />}>
      <CustomerAuth mode="signup" />
    </Suspense>
  )
}
