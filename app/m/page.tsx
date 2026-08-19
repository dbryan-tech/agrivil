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
  ArrowRight,
  Sparkles,
  Repeat,
  Clock,
  UtensilsCrossed,
  Wheat,
  Leaf,
  Apple,
  Layers,
  Flame,
  LayoutGrid,
  SlidersHorizontal,
  Star,
} from 'lucide-react'
import { products, farmers, bundles, recipes } from '@/lib/golden-acres/data'
import { formatGHS } from '@/lib/golden-acres/format'
import { useCart } from '@/components/golden-acres/cart-context'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'
import { MobileProductCard } from '@/components/golden-acres/mobile/mobile-product-card'
import { CustomValueStrip } from '@/components/golden-acres/mobile/custom-value-strip'
import { cn } from '@/lib/utils'

const CATEGORY_CHIPS = [
  { label: 'Staples', icon: Wheat, slug: 'Grains & Legumes' },
  { label: 'Vegetables', icon: Leaf, slug: 'Vegetables' },
  { label: 'Fruits', icon: Apple, slug: 'Fruits' },
  { label: 'Tubers', icon: Layers, slug: 'Roots & Tubers' },
  { label: 'Spices', icon: Flame, slug: 'Herbs & Spices' },
  { label: 'All', icon: LayoutGrid, slug: 'All' },
]

