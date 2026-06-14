# Shared Lint, Format, and Git Hooks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> `superpowers:subagent-driven-development` (recommended) or
> `superpowers:executing-plans` to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build reusable ESLint and Prettier workspace packages, migrate every
app and package to them, and enforce staged-file and pre-push checks with Husky.

**Architecture:** Expand `@repo/eslint-config` into layered Flat Config exports
and add `@repo/prettier-config` as the single formatting policy. Package tasks
remain independently cacheable through Turborepo, while explicit root tasks
format repository-level files. Husky delegates staged files to lint-staged and
uses the same root lint and type-check commands intended for future CI.

**Tech Stack:** ESLint 10, typescript-eslint, eslint-config-next, React Hooks,
jsx-a11y, import-x, eslint-plugin-tailwindcss 4 beta, Prettier 3,
prettier-plugin-tailwindcss, Turborepo, Husky, lint-staged, pnpm

---

## File Map

### Shared ESLint

- Modify `packages/eslint-config/package.json`: exports and plugin ownership
- Modify `packages/eslint-config/base.js`: JavaScript, Turbo, import, ignores
- Create `packages/eslint-config/typescript.js`: typed TypeScript policy
- Create `packages/eslint-config/tailwind.js`: Tailwind v4 beta policy
- Create `packages/eslint-config/react.js`: Hooks and accessibility composition
- Modify `packages/eslint-config/next.js`: official Next.js composition
- Delete `packages/eslint-config/react-internal.js`: replaced by `react.js`
- Create `packages/eslint-config/eslint.config.js`: package self-linting

### Shared Prettier

- Create `packages/prettier-config/package.json`: shared package metadata
- Create `packages/prettier-config/index.js`: formatting policy
- Create `packages/prettier-config/eslint.config.js`: package self-linting

### Consumers

- Modify all `apps/*/eslint.config.js` and `packages/*/eslint.config.js`
- Modify all app and package `package.json` files
- Create `.prettierignore`
- Modify root `package.json`
- Modify `turbo.json`
- Modify `pnpm-lock.yaml` through pnpm

### Git Hooks

- Create `.husky/pre-commit`
- Create `.husky/pre-push`

### Verification Fixtures

- Create temporary fixtures under `/tmp/catch-us-lint-fixtures`; do not commit
  fixtures that intentionally fail lint.

## Task 1: Establish the ESLint Package Contract

**Files:**

- Modify: `packages/eslint-config/package.json`
- Modify: `packages/eslint-config/base.js`
- Create: `packages/eslint-config/typescript.js`
- Create: `packages/eslint-config/eslint.config.js`

- [ ] **Step 1: Record the current import failure**

Run:

```bash
node -e "import('@repo/eslint-config/typescript')"
```

Expected: FAIL with `ERR_PACKAGE_PATH_NOT_EXPORTED`.

- [ ] **Step 2: Install shared ESLint dependencies**

Run:

```bash
pnpm --filter @repo/eslint-config add \
  @eslint/js@10.0.1 \
  eslint-config-prettier@10.1.8 \
  eslint-plugin-import-x@4.16.2 \
  eslint-plugin-turbo@2.9.18 \
  globals@17.6.0 \
  typescript-eslint@8.61.0

pnpm --filter @repo/eslint-config add -D \
  eslint@10.5.0 \
  typescript@6.0.3
```

Expected: package manifest and lockfile update without peer dependency errors.
Move plugin packages used at runtime into `dependencies` if pnpm records them in
another section. Add:

```json
"peerDependencies": {
  "eslint": ">=10 <11"
}
```

- [ ] **Step 3: Define package exports**

Set the exports in `packages/eslint-config/package.json`:

```json
{
  "./base": "./base.js",
  "./typescript": "./typescript.js",
  "./tailwind": "./tailwind.js",
  "./react": "./react.js",
  "./next": "./next.js"
}
```

- [ ] **Step 4: Implement the base Flat Config**

Use `defineConfig` and `globalIgnores` from `eslint/config`. The exported
`baseConfig` must:

