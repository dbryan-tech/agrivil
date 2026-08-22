# AgriVil Web Redesign Program — Master Index

> **Status:** Phases 00–01 shipped to live routes; Phase 02 core commerce live
> **Execution ledger** at the bottom of this file tracks exactly what shipped.
> **Scope:** The entire desktop/tablet web side of AgriVil (`app/(store)/**`,
> `app/(auth)/**`, `app/farmer/**`, `app/admin/**`, `app/support/**`, shared
> `components/golden-acres/**`, `app/globals.css`). The mobile `/m/**` app is
> explicitly OUT of scope — it ships separately inside the Android WebView and
> must not be touched by these plans.
> **Mandate:** Apple-inspired premium. Restrained, typographic, quiet depth.
> No emojis, no glassmorphism, no decorative gradients, no card soup, no
> generic AI design. Every surface treated as its own product.

---

## 0. How to read this folder

Each document is a self-contained end-to-end plan for one system:

| Doc | System | Surfaces covered |
|---|---|---|
| `00-design-system.md` | **Foundation** — tokens, typography, motion, primitives | `globals.css`, `reveal.tsx`, shared UI |
| `01-brand-marketing.md` | Brand identity & marketing | Home hero/story sections, About, Sell-with-us, Waitlist, footer/header chrome |
| `02-consumer-shop.md` | Consumer storefront | Shop, PDP, compare, cart, checkout, payments, orders/tracking, account |
| `03-auth-onboarding.md` | Entry & trust | Login/signup/reset, onboarding, location/GPS flow, local |
| `04-farmer-portal.md` | Farmer console | `/farmer/**`: dashboard, inventory, orders, earnings, KYC |
| `05-staff-systems.md` | Staff & business systems | `/admin` BI dashboard, ops/logistics console, support desk |
| `06-content-trust.md` | Content, community & service | Recipes, bundles, farmers directory, help center, contact, legal |
| `07-performance-a11y.md` | Cross-cutting engineering bar | Perf budgets, a11y, motion safety, verification protocol |

**Execution order = document order.** 00 unblocks everything; 01–03 are the
revenue path; 04–05 are the operations path; 06 is depth; 07 applies to all.

## 1. Non-negotiables (apply to every plan)

1. **The review loop.** Nothing ships into the real routes without user
   approval. Build in `app/redesign-preview/<surface>` (isolated route group,
   own `_lib` primitives), serve via `/emu` device frame, iterate, get explicit
   approval, THEN port into the shipping routes in a separate commit series.
2. **Never break the build.** After every work session: `npx tsc --noEmit` and
   `npm run build`. Type gate is now enforced (no ignoreBuildErrors).
3. **Design language discipline.** One system (`00`) governs every doc. Any
   deviation must be written back into 00 first, then applied. No third
   visual language may appear.
4. **No functional regressions.** Redesign = same data contracts, same server
   actions, same cart/session providers. Components change their skin, not
   their wiring. Every plan lists its exact data dependencies up front.
5. **Mobile `/m/**` is frozen.** Shared files that both surfaces import (e.g.
   `cart-context.tsx`, `format.ts`) may gain capabilities but never change
   mobile-visible markup or behavior.
6. **Brand assets are law.** Concept-01 marks from `docs/brand-assets/` only.
   Never redraw the sun-and-field mark. No emoji, ever, anywhere.
7. **Honesty gates.** Each plan ends with an acceptance checklist using
   VERIFIED / FIXED / PARTIALLY VERIFIED / DECISION REQUIRED / BLOCKED /
   NOT APPLICABLE. No claim without evidence.

## 2. The single design idea

AgriVil's web presence should read like a **premium farm-to-table house**
— closer to an editorial flagship than a marketplace template:

