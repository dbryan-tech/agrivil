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

/**
 * Social sign-in buttons as equal-weight quiet rows (docs/redesign/03 §2.2) —
 * hairline outline, provider mark, no colored brand boxes. The trust line
 * "We never post anywhere." sits under the group.
 */
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
    <div className="space-y-2.5">
      {error && (
        <p
          className="rounded-xl border border-[rgba(185,28,28,0.25)] bg-[#B91C1C]/5 px-4 py-3 text-[13px] font-medium text-[#B91C1C]"
          role="alert"
        >
          {error}
        </p>
      )}
      <div className={`grid gap-2.5 ${enabled.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
        {enabled.map((provider) => (
          <button
            key={provider}
            type="button"
            onClick={() => go(provider)}
            disabled={busy !== null}
            className="inline-flex h-11 items-center justify-center gap-2.5 rounded-full border border-[rgba(33,26,18,0.15)] bg-transparent text-[14px] font-medium text-[#211A12] transition-colors duration-300 hover:border-[rgba(33,26,18,0.4)] hover:bg-white disabled:opacity-60"
          >
            {busy === provider ? (
              <Loader2 width={16} height={16} className="animate-spin" />
            ) : provider === 'google' ? (
              <GoogleIcon className="h-[18px] w-[18px]" />
            ) : (
              <AppleIcon className="h-[18px] w-[18px]" />
            )}
            <span>{`Continue with ${provider === 'google' ? 'Google' : 'Apple'}`}</span>
          </button>
        ))}
      </div>
      <p className="pt-1 text-center text-[11.5px] text-[#B7AC9E]">
        We never post anywhere.
      </p>
    </div>
  )
}
