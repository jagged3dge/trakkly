# Trakkly — Execution TODOs

Legend: [ ] pending, [~] in progress, [x] done

## Planning
- [x] Gather requirements and constraints
- [x] Decide Google Sheets feasibility (not recommended)
- [x] Approve telemetry providers (Sentry, PostHog) as opt-in
- [x] Confirm UI framework (React + Vite + TS + Tailwind)
- [x] Define 4-day milestones
- [x] Approve encryption UX (device unlock default, passcode fallback)
- [x] Create docs: PLAN.md, TODO.md, DECISIONS.md
- [x] Approve hosting plan (GitHub Pages)
- [x] Initialize Git repository and branching (main → stage → dev) and create feature branch

## Day 1 — Foundations
- [x] Repo bootstrap: MIT license, README, contribution guide
- [ ] Tooling: Prettier, ESLint, TypeScript strict
- [~] App scaffold: Vite + React + Tailwind + routing
- [x] Provider/adapter system: interfaces + default implementations (telemetry, sync, crypto, device unlock) + React context
- [x] Tailwind v4 PostCSS plugin setup and error fix
- [ ] PWA: manifest, icons, Workbox service worker
- [~] Data layer: Dexie schema (Tracker, Event, UserPreferences) + migrations
- [ ] Crypto module: Argon2id KDF + AES-GCM; WebAuthn key wrapper; unit tests
- [~] UI skeleton: tracker list, add tracker modal, increment button (persists event)
- [x] CI: GitHub Actions (lint/test/build)
- [ ] Deploy staging and prod with GitHub Pages

## Day 2 — UX & Insights
- [ ] History list per tracker
- [ ] Daily/weekly overview
- [ ] Adjustment flow (delta + reason)
- [ ] Pins/favorites; tag filters
- [ ] Charts: sparkline + daily bar
- [ ] Preferences: timezone/locale/12-24h; a11y options

## Day 3 — Security & PWA polish
- [ ] App lock: device unlock (WebAuthn) + passcode fallback; auto-lock
- [ ] Verify encryption-at-rest; manual inspection + tests
- [ ] Telemetry: providers behind feature flags; settings toggles (all off by default)
- [ ] PWA: installability polish, offline caching tuning

## Day 4 — QA & Release
- [ ] E2E smoke with Playwright
- [ ] Lighthouse audits (perf, a11y, PWA) and fixes
- [ ] Documentation: architecture, encryption, telemetry, sync plan
- [ ] Tag v0.1.0; deploy prod Pages

## Post-MVP
- [ ] Auth + multi-user sync with E2EE (Firestore or alternative)
- [ ] Family sharing with shared space keys
- [ ] Reminders
- [ ] Import/export
- [ ] Notes, durations, numeric values
- [ ] Backdating entries
