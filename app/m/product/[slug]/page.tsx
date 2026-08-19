'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
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
} from 'lucide-react'
import { products, productFarmer } from '@/lib/golden-acres/data'
import { formatGHS, freshnessLabel } from '@/lib/golden-acres/format'
import { useCart } from '@/components/golden-acres/cart-context'
import { useSession } from '@/components/golden-acres/auth/session-context'
import { MobileProductCard } from '@/components/golden-acres/mobile/mobile-product-card'
import { cn } from '@/lib/utils'

export default function MobileProductDetailScreen() {
  const params = useParams<{ slug: string }>()
  const rawSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || ''
  const { add } = useCart()
  const { isSaved, toggleWishlist } = useSession()

  // Find product by slug or fallback
  const product = products.find((p) => p.slug === rawSlug) || products[0]
  const farmer = productFarmer(product)

  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [selectedOfferIndex, setSelectedOfferIndex] = useState(0)

  const saved = isSaved(product.id)
  const fresh = freshnessLabel(product.expiryDate)

  // Competing farmer offers for this product
  const competingOffers = [
    {
      id: farmer.id,
      name: farmer.farmName,
      region: `${farmer.region} (${farmer.distanceKm}km)`,
      price: product.pricePerKg || product.priceMin,
      rating: farmer.rating,
      freshness: fresh.label || 'Just Harvested',
      freshnessColor: fresh.color || '#0B3B25',
    },
    {
      id: 'f-alt-1',
      name: "Auntie Ama's Garden",
      region: 'Koforidua, Eastern (85km)',
      price: (product.pricePerKg || product.priceMin) * 1.08,
      rating: 4.9,
      freshness: 'Just Harvested',
      freshnessColor: '#0B3B25',
    },
    {
      id: 'f-alt-2',
      name: 'Fati Abukari Fields',
      region: 'Tamale, Northern (420km)',
      price: (product.pricePerKg || product.priceMin) * 0.94,
      rating: 4.7,
      freshness: 'Fresh',
      freshnessColor: '#F59E0B',
    },
  ]

  const activeOffer = competingOffers[selectedOfferIndex]
  const activePrice = activeOffer.price
  const lineEstimate = activePrice * qty

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  function handleAddToCart() {
    add(product, qty)
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
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[rgba(33,26,18,0.08)] bg-[#F7F5F0]/90 px-3 py-2.5 backdrop-blur-md">
        <Link
          href="/m"
          aria-label="Back"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#211A12] shadow-[0_1px_4px_rgba(33,26,18,0.06)] border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="text-center">
          <nav className="text-[10.5px] font-bold text-[#5C5247]">
            <span>Market</span> <span className="px-1">/</span>{' '}
            <span className="capitalize">{product.category}</span>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-label="Favorite"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#211A12] shadow-[0_1px_4px_rgba(33,26,18,0.06)] border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
          >
            <Heart
              className={cn(
                'h-4.5 w-4.5',
                saved ? 'fill-[#7A3F1C] text-[#7A3F1C]' : 'text-[#211A12]'
              )}
            />
          </button>
        </div>
      </header>

      <div className="relative px-3 pt-2.5 space-y-2.5">
        {/* 1. Large Hero Produce Display Card */}
        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-[24px] bg-[#FDFDFB] p-4 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          {/* Top Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {product.organic && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#0B3B25] px-2.5 py-0.5 text-[9.5px] font-black uppercase tracking-wider text-white shadow-xs">
                <Leaf className="h-3 w-3" />
                Organic
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 text-[9.5px] font-black uppercase tracking-wider text-white backdrop-blur-md shadow-xs">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: activeOffer.freshnessColor }}
              />
              {activeOffer.freshness}
            </span>
          </div>

          {/* Large Center Photo */}
          <div className="relative my-3 flex h-40 w-40 items-center justify-center">
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
              href={`/m/farmer/${farmer.slug}`}
              className="inline-flex items-center gap-1 text-[11.5px] font-extrabold text-[#7A3F1C] hover:underline"
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>{activeOffer.name} · {activeOffer.region}</span>
            </Link>

            <h1 className="mt-1 text-[20px] font-black tracking-tight text-[#211A12]">
              {product.name}
            </h1>

            <div className="mt-1 flex items-center justify-center gap-1.5 text-[11.5px] font-bold text-[#5C5247]">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3 w-3 fill-[#F0A81E] text-[#F0A81E]"
                  />
                ))}
              </div>
              <span className="font-black text-[#211A12]">{activeOffer.rating.toFixed(1)}</span>
              <span>({farmer.reviewCount} reviews)</span>
            </div>

            <p className="mt-2 text-[12px] font-medium leading-relaxed text-[#3D332A] px-1">
              {product.description}
            </p>
          </div>
        </div>

        {/* 2. Feature Badges Strip */}
        <div className="flex flex-wrap gap-1.5">
          {product.organic && (
            <div className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10.5px] font-extrabold text-[#0B3B25] border border-[rgba(33,26,18,0.08)] shadow-2xs">
              <Leaf className="h-3 w-3" />
              <span>100% Certified Organic</span>
            </div>
          )}
          {product.refrigerationRequired && (
            <div className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10.5px] font-extrabold text-[#7A3F1C] border border-[rgba(33,26,18,0.08)] shadow-2xs">
              <Snowflake className="h-3 w-3" />
              <span>Chilled Cold-Chain Van</span>
            </div>
          )}
          <div className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10.5px] font-extrabold text-[#211A12] border border-[rgba(33,26,18,0.08)] shadow-2xs">
            <ShieldCheck className="h-3 w-3 text-[#0B3B25]" />
            <span>GhanaGAP Verified</span>
          </div>
        </div>

        {/* 3. Variable-Weight Pricing Explainer Card */}
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[22px] font-black text-[#211A12]">
                {formatGHS(activePrice)}
              </span>
              <span className="text-[12px] font-bold text-[#5C5247]">
                {' '}
                / {product.unit}
              </span>
            </div>
            {product.pricePerKg && (
              <span className="rounded-full bg-[#0B3B25]/10 px-2 py-0.5 text-[10.5px] font-black text-[#0B3B25]">
                {formatGHS(product.pricePerKg)}/kg
              </span>
            )}
          </div>

          {product.variableWeight && (
            <div className="mt-2.5 rounded-2xl bg-white/80 p-3 border border-[rgba(33,26,18,0.06)]">
              <div className="flex items-start gap-2">
                <Info className="h-3.5 w-3.5 text-[#7A3F1C] shrink-0 mt-0.5" />
                <p className="text-[11px] font-semibold leading-relaxed text-[#5C5247]">
                  <strong className="text-[#211A12]">Priced by weight:</strong> You are charged an estimate of{' '}
                  <strong className="text-[#211A12]">{formatGHS(activePrice)}</strong> now; the final price is reconciled to the exact weight picked (typically {formatGHS(product.priceMin)}–{formatGHS(product.priceMax)}). You only pay for what you receive.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 4. Competing Farmer Offers Comparison Section */}
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <div className="flex items-center justify-between pb-2 border-b border-[rgba(33,26,18,0.06)]">
            <div>
              <span className="text-[9.5px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
                Multi-Farmer Marketplace
              </span>
              <h3 className="text-[14px] font-black text-[#211A12]">
                Compare Farmer Prices
              </h3>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-[#7A3F1C]/10 px-2 py-0.5 text-[10.5px] font-extrabold text-[#7A3F1C]">
              <Users className="h-3 w-3" />
              <span>{competingOffers.length} offers</span>
            </span>
          </div>

          <div className="mt-2.5 space-y-2">
            {competingOffers.map((offer, idx) => {
              const isSelected = selectedOfferIndex === idx
              return (
                <button
                  key={offer.id}
                  type="button"
                  onClick={() => setSelectedOfferIndex(idx)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-2xl p-2.5 text-left transition-all border',
                    isSelected
                      ? 'bg-white border-[#0B3B25] ring-2 ring-[#0B3B25]/20 shadow-xs'
                      : 'bg-white/60 border-[rgba(33,26,18,0.08)] hover:bg-white'
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-[13px] font-black text-[#211A12] truncate">
                        {offer.name}
                      </h4>
                      {isSelected && (
                        <span className="rounded-md bg-[#0B3B25] px-1.5 py-0.5 text-[8.5px] font-black text-white">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-[10.5px] font-semibold text-[#5C5247]">
                      {offer.region} · {offer.rating.toFixed(1)} ★
                    </p>
                  </div>

                  <div className="text-right pl-2">
                    <span className="text-[14px] font-black text-[#0B3B25]">
                      {formatGHS(offer.price)}
                    </span>
                    <span className="block text-[9.5px] font-bold text-[#5C5247]">
                      /{product.unit}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* 5. Farmer Mini-Profile & Story Card */}
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <span className="text-[9.5px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
            Farmer Profile
          </span>
          <div className="mt-2.5 flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white shadow-2xs">
              <Image
                src={farmer.photo}
                alt={farmer.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="text-[14px] font-extrabold text-[#211A12]">
                  {farmer.name}
                </h4>
                <ShieldCheck className="h-3.5 w-3.5 text-[#0B3B25]" />
              </div>
              <p className="text-[11.5px] font-bold text-[#7A3F1C]">
                {farmer.farmName} · {farmer.region}
              </p>
              <div className="mt-0.5 flex items-center gap-1 text-[10.5px] font-bold text-[#5C5247]">
                <Star className="h-3 w-3 fill-[#F0A81E] text-[#F0A81E]" />
                <span>{farmer.rating}</span>
                <span>({farmer.reviewCount} reviews · Since {farmer.joinedYear})</span>
              </div>
            </div>
          </div>
          <p className="mt-2.5 text-[11.5px] font-medium leading-relaxed text-[#3D332A] border-t border-[rgba(33,26,18,0.06)] pt-2">
            {farmer.bio}
          </p>
        </div>

        {/* 6. Freshness & Cold-Chain Specs Grid */}
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <h3 className="pb-2 text-[10.5px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
            Farm-to-Door Specifications
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-white/70 p-2.5 border border-[rgba(33,26,18,0.06)]">
              <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#5C5247]">
                Harvest Date
              </span>
              <p className="mt-0.5 text-[11.5px] font-extrabold text-[#211A12]">
                {product.harvestDate}
              </p>
            </div>
            <div className="rounded-2xl bg-white/70 p-2.5 border border-[rgba(33,26,18,0.06)]">
              <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#5C5247]">
                Shelf Life
              </span>
              <p className="mt-0.5 text-[11.5px] font-extrabold text-[#211A12]">
                {product.shelfLifeDays} Days (FEFO)
              </p>
            </div>
            <div className="rounded-2xl bg-white/70 p-2.5 border border-[rgba(33,26,18,0.06)]">
              <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#5C5247]">
                Storage
              </span>
              <p className="mt-0.5 text-[11.5px] font-extrabold text-[#211A12]">
                {product.refrigerationRequired ? 'Refrigerated < 8°C' : 'Cool dry place'}
              </p>
            </div>
            <div className="rounded-2xl bg-white/70 p-2.5 border border-[rgba(33,26,18,0.06)]">
              <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#5C5247]">
                Origin
              </span>
              <p className="mt-0.5 text-[11.5px] font-extrabold text-[#211A12]">
                {farmer.region}
              </p>
            </div>
          </div>

          <div className="mt-2.5 flex items-center gap-1.5 text-[11.5px] font-bold text-[#0B3B25] border-t border-[rgba(33,26,18,0.06)] pt-2.5">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <span>Freshness Promise: Instant MoMo refund on any bad batch.</span>
          </div>
        </div>

        {/* 7. More from the Market (Related Produce) */}
        {relatedProducts.length > 0 && (
          <div className="pt-1.5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-[15px] font-extrabold tracking-tight text-[#211A12]">
                  More From The Market
                </h3>
                <p className="text-[10.5px] font-semibold text-[#5C5247]">
                  Fresh picks you might also like
                </p>
              </div>
              <Link
                href="/m/categories"
                className="text-[11.5px] font-bold text-[#7A3F1C] hover:underline"
              >
                See all
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {relatedProducts.map((p) => (
                <MobileProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Add to Cart Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-[rgba(33,26,18,0.08)] bg-[#F7F5F0]/95 px-3 pt-2.5 pb-[clamp(16px,2.5vh,22px)] backdrop-blur-md shadow-[0_-4px_20px_rgba(33,26,18,0.04)]">
        {/* Quantity Stepper */}
        <div className="flex items-center gap-2 rounded-full bg-white px-2.5 py-1 shadow-xs border border-[rgba(33,26,18,0.10)]">
          <button
            type="button"
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F7F5F0] text-[#211A12] active:scale-90 transition-transform"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="min-w-4 text-center text-[13px] font-black text-[#211A12]">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty(qty + 1)}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F7F5F0] text-[#211A12] active:scale-90 transition-transform"
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
