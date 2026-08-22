'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { TextTabs } from '@/components/golden-acres/system'
import { recipes } from '@/lib/golden-acres/data'
import type { Recipe, RecipeCategory } from '@/lib/golden-acres/types'
import { ArrowRight } from 'lucide-react'

const CATEGORIES: (RecipeCategory | 'All')[] = [
  'All',
  'Rice & grains',
  'Stews & soups',
  'Street food',
  'Sides & snacks',
]

/**
 * Recipes index (redesigned, docs/redesign/06 §1).
 * Editorial magazine layout: lead recipe full-bleed with Fraunces title
 * overlay, then hairline rows. Category text-tabs. Same data source.
 */
export function RecipesCatalog() {
  const [category, setCategory] = useState<RecipeCategory | 'All'>('All')

  const filtered = useMemo(() => {
    if (category === 'All') return recipes
    return recipes.filter((r) => r.category === category)
  }, [category])

  // Lead recipe only on the unfiltered view; filtered views are all rows.
  const lead = category === 'All' ? filtered[0] : null
  const rest = lead ? filtered.slice(1) : filtered

  return (
    <main className="min-h-screen bg-[#F7F5F0] pb-20 pt-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Editorial header */}
        <header className="max-w-2xl">
          <p className="text-[13px] font-semibold text-[#7A3F1C]">Cook &amp; shop</p>
          <h1 className="ga-display-title mt-2 text-[clamp(30px,3.6vw,48px)] text-[#211A12]">
            Ghanaian recipes, shoppable in one tap.
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[#5C5247]">
            Pick a dish, see exactly what fresh produce you need, and add every
            ingredient to your basket from our farmers — at the best live price.
          </p>
        </header>

        {/* Category text-tabs */}
        <div className="mt-8 border-b border-[rgba(33,26,18,0.08)]">
          <TextTabs
            tabs={CATEGORIES.map((c) => ({ label: c, value: c }))}
            value={category}
            onChange={(v) => setCategory(v as RecipeCategory | 'All')}
          />
        </div>

        {/* Lead recipe — full-bleed editorial moment */}
        {lead && (
          <Link
            href={`/recipes/${lead.id}`}
            className="group relative mt-10 block aspect-[16/9] overflow-hidden rounded-[24px] sm:aspect-[21/9]"
          >
            <SmartImage
              src={lead.image}
              alt={lead.name}
              fill
              priority
              className="object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(200deg, rgba(8,26,18,0) 30%, rgba(8,26,18,0.78) 100%)',
              }}
            />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
              {lead.category && (
                <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-white/75">
                  {lead.category}
                </span>
              )}
              <h2 className="ga-display-title mt-1.5 max-w-xl text-[clamp(24px,3vw,40px)] text-white">
                {lead.name}
              </h2>
              <p className="ga-index mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-white/80">
                <span>{lead.time}</span>
                {lead.serves && <span>{lead.serves}</span>}
                {lead.difficulty && <span>{lead.difficulty}</span>}
                <span className="inline-flex items-center gap-1.5 font-semibold text-white">
                  Shop the ingredients
                  <ArrowRight
                    width={14}
                    height={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </p>
            </div>
          </Link>
        )}

        {/* Hairline rows */}
        <ul className="mt-12 border-t border-[rgba(33,26,18,0.08)]">
          {rest.map((recipe) => (
            <RecipeRow key={recipe.id} recipe={recipe} />
          ))}
        </ul>

        {rest.length === 0 && !lead && (
          <p className="mt-6 text-[14.5px] text-[#5C5247]">
            No recipes in this category yet — check back soon.
          </p>
        )}
      </div>
    </main>
  )
}

function RecipeRow({ recipe }: { recipe: Recipe }) {
  const count = recipe.ingredients?.length ?? recipe.productIds.length
  return (
    <li>
      <Link
        href={`/recipes/${recipe.id}`}
        className="group grid grid-cols-[88px_1fr_auto] items-center gap-x-5 gap-y-2 border-b border-[rgba(33,26,18,0.08)] py-4 transition-colors sm:grid-cols-[104px_1fr_auto]"
      >
        {/* thumb */}
        <span className="relative block aspect-square overflow-hidden rounded-[14px] border border-[rgba(33,26,18,0.05)]">
          <SmartImage
            src={recipe.image}
            alt={recipe.name}
            fill
            className="object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
        </span>

        {/* name + meta */}
        <span className="min-w-0">
          <span className="block truncate text-[17px] font-semibold tracking-[-0.01em] text-[#211A12] transition-colors duration-300 group-hover:text-[#7A3F1C] sm:text-[19px]">
            {recipe.name}
          </span>
          {recipe.description && (
            <span className="mt-0.5 line-clamp-1 block text-[13px] text-[#5C5247]">
              {recipe.description}
            </span>
          )}
          <span className="ga-index mt-1 block text-[12px] text-[#8A7E72]">
            {recipe.time}
            {recipe.serves ? ` · ${recipe.serves}` : ''}
            {recipe.difficulty ? ` · ${recipe.difficulty}` : ''} · {count} ingredients
          </span>
        </span>

        {/* CTA */}
        <span className="hidden items-center gap-1.5 justify-self-end whitespace-nowrap rounded-full border border-[rgba(33,26,18,0.15)] px-4 py-2 text-[13px] font-medium text-[#211A12] transition-colors duration-300 group-hover:border-[rgba(11,59,37,0.45)] group-hover:text-[#0B3B25] sm:inline-flex">
          Shop ingredients
        </span>
      </Link>
    </li>
  )
}
