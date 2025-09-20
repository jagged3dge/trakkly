# Trakkly — MVP Plan (v0.1.0)

## Objective
Mobile-first, offline-first PWA to track simple counters with one-tap increments and audit-preserving adjustments. Privacy-first with end-to-end encryption (E2EE) and encryption-at-rest.

## Scope (MVP)
- Create tracker: name, color, icon, tags, step size, pin/favorite.
- Increment: one-tap, customizable step size.
- Adjustments: add positive/negative delta with optional reason; append-only audit trail.
- History & insights: per-tracker event list; daily/weekly overview; basic charts (sparkline + daily bars).
- Preferences: timezone override, locale override, 12/24h clock, accessibility options.
- Security: E2EE at rest; app lock with device unlock (WebAuthn platform authenticator) with passcode fallback.
- PWA: installable, offline-capable, fast.

## Non-goals (MVP)
- No authentication or multi-user sync.
- No reminders.
- No data import/export.
- No backdated entries (will come later as a feature).

## Users & Platforms
- Platform: mobile-only PWA (works on modern mobile browsers).
- MVP users: ~50. Post-MVP: 5000+.

## UX & Key Interactions
- Big increment button on tracker cards; haptic feedback where supported.
- Adjustment flow is a modal: +/- value, optional reason.
- Quick filters: pinned, tags; sort by pinned > recent activity > name.
- Accessibility: WCAG AA color contrast; large touch targets; keyboard/focus visible; reduced motion option.

## Data Model
- Tracker
  - `id`, `name`, `color`, `icon`, `tags[]`, `stepSize`, `pinned`, `createdAt`, `updatedAt`
- Event (append-only)
  - `id`, `trackerId`, `type: "increment" | "adjustment"`, `value`, `reason?`, `createdAt`, `deviceId`
- UserPreferences
  - `id`, `timezone?`, `locale?`, `clockFormat`, `a11yPrefs`

Derived totals and charts are computed from `Event` log; no destructive edits.

## Security & Encryption
- App lock
  - Default: device unlock (WebAuthn platform authenticator) used to protect the encryption key ("passwordless unlock").
  - Fallback: user passcode; derive master key via Argon2id; store only salt + params.
- Encryption
  - AES-GCM 256 via WebCrypto; random IV per object; nonces never reused.
  - Master key held in memory post-unlock; optional auto-lock after inactivity.

## Offline-First Architecture
- Storage: IndexedDB via Dexie.js with versioned schema migrations.
- Event-sourced model for conflict-free merging in the future sync phase.
- PWA caching: Workbox; precache shell; runtime caching for static assets.

## Performance Targets (MVP)
- Cold start < 2s on mid-range mobile.
- Increment action to persisted event < 50ms median.
- Smooth 60fps interactions; avoid main-thread stalls.

## Observability (Opt-in)
- Crash reporting: Sentry (disabled by default; user opt-in toggle).
- Product analytics: PostHog (disabled by default; no PII; minimal event schema).
- All telemetry keys empty by default; feature flags guard providers.

## Environments & Releases
- Environments: dev, staging, prod.
- Hosting: GitHub Pages (0-cost) for PWA builds.
- CI/CD: GitHub Actions for lint/test/build; deploy `staging` branch to staging URL, `main` to prod.

## Milestones (4 days)
- Day 1 — Foundations
  - Repo bootstrap (Proprietary license, README). Vite + React + TS + Tailwind + PWA scaffold.
  - Dexie schema for `Tracker`, `Event`, `UserPreferences` + migrations.
  - Crypto module (Argon2id + AES-GCM) and WebAuthn wrapper; unit tests.
  - UI skeleton: list, add tracker, increment button (writes event).
  - CI and Pages staging deployment.
- Day 2 — UX & Insights
  - History views, daily/weekly overview, adjustments flow.
  - Pins/tags, filters, basic charts.
  - Preferences and accessibility refinements.
- Day 3 — Security & PWA polish
  - App lock (device unlock + passcode fallback), auto-lock.
  - Verify at-rest encryption; telemetry toggles; PWA install polish.
- Day 4 — QA & Release
  - E2E smoke (Playwright), Lighthouse a11y/perf/PWA.
  - Docs: architecture, encryption, telemetry, sync plan.
  - Tag v0.1.0; deploy prod.

## Future Roadmap (Post-MVP)
- Auth + multi-device sync (E2EE) and family sharing with shared-space keys.
- Reminders, import/export, notes, durations, numeric values.
- Backdating entries, keyboard shortcuts, CSV export.
