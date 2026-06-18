import { FarmersGridLive } from '@/components/golden-acres/farmers/farmers-grid-live'
import { farmers } from '@/lib/golden-acres/data'

export const metadata = {
  title: 'Meet the Farmers — Golden Acres',
  description:
    'The growers behind your food. Meet the local Ghanaian farmers partnering with Golden Acres to bring fresh produce to your door.',
}

export default function FarmersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="ga-rise max-w-2xl">
        <p className="ga-eyebrow text-primary">Meet the growers</p>
        <h1 className="ga-display mt-3 text-4xl text-foreground sm:text-5xl">
          The hands behind your{' '}
          <span className="ga-serif font-normal text-primary">harvest</span>
        </h1>
        <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
          Every basket traces back to a real farm. Get to know the people growing your
          food — their methods, their land, and their promise of freshness.
        </p>
      </header>

      <FarmersGridLive seed={farmers} />
    </div>
  )
}
