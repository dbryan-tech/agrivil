'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowLeft,
  Heart,
  Star,
  ShieldCheck,
  Leaf,
  Plus,
  Minus,
  CheckCircle2,
  ChevronRight,
  Info,
  Check,
  ShoppingBag,
  Share2,
  Sparkles,
  AlertTriangle,
  Bell,
  X,
  Store,
  Calendar,
  MapPin,
  Clock,
  Truck,
  Flame,
  Wheat,
} from 'lucide-react'
import { products, productFarmer } from '@/lib/golden-acres/data'
import { formatGHS, freshnessLabel } from '@/lib/golden-acres/format'
import { useCart } from '@/components/golden-acres/cart-context'
import { useSession } from '@/components/golden-acres/auth/session-context'
import { cn } from '@/lib/utils'

export default function MobileProductDetailScreen() {
  const params = useParams<{ slug: string }>()
  const rawSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || ''
  const router = useRouter()
  const { add, lines, count, subtotalEstimate } = useCart()
  const { isSaved, toggleWishlist } = useSession()

  // Find product by slug or fallback
  const product =
    products.find((p) => p.slug === rawSlug) || products[0]
  const farmer = productFarmer(product)

  // Modals and Sheet States
  const [quantitySheetOpen, setQuantitySheetOpen] = useState(false)
  const [successSheetOpen, setSuccessSheetOpen] = useState(false)
  const [notified, setNotified] = useState(false)

  // Quantity / Weight State (Screen 2)
  const [weightMode, setWeightMode] = useState<'weight' | 'piece'>('weight')
  const [weightKg, setWeightKg] = useState<number>(product.estWeightKg || 1.0)
  const [pieceCount, setPieceCount] = useState<number>(1)
  const [addedItemName, setAddedItemName] = useState<string | null>(null)

  const saved = isSaved(product.id)

  // Stock status checks (Screens 1, 3, 7, 8, 9)
  const isOutOfStock = product.status === 'out-of-stock' || (product.stockKg !== undefined && product.stockKg <= 0) || rawSlug === 'avocado-out-of-stock'
  const isLowStock = !isOutOfStock && (product.status === 'low' || (product.stockKg !== undefined && product.stockKg < 20) || rawSlug === 'plantain-low-stock')
  const isUnavailable = rawSlug === 'unavailable'

  // Calculations
  const calculatedPrice = product.variableWeight
    ? weightMode === 'weight'
      ? product.pricePerKg * weightKg
      : product.priceMin * pieceCount
    : product.priceMin * pieceCount

  // Related products (Screen 5)
  const relatedList = [
    { name: 'Red Bell Pepper', price: 16.0, unit: 'kg', image: '/golden-acres/produce/roma-tomatoes.png' },
    { name: 'Garden Eggs', price: 10.0, unit: 'kg', image: '/golden-acres/produce/garden-eggs.png' },
    { name: 'Onions (Dry)', price: 8.0, unit: 'kg', image: '/golden-acres/produce/aromatic-rice.png' },
    { name: 'Fresh Carrots', price: 15.0, unit: 'kg', image: '/golden-acres/produce/roma-tomatoes-1.png' },
    { name: 'Cucumber', price: 4.0, unit: 'piece', image: '/golden-acres/produce/crisphead-lettuce.png' },
  ]

  const recentlyViewed = [
    { name: 'Fresh Tomatoes', priceText: 'GH₵12.00 / kg', image: '/golden-acres/produce/roma-tomatoes-1.png', slug: 'roma-tomatoes' },
    { name: 'Yam (White)', priceText: 'GH₵8.00 - 12.00 / kg', image: '/golden-acres/produce/white-yam.png', slug: 'white-yam' },
  ]

  function handleAddToCart() {
    add(product, weightMode === 'weight' ? Math.max(1, Math.round(weightKg)) : pieceCount)
    setQuantitySheetOpen(false)
    setSuccessSheetOpen(true)
  }

  function handleQuickAddRelated(name: string, price: number, unit: string, img: string) {
    const syntheticProduct = {
      id: `rel-${name.toLowerCase().replace(/\s+/g, '-')}`,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      category: product.category,
      farmerId: 'f1',
      farmerName: farmer.name,
      image: img,
      unit: (unit === 'piece' ? 'each' : unit) as import('@/lib/golden-acres/types').ProductUnit,
      variableWeight: false,
      pricePerKg: 0,
      priceMin: price,
      priceMax: price,
      refrigerationRequired: false,
      shelfLifeDays: 7,
      expiryDate: '',
      stockKg: 50,
      lowStockThreshold: 10,
      status: 'in-stock' as const,
      organic: false,
      season: 'Year-round',
      tags: [],
      description: name,
      estWeightKg: 1,
    }
    add(syntheticProduct, 1)
    setAddedItemName(name)
    setTimeout(() => setAddedItemName(null), 1200)
  }

  // Screen 9: Unavailable View
  if (isUnavailable) {
    return (
      <div className="min-h-dvh bg-[#FAF7F0] p-4 text-[#2B1F17] flex flex-col justify-between">
        <header className="flex items-center">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        </header>

        <div className="flex flex-col items-center justify-center text-center px-4">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#EBE6DA] text-[#6E6A63] shadow-inner">
            <Store className="h-12 w-12" />
          </div>
          <h1 className="mt-5 text-xl font-extrabold text-[#2B1F17]">Currently unavailable</h1>
          <p className="mt-2 text-xs text-[#6E6A63] max-w-xs">
            This product is not available right now. Please check back later.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => router.push('/m/categories')}
            className="ga-press flex h-13 w-full items-center justify-center rounded-2xl bg-[#0F7A43] text-sm font-bold text-white shadow-md hover:bg-[#0B3B25]"
          >
            Browse Other Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-[#FAF7F0] pb-32 text-[#2B1F17]">
      {/* 1. Floating Header Bar */}
      <header
        className="fixed inset-x-0 top-0 z-40 mx-auto flex max-w-md items-center justify-between p-3 sm:p-4 bg-[#FAF7F0]/85 backdrop-blur-md border-b border-[#E0DACB]/50"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 10px)' }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-label="Favorite"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
          >
            <Heart
              className={cn(
                'h-4 w-4',
                saved ? 'fill-[#DC2626] text-[#DC2626]' : 'text-[#2B1F17]'
              )}
            />
          </button>

          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: product.name, url: window.location.href }).catch(() => {})
              }
            }}
            aria-label="Share"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* 2. Hero Image Banner (Screens 1, 3, 7, 8) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-white mt-12">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority
          className="object-contain p-4"
        />

        {/* Floating Tag Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isOutOfStock ? (
            <span className="rounded-md bg-[#DC2626] px-2.5 py-0.5 text-[10px] font-extrabold text-white shadow-xs">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="rounded-md bg-[#D97706] px-2.5 py-0.5 text-[10px] font-extrabold text-white shadow-xs">
              Low Stock
            </span>
          ) : product.variableWeight ? (
            <span className="rounded-md bg-[#0F7A43] px-2.5 py-0.5 text-[10px] font-extrabold text-white shadow-xs">
              Farm Fresh
            </span>
          ) : (
            <span className="rounded-md bg-[#0F7A43] px-2.5 py-0.5 text-[10px] font-extrabold text-white shadow-xs">
              Fresh Pick
            </span>
          )}
        </div>
      </div>

      {/* 3. Main Product Metadata Card */}
      <div className="px-3 sm:px-4 pt-3.5 space-y-3">
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <h1 className="ga-headline text-xl font-extrabold text-[#2B1F17]">
            {product.name}
          </h1>

          <div className="mt-1 flex items-center justify-between">
            <Link
              href={`/m/farmers/${farmer.slug}`}
              className="ga-press flex items-center gap-1 text-xs font-bold text-[#6E6A63] hover:text-[#0F7A43]"
            >
              <span>From {farmer.name}</span>
              <CheckCircle2 className="h-3.5 w-3.5 fill-[#0F7A43] text-white" />
            </Link>

            <div className="flex items-center gap-1 text-xs font-bold text-[#7A3F1C]">
              <Star className="h-3.5 w-3.5 fill-[#FBBF24] text-[#FBBF24]" />
              <span>{product.rating || 4.7}</span>
              <span className="text-[#6E6A63]">({product.reviewCount || 32} reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="mt-3">
            {product.variableWeight ? (
              <div>
                <span className="text-xl font-extrabold text-[#0F7A43]">
                  {formatGHS(product.priceMin)} — {formatGHS(product.priceMax || product.priceMin * 1.5)} / kg
                </span>
                <p className="mt-0.5 text-[10px] text-[#6E6A63]">
                  Price depends on size. Final weight and price confirmed upon packing.
                </p>
              </div>
            ) : (
              <span className="text-xl font-extrabold text-[#0F7A43]">
                {formatGHS(product.priceMin)} / {product.unit}
              </span>
            )}
          </div>

          <p className="mt-2.5 text-xs leading-relaxed text-[#6E6A63]">
            {product.description}
          </p>

          {/* Screen 8: Low stock alert banner */}
          {isLowStock && (
            <div className="mt-3 flex items-center gap-2 rounded-2xl bg-[#FEF3C7] p-3 text-xs font-bold text-[#92400E] border border-[#FDE68A]">
              <AlertTriangle className="h-4 w-4 shrink-0 text-[#D97706]" />
              <span>Only 4 bunches left — Get it before it&apos;s gone!</span>
            </div>
          )}

          {/* 4 Value Badges in a Row (Screen 1) */}
          <div className="mt-4 grid grid-cols-4 gap-1.5 border-t border-[#E0DACB]/60 pt-3 text-center">
            <div className="rounded-xl bg-[#FAF7F0] p-2">
              <Sparkles className="mx-auto h-4 w-4 text-[#0F7A43]" />
              <span className="mt-1 block text-[9px] font-bold text-[#2B1F17]">100% Natural</span>
            </div>
            <div className="rounded-xl bg-[#FAF7F0] p-2">
              <ShieldCheck className="mx-auto h-4 w-4 text-[#0F7A43]" />
              <span className="mt-1 block text-[9px] font-bold text-[#2B1F17]">Pesticide Free</span>
            </div>
            <div className="rounded-xl bg-[#FAF7F0] p-2">
              <Leaf className="mx-auto h-4 w-4 text-[#0F7A43]" />
              <span className="mt-1 block text-[9px] font-bold text-[#2B1F17]">Hand Picked</span>
            </div>
            <div className="rounded-xl bg-[#FAF7F0] p-2">
              <Truck className="mx-auto h-4 w-4 text-[#0F7A43]" />
              <span className="mt-1 block text-[9px] font-bold text-[#2B1F17]">Fast Delivery</span>
            </div>
          </div>
        </div>

        {/* 4. Product Details Table (Screen 1 & 3) */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#6E6A63] pb-2">
            Product Details
          </h3>

          <div className="space-y-2 text-xs divide-y divide-[#E0DACB]/60">
            <div className="flex justify-between pt-1">
              <span className="text-[#6E6A63]">Category</span>
              <span className="font-bold text-[#2B1F17]">{product.category}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-[#6E6A63]">Farm</span>
              <span className="font-bold text-[#2B1F17]">{farmer.farmName || farmer.name}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-[#6E6A63]">Location</span>
              <span className="font-bold text-[#2B1F17]">{farmer.town}, {farmer.region}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-[#6E6A63]">Harvested</span>
              <span className="font-bold text-[#0F7A43]">Today at dawn</span>
            </div>
            {product.variableWeight && (
              <>
                <div className="flex justify-between pt-2">
                  <span className="text-[#6E6A63]">Estimated Weight</span>
                  <span className="font-bold text-[#2B1F17]">1.5 — 2.5 kg</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-[#6E6A63]">Sold by</span>
                  <span className="font-bold text-[#2B1F17]">Kilogram</span>
                </div>
              </>
            )}
          </div>

          {/* Screen 3: Gold/Yellow Callout Box for Variable Weight */}
          {product.variableWeight && (
            <div className="mt-3 flex items-center gap-2 rounded-2xl bg-[#FEF3C7]/80 p-3 text-[11px] font-medium text-[#92400E] border border-[#FDE68A]">
              <Wheat className="h-4 w-4 shrink-0 text-[#92400E]" />
              <span>We will pick the best quality and confirm exact weight before delivery.</span>
            </div>
          )}
        </div>

        {/* 5. Farmer Info Story Card (Screen 4) */}
        {farmer && (
          <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E0DACB]/60">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#E0DACB]">
                  <Image
                    src={farmer.photo}
                    alt={farmer.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-extrabold text-[#2B1F17]">{farmer.name}</h3>
                    <CheckCircle2 className="h-3.5 w-3.5 fill-[#0F7A43] text-white" />
                  </div>
                  <p className="text-[10px] text-[#6E6A63]">{farmer.town}, {farmer.region}</p>
                  <div className="flex items-center gap-1 text-[10px] text-[#7A3F1C]">
                    <Star className="h-2.5 w-2.5 fill-[#FBBF24] text-[#FBBF24]" />
                    <span className="font-bold text-[#2B1F17]">{farmer.rating}</span>
                    <span>({farmer.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E6A63]">
                About the farm
              </span>
              <p className="mt-1 text-xs leading-relaxed text-[#6E6A63]">
                {farmer.bio}
              </p>

              {/* 4 Icon Bullet Points */}
              <div className="mt-3 space-y-2">
                <div className="flex items-start gap-2 text-xs">
                  <Leaf className="h-4 w-4 shrink-0 text-[#0F7A43]" />
                  <div>
                    <span className="font-bold text-[#2B1F17]">Sustainable Farming</span>
                    <p className="text-[10px] text-[#6E6A63]">We use eco-friendly practices</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-[#0F7A43]" />
                  <div>
                    <span className="font-bold text-[#2B1F17]">Pesticide Free</span>
                    <p className="text-[10px] text-[#6E6A63]">Chemical free, safe for you</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <Sparkles className="h-4 w-4 shrink-0 text-[#0F7A43]" />
                  <div>
                    <span className="font-bold text-[#2B1F17]">Hand Picked</span>
                    <p className="text-[10px] text-[#6E6A63]">Picked at the right time</p>
                  </div>
                </div>
              </div>

              <Link
                href={`/m/farmers/${farmer.slug}`}
                className="ga-press mt-4 flex h-11 w-full items-center justify-center rounded-2xl bg-[#0F7A43] text-xs font-bold text-white shadow-xs hover:bg-[#0B3B25]"
              >
                View All Products from this Farm
              </Link>
            </div>
          </div>
        )}

        {/* 6. Related Products — "You may also like" & "Recently viewed" (Screen 5) */}
        <div className="pt-3 space-y-4">
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#2B1F17] pb-2">
              You may also like
            </h3>

            <div className="space-y-2">
              {relatedList.map((item) => {
                const isAdded = addedItemName === item.name
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-2xl border border-[#E0DACB] bg-white p-2.5 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#FAF7F0]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-[#2B1F17]">{item.name}</h4>
                        <span className="text-[11px] font-bold text-[#0F7A43]">
                          {formatGHS(item.price)} / {item.unit}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleQuickAddRelated(item.name, item.price, item.unit, item.image)}
                      className={cn(
                        'ga-press flex h-8 w-8 items-center justify-center rounded-full text-white shadow-xs transition-all',
                        isAdded ? 'bg-[#0B3B25]' : 'bg-[#0F7A43]'
                      )}
                    >
                      {isAdded ? <Check className="h-4 w-4 stroke-[3]" /> : <Plus className="h-4 w-4 stroke-[2.5]" />}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recently Viewed */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#6E6A63] pb-2">
              Recently viewed
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              {recentlyViewed.map((item) => (
                <Link
                  key={item.name}
                  href={`/m/product/${item.slug}`}
                  className="ga-press flex flex-col overflow-hidden rounded-3xl border border-[#E0DACB] bg-white p-2.5 shadow-xs"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#FAF7F0]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <h4 className="mt-2 truncate text-xs font-extrabold text-[#2B1F17]">
                    {item.name}
                  </h4>
                  <span className="text-[10px] font-bold text-[#0F7A43]">
                    {item.priceText}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 7. Sticky Bottom Footer (Screens 1, 3, 7, 8) */}
      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t border-[#E0DACB] bg-[#FAF7F0]/95 p-3 backdrop-blur-md">
        {isOutOfStock ? (
          /* Screen 7 Out of Stock Actions */
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setNotified(true)}
              className="ga-press flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white border border-[#E0DACB] text-xs font-bold text-[#2B1F17] shadow-xs"
            >
              <Bell className="h-4 w-4 text-[#0F7A43]" />
              {notified ? 'Notification set for next harvest' : 'Notify Me When Available'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/m/categories')}
              className="ga-press flex h-12 w-full items-center justify-center rounded-2xl bg-[#0F7A43] text-xs font-bold text-white shadow-md hover:bg-[#0B3B25]"
            >
              View Similar Products
            </button>
          </div>
        ) : (
          /* Screen 1, 3, 8 Regular / Low Stock Footer */
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#6E6A63]">Price</span>
              <span className="text-lg font-extrabold text-[#0F7A43]">
                {formatGHS(product.priceMin)} / {product.unit}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setQuantitySheetOpen(true)}
              className="ga-press flex flex-1 h-13 items-center justify-center gap-2 rounded-2xl bg-[#0F7A43] text-sm font-bold text-white shadow-md hover:bg-[#0B3B25]"
            >
              Select Quantity
            </button>
          </div>
        )}
      </div>

      {/* 8. Screen 2: Select Quantity Modal Bottom Sheet */}
      {quantitySheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-t-3xl bg-[#FAF7F0] p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E0DACB] pb-3">
              <h3 className="text-base font-extrabold text-[#2B1F17]">Select Quantity</h3>
              <button
                type="button"
                onClick={() => setQuantitySheetOpen(false)}
                className="rounded-full p-1 text-[#6E6A63] hover:bg-black/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Summary Item Row */}
            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-[#E0DACB] bg-white p-2.5">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#FAF7F0]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#2B1F17]">{product.name}</h4>
                <span className="text-[11px] font-bold text-[#0F7A43]">
                  {formatGHS(product.priceMin)} / {product.unit}
                </span>
              </div>
            </div>

            {/* Mode Switcher: [By Weight] vs [By Piece] */}
            {product.variableWeight && (
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setWeightMode('weight')}
                  className={cn(
                    'ga-press flex-1 rounded-2xl py-2 text-xs font-bold border transition-all',
                    weightMode === 'weight'
                      ? 'border-[#0F7A43] bg-[#0F7A43] text-white shadow-xs'
                      : 'border-[#E0DACB] bg-white text-[#2B1F17]'
                  )}
                >
                  By Weight
                </button>
                <button
                  type="button"
                  onClick={() => setWeightMode('piece')}
                  className={cn(
                    'ga-press flex-1 rounded-2xl py-2 text-xs font-bold border transition-all',
                    weightMode === 'piece'
                      ? 'border-[#0F7A43] bg-[#0F7A43] text-white shadow-xs'
                      : 'border-[#E0DACB] bg-white text-[#2B1F17]'
                  )}
                >
                  By Piece
                </button>
              </div>
            )}

            {/* Large Stepper */}
            <div className="mt-4 flex items-center justify-center gap-5">
              <button
                type="button"
                onClick={() => {
                  if (weightMode === 'weight') setWeightKg(Math.max(0.5, Number((weightKg - 0.5).toFixed(1))))
                  else setPieceCount(Math.max(1, pieceCount - 1))
                }}
                className="ga-press flex h-11 w-11 items-center justify-center rounded-full border border-[#E0DACB] bg-white text-[#2B1F17] shadow-xs"
              >
                <Minus className="h-5 w-5" />
              </button>

              <span className="text-2xl font-extrabold text-[#2B1F17] min-w-28 text-center">
                {weightMode === 'weight' ? `${weightKg.toFixed(1)} kg` : `${pieceCount} pcs`}
              </span>

              <button
                type="button"
                onClick={() => {
                  if (weightMode === 'weight') setWeightKg(Number((weightKg + 0.5).toFixed(1)))
                  else setPieceCount(pieceCount + 1)
                }}
                className="ga-press flex h-11 w-11 items-center justify-center rounded-full border border-[#E0DACB] bg-white text-[#2B1F17] shadow-xs"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            {/* Slider (0.5kg to 10kg) */}
            {weightMode === 'weight' && (
              <div className="mt-4">
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full accent-[#0F7A43]"
                />
                <div className="flex justify-between text-[10px] font-bold text-[#6E6A63] mt-1">
                  <span>0.5 kg</span>
                  <span>10 kg</span>
                </div>
              </div>
            )}

            <p className="mt-3 text-center text-[10px] text-[#6E6A63]">
              You will pay for the exact weight measured at delivery.
            </p>

            {/* Bottom Row */}
            <div className="mt-4 flex items-center justify-between border-t border-[#E0DACB] pt-3">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#6E6A63]">Estimated Price</span>
                <span className="text-lg font-extrabold text-[#0F7A43]">
                  {formatGHS(calculatedPrice)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="ga-press flex h-12 px-6 items-center justify-center rounded-2xl bg-[#0F7A43] text-xs font-bold text-white shadow-md hover:bg-[#0B3B25]"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Screen 6: Add to Cart Success Sheet Modal */}
      {successSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-t-3xl bg-[#FAF7F0] p-6 shadow-2xl animate-in slide-in-from-bottom duration-200 text-center">
            {/* Giant Green Checkmark */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0F7A43] text-white shadow-lg animate-bounce">
              <Check className="h-8 w-8 stroke-[3]" />
            </div>

            <h3 className="ga-headline mt-4 text-xl font-extrabold text-[#2B1F17]">
              Added to cart!
            </h3>
            <p className="mt-1 text-xs text-[#6E6A63]">
              {product.name} ({weightMode === 'weight' ? `${weightKg} kg` : `${pieceCount} pcs`}) has been added to your cart.
            </p>

            {/* Cart Summary Box */}
            <div className="mt-4 rounded-2xl border border-[#E0DACB] bg-white p-3.5 text-xs text-left shadow-xs space-y-1.5">
              <span className="font-extrabold uppercase tracking-wider text-[10px] text-[#6E6A63]">
                Cart Summary
              </span>
              <div className="flex justify-between font-bold text-[#2B1F17]">
                <span>Items</span>
                <span>{count}</span>
              </div>
              <div className="flex justify-between font-extrabold text-[#0F7A43] border-t border-[#E0DACB]/60 pt-1.5 text-sm">
                <span>Total</span>
                <span>{formatGHS(subtotalEstimate)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 space-y-2.5">
              <button
                type="button"
                onClick={() => router.push('/m/cart')}
                className="ga-press flex h-13 w-full items-center justify-center rounded-2xl bg-[#0F7A43] text-sm font-bold text-white shadow-md hover:bg-[#0B3B25]"
              >
                View Cart
              </button>
              <button
                type="button"
                onClick={() => setSuccessSheetOpen(false)}
                className="ga-press flex h-12 w-full items-center justify-center rounded-2xl border border-[#E0DACB] bg-white text-xs font-bold text-[#2B1F17] shadow-xs"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
