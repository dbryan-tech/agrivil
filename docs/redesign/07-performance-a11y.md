# 07 — Performance, Accessibility & Verification Bar (cross-cutting)

> **Applies to:** every phase of every plan in this folder. This is the
> definition of "done" for engineering quality — the premium feel is worthless
> if it ships slow or unusable.

## 1. Performance budgets (web, desktop-weight but mobile-respected)

| Metric | Budget |
|---|---|
| Route JS (initial, marketing pages) | ≤ 180KB gzip |
| LCP (home, production build) | ≤ 2.0s on throttled "Fast 3G" profile |
| CLS | ≤ 0.02 everywhere (skeletons with reserved heights) |
| INP | < 200ms on cart/checkout interactions |
| Images | AVIF/WebP only via next/image; hero stills ≤ 220KB |

Practices:
- Fonts: Geist + Fraunces only; `next/font` self-hosted (already), subset
  latin; `font-display: swap` semantics preserved by next/font defaults.
  NO new font families anywhere in this program.
- Charts (recharts) load client-side and lazy: no chart library on marketing
  pages at all.
- Framer-motion usage audited per surface; prefer CSS transitions +
  IntersectionObserver (`Reveal`) over JS animation on scroll paths.
- Every redesign PR includes a before/after of route JS for touched routes
  (build output comparison) — regressions need justification.

## 2. Motion safety

- Global rule from 00: all animation gated behind
  `@media (prefers-reduced-motion: reduce)` → transforms/opacity only,
  durations → near-zero.
- No parallax. No infinite loops except skeletons/spinners.
- Hero mask-reveals run once; never re-trigger on tab refocus.

## 3. Accessibility bar

- Semantic landmarks on every rebuilt page (header/nav/main/footer);
  one h1 per page.
- All interactive elements keyboard-operable with visible focus
  (`:focus-visible` ring token — copper 2px offset).
- Touch targets ≥ 44px even on desktop layouts (co-work with tablets).
- Color contrast: body text ≥ 4.5:1 against canvas; copper-on-canvas used
  for links ≥ 4.5:1 (verify #7A3F1C passes — it does on #F7F5F0); never
  color-only status (ribbons carry text labels).
- Form fields programmatically labelled; errors announced
  (`aria-live="polite"`), linked via `aria-describedby`.
- Star ratings include sr-only text ("Rated 4.8 out of 5").
- Alt text policy: produce/farm imagery describes substance ("Roma tomatoes
  harvested at Akosua's farm"), decorative images get alt="".

## 4. Verification protocol (every phase, no exceptions)

1. `npx tsc --noEmit` → 0 errors (gate is enforced now).
2. `npm run build` → clean across all routes.
3. `npx eslint .` → error count must not increase vs. the RC baseline
   (24 documented set-state-in-effect + 224 warnings). New code introduces
   zero NEW lint errors; fixing old ones is welcome.
4. Visual verification: headless Chrome screenshot of the preview route at
   1440×900 and 390×844; pixel-scan signature colors when checking fine
   detail (per skill §3). Vision model reads are secondary evidence only.
5. `/emu` review loop with the owner — approval recorded in the phase doc
   before any port into shipping routes.
6. Post-port smoke test in production mode (`next start`): status codes +
   content greps for every touched route (pattern proven in the RC audit).
7. Mobile `/m/**` regression check: `git diff --stat app/m` must be EMPTY
   in every port commit series.

## 5. Regression sentries (existing behaviors that must survive)

- Cart persistence + variable-weight estimates (cart-context contract).
- Better Auth session flows incl. Google OAuth round-trip.
- Middleware routing contract (clean URLs, /m masking, /w legacy redirect,
  desktop /m → 307).
- Paystack idempotency + webhook-truth payment status (once D1 keys exist).
- FEFO freshness/packed-date derivations added in the RC fixes.
- Zero-scrollbar + safe-area handling (web inherits sensibly where relevant).

## 6. Definition of done for the whole program

Every doc 01–06 has: shipped surfaces verified by §4 protocol, owner
approval recorded, acceptance checklists ticked with evidence links, and
this file's budgets met on every touched route. Anything less is recorded
as PARTIALLY VERIFIED with the exact gap named.
