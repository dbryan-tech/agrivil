'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Wheat } from 'lucide-react'
import type { UserRole } from '@/lib/golden-acres/types'
import { useSession } from './session-context'

export function RouteGuard({
  role,
  loginPath,
  children,
}: {
  role: UserRole
  loginPath: string
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { account, hydrated } = useSession()
  const allowed = hydrated && account?.role === role

  useEffect(() => {
    if (!hydrated) return
    if (!account || account.role !== role) {
      const next = encodeURIComponent(pathname)
      router.replace(`${loginPath}?next=${next}`)
    }
  }, [hydrated, account, role, loginPath, pathname, router])

  if (allowed) return <>{children}</>

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground">
      <span className="flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-field text-cream">
        <Wheat className="h-6 w-6" strokeWidth={2.2} />
      </span>
      <p className="text-sm font-medium">
        {hydrated ? 'Redirecting to sign in…' : 'Checking your session…'}
      </p>
    </div>
  )
}
