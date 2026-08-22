import { Suspense } from 'react'
import { AuthShell } from '@/components/golden-acres/auth/auth-shell'
import { ResetPassword } from '@/components/golden-acres/auth/reset-password'

export const metadata = {
  title: 'Choose a new password — AgriVil',
  description: 'Set a new password for your AgriVil account.',
}

export default function ResetPasswordPage() {
  return (
    <AuthShell
      image="/golden-acres/auth/auth-customer.png"
      eyebrow="Account recovery"
      headline="One step left — set a new password."
      proof={[
        'Choose a strong password you have not used before',
        'Your reset link is single-use',
        'All active sessions stay secure',
      ]}
    >
      <Suspense fallback={null}>
        <ResetPassword />
      </Suspense>
    </AuthShell>
  )
}
