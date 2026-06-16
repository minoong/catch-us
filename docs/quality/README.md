# Quality Guide

This directory maps verification rules for agents and humans.

## Current Gates

Use these commands before opening a PR that changes code or tooling:

```bash
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm check-types
pnpm build
git diff --check
```

For shared UI or Storybook changes, also run:

```bash
pnpm build-storybook
```

For local visual inspection of shared UI:

```bash
pnpm storybook
```

## Existing Tooling

- ESLint shared configs live in `packages/eslint-config`.
- Prettier shared config lives in `packages/prettier-config`.
- Husky runs lint-staged on pre-commit.
- Husky runs `pnpm lint` and `pnpm check-types` on pre-push.
- Storybook documents shared UI components in `packages/ui`.

## Planned Tooling

Add focused docs when these tools are introduced:

- `docs/quality/vitest.md` for unit and component test conventions.
- `docs/quality/playwright.md` for E2E and browser verification conventions.
- `docs/quality/ci.md` for GitHub Actions checks and required status policy.

Codex hooks should be added later, after CI, Vitest, Playwright, or heavier
automated verification workflows exist. Hooks should enforce high-signal checks
without making ordinary local work noisy.
