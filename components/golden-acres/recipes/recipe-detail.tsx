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
    <div className="ga-root min-h-screen bg-background">
      {/* Hero image */}
      <section className="relative flex min-h-[22rem] items-end overflow-hidden border-b border-border sm:min-h-[26rem]">
        <SmartImage
          src={recipe.image}
          alt={recipe.name}
          fill
          priority
          imgClassName="object-cover"
        />
        <div className="ga-media-scrim" aria-hidden />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href="/recipes"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-cream/90 transition-opacity hover:opacity-80"
          >
            <ArrowLeft className="h-4 w-4" /> All recipes
          </Link>
          {recipe.category && (
            <span className="mt-4 inline-block rounded-full bg-background/90 px-3 py-1 text-xs font-bold text-foreground backdrop-blur">
              {recipe.category}
            </span>
          )}
          <h1 className="ga-headline mt-3 max-w-2xl text-balance text-4xl text-cream sm:text-5xl">
            {recipe.name}
          </h1>
          {recipe.description && (
            <p className="mt-3 max-w-2xl text-pretty text-lg leading-relaxed text-cream/90">
              {recipe.description}
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-cream/90">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {recipe.time}
            </span>
            {recipe.serves && (
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" /> {recipe.serves}
              </span>
            )}
            {recipe.difficulty && (
              <span className="flex items-center gap-1.5">
                <ChefHat className="h-4 w-4" /> {recipe.difficulty}
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:px-8">
        {/* Method */}
        <Reveal as="section">
          <h2 className="ga-headline text-2xl text-foreground">How to cook it</h2>
          <ol className="mt-5 space-y-5">
            {(recipe.steps ?? []).map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-field text-sm font-bold text-cream">
                  {i + 1}
                </span>
                <p className="pt-1 text-pretty leading-relaxed text-foreground">
                  {step}
                </p>
              </li>
            ))}
          </ol>

          {recipe.tip && (
            <div className="mt-6 flex gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-4">
              <Lightbulb className="h-5 w-5 shrink-0 text-accent-foreground" />
              <div>
                <p className="text-sm font-bold text-foreground">Chef&apos;s tip</p>
                <p className="mt-0.5 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {recipe.tip}
                </p>
              </div>
            </div>
          )}
        </Reveal>

        {/* Shoppable ingredients */}
        <Reveal as="div" delay={80}>
          <div className="sticky top-4 rounded-3xl border border-border bg-card p-5 shadow-sm">
            <h2 className="ga-headline flex items-center gap-2 text-xl text-foreground">
              <ShoppingBasket className="h-5 w-5 text-field" /> Shop the
              ingredients
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Best live prices from our farmers.
            </p>

            <ul className="mt-4 divide-y divide-border">
              {ingredients.map((ing) => (
                <li
                  key={ing.productId}
                  className="flex items-center gap-3 py-3"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-secondary">
                    {ing.offer && (
                      <SmartImage
                        src={ing.offer.image}
                        alt={ing.name}
                        className="h-full w-full"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-foreground">
                      {ing.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {ing.qty > 1 ? `${ing.qty} × ` : ''}
                      {ing.note ?? (ing.offer ? 'fresh' : 'unavailable')}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    {ing.offer ? (
                      <>
                        <p className="text-sm font-bold text-foreground">
                          {formatGHS(ing.lineTotal)}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            if (ing.offer) add(ing.offer, ing.qty)
                          }}
                          className="ga-press mt-1 inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs font-bold text-foreground hover:bg-secondary"
                          aria-label={`Add ${ing.name} to basket`}
                        >
                          <Plus className="h-3 w-3" /> Add
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-muted-foreground">
                        Sold out
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm font-semibold text-muted-foreground">
                Total{!allAvailable ? ' (available items)' : ''}
              </span>
              <span className="ga-headline text-2xl text-foreground">
                {formatGHS(total)}
              </span>
            </div>

            <button
              type="button"
              onClick={addAll}
              disabled={available.length === 0}
              className="ga-press mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-field px-5 py-3 text-sm font-bold text-cream transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingBasket className="h-4 w-4" />
              Add {available.length} ingredient
              {available.length === 1 ? '' : 's'} to basket
            </button>

            {!allAvailable && available.length > 0 && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-field" /> We&apos;ll add the{' '}
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
    <section className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="ga-headline text-2xl text-foreground">More to cook</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {others.map((r) => (
            <Link
              key={r.id}
              href={`/recipes/${r.id}`}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <SmartImage
                  src={r.image}
                  alt={r.name}
                  className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center gap-2 p-4">
                <UtensilsCrossed className="h-4 w-4 shrink-0 text-field" />
                <p className="truncate text-sm font-bold text-foreground">
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
