<div align="center">

# 🌿 AgriVil (Golden Acres Ghana)
### Premier Virtual Farmers' Marketplace & Direct Cold-Chain Distribution

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-Android%20%7C%20iOS-119EFF?style=for-the-badge&logo=capacitor)](https://capacitorjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

<p align="center">
  <b>Farm fresh. Market smart. Delivered with care.</b><br>
  Connecting Ghanaian smallholder farmers directly with urban consumers through transparent FEFO batching, direct cold-chain logistics, and fair farmer pricing.
</p>

</div>

---

## 📌 Executive Overview

**AgriVil** is an end-to-end digital agricultural marketplace built to eliminate unnecessary middlemen, reduce post-harvest food waste, and deliver fresh harvest produce across Greater Accra and beyond within 24 hours of harvest.

### Key Capabilities
- 🚜 **Verified Grower Network**: Direct grower attribution, farm stories, harvesting methods, and authentic certifications.
- ❄️ **FEFO Cold-Chain Tracking**: First-Expired, First-Out (FEFO) inventory management ensuring optimal freshness.
- 📍 **GhanaPostGPS Integration**: Accurate digital address validation (`GA-183-4250`) and radius-based delivery estimation.
- 🍲 **Authentic Ghanaian Recipe Bundles**: 1-click basket additions for traditional staples (Jollof Rice, Kontomire Stew, Light Soup).
- 💳 **Multi-Channel Payments**: Mobile Money (MTN MoMo, Telecel Cash, AT Money), Paystack, and Stripe.
- 📱 **Omnichannel Experience**: Responsive desktop storefront + dedicated native Android/iOS mobile application via Capacitor WebView.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [Next.js 16.2.6](https://nextjs.org/) (App Router, Turbopack, React 19) |
| **Mobile Runtime** | [@capacitor/core](https://capacitorjs.com/) (Android WebView, iOS) |
| **Database & ORM** | [Supabase](https://supabase.com/) (PostgreSQL with PgBouncer/Supavisor pooler) + [Drizzle ORM](https://orm.drizzle.team/) |
| **Authentication** | [Better Auth](https://better-auth.com/) + PostgreSQL Session Store (Email, Phone OTP, Social) |
| **Styling & Design** | Tailwind CSS v4, Lucide Icons, Framer Motion |
| **Payments & Logistics** | Paystack, Stripe, Mobile Money API Seams, 3PL Dispatch Tracking |

---

## 🎨 Master Brand Identity & Design System

AgriVil uses an earthy, premium, organic palette inspired by Ghana's fertile soil and harvest sun:

| Swatch | Color Name | Hex Code | Role & Application |
|---|---|---|---|
| 🟢 | **Deep Forest Green** | `#0B3B25` | Primary brand CTA, organic verification, active navigation |
| 🟠 | **Sun Ochre / Harvest Orange** | `#DF8821` | Vitality badges, harvest energy rays, highlight accents |
| 🟤 | **Clay Rust / Copper** | `#7A3F1C` | Farm attribution badges, secondary buttons, discount alerts |
| 🟡 | **Harvest Gold** | `#F0A81E` | Star ratings, premium farm badges, verified customer highlights |
| ⚪ | **Warm Canvas / Off-White** | `#FAF7F2` / `#F7F5F0` | Canonical mobile & desktop background canvas |
| ⚫ | **Deep Soil Charcoal** | `#211A12` | High-contrast headings, active typography |
| 🔘 | **Muted Earth Charcoal** | `#5C5247` | Subtitles, labels, secondary metadata |

### Design Standards
- **Zero Scrollbars**: Native-app fluid feel with global hidden scrollbars.
- **Strict SVG Icons**: 100% clean Lucide SVG icons (no unicode emojis).
- **Canvas-First Philosophy**: Content sits directly on the warm canvas background without redundant nested card wrappers.

---

## 📂 Project Architecture

```text
agrivil/
├── app/                        # Next.js App Router
│   ├── (storefront)/           # Desktop & public routes (/, /shop, /farmers, /bundles, /recipes)
│   ├── m/                      # Mobile-optimized routes loaded by Capacitor WebView
│   ├── farmer/                 # Grower harvest upload & payout portal
│   ├── admin/                  # Cold-chain ops, FEFO inventory, KYC moderation
│   ├── actions/                # DB-backed Server Actions (catalog, orders, reviews, kyc)
│   └── api/                    # Webhooks, 3PL dispatch, auth, and image upload endpoints
├── components/                 # Reusable UI component library
│   ├── golden-acres/           # Domain-specific components (cart context, auth, cards)
│   └── ui/                     # Base design system primitives
├── docs/                       # Project documentation & master brand assets
│   ├── brand-assets/           # Master vector SVGs, app icons, brand guidelines
│   └── setup.md                # Detailed backend provisioning instructions
├── drizzle/                    # Database migrations & SQL seed scripts
│   ├── supabase_setup.sql      # Master 17-table schema definition
│   └── supabase_seed_data.sql  # Full catalog, farmers, bundles, & recipe seed data
├── lib/                        # Core utilities, database connection, API seams
│   ├── db/                     # Drizzle ORM client & table schemas
│   ├── supabase.ts             # Supabase client & admin utilities
│   ├── auth.ts                 # Better Auth configuration
│   └── golden-acres/           # Business logic, geo math, type definitions
└── mobile/                     # Capacitor native iOS & Android project shell
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.18+ or v20+
- **Package Manager**: `pnpm` (or `npm`)
- **Supabase Account**: Free project on [supabase.com](https://supabase.com)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/dbryan-tech/agrivil.git
cd agrivil

# Install dependencies
pnpm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory (refer to [`.env.example`](.env.example)):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# PostgreSQL Connection String (Transaction Pooler port 6543)
DATABASE_URL=postgresql://postgres.your-project:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require

# Better Auth Configuration
BETTER_AUTH_SECRET=your-random-32-byte-secret
BETTER_AUTH_URL=http://localhost:3000
```

### 4. Database Provisioning
Run the master schema in your Supabase SQL Editor:
1. Copy and run [`drizzle/supabase_setup.sql`](drizzle/supabase_setup.sql) (creates all 17 tables and indexes).
2. Copy and run [`drizzle/supabase_seed_data.sql`](drizzle/supabase_seed_data.sql) (populates products, farmers, and recipes).

### 5. Running the Application
```bash
# Start Next.js development server
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) for the desktop storefront or [http://localhost:3000/m](http://localhost:3000/m) for the mobile web preview.

---

## 📱 Mobile APK & Capacitor Workflow

The mobile application is powered by Capacitor and dynamically syncs with the live backend:

```bash
# Open Android Studio project
cd mobile
npm run cap:android

# Or run the root build script to generate a fresh APK
./build-apk.bat
```

> **Note on APK Updates**: Because the Capacitor shell wraps the live production deployment (`https://agrivil1.vercel.app/m`), code changes deployed to Vercel are instantly live in users' APKs without requiring a manual re-download.

---

## 📜 Available NPM Scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Start the local Next.js development server with Turbopack |
| `pnpm build` | Build the optimized production bundle |
| `pnpm start` | Run the production build locally |
| `pnpm db:push` | Push schema changes from `lib/db/schema.ts` to PostgreSQL |
| `pnpm db:seed` | Seed catalog and demo records into the active database |
| `pnpm db:setup` | Full database push + initial seed execution |
| `pnpm mobile:android` | Open the native Android Capacitor project |

---

## 📄 License & Ownership
Copyright © 2026 **AgriVil / Golden Acres Ghana**. All rights reserved.
