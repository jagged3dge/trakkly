# Contributing to Trakkly

We welcome contributions! Please follow these guidelines to keep the project maintainable and secure.

## Branching and workflow
- Create feature branches from `dev`: `feature/<short-name>`
- Keep commits small and atomic; use Conventional Commits (e.g., `feat:`, `fix:`, `docs:`)
- Open PRs against `dev`. We promote to `stage` and `main` via release PRs.

## Development
- Requirements: Node 20+
- Start dev server:
  ```bash
  cd app
  npm install
  npm run dev
  ```
- Keep documentation up to date in `docs/` (PLAN, DECISIONS, TODO). Docs-first policy.

## Code style and linting
- TypeScript strict mode.
- ESLint and Prettier (to be added in tooling step). Format before committing.

## Testing
- Add unit tests for core modules (data layer, crypto) and e2e smoke for critical flows.

## Security
- Do not commit secrets. All telemetry keys are configured via env and disabled by default.
- Follow the E2EE design; never log sensitive data.

## Reporting issues
- Use GitHub Issues with a clear reproduction and environment details.
