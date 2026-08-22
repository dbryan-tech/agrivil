# 02 — Consumer Storefront (shop → PDP → cart → checkout → orders → account)

> **Owns:** `app/(store)/shop/**`, `/compare`, `/cart` (via mini-cart + store
> cart surfaces), `/checkout`, `/orders/**`, `/account`, plus
> `components/golden-acres/{shop,cart,checkout,compare,account,search}/**`.
> **Job:** make buying feel effortless, trustworthy and fast — the quiet
> confidence of the best commerce products, tuned for Ghanaian payment
> reality (MoMo-first) and variable-weight produce.

## 1. Research base (what modern consumers expect)

From current commerce-UX practice (Baymard-aligned, 2025–26):
- **Total cost transparency early** — delivery fee visible from PDP/cart, not
  a checkout surprise. Single biggest abandonment driver.
- **Guest checkout as the default posture** — account creation is a wall
  (D2 decision; plan assumes guest-first with account upsell AFTER purchase).
- **Inline validation, never validate-on-submit only.**
- **Payment diversity** — MoMo (MTN/Telecel/AirtelTigo) is the local
  expectation; cards secondary; express options when available.
- **Persistent order summary** through checkout; running total always visible.
- **Skeletons, not spinners**, for content areas; optimistic UI on cart ops.
- **PDP:** multi-image gallery, price-per-unit clarity (critical for
  variable-weight), freshness/FEFO surfaced as trust info, farmer identity as
  provenance, reviews with verified-purchase weight, related rail.

## 2. Current state audit

- `shop-catalog.tsx` + filter rail + chips: functional grid, generic look.
- `product-detail.tsx` (web) vs `product-detail-live.tsx` — two PDP
  implementations coexisting; must converge into one.
- `mini-cart.tsx` drawer exists; no dedicated `/cart` page on web.
- `checkout-flow.tsx` (~700 lines) + `paystack-checkout.tsx`: single-file
  monolith handling address, slot, payment, summary. No guest path.
- Orders: `/orders` list + `/orders/[ref]` detail + tracking components exist;
  the proven premium tracking language (dotted timeline, FROM→TO, ribbon)
  lives only in preview lib.
- Account: `account-dashboard.tsx` (926 lines) with tabs; functional but
  dense; security tab exists.

## 3. Shop / listing

- **Layout:** editorial header (display title + lede + count), then grid with
  the elevated product card grammar (00 §4): image shell 4:5, name 15px
  semibold, farm attribution 12px copper, price row with unit qualifier,
  freshness as quiet text. Hover: image 1.03 + quick-add affordance fade-in.
- **Filters:** text-tab grammar (13px, active = ink underline), drawer on
  mobile-width; sort as text tabs not select. Active filters shown as quiet
  removable text tokens ("Organic ×").
- **Search:** command-palette-grade overlay (⌘K + icon), instant results with
  product thumbnails, recent searches, keyboard navigation. Zero-results state
  suggests categories and farmers instead of dead-ending.
- **Skeletons** for grid on filter change; optimistic quick-add with tray
  confirmation (mini-cart opens to confirm, closes itself after 2.4s).

## 4. Product detail (converge the two PDPs)

- **Gallery:** left 55% on desktop, 4:5 images, thumbnails as quiet dots,
  zoom-on-hover; right column sticky.
- **Buy column:** name (Title size), farm link (copper), rating (gold stars +
  count), price block with per-unit math for variable weight
  ("est. 1.0 kg · GH₵11/kg — final weight confirmed at packing"), quantity
  stepper, green pill add-to-cart with press feedback + price echo in button
  ("Add · GH₵11.00"), stock honesty ("36 left · low" only when true).
- **Trust block:** harvest date (packedDateIso — real, from the RC fixes),
  shelf life, cold-chain badge when refrigerationRequired, GhanaPostGPS
  delivery estimate by zone.
- **Farmer strip:** avatar + name + region + "View farm" text-link.
- **Compare offers:** retained but restyled as hairline rows, not cards.
- **Below:** details accordion (Plus grammar), reviews with verified badge +
  farmer replies, recently-viewed rail.

## 5. Cart & checkout (the money path — highest rigor)

- **Cart:** dedicated `/cart` page (new) + keep mini-cart drawer. Line rows on
  hairlines: image, name, farm, unit price, qty stepper, line total,
  remove as quiet text. Variable-weight lines show estimate range with
  "confirmed at packing" note. Sticky summary: subtotal, delivery (zone
  estimate), total. Free-delivery threshold progress bar when data supports.
- **Checkout — restructure into a 3-step stepper** (Details → Delivery →
  Payment) with persistent right-rail summary:
  1. **Details:** guest-first (D2). Underline fields, inline validation,
     GhanaPostGPS format hint + validation, saved addresses for logged-ins.
  2. **Delivery:** slot picker as selectable rows (date groups, capacity
     honesty), fee shown per option, zone eligibility messaging.
  3. **Payment:** MoMo-first presentation (MTN/Telecel/AirtelTigo as
     selectable rows with provider marks), card collapsed below, Paystack
     iframe per existing `paystack-checkout.tsx`. Idempotency preserved:
     disable-on-submit + server-side dedupe stays untouched.
- **Success:** full-bleed calm confirmation — order ref in display type,
  dotted progress timeline (port DottedProgressTrack), what-happens-next
  steps, CTA to tracking. This is a brand moment, not a receipt dump.
- **Error/timeout states:** explicit retry paths; never leave a stuck spinner
  on the payment step; cart preserved through failure.

## 6. Orders & tracking

- `/orders`: hairline list rows — ref, date, status ribbon (clip-window
  technique), total, "Track" text-link. Empty state → shop CTA.
- `/orders/[ref]`: the premium tracking screen — FROM → TO route line,
  dotted timeline with active dot + ETA, driver card when assigned,
  items with final-weight reconciliation (estimate vs actual), payment
  summary, issue-report entry point (links to support flow, 06).

## 7. Account

- Rebuild `account-dashboard.tsx` into a two-pane layout: quiet side nav
  (Overview · Orders · Addresses · Boxes · Security), content pane on canvas.
- Overview: greeting in display type, next delivery, quick reorder of last
  basket. All forms → UnderlineField. Address editor already fixed for
  purity (RC audit) — keep that behavior.

## 8. Functional integrity requirements (non-negotiable)

- All server actions and cart-context contracts unchanged; skin-only swaps.
- Duplicate-submission protection, price/stock server authority, webhook
  truth for payment status — verified by code review during port, and E2E
  tested once D1 (Paystack keys) resolves.
- Loading/error/empty states for every async surface before merge.

## 9. Acceptance checklist

- [ ] One PDP implementation ships; the other archived.
- [ ] Guest checkout decision (D2) resolved and implemented accordingly.
- [ ] Total cost visible by cart; slot fee visible at selection.
- [ ] Every async surface has skeleton + error + empty states.
- [ ] Payment step: no spinner-dead-ends; retry path proven with test keys.
- [ ] tsc + build clean; `/emu` approval for shop, PDP, cart, checkout,
  success, tracking, account before each merge.
