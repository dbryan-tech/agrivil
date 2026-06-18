'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { generatePaths } from '@/lib/trajectories'

interface Props {
  className?: string
  density?: number
  highlights?: number
}

const COUNT_DEFAULT = 42
const STEPS = 90

export function TrajectoryField({
  className,
  density = COUNT_DEFAULT,
  highlights = 3,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  const themeRef = useRef(resolvedTheme)
  themeRef.current = resolvedTheme

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    // current + target control points for smooth morphing
    let seed = Math.floor(Math.random() * 1e9)
    let current = generatePaths(
      { count: density, steps: STEPS, vol: 0.085, drift: 0 },
      seed,
    )
    let target = current.map((p) => [...p])

    const reseed = () => {
      seed = Math.floor(Math.random() * 1e9)
      target = generatePaths(
        { count: density, steps: STEPS, vol: 0.085, drift: 0 },
        seed,
      )
    }

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.tx = (e.clientX - rect.left) / rect.width
      mouse.ty = (e.clientY - rect.top) / rect.height
    }
    window.addEventListener('mousemove', onMove)

    let raf = 0
    let last = performance.now()
    let sinceReseed = 0
    let phase = 0

    const draw = (now: number) => {
      const dt = Math.min(now - last, 50)
      last = now
      sinceReseed += dt
      phase += dt * 0.00018

      if (!reduce && sinceReseed > 6500) {
        sinceReseed = 0
        reseed()
      }

      // ease mouse
      mouse.x += (mouse.tx - mouse.x) * 0.05
      mouse.y += (mouse.ty - mouse.y) * 0.05

      // morph current toward target
      const lerp = reduce ? 1 : 0.018
      for (let i = 0; i < current.length; i++) {
        const c = current[i]
        const t = target[i]
        for (let s = 0; s < c.length; s++) {
          c[s] += (t[s] - c[s]) * lerp
        }
      }

      const dark = themeRef.current !== 'light'
      const faint = dark
        ? 'rgba(243,241,234,0.10)'
        : 'rgba(20,19,15,0.10)'
      const meanCol = dark
        ? 'rgba(243,241,234,0.30)'
        : 'rgba(20,19,15,0.30)'
      const amber = dark ? '#E8A24A' : '#C07A16'

      ctx.clearRect(0, 0, width, height)

      const originX = width * 0.04
      const midY = height * (0.46 + (mouse.y - 0.5) * 0.06)
      // amplitude grows with horizon; mouse x widens the fan
      const amp = height * (0.34 + (mouse.x - 0.5) * 0.08)

      const xAt = (s: number) =>
        originX + (s / (STEPS - 1)) * (width - originX - width * 0.02)
      const yAt = (v: number) => midY - v * amp

      // ensemble mean line (flat — the average that never happens)
      ctx.save()
      ctx.strokeStyle = meanCol
      ctx.lineWidth = 1
      ctx.setLineDash([2, 6])
      ctx.beginPath()
      ctx.moveTo(originX, midY)
      ctx.lineTo(width * 0.98, midY)
      ctx.stroke()
      ctx.restore()

      // faint cloud of trajectories
      ctx.lineWidth = 1
      ctx.strokeStyle = faint
      for (let i = highlights; i < current.length; i++) {
        const p = current[i]
        ctx.beginPath()
        for (let s = 0; s < p.length; s++) {
          const x = xAt(s)
          const y = yAt(p[s])
          if (s === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      // highlighted realized paths in signal amber + traveling node
      for (let i = 0; i < highlights && i < current.length; i++) {
        const p = current[i]
        ctx.strokeStyle = amber
        ctx.globalAlpha = dark ? 0.85 : 0.9
        ctx.lineWidth = 1.5
        ctx.beginPath()
        for (let s = 0; s < p.length; s++) {
          const x = xAt(s)
          const y = yAt(p[s])
          if (s === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
        ctx.globalAlpha = 1

        // traveling node
        const prog = (phase + i / highlights) % 1
        const fs = prog * (STEPS - 1)
        const s0 = Math.floor(fs)
        const s1 = Math.min(s0 + 1, STEPS - 1)
        const f = fs - s0
        const vy = p[s0] + (p[s1] - p[s0]) * f
        const nx = xAt(fs)
        const ny = yAt(vy)
        ctx.beginPath()
        ctx.fillStyle = amber
        ctx.arc(nx, ny, 2.6, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 0.25
        ctx.beginPath()
        ctx.arc(nx, ny, 6, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }

      // origin seed marker (shared starting state)
      ctx.beginPath()
      ctx.fillStyle = amber
      ctx.arc(originX, midY, 3, 0, Math.PI * 2)
      ctx.fill()

      if (!reduce) raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('mousemove', onMove)
    }
  }, [density, highlights])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
    />
  )
}
