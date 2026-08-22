import { Suspense } from 'react'
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
      eyebrow="Join the market"
      headline="Eat fresher. Support local farms. Skip the market run."
      proof={[
        'Produce harvested days — not weeks — ago',
        'Matched to the farm closest to you',
        'Pay your way — MTN, Telecel, or card',
      ]}
    >
      <Suspense fallback={null}>
        <CustomerAuth mode="signup" />
      </Suspense>
    </AuthShell>
  )
}
