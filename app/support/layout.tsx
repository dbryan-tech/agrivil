import type { ReactNode } from 'react'

export const metadata = {
  title: 'AgriVil — Ops & Support Console',
  description: 'Internal order management, 3PL tracking, and instant refunds.',
}

export default function OpsLayout({ children }: { children: ReactNode }) {
  return <div className="ga-root min-h-screen bg-background">{children}</div>
}
