# 100% Test Coverage Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Achieve 100% test coverage across all metrics (lines, branches, functions, statements) and create a PR.

**Architecture:** Unit tests co-located next to source files. Pure functions tested directly, hooks via `renderHook`, components via `render` + `fireEvent`. One dead code simplification in `updateGroupRecursive` to make all branches reachable.

**Tech Stack:** Vitest, @testing-library/react, @testing-library/jest-dom, jsdom

---

### Task 1: Configure coverage in vitest.config.ts

**Files:**
- Modify: `vitest.config.ts`
- Modify: `package.json`

**Step 1: Add coverage config to vitest.config.ts**

Add coverage configuration inside the `test` object:

```ts
coverage: {
  provider: 'v8',
  reporter: ['text', 'html'],
  include: ['src/**/*.{ts,tsx}'],
  exclude: [
    'src/index.ts',
    'src/core/index.ts',
    'src/hooks/index.ts',
    'src/context/index.ts',
    'src/components/index.ts',
    'src/test/**',
    'src/templates/shared/types.ts',
  ],
  thresholds: {
    lines: 100,
    branches: 100,
    functions: 100,
    statements: 100,
  },
},
```

**Step 2: Add coverage script to package.json**

Add to scripts:

```json
"test:coverage": "vitest run --coverage"
```

**Step 3: Run to verify config works**

Run: `npm run test:coverage`
Expected: Coverage report showing 0% (no tests yet), thresholds should fail.

**Step 4: Commit**

```bash
git add vitest.config.ts package.json
git commit -m "Configure vitest coverage with 100% thresholds"
```

---

### Task 2: Simplify updateGroupRecursive to remove dead code

**Files:**
- Modify: `src/hooks/useQueryBuilder.ts:15-32` (updateGroupRecursive function)
- Modify: `src/hooks/useQueryBuilder.ts:143` (setCombinator null coalescing)

The current `updateGroupRecursive` accepts `null` returns from its updater, but the only caller (`setCombinator`) never returns `null`. This creates unreachable branches. Simplify.

**Step 1: Replace updateGroupRecursive**

Replace lines 15-32 with:

```ts
function updateGroupRecursive(group: Group, updater: (g: Group) => Group): Group {
  const result = updater(group);
  if (result !== group) return result;

  const newRules = group.rules.map((item) => {
    if (isGroup(item)) {
      return updateGroupRecursive(item, updater);
    }
    return item;
  });

  if (newRules.some((r, i) => r !== group.rules[i])) {
    return { ...group, rules: newRules };
  }

  return group;
}
```

**Step 2: Update setCombinator**

Replace `setQuery(updated ?? query)` with `setQuery(updated)` on line 143 (after simplification).

**Step 3: Run build to verify no type errors**

Run: `npm run build`
Expected: Build succeeds with no errors.

**Step 4: Commit**

```bash
git add src/hooks/useQueryBuilder.ts
git commit -m "Simplify updateGroupRecursive: remove unreachable null branches"
```

---

### Task 3: Test core utilities (id.ts + defaults.ts)

**Files:**
- Create: `src/core/id.test.ts`
- Create: `src/core/defaults.test.ts`

**Step 1: Create `src/core/id.test.ts`**

```ts
import { generateId } from './id';

describe('generateId', () => {
  it('returns a string matching qb-{timestamp}-{counter} format', () => {
    expect(generateId()).toMatch(/^qb-\d+-\d+$/);
  });

  it('returns unique IDs on successive calls', () => {
    const ids = new Set(Array.from({ length: 10 }, () => generateId()));
    expect(ids.size).toBe(10);
  });
});
```

**Step 2: Create `src/core/defaults.test.ts`**

```ts
import { createEmptyRule, createEmptyGroup, DEFAULT_OPERATORS, DEFAULT_FIELDS } from './defaults';

describe('createEmptyRule', () => {
  it('returns a rule with generated id, empty field, eq operator, and empty value', () => {
    const rule = createEmptyRule();
    expect(rule.id).toMatch(/^qb-/);
    expect(rule.field).toBe('');
    expect(rule.operator).toBe('eq');
    expect(rule.value).toBe('');
  });

  it('generates unique ids across calls', () => {
    expect(createEmptyRule().id).not.toBe(createEmptyRule().id);
  });
});

describe('createEmptyGroup', () => {
  it('defaults combinator to AND', () => {
    expect(createEmptyGroup().combinator).toBe('AND');
  });

  it('accepts a combinator parameter', () => {
    expect(createEmptyGroup('OR').combinator).toBe('OR');
  });

  it('has a generated id', () => {
    expect(createEmptyGroup().id).toMatch(/^qb-/);
  });

  it('contains one empty rule', () => {
    const group = createEmptyGroup();
    expect(group.rules).toHaveLength(1);
    expect(group.rules[0]).toMatchObject({ field: '', operator: 'eq', value: '' });
  });
});

describe('DEFAULT_OPERATORS', () => {
  it('has 11 operators', () => {
    expect(DEFAULT_OPERATORS).toHaveLength(11);
  });

  it('includes eq operator with = label', () => {
    expect(DEFAULT_OPERATORS[0]).toEqual({ name: 'eq', label: '=' });
  });
});

describe('DEFAULT_FIELDS', () => {
  it('is an empty array', () => {
    expect(DEFAULT_FIELDS).toEqual([]);
  });
});
```

