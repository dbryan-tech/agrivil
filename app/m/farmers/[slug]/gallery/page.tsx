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
    <div className="relative min-h-dvh bg-[#F7F5F0] pb-24 text-[#211A12] select-none antialiased overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Top warm brand gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(240px,40vh,360px)]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, rgba(122,63,28,0.14) 0%, rgba(240,168,30,0.06) 35%, rgba(247,245,240,0.4) 75%, rgba(247,245,240,1) 100%)',
        }}
      />

      {/* Header */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between border-b border-[rgba(33,26,18,0.06)] bg-[#F7F5F0]/90 backdrop-blur-md px-3 py-2.5"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 10px)' }}
      >
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#211A12] shadow-2xs border border-[rgba(33,26,18,0.10)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-[16px] font-black text-[#211A12]">Farm Gallery</h1>
            <p className="text-[10.5px] font-semibold text-[#5C5247]">{farmer.farmName || farmer.name}</p>
          </div>
        </div>
      </header>

      {/* Gallery Grid */}
      <div className="relative px-3 pt-3 space-y-2.5">
        <p className="text-[12px] font-medium text-[#5C5247]">
          Glimpses from daily cultivation, harvesting, and sorting on the ground in {farmer.town}.
        </p>

        <div className="grid grid-cols-2 gap-2">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              onClick={() => setActiveImage(img.src)}
              className="group relative aspect-square overflow-hidden rounded-[22px] bg-[#FDFDFB] shadow-[0_2px_12px_-2px_rgba(33,26,18,0.04),0_6px_18px_-4px_rgba(33,26,18,0.06)] cursor-pointer active:scale-95 transition-transform"
            >
              <Image
                src={img.src}
                alt={img.caption}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <span className="text-[9.5px] font-bold text-white line-clamp-1">{img.caption}</span>
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
