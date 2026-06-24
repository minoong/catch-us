# Use App-Level Motion And React Bits

## Status

Accepted

## Context

`apps/web` needs expressive intro and hero surfaces before the full photo
service workflow is implemented. The current shared UI package should stay
focused on reusable primitives and Storybook-backed components, while
route-specific marketing composition can move faster inside the app that owns
it.

React Bits offers shadcn registry-backed visual effects, Motion provides
React-friendly entry and transition animation APIs, and GSAP remains useful for
continuous or timeline-oriented animation.

## Decision

- Use Motion from `motion/react` for React component entry, transition, and
  presence-style animation.
- Use GSAP for continuous decorative effects where timeline control is clearer
  than component state.
- Use React Bits through the configured shadcn registry for visual effect
  starting points.
- Keep app-specific visual compositions in the owning app, such as
  `apps/web/app/_components`.
- Move reusable visual primitives to `packages/ui` only when they are expected
  to be shared across apps, and add Storybook coverage at that point.

## Consequences

- App landing pages can iterate quickly without prematurely expanding the shared
  UI package.
- Generated registry components must still be adapted to local lint,
  accessibility, package-boundary, and reduced-motion expectations.
- Future design-system work can promote repeated app-local patterns into
  `packages/ui` once the visual language stabilizes.
