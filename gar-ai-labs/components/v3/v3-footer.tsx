'use client'

import Link from 'next/link'
import { GithubIcon } from '@/components/github-icon'

export function V3Footer() {
  return (
    <footer className="bg-neutral-900 text-white px-6 py-20">
      <div className="max-w-6xl mx-auto">
        {/* CTA band */}
        <div className="border-2 border-teal p-12 mb-16 text-center">
          <h2 className="font-mono-display text-4xl md:text-5xl font-bold mb-4">
            Join us in rethinking prediction.
          </h2>
          <p className="text-neutral-300 font-mono mb-8 max-w-2xl mx-auto">
            We're hiring researchers, engineers, and collaborators. Let's build intelligence for a non-repeating world.
          </p>
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 bg-teal text-neutral-900 px-8 py-3 font-mono-display font-bold text-sm uppercase tracking-wider hover:bg-teal/90 transition-colors"
          >
            <span className="w-1 h-1 bg-neutral-900" />
            Get in touch
            <span>→</span>
          </Link>
        </div>

        {/* Footer content */}
        <div className="grid md:grid-cols-3 gap-12 border-t border-neutral-800 pt-12">
          <div>
            <h3 className="font-mono-display font-bold text-lg mb-4">Gar AI Labs</h3>
            <p className="text-sm text-neutral-400 font-mono">
              Non-Ergodic Predictive Intelligence. For systems that never repeat.
            </p>
          </div>

          <div>
            <h4 className="font-mono-display font-bold text-sm mb-4 uppercase tracking-wide">Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#research" className="text-neutral-400 hover:text-teal transition-colors">
                  Research
                </Link>
              </li>
              <li>
                <Link href="/founder" className="text-neutral-400 hover:text-teal transition-colors">
                  Founder
                </Link>
              </li>
              <li>
                <a href="mailto:hello@garailabs.com" className="text-neutral-400 hover:text-teal transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono-display font-bold text-sm mb-4 uppercase tracking-wide">Social</h4>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/GarAI-Labs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-teal transition-colors"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8 flex items-center justify-between text-xs text-neutral-500 font-mono">
          <div>© 2026 Gar AI Labs. All paths diverge.</div>
          <div>
            <span className="text-teal">v3</span> — Non-Ergodic Predictive Intelligence
          </div>
        </div>
      </div>
    </footer>
  )
}
