# Use Codex MCP For Visual Registries

## Status

Accepted

## Context

`apps/web` uses registry-backed visual components and effects from React Bits
and Magic UI. These tools are useful during design iteration, but future agents
need a repeatable way to discover components, inspect examples, and generate the
right shadcn add commands without relying on chat history.

## Decision

- Keep `apps/web/components.json` as the registry source for app-level visual
  additions.
- Use the `reactbits` Codex MCP as a project-scoped shadcn MCP server for
  React Bits and other registries declared by `apps/web`.
- Use the `magicui` Codex MCP as the official Magic UI registry server for
  search, listing, and source inspection.
- Use `pnpm dlx shadcn@latest add ...` for component writes so the repo keeps a
  pnpm-only toolchain.
- Treat MCP setup as working only after both persisted config and live Codex
  tool exposure are verified.

## Consequences

- Component discovery is faster and less dependent on browser/manual docs.
- Generated component code still needs local review for accessibility,
  dependency placement, package boundaries, and reduced-motion behavior.
- Updating or adding durable MCP tooling must update `docs/frontend/README.md`
  or a decision record in the same branch.
