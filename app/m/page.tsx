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
  ShieldCheck,
  Truck,
} from 'lucide-react'
import { products, farmers, bundles, recipes } from '@/lib/golden-acres/data'
import { formatGHS } from '@/lib/golden-acres/format'
import { useCart } from '@/components/golden-acres/cart-context'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'
import { MobileProductCard } from '@/components/golden-acres/mobile/mobile-product-card'
import { MobileHeroBanner } from '@/components/golden-acres/home/hero-promo'
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
    <div className="relative min-h-dvh bg-[#F7F5F0] pb-28 text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.14) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      {/* 1. Header Bar: Greeting, Location & Action Badges */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between border-b border-[rgba(33,26,18,0.08)] bg-[#F7F5F0]/90 px-5 py-3 backdrop-blur-md"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 12px)' }}
      >
        <Link href="/m/onboarding/gps" className="flex flex-col active:scale-95 transition-transform">
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#5C5247]">
            <span>Hi, Ewoke</span>
          </div>
          <div className="flex items-center gap-1.5 text-[13.5px] font-extrabold text-[#211A12]">
            <MapPin className="h-3.5 w-3.5 text-[#0B3B25]" />
            <span>KNUST, Kumasi</span>
            <ChevronDown className="h-3 w-3 text-[#5C5247]" />
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/m/account/notifications"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95"
          >
            <Bell className="h-4 w-4 stroke-[2.2]" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[#7A3F1C]" />
          </Link>

          <Link
            href="/m/cart"
            aria-label="Basket"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#0B3B25] text-white shadow-sm active:scale-95 transition-transform"
          >
            <ShoppingBag className="h-4 w-4 stroke-[2.2]" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#7A3F1C] px-1 text-[9px] font-black text-white shadow-xs">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* 2. Search Bar */}
      <div className="relative px-5 pt-3">
        <Link
          href="/m/search"
          className="flex h-[46px] w-full items-center justify-between rounded-full border border-[rgba(33,26,18,0.10)] bg-white px-4 text-[13px] font-medium text-[#5C5247] shadow-2xs active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-2.5">
            <Search className="h-4 w-4 text-[#0B3B25] stroke-[2.4]" />
            <span className="text-[#8A8175]">Search fresh produce, yam, farmers...</span>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F7F5F0] text-[#211A12]">
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </div>
        </Link>
      </div>

      {/* 3. Scaled-down Real Web Hero Banner (streams from HERO_BANNER_DATA) */}
      <div className="relative px-5 pt-3.5">
        <MobileHeroBanner />

        {/* Value Badges Strip */}
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-white/80 p-3 shadow-2xs border border-[rgba(33,26,18,0.06)] text-[11px] font-bold text-[#5C5247]">
          <div className="flex items-center gap-1.5">
            <Truck className="h-4 w-4 text-[#0B3B25]" />
            <span>Chilled Cold-Chain</span>
          </div>
          <div className="h-3 w-px bg-[rgba(33,26,18,0.12)]" />
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-[#0B3B25]" />
            <span>Direct Fair Trade</span>
          </div>
          <div className="h-3 w-px bg-[rgba(33,26,18,0.12)]" />
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-[#7A3F1C]" />
            <span>FEFO Quality</span>
          </div>
        </div>
      </div>

      {/* 4. Category Chips Scroller */}
      <div className="relative pt-4">
        <div className="flex items-center justify-between px-5 pb-2">
          <h3 className="text-[11px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
            Shop by category
          </h3>
          <Link
            href="/m/categories"
            className="text-[12px] font-bold text-[#7A3F1C] hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-auto px-5 py-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORY_CHIPS.map((cat) => {
            const active = activeCategory === cat.slug
            const Icon = cat.icon
            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => setActiveCategory(cat.slug)}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-extrabold shadow-2xs transition-all active:scale-95',
                  active
                    ? 'bg-[#0B3B25] text-white shadow-xs'
                    : 'bg-white text-[#211A12] border border-[rgba(33,26,18,0.08)]'
                )}
              >
                <Icon className={cn('h-3.5 w-3.5', active ? 'text-white' : 'text-[#0B3B25]')} />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 5. Recommended Produce (2-Column Grid with -20% Card Height) */}
      <div className="relative px-5 pt-4">
        <div className="flex items-center justify-between pb-2.5">
          <h3 className="text-[15px] font-extrabold text-[#211A12]">
            Recommended for you
          </h3>
          <Link
            href="/m/categories"
            className="text-[12px] font-bold text-[#7A3F1C] hover:underline"
          >
            See all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
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
      <div className="relative px-5 pt-5">
        <div className="flex items-center justify-between pb-2.5">
          <div>
            <h3 className="text-[15px] font-extrabold text-[#211A12]">
              Popular this week
            </h3>
            <p className="text-[11px] font-semibold text-[#5C5247]">Top harvested favorites in Ashanti</p>
          </div>
          <Link
            href="/m/categories"
            className="text-[12px] font-bold text-[#7A3F1C] hover:underline"
          >
            See all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {popular.map((product) => (
            <MobileProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* 7. Bundles & Subscriptions Preview */}
      <div className="relative pt-5">
        <div className="flex items-center justify-between px-5 pb-2.5">
          <div>
            <h3 className="text-[15px] font-extrabold text-[#211A12]">
              Bundles &amp; subscriptions
            </h3>
            <p className="text-[11px] font-semibold text-[#5C5247]">Weekly curated boxes delivered direct</p>
          </div>
          <Link
            href="/m/bundles"
            className="text-[12px] font-bold text-[#7A3F1C] hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto px-5 py-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {bundles.map((bundle) => (
            <Link
              key={bundle.id}
              href="/m/bundles"
              className="flex w-64 shrink-0 flex-col overflow-hidden rounded-[26px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] active:scale-[0.98] transition-transform"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#F7F5F0]">
                <Image
                  src={bundle.image}
                  alt={bundle.name}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-[#0B3B25] px-2.5 py-0.5 text-[9.5px] font-extrabold text-white shadow-xs">
                  <Repeat className="h-2.5 w-2.5" /> {bundle.frequency}
                </span>
              </div>
              <h4 className="mt-2.5 text-[13px] font-extrabold text-[#211A12]">
                {bundle.name}
              </h4>
              <p className="mt-0.5 line-clamp-1 text-[11px] font-semibold text-[#5C5247]">
                {bundle.description}
              </p>
              <div className="mt-2.5 flex items-center justify-between border-t border-[rgba(33,26,18,0.06)] pt-2 text-[13px] font-black text-[#0B3B25]">
                <span>{formatGHS(bundle.price)}</span>
                <span className="text-[10.5px] font-bold text-[#7A3F1C]">
                  {bundle.items.length} items
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 8. Recipes Inspiration */}
      <div className="relative px-5 pt-5">
        <div className="flex items-center justify-between pb-2.5">
          <div>
            <h3 className="text-[15px] font-extrabold text-[#211A12]">Recipes inspiration</h3>
            <p className="text-[11px] font-semibold text-[#5C5247]">Cook authentic Ghanaian dishes</p>
          </div>
          <Link
            href="/m/recipes"
            className="text-[12px] font-bold text-[#7A3F1C] hover:underline"
          >
            See all
          </Link>
        </div>

        <div className="space-y-2.5">
          {recipes.slice(0, 2).map((recipe) => (
            <Link
              key={recipe.id}
              href={`/m/recipes/${recipe.id}`}
              className="flex items-center gap-3.5 overflow-hidden rounded-[26px] bg-[#FDFDFB] p-3 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] active:scale-[0.98] transition-transform"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-white shadow-2xs">
                <Image
                  src={recipe.image}
                  alt={recipe.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <span className="text-[9.5px] font-black uppercase tracking-wider text-[#7A3F1C]">
                  {recipe.category}
                </span>
                <h4 className="text-[13px] font-extrabold text-[#211A12]">
                  {recipe.name}
                </h4>
                <div className="mt-1 flex items-center gap-3 text-[10.5px] font-semibold text-[#5C5247]">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[#0B3B25]" /> {recipe.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <UtensilsCrossed className="h-3 w-3 text-[#0B3B25]" /> {recipe.productIds.length} items
                  </span>
                </div>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B3B25]/10 text-[#0B3B25]">
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 9. Meet Local Ghanaian Farmers */}
      <div className="relative px-5 pt-5">
        <div className="flex items-center justify-between pb-2.5">
          <div>
            <h3 className="text-[15px] font-extrabold text-[#211A12]">Meet your farmers</h3>
            <p className="text-[11px] font-semibold text-[#5C5247]">Know the hands that grow your food</p>
          </div>
          <Link
            href="/m/farmers"
            className="text-[12px] font-bold text-[#7A3F1C] hover:underline"
          >
            See all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {farmers.slice(0, 2).map((farmer) => (
            <Link
              key={farmer.id}
              href={`/m/farmers/${farmer.slug}`}
              className="flex flex-col overflow-hidden rounded-[26px] bg-[#FDFDFB] p-3 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] active:scale-[0.98] transition-transform"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white shadow-2xs">
                <Image
                  src={farmer.photo}
                  alt={farmer.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="mt-2 truncate text-[13px] font-extrabold text-[#211A12]">
                {farmer.name}
              </h4>
              <p className="truncate text-[11px] font-bold text-[#7A3F1C]">
                {farmer.farmName}
              </p>
              <div className="mt-1.5 flex items-center justify-between border-t border-[rgba(33,26,18,0.06)] pt-1.5 text-[10.5px] text-[#5C5247]">
                <span className="flex items-center gap-1 font-semibold text-[#0B3B25]">
                  <MapPin className="h-3 w-3" /> {farmer.town}
                </span>
                <span className="flex items-center gap-0.5 font-black text-[#211A12]">
                  <Star className="h-3 w-3 fill-[#F0A81E] text-[#F0A81E]" /> {farmer.rating}
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

