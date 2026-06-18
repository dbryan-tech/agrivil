import type { Metadata } from 'next'
import { Suspense } from 'react'
import { StaffAuth } from '@/components/golden-acres/auth/staff-auth'
import { SmartImage } from '@/components/golden-acres/smart-image'

export const metadata: Metadata = {
  title: 'Staff sign in — AgriVil',
}

export default function StaffLoginPage() {
  return (
    <main className="ga-root relative flex min-h-screen items-center justify-center bg-background px-5 py-12">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <SmartImage
          src="/golden-acres/auth/auth-staff.png"
          alt=""
          className="h-full w-full"
        />
      </div>
      <div className="relative z-10 w-full max-w-sm rounded-3xl border border-border bg-card p-7 shadow-xl">
        <Suspense fallback={null}>
          <StaffAuth />
        </Suspense>
      </div>
    </main>
  )
}