**Step 3: Run tests**

Run: `npx vitest run src/core/`
Expected: All tests pass.

**Step 4: Commit**

```bash
git add src/core/id.test.ts src/core/defaults.test.ts
git commit -m "Add tests for core utilities (id, defaults)"
```

---

### Task 4: Test isGroup type guard

**Files:**
- Create: `src/types/index.test.ts`

**Step 1: Create `src/types/index.test.ts`**

```ts
import { isGroup } from './index';
import type { Rule, Group } from './index';

describe('isGroup', () => {
  it('returns true for a Group object', () => {
    const group: Group = { id: '1', combinator: 'AND', rules: [] };
    expect(isGroup(group)).toBe(true);
  });

  it('returns false for a Rule object', () => {
    const rule: Rule = { id: '1', field: 'name', operator: 'eq', value: 'test' };
    expect(isGroup(rule)).toBe(false);
  });
});
```

**Step 2: Run tests**

Run: `npx vitest run src/types/`
Expected: All tests pass.

**Step 3: Commit**

```bash
git add src/types/index.test.ts
git commit -m "Add tests for isGroup type guard"
```

---

### Task 5: Test useQueryBuilder hook

**Files:**
- Create: `src/hooks/useQueryBuilder.test.tsx`

This is the largest test file. It covers the hook API and indirectly tests all internal helper functions (`updateGroupRecursive`, `findAndUpdateRule`, `findAndRemove`, `findAndAddRule`).

**Step 1: Create `src/hooks/useQueryBuilder.test.tsx`**

