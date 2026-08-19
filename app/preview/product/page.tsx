'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  ShieldCheck,
  Truck,
  Sparkles,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  Leaf,
  Snowflake,
  MapPin,
  Users,
  ChevronRight,
  Info,
  GitCompareArrows,
} from 'lucide-react'
import { formatGHS } from '@/lib/golden-acres/format'
import { cn } from '@/lib/utils'
import {
  ProductImageShell,
  PackageBoxes3D,
  MobileProduceCardRich,
} from '@/app/preview/_lib/premium'

const COMPETING_OFFERS = [
  {
    farmerId: 'f4',
    farmerName: 'Darko Organics',
    region: 'Ho, Volta Region (170km)',
    price: 9.48,
    unit: '1 kg',
    rating: 4.9,
    freshness: 'Just Harvested',
    freshnessColor: '#0B3B25',
    isCurrent: true,
  },
  {
    farmerId: 'f1',
    farmerName: "Auntie Ama's Garden",
    region: 'Koforidua, Eastern (85km)',
    price: 10.20,
    unit: '1 kg',
    rating: 4.9,
    freshness: 'Just Harvested',
    freshnessColor: '#0B3B25',
    isCurrent: false,
  },
  {
    farmerId: 'f6',
    farmerName: 'Fati Abukari Fields',
    region: 'Tamale, Northern (420km)',
    price: 8.90,
    unit: '1 kg',
    rating: 4.7,
    freshness: 'Fresh',
    freshnessColor: '#F59E0B',
    isCurrent: false,
  },
]

const RELATED_PRODUCE = [
  {
    id: 'p2',
    slug: 'crisphead-lettuce',
    name: 'Crisphead Lettuce',
    farmName: 'Green Leaf Collective',
    image: '/golden-acres/produce/crisphead-lettuce.png',
    unit: 'each',
    price: 9.44,
    rating: 4.9,
    reviews: 41,
    organic: true,
    freshness: 'JUST HARVESTED',
    freshnessColor: '#0B3B25',
    offerCount: 6,
  },
  {
    id: 'p4',
    slug: 'kontomire',
    name: 'Kontomire (Cocoyam Leaves)',
    farmName: 'Green Leaf Collective',
    image: '/golden-acres/produce/kontomire.png',
    unit: 'bunch',
    price: 6.00,
    rating: 4.8,
    reviews: 176,
    organic: true,
    freshness: 'FRESH',
    freshnessColor: '#F59E0B',
    offerCount: 3,
  },
]

const REVIEWS_DATA = [
  {
    id: 'r1',
    author: 'Kofi Mensah',
    date: 'Yesterday',
    rating: 5,
    comment: 'Super fresh! Still had morning dew on the skin when delivered to East Legon. Best tomatoes in Accra.',
  },
  {
    id: 'r2',
    author: 'Abena Osei',
    date: '3 days ago',
    rating: 5,
    comment: 'Firm and sweet for stew. Love supporting Darko Organics directly without market middlemen markup.',
  },
]

