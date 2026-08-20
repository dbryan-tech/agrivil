# AgriVil — Agent Instructions & Operating Manual

> **Scope**: This document defines the engineering standards, design philosophy, mobile-first guidelines, and system architecture for AI agents and engineers working on the AgriVil codebase.

---

## 1. Project Identity & Architecture

**AgriVil (Golden Acres)** is a premier virtual farmers' marketplace in Ghana connecting consumers directly to smallholder farmers with direct-from-farm cold-chain distribution, transparent FEFO batching, and fair farmer pricing.

### Core Route Taxonomy & URL Masking
- `/**` (e.g. `/`, `/shop`, `/farmers`, `/bundles`, `/recipes`, `/cart`, `/checkout`, `/orders`) — **Clean Public URLs**: The browser address bar ALWAYS displays clean URLs with **zero `/m` or `/w` prefix**.
  - **On Mobile Devices**: The middleware transparently rewrites clean URLs to render the mobile `/m/**` components while keeping the URL bar clean.
  - **On Desktop / Tablets**: The middleware serves the full desktop consumer storefront. Any intentional visit to `/m` or `/w` on a desktop/tablet automatically redirects (307) back to the clean desktop equivalent.
- `/m/**` — **Mobile Application Internal Routes**: Loaded directly inside the Android Capacitor WebView and progressive mobile web.
- `/farmer/**` — **Farmer Portal**: Smallholder grower harvest uploads, batch management, and payout wallet.
- `/admin/**` — **Admin Hub**: FEFO inventory management, cold-chain logistics routing, and platform analytics.
- `/api/**` — **Backend Endpoints**: Paystack / Stripe webhooks, 3PL dispatch tracking, auth, and image upload.

---

## 2. Design System & Visual Aesthetics

### A. Color Palette
- **Deep Forest Green** (`#0B3B25`): Primary brand, organic certification, success states, primary CTA buttons.
- **Clay Rust** (`#7A3F1C`): Secondary brand, farm attribution links, badges, discount alerts.
- **Harvest Gold** (`#F0A81E` / `#F59E0B`): Star ratings, featured farm highlights, badges.
- **Off-White / Warm Canvas** (`#FAF9F6` / `#F7F5F0`): Primary mobile page backgrounds and card substrates.
- **Deep Soil Charcoal** (`#211A12`): High-contrast primary headings, titles, and active tabs.
- **Muted Earth Charcoal** (`#5C5247` / `#8A7E72`): Secondary metadata, subtitles, labels, and helper text.

### B. Standardized 10% Margins & Compact Spacing
- **Outer Page Horizontal Padding**: Standardized to `px-1.5` (~4px to 6px, representing 10% of standard `16px` padding) across all mobile views.
- **Card Grid Spacing**: `gap-1.5` for 2-column produce and category grids; `space-y-1.5` or `space-y-2` for vertical card lists.
- **Halved Vertical Section Spacing**: Ultra-compact top spacings (`pt-1.5`, `pt-2`, `pb-1`) between header, search bar, hero, chips, and produce sections.
- **Full-Bleed Exceptions**: Hero banners, full-bleed images, and top header media bleed edge-to-edge (`w-full` with `rounded-b-[32px]`, or `-mx-1.5`).

### C. Canvas-First Card Philosophy (Avoid Excessive Box Wrappers)
- Do NOT wrap every single text paragraph, story, or description in bordered white boxes or bubble cards.
- Text sections (e.g. "About This Dish", "About the Farm", "Step-by-Step Cooking Instructions", "Farm-to-Door Specifications") should sit **directly on the canvas background** with clean, authoritative typography.
- Preserve dedicated cards **only for interactive or high-value units**:
  1. Produce Cards (`MobileProductCard`)
  2. Farm Ingredients Checklist Card (with 1-click Add to Basket)
  3. Grower Profile Card
  4. Delivery Window Selector & Price Breakdown Card

### D. Strict "NO EMOJIS" Rule
- **Never use Unicode emojis** (e.g. 🍅, 🥬, 🚚, ⭐️, 🔥, 🇬🇭) in UI copy, badges, buttons, or section headers.
- Always use clean **Lucide SVG Icons** (e.g. `Leaf`, `Truck`, `Star`, `ShieldCheck`, `CheckCircle2`, `Sparkles`, `Clock`, `UtensilsCrossed`).

---

## 3. Mobile & Android Capacitor Architecture

### A. Android Hardware Back Button Delegation
- The native Android `MainActivity.java` overrides `onBackPressed()` and delegates history navigation to `bridge.getWebView().goBack()`.
- The client-side `<MobileBackListener />` listens for hardware back events and closes active drawers/modals (e.g. Reviews Modal, Quick View, Filter Drawers) before triggering route navigation.

### B. Zero-Scrollbar Experience
All mobile views include global zero-scrollbar overrides:
```css
* {
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}
*::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}
```

### C. Safe Area Insets
All sticky headers, fixed bottom bars, and full modals must respect device safe areas:
- Top headers: `style={{ paddingTop: 'max(env(safe-area-inset-top), 12px)' }}`
- Bottom bars: `style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 14px)' }}`

---

## 4. State Management & Data Patterns

- **Cart State** (`components/golden-acres/cart-context.tsx`): Persistent cart supporting variable-weight estimates, delivery fees, discount calculations, and 1-tap ingredient batch addition.
- **Session State** (`components/golden-acres/auth/session-context.tsx`): User profile, address, and wishlist persistence.
- **Product Catalog** (`lib/golden-acres/data.ts`): Single source of truth for products, farmers, bundles, and authentic Ghanaian recipes (`r1` to `r6`). All recipe ingredients map to real catalog products (`p1` to `p20`).

---

## 5. Verification & Quality Gates

1. Always run `npm run build` with `BypassSandbox: true` before completing changes to verify 0 TypeScript and compilation errors across all 320+ static and dynamic routes.
2. Maintain clean git commit history with clear conventional commit messages.
