'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import {
  Clock,
  UtensilsCrossed,
  Plus,
  Check,
  ShoppingBag,
  Sparkles,
  ArrowLeft,
  ChefHat,
  Leaf,
} from 'lucide-react'
import { recipes, products } from '@/lib/golden-acres/data'
import { formatGHS } from '@/lib/golden-acres/format'
import { useCart } from '@/components/golden-acres/cart-context'

export default function MobileRecipeDetailScreen() {
  const params = useParams<{ id: string }>()
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id || 'r1'
  const router = useRouter()
  const { add, count } = useCart()

  const recipe =
    recipes.find((r) => r.id === rawId) || recipes[0]

  const [servings, setServings] = useState(4)
  const [allAdded, setAllAdded] = useState(false)

  // Resolve ingredient products
  const recipeProducts = recipe.productIds
    .map((pid) => products.find((p) => p.id === pid))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  const totalIngredientsPrice = recipeProducts.reduce(
    (sum, p) => sum + (p.pricePerKg || p.priceMin),
    0
  )

  function handleAddAll() {
    recipeProducts.forEach((p) => add(p, 1))
    setAllAdded(true)
    setTimeout(() => setAllAdded(false), 1800)
  }

  return (
    <div className="relative min-h-dvh bg-[#FAF9F6] pb-32 text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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

      {/* 1. TOP HERO IMAGE with Curved Bottom Corners */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-b-[36px] bg-[#211A12] shadow-xs">
        <Image
          src={recipe.image}
          alt={recipe.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-[1.05] transition-transform select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

        {/* Floating Top Nav */}
        <header
          className="fixed inset-x-0 top-0 z-40 mx-auto flex max-w-md items-center justify-between px-1.5 pt-3"
          style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 36px)' }}
        >
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#211A12] shadow-sm border border-[rgba(33,26,18,0.08)] active:scale-95 transition-transform backdrop-blur-xs"
          >
            <ArrowLeft className="h-4 w-4 stroke-[2.4]" />
          </button>

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
          <span className="inline-flex items-center gap-1 rounded-full bg-[#0B3B25] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs">
            <Sparkles className="h-2.5 w-2.5" /> Authentic Recipe
          </span>
          <h1 className="mt-1 text-[22px] font-black text-white sm:text-3xl leading-tight">
            {recipe.name}
          </h1>
          <div className="mt-1 flex items-center gap-3 text-[12px] text-white/90 font-bold">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-[#F0A81E]" /> {recipe.time}
            </span>
            <span>·</span>
            <span>{recipe.serves || 'Serves 4'}</span>
            <span>·</span>
            <span>{recipe.difficulty || 'Medium'}</span>
          </div>
        </div>
      </div>

      <div className="relative px-1.5 pt-3.5 space-y-3.5">
        {/* 2. Recipe Story / Description (Direct on background, zero card wrapper) */}
        <div className="space-y-1">
          <h2 className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8A7E72]">
            About This Dish
          </h2>
          <p className="text-[13px] leading-relaxed text-[#211A12] font-semibold">
            {recipe.description}
          </p>
        </div>

        {/* 3. Farm-Fresh Ingredients (PRESERVED AS DEDICATED CARD) */}
        <div className="rounded-[24px] bg-white p-4 shadow-sm border border-[rgba(33,26,18,0.06)]">
          <div className="flex items-center justify-between pb-2.5 border-b border-[rgba(33,26,18,0.06)]">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8A7E72]">
                100% Farm Sourced
              </span>
              <h3 className="text-[15px] font-black text-[#211A12]">
                Farm Ingredients ({recipeProducts.length})
              </h3>
            </div>
            <span className="text-[14px] font-black text-[#0B3B25]">
              Total: {formatGHS(totalIngredientsPrice)}
            </span>
          </div>

          <div className="space-y-2.5 divide-y divide-[rgba(33,26,18,0.06)] pt-1">
            {recipeProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between pt-2.5">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-white shadow-2xs">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-black text-[#211A12]">{p.name}</h4>
                    <p className="text-[10.5px] font-bold text-[#7A3F1C]">
                      {p.farmerName || 'Ghana Local Farm'} · {formatGHS(p.pricePerKg || p.priceMin)} / {p.unit}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => add(p, 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B3B25] text-white shadow-xs active:scale-90 transition-transform"
                  aria-label={`Add ${p.name} to cart`}
                >
                  <Plus className="h-4 w-4 stroke-[2.4]" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Cooking Instructions (Direct on background, zero card wrapper) */}
        {recipe.steps && recipe.steps.length > 0 && (
          <div className="space-y-2.5 pt-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8A7E72]">
              Step-by-Step Cooking Instructions
            </h3>
            <div className="space-y-3">
              {recipe.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0B3B25] text-[11px] font-black text-white shadow-xs mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-[13px] leading-relaxed text-[#211A12] font-semibold">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {recipe.tip && (
              <div className="mt-3 flex items-start gap-2 pt-2 text-[12px] font-medium text-[#7A3F1C] border-t border-[rgba(33,26,18,0.06)]">
                <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-[#F0A81E]" />
                <p>
                  <strong className="font-black text-[#211A12]">Chef's Tip:</strong> {recipe.tip}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sticky Bottom 1-Tap Add All Action */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-[rgba(33,26,18,0.08)] bg-white/95 px-3.5 pt-2.5 backdrop-blur-md shadow-[0_-4px_20px_rgba(33,26,18,0.04)]"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 14px)' }}
      >
        <button
          type="button"
          onClick={handleAddAll}
          className="flex h-12 w-full items-center justify-between rounded-full bg-[#0B3B25] px-5 text-[13px] font-extrabold text-white shadow-md active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-2">
            {allAdded ? (
              <Check className="h-4 w-4 stroke-[3]" />
            ) : (
              <ShoppingBag className="h-4 w-4" />
            )}
            <span>{allAdded ? 'Added All Ingredients to Basket!' : 'Add All Ingredients to Basket'}</span>
          </div>
          <span className="text-[15px] font-black">{formatGHS(totalIngredientsPrice)}</span>
        </button>
      </div>
    </div>
  )
}
