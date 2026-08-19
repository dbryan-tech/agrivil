'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, X, Sparkles } from 'lucide-react'
import { farmers } from '@/lib/golden-acres/data'
import { MobileBottomNav } from '@/components/golden-acres/mobile/mobile-bottom-nav'

export default function MobileFarmerGalleryScreen() {
  const router = useRouter()
  const params = useParams<{ slug: string }>()
  const rawSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || ''
  const farmer = farmers.find((f) => f.slug === rawSlug) || farmers[0]

  const galleryImages = [
    { src: farmer.photo, caption: 'Morning harvest inspection at sunrise' },
    { src: '/golden-acres/hero-farmer.jpg', caption: 'Irrigated nursery beds and red-earth fields' },
    { src: '/golden-acres/story-harvest.jpg', caption: 'Hand-sorting ripe produce for hub delivery' },
    { src: '/golden-acres/produce/roma-tomatoes-1.png', caption: 'Fresh morning Roma tomatoes ready for crates' },
    { src: '/golden-acres/produce/sweet-pineapple-1.png', caption: 'Field harvested pineapple collection' },
    { src: '/golden-acres/bundle-box.png', caption: 'Packed cold-chain crates dispatched to Kumasi' },
  ]

  const [activeImage, setActiveImage] = useState<string | null>(null)

  return (
    <div className="min-h-dvh bg-[#FAF7F0] pb-24 text-[#2B1F17]">
      {/* Header */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between border-b border-[#E0DACB] bg-[#FAF7F0] px-3 sm:px-4 py-2.5"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 10px)' }}
      >
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="ga-press flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2B1F17] shadow-xs border border-[#E0DACB]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-base font-extrabold text-[#2B1F17]">Farm Gallery</h1>
            <p className="text-[10px] text-[#6E6A63]">{farmer.farmName || farmer.name}</p>
          </div>
        </div>
      </header>

      {/* Gallery Grid */}
      <div className="px-3 sm:px-4 pt-3.5 space-y-3">
        <p className="text-xs text-[#6E6A63]">
          Glimpses from daily cultivation, harvesting, and sorting on the ground in {farmer.town}.
        </p>

        <div className="grid grid-cols-2 gap-2.5">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              onClick={() => setActiveImage(img.src)}
              className="ga-press group relative aspect-square overflow-hidden rounded-3xl border border-[#E0DACB] bg-white shadow-xs cursor-pointer"
            >
              <Image
                src={img.src}
                alt={img.caption}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <span className="text-[9px] font-bold text-white line-clamp-1">{img.caption}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in"
        >
          <button
            type="button"
            onClick={() => setActiveImage(null)}
            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-3xl">
            <Image
              src={activeImage}
              alt="Enlarged farm photo"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      <MobileBottomNav />
    </div>
  )
}
