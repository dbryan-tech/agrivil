# Gar AI Labs — Reference Archive

This folder is a **self-contained reference archive** of the Gar AI Labs project
(non-ergodic predictive intelligence site). It is **not part of the live Golden
Acres build** — it is excluded from TypeScript checking and Next.js routing via
the `"gar-ai-labs"` entry in `tsconfig.json`'s `exclude` array.

Golden Acres is the main, active application. These files are kept only as a
reusable design/pattern reference (the `/v2` divergence-lab design system,
logo-based 3D, rounded-bold UI type, real section flow, etc.).

## Contents

- `app/`        — original route pages (`gar`, `v2`, `v3`, `founder`)
- `components/` — `company/`, `founder/`, `v2/`, `v3/`, `github-icon.tsx`
- `lib/`        — `trajectories.ts`
- `assets/`     — all Gar imagery (`gar-*.png`, `divergence-hero.png`,
  `founder-portrait.jpeg`, `trajectory-field.png`, `stock/`)

## Import paths

The moved files keep their **original** `@/...` import paths (e.g.
`@/components/company/hero`). They resolve against the repo root, so they are
only valid if the folders are restored to their original locations.

## To restore as live routes

1. Move `app/*` back to the repo's `app/` directory.
2. Move `components/*` back to the repo's `components/` directory.
3. Move `lib/trajectories.ts` back to the repo's `lib/`.
4. Move `assets/*` back into `public/`.
5. Remove `"gar-ai-labs"` from `tsconfig.json` `exclude`.
