'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Clock, UtensilsCrossed, ChevronRight, Sparkles } from 'lucide-react'
import { recipes } from '@/lib/golden-acres/data'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'

export default function MobileRecipesScreen() {
  return (
    <div className="relative min-h-dvh w-full bg-[#F7F5F0] pb-28 text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Zero Scrollbar Global Styles */}
      <style jsx global>{`
        * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        *::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      `}</style>

      {/* Top warm brand gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(240px,40vh,360px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.14) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      {/* Header */}
      <header className="relative flex items-center justify-between px-3 pt-3 pb-1.5">
        <h1 className="text-[22px] font-black tracking-tight text-[#211A12]">
          Cook &amp; Shop
        </h1>
        <div className="flex items-center gap-1 text-[10.5px] font-black text-[#7A3F1C]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Farm to Pot</span>
        </div>
      </header>

      <div className="relative px-3 pt-2 space-y-2.5">
        {recipes.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/m/recipes/${recipe.id}`}
            className="group block overflow-hidden rounded-[24px] bg-[#FDFDFB] p-3 shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] active:scale-[0.985] transition-transform"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-white shadow-2xs">
              <Image
                src={recipe.image}
                alt={recipe.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-2 left-2 rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-black text-[#0B3B25] shadow-xs backdrop-blur-xs">
                {recipe.category || 'Traditional Ghanaian'}
              </span>
            </div>

            <div className="mt-2.5">
              <h2 className="text-[14px] font-extrabold text-[#211A12]">
                {recipe.name}
              </h2>
              <p className="mt-0.5 line-clamp-2 text-[11.5px] font-semibold text-[#5C5247]">
                {recipe.description}
              </p>

              <div className="mt-2.5 flex items-center justify-between border-t border-[rgba(33,26,18,0.06)] pt-2 text-[11px] font-bold text-[#5C5247]">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-[#0B3B25]" /> {recipe.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <UtensilsCrossed className="h-3.5 w-3.5 text-[#0B3B25]" /> {recipe.productIds.length} ingredients
                  </span>
                </div>
                <span className="font-extrabold text-[#0B3B25] flex items-center gap-0.5">
                  Shop ingredients <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
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

