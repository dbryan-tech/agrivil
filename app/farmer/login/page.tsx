import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AuthShell } from '@/components/golden-acres/auth/auth-shell'
import { FarmerAuth } from '@/components/golden-acres/auth/farmer-auth'
import { Wallet, Package, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Farmer sign in — AgriVil',
  description: 'Manage your harvests, stock, and payouts.',
}

export default function FarmerLoginPage() {
  return (
    <AuthShell
      image="/golden-acres/auth/auth-farmer.png"
      imageAlt="A Ghanaian farmer holding a crate of freshly harvested vegetables"
      eyebrow="For our farmers"
      headline="Your harvest, your livelihood — in your pocket."
      points={[
        { icon: <Wallet className="size-4" />, label: 'Get paid to MoMo within 48 hours of delivery' },
        { icon: <Package className="size-4" />, label: 'Sync stock and accept orders from your phone' },
        { icon: <TrendingUp className="size-4" />, label: 'Track demand and grow what sells' },
      ]}
    >
      <Suspense fallback={null}>
        <FarmerAuth />
      </Suspense>
    </AuthShell>
  )
}
