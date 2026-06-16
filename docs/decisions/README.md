# Decision Records

Use this directory for durable project decisions that future agents should not
rediscover from chat history.

## When To Add A Decision

Add a decision record when a change answers one of these questions:

- Why did we choose this tool or framework?
- Why is this boundary shaped this way?
- Why is a rule enforced mechanically instead of documented only?
- Why did we defer an obvious alternative?

## Format

Use short Markdown files named like:

```text
0001-use-storybook-for-shared-ui.md
0002-use-vitest-for-unit-tests.md
0003-use-playwright-for-e2e.md
```

Suggested sections:

```md
# Title

## Status

Accepted | Proposed | Superseded

## Context

What forced the decision?

## Decision

What did we choose?

## Consequences

What becomes easier, harder, or intentionally deferred?
```

Keep records concise. Link to implementation PRs or docs when useful.
