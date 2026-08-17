import type { Metadata } from 'next'
import { recipes } from '@/lib/golden-acres/data'
import { RecipeDetail } from '@/components/golden-acres/recipes/recipe-detail'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const recipe = recipes.find((r) => r.id === id)
  if (!recipe) {
    return {
      title: 'Recipe — Cook with Fresh Produce | AgriVil',
      description: 'Authentic Ghanaian recipe with 1-tap shoppable ingredient basket.',
    }
  }

  return {
    title: `${recipe.name} — Cook with Farm-Fresh Produce | AgriVil`,
    description: `${recipe.description || recipe.name}. Cook authentic Ghanaian meals with produce from local farmers.`,
    openGraph: {
      title: `${recipe.name} — Shoppable Recipe Kit | AgriVil`,
      description: recipe.description || `Cook ${recipe.name} with fresh Ghanaian ingredients.`,
      images: [{ url: recipe.image, width: 800, height: 600, alt: recipe.name }],
    },
  }
}

export default async function RecipeDetailPage({ params }: PageProps) {
  const { id } = await params
  return <RecipeDetail recipeId={id} />
}
