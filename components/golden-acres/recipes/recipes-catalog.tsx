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
    <div className="min-h-screen bg-[#F7F5F0]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-black/[0.04]">
        <SmartImage
          src="/golden-acres/recipes/ghana-jollof.png"
          alt=""
          fill
          priority
          imgClassName="object-cover"
        />
        <div className="ga-media-scrim" aria-hidden />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#F0A81E]">
            <UtensilsCrossed className="h-4 w-4" /> Cook &amp; shop
          </p>
          <h1 className="ga-headline mt-2 max-w-2xl text-balance text-4xl font-black text-white sm:text-5xl">
            Ghanaian recipes, shoppable in one tap
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-base sm:text-lg leading-relaxed text-white/90">
            Pick a dish, see exactly what fresh produce you need, and add every
            ingredient to your basket from our farmers — at the best live price.
          </p>
        </div>
      </section>

      {/* Category filter */}
      <div className="sticky top-0 z-10 border-b border-black/[0.04] bg-[#F7F5F0]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          {CATEGORIES.map((c) => {
            const active = c === category
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`ga-press shrink-0 rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors ${
                  active
                    ? 'bg-[#0B3B25] text-white shadow-xs'
                    : 'border border-black/[0.06] bg-white text-[#211A12] hover:bg-[#EDE8DF]'
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
      className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-black/[0.04] bg-[#FDFDFB] shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] transition-all"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <SmartImage
          src={recipe.image}
          alt={recipe.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {recipe.category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-extrabold text-[#211A12] backdrop-blur-md shadow-xs">
            {recipe.category}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="ga-headline text-xl font-black text-[#211A12] group-hover:text-[#0B3B25] transition-colors">{recipe.name}</h2>
        {recipe.description && (
          <p className="mt-1.5 line-clamp-2 text-pretty text-sm leading-relaxed text-[#5C5247]">
            {recipe.description}
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-4 text-xs font-semibold text-[#5C5247]">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#0B3B25]" /> {recipe.time}
          </span>
          {recipe.difficulty && (
            <span className="flex items-center gap-1.5">
              <ChefHat className="h-3.5 w-3.5 text-[#0B3B25]" /> {recipe.difficulty}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <UtensilsCrossed className="h-3.5 w-3.5 text-[#0B3B25]" /> {count}{' '}
            ingredients
          </span>
        </div>
      </div>
    </Link>
  )
}
