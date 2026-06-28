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
- Magic UI can be used as a shadcn registry source for shared visual components
  and landing-page effects

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
- If a React Bits or Magic UI registry file needs to stay close to generated
  source, keep any lint exceptions scoped to exact generated filenames in the
  owning app's ESLint config. Do not loosen shared package or app-authored code
  rules for generated visual effects.
- When importing Magic UI components, use the configured `@magicui` shadcn
  registry and review generated shared components before use.
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

`apps/web/components.json` includes app-level third-party component registries:

```json
"registries": {
  "@react-bits": "https://reactbits.dev/r/{name}.json",
  "@magicui": "https://magicui.design/r/{name}"
}
```

Use shadcn MCP or CLI for registry-backed additions. After adding generated
components, verify where dependencies were installed in the monorepo and move
app-only dependencies to the owning app if needed.

Magic UI's official MCP installer currently documents Cursor, Windsurf, Claude,
Cline, and Roo-Cline clients. For Codex, use the shadcn registry path unless a
Codex-specific Magic UI MCP installer becomes available.

## Web Landing Page

`apps/web` owns the current landing-page composition and app-specific visual
copy. Shared primitives still belong in `packages/ui`, but product-specific
data such as highlighted countries, cities, and hero copy should stay in the
owning app until the service model exists.

The hero memory map uses the shared `DottedMap` primitive with app-level marker
overlays. Country badges should behave as compact map labels:

- group cities under one country marker instead of creating one marker per city
- keep the country icon and badge visually attached
- avoid marker, badge, and map-edge collisions with layout calculation rather
  than fixed pixel offsets
- collapse long city lists as `외 N곳` so future city additions do not make the
  marker overflow
- prefer Storybook coverage when changing shared map overlay behavior

`DottedMap` passes rendered marker positions to `renderMarkerOverlay` so
consumers can calculate collision-aware overlays without duplicating map
projection logic.

## Trip Pages

`apps/web/app/trip` owns static trip intro and schedule pages. The first trip is
`/trip/jeonju-2026`.

- Keep trip data in route-local `_data/trips.ts`.
- Do not add user-facing itinerary creation UI for this slice.
- Use Magic UI and ReactBits effects aggressively on the 1-depth intro page, but
  preserve reduced-motion access.
- Use a 2-depth schedule explorer for itinerary navigation: sticky map, sticky
  date PillNav, quick rail, and scrollable timeline.
- Kakao Maps uses `NEXT_PUBLIC_KAKAO_MAP_APP_KEY`; when the key or coordinates
  are missing, show the fallback map card.

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
