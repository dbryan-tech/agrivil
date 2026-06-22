'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { Reveal } from '@/components/golden-acres/reveal'
import { recipes } from '@/lib/golden-acres/data'
import type { Recipe, RecipeCategory } from '@/lib/golden-acres/types'
import { Clock, ChefHat, UtensilsCrossed } from 'lucide-react'

const CATEGORIES: (RecipeCategory | 'All')[] = [
  'All',
  'Rice & grains',
  'Stews & soups',
  'Street food',
  'Sides & snacks',
]

export function RecipesCatalog() {
  const [category, setCategory] = useState<RecipeCategory | 'All'>('All')

  const filtered = useMemo(() => {
    if (category === 'All') return recipes
    return recipes.filter((r) => r.category === category)
  }, [category])

  return (
    <div className="ga-root min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <SmartImage
          src="/golden-acres/recipes/ghana-jollof.png"
          alt=""
          fill
          priority
          imgClassName="object-cover"
        />
        <div className="ga-media-scrim" aria-hidden />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-cream/90">
            <UtensilsCrossed className="h-4 w-4" /> Cook &amp; shop
          </p>
          <h1 className="ga-headline mt-2 max-w-2xl text-balance text-4xl text-cream sm:text-5xl">
            Ghanaian recipes, shoppable in one tap
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-lg leading-relaxed text-cream/90">
            Pick a dish, see exactly what fresh produce you need, and add every
            ingredient to your basket from our farmers — at the best live price.
          </p>
        </div>
      </section>

      {/* Category filter */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          {CATEGORIES.map((c) => {
            const active = c === category
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`ga-press shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  active
                    ? 'bg-field text-cream'
                    : 'border border-border bg-card text-foreground hover:bg-secondary'
                }`}
              >
                {c}
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((recipe, i) => (
            <Reveal key={recipe.id} delay={i * 50} as="article">
              <RecipeCard recipe={recipe} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const count = recipe.ingredients?.length ?? recipe.productIds.length
  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <SmartImage
          src={recipe.image}
          alt={recipe.name}
          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
        />
        {recipe.category && (
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-bold text-foreground backdrop-blur">
            {recipe.category}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="ga-headline text-xl text-foreground">{recipe.name}</h2>
        {recipe.description && (
          <p className="mt-1.5 line-clamp-2 text-pretty text-sm leading-relaxed text-muted-foreground">
            {recipe.description}
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-4 text-xs font-semibold text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-field" /> {recipe.time}
          </span>
          {recipe.difficulty && (
            <span className="flex items-center gap-1.5">
              <ChefHat className="h-3.5 w-3.5 text-field" /> {recipe.difficulty}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <UtensilsCrossed className="h-3.5 w-3.5 text-field" /> {count}{' '}
            ingredients
          </span>
        </div>
      </div>
    </Link>
  )
}
