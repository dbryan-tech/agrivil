import { Suspense } from 'react'
import { KeyRound, ShieldCheck, Clock } from 'lucide-react'
import { AuthShell } from '@/components/golden-acres/auth/auth-shell'
import { ForgotPassword } from '@/components/golden-acres/auth/forgot-password'

export const metadata = {
  title: 'Reset password — AgriVil',
  description: 'Reset your AgriVil account password.',
}

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      image="/golden-acres/auth/auth-customer.png"
      imageAlt="Lush Ghanaian farm at golden hour"
      eyebrow="Account recovery"
      headline="Let's get you back into your market."
      points={[
        { icon: <KeyRound className="h-4 w-4" />, label: 'Reset with a one-time code sent to your email' },
        { icon: <Clock className="h-4 w-4" />, label: 'Codes expire in 10 minutes for your security' },
        { icon: <ShieldCheck className="h-4 w-4" />, label: 'Your orders and boxes stay protected' },
      ]}
    >
      <Suspense fallback={null}>
        <ForgotPassword />
      </Suspense>
    </AuthShell>
  )
}
