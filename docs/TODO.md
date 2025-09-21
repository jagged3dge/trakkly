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
- [x] Tooling: Prettier configured (format/format:check)
- [x] App scaffold: Vite + React + Tailwind + routing (NotFound added)
- [x] Provider/adapter system: interfaces + default implementations (telemetry, sync, crypto, device unlock) + React context
- [x] Tailwind v4 PostCSS plugin setup and error fix
- [x] PWA: manifest + icons (VitePWA)
- [x] Data layer: Dexie schema (Tracker, Event, UserPreferences) + initial versioned DB
- [ ] Crypto module: Argon2id KDF + AES-GCM; WebAuthn key wrapper; unit tests
- [x] UI skeleton: tracker list, add tracker modal, increment button (persists event)
- [x] CI: GitHub Actions (lint/test/build)
- [x] Deploy staging and prod with GitHub Pages (enabled; stage/main deployed)

## Day 2 — UX & Insights
- [x] History list per tracker
- [~] Daily/weekly overview
- [x] Adjustment flow (delta + reason)
- [x] Testing setup: Vitest + Testing Library; initial tests for store/utils/components
- [x] Pins/favorites; tag filters (pin/unpin + pinned-only and tag filter)
- [x] Charts: sparkline + daily bar (weekly bar + sparkline complete; last 7 days bar added)
- [x] Preferences: timezone/locale/12-24h; a11y options

## Day 3 — Security & PWA polish
- [x] App lock: passcode fallback + auto-lock; device unlock (WebAuthn) [beta]
- [ ] Verify encryption-at-rest; manual inspection + tests
- [~] Telemetry: settings toggles in Preferences; providers behind feature flags (pending)
- [ ] PWA: installability polish, offline caching tuning
- [x] Change passcode (unwrap + rewrap master key)

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
