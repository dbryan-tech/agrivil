'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
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
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-[#5C5247]">
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAF7F2] p-2.5 shadow-md ring-1 ring-black/5 animate-pulse">
        <Image
          src="/agrivil-mark.svg"
          alt="AgriVil"
          width={40}
          height={40}
          className="h-full w-full object-contain"
        />
      </div>
      <p className="text-xs font-bold tracking-wide text-[#211A12]">
        {hydrated ? 'Redirecting to sign in…' : 'Checking your session…'}
      </p>
    </div>
  )
}
