import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy — AgriVil',
  description:
    'How AgriVil (Golden Acres Ghana) protects your data, location, and Mobile Money transactions under Ghana Data Protection Act 2012 (Act 843).',
}

export default function PrivacyPage() {
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
          <ShieldCheck className="h-3.5 w-3.5" /> Data Protection &amp; Security
        </span>
        <h1 className="ga-display mt-3 text-3xl font-bold text-foreground sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: August 2026 · Compliant with Ghana Data Protection Act, 2012 (Act 843)
        </p>
      </header>

      <div className="prose prose-neutral mt-8 max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground dark:prose-invert">
        <section>
          <h2 className="ga-display text-xl font-bold text-foreground">
            1. Overview &amp; Data Controller
          </h2>
          <p>
            AgriVil is operated by Golden Acres Ghana Limited (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). We are committed to protecting the privacy of our consumers, participating farmers, and delivery partners across Ghana. This Privacy Policy details how we collect, process, and safeguard your personal information when you use our marketplace platform and logistics services.
          </p>
        </section>

        <section>
          <h2 className="ga-display text-xl font-bold text-foreground">
            2. Information We Collect
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Account &amp; Contact Details:</strong> Full name, email address, phone number (used for Mobile Money and SMS order notifications).
            </li>
            <li>
              <strong>Digital Delivery Address:</strong> GhanaPostGPS digital addresses, neighborhood/area, and GPS coordinates used exclusively for calculating route proximity and 3PL dispatch.
            </li>
            <li>
              <strong>Transaction &amp; Payment Data:</strong> Mobile Money provider (MTN, Telecel/Vodafone, AirtelTigo) and transaction reference codes processed securely via Paystack. We do not store your MoMo PIN or complete bank card numbers on our servers.
            </li>
            <li>
              <strong>Farmer Verification Records:</strong> KYC identification, farm gate location GPS, and mobile money settlement numbers for verified growers.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="ga-display text-xl font-bold text-foreground">
            3. How We Use Your Information
          </h2>
          <p>
            We process your data strictly for legitimate operational purposes:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Dispatching perishable produce orders through our cold-chain network.</li>
            <li>Sending critical transactional SMS alerts regarding picking, departure, and arrival.</li>
            <li>Automating guaranteed 48-hour Mobile Money settlement payouts to farmers.</li>
            <li>Powering our proximity recommendation algorithm (&ldquo;MarketPlace Match&rdquo;) to show closest local growers.</li>
            <li>Resolving customer service inquiries with encrypted message logs.</li>
          </ul>
        </section>

        <section>
          <h2 className="ga-display text-xl font-bold text-foreground">
            4. Security &amp; Encryption
          </h2>
          <p>
            We enforce industry-standard security safeguards. Customer service communications and ticket payloads are encrypted at rest using AES-256-GCM. Webhook payloads from payment gateways and 3PL carriers are cryptographically signed and verified using HMAC hashes to prevent data interception or tampering.
          </p>
        </section>

        <section>
          <h2 className="ga-display text-xl font-bold text-foreground">
            5. Your Rights Under Act 843
          </h2>
          <p>
            Under the Data Protection Act of Ghana, you have the right to request access to your personal data, rectify inaccurate records, or request complete deletion of your account. Contact our Data Protection Officer at{' '}
            <a href="mailto:privacy@agrivil.gh" className="font-semibold text-primary underline">
              privacy@agrivil.gh
            </a>.
          </p>
        </section>
      </div>
    </div>
  )
}
