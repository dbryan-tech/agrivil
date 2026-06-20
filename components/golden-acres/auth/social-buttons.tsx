'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { signInWithProvider } from '@/lib/golden-acres/auth'
import { getAuthProviders } from '@/app/actions/auth-meta'
import type { UserRole } from '@/lib/golden-acres/types'
import { GoogleIcon, AppleIcon } from './brand-icons'
import { Loader2 } from 'lucide-react'

/**
 * Returns the list of OAuth providers that actually have credentials configured.
 * `undefined` while loading. Call sites use this to hide social-auth dividers
 * when no provider is available (so we never show an empty "or with…" rule).
 */
export function useSocialProviders(): ('google' | 'apple')[] | undefined {
  const { data: providers } = useSWR('auth-providers', getAuthProviders)
  if (!providers) return undefined
  return (['google', 'apple'] as const).filter((p) => providers[p])
}

export function SocialButtons({ role = 'customer' }: { role?: UserRole }) {
  const [busy, setBusy] = useState<'google' | 'apple' | null>(null)
  const [error, setError] = useState<string | null>(null)
  // Only render social buttons for providers that actually have credentials,
  // so we never show a button that errors with "provider not found".
  const { data: providers } = useSWR('auth-providers', getAuthProviders)

  async function go(provider: 'google' | 'apple') {
    setBusy(provider)
    setError(null)
    // On success, Better Auth navigates the browser to the OAuth provider, so
    // control usually leaves this page. We only land back here on error.
    const res = await signInWithProvider(provider, role)
    if (!res.ok) {
      setBusy(null)
      setError(res.error ?? 'Social sign-in is unavailable.')
    }
  }

  // Until we know, render nothing (avoids a flash of broken buttons).
  if (!providers) return null

  const enabled = (['google', 'apple'] as const).filter((p) => providers[p])
  if (enabled.length === 0) return null

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-xl bg-clay/10 px-3 py-2 text-xs font-semibold text-clay" role="alert">
          {error}
        </p>
      )}
      <div className={`grid gap-3 ${enabled.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {enabled.map((provider) => (
          <button
            key={provider}
            type="button"
            onClick={() => go(provider)}
            disabled={busy !== null}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-semibold text-foreground transition-colors hover:bg-secondary disabled:opacity-60"
          >
            {busy === provider ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : provider === 'google' ? (
              <GoogleIcon className="h-5 w-5" />
            ) : (
              <AppleIcon className="h-5 w-5" />
            )}
            <span className="capitalize">{`Continue with ${provider}`}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
