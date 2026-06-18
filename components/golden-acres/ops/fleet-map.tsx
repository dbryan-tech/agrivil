'use client'

// Ops fleet map.
// -----------------------------------------------------------------------------
// A staff-facing view of EVERY active delivery on one shared Greater Accra SVG.
// Reuses the same projection/route helpers as the customer DeliveryMap, but
// plots all in-flight drivers at once. It polls `getActiveDeliveries` for live
// state and offers a fleet-wide "Advance" heartbeat (`tickAllDeliveries`) so a
// demo can move the whole fleet without opening each order. The carrier webhook
// stays the single writer of delivery state.

import { useState } from 'react'
import useSWR from 'swr'
import {
  Navigation,
  Warehouse,
  Snowflake,
  Phone,
  Package,
  Loader2,
  MapPin,
} from 'lucide-react'
import {
  getActiveDeliveries,
  tickAllDeliveries,
  type ActiveDelivery,
} from '@/app/actions/logistics'
import { HUB } from '@/lib/golden-acres/data'
import { projectToUnit, routePolyline, pointAlongRoute } from '@/lib/golden-acres/geo'
import type { GeoPoint } from '@/lib/golden-acres/types'

const VIEW = 1000
const POLL_MS = 4000
const scale = (p: { x: number; y: number }) => ({ x: p.x * VIEW, y: p.y * VIEW })

// Stable accent per delivery so the marker and list row line up visually.
const MARKER_COLORS = [
  'var(--color-field-deep)',
  'var(--color-clay)',
  'var(--color-leaf)',
  'var(--color-gold)',
  'var(--color-field)',
]
const colorFor = (i: number) => MARKER_COLORS[i % MARKER_COLORS.length]

