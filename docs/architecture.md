# AgriVil System Architecture

> **Overview**: AgriVil is built on Next.js 16 (App Router + Turbopack), TypeScript, Tailwind CSS, and Capacitor for hybrid mobile delivery.

---

## 1. High-Level Directory Architecture

```
agrivil/
├── .agents/                        # Agent customization instructions & prompts
├── docs/                           # Project documentation & engineering guides
├── app/
│   ├── (web)/                      # Desktop consumer routes (/, /shop, /farmers, etc.)
│   ├── m/                          # Flagship mobile application routes (/m/**)
│   │   ├── page.tsx                # Mobile home with endless catalog sections
│   │   ├── categories/             # Category navigation & filtered produce grids
│   │   ├── product/[slug]/         # Multi-farmer product detail & review drawer
│   │   ├── farmers/                # Smallholder grower profiles & directory
│   │   ├── recipes/                # Authentic Ghanaian recipes & 1-tap cart
│   │   ├── bundles/                # Subscription boxes & weekly curated bundles
│   │   ├── cart/                   # Shopping basket & delivery window selection
│   │   ├── checkout/               # MoMo & card checkout
│   │   ├── orders/                 # Order tracking & logistics timeline
│   │   └── account/                # User profile & saved items
│   ├── farmer/                     # Smallholder grower portal
│   ├── admin/                      # FEFO inventory & logistics hub
│   └── api/                        # Backend API endpoints & webhooks
├── components/
│   └── golden-acres/
│       ├── mobile/                 # Mobile-specific UI components
│       │   ├── mobile-product-card.tsx
│       │   ├── mobile-bottom-nav.tsx
│       │   ├── mobile-back-listener.tsx
│       │   └── mobile-quick-view.tsx
│       ├── cart-context.tsx        # Global shopping basket state
│       └── auth/                   # Session & profile context
├── lib/
│   └── golden-acres/
│       ├── data.ts                 # Product, farmer, recipe, and bundle catalog
│       ├── format.ts               # Ghanaian Cedi (GHS) & freshness formatting
│       └── types.ts                # TypeScript domain models
└── mobile/
    └── android/                    # Capacitor Android native shell
        └── consumer/src/main/java/com/agrivil/marketplace/MainActivity.java
```

---

## 2. Multi-Channel Experience

1. **Mobile Experience (`/m/**`)**:
   - Primary target for the Android APK and PWA users.
   - Tailored specifically for touch manipulation, zero scrollbars, and native hardware back button handling.
   - Tightly integrated with GhanaPostGPS and Mobile Money (MTN MoMo, Telecel Cash, AT Money).

2. **Desktop Web (`/**`)**:
   - Full-width multi-column consumer portal with interactive maps, bulk wholesale ordering, and comprehensive farm story galleries.

3. **Farmer Portal (`/farmer/**`)**:
   - Batch upload for smallholder farmers with harvest date, plot location, moisture levels, and FEFO expiry data.

4. **Admin Logistics Hub (`/admin/**`)**:
   - Real-time FEFO order fulfillment, chilled cold-chain van route dispatch, and 3PL webhook reconciliation.

---

## 3. State Management

- **`CartContext`** (`components/golden-acres/cart-context.tsx`):
  - Manages basket lines, item quantities, subtotal calculation, variable-weight reconciliation, and delivery fee thresholds (free delivery over GHS 150).
  - Supports 1-tap batch adding for recipe ingredients and bundle kits.
- **`SessionContext`** (`components/golden-acres/auth/session-context.tsx`):
  - Handles authentication state, delivery address profiles, and wishlist toggle persistence.
- **`CompareContext`** (`components/golden-acres/compare/compare-context.tsx`):
  - Side-by-side produce comparison across competing farmer prices, distance, and organic certification.

---

## 4. FEFO Expiration & Cold-Chain Logistics

AgriVil uses **First-Expired, First-Out (FEFO)** batching:
- Every farm harvest is logged with an exact harvest timestamp and shelf-life day count.
- Produce nearing optimal shelf-life window is automatically promoted or routed to fast-dispatch cold-chain vans.
- Insulated packaging maintains produce at $< 8^\circ\text{C}$ throughout the last-mile delivery.
