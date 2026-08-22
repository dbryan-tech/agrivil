'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { Reveal } from '@/components/golden-acres/reveal'
import { useCart } from '@/components/golden-acres/cart-context'
import { useDataStore } from '@/components/golden-acres/store/data-store'
import { recipes } from '@/lib/golden-acres/data'
import { offerFromPrice } from '@/lib/golden-acres/grouping'
import { formatGHS } from '@/lib/golden-acres/format'
import type { Product, Recipe } from '@/lib/golden-acres/types'
import {
  Clock,
  ChefHat,
  Users,
  UtensilsCrossed,
  ShoppingBasket,
  Plus,
  Check,
  Lightbulb,
  ArrowLeft,
} from 'lucide-react'

type ResolvedIngredient = {
  productId: string
  qty: number
  note?: string
  name: string
  /** Cheapest in-stock farmer offer for this produce, if any. */
  offer: Product | null
  unitPrice: number
  lineTotal: number
}

/** Pick the cheapest, in-stock-first offer for a produce name. */
function bestOfferByName(
  name: string,
  products: Product[],
): Product | null {
  const matches = products
    .filter(
      (p) =>
        p.name.trim().toLowerCase() === name.trim().toLowerCase() &&
        p.status !== 'delisted',
    )
    .sort((a, b) => {
      const sa = a.status === 'low' ? 1 : 0
      const sb = b.status === 'low' ? 1 : 0
      if (sa !== sb) return sa - sb
      return offerFromPrice(a) - offerFromPrice(b)
    })
  return matches[0] ?? null
}

