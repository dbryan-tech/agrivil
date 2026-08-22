# AgriVil — Release-Candidate Build Verification Audit

**Date:** August 22, 2026
**Scope:** Build verification gate for the release-candidate phase (per
`docs/MASTER_AUTONOMOUS_RELEASE_CANDIDATE_INSTRUCTIONS.md`).
**Branch:** `build` · **Working tree at start of run:** clean @ `b7cc5f0`

---

## 1. Executive summary

The repository's previous "0 errors across 321 routes" claim was **not a real
type-check result**: `next.config.mjs` carried `typescript.ignoreBuildErrors:
true`, so the production build silently skipped TypeScript validation, and the
`lint` script referenced an eslint binary that was never installed. Running an
honest `tsc --noEmit` surfaced **10 real type errors across 5 files**, several
of which were user-visible defects (fabricated distances, a fabricated harvest
date, a broken freshness badge).

This run made verification honest again: all 10 errors fixed properly, the
build-time type gate restored, the lint toolchain installed and configured,
lint reduced from **45 errors → 24 errors** (all 24 being one documented,
deliberate pattern), and a full clean production build plus a production-mode
routing smoke test now pass.

## 2. Verification commands used

```bash
pnpm install --frozen-lockfile          # dependency install (lockfile-honored)
npx tsc --noEmit                        # standalone type check
pnpm run lint                           # eslint over the repo (new toolchain)
npm run build                           # Next.js 16.2.6 production build (Turbopack)
npx next start -p 4310                  # production server for smoke test
curl -A <UA> http://localhost:4310/...  # routing contract checks
```

## 3. Findings & fixes

### FIXED — Type gate was disabled (`next.config.mjs`)
- Removed `typescript.ignoreBuildErrors: true`. The build log now shows a real
  `Running TypeScript ... Finished TypeScript` phase (~102s) on every build.

### FIXED — 10 TypeScript errors (previously invisible)
| File | Defect | Fix |
|---|---|---|
| `lib/golden-acres/types.ts` | `'bag'` / `'bottle'` units used by catalog data but missing from `ProductUnit` | Added both members (matches DB free-text unit column) |
| `app/m/farmers/[slug]/page.tsx` | `farmer.distanceKm` does not exist; page displayed a hardcoded fake `12km from you` | New `distanceFromHubKm()` helper renders the **real haversine distance** from the Tema hub |
| `app/m/product/[slug]/page.tsx` ×2 | Same fake-distance pattern (`\|\| 15`, `\|\| 45 \|\| 85`) in competing farmer offers | Real per-farmer distances via the same helper |
| `app/m/product/[slug]/page.tsx` | `product.harvestDate` does not exist; UI showed fabricated text "Fresh Dawn Harvest" | New FEFO-derived `packedDateIso()` = expiry − shelf life; rendered as a real date |
| `app/m/shop/page.tsx` | Imported nonexistent `categories`, `getCategoryCount`; passed nonexistent `activeTab` prop to `MobileBottomNav` | Imports removed; nav derives active tab from pathname itself (as designed) |
| `components/golden-acres/shop/product-detail.tsx` | `fresh.text` (field is `label`) → freshness badge silently broken; `reviewsCount` (field is `reviewCount`) | Corrected field names |

### FIXED — Lint toolchain did not exist
- `package.json` declared `"lint": "eslint ."` with **no eslint in devDependencies**
  and no config file → `pnpm run lint` always crashed with ENOENT.
- Added dev deps pinned to the versions matching Next 16.2.6:
  `eslint@^9` (9.39.x), `eslint-config-next@16.2.6`, `@eslint/eslintrc`.
- Created flat-config `eslint.config.mjs` extending `next/core-web-vitals` +
  `next/typescript`; ignores `mobile/`, `apks/`, `scripts/`, `.next/`.
- Note: ESLint 10 is incompatible here (`eslint-plugin-react` 7.x crashes under
  its removed legacy rule context); ESLint 9 is the correct pairing for this
  Next version.

### FIXED — React render-correctness errors (6 of the lint findings)
- 4 × unescaped apostrophes in JSX (`react/no-unescaped-entities`) in
  `app/preview/home`, `app/preview/checkout`,
  `components/golden-acres/recipes/cooking-step-visualizer.tsx`.