export default function MobileProductDetailsScreen() {
  const [qty, setQty] = useState(1)
  const [liked, setLiked] = useState(false)
  const [added, setAdded] = useState(false)
  const [selectedFarmerIndex, setSelectedFarmerIndex] = useState(0)

  const currentOffer = COMPETING_OFFERS[selectedFarmerIndex]

  const product = {
    id: 'p1',
    slug: 'roma-tomatoes',
    name: 'Roma Tomatoes',
    category: 'Vegetables',
    image: '/golden-acres/produce/roma-tomatoes-1.png',
    description:
      'Firm, plump, and deeply red. Hand-picked at dawn from rich mineral soils. Ideal for rich Ghanaian stews, jollof sauce, and salads.',
    organic: true,
    coldChain: true,
    variableWeight: true,
    estWeightKg: 1.0,
    pricePerKg: currentOffer.price,
    farmer: {
      name: currentOffer.farmerName,
      farm: currentOffer.farmerName,
      location: currentOffer.region,
      photo: '/golden-acres/farmers/yaw-darko.jpg',
      bio: 'Pioneering certified organic agriculture in the Volta hills. Never uses synthetic pesticides.',
      rating: currentOffer.rating,
      reviews: 121,
      joinedYear: 2022,
    },
    specs: [
      { label: 'Harvest Date', val: 'Today at 5:30 AM' },
      { label: 'Shelf Life', val: '6 Days (FEFO Guaranteed)' },
      { label: 'Storage', val: 'Refrigerated < 8°C' },
      { label: 'Origin', val: currentOffer.region },
    ],
  }

  const lineEstimate = product.pricePerKg * qty

  const handleAdd = () => {
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="relative min-h-dvh w-full bg-[#F7F5F0] pb-32 text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Zero Scrollbar Global Styles */}
      <style jsx global>{`
        * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        *::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      `}</style>

      {/* Top warm brand gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(240px,40vh,360px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.14) 0%, rgba(240,168,30,0.08) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      {/* Header Navigation Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[rgba(33,26,18,0.08)] bg-[#F7F5F0]/90 px-5 py-3 backdrop-blur-md">
        <Link
          href="/preview/home"
          aria-label="Back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#211A12] shadow-[0_1px_4px_rgba(33,26,18,0.06)] border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="text-center">
          <nav className="text-[11px] font-bold text-[#5C5247]">
            <span>Market</span> <span className="px-1">/</span>{' '}
            <span>{product.category}</span>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLiked(!liked)}
            aria-label="Favorite"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#211A12] shadow-[0_1px_4px_rgba(33,26,18,0.06)] border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
          >
            <Heart
              className={cn(
                'h-5 w-5',
                liked ? 'fill-[#7A3F1C] text-[#7A3F1C]' : 'text-[#211A12]'
              )}
            />
          </button>
        </div>
      </header>

      <div className="relative px-5 pt-3 space-y-4">
        {/* 1. Large Hero Produce Display Card */}
        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-[28px] bg-[#FAF9F6] p-6 shadow-[0_2px_10px_-2px_rgba(33,26,18,0.05),0_8px_20px_-6px_rgba(33,26,18,0.08)] border border-[rgba(33,26,18,0.08)] ring-1 ring-white/90">
          {/* Top Badges */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
            {product.organic && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#0B3B25] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-xs">
                <Leaf className="h-3 w-3" />
                Organic
              </span>
            )}
          </div>

          <div className="absolute top-4 right-4 z-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-md shadow-xs">
              <span className="h-2 w-2 rounded-full bg-[#0B3B25]" />
              {currentOffer.freshness}
            </span>
          </div>

          {/* Large Center Photo */}
          <div className="relative my-4 flex h-48 w-48 items-center justify-center">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain filter drop-shadow-md select-none"
              priority
            />
          </div>

          {/* Title & Farmer Attribution */}
          <div className="w-full text-center">
            <Link
              href="/preview/farmers"
              className="inline-flex items-center gap-1 text-[12px] font-extrabold text-[#7A3F1C] hover:underline"
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>{product.farmer.name} · {product.farmer.location}</span>
            </Link>

            <h1 className="mt-1 text-[24px] font-black tracking-tight text-[#211A12]">
              {product.name}
            </h1>

            <div className="mt-1.5 flex items-center justify-center gap-1.5 text-[12px] font-bold text-[#5C5247]">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-[#F0A81E] text-[#F0A81E]"
                  />
                ))}
              </div>
              <span className="font-black text-[#211A12]">{product.farmer.rating}</span>
              <span>({product.farmer.reviews} reviews)</span>
            </div>

            <p className="mt-2.5 text-[12.5px] font-medium leading-relaxed text-[#3D332A] px-2">
              {product.description}
            </p>
          </div>
        </div>

        {/* 2. Feature Badges Strip */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-extrabold text-[#0B3B25] border border-[rgba(33,26,18,0.08)] shadow-2xs">
            <Leaf className="h-3.5 w-3.5" />
            <span>100% Certified Organic</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-extrabold text-[#7A3F1C] border border-[rgba(33,26,18,0.08)] shadow-2xs">
            <Snowflake className="h-3.5 w-3.5" />
            <span>Chilled Cold-Chain Van</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-extrabold text-[#211A12] border border-[rgba(33,26,18,0.08)] shadow-2xs">
            <ShieldCheck className="h-3.5 w-3.5 text-[#0B3B25]" />
            <span>GhanaGAP Verified</span>
          </div>
        </div>

        {/* 3. Variable-Weight Pricing Explainer Card */}
        <div className="rounded-[28px] bg-[#FAF9F6] p-5 shadow-[0_2px_10px_-2px_rgba(33,26,18,0.05),0_8px_20px_-6px_rgba(33,26,18,0.08)] border border-[rgba(33,26,18,0.08)] ring-1 ring-white/90">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[26px] font-black text-[#211A12]">
                {formatGHS(product.pricePerKg)}
              </span>
              <span className="text-[13px] font-bold text-[#5C5247]"> / 1 kg</span>
            </div>
            <span className="rounded-full bg-[#0B3B25]/10 px-2.5 py-1 text-[11px] font-black text-[#0B3B25]">
              {formatGHS(product.pricePerKg)}/kg
            </span>
          </div>

          <div className="mt-3 rounded-2xl bg-white/80 p-3.5 border border-[rgba(33,26,18,0.06)]">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-[#7A3F1C] shrink-0 mt-0.5" />
              <p className="text-[11.5px] font-semibold leading-relaxed text-[#5C5247]">
                <strong className="text-[#211A12]">Priced by weight:</strong> You are charged an estimate of{' '}
                <strong className="text-[#211A12]">{formatGHS(product.pricePerKg)}</strong> now; the final price is reconciled to the exact weight picked (typically {formatGHS(product.pricePerKg * 0.9)}–{formatGHS(product.pricePerKg * 1.1)}). You only pay for what you receive.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Competing Farmer Offers Comparison Section */}
        <div className="rounded-[28px] bg-[#FAF9F6] p-5 shadow-[0_2px_10px_-2px_rgba(33,26,18,0.05),0_8px_20px_-6px_rgba(33,26,18,0.08)] border border-[rgba(33,26,18,0.08)] ring-1 ring-white/90">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(33,26,18,0.06)]">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
                Multi-Farmer Marketplace
              </span>
              <h3 className="text-[15px] font-black text-[#211A12]">
                Compare Farmer Prices
              </h3>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-[#7A3F1C]/10 px-2.5 py-1 text-[11px] font-extrabold text-[#7A3F1C]">
              <Users className="h-3.5 w-3.5" />
              <span>{COMPETING_OFFERS.length} offers</span>
            </span>
          </div>

          <div className="mt-3 space-y-2.5">
            {COMPETING_OFFERS.map((offer, idx) => {
              const isSelected = selectedFarmerIndex === idx
              return (
                <button
                  key={offer.farmerId}
                  type="button"
                  onClick={() => setSelectedFarmerIndex(idx)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-2xl p-3.5 text-left transition-all border',
                    isSelected
                      ? 'bg-white border-[#0B3B25] ring-2 ring-[#0B3B25]/20 shadow-xs'
                      : 'bg-white/60 border-[rgba(33,26,18,0.08)] hover:bg-white'
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[13.5px] font-black text-[#211A12] truncate">
                        {offer.farmerName}
                      </h4>
                      {isSelected && (
                        <span className="rounded-md bg-[#0B3B25] px-1.5 py-0.5 text-[9px] font-black text-white">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-semibold text-[#5C5247]">
                      {offer.region} · {offer.rating} ★
                    </p>
                  </div>

                  <div className="text-right pl-3">
                    <span className="text-[15px] font-black text-[#0B3B25]">
                      {formatGHS(offer.price)}
                    </span>
                    <span className="block text-[10px] font-bold text-[#5C5247]">
                      /{offer.unit}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* 5. Farmer Mini-Profile & Story Card */}
        <div className="rounded-[28px] bg-[#FAF9F6] p-5 shadow-[0_2px_10px_-2px_rgba(33,26,18,0.05),0_8px_20px_-6px_rgba(33,26,18,0.08)] border border-[rgba(33,26,18,0.08)] ring-1 ring-white/90">
          <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
            Farmer Profile
          </span>
          <div className="mt-3 flex items-center gap-3.5">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-white shadow-2xs border border-[rgba(33,26,18,0.10)]">
              <Image
                src={product.farmer.photo}
                alt={product.farmer.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="text-[15px] font-extrabold text-[#211A12]">
                  {product.farmer.name}
                </h4>
                <ShieldCheck className="h-4 w-4 text-[#0B3B25]" />
              </div>
              <p className="text-[12px] font-bold text-[#7A3F1C]">
                {product.farmer.location}
              </p>
              <div className="mt-0.5 flex items-center gap-1 text-[11px] font-bold text-[#5C5247]">
                <Star className="h-3 w-3 fill-[#F0A81E] text-[#F0A81E]" />
                <span>{product.farmer.rating}</span>
                <span>({product.farmer.reviews} reviews · Since {product.farmer.joinedYear})</span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-[12px] font-medium leading-relaxed text-[#3D332A] border-t border-[rgba(33,26,18,0.06)] pt-2.5">
            {product.farmer.bio}
          </p>
        </div>

        {/* 6. Freshness & Cold-Chain Specs Grid */}
        <div className="rounded-[28px] bg-[#FAF9F6] p-5 shadow-[0_2px_10px_-2px_rgba(33,26,18,0.05),0_8px_20px_-6px_rgba(33,26,18,0.08)] border border-[rgba(33,26,18,0.08)] ring-1 ring-white/90">
          <h3 className="pb-3 text-[11px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
            Farm-to-Door Specifications
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            {product.specs.map((s, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white/70 p-3 border border-[rgba(33,26,18,0.06)]"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C5247]">
                  {s.label}
                </span>
                <p className="mt-0.5 text-[12.5px] font-extrabold text-[#211A12]">
                  {s.val}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2 text-[12px] font-bold text-[#0B3B25] border-t border-[rgba(33,26,18,0.06)] pt-3">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>Freshness Promise: Instant MoMo refund on any bad batch.</span>
          </div>
        </div>

        {/* 7. Customer Reviews & Ratings */}
        <div className="rounded-[28px] bg-[#FAF9F6] p-5 shadow-[0_2px_10px_-2px_rgba(33,26,18,0.05),0_8px_20px_-6px_rgba(33,26,18,0.08)] border border-[rgba(33,26,18,0.08)] ring-1 ring-white/90">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(33,26,18,0.06)]">
            <h3 className="text-[14px] font-black text-[#211A12]">
              Customer Reviews ({product.farmer.reviews})
            </h3>
            <div className="flex items-center gap-1 text-[13px] font-black text-[#211A12]">
              <Star className="h-4 w-4 fill-[#F0A81E] text-[#F0A81E]" />
              <span>4.9 / 5.0</span>
            </div>
          </div>

          <div className="mt-3 space-y-3">
            {REVIEWS_DATA.map((rev) => (
              <div
                key={rev.id}
                className="rounded-2xl bg-white/70 p-3.5 border border-[rgba(33,26,18,0.06)]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12.5px] font-extrabold text-[#211A12]">
                      {rev.author}
                    </span>
                    <span className="rounded-md bg-[#0B3B25]/10 px-1.5 py-0.2 text-[9px] font-bold text-[#0B3B25]">
                      Verified Buyer
                    </span>
                  </div>
                  <span className="text-[10.5px] font-semibold text-[#5C5247]">
                    {rev.date}
                  </span>
                </div>
                <div className="mt-1 flex items-center">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3 w-3 fill-[#F0A81E] text-[#F0A81E]"
                    />
                  ))}
                </div>
                <p className="mt-1.5 text-[12px] font-medium leading-relaxed text-[#3D332A]">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 8. More from the Market (Related Produce) */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-[16px] font-extrabold tracking-tight text-[#211A12]">
                More From The Market
              </h3>
              <p className="text-[11px] font-semibold text-[#5C5247]">
                Fresh picks you might also like
              </p>
            </div>
            <Link
              href="/preview/categories"
              className="text-[12px] font-bold text-[#7A3F1C] hover:underline"
            >
              See all
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {RELATED_PRODUCE.map((prod) => (
              <MobileProduceCardRich
                key={prod.id}
                id={prod.id}
                slug={prod.slug}
                name={prod.name}
                farmName={prod.farmName}
                image={prod.image}
                price={prod.price}
                unit={prod.unit}
                rating={prod.rating}
                reviews={prod.reviews}
                organic={prod.organic}
                freshness={prod.freshness}
                freshnessColor={prod.freshnessColor}
                offerCount={prod.offerCount}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Add to Cart Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-[rgba(33,26,18,0.08)] bg-[#F7F5F0]/95 px-5 pt-3 pb-[clamp(18px,2.8vh,24px)] backdrop-blur-md shadow-[0_-4px_20px_rgba(33,26,18,0.04)]">
        {/* Quantity Stepper */}
        <div className="flex items-center gap-3 rounded-full bg-white px-3 py-1.5 shadow-xs border border-[rgba(33,26,18,0.10)]">
          <button
            type="button"
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F7F5F0] text-[#211A12] active:scale-90 transition-transform"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-5 text-center text-[14px] font-black text-[#211A12]">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty(qty + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F7F5F0] text-[#211A12] active:scale-90 transition-transform"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Primary CTA Button */}
        <button
          type="button"
          onClick={handleAdd}
          className="flex flex-1 ml-3 items-center justify-center gap-2 rounded-full bg-[#0B3B25] py-3 text-[14px] font-extrabold text-white shadow-md active:scale-[0.98] transition-transform"
        >
          {added ? (
            <>
              <Check className="h-4 w-4 stroke-[3]" />
              <span>Added to basket</span>
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4 stroke-[2.5]" />
              <span>Add to basket · {formatGHS(lineEstimate)}</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
