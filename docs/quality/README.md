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

For app screens with responsive or animated UI, also do a browser pass on the
changed route. At minimum check:

- the route loads without current console errors
- mobile and desktop widths do not create horizontal overflow
- essential headings and controls are readable in the DOM
- decorative animation does not block the page when reduced motion is preferred

For admin dashboard navigation work, verify at least one dashboard route and
one nested section route. Check that:

- the sidebar navigation is present
- the active menu item exposes `aria-current="page"`
- the header breadcrumb/title follows the current route
- mobile sidebar interactions still close after route navigation

## Existing Tooling

- ESLint shared configs live in `packages/eslint-config`.
- Prettier shared config lives in `packages/prettier-config`.
- Husky runs lint-staged on pre-commit.
- Husky runs `pnpm lint` and `pnpm check-types` on pre-push.
- Storybook documents shared UI components in `packages/ui`.
- Playwright MCP may be used for local browser verification, but it is not yet
  an enforced E2E test suite.

## Planned Tooling

Add focused docs when these tools are introduced:

- `docs/quality/vitest.md` for unit and component test conventions.
- `docs/quality/playwright.md` for E2E and browser verification conventions.
- `docs/quality/ci.md` for GitHub Actions checks and required status policy.

Codex hooks should be added later, after CI, Vitest, Playwright, or heavier
automated verification workflows exist. Hooks should enforce high-signal checks
without making ordinary local work noisy.
