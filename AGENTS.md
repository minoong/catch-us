# Catch Us Agent Guide

This file is the entry map for coding agents working in this repository. Keep it
short. Put durable detail in `docs/` and link to it from here.

## Working Agreements

- Write user-facing summaries, PR titles, and PR bodies in Korean.
- Use `pnpm` only. Do not introduce npm, yarn, or bun lockfiles.
- Treat untracked user files as user-owned. Do not remove or stage them unless
  the user explicitly asks.
- Do not run destructive commands such as `git reset --hard`, force push, or
  recursive delete without explicit user approval.
- Prefer small, reviewable branches and commits.
- When a change adds a durable tool, dependency, verification step, or project
  convention, update the relevant `docs/` page or add a decision record in the
  same branch.

## Repository Map

- Architecture overview: `docs/architecture.md`
- Frontend and design-system map: `docs/frontend/README.md`
- Quality and verification map: `docs/quality/README.md`
- Decision records: `docs/decisions/README.md`
- Existing implementation plans and specs: `docs/superpowers/`

## Project Shape

- `apps/web`: user-facing Next.js app
- `apps/admin`: admin Next.js app
- `packages/ui`: shared UI components, styles, and Storybook
- `packages/auth`: auth boundary
- `packages/core`: shared domain boundary
- `packages/db`: database access boundary
- `packages/eslint-config`: shared ESLint flat configs
- `packages/prettier-config`: shared Prettier config
- `packages/typescript-config`: shared TypeScript configs

## Verification

Run the narrowest useful checks while iterating, then run the full relevant
gate before committing or opening a PR.

- General code changes: `pnpm format:check`, `pnpm lint`, `pnpm check-types`
- App or build changes: also run `pnpm build`
- Shared UI or Storybook changes: also run `pnpm build-storybook`
- Dependency changes: run `pnpm install --frozen-lockfile`
- Before final status claims: run `git diff --check`

## Next.js

Before Next.js-specific work, prefer the installed version-matched docs over
memory or generic web examples.

With pnpm, the docs live under:

```text
node_modules/.pnpm/next@*/node_modules/next/dist/docs/
```

Use `find node_modules/.pnpm -path '*next*/node_modules/next/dist/docs/index.md'`
when the exact package path is needed.

## Storybook

Shared UI components should have stories when it helps reviewers or future
agents understand variants. Run `pnpm storybook` for local inspection and
`pnpm build-storybook` before shipping Storybook changes.

## Motion And Visual Effects

App-specific hero or marketing effects can live in the owning app. Shared,
reusable primitives should move to `packages/ui` with Storybook coverage. See
`docs/frontend/README.md` and decision records for current motion guidance.

## Planned Harness Growth

- Add GitHub Actions CI after the local verification contract is stable.
- Add Vitest docs and rules when unit tests are introduced.
- Add Playwright docs and rules when E2E tests are introduced.
- Add Codex hooks later, when CI, Vitest, Playwright, or heavier automated
  verification workflows make the hook behavior worth the extra friction.
