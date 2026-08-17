import type { Metadata } from 'next'
import { ForgotPassword } from '@/components/golden-acres/auth/forgot-password'

export const metadata: Metadata = {
  title: 'Forgot Password — AgriVil',
  description: 'Reset your AgriVil account password via email verification code.',
}

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-14rem)] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <ForgotPassword />
      </div>
    </div>
  )
}
