// Deterministic stochastic-trajectory simulation for Gar AI Labs.
// Non-ergodic premise: every realized path diverges from the ensemble mean.

// mulberry32 — small, fast, seedable PRNG
export function mulberry32(seed: number) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Box–Muller standard normal from a uniform generator
function gaussian(rng: () => number): number {
  let u = 0
  let v = 0
  while (u === 0) u = rng()
  while (v === 0) v = rng()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

export interface PathParams {
  count: number // number of trajectories
  steps: number // resolution along the horizon
  vol: number // volatility (per-step std-dev)
  drift: number // per-step drift
}

// Each path is an array of cumulative values, all starting at 0 (a shared seed state).
export function generatePaths(
  { count, steps, vol, drift }: PathParams,
  seed: number,
): number[][] {
  const rng = mulberry32(seed)
  const paths: number[][] = []
  for (let i = 0; i < count; i++) {
    const pts: number[] = [0]
    let y = 0
    for (let s = 1; s < steps; s++) {
      y += drift + vol * gaussian(rng)
      pts.push(y)
    }
    paths.push(pts)
  }
  return paths
}

// Ensemble statistics across all paths at the final step.
export function ensembleStats(paths: number[][]) {
  const last = paths.map((p) => p[p.length - 1])
  const n = last.length || 1
  const mean = last.reduce((a, b) => a + b, 0) / n
  const variance = last.reduce((a, b) => a + (b - mean) ** 2, 0) / n
  const sigma = Math.sqrt(variance)
  const min = Math.min(...last)
  const max = Math.max(...last)
  return { mean, sigma, min, max, spread: max - min }
}
