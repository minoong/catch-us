# Shared Lint, Format, and Git Hooks Design

## Goal

Create reusable ESLint and Prettier configuration packages for every app and
internal package in the monorepo. The defaults should follow current official
recommendations, catch high-value correctness issues, remain easy to extend,
and provide stable command contracts for future GitHub Actions.

This change also installs Husky now, so local commits and pushes enforce the
same commands that CI can use later.

## Principles

- ESLint owns correctness and code-quality rules.
- Prettier owns formatting and Tailwind CSS class ordering.
- Shared configuration packages own the plugins they use.
- Consumer configuration files stay thin and select one purpose-built export.
- TypeScript source files use type-aware linting.
- Official stable presets are preferred over large custom rule collections.
- Tailwind CSS v4 linting uses an explicitly pinned prerelease and is verified
  against the repository before adoption.

## Package Architecture

### `@repo/eslint-config`

The existing package is expanded into composable Flat Config exports:

- `@repo/eslint-config/base`
  - ESLint recommended JavaScript rules
  - Turbo environment-variable checks
  - Import correctness checks
  - Shared global ignores and unused-disable reporting
- `@repo/eslint-config/typescript`
  - Base rules
  - `typescript-eslint` recommended type-checked rules
  - `typescript-eslint` stylistic type-checked rules
  - `parserOptions.projectService: true`
  - Type-aware rules disabled for JavaScript configuration files
- `@repo/eslint-config/tailwind`
  - `eslint-plugin-tailwindcss@4.0.0-beta.0`
  - Tailwind v4-compatible recommended rules
  - `classnames-order` disabled because the official Prettier plugin owns
    ordering
  - Any rule disabled due to a verified false positive must include a short
    reason in the configuration
- `@repo/eslint-config/react`
  - TypeScript rules
  - React Hooks recommended rules
  - JSX accessibility recommended rules
  - Tailwind rules
- `@repo/eslint-config/next`
  - React rules
  - `eslint-config-next/core-web-vitals`
  - `eslint-config-next/typescript`
  - Next.js default ignores

The package's plugin and parser dependencies are regular `dependencies`, as
recommended for ESLint shareable configurations. ESLint remains a peer and
development dependency so consumers use one compatible runtime.

Future test tooling will add independent exports rather than widening the
current presets:

- `@repo/eslint-config/vitest`
- `@repo/eslint-config/storybook`
- `@repo/eslint-config/playwright`

### `@repo/prettier-config`

A new private workspace package exports one Prettier configuration:

- Keep Prettier defaults wherever possible.
- Set `endOfLine: "lf"`.
- Load the official `prettier-plugin-tailwindcss`.
- Own the Tailwind plugin as a package dependency.
- Declare Prettier as a peer and development dependency.

The Tailwind Prettier plugin is the only class-ordering authority. ESLint does
not duplicate that responsibility.

## Consumer Mapping

- `apps/admin` and `apps/web` use `@repo/eslint-config/next`.
- `packages/ui` uses `@repo/eslint-config/react`.
- `packages/auth`, `packages/core`, and `packages/db` use
  `@repo/eslint-config/typescript`.
- Configuration packages use a small package-local ESLint configuration based
  on `@repo/eslint-config/base` without creating a circular dependency.
- Every app and package references `@repo/prettier-config`.

Consumer `eslint.config.js` files only import and export the selected shared
configuration. Package-specific exceptions may be appended locally, but the
initial migration should not introduce any without a demonstrated need.

## Commands and Turborepo Tasks

Every app and package provides:

- `lint`: `eslint . --max-warnings 0`
- `lint:fix`: `eslint . --fix --max-warnings 0`
- `format`: `prettier . --write`
- `format:check`: `prettier . --check`
- `check-types`: unchanged where it already exists

The root package delegates package work through Turborepo:

- `lint`
- `lint:fix`
- `format`
- `format:check`
- `check-types`
- `build`

`lint:fix` and `format` modify files, so their Turbo cache is disabled.
`lint`, `format:check`, and `check-types` use transit nodes so packages can run
in parallel while dependency source changes still invalidate caches.

Root-level files are handled with explicit Turborepo root tasks:

- `//#format`
- `//#format:check`

These tasks cover root configuration and documentation without running one
repository-wide Prettier command that bypasses package-level parallelism.

Generated files, dependency directories, build output, caches, worktrees,
agent files, and `pnpm-lock.yaml` are excluded through `.prettierignore`.

## Husky and lint-staged

The root package owns `husky`, `lint-staged`, and `prettier`.

The root `prepare` script runs Husky's supported installation command. Future
CI can set `HUSKY=0` to skip hook installation.

### Pre-commit

`lint-staged` processes only staged files:

- JavaScript and TypeScript:
  - `eslint --fix`
  - `prettier --write`
- JSON, JSON5, YAML, CSS, Markdown, MDX, and HTML:
  - `prettier --write`

Generated files and `pnpm-lock.yaml` remain excluded. The hook updates staged
content through lint-staged's normal behavior.

### Pre-push

The hook runs:

1. `pnpm lint`
2. `pnpm check-types`

Builds remain a future CI responsibility because two Next.js production builds
would make every push unnecessarily slow. Vitest can join pre-push after it is
introduced. Storybook and Playwright remain CI-only due to their runtime cost.

Commit message validation, Conventional Commits, PR title validation, squash
merge policy, and GitHub Actions are explicitly outside this change.

## Verification

Implementation is complete only when all of the following pass:

1. Every ESLint and Prettier shared export can be imported.
2. A TypeScript fixture with an unsafe Promise pattern fails typed linting.
3. React Hooks and JSX accessibility fixtures fail their corresponding rules.
4. Tailwind duplicate or conflicting class fixtures are evaluated by the v4
   beta plugin.
5. Tailwind class ordering is changed by Prettier, not ESLint.
6. `pnpm lint`
7. `pnpm check-types`
8. `pnpm format:check`
9. `pnpm build`
10. `lint:fix` and `format` are idempotent.
11. The pre-commit hook rejects or fixes an intentionally invalid staged file.
12. The pre-push hook runs the complete lint and type-check commands.

If a Tailwind beta rule produces a repository-confirmed false positive, that
rule may be disabled individually. The implementation must document the exact
rule and preserve all other viable recommended rules.

## Official References

- Prettier configuration:
  https://prettier.io/docs/configuration
- Prettier shareable configurations:
  https://prettier.io/docs/sharing-configurations
- ESLint Flat Config:
  https://eslint.org/docs/latest/use/configure/configuration-files
- ESLint shareable configurations:
  https://eslint.org/docs/latest/extend/shareable-configs
- Next.js ESLint configuration:
  https://nextjs.org/docs/app/api-reference/config/eslint
- Type-aware TypeScript linting:
  https://typescript-eslint.io/getting-started/typed-linting/
- Tailwind CSS editor and Prettier setup:
  https://tailwindcss.com/docs/editor-setup
- Tailwind CSS ESLint v4 support:
  https://github.com/francoismassart/eslint-plugin-tailwindcss#about-tailwind-css-4-support
- Husky setup:
  https://typicode.github.io/husky/get-started.html
- Husky operational guidance:
  https://typicode.github.io/husky/how-to.html