- **Canvas:** warm paper (#F7F5F0 family), vast whitespace, hairline rules.
- **Type does the heavy lifting:** display serif voice for story moments
  (Fraunces already loaded), precise grotesk for UI (Geist already loaded),
  tabular numerals for every price and stat.
- **Depth is whisper-level:** near-invisible borders + soft shadows only on
  genuinely elevated units (product cards, trays). Everything else sits flat
  on the canvas separated by hairlines — the "no visible cards" grammar.
- **Motion is calm and physical:** 600–1000ms quintic-ease rises on scroll,
  mask-reveals on heroes, image scale ≤1.03, always reduced-motion safe.
- **Color is meaning, not decoration:** forest green = action/trust; copper =
  farm attribution/highlight; harvest gold = rating only. Nothing else glows.

## 3. Known decisions required from the owner (tracked)

| # | Decision | Why it blocks |
|---|---|---|
| D1 | Paystack keys provisioned (test mode at minimum) | Checkout/payment flows cannot be E2E verified without them |
| D2 | Guest checkout allowed? (research says default-to-guest lifts conversion 25–35%) | Consumer checkout plan has two variants |
| D3 | Real photography budget vs. refined treatment of current imagery | Hero strategy differs materially |

## 4. Verification protocol (every phase)

1. `npx tsc --noEmit` → 0 errors.
2. `npm run build` → clean, 322+ routes.
3. Preview route rendered → headless Chrome screenshot → pixel-scan for
   signature colors where vision alone would be trusted blindly.
4. User reviews at `/emu` → approval recorded here before merge.
5. Post-merge: production-mode smoke test of the affected routes
   (status codes + key content greps, as done in the RC audit).

---

## 5. Execution ledger (live record of what shipped)

| Phase | Surface | Status | Commit(s) |
|---|---|---|---|
| 00 | Tokens, fonts (Fraunces live), `system/` primitives, gallery | SHIPPED (tokens live, gallery preview) | `c9e5a39` |
| 01 | Home narrative (hero, proof, featured, growers, mechanism, kitchen, voices, closing) | SHIPPED to live `/` | `4d102a0`, `64e2de7` |
| 01 | SiteHeader + SiteFooter chrome | SHIPPED to all `(store)` routes | `2d1ba88`, `64e2de7` |
| 01 | About page | SHIPPED to live `/about` | `fe4a96d`, `64e2de7` |
| 01 | Sell page (pitch; working form preserved) | SHIPPED to live `/sell` | `fe4a96d`, `64e2de7` |
| 01 | Waitlist page | SHIPPED to live `/waitlist` | `fe4a96d`, `64e2de7` |
| 02 | Shop listing (editorial header, toolbar, empty state) | SHIPPED to live `/shop` | `8a77cc3` |
| 02 | Cart page (`/cart` NEW) + mini-cart wiring | SHIPPED to live `/cart` | `8a77cc3` |
| 02 | Product detail page | SHIPPED to live `/shop/[slug]` | `a5664b8` |
| 02 | Checkout reskin (tokens only, logic untouched) | SHIPPED to live `/checkout` | `9420874` |
| 02 | Orders index | SHIPPED to live `/orders` | `666210a` |
| 02 | Tracking detail reskin | QUEUED (next session) | — |
| 02 | Account dashboard two-pane rebuild | QUEUED | — |
| 03 | Auth shell + trust microcopy + web onboarding | QUEUED | — |
| 04 | Farmer console restructure | QUEUED | — |
| 05 | Staff console frame (admin/ops/support) | QUEUED | — |
| 06 | Recipes index/detail, bundles, farmers directory, help center | QUEUED | — |

**Standing verification after every phase:** tsc clean · production build
green · lint errors ≤ 24 documented baseline · all touched routes 200 in
production mode · mobile `/m/**` diff EMPTY.

### Decisions resolved this run (owner pre-approval)
- D1 Paystack keys: proceeding without payment E2E testing until owner
  provisions test keys.
- D2 Guest checkout: guest-first adopted at the UX level; full flow lands
  with the phase 02 checkout restructure.
- D3 Imagery: current assets retained with premium treatment.