```js
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import importX from "eslint-plugin-import-x";
import turbo from "eslint-plugin-turbo";
import { defineConfig, globalIgnores } from "eslint/config";

export const baseConfig = defineConfig([
  globalIgnores([
    "**/.next/**",
    "**/.turbo/**",
    "**/coverage/**",
    "**/dist/**",
    "**/node_modules/**",
  ]),
  eslint.configs.recommended,
  importX.flatConfigs.recommended,
  {
    plugins: { turbo },
    linterOptions: {
      reportUnusedDisableDirectives: "error",
      reportUnusedInlineConfigs: "error",
    },
    rules: {
      "import-x/first": "error",
      "import-x/no-duplicates": "error",
      "turbo/no-undeclared-env-vars": "error",
    },
  },
  eslintConfigPrettier,
]);
```

If `import-x/no-unresolved` fails on TypeScript workspace exports during
verification, disable only that resolver-dependent rule and retain the other
import correctness rules.

- [ ] **Step 5: Implement typed TypeScript linting**

Export `typescriptConfig` from `typescript.js` using:

```js
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import { baseConfig } from "./base.js";

export const typescriptConfig = defineConfig([
  ...baseConfig,
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    extends: [tseslint.configs.disableTypeChecked],
  },
]);
```

- [ ] **Step 6: Add self-linting and verify exports**

`packages/eslint-config/eslint.config.js`:

```js
import { baseConfig } from "./base.js";

export default baseConfig;
```

Run:

```bash
node -e "Promise.all([
  import('@repo/eslint-config/base'),
  import('@repo/eslint-config/typescript')
]).then(([base, ts]) => {
  if (!Array.isArray(base.baseConfig) || !Array.isArray(ts.typescriptConfig)) {
    process.exit(1)
  }
})"
```

Expected: exit code 0.

- [ ] **Step 7: Commit the ESLint foundation**

```bash
git add packages/eslint-config/package.json \
  packages/eslint-config/base.js \
  packages/eslint-config/typescript.js \
  packages/eslint-config/eslint.config.js \
  pnpm-lock.yaml
git commit -m "build: add typed shared eslint foundation"
```

## Task 2: Add Tailwind, React, and Next.js Presets

**Files:**

- Create: `packages/eslint-config/tailwind.js`
- Create: `packages/eslint-config/react.js`
- Modify: `packages/eslint-config/next.js`
- Delete: `packages/eslint-config/react-internal.js`
- Modify: `packages/eslint-config/package.json`

- [ ] **Step 1: Record missing preset imports**

Run:

```bash
node -e "Promise.all([
  import('@repo/eslint-config/tailwind'),
  import('@repo/eslint-config/react')
])"
```

Expected: FAIL because files do not exist.

- [ ] **Step 2: Install framework plugins**

Run:

```bash
pnpm --filter @repo/eslint-config add \
  eslint-config-next@16.2.9 \
  eslint-plugin-jsx-a11y@6.10.2 \
  eslint-plugin-react-hooks@7.1.1 \
  eslint-plugin-tailwindcss@4.0.0-beta.0
```

Expected: Tailwind peer dependency resolves to Tailwind CSS 4.

- [ ] **Step 3: Implement the Tailwind preset**

Export `tailwindConfig` from `tailwind.js`:

```js
import tailwind from "eslint-plugin-tailwindcss";
import { defineConfig } from "eslint/config";

export const tailwindConfig = defineConfig([
  ...tailwind.configs["flat/recommended"],
  {
    rules: {
      "tailwindcss/classnames-order": "off",
    },
    settings: {
      tailwindcss: {
        callees: ["classnames", "clsx", "cn", "ctl"],
      },
    },
  },
]);
```

Only add additional disabled rules after a fixture or repository lint proves a
Tailwind v4 false positive.

- [ ] **Step 4: Implement the React preset**

Export `reactConfig` by composing:

```js
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import globals from "globals";
import { tailwindConfig } from "./tailwind.js";
import { typescriptConfig } from "./typescript.js";

export const reactConfig = defineConfig([
  ...typescriptConfig,
  {
    files: ["**/*.{jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
      },
    },
    plugins: {
      "jsx-a11y": jsxA11y,
      "react-hooks": reactHooks,
    },
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      ...reactHooks.configs.flat.recommended.rules,
    },
  },
  ...tailwindConfig,
]);
```

Confirm the exact `react-hooks` Flat Config property exposed by version 7.1.1
before finalizing:

