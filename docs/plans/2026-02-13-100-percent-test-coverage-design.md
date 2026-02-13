# Design: 100% Test Coverage (Unit Tests)

**Date:** 2026-02-13
**Goal:** Achieve 100% coverage across all metrics (lines, branches, functions, statements)
**Approach:** Unit tests only, co-located next to source files

## Coverage Configuration

Add `coverage` config to `vitest.config.ts` with 100% thresholds. Exclude stories, storybook config, test setup, barrel exports, and type-only files.

## Test Files

| Test File | Source File | Est. Tests |
|-----------|------------|------------|
| `core/id.test.ts` | `core/id.ts` | 3 |
| `core/defaults.test.ts` | `core/defaults.ts` | 8 |
| `types/index.test.ts` | `types/index.ts` | 4 |
| `hooks/useQueryBuilder.test.ts` | `hooks/useQueryBuilder.ts` | 35 |
| `context/QueryBuilderContext.test.tsx` | `context/QueryBuilderContext.tsx` | 4 |
| `components/QueryBuilder.test.tsx` | `components/QueryBuilder.tsx` | 6 |
| `templates/shared/RuleRow.test.tsx` | `templates/shared/RuleRow.tsx` | 15 |
| `templates/shared/GroupBlock.test.tsx` | `templates/shared/GroupBlock.tsx` | 12 |
| `templates/shared/TemplateQueryBuilder.test.tsx` | `templates/shared/TemplateQueryBuilder.tsx` | 5 |
| `templates/tailwind/index.test.tsx` | `templates/tailwind/index.tsx` | 2 |
| `templates/bootstrap/index.test.tsx` | `templates/bootstrap/index.tsx` | 2 |
| `templates/unstyled/index.test.tsx` | `templates/unstyled/index.tsx` | 2 |

**Total: ~100 tests across 12 files**

## Key Testing Strategies

- **Pure functions** (`id.ts`, `defaults.ts`, `isGroup`): Direct unit tests
- **Hook** (`useQueryBuilder`): `renderHook` from @testing-library/react
- **Components**: `render` + `fireEvent` from @testing-library/react
- **Recursive tree logic**: Test with 3+ level deep groups to cover all branches
- **Controlled vs uncontrolled**: Both patterns tested for hook and components
- **ValueInput branches**: All 5 field types (text, number, date, boolean, select) plus fallback

## Critical Branches to Cover

- `updateGroupRecursive`: null return, no-change return, changed return
- `ValueInput`: select with options, boolean, number coercion, date, text fallback
- `GroupBlock`: isRoot (no remove button) vs non-root (remove button shown)
- `TemplateQueryBuilder`: className present vs absent
- `BootstrapQueryBuilder`: colorMode present vs absent
- `QueryBuilder`: name present (hidden input) vs absent
- `useQueryBuilder`: controlled (onChange only) vs uncontrolled (internal state)
