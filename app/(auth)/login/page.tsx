import { Suspense } from 'react'
import { Truck, ShieldCheck, Repeat } from 'lucide-react'
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
      imageAlt="Lush Ghanaian farm at golden hour"
      eyebrow="Welcome back"
      headline="Your market is open. Fresh picks are waiting."
      points={[
        { icon: <Truck className="h-4 w-4" />, label: 'Track every order in real time, farm to door' },
        { icon: <Repeat className="h-4 w-4" />, label: 'Manage your weekly produce boxes' },
        { icon: <ShieldCheck className="h-4 w-4" />, label: 'Freshness Promise — instant MoMo refunds' },
      ]}
    >
      <Suspense fallback={null}>
        <CustomerAuth mode="login" />
      </Suspense>
    </AuthShell>
  )
}
