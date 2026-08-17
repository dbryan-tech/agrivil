import { Suspense } from 'react'
import type { Metadata } from 'next'
import { ResetPassword } from '@/components/golden-acres/auth/reset-password'

export const metadata: Metadata = {
  title: 'Reset Password — AgriVil',
  description: 'Set a new password for your AgriVil account.',
}

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-14rem)] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <Suspense fallback={<div className="flex h-48 items-center justify-center" />}>
          <ResetPassword />
        </Suspense>
      </div>
    </div>
  )
}
