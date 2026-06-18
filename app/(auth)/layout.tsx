import type { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="ga-root min-h-screen bg-background text-foreground antialiased">
      {children}
    </div>
  )
}
