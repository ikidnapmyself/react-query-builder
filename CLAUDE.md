# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A general-purpose React 19 query builder component. It outputs structured JSON representing conditional logic with AND, OR, and GROUP operations. The component is domain-agnostic — it can power any system that needs user-defined conditional rules:

- **Alert managers** — define when alerts fire based on metric thresholds
- **Algorithmic trading** — build entry/exit conditions (e.g., "IF RSI > 70 AND price crosses below SMA THEN sell")
- **IFTTT / automation** — compose "if this then that" triggers and actions
- **Pipeline managers** — define branching logic and conditional steps in data/CI pipelines
- **Email filtering** — build rules for sorting, labeling, or forwarding emails
- **Data validation** — define validation rules for form fields or data imports
- **Access control** — define permission rules for role-based access
- **Search / content filtering** — build advanced search queries for content or products

Published as a reusable **npm package**. Designed as a headless/template-customizable component — styling defaults to Tailwind CSS but supports alternative styling systems (Bootstrap, custom CSS, etc.) via theme/template overrides.

## Architecture

### Composition-First (Hooks + Compound Components)

This project follows a **hooks-based composition** approach as the primary API layer. Consumers compose their query builder UI from small, focused hooks and compound components rather than configuring a single monolithic `<QueryBuilder>` component.

**API tiers (in priority order):**

1. **Hooks** (primary): `useQueryBuilder`, `useGroup`, `useRule` — consumers call hooks directly and render their own JSX. Full control, zero opinions on markup.
2. **Compound components** (convenience): `<QueryBuilder.Group>`, `<QueryBuilder.Rule>`, `<QueryBuilder.Combinator>` — pre-wired components that share state via context. Less boilerplate than raw hooks, still composable.
3. **Pre-built templates** (batteries-included): `<TailwindQueryBuilder>`, `<BootstrapQueryBuilder>` — fully styled, drop-in components built on top of tiers 1 & 2. Zero setup for common cases.

**Example — hooks tier:**
```tsx
const { query, addRule, addGroup, setQuery } = useQueryBuilder({ defaultValue });

return (
  <div>
    {query.rules.map(rule => (
      <MyCustomRule key={rule.id} rule={rule} />
    ))}
    <button onClick={() => addRule({ field: '', operator: 'eq', value: '' })}>
      + Rule
    </button>
  </div>
);
```

**Example — compound components tier:**
```tsx
<QueryBuilder value={query} onChange={setQuery}>
  <QueryBuilder.Group>
    <QueryBuilder.Combinator />
    <QueryBuilder.Rules>
      {(rule) => <QueryBuilder.Rule rule={rule} />}
    </QueryBuilder.Rules>
    <QueryBuilder.AddRule />
    <QueryBuilder.AddGroup />
  </QueryBuilder.Group>
</QueryBuilder>
```

### Core Concepts

- **Query as JSON**: The query state is a nested JSON tree of rules and groups. Consumers get the value via `onChange` callback (preferred) and optionally via hidden input for form submission.
- **Operators**: AND, OR combine sibling rules. GROUP nests a sub-query (recursive tree structure).
- **Template system**: All UI rendering is fully customizable — either by composing hooks/compound components, or by swapping the template preset (Tailwind, Bootstrap, unstyled).

### Data Model

```typescript
type Rule = {
  id: string;
  field: string;
  operator: string;
  value: unknown;
};

type Group = {
  id: string;
  combinator: 'AND' | 'OR';
  rules: (Rule | Group)[];
};
```

### Component Design Principles

- **Hooks first**: All query logic lives in hooks. Components are thin wrappers that call hooks and render markup. Never put business logic in components.
- **Context for shared state**: `useQueryBuilder` provides the root state. Compound components read it from `QueryBuilderContext`. Hooks can also accept the context value directly for non-component use cases.
- **Controlled & uncontrolled**: Support both `value`/`onChange` (controlled) and `defaultValue` (uncontrolled) patterns at every tier.
- **Event listeners over hidden inputs**: Prefer `onChange` callback as the primary API. Optionally support rendering a hidden `<input>` with serialized JSON for traditional form submission.
- **Theme presets**: Ship default Tailwind template. Provide Bootstrap and unstyled preset alternatives as separate exports (e.g., `react-query-builder/templates/bootstrap`).

### Directory Structure

```
src/
  hooks/          # useQueryBuilder, useGroup, useRule (primary API)
  context/        # QueryBuilderContext, provider
  components/     # Compound components (QueryBuilder.Group, .Rule, etc.)
  templates/      # Pre-built themed components (tailwind, bootstrap, unstyled)
  core/           # Pure logic — query manipulation, validation, ID generation
  types/          # Shared TypeScript types
  index.ts        # Public API exports
stories/          # Storybook stories (per-tier demos, domain examples, theming)
```

## Commands

```bash
npm install          # Install dependencies
npm run build        # Build the library
npm run dev          # Dev server (Storybook)
npm run storybook    # Run Storybook directly
npm test             # Run all tests
npm test -- --grep "test name"  # Run a single test
npm run lint         # Lint
```

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS (default styling)
- Vitest (testing)
- Storybook (demos & documentation)

## Storybook

Storybook is the primary way to demonstrate and document the component. Stories should cover:

- **Per-tier stories**: Raw hooks usage, compound components usage, and pre-built template usage — showing all three API tiers.
- **Domain examples**: 8 use cases (alert manager, trading bot, IFTTT automation, pipeline manager, email filtering, data validation, access control, search filtering) — each available across all 3 templates with complex presets.
- **Theming**: Stories toggling between Tailwind, Bootstrap, and unstyled templates. Tailwind and Bootstrap include dark mode variants.
- **Autodocs**: All stories have `tags: ['autodocs']` enabled for auto-generated documentation pages with copy-pasteable code.
- **Shared configs**: Use case field/operator/preset definitions live in `stories/useCases.ts` and are shared across all template stories.

## Key Conventions

- All components must accept a `className` prop for style overrides.
- Template/render functions receive the full query context so consumers can build any UI they want.
- The root `<QueryBuilder>` component must work as a drop-in form element: it should support `name`, `value`, `onChange`, and `defaultValue` props.
- Combinators (AND/OR) are per-group, not per-rule. Each group has one combinator that applies to all its direct child rules.
