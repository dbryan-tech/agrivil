import { Suspense } from 'react'
import { KeyRound, ShieldCheck, Lock } from 'lucide-react'
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
      imageAlt="Lush Ghanaian farm at golden hour"
      eyebrow="Account recovery"
      headline="One step left — set a new password."
      points={[
        { icon: <Lock className="h-4 w-4" />, label: 'Choose a strong password you have not used before' },
        { icon: <KeyRound className="h-4 w-4" />, label: 'Your reset link is single-use' },
        { icon: <ShieldCheck className="h-4 w-4" />, label: 'All active sessions stay secure' },
      ]}
    >
      <Suspense fallback={null}>
        <ResetPassword />
      </Suspense>
    </AuthShell>
  )
}
