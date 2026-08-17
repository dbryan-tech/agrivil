'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  MapPin,
  Bell,
  ShoppingBag,
  Search,
  ChevronDown,
  Plus,
  Check,
  Star,
  ArrowRight,
  Sparkles,
  Repeat,
  Clock,
  UtensilsCrossed,
} from 'lucide-react'
import { products, farmers, bundles, recipes } from '@/lib/golden-acres/data'
import { formatGHS, weight } from '@/lib/golden-acres/format'
import { useCart } from '@/components/golden-acres/cart-context'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'
import { cn } from '@/lib/utils'

const CATEGORY_CHIPS = [
  { label: 'Staples', icon: '🌾', slug: 'Grains & Legumes' },
  { label: 'Vegetables', icon: '🥬', slug: 'Vegetables' },
  { label: 'Fruits', icon: '🍌', slug: 'Fruits' },
  { label: 'Tubers', icon: '🥔', slug: 'Roots & Tubers' },
  { label: 'Herbs', icon: '🌿', slug: 'Herbs & Spices' },
  { label: 'All', icon: '🛒', slug: 'All' },
]

export default function MobileHomeScreen() {
  const { add, count } = useCart()
  const [addedId, setAddedId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState('All')

  function handleQuickAdd(e: React.MouseEvent, product: (typeof products)[0]) {
    e.preventDefault()
    e.stopPropagation()
    add(product, 1)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1200)
  }

  const filteredProducts =
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory)

  const recommended = filteredProducts.slice(0, 6)
  const popular = products.slice(6, 12)

  return (
    <div className="min-h-dvh bg-[#F4F1EA] pb-24 text-[#2B1F17]">
      {/* 1. Header Bar: Location & Status Actions */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between border-b border-[#E0DACB]/80 bg-[#F4F1EA]/95 px-4 py-3 backdrop-blur-md"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 12px)' }}
      >
        <Link href="/m/onboarding/gps" className="ga-press flex flex-col">
          <div className="flex items-center gap-1 text-xs font-bold text-[#6E6A63]">
            <span>Hi, Ewoke</span>
            <span>🌾</span>
          </div>
          <div className="flex items-center gap-1 text-sm font-extrabold text-[#2B1F17]">
            <MapPin className="h-3.5 w-3.5 text-[#1E5D3B]" />
            <span>KNUST, Kumasi</span>
            <ChevronDown className="h-3 w-3 text-[#6E6A63]" />
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/m/account/notifications"
            aria-label="Notifications"
            className="ga-press relative flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#2B1F17] shadow-xs border border-[#E0DACB]/60"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#E67A2E]" />
          </Link>

          <Link
            href="/m/cart"
            aria-label="Basket"
            className="ga-press relative flex h-9 w-9 items-center justify-center rounded-full bg-[#1E5D3B] text-white shadow-sm"
          >
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#A3E635] px-1 text-[9px] font-extrabold text-[#144028]">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* 2. Instant Search Field */}
      <div className="px-4 pt-3">
        <Link
          href="/m/search"
          className="ga-press flex h-12 w-full items-center gap-3 rounded-2xl border border-[#E0DACB] bg-white px-4 text-xs font-medium text-[#6E6A63] shadow-xs"
        >
          <Search className="h-4 w-4 text-[#1E5D3B]" />
          <span>Search fresh tomatoes, plantain, yam, pepper...</span>
        </Link>
      </div>

      {/* 3. Hero Promo Banner Card */}
      <div className="px-4 pt-4">
        <div className="relative overflow-hidden rounded-3xl bg-[#1E5D3B] p-5 text-white shadow-md">
          <div className="relative z-10 max-w-[65%]">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#A3E635] backdrop-blur-xs">
              <Sparkles className="h-3 w-3" /> Harvested Today
            </span>
            <h2 className="ga-headline mt-2 text-xl font-extrabold leading-tight text-white sm:text-2xl">
              Fresh from our local farmers
            </h2>
            <p className="mt-1 text-xs text-white/80">
              Quality produce, fair prices &amp; fast cold-chain delivery.
            </p>
            <Link
              href="/m/categories"
              className="ga-press mt-3.5 inline-flex items-center gap-1.5 rounded-full bg-[#A3E635] px-4 py-2 text-xs font-extrabold text-[#144028] shadow-sm hover:bg-[#86efac]"
            >
              Shop Now
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="pointer-events-none absolute -right-4 -bottom-4 h-36 w-36 sm:h-44 sm:w-44">
            <Image
              src="/golden-acres/produce/roma-tomatoes-1.png"
              alt="Fresh tomatoes"
              fill
              className="object-contain drop-shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* 4. Category Chips Scroller */}
      <div className="pt-5">
        <div className="flex items-center justify-between px-4 pb-2">
          <h3 className="text-sm font-extrabold text-[#2B1F17]">Shop by category</h3>
          <Link
            href="/m/categories"
            className="text-xs font-bold text-[#1E5D3B] hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="no-scrollbar flex gap-2.5 overflow-x-auto px-4 py-1">
          {CATEGORY_CHIPS.map((cat) => {
            const active = activeCategory === cat.slug
            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => setActiveCategory(cat.slug)}
                className={cn(
                  'ga-press flex shrink-0 items-center gap-2 rounded-2xl border px-3.5 py-2 text-xs font-bold shadow-xs transition-all',
                  active
                    ? 'border-[#1E5D3B] bg-[#1E5D3B] text-white'
                    : 'border-[#E0DACB] bg-white text-[#2B1F17] hover:bg-[#EBE6DA]'
                )}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 5. Recommended For You Grid */}
      <div className="px-4 pt-6">
        <div className="flex items-center justify-between pb-3">
          <h3 className="text-sm font-extrabold text-[#2B1F17]">Recommended for you</h3>
          <Link
            href="/m/categories"
            className="text-xs font-bold text-[#1E5D3B] hover:underline"
          >
            See all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {recommended.map((product) => {
            const isAdded = addedId === product.id
            return (
              <Link
                key={product.id}
                href={`/m/product/${product.slug}`}
                className="ga-press group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#E0DACB] bg-white p-3 shadow-xs hover:border-[#1E5D3B]/40"
              >
                <div>
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F4F1EA]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 150px, 200px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {product.organic && (
                      <span className="absolute top-2 left-2 rounded-md bg-[#1E5D3B] px-1.5 py-0.5 text-[9px] font-bold text-white">
                        Organic
                      </span>
                    )}
                  </div>

                  <div className="mt-2.5">
                    <h4 className="truncate text-xs font-extrabold text-[#2B1F17]">
                      {product.name}
                    </h4>
                    <p className="truncate text-[10px] font-medium text-[#6E6A63]">
                      {product.farmerName}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between pt-1">
                  <div className="flex flex-col">
                    <span className="text-xs font-extrabold text-[#1E5D3B]">
                      {formatGHS(product.priceMin)}
                    </span>
                    <span className="text-[9px] font-semibold text-[#6E6A63]">
                      / {product.variableWeight ? 'kg (est)' : product.unit}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(e, product)}
                    className={cn(
                      'ga-press flex h-8 w-8 items-center justify-center rounded-full text-white shadow-xs transition-colors',
                      isAdded ? 'bg-[#A3E635] text-[#144028]' : 'bg-[#1E5D3B] hover:bg-[#144028]'
                    )}
                    aria-label={`Add ${product.name} to basket`}
                  >
                    {isAdded ? (
                      <Check className="h-4 w-4 stroke-[3]" />
                    ) : (
                      <Plus className="h-4 w-4 stroke-[2.5]" />
                    )}
                  </button>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* 6. Curated Boxes & Subscriptions Rail */}
      <div className="pt-8">
        <div className="flex items-center justify-between px-4 pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-[#2B1F17]">Bundles &amp; subscriptions</h3>
            <p className="text-[10px] text-[#6E6A63]">Weekly veg boxes delivered fresh</p>
          </div>
          <Link
            href="/m/bundles"
            className="text-xs font-bold text-[#1E5D3B] hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="no-scrollbar flex gap-3.5 overflow-x-auto px-4 py-1">
          {bundles.map((bundle) => (
            <Link
              key={bundle.id}
              href="/m/bundles"
              className="ga-press flex w-64 shrink-0 flex-col overflow-hidden rounded-3xl border border-[#E0DACB] bg-white p-3.5 shadow-xs"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#F4F1EA]">
                <Image
                  src={bundle.image}
                  alt={bundle.name}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-[#A3E635] px-2 py-0.5 text-[10px] font-extrabold text-[#144028]">
                  <Repeat className="h-3 w-3" /> {bundle.frequency}
                </span>
              </div>
              <h4 className="mt-2.5 text-xs font-extrabold text-[#2B1F17]">
                {bundle.name}
              </h4>
              <p className="mt-0.5 line-clamp-1 text-[10px] text-[#6E6A63]">
                {bundle.description}
              </p>
              <div className="mt-2 flex items-center justify-between border-t border-[#E0DACB]/60 pt-2 text-xs font-extrabold text-[#1E5D3B]">
                <span>{formatGHS(bundle.price)}</span>
                <span className="text-[10px] font-semibold text-[#8A6B3D]">
                  {bundle.items.length} items
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 7. Shoppable Recipes Inspiration */}
      <div className="px-4 pt-8">
        <div className="flex items-center justify-between pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-[#2B1F17]">Recipes inspiration</h3>
            <p className="text-[10px] text-[#6E6A63]">Cook authentic Ghanaian dishes in a tap</p>
          </div>
          <Link
            href="/m/recipes"
            className="text-xs font-bold text-[#1E5D3B] hover:underline"
          >
            See all
          </Link>
        </div>

        <div className="space-y-3">
          {recipes.slice(0, 2).map((recipe) => (
            <Link
              key={recipe.id}
              href={`/m/recipes/${recipe.id}`}
              className="ga-press flex items-center gap-3.5 overflow-hidden rounded-3xl border border-[#E0DACB] bg-white p-3 shadow-xs"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#F4F1EA]">
                <Image
                  src={recipe.image}
                  alt={recipe.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A6B3D]">
                  {recipe.category || 'Traditional'}
                </span>
                <h4 className="text-xs font-extrabold text-[#2B1F17]">
                  {recipe.name}
                </h4>
                <div className="mt-1.5 flex items-center gap-3 text-[10px] font-semibold text-[#6E6A63]">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[#1E5D3B]" /> {recipe.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <UtensilsCrossed className="h-3 w-3 text-[#1E5D3B]" /> {recipe.productIds.length} ingredients
                  </span>
                </div>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4F1EA] text-[#1E5D3B]">
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 8. Bottom Navigation Bar */}
      <MobileBottomNav />
    </div>
  )
}
