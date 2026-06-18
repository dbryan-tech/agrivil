import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { LabReveal } from '@/components/v2/lab-reveal'

export function LabFounder() {
  return (
    <section className="border-t border-[#14130f]/12 px-5 py-24 dark:border-white/10 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1400px]">
        <LabReveal>
          <p className="mb-12 font-rounded text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#14130f]/70 dark:text-white/70">
            05 — Direction
          </p>
        </LabReveal>

        <LabReveal delay={0.05}>
          <Link
            href="/founder"
            className="group grid items-center gap-8 rounded-sm border border-[#14130f]/15 bg-[#fbfaf6] p-7 transition-colors hover:bg-[#f4f1ea] dark:border-white/12 dark:bg-[#141416] dark:hover:bg-[#1a1a1c] sm:grid-cols-[auto_1fr_auto] sm:gap-10 sm:p-10"
          >
            <div className="relative size-28 shrink-0 overflow-hidden rounded-full border border-[#14130f]/15 bg-[#efebe1] dark:border-white/15 dark:bg-[#0c0c0d] sm:size-36">
              <Image
                src="/founder-portrait.jpeg"
                alt="Portrait of Ewoke Lenny Bryan"
                fill
                sizes="9rem"
                className="object-cover object-[80%_16%] grayscale transition-all duration-500 group-hover:grayscale-0"
              />
            </div>

            <div className="max-w-xl">
              <span className="font-rounded text-[0.62rem] uppercase tracking-[0.18em] text-[#C07A16] dark:text-[#E8A24A]">
                Founder &amp; Principal Investigator
              </span>
              <h3 className="mt-2 font-grotesk text-3xl font-bold uppercase leading-none tracking-tight text-[#14130f] dark:text-[#f4f1ea] sm:text-4xl">
                Ewoke Lenny Bryan
              </h3>
              <p className="mt-4 text-pretty text-sm leading-relaxed text-[#14130f]/65 dark:text-[#f4f1ea]/65 sm:text-base">
                Sets the research agenda at Gar AI Labs — translating the
                mathematics of non-ergodic systems into intelligence that holds
                up along the one path that actually gets lived.
              </p>
            </div>

            <span className="inline-flex items-center gap-2 self-start font-rounded text-xs font-semibold uppercase tracking-[0.16em] text-[#14130f] dark:text-[#f4f1ea] sm:self-center">
              Profile
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </Link>
        </LabReveal>
      </div>
    </section>
  )
}