```tsx
import { renderHook, act } from '@testing-library/react';
import { useQueryBuilder } from './useQueryBuilder';
import type { Group } from '../types';

describe('useQueryBuilder', () => {
  // --- Initialization ---

  describe('initialization', () => {
    it('creates a default empty group when no options provided', () => {
      const { result } = renderHook(() => useQueryBuilder());
      expect(result.current.query.combinator).toBe('AND');
      expect(result.current.query.rules).toHaveLength(1);
    });

    it('uses defaultValue when provided', () => {
      const defaultValue: Group = {
        id: 'root', combinator: 'OR',
        rules: [{ id: 'r1', field: 'name', operator: 'eq', value: 'test' }],
      };
      const { result } = renderHook(() => useQueryBuilder({ defaultValue }));
      expect(result.current.query).toBe(defaultValue);
    });

    it('uses controlled value when provided', () => {
      const value: Group = { id: 'root', combinator: 'AND', rules: [] };
      const { result } = renderHook(() => useQueryBuilder({ value }));
      expect(result.current.query).toBe(value);
    });

    it('uses default fields (empty) and operators (11) when not provided', () => {
      const { result } = renderHook(() => useQueryBuilder());
      expect(result.current.fields).toEqual([]);
      expect(result.current.operators).toHaveLength(11);
    });

    it('uses custom fields and operators when provided', () => {
      const fields = [{ name: 'age', label: 'Age' }];
      const operators = [{ name: 'eq', label: '=' }];
      const { result } = renderHook(() => useQueryBuilder({ fields, operators }));
      expect(result.current.fields).toBe(fields);
      expect(result.current.operators).toBe(operators);
    });
  });

  // --- addRule ---

  describe('addRule', () => {
    it('adds a rule to the root group', () => {
      const { result } = renderHook(() => useQueryBuilder());
      const rootId = result.current.query.id;
      act(() => result.current.addRule(rootId));
      expect(result.current.query.rules).toHaveLength(2);
    });

    it('adds a rule to a nested group', () => {
      const defaultValue: Group = {
        id: 'root', combinator: 'AND',
        rules: [
          { id: 'r0', field: '', operator: 'eq', value: '' },
          { id: 'g1', combinator: 'OR', rules: [{ id: 'r1', field: '', operator: 'eq', value: '' }] },
        ],
      };
      const { result } = renderHook(() => useQueryBuilder({ defaultValue }));
      act(() => result.current.addRule('g1'));
      const nested = result.current.query.rules[1] as Group;
      expect(nested.rules).toHaveLength(2);
    });
  });

  // --- addGroup ---

  describe('addGroup', () => {
    it('adds a nested group to the root', () => {
      const { result } = renderHook(() => useQueryBuilder());
      const rootId = result.current.query.id;
      act(() => result.current.addGroup(rootId));
      expect(result.current.query.rules).toHaveLength(2);
      const added = result.current.query.rules[1] as Group;
      expect(added.combinator).toBe('AND');
      expect(added.rules).toHaveLength(1);
    });
  });

  // --- removeRule ---

  describe('removeRule', () => {
    it('removes a rule from the root group', () => {
      const defaultValue: Group = {
        id: 'root', combinator: 'AND',
        rules: [
          { id: 'r1', field: '', operator: 'eq', value: '' },
          { id: 'r2', field: '', operator: 'eq', value: '' },
        ],
      };
      const { result } = renderHook(() => useQueryBuilder({ defaultValue }));
      act(() => result.current.removeRule('r1'));
      expect(result.current.query.rules).toHaveLength(1);
      expect(result.current.query.rules[0].id).toBe('r2');
    });

    it('removes a rule from a nested group', () => {
      const defaultValue: Group = {
        id: 'root', combinator: 'AND',
        rules: [{
          id: 'g1', combinator: 'OR',
          rules: [
            { id: 'r1', field: '', operator: 'eq', value: '' },
            { id: 'r2', field: '', operator: 'eq', value: '' },
          ],
        }],
      };
      const { result } = renderHook(() => useQueryBuilder({ defaultValue }));
      act(() => result.current.removeRule('r1'));
      const nested = result.current.query.rules[0] as Group;
      expect(nested.rules).toHaveLength(1);
      expect(nested.rules[0].id).toBe('r2');
    });
  });

  // --- removeGroup ---

  describe('removeGroup', () => {
    it('removes a nested group', () => {
      const defaultValue: Group = {
        id: 'root', combinator: 'AND',
        rules: [
          { id: 'r1', field: '', operator: 'eq', value: '' },
          { id: 'g1', combinator: 'OR', rules: [] },
        ],
      };
      const { result } = renderHook(() => useQueryBuilder({ defaultValue }));
      act(() => result.current.removeGroup('g1'));
      expect(result.current.query.rules).toHaveLength(1);
      expect(result.current.query.rules[0].id).toBe('r1');
    });
  });

  // --- updateRule ---

  describe('updateRule', () => {
    it('updates a rule in the root group', () => {
      const defaultValue: Group = {
        id: 'root', combinator: 'AND',
        rules: [
          { id: 'r1', field: '', operator: 'eq', value: '' },
          { id: 'r2', field: '', operator: 'eq', value: '' },
        ],
      };
      const { result } = renderHook(() => useQueryBuilder({ defaultValue }));
      act(() => result.current.updateRule('r1', { field: 'name', value: 'test' }));
      const rule = result.current.query.rules[0] as { id: string; field: string; value: unknown };
      expect(rule.field).toBe('name');
      expect(rule.value).toBe('test');
      // r2 unchanged
      expect(result.current.query.rules[1].id).toBe('r2');
    });

    it('updates a deeply nested rule (3 levels)', () => {
      const defaultValue: Group = {
        id: 'root', combinator: 'AND',
        rules: [
          { id: 'r0', field: '', operator: 'eq', value: '' },
          {
            id: 'g1', combinator: 'OR',
            rules: [{
              id: 'g2', combinator: 'AND',
              rules: [{ id: 'r1', field: '', operator: 'eq', value: '' }],
            }],
          },
        ],
      };
      const { result } = renderHook(() => useQueryBuilder({ defaultValue }));
      act(() => result.current.updateRule('r1', { field: 'age' }));
      const g1 = result.current.query.rules[1] as Group;
      const g2 = g1.rules[0] as Group;
      expect((g2.rules[0] as { field: string }).field).toBe('age');
    });
  });

  // --- setCombinator ---

  describe('setCombinator', () => {
    it('changes the root group combinator', () => {
      const { result } = renderHook(() => useQueryBuilder());
      act(() => result.current.setCombinator(result.current.query.id, 'OR'));
      expect(result.current.query.combinator).toBe('OR');
    });

    it('changes a nested group combinator', () => {
      const defaultValue: Group = {
        id: 'root', combinator: 'AND',
        rules: [
          { id: 'r0', field: '', operator: 'eq', value: '' },
          { id: 'g1', combinator: 'AND', rules: [{ id: 'r1', field: '', operator: 'eq', value: '' }] },
        ],
      };
      const { result } = renderHook(() => useQueryBuilder({ defaultValue }));
      act(() => result.current.setCombinator('g1', 'OR'));
      const nested = result.current.query.rules[1] as Group;
      expect(nested.combinator).toBe('OR');
    });

    it('returns same query when groupId does not exist', () => {
      const defaultValue: Group = {
        id: 'root', combinator: 'AND',
        rules: [
          { id: 'r0', field: '', operator: 'eq', value: '' },
          { id: 'g1', combinator: 'AND', rules: [{ id: 'r1', field: '', operator: 'eq', value: '' }] },
        ],
      };
      const { result } = renderHook(() => useQueryBuilder({ defaultValue }));
      const before = result.current.query;
      act(() => result.current.setCombinator('nonexistent', 'OR'));
      expect(result.current.query).toBe(before);
    });
  });

  // --- Controlled mode ---

  describe('controlled mode', () => {
    it('calls onChange but does not update internal state', () => {
      const onChange = vi.fn();
      const value: Group = {
        id: 'root', combinator: 'AND',
        rules: [{ id: 'r1', field: '', operator: 'eq', value: '' }],
      };
      const { result } = renderHook(() => useQueryBuilder({ value, onChange }));
      act(() => result.current.addRule('root'));
      expect(onChange).toHaveBeenCalledOnce();
      expect(result.current.query).toBe(value);
    });
  });

  // --- Uncontrolled mode with onChange ---

  describe('uncontrolled mode', () => {
    it('calls onChange and updates internal state', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useQueryBuilder({ onChange }));
      const rootId = result.current.query.id;
      act(() => result.current.addRule(rootId));
      expect(onChange).toHaveBeenCalledOnce();
      expect(result.current.query.rules).toHaveLength(2);
    });
  });
});
```