```bash
node -e "import('eslint-plugin-react-hooks').then(({default: p}) => {
  console.log(Object.keys(p.configs))
  if (!p.configs.flat?.recommended) process.exit(1)
})"
```

Expected: output includes `flat` and the command exits 0.

- [ ] **Step 5: Implement the Next.js preset**

Use the official Flat Config exports:

```js
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";
import { defineConfig, globalIgnores } from "eslint/config";
import { reactConfig } from "./react.js";

export const nextConfig = defineConfig([
  ...reactConfig,
  ...nextVitals,
  ...nextTypeScript,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);
```

- [ ] **Step 6: Verify all preset exports**

Run:

```bash
node -e "Promise.all([
  import('@repo/eslint-config/tailwind'),
  import('@repo/eslint-config/react'),
  import('@repo/eslint-config/next')
]).then((mods) => {
  if (mods.some((mod) => !Object.values(mod).some(Array.isArray))) process.exit(1)
})"
```

Expected: exit code 0.

- [ ] **Step 7: Commit framework presets**

```bash
git add packages/eslint-config pnpm-lock.yaml
git commit -m "build: add shared framework eslint presets"
```

## Task 3: Create the Shared Prettier Package

**Files:**

- Create: `packages/prettier-config/package.json`
- Create: `packages/prettier-config/index.js`
- Create: `packages/prettier-config/eslint.config.js`

- [ ] **Step 1: Record the missing package**

Run:

```bash
node -e "import('@repo/prettier-config')"
```

Expected: FAIL with package not found.

- [ ] **Step 2: Create the package manifest**

Create a private ESM package with:

```json
{
  "name": "@repo/prettier-config",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": "./index.js",
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "lint:fix": "eslint . --fix --max-warnings 0",
    "format": "prettier . --write",
    "format:check": "prettier . --check"
  },
  "dependencies": {
    "prettier-plugin-tailwindcss": "^0.8.0"
  },
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "eslint": "^10.5.0",
    "prettier": "^3.8.4"
  },
  "peerDependencies": {
    "prettier": ">=3 <4"
  }
}
```

Run `pnpm install` to update the lockfile.

- [ ] **Step 3: Export the Prettier policy**

`index.js`:

```js
/** @type {import("prettier").Config} */
const config = {
  endOfLine: "lf",
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
```

`eslint.config.js`:

```js
import { baseConfig } from "@repo/eslint-config/base";

export default baseConfig;
```

- [ ] **Step 4: Verify formatting and Tailwind ordering**

Run:

```bash
printf '<div className="p-4 flex"></div>\n' > /tmp/catch-us-prettier.tsx
pnpm exec prettier /tmp/catch-us-prettier.tsx \
  --config packages/prettier-config/index.js --write
cat /tmp/catch-us-prettier.tsx
```

Expected: valid formatted JSX with classes in Tailwind's recommended order.

- [ ] **Step 5: Commit the Prettier package**

```bash
git add packages/prettier-config pnpm-lock.yaml
git commit -m "build: add shared prettier configuration"
```

## Task 4: Migrate All Consumers

**Files:**

- Modify: `apps/admin/eslint.config.js`
- Modify: `apps/web/eslint.config.js`
- Modify: `packages/auth/eslint.config.js`
- Modify: `packages/core/eslint.config.js`
- Modify: `packages/db/eslint.config.js`
- Modify: `packages/ui/eslint.config.js`
- Modify: every corresponding `package.json`

- [ ] **Step 1: Replace ESLint imports**

Use:

```js
// apps/admin and apps/web
import { nextConfig } from "@repo/eslint-config/next";
export default nextConfig;

// packages/ui
import { reactConfig } from "@repo/eslint-config/react";
export default reactConfig;

// packages/auth, packages/core, packages/db
import { typescriptConfig } from "@repo/eslint-config/typescript";
export default typescriptConfig;
```

- [ ] **Step 2: Add package command contracts**

Every consumer package must include:

```json
"lint": "eslint . --max-warnings 0",
"lint:fix": "eslint . --fix --max-warnings 0",
"format": "prettier . --write",
"format:check": "prettier . --check"
```

Add these development dependencies:

```json
"@repo/prettier-config": "workspace:*",
"prettier": "^3.8.4"
```

