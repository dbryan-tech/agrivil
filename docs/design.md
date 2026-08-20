# AgriVil Design System & Visual Guidelines

> **Philosophy**: AgriVil delivers an ultra-premium, farm-fresh visual experience rooted in Ghanaian agrarian culture, modern minimalism, and high-contrast accessibility.

---

## 1. Color Palette

| Token | Hex | Tailwind Equivalent / Usage | Purpose |
|---|---|---|---|
| **Forest Green** | `#0B3B25` | `bg-[#0B3B25]`, `text-[#0B3B25]` | Primary brand color, organic badges, primary CTAs, active states |
| **Sun Ochre / Orange** | `#DF8821` | `bg-[#DF8821]`, `text-[#DF8821]` | Harvest sun arch & rays, highlight accents, vitality badges |
| **Clay Rust** | `#7A3F1C` | `bg-[#7A3F1C]`, `text-[#7A3F1C]` | Secondary brand, farm attribution links, promo badges, discounts |
| **Harvest Gold** | `#F0A81E` / `#F59E0B` | `fill-[#F0A81E]`, `text-[#F0A81E]` | Star ratings, highlighted farm tags, freshness markers |
| **Canvas Off-White** | `#FAF9F6` / `#F7F5F0` | `bg-[#FAF9F6]`, `bg-[#F7F5F0]` | Primary mobile backgrounds, subtle card backgrounds |
| **Soil Charcoal** | `#211A12` | `text-[#211A12]` | High-contrast primary headings, titles, active tabs |
| **Muted Earth** | `#5C5247` / `#8A7E72` | `text-[#5C5247]`, `text-[#8A7E72]` | Subtitles, metadata, unit pricing labels, helper text |

---

## 2. Master Brand Asset System (Concept 01)

All production logos, lockups, and digital/print stationery are maintained in vector and high-resolution raster formats in [`docs/brand-assets/`](docs/brand-assets/):
- **Primary Horizontal Logo**: `public/agrivil-logo.svg` / `docs/brand-assets/01_LOGO_SYSTEM/agrivil_logo_primary_horizontal.svg`
- **Primary Stacked Logo**: `docs/brand-assets/01_LOGO_SYSTEM/agrivil_logo_stacked.svg`
- **Standalone Emblem Mark**: `public/agrivil-mark.svg` / `docs/brand-assets/01_LOGO_SYSTEM/agrivil_mark_color.svg`
- **Round Farm Fresh Guarantee Stamp**: `public/agrivil-stamp.svg` / `docs/brand-assets/01_LOGO_SYSTEM/agrivil_round_stamp_badge.svg`
- **Circular Social Avatar**: `docs/brand-assets/01_LOGO_SYSTEM/agrivil_social_avatar_circle.svg`
- **App Icons & Favicons**: Multi-density suite (`16px` to `1024px`) in `docs/brand-assets/03_DIGITAL_ASSETS/` and `public/icon.png`

---

## 3. Layout, Margins & Compact Spacing

### A. The 10% Margin Standard
Standard mobile web applications often use `px-3` (12px) to `px-4` (16px) margins. In AgriVil, all mobile screens adapt a **compact 10% margin standard**:
- Outer horizontal padding: `px-1.5` (~4px to 6px) across all views.
- Card grid gaps: `gap-1.5` for 2-column produce grids and category layouts.
- Vertical stack spacing: `space-y-1.5` or `space-y-2` between sequential card elements.

### B. Halved Section Vertical Spacing
Top-of-screen content density is maximized by halving vertical spacing:
- Header $\rightarrow$ Search Bar: `pt-1.5`
- Search Bar $\rightarrow$ Hero Promo: `pt-1.5`
- Hero Promo $\rightarrow$ "Shop by category": `pt-2`
- "Shop by category" $\rightarrow$ Category chips: `pb-1`
- Category chips $\rightarrow$ "Recommended for you": `pt-2`
- "Recommended for you" $\rightarrow$ 2-Column produce grid: `pt-1.5`

### C. Full-Bleed Media Exceptions
- **Hero Banners**: Use `rounded-b-[32px]` with zero side padding or `px-1` on the home screen.
- **Recipe & Bundle Detail Banners**: Aspect `16/9` or `16/10` bleeding 100% to the top, left, and right edges.
- **Card Images**: Product and recipe card images bleed edge-to-edge within their rounded container.

---

## 3. Card Minimalism Philosophy (Canvas-First)

Excessive nested cards, borders, and white rounded boxes create visual clutter and reduce readable content. AgriVil enforces a **canvas-first approach**:

### What Sits Directly on Canvas:
- Page descriptions and intro paragraphs.
- "About This Dish" and recipe stories.
- "Step-by-Step Cooking Instructions" (rendered as clean numbered steps on background).
- "Farm-to-Door Specifications" (rendered as a clean 2-column key-value grid).
- Farmer biography and value pillar icons.
- Feature badges strip (clean inline icons with text).

### What Warrants a Dedicated Card:
- `MobileProductCard` (interactive 2-column grid item with quick add and freshness badge).
- Farm Ingredients Checklist Card (interactive bundle with 1-tap "Add All to Basket").
- Grower Profile Card (grower avatar, farm name, rating, and verified badge).
- Delivery Selector & Price Breakdown Card (interactive radio selectors and billing summary).

---

## 4. Strict "NO EMOJIS" Rule

- **Unicode emojis are strictly forbidden** across the entire UI (e.g. 🍅, 🥬, 🚚, 📦, ⭐️, 🔥, 🇬🇭).
- **Always use Lucide SVG icons** with appropriate styling:
  - Freshness / Organic: `<Leaf className="h-3.5 w-3.5 text-[#0B3B25]" />`
  - Cold-Chain Delivery: `<Snowflake className="h-3.5 w-3.5 text-[#7A3F1C]" />` or `<Truck />`
  - Ratings: `<Star className="h-3.5 w-3.5 fill-[#F0A81E] text-[#F0A81E]" />`
  - Verification: `<ShieldCheck className="h-3.5 w-3.5 text-[#0B3B25]" />` or `<CheckCircle2 />`
  - Cooking: `<ChefHat />` or `<UtensilsCrossed />`

---

## 5. Typography Hierarchy

- **Screen Titles**: `text-[22px]` to `text-[26px]`, `font-black`, `tracking-tight`, `text-[#211A12]`.
- **Section Headers**: `text-[14px]` to `text-[16px]`, `font-black`, `text-[#211A12]`.
- **Category & Pill Labels**: `text-[10px]` to `text-[11.5px]`, `font-black`, `uppercase`, `tracking-[0.14em]`, `text-[#5C5247]`.
- **Product & Recipe Names**: `text-[13px]` to `text-[14px]`, `font-extrabold` / `font-black`, `text-[#211A12]`.
- **Pricing**: `text-[15px]` to `text-[17px]`, `font-black`, `text-[#0B3B25]`.
- **Body & Descriptions**: `text-[11.5px]` to `text-[12.5px]`, `font-medium`, `text-[#5C5247]` / `text-[#211A12]`, `leading-relaxed`.

---

## 6. Micro-Interactions & Transitions

- **Tap Feedback**: `active:scale-95` on icon buttons; `active:scale-[0.98]` on cards and action buttons.
- **Scrollbars**: Hidden globally using `[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`.
- **Sticky Bars**: Translucent backgrounds with `bg-white/95` or `bg-[#F7F5F0]/95` and `backdrop-blur-md`.