**Step 2: Run tests**

Run: `npx vitest run src/hooks/`
Expected: All tests pass.

**Step 3: Commit**

```bash
git add src/hooks/useQueryBuilder.test.tsx
git commit -m "Add tests for useQueryBuilder hook"
```

---

### Task 6: Test QueryBuilderContext

**Files:**
- Create: `src/context/QueryBuilderContext.test.tsx`

**Step 1: Create `src/context/QueryBuilderContext.test.tsx`**

```tsx
import { renderHook } from '@testing-library/react';
import { QueryBuilderProvider, useQueryBuilderContext } from './QueryBuilderContext';
import type { QueryBuilderContextValue } from './QueryBuilderContext';

const mockCtx: QueryBuilderContextValue = {
  query: { id: 'root', combinator: 'AND', rules: [] },
  fields: [],
  operators: [],
  addRule: vi.fn(),
  addGroup: vi.fn(),
  removeRule: vi.fn(),
  removeGroup: vi.fn(),
  updateRule: vi.fn(),
  setCombinator: vi.fn(),
};

describe('useQueryBuilderContext', () => {
  it('returns context value when used within provider', () => {
    const { result } = renderHook(() => useQueryBuilderContext(), {
      wrapper: ({ children }) => (
        <QueryBuilderProvider value={mockCtx}>{children}</QueryBuilderProvider>
      ),
    });
    expect(result.current).toBe(mockCtx);
  });

  it('throws when used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useQueryBuilderContext())).toThrow(
      'useQueryBuilderContext must be used within a <QueryBuilderProvider>'
    );
    spy.mockRestore();
  });
});
```

**Step 2: Run tests**

Run: `npx vitest run src/context/`
Expected: All tests pass.

**Step 3: Commit**

```bash
git add src/context/QueryBuilderContext.test.tsx
git commit -m "Add tests for QueryBuilderContext"
```

---

### Task 7: Test QueryBuilder component

**Files:**
- Create: `src/components/QueryBuilder.test.tsx`

**Step 1: Create `src/components/QueryBuilder.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { QueryBuilder } from './QueryBuilder';
import type { Group } from '../types';

const query: Group = {
  id: 'root', combinator: 'AND',
  rules: [{ id: 'r1', field: '', operator: 'eq', value: '' }],
};

describe('QueryBuilder', () => {
  it('renders children', () => {
    render(
      <QueryBuilder defaultValue={query}>
        <span data-testid="child">Hello</span>
      </QueryBuilder>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders hidden input with serialized query when name is provided', () => {
    const { container } = render(<QueryBuilder name="q" defaultValue={query} />);
    const input = container.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.name).toBe('q');
    expect(JSON.parse(input.value)).toMatchObject({ id: 'root', combinator: 'AND' });
  });

  it('does not render hidden input when name is not provided', () => {
    const { container } = render(<QueryBuilder defaultValue={query} />);
    expect(container.querySelector('input[type="hidden"]')).not.toBeInTheDocument();
  });

  it('applies className to root div', () => {
    const { container } = render(<QueryBuilder className="custom" defaultValue={query} />);
    expect(container.firstChild).toHaveClass('custom');
  });
});
```

**Step 2: Run tests**

Run: `npx vitest run src/components/`
Expected: All tests pass.

**Step 3: Commit**

