# AgriVil / Golden Acres Ghana — Setup & DB Provisioning

Next.js 16 farm-to-door marketplace. Stack: **Neon Postgres + Drizzle ORM + Better Auth**, Vercel Blob, optional Stripe.

## Quick start (fresh environment / new Vercel account)

1. **Install deps**
   ```bash
   pnpm install
   ```

2. **Connect the database** — add the **Neon** integration to the project.
   This automatically sets `DATABASE_URL`. (Any Postgres connection string works.)

3. **Set required env vars** (see `.env.example`):
   - `DATABASE_URL` — from Neon (auto)
   - `BETTER_AUTH_SECRET` — `openssl rand -base64 32`
   - `BETTER_AUTH_URL` — app base URL (e.g. `http://localhost:3000`)

4. **Create tables + seed data** (one command):
   ```bash
   pnpm db:setup
   ```
   This runs `drizzle-kit push` (creates all 17 tables from `lib/db/schema.ts`)
   then seeds the catalog and demo users.

5. **Run**
   ```bash
   pnpm dev
   ```

## Database scripts

| Script | What it does |
| --- | --- |
| `pnpm db:push` | Push `lib/db/schema.ts` to the DB (creates/updates tables). Idempotent. |
| `pnpm db:generate` | Generate SQL migration files into `drizzle/`. |
| `pnpm db:seed` | Seed farmers, products, bundles, recipes, orders, tickets. |
| `pnpm db:seed:users` | Seed demo customer + staff/farmer accounts. |
| `pnpm db:setup` | `db:push` + seed + seed users (full provision). |
| `pnpm db:studio` | Open Drizzle Studio to inspect data. |

> Fallback: raw DDL for all tables lives in `drizzle/0000_init.sql` if you'd
> rather apply the schema with `psql` instead of `drizzle-kit push`.

## Notes for an AI agent picking this up
- Schema source of truth: **`lib/db/schema.ts`** (17 tables incl. Better Auth
  `user`/`session`/`account`/`verification`). DB client: `lib/db/index.ts`.
- There is **no RLS** (Neon + Better Auth) — every query touching user data must
  be scoped by the session user id. Follow the existing patterns in server actions.
- Seed source data lives in `lib/golden-acres/data`.
- Optional integrations (Stripe, Blob, Resend, MoMo/Hubtel/Arkesel SMS) degrade
  gracefully when their env vars are absent — the core app runs with just
  `DATABASE_URL` + Better Auth vars.
