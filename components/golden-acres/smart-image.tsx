'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

// Renders an image, falling back to a warm branded placeholder when the file
// isn't present yet (used for user-supplied lifestyle photography slots).
export function SmartImage({
  src,
  alt,
  className,
  imgClassName,
  label,
  // Accepted for call-site ergonomics (Next/Image-like API). The component
  // always fills its relative parent, so these are advisory only.
  fill: _fill,
  priority,
}: {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  label?: string
  fill?: boolean
  priority?: boolean
}) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={cn('relative overflow-hidden bg-secondary', className)}>
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src || '/placeholder.svg'}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          onError={() => setFailed(true)}
          className={cn('h-full w-full object-cover', imgClassName)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[repeating-linear-gradient(135deg,var(--color-secondary),var(--color-secondary)_12px,var(--color-muted)_12px,var(--color-muted)_24px)] p-4 text-center">
          <span className="ga-display text-sm font-semibold text-field">
            {label ?? 'Photo'}
          </span>
          <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
            {src.replace('/golden-acres/', '')}
          </span>
        </div>
      )}
    </div>
  )
}
