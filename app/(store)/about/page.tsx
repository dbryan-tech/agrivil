import type { Metadata } from 'next'
import Link from 'next/link'
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
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
          <Leaf className="h-3.5 w-3.5" /> Our Mission
        </span>
        <h1 className="ga-display mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Fresh from Ghana’s soil,{' '}
          <span className="ga-serif font-normal text-primary">delivered cold</span>{' '}
          to your door.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          In Ghana, up to 40% of fresh food spoils before reaching urban kitchens due to
          fragmented logistics, lack of cold-chain infrastructure, and delayed middlemen payments.
          AgriVil was founded under Golden Acres Ghana to build a modern, high-speed bridge between
          rural smallholders and urban families.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="mt-14 grid grid-cols-2 gap-4 rounded-3xl border border-border bg-card p-6 sm:grid-cols-4 sm:p-8">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="ga-display text-3xl font-bold text-primary sm:text-4xl">
              {s.value}
            </p>
            <p className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* The 4 Pillars */}
      <div className="mt-20">
        <div className="text-center">
          <p className="ga-eyebrow text-primary">Engineered for Ghana</p>
          <h2 className="ga-display mt-2 text-3xl font-bold text-foreground sm:text-4xl">
            Why our model works
          </h2>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => {
            const Icon = p.icon
            return (
              <div
                key={p.title}
                className="ga-card-hover rounded-2xl border border-border bg-card p-6 transition-all"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="ga-display mt-5 text-lg font-bold text-foreground">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Story section */}
      <div className="mt-20 rounded-3xl border border-border bg-secondary/40 p-8 sm:p-12 lg:p-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              The Golden Acres Standard
            </span>
            <h2 className="ga-display mt-2 text-3xl font-bold text-foreground sm:text-4xl">
              A fair deal for every grower
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              When you buy an organic cabbage from Auntie Ama in Koforidua or pona yam from
              Kwame Mensah in Ejisu, 85% of your purchase goes directly to the farmer.
              We handle the aggregation, cold storage in Tema, packaging, and digital address delivery.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              By cutting out predatory layers of intermediaries and enforcing strict standard
              operating procedures (SOPs), our farmers earn up to 35% higher net incomes while
              consumers enjoy fresher produce at lower prices than supermarket markups.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="ga-press inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
              >
                Shop today’s harvest <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sell"
                className="ga-press inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-bold text-foreground hover:bg-secondary"
              >
                Apply as a grower
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="ga-display text-xl font-bold text-foreground">
              Our Freshness SLA
            </h3>
            <ul className="mt-4 space-y-3.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                  ✓
                </span>
                <span>
                  <strong>Harvested at dawn:</strong> Vegetables picked before midday sun to preserve natural moisture and sweetness.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                  ✓
                </span>
                <span>
                  <strong>Cold-chain transit:</strong> Perishable items travel in temperature-managed insulated containers.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                  ✓
                </span>
                <span>
                  <strong>30-Minute Guarantee:</strong> Any damaged or unsatisfactory item is refunded instantly to your MoMo or card.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
