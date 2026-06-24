# Use Admin Dashboard Route Group And Widgets

## Status

Accepted

## Context

The admin app needs a stable navigation shell before Supabase auth, upload
management, map views, embedding jobs, and visibility controls are implemented.
The project also wants an FSD-style structure, but a literal `pages` layer would
conflict with Next.js terminology and make the App Router layout harder to
read.

## Decision

- Use `apps/admin/app/(dashboard)` for dashboard routes that share the admin
  shell.
- Keep the sidebar, header, theme controls, and dashboard frame in
  `apps/admin/src/widgets/admin-shell`.
- Keep page-level dashboard composition in `apps/admin/src/widgets/*`.
- Keep admin menu metadata in `apps/admin/src/shared/config/navigation.ts`.
- Do not introduce a top-level FSD `pages` layer in this repo.
- Use placeholders for planned admin sections until the corresponding feature
  implementation starts.

## Consequences

- New admin routes have one obvious place to live.
- Menu labels, route matching, and descriptions stay centralized.
- The app remains compatible with Next.js App Router conventions while still
  keeping FSD-style ownership boundaries.
- Feature work can replace placeholders incrementally without redesigning the
  dashboard shell.
