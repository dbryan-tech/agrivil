import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  Wheat,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Timer,
  Scale,
  Sparkles,
  ArrowRight,
  Leaf,
  Users,
  Check,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About AgriVil — Transforming Ghana’s Agricultural Supply Chain',
  description:
    'AgriVil (by Golden Acres Ghana) is rebuilding the perishable food supply chain in Ghana. Connecting local farmers directly with consumers through cold-chain logistics, Mobile Money, and GhanaPostGPS.',
}

const PILLARS = [
  {
    icon: Timer,
    title: 'Guaranteed 48h MoMo Payouts',
    desc: 'Farmers receive net settlement directly to their Mobile Money wallets within 48 hours of delivery, ending traditional multi-month middlemen debt cycles.',
  },
  {
    icon: Truck,
    title: 'FEFO Cold-Chain Logistics',
    desc: 'Our Tema aggregation hub utilizes First-Expiry, First-Out (FEFO) batch tracking and temperature-monitored 3PL dispatch to eliminate post-harvest spoilage.',
  },
  {
    icon: Scale,
    title: 'Variable-Weight Fair Pricing',
    desc: 'Ghanaian produce varies naturally in size. We provide transparent price ranges and reconcile exact post-pick weights before final charge capture.',
  },
  {
    icon: ShieldCheck,
    title: 'GhanaPostGPS Proximity Matching',
    desc: 'We route deliveries intelligently by matching households to the nearest participating farms, reducing transport emissions and delivery fees.',
  },
]

const STATS = [
  { value: '48h', label: 'Farmer Payout SLA' },
  { value: '< 2%', label: 'Hub Spoilage Rate' },
  { value: '100%', label: 'Traceable to Farm' },
  { value: '10+', label: 'Ghanaian Regions' },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0B3B25]/10 px-3.5 py-1 text-xs font-black text-[#0B3B25]">
          <Leaf className="h-3.5 w-3.5" /> Our Mission
        </span>
        <h1 className="ga-headline mt-4 text-4xl font-black tracking-tight text-[#211A12] sm:text-5xl lg:text-6xl">
          Fresh from Ghana’s soil,{' '}
          <span className="ga-serif font-normal text-[#0B3B25]">delivered cold</span>{' '}
          to your door.
        </h1>
        <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#5C5247]">
          In Ghana, up to 40% of fresh food spoils before reaching urban kitchens due to
          fragmented logistics, lack of cold-chain infrastructure, and delayed middlemen payments.
          AgriVil was founded under Golden Acres Ghana to build a modern, high-speed bridge between
          rural smallholders and urban families.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="mt-10 grid grid-cols-2 gap-4 rounded-[24px] border border-black/[0.04] bg-white p-6 sm:grid-cols-4 sm:p-8 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="ga-display text-3xl font-black text-[#0B3B25] sm:text-4xl">
              {s.value}
            </p>
            <p className="mt-1 text-xs font-semibold text-[#5C5247] sm:text-sm">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* The 4 Pillars */}
      <div className="mt-16">
        <div className="text-center">
          <p className="ga-kicker font-extrabold text-[#7A3F1C]">Engineered for Ghana</p>
          <h2 className="ga-headline mt-2 text-3xl font-black text-[#211A12] sm:text-4xl">
            Why our model works
          </h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => {
            const Icon = p.icon
            return (
              <div
                key={p.title}
                className="flex flex-col justify-between rounded-[24px] border border-black/[0.04] bg-white p-6 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]"
              >
                <div>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0B3B25]/10 text-[#0B3B25]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="ga-headline mt-4 text-lg font-black text-[#211A12]">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#5C5247]">
                    {p.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Story section */}
      <div className="mt-16 rounded-[28px] bg-[#FAF7F2] p-8 sm:p-12 border border-black/[0.04]">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#7A3F1C]">
              Direct From Smallholders
            </span>
            <h2 className="ga-headline mt-2 text-3xl font-black text-[#211A12] sm:text-4xl">
              Putting farmers first, always.
            </h2>
            <p className="mt-4 leading-relaxed text-[#5C5247]">
              When you buy an organic cabbage from Auntie Ama in Koforidua or pona yam from
              Kwame Mensah in Ejisu, 85% of your purchase goes directly to the farmer.
              We handle the aggregation, cold storage in Tema, packaging, and digital address delivery.
            </p>
            <p className="mt-4 leading-relaxed text-[#5C5247]">
              By cutting out predatory layers of intermediaries and enforcing strict standard
              operating procedures (SOPs), our farmers earn up to 35% higher net incomes while
              consumers enjoy fresher produce at lower prices than supermarket markups.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="ga-press inline-flex items-center gap-2 rounded-full bg-[#0B3B25] px-6 py-3.5 text-sm font-black text-white shadow-sm hover:bg-[#072618]"
              >
                Shop today’s harvest <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sell"
                className="ga-press inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-6 py-3.5 text-sm font-bold text-[#211A12] hover:bg-[#F7F5F0]"
              >
                Apply as a grower
              </Link>
            </div>
          </div>

          <div className="rounded-[24px] border border-black/[0.04] bg-white p-6 sm:p-7 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
            <div className="flex items-center gap-3.5 mb-4">
              <Image
                src="/agrivil-stamp.svg"
                alt="AgriVil Guarantee"
                width={48}
                height={48}
                className="h-12 w-12 shrink-0"
              />
              <div>
                <h3 className="ga-headline text-xl font-black text-[#211A12]">
                  Our Freshness SLA
                </h3>
                <p className="text-xs font-bold text-[#7A3F1C]">100% Certified Farm-to-Door</p>
              </div>
            </div>
            <ul className="mt-4 space-y-3.5 text-sm text-[#5C5247]">
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0B3B25]/15 text-[#0B3B25]">
                  <Check className="h-3 w-3 stroke-[2.5]" />
                </span>
                <span>
                  <strong className="text-[#211A12]">Harvested at dawn:</strong> Vegetables picked before midday sun to preserve natural moisture and sweetness.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0B3B25]/15 text-[#0B3B25]">
                  <Check className="h-3 w-3 stroke-[2.5]" />
                </span>
                <span>
                  <strong className="text-[#211A12]">Cold-chain transit:</strong> Perishable items travel in temperature-managed insulated containers.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0B3B25]/15 text-[#0B3B25]">
                  <Check className="h-3 w-3 stroke-[2.5]" />
                </span>
                <span>
                  <strong className="text-[#211A12]">30-Minute Guarantee:</strong> Any damaged or unsatisfactory item is refunded instantly to your MoMo or card.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
