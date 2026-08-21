# AgriVil (Golden Acres Ghana) — Setup & Database Provisioning

Next.js 16 farm-to-door agricultural marketplace. Stack: **Supabase PostgreSQL + Drizzle ORM + Better Auth**, Capacitor Mobile, Vercel.

---

## 1. Quick Start Guide

### Step 1: Install Dependencies
```bash
pnpm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env.local` and populate your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://hxacnucbapdxwewnsktn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Supabase Transaction Pooler (Port 6543):
DATABASE_URL=postgresql://postgres.hxacnucbapdxwewnsktn:[YOUR_DB_PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require

BETTER_AUTH_SECRET=agrivil_prod_secret_auth_key_2026_supabase_backend
BETTER_AUTH_URL=http://localhost:3000
```

### Step 3: Provision Supabase Database
You can provision your database using either of two methods:

#### Method A: 1-Click SQL Editor (Recommended)
1. Open the [Supabase SQL Editor](https://supabase.com/dashboard/project/hxacnucbapdxwewnsktn/sql).
2. Copy and execute [`drizzle/supabase_setup.sql`](../drizzle/supabase_setup.sql) (creates all 17 tables and indexes).
3. Copy and execute [`drizzle/supabase_seed_data.sql`](../drizzle/supabase_seed_data.sql) (populates products, farmers, bundles, recipes, and discounts).

#### Method B: Automated CLI
```bash
pnpm db:setup
```

---

## 2. Database Scripts Reference

| Script | Purpose |
|---|---|
| `pnpm db:push` | Push `lib/db/schema.ts` to the DB (creates/updates tables). Idempotent. |
| `pnpm db:generate` | Generate SQL migration files into `drizzle/`. |
| `pnpm db:seed` | Seed farmers, products, bundles, recipes, orders, tickets. |
| `pnpm db:seed:users` | Seed demo customer + staff/farmer accounts. |
| `pnpm db:setup` | `db:push` + seed + seed users (full provision). |
| `pnpm db:studio` | Open Drizzle Studio in browser to visually inspect live data. |

---

## 3. Engineering Notes
- **Schema Source of Truth**: [`lib/db/schema.ts`](../lib/db/schema.ts) (17 tables including Better Auth `user`/`session`/`account`/`verification`).
- **Database Client**: [`lib/db/index.ts`](../lib/db/index.ts) configured with SSL support and connection pooling.
- **Supabase Utilities**: [`lib/supabase.ts`](../lib/supabase.ts) for client-side and server-side operations.
- **Graceful Fallbacks**: Optional third-party integrations (Stripe, Resend, SMS) degrade gracefully when environment variables are absent.
