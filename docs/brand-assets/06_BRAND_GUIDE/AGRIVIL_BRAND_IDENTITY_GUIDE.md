# AgriVil — Brand Identity & Asset Guidelines (Concept 01)

> **Approved Master Brand Identity System**  
> **Source Reference**: Concept 01 from Client Brand Board (`AI_brand_application_board_reference.png`)  
> **Version**: 1.0.0 (Production Release)

---

## 1. Brand Concept & Story

**AgriVil** represents the dawn of direct-from-farm cold-chain commerce in Ghana.
The emblem unites two foundational agricultural elements:
1. **The Rising Sun (Harvest Sun)**: Radiating energy with 9 rays (7 radial + 2 horizontal baseline rays) and an open semicircular arch in warm Sun Ochre (`#DF8821`), symbolizing dawn harvest, renewal, and optimism.
2. **The Farmland Furrows & Terraced Hills**: Formed by the bottom hemisphere in Deep Forest Green (`#0B3B25`), cut with organic negative-space channels that convey rolling rows of crops, soil vitality, and transparent farm-to-table traceability.

---

## 2. Color Palette & Specifications

| Color Role | Name | Hex Code | RGB | CMYK | Usage |
|---|---|---|---|---|---|
| **Primary Brand** | Deep Forest Green | `#0B3B25` | `11, 59, 37` | `81, 0, 37, 77` | Wordmarks, primary buttons, dark backdrops |
| **Primary Accent** | Sun Ochre / Orange | `#DF8821` | `223, 136, 33` | `0, 39, 85, 13` | Sun arch, rays, energy accents |
| **Secondary Accent** | Clay Rust | `#7A3F1C` | `122, 63, 28` | `0, 48, 77, 52` | Farm attribution badges, discount labels |
| **Highlight** | Harvest Gold | `#F0A81E` | `240, 168, 30` | `0, 30, 88, 6` | Star ratings, premium farmer certifications |
| **Canvas / BG** | Warm Canvas | `#FAF7F2` | `250, 247, 242` | `0, 1, 3, 2` | Mobile & web canvas backgrounds, light app icons |
| **Primary Text** | Deep Soil Charcoal | `#211A12` | `33, 26, 18` | `0, 21, 45, 87` | Headings, high-contrast typography |
| **Secondary Text** | Muted Earth Charcoal | `#5C5247` | `92, 82, 71` | `0, 11, 23, 64` | Subtitles, metadata, body text |

---

## 3. Typography System

- **Primary Wordmark**: Geometric Bold Sans-Serif (`Montserrat Bold` / `Manrope Bold` / `Segoe UI Bold`) with `letter-spacing: 0.22em`.
- **Tagline**:
  - Line 1: **"Farm Fresh. Market Smart."** (Bold / SemiBold)
  - Line 2: **"Delivered with care."** (Medium / Regular)
- **Body & Interface**: `Inter` / system sans-serif for clean readability across Android, iOS, and Web.

---

## 4. Logo Lockups & Variations

1. **Primary Stacked Logo** (`agrivil_logo_stacked.svg` / `.png`):
   - Used for center-aligned headers, splash screens, packaging, and hero presentations.
2. **Primary Horizontal Logo** (`agrivil_logo_primary_horizontal.svg` / `.png`):
   - Standard navigation bar lockup, letterheads, invoice headers, and email signatures.
3. **Standalone Mark** (`agrivil_mark_color.svg`, `agrivil_mark_white.svg`, `agrivil_mark_black.svg`):
   - Social media profile avatars, favicon, stamps, and app icon centerpieces.
4. **Reverse White** (`agrivil_logo_reverse.svg` / `.png`):
   - For placement on Deep Forest Green or dark photo backgrounds.
5. **Monochrome Black** (`agrivil_logo_black.svg` / `.png`):
   - Single-color print, receipts, and carton stamping.
6. **Social Profile Avatar (Circular)** (`agrivil_social_avatar_circle.svg` / `.png`):
   - Circular border badge for social media profile pictures.
7. **Round Farm Fresh Stamp Badge** (`agrivil_round_stamp_badge.svg` / `.png`):
   - Circular stamp badge with "FARM FRESH · MARKET SMART".
8. **App Icons** (`agrivil_app_icon.png`, `agrivil_app_icon_dark.png`):
   - Android Capacitor and iOS mobile application icons.

---

## 5. Clear Space & Minimum Sizing Rules

- **Clear Space**: Maintain a minimum exclusion zone around the logo equal to the radius of the inner sun arch ($R_{in} \approx 0.3\times$ total mark height).
- **Minimum Digital Sizing**:
  - Horizontal logo: Minimum 140px width.
  - Stacked logo: Minimum 90px width.
  - Standalone mark: Minimum 24px $\times$ 24px.
- **Do's & Don'ts**:
  - DO use the official vector SVGs whenever possible.
  - DO place the reverse white logo on Deep Forest Green backgrounds.
  - DO NOT rotate, skew, or stretch the logo proportions.
  - DO NOT replace brand colors with arbitrary shades.
  - DO NOT add drop shadows or bevels to the vector mark.

---

## 6. Directory Structure & Asset Inventory

```
docs/brand-assets/
├── 01_LOGO_SYSTEM/         # Core marks, lockups, reverse, monochrome, social circle, stamp, and usage board
├── 02_ICONS/               # 12 UI SVG & PNG icons (home, cart, search, farmer, etc.)
├── 03_DIGITAL_ASSETS/      # App icon suite (16px to 1024px), favicon.ico, social banners
├── 04_PRINT_ASSETS/        # Business cards, A4 letterhead, email signature, invoice header
├── 05_MOCKUPS/             # Brand pattern tile & reference mockups
├── 06_BRAND_GUIDE/         # This guide, ASSET_MANIFEST.json, contact sheet
└── 07_SOURCE_REFERENCES/   # Original client reference board and concept sheet
```
