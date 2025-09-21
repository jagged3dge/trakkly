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
- `npm run format` — Format source with Prettier
- `npm run format:check` — Check formatting
- `npm run test` — Run tests (Vitest)
- `npm run test:watch` — Watch mode
- `npm run test:coverage` — Coverage with v8

## Deployment (GitHub Pages)

We deploy from GitHub Actions using Pages (works for private repos; the site itself is public). The workflow is in `.github/workflows/pages.yml` and runs on pushes to `main` and `stage`, and on PRs targeting `main`.

How it works:
- The Vite config (`app/vite.config.ts`) uses `base: process.env.BASE_PATH || '/'` so assets resolve under `/<repo>/` when deployed to Pages.
- The Pages workflow sets `BASE_PATH="/${{ github.event.repository.name }}/"` for builds and copies `404.html` for client-side routing.

Steps to enable:
1. In GitHub repo Settings → Pages, set Source: GitHub Actions.
2. Push to `stage` (staging URL) or `main` (prod URL) and wait for the Pages workflow to complete.
3. The deployed URL will be printed in the Actions run summary (environment `github-pages`).

## Branching & CI

- Long-lived branches: `dev` (integration), `stage` (staging), `main` (production).
- Work on `feature/<name>` branches off `dev`.
- CI (lint/test/build) runs on pull requests targeting `main` only (stage → main promotions).
- Maintainers may push directly to `dev` in solo mode; `stage` and `main` require PRs and CODEOWNERS review.

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
