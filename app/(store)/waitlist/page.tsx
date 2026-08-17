'use client'

import { useState } from 'react'
import { MapPin, Sparkles, Sprout, ArrowRight } from 'lucide-react'
import { WaitlistForm } from '@/components/golden-acres/waitlist-form'
import { OUT_OF_ZONE_AREAS } from '@/lib/golden-acres/data'

export default function WaitlistPage() {
  const [selectedArea, setSelectedArea] = useState('Kumasi')

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Regional Expansion
        </span>
        <h1 className="ga-display mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
          Bring AgriVil to your city
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
          We currently deliver across the Greater Accra pilot zone. Join the
          priority waitlist for your region and get GH₵25 credit when we launch
          our cold-chain hub near you.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-xl">
        <div className="mb-6 rounded-2xl border border-border bg-card p-5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Select your city / region
          </label>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {OUT_OF_ZONE_AREAS.map((a) => {
              const active = selectedArea === a
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => setSelectedArea(a)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                    active
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'border border-border bg-secondary/50 text-foreground hover:bg-secondary'
                  }`}
                >
                  {a}
                </button>
              )
            })}
          </div>
        </div>

        <WaitlistForm area={selectedArea} />
      </div>
    </div>
  )
}
