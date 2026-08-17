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
    <div className="min-h-dvh bg-[#F4F1EA] pb-32 text-[#2B1F17]">
      {/* Floating Back Bar */}
      <div
        className="fixed inset-x-0 top-0 z-40 mx-auto flex max-w-md items-center justify-between p-4"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 16px)' }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="ga-press flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#2B1F17] shadow-md backdrop-blur-md"
        >
          <ArrowLeft className="h-5 w-5" />
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <span className="rounded-full bg-[#A3E635] px-2.5 py-0.5 text-[10px] font-extrabold text-[#144028]">
            {recipe.category || 'Traditional Recipe'}
          </span>
          <h1 className="ga-headline mt-1.5 text-2xl font-extrabold">{recipe.name}</h1>
          <div className="mt-1 flex items-center gap-3 text-xs text-white/90">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-[#A3E635]" /> {recipe.time}
            </span>
            <span className="flex items-center gap-1">
              <UtensilsCrossed className="h-3.5 w-3.5 text-[#A3E635]" /> {recipeProducts.length} fresh ingredients
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Description */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <p className="text-xs leading-relaxed text-[#6E6A63]">
            {recipe.description}
          </p>
        </div>

        {/* 2. Shoppable Ingredients List */}
        <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E0DACB]/60">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#2B1F17]">
              Farm-Fresh Ingredients ({recipeProducts.length})
            </span>
            <span className="text-xs font-bold text-[#1E5D3B]">
              Total: {formatGHS(totalIngredientsPrice)}
            </span>
          </div>

          <div className="mt-3 space-y-2.5">
            {recipeProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-2xl bg-[#F4F1EA] p-2.5 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#2B1F17]">{product.name}</h4>
                    <span className="text-[10px] text-[#6E6A63]">
                      From {product.farmerName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[#1E5D3B]">
                    {formatGHS(product.priceMin)}
                  </span>
                  <button
                    type="button"
                    onClick={() => add(product, 1)}
                    aria-label={`Add ${product.name} to cart`}
                    className="ga-press flex h-7 w-7 items-center justify-center rounded-full bg-[#1E5D3B] text-white"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Preparation Instructions */}
        {recipe.instructions && recipe.instructions.length > 0 && (
          <div className="rounded-3xl border border-[#E0DACB] bg-white p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#2B1F17]">
              Step-by-Step Cooking Guide
            </h3>
            <ol className="space-y-2.5 text-xs text-[#2B1F17]">
              {recipe.instructions.map((step, idx) => (
                <li key={idx} className="flex gap-2.5 leading-relaxed">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1E5D3B]/10 text-[10px] font-bold text-[#1E5D3B]">
                    {idx + 1}
                  </span>
                  <span className="text-[#6E6A63]">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Sticky Bottom 1-Tap Add All Action */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-[#E0DACB] bg-white/95 p-4 shadow-xl backdrop-blur-md"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 14px)' }}
      >
        <button
          type="button"
          onClick={handleAddAll}
          className="ga-press flex h-14 w-full items-center justify-between rounded-2xl bg-[#1E5D3B] px-5 text-sm font-bold text-white shadow-md hover:bg-[#144028]"
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span>{allAdded ? 'Added All to Cart!' : 'Add All Ingredients'}</span>
          </div>
          <span>{formatGHS(totalIngredientsPrice)}</span>
        </button>
      </div>
    </div>
  )
}