export function RecipeDetail({ recipeId }: { recipeId: string }) {
  const recipe = recipes.find((r) => r.id === recipeId) as Recipe | undefined
  if (!recipe) notFound()

  const { liveProducts } = useDataStore()
  const { add, openDrawer } = useCart()

  const ingredients: ResolvedIngredient[] = useMemo(() => {
    // Prefer the enriched ingredient list; fall back to the flat productIds.
    const list =
      recipe.ingredients && recipe.ingredients.length > 0
        ? recipe.ingredients
        : recipe.productIds.map((productId) => ({ productId, qty: 1 }))

    return list.map((ing) => {
      const canonical = liveProducts.find((p) => p.id === ing.productId)
      const name = canonical?.name ?? 'Ingredient'
      const offer = canonical
        ? bestOfferByName(name, liveProducts)
        : null
      const unitPrice = offer ? offerFromPrice(offer) : 0
      return {
        ...ing,
        name,
        offer,
        unitPrice,
        lineTotal: unitPrice * ing.qty,
      }
    })
  }, [recipe, liveProducts])

  const available = ingredients.filter((i) => i.offer)
  const total = available.reduce((sum, i) => sum + i.lineTotal, 0)
  const allAvailable = available.length === ingredients.length

  function addAll() {
    for (const ing of available) {
      if (ing.offer) add(ing.offer, ing.qty)
    }
    openDrawer()
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] pt-24">
      {/* Hero image */}
      <section className="relative flex min-h-[22rem] items-end overflow-hidden border-b border-black/[0.04] sm:min-h-[26rem]">
        <SmartImage
          src={recipe.image}
          alt={recipe.name}
          fill
          priority
          imgClassName="object-cover"
        />
        <div className="ga-media-scrim" aria-hidden />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-2 py-5 sm:px-3 lg:px-4">
          <Link
            href="/recipes"
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white/90 transition-opacity hover:opacity-100"
          >
            <ArrowLeft className="h-4 w-4" /> All recipes
          </Link>
          {recipe.category && (
            <span className="mt-4 block w-fit rounded-full bg-white/92 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#211A12] backdrop-blur-md">
              {recipe.category}
            </span>
          )}
          <h1 className="ga-display-title mt-3 max-w-2xl text-balance text-[clamp(30px,4vw,48px)] text-white">
            {recipe.name}
          </h1>
          {recipe.description && (
            <p className="mt-3 max-w-2xl text-pretty text-base sm:text-lg leading-relaxed text-white/90">
              {recipe.description}
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-white/95">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-white/85" /> {recipe.time}
            </span>
            {recipe.serves && (
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-white/85" /> {recipe.serves}
              </span>
            )}
            {recipe.difficulty && (
              <span className="flex items-center gap-1.5">
                <ChefHat className="w-4 h-4 text-white/85" /> {recipe.difficulty}
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-8 px-2 py-5 sm:px-3 lg:grid-cols-[1.4fr_1fr] lg:px-4">
        {/* Method */}
        <Reveal as="section">
          <h2 className="ga-display-title text-[clamp(22px,2.6vw,30px)] text-[#211A12]">How to cook it.</h2>
          <ol className="mt-5 space-y-4">
            {(recipe.steps ?? []).map((step, i) => (
              <li key={i} className="flex gap-3.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center ga-index rounded-full bg-[#211A12] text-[11px] font-semibold text-white">
                  {i + 1}
                </span>
                <p className="pt-0.5 text-pretty text-sm sm:text-base leading-relaxed text-[#211A12]">
                  {step}
                </p>
              </li>
            ))}
          </ol>

          {recipe.tip && (
            <div className="mt-6 flex gap-3 border-l-2 border-[#7A3F1C]/50 bg-transparent p-0 pl-4">
              <Lightbulb className="h-5 w-5 shrink-0 text-[#7A3F1C]" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7A3F1C]">Chef’s tip</p>
                <p className="mt-1 text-pretty text-sm leading-relaxed text-[#211A12]">
                  {recipe.tip}
                </p>
              </div>
            </div>
          )}
        </Reveal>

        {/* Shoppable ingredients */}
        <Reveal as="div" delay={80}>
          <div className="sticky top-28 rounded-[22px] border border-black/[0.04] bg-[#FDFDFB] p-5 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]">
            <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-[#211A12]">
              Shop the ingredients
            </h2>
            <p className="mt-1 text-xs font-medium text-[#5C5247]">
              Best live prices from our farmers.
            </p>

            <ul className="mt-4 divide-y divide-black/[0.05]">
              {ingredients.map((ing) => (
                <li
                  key={ing.productId}
                  className="flex items-center gap-3 py-3"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#EDE8DF]/40">
                    {ing.offer && (
                      <SmartImage
                        src={ing.offer.image}
                        alt={ing.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-[#211A12]">
                      {ing.name}
                    </p>
                    <p className="truncate text-xs text-[#5C5247]">
                      {ing.qty > 1 ? `${ing.qty} × ` : ''}
                      {ing.note ?? (ing.offer ? 'fresh' : 'unavailable')}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    {ing.offer ? (
                      <>
                        <p className="text-sm font-black text-[#211A12]">
                          {formatGHS(ing.lineTotal)}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            if (ing.offer) add(ing.offer, ing.qty)
                          }}
                          className="inline-flex items-center gap-1 rounded-full border border-[rgba(33,26,18,0.15)] bg-white px-2.5 py-1 text-[12px] font-medium text-[#211A12] transition-colors hover:border-[rgba(11,59,37,0.45)] hover:text-[#0B3B25]"
                          aria-label={`Add ${ing.name} to basket`}
                        >
                          <Plus className="h-3 w-3" /> Add
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-[#5C5247]">
                        Sold out
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between border-t border-black/[0.06] pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5C5247]">
                Total{!allAvailable ? ' (available items)' : ''}
              </span>
              <span className="ga-index text-[22px] font-semibold tracking-[-0.02em] text-[#211A12]">
                {formatGHS(total)}
              </span>
            </div>

            <button
              type="button"
              onClick={addAll}
              disabled={available.length === 0}
              className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0B3B25] px-5 text-[14.5px] font-semibold tracking-[-0.01em] text-white transition-all duration-300 hover:bg-[#0F4A2E] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
            >
              <ShoppingBasket className="h-4 w-4" />
              Add {available.length} ingredient
              {available.length === 1 ? '' : 's'} to basket
            </button>

            {!allAvailable && available.length > 0 && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-[#5C5247]">
                <Check className="h-3.5 w-3.5 text-[#0B3B25]" /> We&apos;ll add the{' '}
                {available.length} item{available.length === 1 ? '' : 's'} in
                stock right now.
              </p>
            )}
          </div>
        </Reveal>
      </div>

      {/* Related dishes */}
      <RelatedRecipes currentId={recipe.id} />
    </div>
  )
}

function RelatedRecipes({ currentId }: { currentId: string }) {
  const others = recipes.filter((r) => r.id !== currentId).slice(0, 3)
  if (others.length === 0) return null
  return (
    <section className="border-t border-[rgba(33,26,18,0.08)] bg-transparent">
      <div className="mx-auto max-w-5xl px-2 py-5 sm:px-3 lg:px-4">
        <h2 className="ga-display-title text-[clamp(20px,2.4vw,26px)] text-[#211A12]">More to cook.</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {others.map((r) => (
            <Link
              key={r.id}
              href={`/recipes/${r.id}`}
              className="group overflow-hidden rounded-[20px] border border-black/[0.04] bg-[#FDFDFB] shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] transition-all"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <SmartImage
                  src={r.image}
                  alt={r.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center gap-2 p-4">
                <UtensilsCrossed className="h-4 w-4 shrink-0 text-[#0B3B25]" />
                <p className="truncate text-sm font-black text-[#211A12] group-hover:text-[#0B3B25] transition-colors">
                  {r.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
