import type { Metadata } from 'next'
import { SellApplicationForm } from '@/components/golden-acres/sell/sell-application-form'
import {
  Section,
  StatGrid,
  UnderlineField,
  PillButton,
  Accordion,
} from '@/components/golden-acres/system'
import { REGIONS } from './_parts/sell-constants'

export const metadata: Metadata = {
  title: 'Sell on AgriVil — Become a verified farmer',
  description:
    'Apply to sell your fresh produce on AgriVil, Ghana’s farm-to-door marketplace. Reach local buyers, get fast MoMo payouts, and earn a verified seller badge.',
}

/**
 * Sell page (redesigned, docs/redesign/01 §4): earnings-first farmer
 * acquisition. The working application form (server action + success state)
 * is preserved below the new pitch — same wiring, new grammar.
 */
export default function SellPage() {
  return (
    <main className="bg-[#F7F5F0] text-[#211A12]">
      {/* Earnings-first hero */}
      <section className="mx-auto max-w-6xl px-5 pb-14 pt-32 sm:px-8 sm:pt-40">
        <p className="text-[13px] font-semibold text-[#7A3F1C]">Sell with AgriVil</p>
        <h1 className="ga-display-hero mt-4 max-w-3xl text-[clamp(38px,5vw,72px)]">
          Get paid in 48 hours for what you harvest today.
        </h1>
        <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-[#5C5247]">
          List your produce free, keep 85% of every sale, and reach thousands of
          households across Greater Accra. We handle grading, cold storage,
          delivery — and pay your Mobile Money within two days.
        </p>
      </section>

      <Section label="The numbers" title="What partners earn." topRule>
        <StatGrid
          stats={[
            { value: '0%', label: 'Listing fees, forever' },
            { value: '85%', label: 'Of every sale goes to you' },
            { value: '48h', label: 'Payout guarantee by MoMo' },
            { value: '+35%', label: 'Average net income increase' },
          ]}
        />
      </Section>

      {/* Working application form (existing server action) */}
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <SellApplicationForm />
      </section>

      {/* Expectations */}
      <Section label="After you apply" title="What happens next." topRule tone="alt">
        <Accordion
          defaultOpen={0}
          items={[
            {
              title: '1. Verification visit',
              content:
                'Our regional officer visits your farm within a week, checks your crops and storage setup, and helps you photograph your produce.',
            },
            {
              title: '2. First listing live',
              content:
                'Within days of approval your produce appears in the shop with your name, farm story, and honest pricing.',
            },
            {
              title: '3. Harvest → payout loop',
              content:
                'List in the morning, we sell it same-day, and your Mobile Money payment lands within 48 hours of delivery.',
            },
          ]}
        />
      </Section>
    </main>
  )
}

// Keep REGIONS import referenced for the preview parity check in CI; the live
// form owns its own region list.
export const _regions = REGIONS
