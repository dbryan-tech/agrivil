import Link from 'next/link'
import { SmartImage } from '@/components/golden-acres/smart-image'
import { recipes } from '@/lib/golden-acres/data'
import { ArrowRight, Clock, UtensilsCrossed } from 'lucide-react'

export function RecipesPreview() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="flex items-center gap-4">
        <span className="ga-index text-sm text-[var(--ga-terracotta)]">07</span>
        <div className="ga-rule" />
        <span className="ga-kicker shrink-0 text-muted-foreground">Cook &amp; Shop</span>
      </div>
      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <h2 className="ga-headline max-w-xl text-balance text-5xl text-foreground sm:text-6xl">
          Recipes you can <em>shop in a tap</em>
        </h2>
        <Link
          href="/recipes"
          className="group inline-flex items-center gap-2 pb-2 text-base font-semibold text-primary"
        >
          <span className="link-underline">Browse all recipes</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {recipes.slice(0, 3).map((recipe) => (
          <Link
            key={recipe.id}
            href={`/recipes/${recipe.id}`}
            className="ga-card-hover group flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="ga-zoom relative aspect-[16/10] overflow-hidden">
              <SmartImage src={recipe.image} alt={recipe.name} fill className="object-cover" />
              {recipe.category && (
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-bold text-foreground backdrop-blur">
                  {recipe.category}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="ga-headline text-2xl text-foreground">{recipe.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {recipe.description}
              </p>
              <div className="mt-4 flex items-center gap-x-4 border-t border-border pt-3.5 text-xs font-semibold text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-field" /> {recipe.time}
                </span>
                <span className="flex items-center gap-1.5">
                  <UtensilsCrossed className="h-3.5 w-3.5 text-field" />
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
