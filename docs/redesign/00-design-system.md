# 00 — Design System Foundation (the single source of visual truth)

> **Owns:** `app/globals.css`, `app/layout.tsx` font loading, `reveal.tsx`,
> shared primitives. Every other redesign doc inherits from this one.
> **Rule:** if a surface needs something this doc doesn't provide, amend this
> doc first, then build.

## 1. Current state audit

- `globals.css` is 837 lines and accreted: Geist + Fraunces + Archivo + Onest +
  JetBrains + IBM Plex Mono + Space Grotesk + Nunito + Source Serif + Jakarta
  are all declared. Ten font stacks is not a system; it's a drawer.
- Legacy tokens from other projects (`coral #ff6b7a`, `cobalt #2f81f7`,
  `sun #fdb927`, teal `#26d9b8`) still sit in the theme.
- The proven mobile premium language lives in `app/preview/_lib/premium.tsx`
  as hardcoded constants (BRAND object) rather than shared CSS tokens.

## 2. Typography (decisive reduction)

| Role | Family | Usage |
|---|---|---|
| Display / story voice | **Fraunces** (already loaded, keep) | Hero headlines, section statements, editorial moments |
| UI / body | **Geist Sans** (keep) | Everything interactive, body copy, forms |
| Numerals | Geist with `font-feature-settings: "tnum"` | ALL prices, stats, timestamps, order refs |

Remove from active use (keep the `@theme` declarations harmless or delete
entirely after grep confirms zero usage): Archivo, Onest, JetBrains, IBM Plex,
Space Grotesk, Nunito, Source Serif. Two families + tabular numerals is the
whole system.

### Scale (fluid, tight tracking)
```
Display XL   clamp(44px, 6.5vw, 88px)   lh 1.04  ls -0.03em   Fraunces 560
Display L    clamp(36px, 4.8vw, 64px)   lh 1.06  ls -0.025em  Fraunces 560
Display M    clamp(28px, 3.4vw, 44px)   lh 1.12  ls -0.02em   Fraunces 520
Title        20–24px  semibold          Geist, ls -0.01em
Body         15–17px regular            Geist, ink-secondary for ledes
Label        13px medium                sentence case, NEVER uppercase+bold chips
Micro        11–12px                    metadata only
```

## 3. Color tokens (consolidated)

```css
:root {
  /* canvas */
  --ga-canvas: #F7F5F0;            /* page background */
  --ga-card: #FDFDFB;              /* 25/75 tan-white elevated surface */
  --ga-elevated: #FFFFFF;
  --ga-hairline: rgba(33,26,18,0.08);
  /* ink */
  --ga-ink: #211A12;               /* headings */
  --ga-body: #3D332A;              /* body text */
  --ga-muted: #5C5247;             /* secondary */
  --ga-faint: #8A7E72;             /* metadata */
  /* meaning colors — nothing decorative beyond these */
  --ga-green: #0B3B25;             /* action, trust, success */
  --ga-green-bright: #0F7A43;      /* success states on dark */
  --ga-copper: #7A3F1C;            /* farm attribution, highlights, brand chrome */
  --ga-gold: #F0A81E;              /* ratings ONLY */
  --ga-red: #B91C1C;               /* destructive/error ONLY */
}
```
Retire (after usage grep): coral, cobalt, sun, teal, any gold usage that isn't
a star rating. Keep shadcn semantic vars mapped onto these values so existing
`bg-background`/`text-foreground` classes keep working during migration.

## 4. Elevation grammar

Three levels only:
1. **Canvas** — content directly on `--ga-canvas`, separated by hairlines
   (border-top rows). Default for everything textual.
2. **Card** — `--ga-card` surface, 20px radius, border `--ga-hairline`,
   shadow `0 1px 2px rgba(33,26,18,0.04), 0 8px 24px rgba(33,26,18,0.05)`.
   Reserved for: product cards, trays/modals, dashboard data units.
3. **Overlay** — pure white, larger radius, deeper shadow, frosted scrim.
   Mini-cart, command palette, modals, dropdowns.

Hard rules: cards must be `relative`; no card-in-card nesting (max 2 levels);
corner ribbons live inside an overflow-hidden clip window; every price uses
tabular numerals; icons are Lucide with explicit width/height attributes.

## 5. Motion system

```css
--ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
--dur-reveal: 900ms;   /* scroll rises */
--dur-micro: 300ms;    /* hovers, color, arrow nudges */
--dur-scene: 1100ms;   /* hero mask reveals */
```
- Scroll reveal: rise 24–28px + fade, IntersectionObserver
  `rootMargin: "0px 0px -60px 0px"`, once per element. Generalize the existing
  `reveal.tsx` into `<Reveal>` with optional stagger delay prop.
- Hero lines: overflow-hidden mask, child translateY(110%→0), staggered.
- Hover: image scale ≤1.03 over 700ms; title→copper 300ms; arrows nudge 4px.
- Skeletons: shimmer at 1400ms on `--ga-card` with no borders; reserved
  height to kill layout shift.
- **Everything gated behind `prefers-reduced-motion: reduce`.**

## 6. Primitives library (new, shared)

Create `components/golden-acres/system/` — the web design-system package both
marketing pages and consoles import:

| Primitive | Replaces |
|---|---|
| `Section.tsx` | repeated padding/hairline scaffolding (label + display title + lede slots) |
| `HairRow.tsx` | hairline-topped link rows (numbered index option included) |
| `StatBlock.tsx` | stat chips → `dl` grid with display-size tabular numbers |
| `PillButton.tsx` + `TextLink.tsx` | inconsistent button styles (green pill primary, copper text-link secondary) |
| `UnderlineField.tsx` | boxed inputs → underline inputs (13px sentence-case labels) |
| `Plus.tsx` accordion | boxed accordions |
| `Skeleton.tsx`, `Spinner.tsx` | ad-hoc loaders |
| `Price.tsx` | price rendering with guaranteed tabular numerals + GH₵ formatting |
| `RatingStars.tsx` | star clusters (gold, explicit sizes) |

Port the proven pieces of `app/preview/_lib/premium.tsx` (StatusRibbon clip-
window technique, ProductImageShell, DottedProgressTrack) into `system/` with
tokens instead of hardcoded hexes, so web surfaces can use them too.

## 7. Implementation sequence

1. Add new tokens alongside old ones (zero breakage).
2. Build `system/` primitives; unit-render them in a `/redesign-preview/system`
   gallery page for review.
3. Migrate `globals.css`: map legacy names → new tokens as aliases first;
   delete retired accents after full-repo grep shows zero consumers.
4. Trim font loading in `app/layout.tsx` to Geist + Fraunces (+ mono if truly
   used by dashboards).
5. `tsc --noEmit` + full build + `/emu` visual review of the gallery.

## 8. Acceptance checklist

- [ ] Two type families total across web; tabular numerals verified in DOM.
- [ ] Retired accent greps return zero usages outside git history.
- [ ] `system/` gallery approved by owner at `/emu`.
- [ ] tsc + build clean before/after token aliasing.
- [ ] No change inside `app/m/**`.