export function FleetMap() {
  const { data, isLoading, mutate } = useSWR(
    'fleet-active',
    async () => {
      const res = await getActiveDeliveries()
      return res.ok ? res.deliveries : []
    },
    { refreshInterval: POLL_MS },
  )
  const deliveries = data ?? []
  const [selected, setSelected] = useState<string | null>(null)
  const [advancing, setAdvancing] = useState(false)

  const origin: GeoPoint = HUB.location
  const o = scale(projectToUnit(origin))

  async function handleAdvance() {
    setAdvancing(true)
    try {
      const res = await tickAllDeliveries()
      if (res.ok) mutate(res.deliveries, { revalidate: false })
    } catch (e) {
      console.log('[v0] tickAllDeliveries failed:', e)
    } finally {
      setAdvancing(false)
    }
  }

  const outForDelivery = deliveries.filter((d) => d.status === 'out-for-delivery').length

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 space-y-5 p-4 sm:p-6">
      {/* Header / controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="ga-display text-2xl font-semibold text-foreground">
            Fleet map
          </h2>
          <p className="text-sm text-muted-foreground">
            {deliveries.length} active{' '}
            {deliveries.length === 1 ? 'delivery' : 'deliveries'}
            {outForDelivery > 0 && ` · ${outForDelivery} on the road`}
          </p>
        </div>
        <button
          onClick={handleAdvance}
          disabled={advancing || deliveries.length === 0}
          className="ga-press inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 font-bold text-primary-foreground disabled:opacity-50"
        >
          {advancing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Advancing…
            </>
          ) : (
            <>
              <Navigation className="h-4 w-4" /> Advance fleet
            </>
          )}
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        {/* Map */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-field" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Greater Accra
              </h3>
            </div>
            <span className="flex items-center gap-2 text-xs font-bold text-field">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-field/60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-field" />
              </span>
              Live
            </span>
          </div>

          <svg
            viewBox={`0 0 ${VIEW} ${VIEW}`}
            className="h-80 w-full sm:h-[28rem]"
            role="img"
            aria-label={`Fleet map showing ${deliveries.length} active deliveries across Greater Accra`}
            preserveAspectRatio="xMidYMid slice"
          >
            <rect x="0" y="0" width={VIEW} height={VIEW} fill="var(--color-secondary)" />
            <rect x="0" y={VIEW - 120} width={VIEW} height="120" fill="var(--color-field)" opacity="0.12" />
            <text x="24" y={VIEW - 44} fontSize="26" fontWeight="700" fill="var(--color-muted-foreground)" opacity="0.7">
              Gulf of Guinea
            </text>

            <g stroke="var(--color-border)" strokeWidth="2" opacity="0.5">
              {[200, 400, 600, 800].map((x) => (
                <line key={`v${x}`} x1={x} y1="0" x2={x} y2={VIEW} />
              ))}
              {[200, 400, 600, 800].map((y) => (
                <line key={`h${y}`} x1="0" y1={y} x2={VIEW} y2={y} />
              ))}
            </g>

            {/* Routes + drivers for every active delivery */}
            {deliveries.map((d, i) => {
              const dest = scale(projectToUnit(d.dest))
              const isSel = selected === d.reference
              const dim = selected && !isSel
              const color = colorFor(i)
              const driverUnit = pointAlongRoute(d.origin, d.dest, d.routeProgress)
              const driver = scale(driverUnit)
              const travelled = travelledPolyline(d.origin, d.dest, d.routeProgress)
              return (
                <g key={d.reference} opacity={dim ? 0.25 : 1} className="transition-opacity duration-300">
                  <polyline
                    points={routePolyline(d.origin, d.dest)}
                    fill="none"
                    stroke="var(--color-border)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="2 16"
                  />
                  <polyline
                    points={travelled}
                    fill="none"
                    stroke={color}
                    strokeWidth={isSel ? 9 : 6}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                  {/* Destination */}
                  <circle cx={dest.x} cy={dest.y} r={isSel ? 13 : 10} fill={color} opacity="0.85" />
                  {/* Driver */}
                  <g transform={`translate(${driver.x} ${driver.y})`} className="transition-all duration-700">
                    {d.status === 'out-for-delivery' && (
                      <circle r="28" fill={color} opacity="0.16">
                        <animate attributeName="r" values="18;34;18" dur="1.8s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.26;0;0.26" dur="1.8s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle r={isSel ? 16 : 13} fill={color} stroke="var(--color-cream)" strokeWidth="3" />
                    <g transform="translate(-7 -7) scale(0.6)">
                      <path
                        d="M5 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM3 6h11l3 5h4v5"
                        fill="none"
                        stroke="var(--color-cream)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </g>
                </g>
              )
            })}

            {/* Shared Tema hub on top */}
            <g transform={`translate(${o.x} ${o.y})`}>
              <circle r="30" fill="var(--color-clay)" opacity="0.18" />
              <circle r="15" fill="var(--color-clay)" stroke="var(--color-cream)" strokeWidth="3" />
            </g>
          </svg>

          <div className="pointer-events-none flex items-center gap-3 border-t border-border px-5 py-2 text-xs font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Warehouse className="h-3.5 w-3.5 text-clay" /> {HUB.name}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-field" /> Customer drops
            </span>
          </div>
        </div>

        {/* Delivery list */}
        <div>
          {isLoading ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
              Loading fleet…
            </div>
          ) : deliveries.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-8 text-center">
              <Package className="h-7 w-7 text-muted-foreground" />
              <p className="text-sm font-semibold text-foreground">
                No active deliveries
              </p>
              <p className="text-xs text-muted-foreground">
                Dispatched orders appear here once a driver is assigned.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {deliveries.map((d, i) => (
                <li key={d.reference}>
                  <button
                    onClick={() =>
                      setSelected(selected === d.reference ? null : d.reference)
                    }
                    className={`ga-press w-full rounded-2xl border p-3.5 text-left transition-colors ${
                      selected === d.reference
                        ? 'border-foreground bg-secondary'
                        : 'border-border bg-card'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: colorFor(i) }}
                        />
                        <span className="font-bold text-foreground">
                          {d.reference}
                        </span>
                      </div>
                      <StatusChip status={d.status} />
                    </div>
                    <p className="mt-1 truncate text-sm text-foreground">
                      {d.customerName} · {d.area}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      {d.driverName && (
                        <span className="inline-flex items-center gap-1">
                          <Navigation className="h-3 w-3" /> {d.driverName}
                          {d.vehicle ? ` · ${d.vehicle}` : ''}
                        </span>
                      )}
                      {d.driverPhone && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {d.driverPhone}
                        </span>
                      )}
                      {d.refrigeration && (
                        <span className="inline-flex items-center gap-1 text-field">
                          <Snowflake className="h-3 w-3" /> Cold chain
                        </span>
                      )}
                    </div>
                    <div className="mt-2.5 flex items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.round(d.routeProgress * 100)}%`,
                            backgroundColor: colorFor(i),
                          }}
                        />
                      </div>
                      <span className="shrink-0 text-xs font-bold text-foreground">
                        {d.status === 'out-for-delivery' && d.etaMinutes != null
                          ? `~${d.etaMinutes} min`
                          : `${Math.round(d.routeProgress * 100)}%`}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function StatusChip({ status }: { status: ActiveDelivery['status'] }) {
  const map: Record<string, { label: string; cls: string }> = {
    packed: {
      label: 'Dispatched',
      cls: 'bg-clay/15 text-clay',
    },
    'out-for-delivery': {
      label: 'On the road',
      cls: 'bg-field/15 text-field-deep',
    },
  }
  const m = map[status] ?? { label: status, cls: 'bg-secondary text-muted-foreground' }
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${m.cls}`}>
      {m.label}
    </span>
  )
}

// Travelled portion of a route from start to `progress` (denser sampling).
function travelledPolyline(origin: GeoPoint, dest: GeoPoint, progress: number): string {
  const steps = Math.max(2, Math.round(progress * 36))
  const pts: string[] = []
  for (let i = 0; i <= steps; i++) {
    const tt = (i / steps) * progress
    const p = pointAlongRoute(origin, dest, tt)
    pts.push(`${(p.x * VIEW).toFixed(1)},${(p.y * VIEW).toFixed(1)}`)
  }
  return pts.join(' ')
}
