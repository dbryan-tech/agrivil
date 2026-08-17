import { Suspense } from 'react'
import { Leaf, MapPin, Wallet } from 'lucide-react'
import { AuthShell } from '@/components/golden-acres/auth/auth-shell'
import { CustomerAuth } from '@/components/golden-acres/auth/customer-auth'

export const metadata = {
  title: 'Create account — AgriVil',
  description: 'Join AgriVil for fresh produce delivered across Accra.',
}

export default function SignupPage() {
  return (
    <AuthShell
      image="/golden-acres/auth/auth-customer.png"
      imageAlt="Lush Ghanaian farm at golden hour"
      eyebrow="Join the market"
      headline="Eat fresher. Support local farms. Skip the market run."
      points={[
        { icon: <Leaf className="h-4 w-4" />, label: 'Produce harvested days — not weeks — ago' },
        { icon: <MapPin className="h-4 w-4" />, label: 'Matched to the farm closest to you' },
        { icon: <Wallet className="h-4 w-4" />, label: 'Pay your way — MTN, Telecel, or card' },
      ]}
    >
      <Suspense fallback={null}>
        <CustomerAuth mode="signup" />
      </Suspense>
    </AuthShell>
  )
}
