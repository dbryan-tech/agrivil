'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Heart,
  Star,
  ShieldCheck,
  Leaf,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  Share2,
  Snowflake,
  MapPin,
  Users,
  Info,
  ThumbsUp,
  MessageSquare,
  Sparkles,
} from 'lucide-react'
import { products, productFarmer, farmers } from '@/lib/golden-acres/data'
import { formatGHS, freshnessLabel } from '@/lib/golden-acres/format'
import { useCart } from '@/components/golden-acres/cart-context'
import { useSession } from '@/components/golden-acres/auth/session-context'
import { MobileProductCard } from '@/components/golden-acres/mobile/mobile-product-card'
import { cn } from '@/lib/utils'

export default function MobileProductDetailScreen() {
  const params = useParams<{ slug: string }>()
  const rawSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || ''
  const router = useRouter()
  const { add } = useCart()
  const { isSaved, toggleWishlist } = useSession()

  // Find product by slug or fallback
  const product = products.find((p) => p.slug === rawSlug) || products[0]
  const defaultFarmer = productFarmer(product)

  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [selectedOfferIndex, setSelectedOfferIndex] = useState(0)

  const saved = isSaved(product.id)
  const fresh = freshnessLabel(product.expiryDate)

  // Real competing farmer offers for this product
  const competingOffers = useMemo(() => {
    const otherFarmers = farmers.filter((f) => f.id !== defaultFarmer.id).slice(0, 2)
    return [
      {
        id: defaultFarmer.id,
        farmer: defaultFarmer,
        name: defaultFarmer.farmName,
        region: `${defaultFarmer.region} (${defaultFarmer.distanceKm || 15}km)`,
        price: product.pricePerKg || product.priceMin,
        image: product.image,
        rating: defaultFarmer.rating,
        freshness: fresh.label || 'Just Harvested',
        freshnessColor: fresh.color || '#0B3B25',
      },
      ...otherFarmers.map((f, i) => ({
        id: f.id,
        farmer: f,
        name: f.farmName || f.name,
        region: `${f.region} (${f.distanceKm || (i === 0 ? 45 : 85)}km)`,
        price: (product.pricePerKg || product.priceMin) * (i === 0 ? 1.05 : 0.95),
        image: product.image,
        rating: f.rating,
        freshness: i === 0 ? 'Just Harvested' : 'Fresh Picked',
        freshnessColor: i === 0 ? '#0B3B25' : '#F59E0B',
      })),
    ]
  }, [defaultFarmer, product, fresh])

  const activeOffer = competingOffers[selectedOfferIndex] || competingOffers[0]
  const activeFarmer = activeOffer.farmer
  const activePrice = activeOffer.price
  const activeImage = activeOffer.image || product.image
  const lineEstimate = activePrice * qty

  const farmerHarvests = products
    .filter((p) => p.farmerId === activeFarmer.id && p.id !== product.id)
    .slice(0, 4)
  const displayRelated = farmerHarvests.length > 0
    ? farmerHarvests
    : products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  // Customer Reviews Data
  const productReviews = [
    {
      id: 'rev-1',
      author: 'Akua Mansa',
      location: 'East Legon, Accra',
      rating: 5,
      date: 'Yesterday',
      verified: true,
      comment: `Incredible freshness! Picked at dawn from ${activeFarmer.farmName} and arrived chilled in great condition. Best quality I've had in Accra.`,
      helpful: 12,
    },
    {
      id: 'rev-2',
      author: 'Kofi Mensah',
      location: 'Cantonments, Accra',
      rating: 5,
      date: '3 days ago',
      verified: true,
      comment: `Crisp, aromatic, and perfectly weighed. You can really taste the difference when produce comes direct from local growers.`,
      helpful: 8,
    },
    {
      id: 'rev-3',
      author: 'Serwaa Bonsu',
      location: 'Kumasi',
      rating: 4,
      date: '1 week ago',
      verified: true,
      comment: `Very clean and well packaged in chilled boxes. Delivery driver was polite and called ahead.`,
      helpful: 5,
    },
  ]

  function handleAddToCart() {
    add({ ...product, pricePerKg: activePrice, priceMin: activePrice }, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="relative min-h-dvh w-full bg-[#FAF9F6] pb-32 text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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

      {/* ========================================================
          1. FULL-BLEED TOP HERO IMAGE SHELL (Auto-fills the whole card)
         ======================================================== */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-b-[32px] bg-white shadow-xs">
        {/* Full Image Auto-Fill with scale & object-cover */}
        <Image
          key={activeImage}
          src={activeImage}
          alt={product.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-[1.05] transition-all duration-300 select-none"
        />

        {/* Floating Top Navigation Header */}
        <header
          className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-3.5 pt-3"
          style={{ paddingTop: 'max(env(safe-area-inset-top), 12px)' }}
        >
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#211A12] shadow-sm border border-[rgba(33,26,18,0.08)] active:scale-95 transition-transform backdrop-blur-xs"
          >
            <ArrowLeft className="h-4 w-4 stroke-[2.4]" />
          </button>

          <div className="flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider text-[#211A12] shadow-sm border border-[rgba(33,26,18,0.08)] backdrop-blur-xs">
            <span className="capitalize">{product.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-label="Favorite"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#211A12] shadow-sm border border-[rgba(33,26,18,0.08)] active:scale-95 transition-transform backdrop-blur-xs"
            >
              <Heart
                className={cn(
                  'h-4.5 w-4.5',
                  saved ? 'fill-[#E86328] text-[#E86328]' : 'text-[#211A12]'
                )}
              />
            </button>
          </div>
        </header>

        {/* Floating Badges */}
        <div className="absolute top-16 left-3.5 z-20 flex flex-col gap-1.5">
          {product.organic && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#0B3B25] px-2.5 py-0.5 text-[9.5px] font-black uppercase tracking-wider text-white shadow-xs">
              <Leaf className="h-3 w-3" />
              Organic
            </span>
          )}
        </div>

        <div className="absolute top-16 right-3.5 z-20">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-0.5 text-[9.5px] font-black uppercase tracking-wider text-white backdrop-blur-md shadow-xs">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: activeOffer.freshnessColor }}
            />
            {activeOffer.freshness}
          </span>
        </div>
      </div>

      {/* ========================================================
          2. STRIPPED CONTENT (Direct on background)
         ======================================================== */}
      <div className="relative px-3.5 pt-4 space-y-4">
        {/* Title, Farm Link, Ratings, Price & Description */}
        <div className="space-y-1.5">
          {/* Farm Attribution Link */}
          <Link
            href={`/m/farmers/${activeFarmer.slug || activeFarmer.id}`}
            className="inline-flex items-center gap-1 text-[12px] font-extrabold text-[#7A3F1C] hover:underline"
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>{activeOffer.name} · {activeOffer.region}</span>
          </Link>

          {/* Product Title */}
          <h1 className="text-[24px] font-black tracking-tight text-[#211A12] leading-tight">
            {product.name}
          </h1>

          {/* Star Rating & Reviews */}
          <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#5C5247]">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-3.5 w-3.5 fill-[#F0A81E] text-[#F0A81E]"
                />
              ))}
            </div>
            <span className="font-black text-[#211A12]">{activeOffer.rating.toFixed(1)}</span>
            <span>({activeFarmer.reviewCount || 84} verified reviews)</span>
          </div>

          {/* Price & Unit */}
          <div className="pt-1 flex items-baseline gap-2">
            <span className="text-[28px] font-black text-[#211A12] leading-none">
              {formatGHS(activePrice)}
            </span>
            <span className="text-[13px] font-bold text-[#5C5247]">
              / {product.unit}
            </span>
            {product.pricePerKg && (
              <span className="ml-1 rounded-full bg-[#0B3B25]/10 px-2 py-0.5 text-[10.5px] font-black text-[#0B3B25]">
                {formatGHS(activePrice)}/kg
              </span>
            )}
          </div>

          {/* Product Description */}
          <p className="pt-1 text-[13px] font-medium leading-relaxed text-[#5C5247]">
            {product.description}
          </p>
        </div>

        {/* Feature Badges Strip (Clean text, zero bubble wraps) */}
        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 pt-0.5 text-[11.5px] font-bold text-[#5C5247]">
          {product.organic && (
            <span className="inline-flex items-center gap-1 text-[#0B3B25]">
              <Leaf className="h-3.5 w-3.5" />
              <span>100% Certified Organic</span>
            </span>
          )}
          {product.refrigerationRequired && (
            <span className="inline-flex items-center gap-1 text-[#7A3F1C]">
              <Snowflake className="h-3.5 w-3.5" />
              <span>Chilled Cold-Chain Van</span>
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-[#211A12]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#0B3B25]" />
            <span>GhanaGAP Verified</span>
          </span>
        </div>

        {/* Variable-Weight Pricing Explainer (Clean inline text, zero card wrapper) */}
        {product.variableWeight && (
          <div className="flex items-start gap-2 pt-0.5 text-[11.5px] font-medium leading-relaxed text-[#5C5247]">
            <Info className="h-4 w-4 text-[#7A3F1C] shrink-0 mt-0.5" />
            <p>
              <strong className="text-[#211A12] font-black">Priced by weight:</strong> You are charged an estimate of{' '}
              <strong className="text-[#211A12] font-black">{formatGHS(activePrice)}</strong> now; the final total is reconciled to the exact weight picked (typically {formatGHS(product.priceMin)}–{formatGHS(product.priceMax)}). You only pay for what you receive.
            </p>
          </div>
        )}

        {/* Multi-Farmer Marketplace Comparison (Direct on background) */}
        <div className="pt-2">
          <div className="flex items-center justify-between pb-2">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8A7E72]">
                Multi-Farmer Marketplace
              </span>
              <h3 className="text-[15px] font-black text-[#211A12]">
                Compare Farmer Prices
              </h3>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-[#7A3F1C]/10 px-2.5 py-0.5 text-[10.5px] font-extrabold text-[#7A3F1C]">
              <Users className="h-3 w-3" />
              <span>{competingOffers.length} offers</span>
            </span>
          </div>

          <div className="space-y-1.5">
            {competingOffers.map((offer, idx) => {
              const isSelected = selectedOfferIndex === idx
              return (
                <button
                  key={offer.id}
                  type="button"
                  onClick={() => setSelectedOfferIndex(idx)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-2xl p-3 text-left transition-all border shadow-2xs',
                    isSelected
                      ? 'bg-white border-[#0B3B25] ring-2 ring-[#0B3B25]/20 shadow-xs'
                      : 'bg-white/80 border-[rgba(33,26,18,0.08)] hover:bg-white'
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-[13.5px] font-black text-[#211A12] truncate">
                        {offer.name}
                      </h4>
                      {isSelected && (
                        <span className="rounded-md bg-[#0B3B25] px-1.5 py-0.5 text-[8.5px] font-black text-white">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-semibold text-[#5C5247]">
                      {offer.region} · {offer.rating.toFixed(1)} ★
                    </p>
                  </div>

                  <div className="text-right pl-2">
                    <span className="text-[15px] font-black text-[#0B3B25]">
                      {formatGHS(offer.price)}
                    </span>
                    <span className="block text-[10px] font-bold text-[#5C5247]">
                      /{product.unit}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ========================================================
            3. DYNAMIC FARMER PROFILE (HAS A DEDICATED CARD)
           ======================================================== */}
        <div className="rounded-[24px] bg-white p-4 shadow-sm border border-[rgba(33,26,18,0.06)]">
          <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8A7E72]">
            Grower Profile
          </span>
          <div className="mt-2.5 flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-white shadow-2xs">
              <Image
                src={activeFarmer.photo}
                alt={activeFarmer.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="text-[15px] font-black text-[#211A12]">
                  {activeFarmer.name}
                </h4>
                <ShieldCheck className="h-4 w-4 text-[#0B3B25]" />
              </div>
              <p className="text-[12px] font-bold text-[#7A3F1C]">
                {activeFarmer.farmName} · {activeFarmer.region}
              </p>
              <div className="mt-0.5 flex items-center gap-1 text-[11px] font-bold text-[#5C5247]">
                <Star className="h-3 w-3 fill-[#F0A81E] text-[#F0A81E]" />
                <span>{activeFarmer.rating}</span>
                <span>({activeFarmer.reviewCount || 84} reviews · Since {activeFarmer.joinedYear || 2018})</span>
              </div>
            </div>
          </div>
          <p className="mt-2.5 text-[12px] font-medium leading-relaxed text-[#5C5247] border-t border-[rgba(33,26,18,0.06)] pt-2.5">
            {activeFarmer.bio}
          </p>
        </div>

        {/* Farm-to-Door Specifications (Clean 2-column grid, zero cards) */}
        <div className="pt-1">
          <h3 className="pb-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#8A7E72]">
            Farm-to-Door Specifications
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7E72]">
                Harvest Date
              </span>
              <p className="mt-0.5 text-[13px] font-black text-[#211A12]">
                {product.harvestDate}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7E72]">
                Shelf Life
              </span>
              <p className="mt-0.5 text-[13px] font-black text-[#211A12]">
                {product.shelfLifeDays} Days (FEFO)
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7E72]">
                Storage
              </span>
              <p className="mt-0.5 text-[13px] font-black text-[#211A12]">
                {product.refrigerationRequired ? 'Refrigerated < 8°C' : 'Cool dry place'}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7E72]">
                Origin
              </span>
              <p className="mt-0.5 text-[13px] font-black text-[#211A12]">
                {activeFarmer.region}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[11.5px] font-bold text-[#0B3B25]">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>Freshness Promise: Instant MoMo refund on any bad batch.</span>
          </div>
        </div>

        {/* ========================================================
            4. CUSTOMER REVIEWS SECTION
           ======================================================== */}
        <div className="pt-2 space-y-3 border-t border-[rgba(33,26,18,0.06)]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8A7E72]">
                Verified Buyer Feedback
              </span>
              <h3 className="text-[16px] font-black text-[#211A12]">
                Customer Reviews
              </h3>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-[#0B3B25]/10 px-2.5 py-1 text-[12px] font-black text-[#0B3B25]">
              <Star className="h-3.5 w-3.5 fill-[#0B3B25] text-[#0B3B25]" />
              <span>4.9 / 5.0</span>
            </div>
          </div>

          {/* Rating Breakdown Summary */}
          <div className="flex items-center gap-4 rounded-2xl bg-white p-3.5 border border-[rgba(33,26,18,0.06)] shadow-2xs">
            <div className="flex flex-col items-center justify-center border-r border-[rgba(33,26,18,0.08)] pr-4">
              <span className="text-[28px] font-black text-[#211A12] leading-none">4.9</span>
              <div className="mt-1 flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-[#F0A81E] text-[#F0A81E]" />
                ))}
              </div>
              <span className="mt-0.5 text-[10px] font-bold text-[#5C5247]">84 reviews</span>
            </div>

            <div className="flex-1 space-y-1 text-[10.5px] font-bold text-[#5C5247]">
              <div className="flex items-center gap-2">
                <span className="w-3">5★</span>
                <div className="h-1.5 flex-1 rounded-full bg-[#F7F5F0] overflow-hidden">
                  <div className="h-full w-[90%] rounded-full bg-[#0B3B25]" />
                </div>
                <span className="w-6 text-right">90%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3">4★</span>
                <div className="h-1.5 flex-1 rounded-full bg-[#F7F5F0] overflow-hidden">
                  <div className="h-full w-[8%] rounded-full bg-[#0B3B25]" />
                </div>
                <span className="w-6 text-right">8%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3">3★</span>
                <div className="h-1.5 flex-1 rounded-full bg-[#F7F5F0] overflow-hidden">
                  <div className="h-full w-[2%] rounded-full bg-[#0B3B25]" />
                </div>
                <span className="w-6 text-right">2%</span>
              </div>
            </div>
          </div>

          {/* Review Cards List */}
          <div className="space-y-2">
            {productReviews.map((rev) => (
              <div
                key={rev.id}
                className="rounded-2xl bg-white p-3.5 border border-[rgba(33,26,18,0.06)] shadow-2xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0B3B25]/10 text-[11px] font-black text-[#0B3B25]">
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12.5px] font-black text-[#211A12]">{rev.author}</span>
                        {rev.verified && (
                          <span className="inline-flex items-center gap-0.5 text-[9.5px] font-bold text-[#0B3B25]">
                            <ShieldCheck className="h-3 w-3" /> Verified
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#5C5247]">{rev.location} · {rev.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-[#F0A81E] text-[#F0A81E]" />
                    ))}
                  </div>
                </div>

                <p className="text-[12px] font-medium leading-relaxed text-[#211A12]">
                  {rev.comment}
                </p>

                <div className="flex items-center gap-1 text-[10.5px] font-bold text-[#5C5247] pt-0.5">
                  <ThumbsUp className="h-3 w-3 text-[#0B3B25]" />
                  <span>{rev.helpful} people found this helpful</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================
            5. MORE FROM THIS GROWER & MARKET
           ======================================================== */}
        {displayRelated.length > 0 && (
          <div className="pt-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-[16px] font-black tracking-tight text-[#211A12]">
                  More From {activeFarmer.farmName || 'The Market'}
                </h3>
                <p className="text-[11px] font-semibold text-[#5C5247]">
                  Fresh picks you might also like
                </p>
              </div>
              <Link
                href={`/m/farmers/${activeFarmer.slug || activeFarmer.id}`}
                className="text-[12px] font-bold text-[#7A3F1C] hover:underline"
              >
                See all
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {displayRelated.map((p) => (
                <MobileProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Add to Cart Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-[rgba(33,26,18,0.08)] bg-white/95 px-3.5 pt-2.5 pb-[clamp(16px,2.5vh,22px)] backdrop-blur-md shadow-[0_-4px_20px_rgba(33,26,18,0.04)]">
        {/* Quantity Stepper */}
        <div className="flex items-center gap-2 rounded-full bg-[#F7F5F0] px-2.5 py-1 shadow-xs border border-[rgba(33,26,18,0.08)]">
          <button
            type="button"
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs active:scale-90 transition-transform"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="min-w-4 text-center text-[13px] font-black text-[#211A12]">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty(qty + 1)}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs active:scale-90 transition-transform"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>

        {/* Primary CTA Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex flex-1 ml-2.5 items-center justify-center gap-1.5 rounded-full bg-[#0B3B25] py-2.5 text-[13px] font-extrabold text-white shadow-md active:scale-[0.98] transition-transform"
        >
          {added ? (
            <>
              <Check className="h-3.5 w-3.5 stroke-[3]" />
              <span>Added to basket</span>
            </>
          ) : (
            <>
              <ShoppingBag className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Add to basket · {formatGHS(lineEstimate)}</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
