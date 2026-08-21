'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Clock, UtensilsCrossed, ChevronRight, Sparkles, ArrowLeft, ShoppingBag } from 'lucide-react'
import { recipes } from '@/lib/golden-acres/data'
import { useCart } from '@/components/golden-acres/cart-context'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'

export default function MobileRecipesScreen() {
  const router = useRouter()
  const { count } = useCart()

  return (
    <div className="relative min-h-dvh w-full bg-[#FAF9F6] pb-28 text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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

      {/* 1. TOP HERO BANNER with Curved Bottom Corners */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden rounded-b-[36px] bg-[#0B3B25] shadow-xs">
        <Image
          src="/golden-acres/recipe-hero.jpg"
          alt="Ghanaian Recipes"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-[1.05] opacity-85 select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />

        {/* Floating Top Navigation Header */}
        <header
          className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-3.5 pt-3"
          style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 12px)' }}
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
            <Sparkles className="h-3 w-3 text-[#7A3F1C]" />
            <span>Farm to Pot</span>
          </div>

          <Link
            href="/m/cart"
            aria-label="Basket"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#211A12] shadow-sm border border-[rgba(33,26,18,0.08)] active:scale-95 transition-transform backdrop-blur-xs"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#7A3F1C] px-1 text-[9px] font-black text-white shadow-xs">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </Link>
        </header>

        {/* Bottom Banner Info */}
        <div className="absolute bottom-4 left-4 right-4 text-white z-20">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#7A3F1C] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs">
            <UtensilsCrossed className="h-2.5 w-2.5" /> Authentic Ghanaian
          </span>
          <h1 className="mt-1 text-[20px] font-black tracking-tight text-white sm:text-2xl">
            Cook &amp; Shop Recipes
          </h1>
          <p className="text-[11.5px] font-medium text-white/90 line-clamp-1">
            Fresh Ghanaian recipes with 1-tap farm ingredients shopping.
          </p>
        </div>
      </div>

      <div className="relative px-1.5 pt-3 space-y-2">
        {recipes.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/m/recipes/${recipe.id}`}
            prefetch={true}
            className="group block overflow-hidden rounded-[22px] bg-white shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] active:scale-[0.985] transition-transform"
          >
            {/* Full-bleed Top Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#211A12]">
              <Image
                src={recipe.image}
                alt={recipe.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-2.5 left-2.5 rounded-full bg-white/95 px-2.5 py-0.5 text-[9.5px] font-black text-[#0B3B25] shadow-xs backdrop-blur-xs">
                {recipe.category || 'Traditional Ghanaian'}
              </span>
            </div>

            <div className="p-3.5 bg-[#FAF9F6]">
              <h2 className="text-[15px] font-black text-[#211A12]">
                {recipe.name}
              </h2>
              <p className="mt-0.5 line-clamp-2 text-[12px] font-medium text-[#5C5247]">
                {recipe.description}
              </p>

              <div className="mt-2.5 flex items-center justify-between border-t border-[rgba(33,26,18,0.06)] pt-2 text-[11px] font-bold text-[#5C5247]">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-[#0B3B25]" /> {recipe.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <UtensilsCrossed className="h-3.5 w-3.5 text-[#0B3B25]" /> {recipe.productIds.length} ingredients
                  </span>
                </div>
                <span className="font-black text-[#0B3B25] flex items-center gap-0.5">
                  Shop ingredients <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <MobileBottomNav />
    </div>
  )
}

