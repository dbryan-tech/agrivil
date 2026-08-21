'use client'

import { useState } from 'react'
import {
  Flame,
  Utensils,
  CheckCircle2,
  Circle,
  Sparkles,
  ChefHat,
  Timer,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CookingStepVisualizerProps {
  steps: string[]
  recipeName: string
  tip?: string
}

type StepType = 'boil' | 'pour' | 'fry' | 'pound' | 'garnish' | 'simmer' | 'chop'

function detectStepType(text: string): StepType {
  const lower = text.toLowerCase()
  if (lower.includes('boil') || lower.includes('cook in water') || lower.includes('soak')) return 'boil'
  if (lower.includes('pour') || lower.includes('blend') || lower.includes('sauce') || lower.includes('puree') || lower.includes('add the')) return 'pour'
  if (lower.includes('fry') || lower.includes('sizzle') || lower.includes('oil') || lower.includes('kelewele') || lower.includes('crisp')) return 'fry'
  if (lower.includes('pound') || lower.includes('mash') || lower.includes('fufu') || lower.includes('crush')) return 'pound'
  if (lower.includes('garnish') || lower.includes('season') || lower.includes('sprinkle') || lower.includes('salt') || lower.includes('serve')) return 'garnish'
  if (lower.includes('simmer') || lower.includes('steam') || lower.includes('low heat') || lower.includes('cover')) return 'simmer'
  return 'chop'
}

function StepGraphic({ type }: { type: StepType }) {
  if (type === 'boil') {
    return (
      <div className="relative flex h-20 w-24 shrink-0 items-center justify-center rounded-2xl bg-[#0B3B25]/10 border border-[#0B3B25]/15 overflow-hidden">
        {/* Steam particles */}
        <div className="absolute -top-1 flex gap-1.5 animate-pulse">
          <span className="h-4 w-1 rounded-full bg-[#0B3B25]/40 -rotate-12 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="h-6 w-1 rounded-full bg-[#0B3B25]/60 animate-bounce" style={{ animationDelay: '200ms' }} />
          <span className="h-5 w-1 rounded-full bg-[#0B3B25]/40 rotate-12 animate-bounce" style={{ animationDelay: '400ms' }} />
        </div>
        {/* Boiling Pot Illustration */}
        <svg viewBox="0 0 64 64" className="h-12 w-12 text-[#0B3B25]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 28h40c0 14-8 24-20 24S12 42 12 28z" fill="#0B3B25" fillOpacity="0.15" />
          <path d="M8 28h48" />
          <path d="M16 28v-4a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v4" />
          <circle cx="32" cy="16" r="2" fill="currentColor" />
          <path d="M22 56c2 2 6 2 8 0 2 2 6 2 8 0" stroke="#DF8821" strokeWidth="3" />
        </svg>
      </div>
    )
  }

  if (type === 'pour') {
    return (
      <div className="relative flex h-20 w-24 shrink-0 items-center justify-center rounded-2xl bg-[#DF8821]/10 border border-[#DF8821]/20 overflow-hidden">
        {/* Pouring stream animation */}
        <div className="absolute top-3 left-7 h-10 w-2.5 rounded-full bg-gradient-to-b from-[#DF8821] to-[#7A3F1C] opacity-80 animate-pulse" />
        <svg viewBox="0 0 64 64" className="h-12 w-12 text-[#7A3F1C]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Jug / Blender tilted */}
          <path d="M20 18l14-6 12 20-14 6z" fill="#DF8821" fillOpacity="0.2" />
          <path d="M20 18l-8 4v16l14 4" />
          {/* Receiving bowl */}
          <path d="M16 46h32c0 8-7 12-16 12s-16-4-16-12z" fill="#7A3F1C" fillOpacity="0.25" />
        </svg>
      </div>
    )
  }

  if (type === 'fry') {
    return (
      <div className="relative flex h-20 w-24 shrink-0 items-center justify-center rounded-2xl bg-[#7A3F1C]/10 border border-[#7A3F1C]/20 overflow-hidden">
        {/* Sizzling oil bubbles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="absolute h-2 w-2 rounded-full bg-[#DF8821] animate-ping" style={{ top: '35%', left: '35%' }} />
          <span className="absolute h-1.5 w-1.5 rounded-full bg-[#F0A81E] animate-ping" style={{ top: '45%', right: '35%', animationDelay: '300ms' }} />
        </div>
        <svg viewBox="0 0 64 64" className="h-12 w-12 text-[#7A3F1C]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Frying pan */}
          <circle cx="28" cy="34" r="18" fill="#7A3F1C" fillOpacity="0.15" />
          <path d="M41 47l15 11" strokeWidth="3.5" />
          {/* Plantain slices */}
          <ellipse cx="24" cy="32" rx="5" ry="3" fill="#DF8821" stroke="#DF8821" />
          <ellipse cx="32" cy="36" rx="5" ry="3" fill="#DF8821" stroke="#DF8821" />
          <ellipse cx="28" cy="26" rx="5" ry="3" fill="#DF8821" stroke="#DF8821" />
        </svg>
      </div>
    )
  }

  if (type === 'pound') {
    return (
      <div className="relative flex h-20 w-24 shrink-0 items-center justify-center rounded-2xl bg-[#DF8821]/15 border border-[#DF8821]/25 overflow-hidden">
        <svg viewBox="0 0 64 64" className="h-12 w-12 text-[#7A3F1C]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Mortar */}
          <path d="M16 32h32l-4 22H20z" fill="#7A3F1C" fillOpacity="0.2" />
          {/* Pestle animated */}
          <path d="M36 10l-6 26" strokeWidth="4" className="animate-bounce" style={{ transformOrigin: 'top center' }} />
          <ellipse cx="32" cy="32" rx="16" ry="4" />
        </svg>
      </div>
    )
  }

  if (type === 'simmer') {
    return (
      <div className="relative flex h-20 w-24 shrink-0 items-center justify-center rounded-2xl bg-[#0B3B25]/10 border border-[#0B3B25]/20 overflow-hidden">
        <div className="absolute top-1 flex gap-2">
          <Flame className="h-3 w-3 text-[#DF8821] animate-pulse" />
        </div>
        <svg viewBox="0 0 64 64" className="h-12 w-12 text-[#0B3B25]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 26h36v20a10 10 0 0 1-10 10H24a10 10 0 0 1-10-10V26z" fill="#0B3B25" fillOpacity="0.15" />
          <path d="M10 26h44" />
          <path d="M22 18c0-3 4-5 10-5s10 2 10 5" />
        </svg>
      </div>
    )
  }

  // Default / Chop
  return (
    <div className="relative flex h-20 w-24 shrink-0 items-center justify-center rounded-2xl bg-white border border-[rgba(33,26,18,0.10)] overflow-hidden shadow-2xs">
      <svg viewBox="0 0 64 64" className="h-12 w-12 text-[#0B3B25]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 42l26-26 10 10-26 26z" fill="#0B3B25" fillOpacity="0.15" />
        <path d="M10 50l8-8" strokeWidth="3" />
        <path d="M32 46h18" stroke="#DF8821" strokeDasharray="3 3" />
      </svg>
    </div>
  )
}

export function CookingStepVisualizer({ steps, recipeName, tip }: CookingStepVisualizerProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  function toggleStep(idx: number) {
    setCompletedSteps((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    )
  }

  const progressPercent = Math.round((completedSteps.length / steps.length) * 100)

  return (
    <div className="space-y-3.5 pt-1">
      {/* Progress Bar & Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8A7E72]">
            Step-by-Step Cooking
          </span>
          <h3 className="text-[15px] font-black text-[#211A12]">
            Method &amp; Preparation
          </h3>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-[#0B3B25]/10 px-2.5 py-1 text-[11px] font-black text-[#0B3B25]">
          <Timer className="h-3 w-3" />
          <span>{completedSteps.length} of {steps.length} done</span>
        </div>
      </div>

      {/* Visual Progress Line */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[rgba(33,26,18,0.08)]">
        <div
          className="h-full rounded-full bg-[#0B3B25] transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step Cards with Visual Animations */}
      <div className="space-y-2.5">
        {steps.map((step, idx) => {
          const type = detectStepType(step)
          const isDone = completedSteps.includes(idx)

          return (
            <div
              key={idx}
              onClick={() => toggleStep(idx)}
              className={cn(
                'group flex items-start gap-3 rounded-[20px] p-3 border transition-all cursor-pointer select-none active:scale-[0.99]',
                isDone
                  ? 'bg-[#0B3B25]/5 border-[#0B3B25]/20 opacity-85'
                  : 'bg-white border-[rgba(33,26,18,0.08)] shadow-2xs hover:border-[#0B3B25]/30'
              )}
            >
              {/* Step Animation Visualizer Graphic */}
              <StepGraphic type={type} />

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#7A3F1C]">
                    <span>Step {idx + 1}</span>
                    <span className="text-[9px] font-bold text-[#8A7E72]">· {type.toUpperCase()}</span>
                  </span>
                  <button
                    type="button"
                    aria-label={`Mark step ${idx + 1} complete`}
                    className="text-[#0B3B25]"
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 fill-[#0B3B25] text-white" />
                    ) : (
                      <Circle className="h-5 w-5 text-[#8A7E72]" />
                    )}
                  </button>
                </div>

                <p
                  className={cn(
                    'text-[12.5px] font-medium leading-relaxed transition-all',
                    isDone ? 'line-through text-[#8A7E72]' : 'text-[#211A12]'
                  )}
                >
                  {step}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Chef's Tip Card */}
      {tip && (
        <div className="rounded-[20px] bg-[#DF8821]/10 p-3.5 border border-[#DF8821]/20 flex items-start gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#DF8821] text-[#211A12] shadow-2xs mt-0.5">
            <Sparkles className="h-3.5 w-3.5 stroke-[2.5]" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#7A3F1C]">
              Chef's Authentic Secret
            </span>
            <p className="text-[12px] font-semibold leading-relaxed text-[#211A12]">
              {tip}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
