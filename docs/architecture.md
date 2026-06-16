# Architecture

Catch Us is a pnpm Turborepo for a private photo service and an admin
dashboard. The repository is intentionally small for now; keep the boundaries
boring and explicit as features are added.

## Applications

- `apps/web`: user-facing service app.
- `apps/admin`: admin dashboard for operational controls such as public/private
  visibility.

Both apps use Next.js App Router and should consume shared code through
workspace packages instead of reaching across app directories.

## Packages

- `packages/ui`: shared shadcn/ui-style components, Tailwind styles, and
  Storybook stories.
- `packages/auth`: authentication and authorization boundary.
- `packages/core`: shared domain types and business rules.
- `packages/db`: database access boundary.
- `packages/eslint-config`: shared ESLint flat configs.
- `packages/prettier-config`: shared Prettier config.
- `packages/typescript-config`: shared TypeScript configs.

## Dependency Direction

- Apps may depend on packages.
- Packages should not depend on apps.
- UI components should not import app-specific code.
- Data access should stay behind `packages/db`.
- Cross-cutting product rules should start in `packages/core` unless a narrower
  package owns them.

## Future Domains

Expected product areas include photo upload, EXIF extraction, location fallback,
TMAP reverse geocoding, image embeddings, face/person search, map search,
keyword search, date search, guest mode, and admin visibility controls.

When those domains become real, add focused docs or decision records instead of
expanding this overview into a full manual.