Add:

```json
"prettier": "@repo/prettier-config"
```

Keep `eslint` and `@repo/eslint-config` in each consumer. Do not duplicate the
plugins owned by the shared configuration package.

- [ ] **Step 3: Install and run consumer lint**

Run:

```bash
pnpm install
pnpm turbo run lint --force
```

Expected: either PASS or actionable migration errors. Fix code that violates
correctness rules. Change shared rules only when a minimal fixture proves the
rule is incompatible or produces a false positive.

- [ ] **Step 4: Commit consumer migration**

```bash
git add apps packages pnpm-lock.yaml
git commit -m "build: adopt shared lint and format configs"
```

## Task 5: Add Root Formatting and Turbo Tasks

**Files:**

- Modify: `package.json`
- Modify: `turbo.json`
- Create: `.prettierignore`
- Modify: repository files formatted by the new baseline

- [ ] **Step 1: Add root dependencies and scripts**

Install:

```bash
pnpm add -Dw \
  @repo/prettier-config@workspace:* \
  prettier@3.8.4
```

Add scripts:

```json
"lint:fix": "turbo run lint:fix",
"format": "turbo run format",
"format:check": "turbo run format:check",
"format:root": "prettier . --write --ignore-path .prettierignore",
"format:root:check": "prettier . --check --ignore-path .prettierignore"
```

Add the root `"prettier": "@repo/prettier-config"` field.

- [ ] **Step 2: Configure Turbo tasks**

Extend `turbo.json` with:

```json
"lint:fix": {
  "dependsOn": ["transit"],
  "cache": false
},
"//#format:root": {
  "cache": false
},
"//#format:root:check": {},
"format": {
  "dependsOn": ["transit", "//#format:root"],
  "cache": false
},
"format:check": {
  "dependsOn": ["transit", "//#format:root:check"]
}
```

Use `pnpm turbo run format --dry=json` to confirm each root task appears once
and no root script recursively invokes itself.

- [ ] **Step 3: Add Prettier ignores**

`.prettierignore`:

```text
.agents
.git
.next
.turbo
.worktrees
coverage
dist
node_modules
pnpm-lock.yaml
skills-lock.json
**/next-env.d.ts
```

- [ ] **Step 4: Establish the formatting baseline**

Run:

```bash
pnpm format
pnpm format:check
git diff --check
```

Expected: the second command reports all matched files formatted and the diff
has no whitespace errors.

- [ ] **Step 5: Commit root task integration**

```bash
git add package.json turbo.json .prettierignore \
  apps packages docs pnpm-workspace.yaml
git commit -m "build: add monorepo formatting tasks"
```

## Task 6: Install Husky and lint-staged

**Files:**

- Modify: `package.json`
- Create: `.husky/pre-commit`
- Create: `.husky/pre-push`
- Modify: `pnpm-lock.yaml`

- [ ] **Step 1: Install hook tooling**

Run:

```bash
pnpm add -Dw husky@9.1.7 lint-staged@17.0.7
```

Add:

```json
"prepare": "husky"
```

Add root lint-staged configuration:

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx,mjs,cjs}": [
    "eslint --fix --max-warnings 0",
    "prettier --write"
  ],
  "*.{json,json5,yaml,yml,css,md,mdx,html}": [
    "prettier --write"
  ]
}
```

The lockfile is not matched by these globs.

- [ ] **Step 2: Initialize Husky**

Run:

```bash
pnpm exec husky
```

Verify:

```bash
test "$(git config --get core.hooksPath)" = ".husky/_"
```

- [ ] **Step 3: Add hook files**

`.husky/pre-commit`:

```sh
pnpm exec lint-staged
```

`.husky/pre-push`:

```sh
pnpm lint
pnpm check-types
```

Keep hook scripts POSIX-compatible and do not add deprecated Husky bootstrap
headers.

- [ ] **Step 4: Verify pre-commit behavior without committing**

Create `packages/core/src/__hook-fixture__.ts` with badly formatted TypeScript,
stage only that path, invoke `.husky/pre-commit`, and verify the staged blob is
formatted:

```bash
printf 'export const hookFixture={value:true}\n' \
  > packages/core/src/__hook-fixture__.ts
