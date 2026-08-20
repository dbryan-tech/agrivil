import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Scale, CheckCircle2, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service — AgriVil',
  description:
    'Terms and conditions for buying and selling fresh agricultural produce on AgriVil (Golden Acres Ghana). Variable-weight pricing, perishable refund SLAs, and delivery policies.',
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-2 py-7 sm:px-3 lg:px-4">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Storefront
      </Link>

      <header className="mt-6 border-b border-border pb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
          <FileText className="h-3.5 w-3.5" /> Customer &amp; Grower Agreement
        </span>
        <h1 className="ga-display mt-3 text-3xl font-bold text-foreground sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: August 2026 · Governing transactions in the Republic of Ghana
        </p>
      </header>

      <div className="prose prose-neutral mt-8 max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground dark:prose-invert">
        <section>
          <h2 className="ga-display text-xl font-bold text-foreground">
            1. The AgriVil Platform
          </h2>
          <p>
            AgriVil operates a specialized digital marketplace connecting verified agricultural producers in Ghana with commercial and residential consumers. By placing an order or registering as a grower, you agree to these Terms.
          </p>
        </section>

        <section>
          <h2 className="ga-display text-xl font-bold text-foreground">
            2. Variable-Weight Pricing &amp; Reconciliation
          </h2>
          <p>
            Due to the natural characteristics of fresh farm produce (such as tubers, yams, fruits, and livestock products), listed items may feature variable-weight pricing.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>At checkout, you are charged an estimate based on the target weight range.</li>
            <li>Upon harvesting and picking at the hub, the produce is weighed on calibrated digital scales.</li>
            <li>The final price is reconciled: if the actual weight is lower than estimated, the difference is immediately credited or refunded to your Mobile Money account.</li>
          </ul>
        </section>

        <section>
          <h2 className="ga-display text-xl font-bold text-foreground">
            3. Scheduled Delivery &amp; GhanaPostGPS Accuracy
          </h2>
          <p>
            All deliveries require a valid GhanaPostGPS digital address code. Customers must ensure an authorized recipient is available during the chosen delivery slot window (e.g. 8:00 AM – 1:00 PM). If a driver cannot access the premises due to an incorrect code or unreachable contact, a redelivery fee may apply.
          </p>
        </section>

        <section>
          <h2 className="ga-display text-xl font-bold text-foreground">
            4. Freshness Guarantee &amp; 30-Minute Instant Refund SLA
          </h2>
          <p>
            Perishable items must be inspected upon delivery. In the rare event that produce arrives damaged, spoiled, or missing, submit a report via our{' '}
            <Link href="/help" className="font-semibold text-primary underline">
              Help Center
            </Link>{' '}
            or order tracking feedback within 24 hours of delivery. Our customer support team resolves and issues full or partial Mobile Money refunds in under 30 minutes.
          </p>
        </section>

        <section>
          <h2 className="ga-display text-xl font-bold text-foreground">
            5. Farmer Standard Operating Procedures (SOPs)
          </h2>
          <p>
            Participating growers must abide by strict quality criteria, including First-Expiry, First-Out (FEFO) batching and early-morning harvest protocols. Failure to maintain advertised stock levels or shipping sub-standard produce incurs automated SOP penalty deductions as outlined in the Farmer Agreement.
          </p>
        </section>
      </div>
    </div>
  )
}
