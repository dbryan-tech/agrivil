import type { Metadata } from 'next'
import { RecipesCatalog } from '@/components/golden-acres/recipes/recipes-catalog'

export const metadata: Metadata = {
  title: 'Recipes — Cook & Shop | AgriVil',
  description:
    'Authentic Ghanaian recipes with shoppable ingredient lists. Pick a dish and add every fresh ingredient to your basket in one tap — at the best live farmer prices.',
}

export default function RecipesPage() {
  return <RecipesCatalog />
}