```bash
git add src/components/QueryBuilder.test.tsx
git commit -m "Add tests for QueryBuilder component"
```

---

### Task 8: Test RuleRow component

**Files:**
- Create: `src/templates/shared/RuleRow.test.tsx`

Tests cover the `RuleRow` component and all `ValueInput` branches (text, number, date, boolean, select, select-without-options, null value).

**Step 1: Create `src/templates/shared/RuleRow.test.tsx`**

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { RuleRow } from './RuleRow';
import type { Rule } from '../../types';
import type { TemplateClassNames } from './types';

const cn: TemplateClassNames = {
  root: '', group: '', groupHeader: '', combinator: '',
  combinatorButton: '', combinatorButtonActiveAnd: '', combinatorButtonActiveOr: '',
  rules: '', rule: '', ruleField: '', ruleOperator: '',
  ruleValue: '', removeButton: '', addButton: '', addGroupButton: '',
};

const fields = [
  { name: 'name', label: 'Name' },
  { name: 'age', label: 'Age', type: 'number' as const },
  { name: 'dob', label: 'DOB', type: 'date' as const },
  { name: 'active', label: 'Active', type: 'boolean' as const },
  { name: 'status', label: 'Status', type: 'select' as const, options: [{ label: 'Open', value: 'open' }, { label: 'Closed', value: 'closed' }] },
  { name: 'broken', label: 'Broken', type: 'select' as const },
];

const operators = [{ name: 'eq', label: '=' }, { name: 'neq', label: '!=' }];

