# 06 — Content, Community & Service (recipes, bundles, farmers directory, help)

> **Owns:** `app/(store)/{recipes,bundles,farmers,help,contact,privacy,terms}/**`
> and their components (`recipes/`, `bundles/`, `farmers/`, `help/`,
> `waitlist-form.tsx`, reviews components).
> **Job:** the depth surfaces — where AgriVil stops being a store and becomes
> a daily habit (recipes), a trusted local institution (farmers), and a
> company that answers (help/contact).

## 1. Recipes (the habit builder)

**Current:** recipes pages with ingredient→product mapping, steps, "Add all
ingredients to basket" (the killer feature), cooking-step visualizer.

**Plan:**
- **Index:** editorial magazine layout — lead recipe full-bleed with Fraunces
  title overlay, then hairline rows (image thumb · name · time · serves ·
  "Shop ingredients" link). Category text-tabs (Rice & grains / Stews &
  soups / Street food / Sides & snacks).
- **Detail:** cinematic header image; meta line (time · serves · difficulty)
  as quiet text; ingredients as an interactive checklist card (the one
  elevated unit allowed) with per-ingredient add + "Add all to basket" green
  pill showing live total; steps as numbered hairline rows with the
  visualizer's imagery; chef's tip as an indented copper-accented aside.
- **Commerce glue:** unavailable-ingredient state (swap suggestion or mark
  missing, never silent); after-add confirmation deep-links to basket;
  "cook mode" consideration — step-through view with large type (DECISION:
  defer unless owner wants it; note as optional phase 2).

## 2. Bundles & subscriptions

- **Index:** bundles as full-width editorial rows (image left, story right,
  price + frequency selector inline) rather than uniform card grids.
- **Detail/configure:** frequency choice (one-time/weekly/biweekly/monthly)
  as segmented text control; contents listed with per-item availability
  honesty; total updates live; subscribe CTA explains the mechanics plainly
  (skip/pause/cancel anytime — and those controls must then EXIST in account).
- **Subscription management** in Account (02 owns placement): status pill,
  next delivery date, skip-next / pause / cancel with confirmation and
  win-back microcopy (no dark patterns).

## 3. Farmers directory & profiles

- **Directory:** quiet grid or rows — portrait, name, farm, region,
  specialty tags as plain text, distance from hub (real helper), rating.
  Filters: region text-tabs; search integrated with global palette.
- **Profile:** story-first. Full-bleed cover, portrait, farm story in
  display serif, methods/certifications as plain text lists (not badge
  confetti), their produce as product grid, reviews with verified purchases.
  Contact/inquiry path (existing contact surface) restyled as text links.
- **Provenance loop:** every product card's farm attribution links here —
  the directory is the trust backbone of the marketplace.

## 4. Help center & contact

- **Help:** restructure 610-line help-center into: search-first hero
  (underlined field, instant answers), topic rows (Orders & delivery ·
  Payments & MoMo · Returns & refunds · Account · Selling with us), article
  pages with sticky in-page nav, related articles. Refund/issue articles
  deep-link into the order issue flow (02) — support content that acts.
- **Contact:** form on UnderlineField grammar with topic routing to the
  ticket system (same server action as staff desk), response-time promise
  stated, success state with ticket reference.
- **Ticket thread (customer side):** chat-like timeline, status ribbon,
  attach-photo support (existing upload API), CS-visible fault coding.

## 5. Legal & trust pages (privacy/terms)

- Quiet typographic documents: single measured column (65ch), sticky section
  nav, effective-date stamps, plain-language summaries at top of each major
  section ("The short version"). No redesign flash — these earn trust by
  being readable.

## 6. Acceptance checklist

- [ ] Recipe ingredient→basket flow verified end-to-end incl. unavailable
      ingredient path.
- [ ] Subscription lifecycle controls exist in account (skip/pause/cancel)
      and match bundle frequency options.
- [ ] Every farmer profile reachable from its products' attribution links.
- [ ] Help search returns results with keyboard nav; article anchors work.
- [ ] Contact form creates a ticket with reference shown to the customer.
- [ ] tsc + build clean; `/emu` approval per surface before merge.
