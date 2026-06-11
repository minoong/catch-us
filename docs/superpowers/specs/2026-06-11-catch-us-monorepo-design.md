# Catch Us Monorepo Design

## Goal

Initialize `/Users/minwoo/workspaces/catch-us` itself as a pnpm Turborepo. Do not
create another `catch-us` directory. The repository will contain two Next.js App
Router applications and shared packages that establish boundaries for future
product work.

This phase creates an executable application skeleton only. It does not connect
Supabase, install map SDKs, choose or run embedding models, implement image
processing, or build product features.

## Bootstrap Strategy

Use the official `create-turbo` starter in the existing repository root, then
reshape the generated example into the approved package layout. Generated demo
code that is not needed to validate the monorepo will be removed.

The package manager is pnpm. The workspace root package is private and contains
repository tooling only.

## Repository Structure

```text
catch-us/
├── apps/
│   ├── web/
│   └── admin/
├── packages/
│   ├── ui/
│   ├── auth/
│   ├── core/
│   ├── db/
│   ├── eslint-config/
│   └── typescript-config/
├── docs/
│   └── superpowers/
│       └── specs/
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── turbo.json
└── README.md
```

### Applications

- `apps/web`: User-facing photo service shell built with Next.js App Router.
- `apps/admin`: Administration dashboard shell built with Next.js App Router.
- Applications must not import files from one another.
- Shared functionality must be consumed through declared `@repo/*` workspace
  dependencies.

### Shared Packages

- `@repo/ui`: JIT TypeScript package for shared shadcn/ui primitives, hooks,
  utilities, and global styles.
- `@repo/auth`: Minimal JIT package reserving the authentication and
  authorization boundary.
- `@repo/core`: Minimal JIT package reserving shared domain types and rules.
- `@repo/db`: Minimal JIT package reserving the Supabase/Postgres data-access
  boundary.
- `@repo/eslint-config`: Shared ESLint configuration.
- `@repo/typescript-config`: Shared TypeScript configuration.

`auth`, `core`, and `db` contain only enough code to expose a valid typed API and
prove that applications can consume them. They do not install or initialize
external services.

## Package Boundaries

Every workspace has its own `package.json`. Internal dependencies use
`workspace:*` and are declared by each consumer. Packages expose supported
entrypoints through `exports`; consumers must not reach into package internals
through relative paths.

The shared runtime packages are JIT packages. They export TypeScript source
directly and do not require a separate compilation or watch process. The two
Next.js applications transpile the shared packages.

Application runtime dependencies such as Next.js and React live in the
applications or the package that directly requires them. The root has only
repository-level development tools such as Turborepo.

## Turborepo Tasks

Task implementation belongs to each application or package. Root scripts only
delegate through `turbo run`.

- `build`: Runs dependency builds first with `^build`. Next.js outputs
  `.next/**` except `.next/cache/**` are cached.
- `dev`: Non-cacheable persistent task for application development servers.
- `lint`: Runs each workspace's lint script.
- `check-types`: Runs each workspace's TypeScript validation.

Linting and type checking should remain parallel where possible while preserving
correct invalidation when dependency source changes. The implementation may use
Turborepo transit nodes if they are needed for this behavior.

No root script may manually traverse workspaces or chain package builds.

## Shared UI

`packages/ui` owns:

- shadcn/ui primitives
- shared hooks
- the `cn` utility
- shared Tailwind CSS v4 global styles

`apps/web`, `apps/admin`, and `packages/ui` each receive a compatible
`components.json`. Aliases must direct generated shared primitives into
`@repo/ui` and keep application-specific compositions inside their owning app.

Consumers import only through public paths such as:

```ts
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
```

The initial scaffold adds one shared `Button` component. Each application renders
it on a minimal home screen to verify package resolution, styling, and
transpilation. The shadcn style, base color, icon library, and CSS variables must
be consistent across the workspace.

## Initial Data Flow

There is no product data flow in this phase. Each application imports:

- a shared UI primitive from `@repo/ui`
- a harmless typed export from `@repo/auth`
- a harmless typed export from `@repo/core`
- a harmless typed export from `@repo/db`

These imports validate architectural boundaries without implying an external
service integration.

## Error Handling

The scaffold contains no network or database operations, so runtime error
handling is limited to normal Next.js application behavior. Configuration errors
must fail during install, lint, type checking, or build rather than being hidden
by fallback imports or undeclared dependencies.

## Verification

The implementation is complete when:

1. The repository root remains `/Users/minwoo/workspaces/catch-us`.
2. No nested `catch-us/catch-us` directory exists.
3. `pnpm install` succeeds.
4. `pnpm lint` succeeds.
5. `pnpm check-types` succeeds.
6. `pnpm build` builds both applications successfully.
7. Both applications render the shared `@repo/ui` Button.
8. Both applications resolve typed exports from `@repo/auth`, `@repo/core`, and
   `@repo/db`.
9. Turborepo recognizes the intended workspace task graph.
10. `README.md` documents the repository layout and primary commands.

## Explicitly Deferred

- Supabase project setup, schema, RLS, storage, and Postgres indexes
- Authentication providers and guest access behavior
- Public/private photo management
- Image metadata extraction and reverse geocoding
- TMAP, Kakao Maps, and Google Maps integrations
- Image, keyword, face, and similarity embedding model selection
- Vector storage and search
- Upload, gallery, map, search, and admin product interfaces
- Deployment and CI configuration
