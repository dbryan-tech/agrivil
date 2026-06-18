'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { Account, Session, UserRole } from '@/lib/golden-acres/types'
import { authClient } from '@/lib/auth-client'
import {
  getCurrentAccount,
  updateProfile,
  toggleWishlist as toggleWishlistAction,
} from '@/app/actions/account'

interface SessionCtx {
  session: Session | null
  account: Account | null
  role: UserRole | null
  hydrated: boolean
  /** Re-fetch the rich account from the server (call after sign-in). */
  signIn: (session?: Session) => void
  signOut: () => void
  updateAccount: (patch: Partial<Account>) => void
  /** Force a refresh of the server-backed account. */
  refresh: () => void
  // wishlist (customers only — no-ops otherwise)
  wishlist: string[]
  isSaved: (productId: string) => boolean
  toggleWishlist: (productId: string) => void
}

const Ctx = createContext<SessionCtx | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const { data: authData, isPending } = authClient.useSession()
  const [account, setAccount] = useState<Account | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const lastUserId = useRef<string | null>(null)

  const loadAccount = useCallback(async () => {
    try {
      const acct = await getCurrentAccount()
      setAccount(acct)
    } catch {
      setAccount(null)
    } finally {
      setHydrated(true)
    }
  }, [])

  // React to Better Auth session changes (sign-in / sign-out / token refresh).
  useEffect(() => {
    if (isPending) return
    const uid = authData?.user?.id ?? null
    if (uid !== lastUserId.current) {
      lastUserId.current = uid
      if (uid) {
        void loadAccount()
      } else {
        setAccount(null)
        setHydrated(true)
      }
    } else if (!hydrated) {
      setHydrated(true)
    }
  }, [authData, isPending, loadAccount, hydrated])

  const refresh = useCallback(() => {
    void loadAccount()
  }, [loadAccount])

  const signIn = useCallback(() => {
    void loadAccount()
  }, [loadAccount])

  const signOut = useCallback(() => {
    void authClient.signOut().finally(() => {
      lastUserId.current = null
      setAccount(null)
    })
  }, [])

  const updateAccount = useCallback((patch: Partial<Account>) => {
    // Optimistic local update
    setAccount((prev) => (prev ? ({ ...prev, ...patch } as Account) : prev))
    // Persist the subset of fields the profile endpoint understands.
    const profilePatch: Parameters<typeof updateProfile>[0] = {}
    if ('name' in patch && patch.name !== undefined) profilePatch.name = patch.name as string
    if ('phone' in patch && (patch as { phone?: string }).phone !== undefined)
      profilePatch.phone = (patch as { phone?: string }).phone
    if ('avatarColor' in patch && (patch as { avatarColor?: string }).avatarColor !== undefined)
      profilePatch.avatarColor = (patch as { avatarColor?: string }).avatarColor
    if ('avatarImage' in patch && (patch as { avatarImage?: string }).avatarImage !== undefined)
      profilePatch.avatarImage = (patch as { avatarImage?: string }).avatarImage
    if (Object.keys(profilePatch).length) void updateProfile(profilePatch)
  }, [])

  const session = useMemo<Session | null>(() => {
    if (!account) return null
    return {
      account,
      method: 'password',
      issuedAt: account.joinedAt,
    }
  }, [account])

  const wishlist = account?.role === 'customer' ? account.wishlist ?? [] : []

  const isSaved = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist],
  )

  const toggleWishlist = useCallback((productId: string) => {
    // Optimistic update
    setAccount((prev) => {
      if (!prev || prev.role !== 'customer') return prev
      const current = prev.wishlist ?? []
      const next = current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
      return { ...prev, wishlist: next }
    })
    void toggleWishlistAction(productId).then((next) => {
      setAccount((prev) =>
        prev && prev.role === 'customer' ? { ...prev, wishlist: next } : prev,
      )
    })
  }, [])

  const value = useMemo<SessionCtx>(
    () => ({
      session,
      account,
      role: account?.role ?? null,
      hydrated,
      signIn,
      signOut,
      updateAccount,
      refresh,
      wishlist,
      isSaved,
      toggleWishlist,
    }),
    [session, account, hydrated, signIn, signOut, updateAccount, refresh, wishlist, isSaved, toggleWishlist],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useSession(): SessionCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useSession must be used within SessionProvider')
  return ctx
}