export default function MobileHomeScreen() {
  const { count } = useCart()
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredProducts =
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory)

  const recommended = filteredProducts.slice(0, 4)
  const popular = products.slice(4, 8)

  return (
    <div className="min-h-dvh bg-[#FAF7F0] pb-24 text-[#2B1F17]">
      {/* 1. Header Bar: Greeting, Location & Action Badges */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between border-b border-[#E0DACB] bg-[#FAF7F0] px-3 sm:px-4 py-2.5"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 10px)' }}
      >
        <Link href="/m/onboarding/gps" className="ga-press flex flex-col">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#6E6A63]">
            <span>Hi, Ewoke</span>
          </div>
          <div className="flex items-center gap-1 text-sm font-extrabold text-[#2B1F17]">
            <MapPin className="h-3.5 w-3.5 text-[#0F7A43]" />
            <span>Delivering to KNUST, Kumasi</span>
            <ChevronDown className="h-3 w-3 text-[#6E6A63]" />
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/m/account/notifications"
            aria-label="Notifications"
            className="ga-press relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#E67A2E]" />
          </Link>

          <Link
            href="/m/cart"
            aria-label="Basket"
            className="ga-press relative flex h-9 w-9 items-center justify-center rounded-full bg-[#0F7A43] text-white shadow-sm"
          >
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#A3E635] px-1 text-[9px] font-extrabold text-[#0B3B25]">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* 2. Compact Search Bar with Filter Trigger */}
      <div className="px-3 sm:px-4 pt-2.5">
        <Link
          href="/m/search"
          className="ga-press flex h-11 w-full items-center justify-between rounded-2xl border border-[#E0DACB] bg-white px-3.5 text-xs font-medium text-[#6E6A63] shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <Search className="h-4 w-4 text-[#0F7A43]" />
            <span>Search products, farmers, recipes...</span>
          </div>
          <div className="rounded-lg p-1 text-[#6E6A63] hover:bg-[#FAF7F0]">
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </div>
        </Link>
      </div>

      {/* 3. Hero Promo Banner Card with Real Farm Visuals */}
      <div className="px-3 sm:px-4 pt-3">
        {/* 3. Hero Promo Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-[#0F7A43] p-4 text-white shadow-sm">
          <div className="relative z-10 max-w-[200px]">
            <span className="inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-xs">
              Morning Harvest
            </span>
            <h2 className="ga-headline mt-1.5 text-base font-extrabold leading-snug">
              Fresh From The Farm
            </h2>
            <p className="mt-0.5 text-[11px] text-white/90">
              Harvested at sunrise in Ashanti &amp; Eastern regions.
            </p>
            <Link
              href="/m/categories"
              className="ga-press mt-3 inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-1.5 text-xs font-bold text-[#0F7A43] shadow-xs hover:bg-[#FAF7F0]"
            >
              <span>Shop Now</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="absolute -right-4 -bottom-4 h-36 w-36 overflow-hidden">
            <Image
              src="/golden-acres/bundle-box.png"
              alt="Produce crate"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* 4. Custom Value Badges Strip (Reliable delivery, Support local, Secure & private) */}
        <CustomValueStrip />
      </div>

      {/* 4. Category Chips Scroller */}
      <div className="pt-4">
        <div className="flex items-center justify-between px-3 sm:px-4 pb-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#2B1F17]">
            Shop by category
          </h3>
          <Link
            href="/m/categories"
            className="text-xs font-bold text-[#7A3F1C] hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 sm:px-4 py-0.5">
          {CATEGORY_CHIPS.map((cat) => {
            const active = activeCategory === cat.slug
            const Icon = cat.icon
            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => setActiveCategory(cat.slug)}
                className={cn(
                  'ga-press flex shrink-0 items-center gap-1.5 rounded-2xl border px-3 py-1.5 text-xs font-bold shadow-xs transition-all',
                  active
                    ? 'border-[#0F7A43] bg-[#0F7A43] text-white'
                    : 'border-[#E0DACB] bg-white text-[#2B1F17] hover:bg-[#FAF7F0]'
                )}
              >
                <Icon className={cn('h-3.5 w-3.5', active ? 'text-[#A3E635]' : 'text-[#0F7A43]')} />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 5. Recommended Produce (2-Column Grid with Slim Margins) */}
      <div className="px-3 sm:px-4 pt-5">
        <div className="flex items-center justify-between pb-2.5">
          <h3 className="text-sm font-extrabold text-[#2B1F17]">
            Recommended for you
          </h3>
          <Link
            href="/m/categories"
            className="text-xs font-bold text-[#7A3F1C] hover:underline"
          >
            See all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {recommended.map((product, idx) => (
            <MobileProductCard
              key={product.id}
              product={product}
              priority={idx < 2}
            />
          ))}
        </div>
      </div>

      {/* 6. Popular This Week Grid */}
      <div className="px-3 sm:px-4 pt-6">
        <div className="flex items-center justify-between pb-2.5">
          <div>
            <h3 className="text-sm font-extrabold text-[#2B1F17]">
              Popular this week
            </h3>
            <p className="text-[10px] text-[#6E6A63]">Top harvested favorites in Ashanti</p>
          </div>
          <Link
            href="/m/categories"
            className="text-xs font-bold text-[#7A3F1C] hover:underline"
          >
            See all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {popular.map((product) => (
            <MobileProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* 7. Bundles & Subscriptions Preview */}
      <div className="pt-6">
        <div className="flex items-center justify-between px-3 sm:px-4 pb-2.5">
          <div>
            <h3 className="text-sm font-extrabold text-[#2B1F17]">
              Bundles &amp; subscriptions
            </h3>
            <p className="text-[10px] text-[#6E6A63]">Weekly curated boxes delivered direct</p>
          </div>
          <Link
            href="/m/bundles"
            className="text-xs font-bold text-[#7A3F1C] hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="no-scrollbar flex gap-3 overflow-x-auto px-3 sm:px-4 py-0.5">
          {bundles.map((bundle) => (
            <Link
              key={bundle.id}
              href="/m/bundles"
              className="ga-press flex w-60 shrink-0 flex-col overflow-hidden rounded-3xl border border-[#E0DACB] bg-white p-3 shadow-xs"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#FAF7F0]">
                <Image
                  src={bundle.image}
                  alt={bundle.name}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-[#0F7A43] px-2 py-0.5 text-[9px] font-extrabold text-white">
                  <Repeat className="h-2.5 w-2.5 text-[#A3E635]" /> {bundle.frequency}
                </span>
              </div>
              <h4 className="mt-2 text-xs font-extrabold text-[#2B1F17]">
                {bundle.name}
              </h4>
              <p className="mt-0.5 line-clamp-1 text-[10px] text-[#6E6A63]">
                {bundle.description}
              </p>
              <div className="mt-2 flex items-center justify-between border-t border-[#E0DACB] pt-2 text-xs font-extrabold text-[#0F7A43]">
                <span>{formatGHS(bundle.price)}</span>
                <span className="text-[10px] font-semibold text-[#7A3F1C]">
                  {bundle.items.length} items
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 8. Recipes Inspiration */}
      <div className="px-3 sm:px-4 pt-6">
        <div className="flex items-center justify-between pb-2.5">
          <div>
            <h3 className="text-sm font-extrabold text-[#2B1F17]">Recipes inspiration</h3>
            <p className="text-[10px] text-[#6E6A63]">Cook authentic Ghanaian dishes</p>
          </div>
          <Link
            href="/m/recipes"
            className="text-xs font-bold text-[#7A3F1C] hover:underline"
          >
            See all
          </Link>
        </div>

        <div className="space-y-2.5">
          {recipes.slice(0, 2).map((recipe) => (
            <Link
              key={recipe.id}
              href={`/m/recipes/${recipe.id}`}
              className="ga-press flex items-center gap-3 overflow-hidden rounded-3xl border border-[#E0DACB] bg-white p-2.5 shadow-xs"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#FAF7F0]">
                <Image
                  src={recipe.image}
                  alt={recipe.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#7A3F1C]">
                  {recipe.category}
                </span>
                <h4 className="text-xs font-extrabold text-[#2B1F17]">
                  {recipe.name}
                </h4>
                <div className="mt-1 flex items-center gap-3 text-[10px] font-semibold text-[#6E6A63]">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[#0F7A43]" /> {recipe.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <UtensilsCrossed className="h-3 w-3 text-[#0F7A43]" /> {recipe.productIds.length} items
                  </span>
                </div>
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FAF7F0] text-[#0F7A43]">
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 9. Meet Local Ghanaian Farmers */}
      <div className="px-3 sm:px-4 pt-6">
        <div className="flex items-center justify-between pb-2.5">
          <div>
            <h3 className="text-sm font-extrabold text-[#2B1F17]">Meet your farmers</h3>
            <p className="text-[10px] text-[#6E6A63]">Know the hands that grow your food</p>
          </div>
          <Link
            href="/m/farmers"
            className="text-xs font-bold text-[#7A3F1C] hover:underline"
          >
            See all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {farmers.slice(0, 2).map((farmer) => (
            <Link
              key={farmer.id}
              href={`/m/farmers/${farmer.slug}`}
              className="ga-press flex flex-col overflow-hidden rounded-3xl border border-[#E0DACB] bg-white p-2.5 shadow-xs"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#FAF7F0]">
                <Image
                  src={farmer.photo}
                  alt={farmer.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="mt-2 truncate text-xs font-extrabold text-[#2B1F17]">
                {farmer.name}
              </h4>
              <p className="truncate text-[10px] font-medium text-[#7A3F1C]">
                {farmer.farmName}
              </p>
              <div className="mt-1.5 flex items-center justify-between border-t border-[#E0DACB] pt-1.5 text-[10px] text-[#6E6A63]">
                <span className="flex items-center gap-1 font-semibold text-[#0F7A43]">
                  <MapPin className="h-2.5 w-2.5" /> {farmer.town}
                </span>
                <span className="flex items-center gap-0.5 font-bold text-[#2B1F17]">
                  <Star className="h-2.5 w-2.5 fill-[#FBBF24] text-[#FBBF24]" /> {farmer.rating}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}
