import { Sprout } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-2xl bg-primary opacity-20" />
        <Sprout className="h-7 w-7 animate-bounce text-primary" />
      </div>
      <p className="ga-eyebrow text-xs text-muted-foreground">Gathering fresh produce...</p>
    </div>
  )
}
