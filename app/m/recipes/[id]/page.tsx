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
} from 'lucide-react'
import { recipes, products } from '@/lib/golden-acres/data'
import { formatGHS } from '@/lib/golden-acres/format'
import { useCart } from '@/components/golden-acres/cart-context'

export default function MobileRecipeDetailScreen() {
  const params = useParams<{ id: string }>()
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id || '1'
  const router = useRouter()
  const { add } = useCart()

  const recipe =
    recipes.find((r) => r.id === rawId) || recipes[0]

  const [servings, setServings] = useState(4)
  const [allAdded, setAllAdded] = useState(false)

  // Resolve ingredient products
  const recipeProducts = recipe.productIds
    .map((pid) => products.find((p) => p.id === pid))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  const totalIngredientsPrice = recipeProducts.reduce(
    (sum, p) => sum + p.priceMin,
    0
  )

  function handleAddAll() {
    recipeProducts.forEach((p) => add(p, 1))
    setAllAdded(true)
    setTimeout(() => setAllAdded(false), 1800)
  }

  return (
    <div className="relative min-h-dvh bg-[#F7F5F0] pb-32 text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Floating Back Bar */}
      <div
        className="fixed inset-x-0 top-0 z-40 mx-auto flex max-w-md items-center justify-between px-3 py-2.5"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 10px)' }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      </div>

      {/* 1. Recipe Hero Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-white shadow-xs">
        <Image
          src={recipe.image}
          alt={recipe.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

        <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#0B3B25] px-2.5 py-0.5 text-[9.5px] font-black uppercase tracking-wider text-white shadow-xs">
            {recipe.category}
          </span>
          <h1 className="mt-1 text-[22px] font-black text-white sm:text-2xl">
            {recipe.name}
          </h1>
          <div className="mt-1 flex items-center gap-3 text-[11.5px] text-white/90 font-semibold">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {recipe.time}
            </span>
            <span>·</span>
            <span>Serves {servings}</span>
          </div>
        </div>
      </div>

      <div className="relative px-3 pt-2.5 space-y-2.5">
        {/* 2. Recipe Story / Description */}
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <h2 className="text-[10px] font-black uppercase tracking-[0.14em] text-[#7A3F1C]">
            Recipe Note
          </h2>
          <p className="mt-1 text-[12px] leading-relaxed text-[#211A12] font-semibold">
            {recipe.description ||
              'A beloved staple in Ghanaian homes. Authentic, deeply flavorful, and made using only fresh, locally harvested produce.'}
          </p>
        </div>

        {/* 3. Ingredient Produce Checklist */}
        <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
          <div className="flex items-center justify-between pb-2 border-b border-[rgba(33,26,18,0.06)]">
            <h3 className="text-[10px] font-black uppercase tracking-[0.14em] text-[#5C5247]">
              Farm Ingredients ({recipeProducts.length})
            </h3>
            <span className="text-[12.5px] font-black text-[#0B3B25]">
              Total: {formatGHS(totalIngredientsPrice)}
            </span>
          </div>

          <div className="space-y-2 divide-y divide-[rgba(33,26,18,0.06)]">
            {recipeProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2.5">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white shadow-2xs">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-[12.5px] font-extrabold text-[#211A12]">{p.name}</h4>
                    <p className="text-[10px] font-semibold text-[#5C5247]">
                      {p.farmerName || 'Ghana Local Farm'} · {formatGHS(p.priceMin)} / {p.unit}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => add(p, 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0B3B25] text-white shadow-xs active:scale-90 transition-transform"
                  aria-label={`Add ${p.name} to cart`}
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Steps Section */}
        {recipe.steps && recipe.steps.length > 0 && (
          <div className="rounded-[24px] bg-[#FDFDFB] p-3.5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
            <h3 className="text-[10px] font-black uppercase tracking-[0.14em] text-[#7A3F1C]">
              Cooking Instructions
            </h3>
            <ol className="mt-2 space-y-2 text-[12px] text-[#211A12] font-semibold">
              {recipe.steps.map((step, idx) => (
                <li key={idx} className="flex gap-2 leading-relaxed">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0B3B25]/10 text-[10px] font-black text-[#0B3B25]">
                    {idx + 1}
                  </span>
                  <span className="text-[#5C5247]">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Sticky Bottom 1-Tap Add All Action */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-[rgba(33,26,18,0.08)] bg-[#F7F5F0]/95 px-3 pt-2.5 backdrop-blur-md shadow-[0_-4px_20px_rgba(33,26,18,0.04)]"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 14px)' }}
      >
        <button
          type="button"
          onClick={handleAddAll}
          className="flex h-12 w-full items-center justify-between rounded-full bg-[#0B3B25] px-5 text-[13px] font-extrabold text-white shadow-md active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span>{allAdded ? 'Added All to Cart!' : 'Add All Ingredients'}</span>
          </div>
          <span className="text-[15px] font-black">{formatGHS(totalIngredientsPrice)}</span>
        </button>
      </div>
    </div>
  )
}
