'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { Play } from 'lucide-react'
import { generatePaths, ensembleStats } from '@/lib/trajectories'

const COUNT = 80
const STEPS = 120

export function DivergenceLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  const themeRef = useRef(resolvedTheme)
  themeRef.current = resolvedTheme

  const pathsRef = useRef<number[][]>([])
  const realizedRef = useRef(0)
  const progressRef = useRef(0)
  const rafRef = useRef(0)

  const [run, setRun] = useState(0)
  const [stats, setStats] = useState({ mean: 0, sigma: 0, realized: 0 })

  const drawRef = useRef<() => void>(() => {})

  const reseed = useCallback(() => {
    const seed = Math.floor(Math.random() * 1e9)
    const paths = generatePaths(
      { count: COUNT, steps: STEPS, vol: 0.07, drift: 0 },
      seed,
    )
    pathsRef.current = paths
    realizedRef.current = Math.floor(Math.random() * COUNT)
    progressRef.current = 0
    const s = ensembleStats(paths)
    setStats({
      mean: s.mean,
      sigma: s.sigma,
      realized: paths[realizedRef.current][STEPS - 1],
    })
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      drawRef.current()
    }

    const draw = () => {
      const paths = pathsRef.current
      if (!paths.length) return
      const dark = themeRef.current !== 'light'
      const faint = dark ? 'rgba(243,241,234,0.13)' : 'rgba(20,19,15,0.13)'
      const meanCol = dark ? 'rgba(243,241,234,0.4)' : 'rgba(20,19,15,0.4)'
      const amber = dark ? '#E8A24A' : '#C07A16'

      ctx.clearRect(0, 0, width, height)
      const originX = width * 0.03
      const midY = height * 0.5
      const amp = height * 0.4
      const reach = width - originX - width * 0.03
      const prog = progressRef.current
      const shown = Math.max(1, Math.floor(prog * (STEPS - 1)))

      const xAt = (s: number) => originX + (s / (STEPS - 1)) * reach
      const yAt = (v: number) => midY - v * amp

      // mean line
      ctx.save()
      ctx.strokeStyle = meanCol
      ctx.lineWidth = 1
      ctx.setLineDash([2, 6])
      ctx.beginPath()
      ctx.moveTo(originX, midY)
      ctx.lineTo(width * 0.97, midY)
      ctx.stroke()
      ctx.restore()

      // cloud
      ctx.lineWidth = 1
      ctx.strokeStyle = faint
      for (let i = 0; i < paths.length; i++) {
        if (i === realizedRef.current) continue
        const p = paths[i]
        ctx.beginPath()
        for (let s = 0; s <= shown; s++) {
          const x = xAt(s)
          const y = yAt(p[s])
          if (s === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      // realized path
      const rp = paths[realizedRef.current]
      ctx.strokeStyle = amber
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let s = 0; s <= shown; s++) {
        const x = xAt(s)
        const y = yAt(rp[s])
        if (s === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // leading node on realized path
      const nx = xAt(shown)
      const ny = yAt(rp[shown])
      ctx.beginPath()
      ctx.fillStyle = amber
      ctx.arc(nx, ny, 3.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 0.22
      ctx.beginPath()
      ctx.arc(nx, ny, 9, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1

      // origin marker
      ctx.beginPath()
      ctx.fillStyle = amber
      ctx.arc(originX, midY, 4, 0, Math.PI * 2)
      ctx.fill()
    }
    drawRef.current = draw

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    return () => ro.disconnect()
  }, [])

  // animate the draw whenever a new run starts
  useEffect(() => {
    reseed()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      progressRef.current = 1
      drawRef.current()
      return
    }
    let raf = 0
    let start = 0
    const dur = 1500
    const step = (now: number) => {
      if (!start) start = now
      const t = Math.min((now - start) / dur, 1)
      // easeOutCubic
      progressRef.current = 1 - Math.pow(1 - t, 3)
      drawRef.current()
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    rafRef.current = raf
    return () => cancelAnimationFrame(raf)
  }, [run, reseed])

  const fmt = (n: number) => (n >= 0 ? '+' : '') + n.toFixed(3)

  return (
    <div className="grid gap-0 overflow-hidden rounded-sm border border-[#14130f]/15 bg-[#fbfaf6] dark:border-white/12 dark:bg-[#141416] lg:grid-cols-[1fr_300px]">
      <div className="relative">
        <canvas
          ref={canvasRef}
          aria-label="Animated visualization of stochastic trajectories diverging from a shared origin"
          role="img"
          className="block h-[340px] w-full sm:h-[440px]"
        />
        <div className="pointer-events-none absolute left-4 top-4 font-rounded text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[#14130f]/70 dark:text-white/70">
          σ-field // shared seed → divergent outcomes
        </div>
        <div className="pointer-events-none absolute bottom-4 right-4 font-rounded text-[0.62rem] uppercase tracking-[0.18em] text-[#C07A16] dark:text-[#E8A24A]">
          ▬ realized path
        </div>
      </div>

      <div className="flex flex-col justify-between gap-6 border-t border-[#14130f]/15 p-6 dark:border-white/12 lg:border-l lg:border-t-0">
        <div className="space-y-4">
          <Stat label="Trajectories" value={String(COUNT)} />
          <Stat label="Ensemble mean" value={fmt(stats.mean)} muted />
          <Stat
            label="Realized outcome"
            value={fmt(stats.realized)}
            accent
          />
          <Stat label="Divergence σ" value={stats.sigma.toFixed(3)} />
          <Stat label="Run" value={String(run + 1).padStart(3, '0')} muted />
        </div>

        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#14130f] px-5 py-3.5 font-rounded text-sm font-extrabold uppercase tracking-wide text-[#f4f1ea] transition-transform hover:-translate-y-0.5 active:translate-y-0 dark:bg-[#E8A24A] dark:text-[#14130f]"
        >
          <Play className="size-3.5 fill-current" />
          Run simulation
        </button>
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  muted,
  accent,
}: {
  label: string
  value: string
  muted?: boolean
  accent?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-dashed border-[#14130f]/15 pb-2 dark:border-white/12">
      <span className="font-rounded text-[0.78rem] font-bold uppercase tracking-wide text-[#14130f]/75 dark:text-white/75">
        {label}
      </span>
      <span
        className={[
          'font-rounded text-base font-extrabold tabular-nums',
          accent
            ? 'text-[#B26C0E] dark:text-[#E8A24A]'
            : muted
              ? 'text-[#14130f]/75 dark:text-white/75'
              : 'text-[#14130f] dark:text-[#f4f1ea]',
        ].join(' ')}
      >
        {value}
      </span>
    </div>
  )
}
