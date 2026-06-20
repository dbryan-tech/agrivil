import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: { label: string; href?: string; onClick?: () => void }
  className?: string
}

/**
 * Consistent illustrated empty state used across the app (empty cart, no
 * wishlist items, no orders, empty queues, etc.). Keeps blank screens friendly
 * and on-brand instead of jarringly empty.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-14 text-center',
        className,
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ga-field,theme(colors.primary.DEFAULT))]/10 text-[var(--ga-field,theme(colors.primary.DEFAULT))]">
        <Icon className="h-7 w-7" strokeWidth={1.75} />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-pretty text-lg font-bold text-foreground">{title}</h3>
        {description && (
          <p className="mx-auto max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action &&
        (action.href ? (
          <Link
            href={action.href}
            className="mt-1 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className="mt-1 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            {action.label}
          </button>
        ))}
    </div>
  )
}
