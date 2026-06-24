# Frontend Guide

This directory is the map for frontend, UI, and design-system decisions.

## Current Stack

- Next.js App Router for `apps/web` and `apps/admin`
- React 19
- Tailwind CSS 4
- shadcn/ui-style shared components in `packages/ui`
- Storybook in `packages/ui`
- Motion for React entry/transition animations in app-level compositions
- GSAP for timeline-style or continuous visual effects when Motion is not the
  right fit
- React Bits can be used as a shadcn registry source for app-level visual
  effects

## Working Rules

- Prefer shared UI primitives in `packages/ui` before adding app-local
  components.
- Keep app-specific composition inside `apps/*`.
- Keep reusable variants and primitives inside `packages/ui`.
- Add or update Storybook stories when changing a shared UI component in a way
  that affects variants, states, accessibility, or visual behavior.
- Use installed Next.js docs before Next-specific implementation work. See
  `AGENTS.md` for the pnpm path.
- Keep route-specific landing page composition inside the owning app, such as
  `apps/web/app/_components`.
- When importing visual effects from React Bits, add them through the configured
  shadcn registry and then adapt the generated code to this repo's ESLint,
  accessibility, and package-boundary rules.
- Prefer `motion/react` imports for Motion usage.
- Respect reduced-motion preferences for continuous animation. If an effect is
  decorative, the page must still read correctly without it.
- Add third-party effect dependencies to the app or package that owns the
  component. Do not put app-only visual dependencies in `packages/ui`.

## Admin Dashboard

`apps/admin` follows a lightweight FSD-style source layout:

- `src/app/providers`: app-level providers such as theme wiring.
- `src/shared/config`: stable configuration, including admin navigation.
- `src/widgets/admin-shell`: dashboard frame with sidebar, header, and theme
  controls.
- `src/widgets/overview-dashboard`: overview page composition and mock data.
- `src/widgets/section-placeholder`: temporary page scaffolding for routes that
  are planned but not yet implemented.

Admin routes live under `apps/admin/app/(dashboard)`. Do not create a
top-level `pages` layer for FSD naming because it conflicts with Next.js
terminology in this repo. Use route folders for URLs and `src/widgets/*` for
page-level composition.

When adding an admin menu item:

1. Add the route under `app/(dashboard)`.
2. Update `src/shared/config/navigation.ts`.
3. Ensure the sidebar has a readable active state through `aria-current="page"`.
4. Add a placeholder first if the feature is not ready yet.

## Registries And MCP

`apps/web/components.json` includes the React Bits registry:

```json
"registries": {
  "@react-bits": "https://reactbits.dev/r/{name}.json"
}
```

Use shadcn MCP or CLI for registry-backed additions. After adding generated
components, verify where dependencies were installed in the monorepo and move
app-only dependencies to the owning app if needed.

## Design System

The design system is intentionally light right now. When the visual language
becomes more concrete, add `docs/frontend/design-system.md` with:

- color and theme tokens
- typography rules
- spacing and radius rules
- component anatomy
- accessibility expectations
- motion rules, if any

Do not bury design-system rules only in chat history. Put durable decisions in
this directory.