describe('RuleRow', () => {
  let onUpdate: ReturnType<typeof vi.fn>;
  let onRemove: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onUpdate = vi.fn();
    onRemove = vi.fn();
  });

  function renderRule(rule: Rule) {
    return render(
      <RuleRow rule={rule} fields={fields} operators={operators} classNames={cn} onUpdate={onUpdate} onRemove={onRemove} />
    );
  }

  // --- Field select ---

  it('renders field select with all fields and a placeholder', () => {
    renderRule({ id: 'r1', field: '', operator: 'eq', value: '' });
    const options = screen.getAllByRole('option');
    // placeholder + 6 fields + 2 operators = 9, but they're in separate selects
    // field select: 1 placeholder + 6 fields = 7
    expect(screen.getByDisplayValue('Select field...')).toBeInTheDocument();
  });

  it('calls onUpdate with reset value when field changes', () => {
    renderRule({ id: 'r1', field: '', operator: 'eq', value: '' });
    const fieldSelect = screen.getByDisplayValue('Select field...');
    fireEvent.change(fieldSelect, { target: { value: 'name' } });
    expect(onUpdate).toHaveBeenCalledWith('r1', { field: 'name', value: '' });
  });

  // --- Operator select ---

  it('calls onUpdate when operator changes', () => {
    renderRule({ id: 'r1', field: '', operator: 'eq', value: '' });
    const opSelect = screen.getByDisplayValue('=');
    fireEvent.change(opSelect, { target: { value: 'neq' } });
    expect(onUpdate).toHaveBeenCalledWith('r1', { operator: 'neq' });
  });

  // --- Remove button ---

  it('calls onRemove when remove button is clicked', () => {
    renderRule({ id: 'r1', field: '', operator: 'eq', value: '' });
    fireEvent.click(screen.getByText('Remove'));
    expect(onRemove).toHaveBeenCalledWith('r1');
  });

  // --- ValueInput: text (default, no field match) ---

  it('renders text input when field has no match', () => {
    renderRule({ id: 'r1', field: '', operator: 'eq', value: '' });
    expect(screen.getByPlaceholderText('Value')).toHaveAttribute('type', 'text');
  });

  it('renders text input for text-typed field', () => {
    renderRule({ id: 'r1', field: 'name', operator: 'eq', value: 'Alice' });
    expect(screen.getByDisplayValue('Alice')).toHaveAttribute('type', 'text');
  });

  it('calls onUpdate with string value for text input', () => {
    renderRule({ id: 'r1', field: 'name', operator: 'eq', value: '' });
    fireEvent.change(screen.getByPlaceholderText('Value'), { target: { value: 'Bob' } });
    expect(onUpdate).toHaveBeenCalledWith('r1', { value: 'Bob' });
  });

  // --- ValueInput: number ---

  it('renders number input for number-typed field', () => {
    renderRule({ id: 'r1', field: 'age', operator: 'eq', value: 25 });
    expect(screen.getByDisplayValue('25')).toHaveAttribute('type', 'number');
  });

  it('calls onUpdate with Number value for number input', () => {
    renderRule({ id: 'r1', field: 'age', operator: 'eq', value: '' });
    fireEvent.change(screen.getByPlaceholderText('Value'), { target: { value: '42' } });
    expect(onUpdate).toHaveBeenCalledWith('r1', { value: 42 });
  });

  // --- ValueInput: date ---

  it('renders date input for date-typed field', () => {
    renderRule({ id: 'r1', field: 'dob', operator: 'eq', value: '2025-01-01' });
    expect(screen.getByDisplayValue('2025-01-01')).toHaveAttribute('type', 'date');
  });

  // --- ValueInput: boolean ---

  it('renders boolean select with True/False options', () => {
    renderRule({ id: 'r1', field: 'active', operator: 'eq', value: '' });
    expect(screen.getByText('True')).toBeInTheDocument();
    expect(screen.getByText('False')).toBeInTheDocument();
  });

  it('calls onUpdate with boolean value for boolean select', () => {
    renderRule({ id: 'r1', field: 'active', operator: 'eq', value: '' });
    const boolSelect = screen.getByDisplayValue('Select...');
    fireEvent.change(boolSelect, { target: { value: 'true' } });
    expect(onUpdate).toHaveBeenCalledWith('r1', { value: true });
  });

  it('calls onUpdate with false for boolean select', () => {
    renderRule({ id: 'r1', field: 'active', operator: 'eq', value: '' });
    const boolSelect = screen.getByDisplayValue('Select...');
    fireEvent.change(boolSelect, { target: { value: 'false' } });
    expect(onUpdate).toHaveBeenCalledWith('r1', { value: false });
  });

  // --- ValueInput: select with options ---

  it('renders select dropdown with field options', () => {
    renderRule({ id: 'r1', field: 'status', operator: 'eq', value: '' });
    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByText('Closed')).toBeInTheDocument();
  });

  it('calls onUpdate with selected option value', () => {
    renderRule({ id: 'r1', field: 'status', operator: 'eq', value: '' });
    // Find the select that contains Open/Closed (not the field or operator selects)
    const selects = screen.getAllByRole('combobox');
    const valueSelect = selects[selects.length - 1];
    fireEvent.change(valueSelect, { target: { value: 'open' } });
    expect(onUpdate).toHaveBeenCalledWith('r1', { value: 'open' });
  });

  // --- ValueInput: select type without options (falls back to text input) ---

  it('renders text input when field type is select but has no options', () => {
    renderRule({ id: 'r1', field: 'broken', operator: 'eq', value: '' });
    expect(screen.getByPlaceholderText('Value')).toHaveAttribute('type', 'text');
  });

  // --- ValueInput: null/undefined value ---

  it('renders empty string for null value', () => {
    renderRule({ id: 'r1', field: 'name', operator: 'eq', value: null });
    expect(screen.getByPlaceholderText('Value')).toHaveValue('');
  });
});
```

**Step 2: Run tests**

Run: `npx vitest run src/templates/shared/RuleRow`
Expected: All tests pass.

**Step 3: Commit**

```bash
git add src/templates/shared/RuleRow.test.tsx
git commit -m "Add tests for RuleRow component (all ValueInput branches)"
```

---

### Task 9: Test GroupBlock component

**Files:**
- Create: `src/templates/shared/GroupBlock.test.tsx`

**Step 1: Create `src/templates/shared/GroupBlock.test.tsx`**

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { GroupBlock } from './GroupBlock';
import type { Group } from '../../types';
import type { TemplateClassNames } from './types';

const cn: TemplateClassNames = {
  root: '', group: 'group', groupHeader: '', combinator: '',
  combinatorButton: 'btn-inactive', combinatorButtonActiveAnd: 'btn-active-and',
  combinatorButtonActiveOr: 'btn-active-or',
  rules: '', rule: '', ruleField: '', ruleOperator: '',
  ruleValue: '', removeButton: 'remove-btn', addButton: 'add-btn',
  addGroupButton: 'add-group-btn',
};

const operators = [{ name: 'eq', label: '=' }];
const fields = [{ name: 'name', label: 'Name' }];

describe('GroupBlock', () => {
  let onAddRule: ReturnType<typeof vi.fn>;
  let onAddGroup: ReturnType<typeof vi.fn>;
  let onRemoveRule: ReturnType<typeof vi.fn>;
  let onRemoveGroup: ReturnType<typeof vi.fn>;
  let onUpdateRule: ReturnType<typeof vi.fn>;
  let onSetCombinator: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onAddRule = vi.fn();
    onAddGroup = vi.fn();
    onRemoveRule = vi.fn();
    onRemoveGroup = vi.fn();
    onUpdateRule = vi.fn();
    onSetCombinator = vi.fn();
  });

  function renderGroup(group: Group, isRoot = false) {
    return render(
      <GroupBlock
        group={group} isRoot={isRoot} fields={fields} operators={operators}
        classNames={cn} onAddRule={onAddRule} onAddGroup={onAddGroup}
        onRemoveRule={onRemoveRule} onRemoveGroup={onRemoveGroup}
        onUpdateRule={onUpdateRule} onSetCombinator={onSetCombinator}
      />
    );
  }

  const groupAnd: Group = {
    id: 'g1', combinator: 'AND',
    rules: [{ id: 'r1', field: 'name', operator: 'eq', value: 'test' }],
  };

  const groupOr: Group = {
    id: 'g1', combinator: 'OR',
    rules: [{ id: 'r1', field: 'name', operator: 'eq', value: 'test' }],
  };

  // --- Combinator buttons ---

  it('shows AND button as active when combinator is AND', () => {
    renderGroup(groupAnd);
    expect(screen.getByText('AND')).toHaveClass('btn-active-and');
    expect(screen.getByText('OR')).toHaveClass('btn-inactive');
  });

  it('shows OR button as active when combinator is OR', () => {
    renderGroup(groupOr);
    expect(screen.getByText('OR')).toHaveClass('btn-active-or');
    expect(screen.getByText('AND')).toHaveClass('btn-inactive');
  });

  it('calls onSetCombinator when AND button is clicked', () => {
    renderGroup(groupOr);
    fireEvent.click(screen.getByText('AND'));
    expect(onSetCombinator).toHaveBeenCalledWith('g1', 'AND');
  });

  it('calls onSetCombinator when OR button is clicked', () => {
    renderGroup(groupAnd);
    fireEvent.click(screen.getByText('OR'));
    expect(onSetCombinator).toHaveBeenCalledWith('g1', 'OR');
  });

  // --- Add buttons ---

  it('calls onAddRule with group id when + Rule is clicked', () => {
    renderGroup(groupAnd);
    fireEvent.click(screen.getByText('+ Rule'));
    expect(onAddRule).toHaveBeenCalledWith('g1');
  });

  it('calls onAddGroup with group id when + Group is clicked', () => {
    renderGroup(groupAnd);
    fireEvent.click(screen.getByText('+ Group'));
    expect(onAddGroup).toHaveBeenCalledWith('g1');
  });

  // --- Remove button ---

  it('does not render remove button when isRoot is true', () => {
    renderGroup(groupAnd, true);
    // Only the rule's remove button should be present, not the group's
    const removeButtons = screen.getAllByText('Remove');
    expect(removeButtons).toHaveLength(1); // only rule's remove
  });

  it('renders remove button when isRoot is false', () => {
    renderGroup(groupAnd, false);
    const removeButtons = screen.getAllByText('Remove');
    expect(removeButtons).toHaveLength(2); // rule's remove + group's remove
  });

  it('calls onRemoveGroup when group remove button is clicked', () => {
    renderGroup(groupAnd, false);
    const removeButtons = screen.getAllByText('Remove');
    // Group remove is in the header, before the rules. It's the first one.
    fireEvent.click(removeButtons[0]);
    expect(onRemoveGroup).toHaveBeenCalledWith('g1');
  });

  // --- Nested group rendering ---

  it('renders nested GroupBlock for group items', () => {
    const nested: Group = {
      id: 'g1', combinator: 'AND',
      rules: [
        { id: 'g2', combinator: 'OR', rules: [{ id: 'r1', field: '', operator: 'eq', value: '' }] },
      ],
    };
    renderGroup(nested);
    // Both groups should render AND/OR buttons
    const andButtons = screen.getAllByText('AND');
    expect(andButtons).toHaveLength(2); // parent AND + nested AND
  });

  // --- Rule rendering ---

  it('renders RuleRow for rule items', () => {
    renderGroup(groupAnd);
    // RuleRow renders a Remove button and field/operator selects
    expect(screen.getByText('Remove')).toBeInTheDocument();
  });
});
```

