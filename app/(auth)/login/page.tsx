import { Suspense } from 'react'
import { AuthShell } from '@/components/golden-acres/auth/auth-shell'
import { CustomerAuth } from '@/components/golden-acres/auth/customer-auth'

export const metadata = {
  title: 'Sign in — AgriVil',
  description: 'Sign in to your AgriVil account.',
}

export default function LoginPage() {
  return (
    <AuthShell
      image="/golden-acres/auth/auth-customer.png"
      eyebrow="Welcome back"
      headline="Your market is open. Fresh picks are waiting."
      proof={[
        'Track every order in real time, farm to door',
        'Manage your weekly produce boxes',
        'Freshness Promise — instant MoMo refunds',
      ]}
    >
      <Suspense fallback={null}>
        <CustomerAuth mode="login" />
      </Suspense>
    </AuthShell>
  )
}
