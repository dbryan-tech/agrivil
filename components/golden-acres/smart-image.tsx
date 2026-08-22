'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

// Renders an image with Next.js optimization and fast graceful fallback
export function SmartImage({
  src,
  alt,
  className,
  imgClassName,
  label,
  fill = true,
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

  const imageSrc = src || '/placeholder.svg'

  return (
    <div
      className={cn(
        'overflow-hidden bg-[#FAF7F2]',
        fill ? 'absolute inset-0 h-full w-full' : 'relative',
        className,
      )}
    >
      {!failed ? (
        <Image
          src={imageSrc}
          alt={alt}
          fill={fill}
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setFailed(true)}
          className={cn('h-full w-full object-cover', imgClassName)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#F7F5F0] p-4 text-center">
          <span className="text-sm font-semibold text-[#0B3B25]">
            {label ?? 'AgriVil Fresh'}
          </span>
        </div>
      )}
    </div>
  )
}