**Step 2: Run tests**

Run: `npx vitest run src/templates/shared/GroupBlock`
Expected: All tests pass.

**Step 3: Commit**

```bash
git add src/templates/shared/GroupBlock.test.tsx
git commit -m "Add tests for GroupBlock component"
```

---

### Task 10: Test TemplateQueryBuilder component

**Files:**
- Create: `src/templates/shared/TemplateQueryBuilder.test.tsx`

**Step 1: Create `src/templates/shared/TemplateQueryBuilder.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { TemplateQueryBuilder } from './TemplateQueryBuilder';
import type { TemplateClassNames } from './types';

const cn: TemplateClassNames = {
  root: 'root-class', group: '', groupHeader: '', combinator: '',
  combinatorButton: '', combinatorButtonActiveAnd: '', combinatorButtonActiveOr: '',
  rules: '', rule: '', ruleField: '', ruleOperator: '',
  ruleValue: '', removeButton: '', addButton: '', addGroupButton: '',
};

describe('TemplateQueryBuilder', () => {
  it('renders with classNames.root when no className provided', () => {
    const { container } = render(<TemplateQueryBuilder classNames={cn} />);
    expect(container.firstChild).toHaveClass('root-class');
    expect((container.firstChild as HTMLElement).className).toBe('root-class');
  });

  it('merges className with classNames.root', () => {
    const { container } = render(<TemplateQueryBuilder classNames={cn} className="custom" />);
    expect(container.firstChild).toHaveClass('root-class');
    expect(container.firstChild).toHaveClass('custom');
  });

  it('renders hidden input when name is provided', () => {
    const { container } = render(<TemplateQueryBuilder classNames={cn} name="q" />);
    const input = container.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.name).toBe('q');
  });

  it('does not render hidden input when name is not provided', () => {
    const { container } = render(<TemplateQueryBuilder classNames={cn} />);
    expect(container.querySelector('input[type="hidden"]')).not.toBeInTheDocument();
  });

  it('spreads rootProps onto root div', () => {
    render(<TemplateQueryBuilder classNames={cn} rootProps={{ 'data-testid': 'qb-root' }} />);
    expect(screen.getByTestId('qb-root')).toBeInTheDocument();
  });
});
```

