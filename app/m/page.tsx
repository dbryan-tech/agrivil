'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
  const { count } = useCart()
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const onboarded = localStorage.getItem('agrivil_has_onboarded')
      if (!onboarded) {
        router.replace('/m/onboarding')
      }
    }
  }, [router])

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

      {/* Top warm brand radiant gradient backdrop (Seamless Harvest Glow) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(280px,48vh,400px)] z-0"
        style={{
          background:
            'radial-gradient(130% 95% at 50% 0%, rgba(223, 136, 33, 0.20) 0%, rgba(240, 168, 30, 0.08) 35%, rgba(247, 245, 240, 0.6) 75%, rgba(247, 245, 240, 1) 100%)',
        }}
      />

      {/* 1. Header Bar: Clean Canvas Header */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-3 py-2 bg-[#FAF7F2]/95 backdrop-blur-md transition-all"
        style={{
          paddingTop: 'max(env(safe-area-inset-top, 0px), 10px)',
          paddingBottom: '8px',
        }}
      >
        <Link href="/m" prefetch={true} className="flex items-center gap-2.5 active:scale-95 transition-transform" aria-label="AgriVil Home">
          {/* Logo Mark Doubled in Size (100% Increase) */}
          <div className="relative h-11 w-11 shrink-0 overflow-hidden drop-shadow-2xs">
            <Image
              src="/agrivil-mark.svg"
              alt="AgriVil Emblem"
              width={44}
              height={44}
              className="h-full w-full object-contain scale-110"
              priority
            />
          </div>
          <div className="flex flex-col leading-tight justify-center">
            <span className="text-[19px] font-black tracking-[0.14em] text-[#0B3B25]">
              AGRIVIL
            </span>
            <span className="text-[8.5px] font-extrabold tracking-[0.14em] uppercase text-[#DF8821]">
              Golden Acres
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/m/account/notifications"
            prefetch={true}
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95"
          >
            <Bell className="h-4 w-4 stroke-[2.2]" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#7A3F1C]" />
          </Link>

          <Link
            href="/m/cart"
            prefetch={true}
            aria-label="Basket"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#0B3B25] text-white shadow-sm active:scale-95 transition-transform"
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

      {/* 2. Top Search Bar: direct to /m/shop */}
      <div className="relative px-1.5 pt-1.5">
        <Link
          href="/m/shop"
          prefetch={true}
          className="flex h-11 w-full items-center justify-between rounded-full bg-white px-3.5 shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-2 text-[#5C5247]">
            <Search className="h-4 w-4 text-[#0B3B25]" />
            <span className="text-[12.5px] font-semibold text-[#5C5247]/90">
              Search fresh produce, yam, farmers...
            </span>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F7F5F0] text-[#211A12]">
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </div>
        </Link>
      </div>

      {/* 3. Scaled-down Real Web Hero Banner (Side margins reduced to 10% of previous state) */}
      <div className="relative px-1 pt-1.5">
        <MobileHeroBanner />
      </div>

      {/* 4. Category Chips Scroller (Clicks navigate to dedicated /m/shop pre-filtered) */}
      <div className="relative pt-2">
        <div className="flex items-center justify-between px-1.5 pb-1">
          <h3 className="text-[10.5px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
            Shop by category
          </h3>
          <Link
            href="/m/shop"
            prefetch={true}
            className="text-[11.5px] font-black text-[#7A3F1C] hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="flex gap-1.5 overflow-x-auto px-1.5 py-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORY_CHIPS.map((cat) => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.label}
                href={cat.slug === 'All' ? '/m/shop' : `/m/shop?category=${encodeURIComponent(cat.slug)}`}
                prefetch={true}
                className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-extrabold shadow-2xs transition-all active:scale-95 bg-white text-[#211A12] border border-[rgba(33,26,18,0.08)] hover:border-[#0B3B25]"
              >
                <Icon className="h-3.5 w-3.5 text-[#0B3B25]" />
                <span>{cat.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* 5. Recommended Produce (Halved spacing, 2-Column Grid with gap-1.5) */}
      <div className="relative px-1.5 pt-2">
        <div className="flex items-center justify-between pb-1.5">
          <h3 className="text-[14px] font-black text-[#211A12]">
            Recommended for you
          </h3>
          <Link
            href="/m/shop"
            prefetch={true}
            className="text-[11.5px] font-bold text-[#7A3F1C] hover:underline"
          >
            See all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
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
      <div className="relative px-1.5 pt-3">
        <div className="flex items-center justify-between pb-1.5">
          <div>
            <h3 className="text-[14px] font-black text-[#211A12]">
              Popular this week
            </h3>
            <p className="text-[10.5px] font-semibold text-[#5C5247]">Top harvested favorites in Ashanti</p>
          </div>
          <Link
            href="/m/shop"
            prefetch={true}
            className="text-[11.5px] font-bold text-[#7A3F1C] hover:underline"
          >
            See all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {popular.map((product) => (
            <MobileProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* 7. Bundles & Subscriptions Preview */}
      <div className="relative pt-3">
        <div className="flex items-center justify-between px-1.5 pb-1.5">
          <div>
            <h3 className="text-[14px] font-black text-[#211A12]">
              Bundles &amp; subscriptions
            </h3>
            <p className="text-[10.5px] font-semibold text-[#5C5247]">Weekly curated boxes delivered direct</p>
          </div>
          <Link
            href="/m/bundles"
            prefetch={true}
            className="text-[11.5px] font-bold text-[#7A3F1C] hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="flex gap-1.5 overflow-x-auto px-1.5 py-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {bundles.map((bundle) => (
            <Link
              key={bundle.id}
              href="/m/bundles"
              prefetch={true}
              className="flex w-60 shrink-0 flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] active:scale-[0.98] transition-transform"
            >
              {/* Image Bleeding to Top, Left, Right */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#211A12]">
                <Image
                  src={bundle.image}
                  alt={bundle.name}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-[#0B3B25] px-2.5 py-0.5 text-[9.5px] font-extrabold text-white shadow-xs">
                  <Repeat className="h-2.5 w-2.5" /> {bundle.frequency}
                </span>
              </div>
              <div className="p-3 bg-[#FAF9F6]">
                <h4 className="text-[13.5px] font-black text-[#211A12]">
                  {bundle.name}
                </h4>
                <p className="mt-0.5 line-clamp-1 text-[11px] font-semibold text-[#5C5247]">
                  {bundle.description}
                </p>
                <div className="mt-2 flex items-center justify-between border-t border-[rgba(33,26,18,0.06)] pt-1.5 text-[13px] font-black text-[#0B3B25]">
                  <span>{formatGHS(bundle.price)}</span>
                  <span className="text-[10.5px] font-bold text-[#7A3F1C]">
                    {bundle.items.length} items
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 8. Recipes Inspiration */}
      <div className="relative px-1.5 pt-3">
        <div className="flex items-center justify-between pb-1.5">
          <div>
            <h3 className="text-[14px] font-black text-[#211A12]">Recipes inspiration</h3>
            <p className="text-[10.5px] font-semibold text-[#5C5247]">Cook authentic Ghanaian dishes</p>
          </div>
          <Link
            href="/m/recipes"
            prefetch={true}
            className="text-[11.5px] font-bold text-[#7A3F1C] hover:underline"
          >
            See all
          </Link>
        </div>

        <div className="space-y-1.5">
          {recipes.slice(0, 2).map((recipe) => (
            <Link
              key={recipe.id}
              href={`/m/recipes/${recipe.id}`}
              prefetch={true}
              className="flex items-center gap-3 overflow-hidden rounded-[22px] bg-white p-2.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] active:scale-[0.98] transition-transform"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-white shadow-2xs">
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
                <div className="mt-0.5 flex items-center gap-2.5 text-[10.5px] font-semibold text-[#5C5247]">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[#0B3B25]" /> {recipe.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <UtensilsCrossed className="h-3 w-3 text-[#0B3B25]" /> {recipe.productIds.length} items
                  </span>
                </div>
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0B3B25]/10 text-[#0B3B25]">
                <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 9. Meet Local Ghanaian Farmers */}
      <div className="relative px-1.5 pt-3">
        <div className="flex items-center justify-between pb-1.5">
          <div>
            <h3 className="text-[14px] font-black text-[#211A12]">Meet your farmers</h3>
            <p className="text-[10.5px] font-semibold text-[#5C5247]">Know the hands that grow your food</p>
          </div>
          <Link
            href="/m/farmers"
            prefetch={true}
            className="text-[11.5px] font-bold text-[#7A3F1C] hover:underline"
          >
            See all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {farmers.slice(0, 2).map((farmer) => (
            <Link
              key={farmer.id}
              href={`/m/farmers/${farmer.slug}`}
              prefetch={true}
              className="flex flex-col overflow-hidden rounded-[22px] bg-white p-2.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] active:scale-[0.98] transition-transform"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white shadow-2xs">
                <Image
                  src={farmer.photo}
                  alt={farmer.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="mt-1.5 truncate text-[13px] font-extrabold text-[#211A12]">
                {farmer.name}
              </h4>
              <p className="truncate text-[11px] font-bold text-[#7A3F1C]">
                {farmer.farmName}
              </p>
              <div className="mt-1 flex items-center justify-between border-t border-[rgba(33,26,18,0.06)] pt-1 text-[10.5px] text-[#5C5247]">
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

      {/* ========================================================
          10. CONTINUATION SECTIONS BY CATEGORY (Endless Scrolling)
         ======================================================== */}

      {/* 10. Fresh Vegetables & Greens */}
      <div className="relative px-1.5 pt-3.5">
        <div className="flex items-center justify-between pb-1.5">
          <div>
            <h3 className="text-[14px] font-black text-[#211A12]">
              Fresh Vegetables &amp; Greens
            </h3>
            <p className="text-[10.5px] font-semibold text-[#5C5247]">Hand-harvested at dawn</p>
          </div>
          <Link
            href="/m/categories?category=Vegetables"
            prefetch={true}
            className="text-[11.5px] font-bold text-[#7A3F1C] hover:underline"
          >
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {products.filter((p) => p.category === 'Vegetables').slice(0, 4).map((p) => (
            <MobileProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* 11. Roots, Tubers & Plantain */}
      <div className="relative px-1.5 pt-3.5">
        <div className="flex items-center justify-between pb-1.5">
          <div>
            <h3 className="text-[14px] font-black text-[#211A12]">
              Roots, Tubers &amp; Plantain
            </h3>
            <p className="text-[10.5px] font-semibold text-[#5C5247]">Pona yam, sweet potatoes &amp; cassava</p>
          </div>
          <Link
            href="/m/categories?category=Roots%20%26%20Tubers"
            prefetch={true}
            className="text-[11.5px] font-bold text-[#7A3F1C] hover:underline"
          >
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {products.filter((p) => p.category === 'Roots & Tubers').slice(0, 4).map((p) => (
            <MobileProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* 12. Orchard Fresh Fruits */}
      <div className="relative px-1.5 pt-3.5">
        <div className="flex items-center justify-between pb-1.5">
          <div>
            <h3 className="text-[14px] font-black text-[#211A12]">
              Orchard Fresh Fruits
            </h3>
            <p className="text-[10.5px] font-semibold text-[#5C5247]">Sun-ripened papaya, mangoes &amp; citrus</p>
          </div>
          <Link
            href="/m/categories?category=Fruits"
            prefetch={true}
            className="text-[11.5px] font-bold text-[#7A3F1C] hover:underline"
          >
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {products.filter((p) => p.category === 'Fruits').slice(0, 4).map((p) => (
            <MobileProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* 13. Grains, Legumes & Staples */}
      <div className="relative px-1.5 pt-3.5">
        <div className="flex items-center justify-between pb-1.5">
          <div>
            <h3 className="text-[14px] font-black text-[#211A12]">
              Grains, Legumes &amp; Staples
            </h3>
            <p className="text-[10.5px] font-semibold text-[#5C5247]">Local perfumed rice, cowpea &amp; maize</p>
          </div>
          <Link
            href="/m/categories?category=Grains%20%26%20Legumes"
            prefetch={true}
            className="text-[11.5px] font-bold text-[#7A3F1C] hover:underline"
          >
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {products.filter((p) => p.category === 'Grains & Legumes').slice(0, 4).map((p) => (
            <MobileProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* 14. Aromatic Herbs & Hot Peppers */}
      <div className="relative px-1.5 pt-3.5">
        <div className="flex items-center justify-between pb-1.5">
          <div>
            <h3 className="text-[14px] font-black text-[#211A12]">
              Herbs &amp; Fresh Peppers
            </h3>
            <p className="text-[10.5px] font-semibold text-[#5C5247]">Kpakpo shito, ginger &amp; scotch bonnet</p>
          </div>
          <Link
            href="/m/categories?category=Herbs%20%26%20Spices"
            prefetch={true}
            className="text-[11.5px] font-bold text-[#7A3F1C] hover:underline"
          >
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {products.filter((p) => p.category === 'Herbs & Spices').slice(0, 4).map((p) => (
            <MobileProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}

