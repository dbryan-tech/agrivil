'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Clock, UtensilsCrossed, ChevronRight } from 'lucide-react'
import { recipes } from '@/lib/golden-acres/data'
import { MobileAppBar } from '@/components/golden-acres/mobile/mobile-app-bar'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'

export default function MobileRecipesScreen() {
  return (
    <div className="min-h-dvh bg-[#F4F1EA] pb-24 text-[#2B1F17]">
      <MobileAppBar title="Cook & Shop" showSearch showCart />

      <div className="px-4 py-4 space-y-3">
        {recipes.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/m/recipes/${recipe.id}`}
            className="ga-press block overflow-hidden rounded-3xl border border-[#E0DACB] bg-white p-3.5 shadow-xs hover:border-[#1E5D3B]/40"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#F4F1EA]">
              <Image
                src={recipe.image}
                alt={recipe.name}
                fill
                className="object-cover"
              />
              <span className="absolute top-2.5 left-2.5 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-extrabold text-[#1E5D3B] backdrop-blur-xs">
                {recipe.category || 'Traditional Ghanaian'}
              </span>
            </div>

            <div className="mt-3">
              <h2 className="text-sm font-extrabold text-[#2B1F17]">
                {recipe.name}
              </h2>
              <p className="mt-1 line-clamp-2 text-xs text-[#6E6A63]">
                {recipe.description}
              </p>

              <div className="mt-2.5 flex items-center justify-between border-t border-[#E0DACB]/60 pt-2 text-[11px] font-semibold text-[#6E6A63]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-[#1E5D3B]" /> {recipe.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <UtensilsCrossed className="h-3.5 w-3.5 text-[#1E5D3B]" /> {recipe.productIds.length} items
                  </span>
                </div>
                <span className="font-bold text-[#1E5D3B] flex items-center">
                  Shop recipe <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <MobileBottomNav />
    </div>
  )
}
