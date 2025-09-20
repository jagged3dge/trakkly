# Trakkly

Mobile-only, offline-first PWA to track simple counters with one-tap increments and audit-preserving adjustments. Privacy-first with end-to-end encryption (E2EE) and encryption-at-rest.

- Stack: React + Vite + TypeScript + Tailwind CSS + Dexie (IndexedDB)
- PWA: VitePWA plugin; installable, offline-first shell
- Observability: providers behind opt-in toggles (Sentry, PostHog)
- License: Proprietary (All rights reserved)

## Monorepo layout

- `app/` — Vite React app (PWA)
- `docs/` — Planning and architecture docs (`PLAN.md`, `DECISIONS.md`, `TODO.md`)

## Getting started

Requirements: Node 20+

```bash
cd app
npm install
npm run dev
```

Open http://localhost:5173

## Scripts

In `app/`:
- `npm run dev` — Start Vite dev server
- `npm run build` — Type-check and build for production
- `npm run preview` — Preview production build

## Branching strategy

We use three long-lived branches and short-lived feature branches:

- `main` — Production
- `stage` — Staging
- `dev` — Integration
- `feature/<name>` — Work branches off `dev`

See `docs/DECISIONS.md` (ADR-0007) for details.

## Contributing

- Use Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, etc.
- Prefer small, atomic commits and PRs.
- Keep docs updated as you work (docs-first policy).

See `CONTRIBUTING.md` for more.
