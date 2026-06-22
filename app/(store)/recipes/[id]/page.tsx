import type { Metadata } from 'next'
import { RecipeDetail } from '@/components/golden-acres/recipes/recipe-detail'
import { recipes } from '@/lib/golden-acres/data'

export function generateStaticParams() {
  return recipes.map((r) => ({ id: r.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const recipe = recipes.find((r) => r.id === id)
  if (!recipe) return { title: 'Recipe — AgriVil' }
  return {
    title: `${recipe.name} — Recipes | AgriVil`,
    description:
      recipe.description ??
      `Cook ${recipe.name} with fresh produce from Ghanaian farmers.`,
  }
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <RecipeDetail recipeId={id} />
}
