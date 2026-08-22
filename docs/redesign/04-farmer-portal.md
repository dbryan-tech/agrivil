# 04 — Farmer Portal (the farmer console as a standalone premium product)

> **Owns:** `app/farmer/**` + `components/golden-acres/farmer/**`
> (farmer-portal 990 lines, insights, reviews-tab, KYC via
> `app/actions/farmer-kyc.ts`, onboarding action, payouts action).
> **Job:** a console a farmer on a basic Android phone over patchy 3G can run
> their whole business from — and that *feels* like it was built with the same
> care as the consumer store. Utility IS the premium here.

## 1. Who this is for (design constraints from reality)

- Smallholder growers, often first smartphone, data-cost-sensitive.
- Core jobs: upload produce fast, keep stock honest, see orders, confirm
  earnings/payouts. Everything else is secondary.
- Sessions may drop mid-upload; fat thumbs; sunlight readability.
- The portal must never require a desktop to do anything important.

## 2. Current state audit

- Single-page portal (~990 lines) with internal tabs: dashboard, inventory,
  orders, ledger/earnings, reviews; plus `farmer-insights.tsx`,
  `farmer-reviews-tab.tsx`; login via phone/PIN (`farmer-auth.tsx`).
- Server actions exist for onboarding, KYC, payouts — real wiring.
- **Diagnosis:** one giant component doing everything; functional depth
  already present but presented as dense tabs; no offline tolerance; image
  upload exists but its low-bandwidth story isn't surfaced in UI.

## 3. Information architecture (restructure)

Keep single `/farmer` shell but rebuild into a proper app frame:
- Persistent top bar: farm name + avatar chip, payout-status pill
  ("Paid · GH₵1,240 on Aug 20" when settled), sync indicator.
- Bottom or side nav (responsive): **Today · Produce · Orders · Money**.
  Reviews/insights fold under Today as cards; KYC lives behind profile.

### Today (dashboard)
- Greeting + one primary number: "GH₵840 arriving Friday" (next payout).
- Needs-action queue as hairline rows: new order (accept by X), low-stock
  alerts, price-change requests pending approval. Nothing else competes.
- Compact sparkline of last 14 days sales (tabular, quiet axes).

### Produce (inventory)
- List rows: photo thumb, name, price/unit, stock honesty bar
  (green→amber→red vs lowStockThreshold), status ribbon for pending/rejected
  moderation states.
- **Add-produce flow designed for speed:** 3 screens max
  (photo(s) → price+stock → confirm). Camera-first input; upload progress
  with resumable retry; "works offline — uploads when signal returns"
  queueing if feasible within existing upload API; compression noted in UI
  ("we optimize your photos automatically").
- Variable-weight toggle explains itself ("customers pay an estimate now;
  final weight at packing settles the price").
- Bulk edit: multi-select rows → price/stock batch sheet.

### Orders
- Incoming orders as rows with countdown-to-accept; accept/reject with reason;
  fulfilment checklist (pick → pack → hand to hub driver) as a horizontal
  step tracker per order; each state change confirmed inline (undo window).
- Rejection reasons are structured (out of stock / too immature / weather),
  feeding ops dashboards rather than free text alone.

### Money (earnings & payouts)
- Balance header: available · scheduled · paid-this-month.
- Ledger table: order ref, gross, commission (shown plainly, not buried),
  SOP penalties (with reason link), net. Row tap → order linkage.
- Payout timeline per entry: earned → scheduled → paid (MoMo provider +
  masked number) with the 48h guarantee visualized as a small progress track.
- Commission transparency statement at top of Money tab — trust through
  plain language.

## 4. Low-bandwidth engineering requirements

- Route-level code splitting; no marketing fonts loaded in the portal
  (system font stack acceptable here — performance beats brand type).
- Images: thumbnails from existing optimization pipeline; full-size only on
  demand. Aggressive SWR caching of inventory list; mutations optimistic with
  rollback + toast on failure.
- Every mutation idempotent-safe against double-tap (disable-on-submit +
  server dedupe where actions support it).

## 5. Onboarding & KYC

- Guided wizard reusing UnderlineField grammar: farm details → crops →
  payout MoMo registration (provider + number, verified via test credit) →
  documents for KYC with camera capture. Progress persisted server-side so a
  dropped session resumes where they left off (action supports state).
- Status always visible: draft → submitted → under review → approved/rejected
  (with reason + re-submit path). No dead ends.

## 6. Acceptance checklist

- [ ] Whole portal usable at 360px width and on throttled "Slow 3G".
- [ ] Add-produce completes in ≤3 screens; upload survives a network blip
      (retry proven).
- [ ] Ledger math shown matches server action outputs exactly.
- [ ] Payout status surfaces provider + masked number after settlement.
- [ ] tsc + build clean; tested via `/emu` device frame AND real-device
      sideload loop the user prefers for final confirmation.