**Step 2: Run tests**

Run: `npx vitest run src/templates/shared/TemplateQueryBuilder`
Expected: All tests pass.

**Step 3: Commit**

```bash
git add src/templates/shared/TemplateQueryBuilder.test.tsx
git commit -m "Add tests for TemplateQueryBuilder component"
```

---

### Task 11: Test template variants (tailwind, bootstrap, unstyled)

**Files:**
- Create: `src/templates/tailwind/index.test.tsx`
- Create: `src/templates/bootstrap/index.test.tsx`
- Create: `src/templates/unstyled/index.test.tsx`

**Step 1: Create `src/templates/tailwind/index.test.tsx`**

```tsx
import { render } from '@testing-library/react';
import { TailwindQueryBuilder } from './index';

describe('TailwindQueryBuilder', () => {
  it('renders with tailwind root class', () => {
    const { container } = render(<TailwindQueryBuilder />);
    expect(container.firstChild).toHaveClass('font-sans');
  });
});
```

**Step 2: Create `src/templates/bootstrap/index.test.tsx`**

```tsx
import { render } from '@testing-library/react';
import { BootstrapQueryBuilder } from './index';

describe('BootstrapQueryBuilder', () => {
  it('sets data-bs-theme when colorMode is provided', () => {
    const { container } = render(<BootstrapQueryBuilder colorMode="dark" />);
    expect(container.firstChild).toHaveAttribute('data-bs-theme', 'dark');
  });

  it('does not set data-bs-theme when colorMode is not provided', () => {
    const { container } = render(<BootstrapQueryBuilder />);
    expect(container.firstChild).not.toHaveAttribute('data-bs-theme');
  });
});
```

**Step 3: Create `src/templates/unstyled/index.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { UnstyledQueryBuilder } from './index';

describe('UnstyledQueryBuilder', () => {
  it('renders without errors', () => {
    render(<UnstyledQueryBuilder />);
    expect(screen.getByText('AND')).toBeInTheDocument();
  });
});
```

**Step 4: Run tests**

Run: `npx vitest run src/templates/tailwind src/templates/bootstrap src/templates/unstyled`
Expected: All tests pass.

**Step 5: Commit**

```bash
git add src/templates/tailwind/index.test.tsx src/templates/bootstrap/index.test.tsx src/templates/unstyled/index.test.tsx
git commit -m "Add tests for template variants (tailwind, bootstrap, unstyled)"
```

---

### Task 12: Verify 100% coverage and create PR

**Step 1: Run full coverage report**

Run: `npm run test:coverage`
Expected: All tests pass. Coverage report shows 100% across lines, branches, functions, statements.

**Step 2: If any gaps remain, add targeted tests**

Check the coverage report (printed to terminal). For any uncovered lines/branches, add targeted tests to the appropriate test file and re-run.

**Step 3: Commit any gap-filling tests**

```bash
git add -A
git commit -m "Fill remaining coverage gaps"
```

**Step 4: Create PR**

```bash
git checkout -b feat/100-percent-test-coverage
git push -u origin feat/100-percent-test-coverage
gh pr create --title "Add 100% test coverage" --body "$(cat <<'EOF'
## Summary
- Configure vitest coverage with 100% thresholds (lines, branches, functions, statements)
- Simplify `updateGroupRecursive` to remove unreachable dead code branches
- Add ~100 unit tests across 12 test files covering all source code
- Test files: core utilities, type guards, hooks, context, components, and all template variants

## Test plan
- [ ] `npm run test:coverage` passes with 100% across all metrics
- [ ] `npm run build` succeeds
- [ ] No regressions in existing Storybook stories

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```
