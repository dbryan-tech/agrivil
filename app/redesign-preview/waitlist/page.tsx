'use client'

import { SmartImage } from '@/components/golden-acres/smart-image'
import { UnderlineField, PillButton, StatGrid } from '@/components/golden-acres/system'

/**
 * REDESIGN PREVIEW — Waitlist page (docs/redesign/01 §4).
 * Single-column focus page: one promise, one form, zone context. The
 * confirmation state is designed (position + neighbors waiting).
 */
export default function WaitlistRedesignPreview() {
  return (
    <main className="bg-[#F7F5F0] text-[#211A12]">
      <section className="mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-32 sm:px-8 sm:pt-40 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center">
        <div>
          <p className="text-[13px] font-semibold text-[#7A3F1C]">Coming soon</p>
          <h1 className="ga-display-hero mt-4 text-[clamp(36px,4.4vw,64px)]">
            We&apos;re growing towards you.
          </h1>
          <p className="mt-6 max-w-md text-[16px] leading-relaxed text-[#5C5247] sm:text-[17px]">
            AgriVil delivers across the Greater Accra pilot zone today, and
            we&apos;re adding new areas every month. Tell us where you are and
            we&apos;ll bring the farm to your door as soon as we reach you.
          </p>

          {/* The one form */}
          <form className="mt-10 max-w-md space-y-8">
            <UnderlineField id="wl-name" label="Your name" value="" onChange={() => {}} placeholder="Ama Serwaa" required autoComplete="name" />
            <UnderlineField
              id="wl-contact"
              label="Phone or email"
              value=""
              onChange={() => {}}
              placeholder="024 000 0000"
              hint="We'll message you the day your area opens — nothing else."
              required
            />
            <UnderlineField id="wl-area" label="Your area" value="" onChange={() => {}} placeholder="e.g. Madina, Accra" />
            <PillButton type="button">Join the waitlist</PillButton>
          </form>

          {/* Confirmation state (designed; shown statically for review) */}
          <div className="mt-12 max-w-md rounded-[20px] border border-[rgba(11,59,37,0.25)] bg-[#0B3B25]/[0.06] p-6">
            <p className="ga-display-title text-[22px]">You&apos;re on the list.</p>
            <p className="mt-2 text-[14px] leading-relaxed text-[#5C5247]">
              We&apos;ll reach you the moment Madina opens for delivery.
            </p>
            <p className="ga-index mt-4 inline-flex items-center rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[#211A12] shadow-sm">
              214 neighbours already waiting
            </p>
          </div>
        </div>

        {/* Zone imagery + context */}
        <div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] border border-[rgba(33,26,18,0.05)] shadow-[0_2px_4px_rgba(33,26,18,0.05),0_16px_40px_rgba(33,26,18,0.09)]">
            <SmartImage
              src="/golden-acres/auth/auth-customer.png"
              alt="A lush Ghanaian vegetable farm at golden hour"
              fill
              className="object-cover"
            />
          </div>
          <div className="mt-8">
            <StatGrid
              stats={[
                { value: '3', label: 'Cities served today' },
                { value: 'Monthly', label: 'New areas added' },
              ]}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