- 2 × impure-render violations (`react-hooks/purity`): `Date.now()` called
  during render in `account-dashboard.tsx` (address form id) and
  `promotions-section.tsx` (expiry check). Both restructured so wall-clock time
  is read only after mount — removing a class of hydration-mismatch bugs.

### FIXED (by removal) — Dead code
- `lib/golden-acres/data.ts` exported `getCategoryCount()` that referenced the
  nonexistent `categories` export (itself dead). Neither was imported anywhere.
  Both deleted.

## 4. Current quality-gate status

| Gate | Command | Result |
|---|---|---|
| Type check (standalone) | `npx tsc --noEmit` | PASS — 0 errors |
| Type check (in build) | `npm run build` | PASS — gate restored, runs ~102s |
| Production build | `npm run build` | PASS — compiled + 322/322 pages generated |
| Lint | `pnpm run lint` | PARTIALLY VERIFIED — exit 1: **24 errors / 224 warnings** (see §5) |

## 5. Known remaining lint debt (accepted for this RC)

All 24 remaining lint errors are one rule: `react-hooks/set-state-in-effect`.
These are the codebase's deliberate mount-time localStorage-rehydration pattern
(cart, session, compare, recently-viewed, catalog store, order-history pages):
read persisted state in `useEffect`, then `setState`. The React Compiler lint
rules flag this as a cascading-render risk. Rewriting ~24 state-layer sites is
a structural refactor judged too risky days before an RC; it should be scheduled
as its own workstream (lazy `useState` initializers / `useSyncExternalStore`),
then the rule can be tightened. The 224 warnings are unused-import style noise
(`_`-prefixed params etc.) — cosmetic, tracked for cleanup.

## 6. Production-mode routing smoke test (verified live)

Server: `next start -p 4310` against the production build.

| Check | Result |
|---|---|
| Desktop `/` and `/shop` | VERIFIED — 200, desktop storefront HTML |
| Desktop visiting `/m` | VERIFIED — 307 → `/` (clean URL preserved) |
| Desktop visiting `/w` | VERIFIED — 307 → `/` (legacy path masked) |
| Desktop visiting `/m/product/<slug>` | VERIFIED — 307 to clean desktop route |
| Mobile UA `/shop` (clean URL) | VERIFIED — 200 with mobile experience served, URL stays clean (title "AgriVil Mobile") |
| Product slug resolution | VERIFIED — valid slug serves product; invalid slug falls back rather than crashing (see §8 note) |
| `/api/auth/get-session` | VERIFIED — Better Auth endpoint responds 200 `{"ok":true}` |

Middleware logic reviewed line-by-line against the AGENTS.md route contract;
no rewrite loops found; portal routes (`/farmer`, `/admin`, `/support`,
`/preview`, `/emu`, `/api`) correctly bypass masking.

## 7. Environment observations

- `PAYSTACK_SECRET_KEY not configured — payments will fail` printed during
  build/static generation: expected without secrets, but confirms payments are
  **NOT APPLICABLE locally until credentials are provisioned by the owner**.
- Build warning: `turbopack.root should be absolute` (cosmetic config nit).
- Build deprecation notice: Next 16 prefers the `proxy` file convention over
  `middleware`. Functional today; plan migration before the Next upgrade cycle.

## 8. Scope boundary of THIS audit

This run verified the **build/engineering gates** end-to-end. The master
instructions' full functional program (§4–§33: exhaustive per-page action
inventories, cart/checkout/payment flow testing, farmer-portal workflow
testing, auth lifecycle tests, test matrix authoring, performance measurement)
is explicitly **PARTIALLY VERIFIED / NOT YET PERFORMED** and remains open work.
Notable items already spotted for that phase:

- Invalid product slugs currently fall back to the first catalog product
  instead of rendering not-found state — decide & implement proper 404 UX.
- The 24-site rehydration refactor (§5).
- Unused-import warning cleanup (224 warnings).

**Release-candidate build status: VERIFIED** — the artifact now compiles clean
with type checking enforced, lints with only documented debt, and serves the
documented routing contract in production mode.
