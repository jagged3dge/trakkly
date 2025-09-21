# Day 2 Release Notes — UX, Insights, Preferences

## Summary
This PR promotes Day 2 work into `dev`: user-facing UX improvements, Insights visualizations, Preferences with persistence, and a comprehensive test suite update. CI policy and governance docs were also refined.

## Highlights
- Pins & Filters (Trackers)
  - Pin/unpin trackers, sort pinned-first > recent > name
  - Pinned-only quick filter and tag-based filter
  - Tracker count in list header
- Insights
  - Today card with minimal inline SVG sparkline (hourly bins)
  - Week overview bar chart (Mon–Sun)
  - Last 7 days bar chart (sliding window)
- Preferences
  - Dexie-backed preferences store
  - Region: timezone override, locale override
  - Clock format: 12h / 24h
  - Accessibility: reduced motion, high contrast
  - Privacy: Telemetry opt-in (wired to telemetry adapter)
- Tests
  - Unit tests for insights utilities
  - Store tests (increment/adjust/togglePin, prefs load/save, telemetryEnabled)
  - Component tests for TrackerList (pin toggle + tag filter)
- CI & Governance
  - CI runs only on PRs targeting `main`
  - CODEOWNERS added; CONTRIBUTING updated with branch protections

## Technical Details
- Data/store
  - `app/src/state/store.ts`: add `togglePin(trackerId, pinned?)`
  - `app/src/state/prefs.ts`: preferences store (timezone, locale, clockFormat, a11y, telemetryEnabled)
- UI
  - `app/src/components/TrackerList.tsx`: pin/unpin, filters, count, sorting
  - `app/src/pages/Insights.tsx`: sparkline (Today), weekly bars, last 7 days bars
  - `app/src/pages/Preferences.tsx`: region, clock, a11y, privacy sections
  - `app/src/router.tsx`: add `/prefs` route and navigation link
- Insights utils
  - `app/src/lib/insights.ts`: eventsForToday/week, totalsByDayInWeek, totalsByLastNDays, sparkline path builder
- Telemetry wiring
  - `app/src/providers/AdaptersProvider.tsx`: enable telemetry based on env && prefs.telemetryEnabled
  - `app/src/config/env.ts`: telemetry keys and default disabled
- Tests
  - `app/src/lib/insights.test.ts`, `app/src/state/store.test.ts`, `app/src/state/prefs.test.ts`, `app/src/components/TrackerList.test.tsx`

## How to Test
- Unit/Component tests
  - From `app/`: `npm ci && npm run test -- --run` (Vitest)
- Manual
  - Trackers: create a few with tags, pin/unpin, use pinned-only and tag filter
  - Insights: verify Today sparkline, Week overview bars, Last 7 days bars update after increments/adjustments
  - Preferences: set locale/timezone/clock format and a11y toggles; toggle telemetry opt-in; refresh and verify persistence

## CI / Governance
- CI will not run for this PR (base is `dev`), by design: Actions trigger only for PRs to `main`.
- Branch protection: PR + status checks enforced on `main`, PR required (checks optional) on `stage`, relaxed on `dev` for solo mode.

## Backwards Compatibility
- No breaking changes. Preferences table existed since v1 schema; telemetryEnabled field is optional.

## Release Impact
- Risk: Low
- Scope: UX improvements, insights visualizations, prefs, tests

## Next (Day 3)
- Crypto module: Argon2id KDF + AES-GCM primitives and tests
- App lock: WebAuthn platform authenticator + passcode fallback, auto-lock
- Telemetry provider stubs behind feature flags
