import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from './reveal'

export function FounderTeaser() {
  return (
    <section id="founder" className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <Reveal className="mb-10">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-brand">
            004 — About the founder
          </span>
        </Reveal>

        <Reveal>
          <Link
            href="/founder"
            aria-label="Read about the founder, Ewoke Lenny Bryan"
            className="group relative grid items-center gap-8 border border-border bg-card p-8 transition-colors hover:border-brand md:grid-cols-[auto_1fr_auto] md:gap-12 md:p-12"
          >
            <div className="relative size-28 shrink-0 overflow-hidden rounded-full border-2 border-border bg-muted transition-colors group-hover:border-brand md:size-36">
              <Image
                src="/founder-portrait.jpeg"
                alt="Portrait of Ewoke Lenny Bryan"
                fill
                sizes="9rem"
                className="object-cover object-[80%_16%] grayscale transition-all duration-500 group-hover:grayscale-0"
              />
            </div>

            <div className="max-w-xl">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
                Founder &amp; Principal Researcher
              </p>
              <h2 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight md:text-5xl">
                Ewoke Lenny Bryan
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                The person behind the premise. Read the story, the work, and the
                open-source projects driving Gar AI Labs forward.
              </p>
            </div>

            <span className="inline-flex items-center gap-2 justify-self-start whitespace-nowrap border border-border px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground md:justify-self-end">
              View page
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
