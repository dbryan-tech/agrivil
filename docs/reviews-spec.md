# Reviews & Verified-Customer Ratings

This document describes how product and farmer reviews work in AgriVil / Golden
Acres Ghana, and the access-control rules that guarantee only genuine,
delivered-order customers can leave a review.

> **Auth note:** This app uses **Better Auth** (email + password, `lib/auth.ts`),
> **not Clerk**. The Clerk "Basic RBAC with metadata" guide is a useful
> conceptual reference for role-based access, but its `publicMetadata`,
> `clerkMiddleware`, and `clerkClient` APIs do **not** apply here. The equivalent
> concepts in this codebase are documented under
> [Access control](#access-control) below.

---

## 1. What customers can do

A signed-in customer whose order has been **delivered** can, from the order
tracking page (`/orders/[ref]`):

- Rate the overall **order** (1–5 stars) + leave an order comment.
- Rate the **delivery rider** and optionally add a tip.
- **Rate _and_ write a review for each product** in the order. The written text
  appears as a **verified-purchase** review on that product's page.
- **Rate _and_ write a review for each farmer** behind the order. This appears on
  the farmer's profile and feeds the farmer's aggregate rating.

Shoppers browsing a product or farmer can read these reviews, see the
"Verified purchase" badge, and read the **farmer's public reply** to a review.

---

## 2. End-to-end flow

```
Delivered order ──► /orders/[ref]#feedback ──► DeliveryFeedback form
        │                                              │
        │                                              ▼
        │                              submitDeliveryFeedback() [server action]
        │                                              │
        │            ┌─────────────────────────────────┼───────────────────────────────┐
        ▼            ▼                                 ▼                                 ▼
  order rating   per-product reviews (body)   per-farmer reviews (body)        recompute farmer
  + rider + tip  → reviews (verifiedPurchase) → reviews (verifiedPurchase)     aggregate rating
                          │                                                            │
                          ▼                                                            ▼
                 ReviewList on product page                                  Farmer profile rating
                 (shows body + farmer reply)
```

### Entry points (discoverability)
- **Order tracking page** (`/orders/[ref]`): the `DeliveryFeedback` form renders
  only when `order.status === 'delivered'`, anchored at `#feedback`.
- **Account → Orders**: delivered orders that have **no feedback yet**
  (`!feedbackAt`) show a prominent **"Rate & review"** CTA that deep-links to
  `/orders/{ref}#feedback`.

---

## 3. Access control

Reviews are gated server-side in `submitDeliveryFeedback`
(`app/actions/reviews.ts`). Every guard is enforced on the server — the UI gating
is only a convenience.

| Guard | Rule | Failure message |
| --- | --- | --- |
| **Authenticated** | `getSessionUser()` must return a Better Auth user | "Please sign in to leave feedback." |
| **Order exists** | order looked up by `reference` | "Order not found." |
| **Ownership** | if `order.userId` is set, it must equal the session user's id | "You can only review your own orders." |
| **Delivered** | `order.status === 'delivered'` | "You can rate an order once it's delivered." |
| **Valid items** | product reviews are accepted only for product ids actually in the order (`validProductIds`) | silently skipped |

Star values are clamped to 1–5 (`clampStar`). Tips are floored at 0.

### How this maps to the Clerk RBAC guide
The attached Clerk guide stores a `role` in `publicMetadata`, reads it from the
session token, and gates routes/actions with a `checkRole()` helper. The
equivalent here:

| Clerk guide concept | This app (Better Auth) |
| --- | --- |
| `publicMetadata.role` on the session token | `user.role` on the Better Auth user record |
| `checkRole('admin')` helper | role checks inside server actions + route guards (e.g. staff/admin gated dashboards) |
| `clerkMiddleware` route protection | route-level guards in the `app/admin`, `app/farmer`, `app/support` segments |
| `clerkClient.users.updateUserMetadata` | Drizzle updates against the `user` / domain tables |

Roles in this project: **customer**, **staff/admin** (ops + admin consoles),
**farmer** (farmer portal). Reviews specifically rely on **order ownership**, not
a role — any authenticated customer can review the orders they own once delivered.

---

## 4. Data model

Reviews live in the `reviews` table (`lib/db/schema.ts`):

| Column | Meaning |
| --- | --- |
| `userId`, `authorName` | review author (the verified customer) |
| `productId` | set for product-level reviews; **`NULL` for farmer-level reviews** |
| `farmerId` | farmer the review is attributed to (set for both product- and farmer-level rows) |
| `orderRef` | the delivered order the review came from |
| `rating` | 1–5 stars |
| `body` | the written review text |
| `verifiedPurchase` | `true` for reviews created via `submitDeliveryFeedback` |
| `status` | moderation status |
| `farmerReply`, `farmerReplyAt` | the farmer's public reply (rendered to shoppers) |

Order-level feedback (overall rating, rider rating, tip, comment, `feedbackAt`)
is stored on the `orders` row, not in `reviews`.

### Farmer aggregate rating
`recomputeFarmerRating(farmerId)` blends the farmer's **seeded baseline**
reputation (`baselineRating` / `baselineReviewCount`) with platform reviews, so a
single new review never wipes an established standing. Both farmer-level rows
(`productId IS NULL`) and product-level rows count toward the farmer's average,
but `getFarmerReviews` only surfaces farmer-level rows (`productId IS NULL`).

---

## 5. Server actions (`app/actions/reviews.ts`)

| Action | Who | Purpose |
| --- | --- | --- |
| `submitDeliveryFeedback(input)` | order owner | Writes order feedback + verified per-product and per-farmer reviews; recomputes farmer ratings. |
| `getProductReviews(productId)` | public | Reviews shown on a product page. |
| `getFarmerReviews(farmerId)` | public | Farmer-level reviews (`productId IS NULL`) shown on a farmer profile. |
| `replyToReview(reviewId, reply)` | farmer | Stores `farmerReply` / `farmerReplyAt` (rendered publicly in `ReviewList`). |

`DeliveryFeedbackInput` carries `reference`, `orderRating`, optional
`riderRating` / `tip` / `comment`, plus `productReviews[]` and `farmerReviews[]`
(each `{ id, rating, body? }`).

---

## 6. Key UI components

| File | Role |
| --- | --- |
| `components/golden-acres/tracking/delivery-feedback.tsx` | The post-delivery form: order/rider rating + tip, per-product rating with a written-review textarea revealed on rating, and a per-farmer rate-and-review section. Farmer names resolved from `useDataStore().farmers`. |
| `components/golden-acres/tracking/order-tracking.tsx` | Mounts `DeliveryFeedback` (only when delivered) inside an `id="feedback"` anchor. |
| `components/golden-acres/reviews/review-list.tsx` | Read-only review list for product/farmer pages; renders body, "Verified purchase" badge, and the farmer's reply. |
| `components/golden-acres/account/account-dashboard.tsx` | "Rate & review" CTA on delivered orders awaiting feedback. |

---

## 7. Verification (Jun 2026)

Confirmed end-to-end against the running dev server + Neon:

- Submitted feedback as the signed-in demo customer → **4 reviews persisted** with
  written `body` text and `verifiedPurchase = true` (2 product, 2 farmer).
- Written review + "Verified purchase" badge render on the product page.
- Unauthenticated submit is correctly blocked ("Please sign in to leave feedback").
- `0` TypeScript errors; `0` console / hydration errors on a clean load.

### Related fix
The freshness badge (`freshnessLabel(expiryDate)`) is date-dependent but renders
on statically-prerendered cards, which caused a hydration mismatch. It is now
computed after mount (`useState` + `useEffect`, `null` until mounted) in
`produce-card.tsx`, `product-detail.tsx`, and `product-list-row.tsx`.
`quick-view.tsx` keeps the synchronous call because it only renders inside a
modal (never server-rendered).
