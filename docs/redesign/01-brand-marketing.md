# 01 — Brand, Marketing & Public Identity

> **Owns:** home page marketing sections (`components/golden-acres/home/*`),
> `app/(store)/about`, `/sell`, `/waitlist`, header/footer chrome
> (`ga-header.tsx`, `ga-footer.tsx`, `announcement-bar.tsx`), brand asset usage
> across web.
> **Job:** in 5 seconds a first-time visitor must understand what AgriVil is,
> who it's for, and feel that it is trustworthy and premium.

## 1. What exists today (audit)

- 14 home components: two hero variants (`home-hero`, `market-hero`,
  `video-hero` — three, actually), category tiles, deals rail, featured
  produce, freshness story, farmer spotlight/field, match teaser, recipes
  preview, bundles preview, testimonials CTA.
- Header: `GaHeader` + announcement bar; footer: `GaFooter`.
- About/sell/waitlist are functional but utilitarian.
- The brand system (Concept-01 marks, sun-and-field) is strong and
  under-used on desktop.

**Diagnosis:** the home page tries to be everything at once and competes with
itself — multiple heroes, rails stacked without hierarchy, marketing mixed
with storefront. Premium brands sequence a story; they don't list modules.

## 2. Positioning & narrative (the spine of every section)

House voice: **"The farmers' market, perfected."**
Narrative order for the home page:

1. **Belief** — cinematic statement of what AgriVil is (hero).
2. **Proof** — the freshest possible produce, shown as product (featured).
3. **People** — the farmers, with real names/farms (spotlight + directory).
4. **Mechanism** — how it works: harvest → cold hub → 48h payout → your door.
5. **Belonging** — recipes/bundles as lifestyle, testimonials as community.
6. **Action** — shop / sell-with-us / waitlist, each one clear next step.

Every marketing page maps to this same spine (about = expanded 1+4;
sell = farmer-side 4; waitlist = zone-expansion capture).

## 3. Section-by-section plan

### 3.1 Hero (replace three competing heroes with ONE)
- Full-bleed cinematic still or subtle-motion video (D3 decision),
  h-[92svh], graded with a single bottom-left dark gradient.
- Content anchored bottom-left: metadata line ("Accra · Tema · Kumasi —
  harvest delivered in hours") → Fraunces display headline with per-line mask
  reveal ("The farmers' market, perfected.") → lede → green pill "Shop the
  harvest" + copper underlined text link "Meet the farmers".
- Frosted route-aware header over it (see 3.7). Slide progress bars if a
  second slide is approved; no auto-rotating carousel clutter.
### 3.2 Proof strip (new)
- Quiet full-width band on white: 4 stat blocks (farms partnered · orders
  delivered · avg harvest-to-door hours · farmer payout rate) as display-size
  tabular numbers over hairlines. No icon chips.
### 3.3 Featured produce
- Editorial grid: large lead card + asymmetric supporting cards using the
  elevated-card grammar from 00. Prices in tabular numerals, farm name in
  copper as attribution link, FEFO freshness as quiet text not badges.
### 3.4 Farmers
- Farmer spotlight: full-bleed portrait left, story right on canvas, no card.
  Directory teaser = numbered hairline rows (name · region · specialty · km)
  ending in text-link to `/farmers`.
### 3.5 How it works
- Four numbered steps as hairline rows (01 Harvest at dawn / 02 Cold-chain hub
  / 03 Curated delivery / 04 48h farmer payout). No illustration soup; type +
  generous space. One diagram allowed: dotted route line hub→door.
### 3.6 Recipes & bundles teasers
- Two-panel editorial split: recipe imagery + title + "Shop ingredients"
  text-link; bundle as single premium unit card, not a rail of six.
### 3.7 Header & footer chrome
- Header: 56px, wordmark + centered nav (Shop · Farmers · Recipes · Bundles ·
  Sell), search affordance, cart/account right. Route-aware frosted glass per
  the TRUSTEE spec (transparent-over-dark-hero → frosted after 8px scroll,
  always-frosted elsewhere). Announcement bar demoted to a quiet text line.
- Footer: deep forest-green (#0B3B25) full-bleed band, cream typographic
  columns, wordmark lockup, newsletter underline field, legal row. This is the
  one place rich color grounds the page.

## 4. Secondary pages

- **About:** long-form editorial. Manifesto lede in Fraunces, timeline of the
  mechanism, team/farm photography, values as numbered rows. No stat chips.
- **Sell (farmer acquisition):** this is marketing TO farmers — earnings-first
  framing: display headline about 48h payouts, calculator-style StatBlocks,
  application form rebuilt on UnderlineField primitives, low-bandwidth promise
  stated plainly. Success state designed (currently missing).
- **Waitlist:** single-column focus page, one field + button, zone map teaser,
  confirmation state with position-in-line semantics if data supports it.

## 5. Data & wiring notes

All current components read from `lib/golden-acres/data.ts` mock catalog and
stay wired to them. New proof-strip stats may be hardcoded marketing numbers
until analytics exist — mark them clearly as such in code comments so nobody
mistakes them for live metrics.

## 6. Acceptance checklist

- [ ] Single hero ships; the other two hero variants deleted or archived.
- [ ] Home reads in narrative order 1→6 with no module competition.
- [ ] Lighthouse perf on home ≥90 mobile-equivalent budget (07 governs).
- [ ] Every image has alt text; all motion reduced-motion safe.
- [ ] Owner approval recorded at `/emu` before any merge into `(store)`.
