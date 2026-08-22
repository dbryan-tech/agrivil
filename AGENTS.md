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
- **Sun Ochre / Orange** (`#DF8821`): Harvest sun arch & radiating energy rays, highlight accents, vitality badges.
- **Clay Rust** (`#7A3F1C`): Secondary brand, farm attribution links, badges, discount alerts.
- **Harvest Gold** (`#F0A81E` / `#F59E0B`): Star ratings, featured farm highlights, badges.
- **Off-White / Warm Canvas** (`#FAF9F6` / `#F7F5F0`): Primary mobile page backgrounds and card substrates.
- **Deep Soil Charcoal** (`#211A12`): High-contrast primary headings, titles, and active tabs.
- **Muted Earth Charcoal** (`#5C5247` / `#8A7E72`): Secondary metadata, subtitles, labels, and helper text.

### B. Master Brand Asset System (Concept 01)
- **Vector Brand Directory**: `docs/brand-assets/`
  - `01_LOGO_SYSTEM/`: Core marks, primary stacked logos, horizontal logos, reverse white, monochrome black, circular social avatar, and round farm fresh stamp.
  - `02_ICONS/`: 12 Brand SVG and PNG icons (`home`, `search`, `cart`, `heart`, `user`, `location`, `bag`, `bell`, `recipe`, `settings`, `package`, `farmer`).
  - `03_DIGITAL_ASSETS/`: Multi-density app icons (16px–1024px), `favicon.ico`, and social media banners.
  - `04_PRINT_ASSETS/`: Business cards, A4 letterhead, email signature, and invoice headers.
  - `05_MOCKUPS/`: Seamless brand canvas pattern tile.
  - `06_BRAND_GUIDE/`: `AGRIVIL_BRAND_IDENTITY_GUIDE.md` & `ASSET_MANIFEST.json`.
- **Mobile Agent Package**: `docs/mobile-app-agent-package/`
- **Public App Integration**: `public/agrivil-logo.svg`, `public/icon.png`, `public/favicon.ico`, `public/brand-pattern.png`.

### C. Standardized 10% Margins & Compact Spacing
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

## 5. High-Speed Performance & Caching Architecture

### A. 97% Image Compression & WebP Pipeline
- All visual assets in `public/golden-acres/` are pre-compressed and paired with lightweight WebP formats (averaging 15–35 KB per produce/avatar asset).
- `next.config.mjs` enforces AVIF/WebP image optimization, gzip/brotli compression, and immutable cache headers (`public, max-age=31536000, immutable`).
- Never introduce uncompressed multi-megabyte PNGs into the repository without running `scripts/optimize-images.mjs`.

### B. Multi-Tier SWR Catalog Caching
- **Client Tier (`DataStoreProvider`)**: Rehydrates from `ga-catalog-cache-v2` in **0ms** so mobile views render instantly without waiting for server network hops. Syncs in the background with SWR.
- **Server Tier (`app/actions/catalog.ts`)**: Server-side in-memory snapshot cache with a 60-second TTL. Queries respond in < 1ms from RAM, automatically invalidated on product/farmer mutations.

### C. Multi-Bucket Service Worker v2 (`public/sw.js`)
- `agrivil-static-v2`: Cache-first for Next.js immutable static chunks and fonts.
- `agrivil-images-v2`: Permanent cache-first for produce, farmer, and recipe photography.
- `agrivil-pages-v2`: Stale-While-Revalidate for mobile routes (`/m/**`), providing instant zero-delay navigation.

### D. Native Android WebView Tuning (`MainActivity.java`)
- Native hardware acceleration (`LAYER_TYPE_HARDWARE`).
- `setOffscreenPreRaster(true)` for fluid 120Hz scrolling.
- Enabled DOM storage, database caching, and persistent WebView cache.

---

## 6. APK Build & GitHub Actions Release Workflow

- **Automated CI/CD**: APK generation is automated via GitHub Actions (`.github/workflows/build-apks.yml`).
- Pushing to the `main` branch automatically compiles both the **AgriVil-Consumer-Debug.apk** (pointed at `/m`) and **AgriVil-Farmer-Debug.apk** (pointed at `/m/farmer`), publishing them directly to GitHub Releases.
- Do NOT mandate local APK compilation when making web or styling updates; push to GitHub and let GitHub Actions generate the downloadable release binaries.

---

## 7. Verification & Quality Gates

1. Always run `npm run build` with `BypassSandbox: true` before completing changes to verify 0 TypeScript and compilation errors across all 320+ static and dynamic routes.
2. Maintain clean git commit history with clear conventional commit messages.
