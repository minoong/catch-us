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
- For this trip slice, "aggressively" means the route should visibly compose
  registry components, not only keep them installed. The current baseline uses
  Magic UI `PixelImage`, `DiaTextReveal`, `BorderBeam`, `AnimatedBeam`,
  `Iphone`, `AnimatedGradientText`, `AnimatedGridPattern`, `TextAnimate`,
  `AnimatedShinyText`, `LineShadowText`, `WordRotate`, `Highlighter`,
  `ComicText`, ReactBits `ScrollStack`, `ScrollFloat`, `CircularGallery`,
  `Aurora`/`Silk`, `Noise`, ReactBits `GradualBlur`, ReactBits
  `AnimatedList`, and motion-primitives `TransitionPanel`.
- Trip motion is mobile-first. Do not rely on hover-only reveals for primary
  information or CTAs. Wrap registry components when needed so actions are
  visible by default on touch devices. Do not use ReactBits `PillNav` for trip
  schedule tabs because its generated implementation is mouse-hover oriented.
- Trip intro photo effects should use optimized public assets, not original
  camera files. Keep intro photos under `apps/web/public/trips/<slug>/intro/`.
- Lenis usage on trip pages should stay route-local. Use `autoRaf`, clean up
  with `destroy()`, and mark nested custom scrollers such as ReactBits
  `ScrollStack` with `data-lenis-prevent` instead of enabling broad nested
  scrolling.
- Parallax should use lightweight transform/opacity motion and must respect
  reduced-motion preferences.
- Use a 2-depth schedule explorer for itinerary navigation: sticky map, sticky
  active-state animated date segmented nav, and scrollable timeline.
- On mobile schedules, avoid secondary place-chip rails unless the itinerary
  needs a new interaction model. The sticky map and date tabs should compact
  together from scroll progress rather than a hard jump while keeping the active
  place and date visible.
- Trip schedule date tabs should use a click/touch-driven segmented control
  with an x-axis-only animated cursor. Do not use shared-layout tab backgrounds
  that can animate vertically after sticky header resize.
- Trip schedule timeline should use an app-local Luxury Ticket mobile journey
  layout: a static time rail, compact kind markers, rounded ticket cards,
  dotted dividers, and short viewport reveal. Keep timeline animations separate
  from sticky header, map, and tab sizing so scroll-driven compact UI does not
  jitter.
- Trip schedule header title should stay stable on first entry. Use the
  original trip title in the H1 with only its initial text reveal; do not morph
  or swap the title into alternate copy after load. Do not add extra title rows
  or unsolicited text colors; use the inherited heading color unless a design
  spec says otherwise.
- Trip schedule Lottie decorations are contextual, not header chrome. The
  current date rail uses a hanging monkey Lottie under the sticky date badge and
  a small love Lottie centered below the monkey so it reads as the monkey
  reaching toward the heart. Keep these canvases pointer-events-free and verify
  their mobile positions with Playwright because small absolute offsets are easy
  to misread by eye.
- Schedule map cards should prioritize the map itself. Put active place/status
  as map overlays instead of a separate card title block.
- In the compact sticky state, the schedule map should become edge-to-edge
  within the mobile viewport and overlays must not intercept map gestures.
- Kakao Maps uses `NEXT_PUBLIC_KAKAO_MAP_APP_KEY`; when the key or coordinates
  are missing, show the fallback map card. Static trip places must include
  `lat` and `lng` for SDK rendering.
- Schedule date tabs filter Kakao SDK markers to the places in that tab. The
  first `전체` tab is the exception and keeps all coordinate markers visible.
  When fitting bounds for `2026-07-10`, exclude `yongsan-station` from the
  bounds calculation so the map stays framed around Jeonju while still allowing
  the Yongsan card to focus its marker when selected.

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
