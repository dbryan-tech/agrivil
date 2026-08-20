import Link from 'next/link'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { recipes } from '@/lib/golden-acres/data'
import { ArrowRight, Clock, UtensilsCrossed } from 'lucide-react'

export function RecipesPreview() {
  return (
    <section className="mx-auto max-w-7xl px-2 py-6 sm:px-3 lg:px-4 lg:py-8">
      <div className="flex items-center gap-3">
        <span className="ga-index text-xs font-black text-[#7A3F1C]">07</span>
        <div className="ga-rule" />
        <span className="ga-kicker shrink-0 text-xs font-extrabold text-[#5C5247]">Cook &amp; Shop</span>
      </div>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <h2 className="ga-headline max-w-xl text-balance text-2xl font-black text-[#211A12] sm:text-3xl">
          Recipes you can <em className="text-[#0B3B25]">shop in a tap</em>
        </h2>
        <Link
          href="/recipes"
          className="group inline-flex items-center gap-1.5 pb-0.5 text-xs font-extrabold text-[#0B3B25] hover:text-[#072618] sm:text-sm"
        >
          <span className="link-underline">Browse all recipes</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {recipes.slice(0, 3).map((recipe) => (
          <Link
            key={recipe.id}
            href={`/recipes/${recipe.id}`}
            className="ga-card-hover group flex flex-col justify-between overflow-hidden rounded-[24px] border border-black/[0.04] bg-[#FDFDFB] shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)]"
          >
            <div className="ga-zoom relative aspect-[16/10] overflow-hidden">
              <SmartImage src={recipe.image} alt={recipe.name} fill className="object-cover" />
              {recipe.category && (
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-extrabold text-[#211A12] backdrop-blur-md shadow-xs">
                  {recipe.category}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="ga-headline text-xl font-black text-[#211A12] group-hover:text-[#0B3B25] transition-colors">{recipe.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[#5C5247]">
                {recipe.description}
              </p>
              <div className="mt-4 flex items-center gap-x-4 border-t border-black/[0.06] pt-3.5 text-xs font-semibold text-[#5C5247]">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#0B3B25]" /> {recipe.time}
                </span>
                <span className="flex items-center gap-1.5">
                  <UtensilsCrossed className="h-3.5 w-3.5 text-[#0B3B25]" />
                  {recipe.ingredients?.length ?? recipe.productIds.length} ingredients
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