git add packages/core/src/__hook-fixture__.ts
.husky/pre-commit
git show :packages/core/src/__hook-fixture__.ts
git rm --cached packages/core/src/__hook-fixture__.ts
rm packages/core/src/__hook-fixture__.ts
```

Do not use `git reset --hard` or discard unrelated changes.

Expected: hook exits 0 and staged content is formatted.

- [ ] **Step 5: Verify pre-push behavior**

Run:

```bash
.husky/pre-push
```

Expected: `pnpm lint` and `pnpm check-types` both exit 0.

- [ ] **Step 6: Commit hooks**

```bash
git add package.json pnpm-lock.yaml .husky
git commit -m "build: enforce local checks with husky"
```

## Task 7: Verify Rule Coverage and the Full Repository

**Files:**

- No committed fixture files
- Modify shared configs only when verification proves a compatibility issue

- [ ] **Step 1: Verify typed lint catches Promise misuse**

Create `packages/core/src/__lint-fixture__.ts`:

```ts
async function returnsPromise() {
  return true;
}

if (returnsPromise()) {
  console.log("unsafe");
}
```

Run ESLint and expect a nonzero exit containing a type-aware rule such as
`@typescript-eslint/no-misused-promises` or the applicable preset rule:

```bash
pnpm --filter @repo/core exec eslint src/__lint-fixture__.ts
rm packages/core/src/__lint-fixture__.ts
```

- [ ] **Step 2: Verify React and accessibility rules**

Create `packages/ui/src/__lint-fixture__.tsx`:

```tsx
import { useState } from "react";

export function Fixture({ enabled }: { enabled: boolean }) {
  if (enabled) {
    useState(false);
  }

  return <img src="/fixture.png" />;
}
```

Run:

```bash
pnpm --filter @repo/ui exec eslint src/__lint-fixture__.tsx
rm packages/ui/src/__lint-fixture__.tsx
```

Expected: nonzero exit with React Hooks and jsx-a11y findings.

- [ ] **Step 3: Verify Tailwind v4 beta rules**

Create `packages/ui/src/__tailwind-fixture__.tsx`:

```tsx
export const Fixture = () => <div className="p-2 p-4" />;
```

Run ESLint and confirm a Tailwind rule evaluates it. If a recommended rule
crashes or produces a demonstrated false positive against valid repository
code, disable only that rule with a comment in `tailwind.js` and rerun.

```bash
pnpm --filter @repo/ui exec eslint src/__tailwind-fixture__.tsx
rm packages/ui/src/__tailwind-fixture__.tsx
```

- [ ] **Step 4: Verify Prettier owns class ordering**

Create `packages/ui/src/__format-fixture__.tsx` with:

```tsx
export const Fixture = () => <div className="p-4 flex" />;
```

Run:

```bash
pnpm --filter @repo/ui exec eslint src/__format-fixture__.tsx
pnpm --filter @repo/ui exec prettier src/__format-fixture__.tsx --write
cat packages/ui/src/__format-fixture__.tsx
rm packages/ui/src/__format-fixture__.tsx
```

Expected: ESLint reports no `classnames-order` finding and Prettier changes the
class order.

- [ ] **Step 5: Run fresh repository verification**

Run:

```bash
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm check-types
pnpm build
git diff --check
```

Expected:

- format check passes
- all lint tasks pass with zero warnings
- all TypeScript checks pass
- both Next.js applications build
- no whitespace errors

- [ ] **Step 6: Verify fix commands are idempotent**

Run:

```bash
pnpm lint:fix
pnpm format
git diff --check
pnpm lint
pnpm format:check
```

Expected: the second validation run passes. Review any formatting diff and keep
only intentional baseline changes.

- [ ] **Step 7: Final diff audit**

Run:

```bash
git status --short
git diff main...HEAD --stat
git diff main...HEAD --check
```

Confirm `.agents/` and `skills-lock.json` remain outside commits. Confirm no
temporary fixture or secret is present.

- [ ] **Step 8: Commit compatibility fixes if needed**

If Task 7 required shared-rule adjustments:

```bash
git add packages/eslint-config packages/prettier-config \
  apps packages package.json turbo.json pnpm-lock.yaml
git commit -m "fix: align shared lint rules with workspace"
```

If no files changed, skip this commit.
