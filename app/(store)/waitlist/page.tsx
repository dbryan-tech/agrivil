import type { Metadata } from 'next'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { WaitlistForm } from '@/components/golden-acres/waitlist-form'

export const metadata: Metadata = {
  title: 'Join the Waitlist — AgriVil',
  description:
    "We're expanding across Greater Accra. Join the waitlist and be first to know when we deliver to your area.",
}

export default function WaitlistPage() {
  return (
    <div className="ga-root min-h-screen bg-background">
      <div className="mx-auto grid max-w-6xl gap-6 px-2 py-8 sm:px-3 lg:grid-cols-2 lg:items-center lg:px-4">
        <div className="ga-fade-up">
          <p className="text-sm font-bold uppercase tracking-wide text-gold">Coming soon</p>
          <h1 className="ga-display mt-2 text-balance text-4xl font-semibold text-foreground sm:text-5xl">
            We&apos;re growing towards you
          </h1>
          <p className="mt-4 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
            AgriVil delivers across the Greater Accra pilot zone today, and we&apos;re adding
            new areas every month. Tell us where you are and we&apos;ll bring the farm to your door
            as soon as we reach you.
          </p>
          <div className="mt-8 max-w-md">
            <WaitlistForm compact />
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
          <SmartImage
            src="/golden-acres/auth/auth-customer.png"
            alt="A lush Ghanaian vegetable farm at golden hour"
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  )
}
