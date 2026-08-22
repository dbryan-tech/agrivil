import { Suspense } from 'react'
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
      eyebrow="Account recovery"
      headline="Let's get you back into your market."
      proof={[
        'Reset with a one-time code sent to your email',
        'Codes expire in 10 minutes for your security',
        'Your orders and boxes stay protected',
      ]}
    >
      <Suspense fallback={null}>
        <ForgotPassword />
      </Suspense>
    </AuthShell>
  )
}
