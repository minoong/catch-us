# Frontend Guide

This directory is the map for frontend, UI, and design-system decisions.

## Current Stack

- Next.js App Router for `apps/web` and `apps/admin`
- React 19
- Tailwind CSS 4
- shadcn/ui-style shared components in `packages/ui`
- Storybook in `packages/ui`

## Working Rules

- Prefer shared UI primitives in `packages/ui` before adding app-local
  components.
- Keep app-specific composition inside `apps/*`.
- Keep reusable variants and primitives inside `packages/ui`.
- Add or update Storybook stories when changing a shared UI component in a way
  that affects variants, states, accessibility, or visual behavior.
- Use installed Next.js docs before Next-specific implementation work. See
  `AGENTS.md` for the pnpm path.

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
