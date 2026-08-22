import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AuthShell } from '@/components/golden-acres/auth/auth-shell'
import { FarmerAuth } from '@/components/golden-acres/auth/farmer-auth'

export const metadata: Metadata = {
  title: 'Farmer sign in — AgriVil',
  description: 'Manage your harvests, stock, and payouts.',
}

export default function FarmerLoginPage() {
  return (
    <AuthShell
      image="/golden-acres/auth/auth-farmer.png"
      eyebrow="For our farmers"
      headline="Your harvest, your livelihood — in your pocket."
      proof={[
        'Get paid to MoMo within 48 hours of delivery',
        'Sync stock and accept orders from your phone',
        'Track demand and grow what sells',
      ]}
    >
      <Suspense fallback={null}>
        <FarmerAuth />
      </Suspense>
    </AuthShell>
  )
}
