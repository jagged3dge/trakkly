# Trakkly — Decision Log (ADR)

## ADR-0001: Architecture & Stack
- Status: Accepted
- Context: Mobile-only, offline-first, 0-cost.
- Decision: PWA with React + Vite + TypeScript + Tailwind; IndexedDB (Dexie) for storage; Workbox for PWA.
- Consequences: Fast iteration; later add sync via storage adapter; no native APIs beyond PWA.

## ADR-0002: Security & Encryption UX
- Status: Accepted
- Context: E2EE mandatory; user wants device unlock as app lock; passwordless acceptable.
- Decision: Default to device unlock (WebAuthn platform authenticator) to gate access to the master encryption key (hardware-bound). Provide passcode fallback (Argon2id -> AES-GCM master key). Auto-lock after inactivity (default 5 minutes) and on app background. Quick Unlock enabled by default where supported, with user toggle in Settings.
- Consequences: Strong UX with minimal friction; works offline; fallback covers devices lacking WebAuthn. Implementation complexity moderate.

## ADR-0003: Backend for MVP
- Status: Accepted
- Context: 0-cost, offline-first, <10s eventual consistency, mergeable increments.
- Decision: No backend in MVP. Do not use Google Apps Script/Sheets. Plan E2EE sync post-MVP using Firestore (or OSS alt) with event-log/CRDT.
- Consequences: Faster MVP; clean separation to add sync later.

## ADR-0004: Telemetry Policy
- Status: Accepted
- Context: Privacy-preserving analytics and crash reporting desired; opt-in.
- Decision: Integrate Sentry and PostHog providers behind feature flags; OFF by default; no PII; redact names by default.
- Consequences: Observability when opted-in; zero data sent otherwise.

## ADR-0005: Hosting & Environments
- Status: Accepted
- Context: 0-cost hosting and simple environments (dev/staging/prod).
- Decision: Host PWA on GitHub Pages. Use branches or environments for staging and prod. CI/CD with GitHub Actions.
- Consequences: Zero hosting cost; static deploys; no server required.

## ADR-0006: Provider/Adapter Architecture
- Status: Accepted
- Context: We will integrate multiple third-party providers (telemetry, sync, crypto, device unlock) over time and want easy swapping.
- Decision: Define TypeScript interfaces per concern and provide default no-op/local implementations. Use a React `AdaptersProvider` context to inject adapters app-wide and load env config from `src/config/env.ts`. Current adapters: `TelemetryAdapter` (Noop default), `SyncAdapter` (LocalOnly default), `CryptoEngine` (Placeholder), `DeviceUnlockAdapter` (Noop). Factories can later return Sentry/PostHog/Firestore etc.
- Consequences: Clear seams for future integrations; enables unit testing via adapter mocks; minimal initial complexity.

## ADR-0007: Version Control & Branching Strategy
- Status: Accepted
- Context: We want a predictable Git workflow with environments and feature isolation.
- Decision: Initialize Git with three long-lived branches: `main` (prod), `stage` (staging), `dev` (integration). Develop via `feature/<name>` branches off `dev`. Use Conventional Commits (e.g., `feat:`, `fix:`, `docs:`, `build:`) and small atomic commits. Merge via PRs into `dev`, then promote to `stage` and `main`.
- Consequences: Clear promotion path across environments; encourages clean history and release notes.

## ADR-0008: Licensing Policy
- Status: Accepted
- Context: We initially planned MIT, but the project will be private and proprietary for now.
- Decision: Use a Proprietary, all-rights-reserved license. Source code is not licensed for public reuse or distribution. Licensing terms may be revisited before public release.
- Consequences: Private repository; contributors require explicit permission; update documentation and headers accordingly.
