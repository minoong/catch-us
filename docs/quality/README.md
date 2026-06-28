# Quality Guide

This directory maps verification rules for agents and humans.

## Toolchain

Use the package manager pinned in the repository root:

```bash
pnpm --version # 11.9.0
node --version # 22.13+ or 24+
```

The root `package.json` declares `packageManager: pnpm@11.9.0` and requires
Node `^22.13.0 || >=24`. pnpm 11 is the project standard; do not downgrade the
workspace to pnpm 9 or 10 when updating dependencies or lockfiles.

In non-interactive agent or CI environments, prefix verification commands with
`CI=true` so pnpm does not wait for terminal confirmation while validating or
recreating `node_modules`.

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

## Environment Variables

Keep runtime env files in the application that consumes them:

- `apps/web/.env.local`
- `apps/admin/.env.local`

Do not use a repo-root `.env` file for app runtime configuration. Keep committed
examples in each app's `.env.example` file.

Supabase client variables currently expected by both apps:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_PROJECT_REF=
```

`turbo.json` declares Supabase-related variables for `build` and `dev`, and
adds package-local `.env*` files to `build.inputs` so environment changes
invalidate the correct package cache.

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
- `eslint-plugin-tailwindcss` is currently on the Tailwind CSS 4 beta path.
  Keep beta-incompatible rules disabled in `packages/eslint-config/tailwind.js`
  until the plugin supports the pinned ESLint/Tailwind versions cleanly.
- The repo root keeps `eslint` as a dev dependency because lint-staged runs
  from the root and needs a root-level `eslint` binary for staged JS/TS files.
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
