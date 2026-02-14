# react-query-builder

[![CI](https://github.com/ikidnapmyself/react-query-builder/actions/workflows/ci.yml/badge.svg)](https://github.com/ikidnapmyself/react-query-builder/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/ikidnapmyself/react-query-builder/graph/badge.svg)](https://codecov.io/gh/ikidnapmyself/react-query-builder)

A composable, headless React 19 query builder component for conditional logic UIs.

Build complex nested conditions with AND, OR, and GROUP operations. The output is a structured JSON tree — plug it into alert managers, trading bots, IFTTT-style automations, pipeline managers, or anything that needs user-defined rules.

## Features

- **Composition-first API** — hooks as the primary interface, compound components for convenience, pre-built templates for zero setup
- **Headless by default** — bring your own markup, or use a template preset
- **Tailwind CSS** default styling with Bootstrap and unstyled alternatives
- **Controlled & uncontrolled** — works both ways, just like a native input
- **TypeScript** — fully typed, all types exported
- **Recursive nesting** — groups within groups, unlimited depth
- **Framework-agnostic output** — plain JSON, no vendor lock-in

## Installation

```bash
npm install react-query-builder
```

Peer dependencies:

```bash
npm install react@^19.0.0 react-dom@^19.0.0
```

## Quick Start

### Hooks (full control)

The primary API. You call hooks, you render whatever you want.

```tsx
import { useQueryBuilder } from 'react-query-builder';

function MyQueryBuilder() {
  const { query, addRule, addGroup, removeRule, updateRule, setCombinator } =
    useQueryBuilder();

  return (
    <div>
      <select
        value={query.combinator}
        onChange={(e) => setCombinator(query.id, e.target.value as 'AND' | 'OR')}
      >
        <option value="AND">AND</option>
        <option value="OR">OR</option>
      </select>

      {query.rules.map((rule) => {
        if ('combinator' in rule) {
          return <div key={rule.id}>Nested group: {rule.combinator}</div>;
        }
        return (
          <div key={rule.id}>
            <input
              value={rule.field}
              onChange={(e) => updateRule(rule.id, { field: e.target.value })}
              placeholder="Field"
            />
            <input
              value={String(rule.value)}
              onChange={(e) => updateRule(rule.id, { value: e.target.value })}
              placeholder="Value"
            />
            <button onClick={() => removeRule(rule.id)}>Remove</button>
          </div>
        );
      })}

      <button onClick={() => addRule(query.id)}>+ Rule</button>
      <button onClick={() => addGroup(query.id)}>+ Group</button>
    </div>
  );
}
```

### Component wrapper (with context)

Wraps `useQueryBuilder` in a provider so child components can access the query state via context.

```tsx
import { useState } from 'react';
import { QueryBuilder, createEmptyGroup } from 'react-query-builder';
import type { Group } from 'react-query-builder';

function App() {
  const [query, setQuery] = useState<Group>(createEmptyGroup);

  return (
    <QueryBuilder value={query} onChange={setQuery}>
      {/* Child components can use useQueryBuilderContext() */}
      <pre>{JSON.stringify(query, null, 2)}</pre>
    </QueryBuilder>
  );
}
```

### Form submission

Pass a `name` prop to render a hidden input with the serialized JSON:

```tsx
<form onSubmit={handleSubmit}>
  <QueryBuilder name="query" defaultValue={initialQuery}>
    {/* ... */}
  </QueryBuilder>
  <button type="submit">Save</button>
</form>
```

The hidden input value will be the JSON string of the current query state.

## Data Model

The query is a recursive tree of rules and groups:

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

Example output:

```json
{
  "id": "qb-1",
  "combinator": "AND",
  "rules": [
    { "id": "qb-2", "field": "temperature", "operator": "gt", "value": 100 },
    { "id": "qb-3", "field": "status", "operator": "eq", "value": "critical" },
    {
      "id": "qb-4",
      "combinator": "OR",
      "rules": [
        { "id": "qb-5", "field": "region", "operator": "eq", "value": "us-east" },
        { "id": "qb-6", "field": "region", "operator": "eq", "value": "eu-west" }
      ]
    }
  ]
}
```

## API Reference

### `useQueryBuilder(options?)`

The primary hook. Returns the query state and all mutation functions.

**Options:**

| Option | Type | Description |
|---|---|---|
| `value` | `Group` | Controlled query value |
| `defaultValue` | `Group` | Initial value for uncontrolled usage |
| `onChange` | `(query: Group) => void` | Called on every change |
| `fields` | `FieldDefinition[]` | Available fields for rules |
| `operators` | `OperatorDefinition[]` | Available operators (defaults provided) |

**Returns:**

| Property | Type | Description |
|---|---|---|
| `query` | `Group` | Current query state |
| `fields` | `FieldDefinition[]` | Available fields |
| `operators` | `OperatorDefinition[]` | Available operators |
| `addRule` | `(groupId: string) => void` | Add a rule to a group |
| `addGroup` | `(groupId: string) => void` | Add a nested group |
| `removeRule` | `(ruleId: string) => void` | Remove a rule |
| `removeGroup` | `(groupId: string) => void` | Remove a group |
| `updateRule` | `(ruleId: string, updates: Partial<Rule>) => void` | Update a rule's field, operator, or value |
| `setCombinator` | `(groupId: string, combinator: 'AND' \| 'OR') => void` | Change a group's combinator |

### `<QueryBuilder>`

Component wrapper that creates a context provider.

| Prop | Type | Description |
|---|---|---|
| `value` | `Group` | Controlled value |
| `defaultValue` | `Group` | Initial value (uncontrolled) |
| `onChange` | `(query: Group) => void` | Change callback |
| `name` | `string` | Hidden input name for form submission |
| `fields` | `FieldDefinition[]` | Available fields |
| `operators` | `OperatorDefinition[]` | Available operators |
| `className` | `string` | CSS class for the root element |
| `children` | `ReactNode` | Child components |

### `useQueryBuilderContext()`

Access the query builder state from any child of `<QueryBuilder>`. Returns the same shape as `useQueryBuilder`.

### Utilities

| Export | Description |
|---|---|
| `createEmptyRule()` | Create a new rule with a generated ID |
| `createEmptyGroup(combinator?)` | Create a new group (defaults to `'AND'`) |
| `generateId()` | Generate a unique ID |
| `isGroup(item)` | Type guard — check if a rule-or-group is a `Group` |
| `DEFAULT_OPERATORS` | Built-in operator list (`=`, `!=`, `>`, `>=`, `<`, `<=`, `contains`, `not contains`, `between`, `in`, `not in`) |

## Defining Fields

```typescript
import type { FieldDefinition } from 'react-query-builder';

const fields: FieldDefinition[] = [
  { name: 'temperature', label: 'Temperature', type: 'number' },
  { name: 'status', label: 'Status', type: 'select', options: [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ]},
  { name: 'created_at', label: 'Created At', type: 'date' },
  { name: 'name', label: 'Name', type: 'text' },
];
```

Supported field types: `text`, `number`, `date`, `boolean`, `select`.

## Custom Operators

```typescript
import type { OperatorDefinition } from 'react-query-builder';

const operators: OperatorDefinition[] = [
  { name: 'eq', label: 'equals' },
  { name: 'gt', label: 'greater than' },
  { name: 'lt', label: 'less than' },
  { name: 'crosses_above', label: 'crosses above' },
  { name: 'crosses_below', label: 'crosses below' },
];
```

## Templates

The library ships with template presets for common CSS frameworks:

```tsx
// Tailwind (default)
import { TailwindQueryBuilder } from 'react-query-builder/templates/tailwind';

// Bootstrap
import { BootstrapQueryBuilder } from 'react-query-builder/templates/bootstrap';

// Unstyled (headless, no classes)
import { UnstyledQueryBuilder } from 'react-query-builder/templates/unstyled';
```

Templates are built on top of the same hooks and context — they're just pre-styled component trees. You can use them as-is or as a reference for building your own.

## Use Cases

All use cases are available as interactive Storybook stories across all three templates (Tailwind, Bootstrap, Unstyled). Each includes a complex preset showing a realistic initial query.

### Alert Manager

Define when alerts fire based on metric thresholds.

```tsx
import { TailwindQueryBuilder } from 'react-query-builder/templates/tailwind';

const fields = [
  { name: 'cpu_usage', label: 'CPU Usage (%)', type: 'number' as const },
  { name: 'memory_usage', label: 'Memory Usage (%)', type: 'number' as const },
  { name: 'error_rate', label: 'Error Rate', type: 'number' as const },
  { name: 'response_time', label: 'Response Time (ms)', type: 'number' as const },
  { name: 'service', label: 'Service', type: 'select' as const, options: [
    { label: 'API', value: 'api' },
    { label: 'Worker', value: 'worker' },
    { label: 'Database', value: 'db' },
    { label: 'Cache', value: 'cache' },
  ]},
  { name: 'region', label: 'Region', type: 'select' as const, options: [
    { label: 'US East', value: 'us-east' },
    { label: 'US West', value: 'us-west' },
    { label: 'EU West', value: 'eu-west' },
  ]},
  { name: 'is_production', label: 'Is Production', type: 'boolean' as const },
];

<TailwindQueryBuilder fields={fields} onChange={saveAlertCondition} />
```

### Algorithmic Trading

Build entry/exit conditions for trading strategies.

```tsx
import { TailwindQueryBuilder } from 'react-query-builder/templates/tailwind';

const fields = [
  { name: 'price', label: 'Price', type: 'number' as const },
  { name: 'rsi', label: 'RSI (14)', type: 'number' as const },
  { name: 'volume', label: 'Volume', type: 'number' as const },
  { name: 'sma_20', label: 'SMA (20)', type: 'number' as const },
  { name: 'ema_50', label: 'EMA (50)', type: 'number' as const },
  { name: 'macd', label: 'MACD', type: 'number' as const },
  { name: 'market', label: 'Market', type: 'select' as const, options: [
    { label: 'BTC/USD', value: 'btc-usd' },
    { label: 'ETH/USD', value: 'eth-usd' },
    { label: 'SOL/USD', value: 'sol-usd' },
    { label: 'AAPL', value: 'aapl' },
  ]},
];

const operators = [
  { name: 'gt', label: '>' },
  { name: 'lt', label: '<' },
  { name: 'gte', label: '>=' },
  { name: 'lte', label: '<=' },
  { name: 'eq', label: '=' },
  { name: 'crosses_above', label: 'crosses above' },
  { name: 'crosses_below', label: 'crosses below' },
];

<TailwindQueryBuilder fields={fields} operators={operators} onChange={updateStrategy} />
```

### IFTTT / Automation

Compose "if this then that" trigger conditions.

```tsx
const fields = [
  { name: 'trigger', label: 'Trigger', type: 'select' as const, options: [
    { label: 'Email received', value: 'email_received' },
    { label: 'File uploaded', value: 'file_uploaded' },
    { label: 'Webhook fired', value: 'webhook' },
    { label: 'Schedule', value: 'schedule' },
  ]},
  { name: 'sender', label: 'Sender', type: 'text' as const },
  { name: 'file_type', label: 'File Type', type: 'text' as const },
  { name: 'priority', label: 'Priority', type: 'select' as const, options: [
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
  ]},
  { name: 'is_recurring', label: 'Is Recurring', type: 'boolean' as const },
];
```

### Pipeline Manager

Define branching logic and conditional steps in CI/CD pipelines.

```tsx
const fields = [
  { name: 'branch', label: 'Branch', type: 'text' as const },
  { name: 'env', label: 'Environment', type: 'select' as const, options: [
    { label: 'Production', value: 'prod' },
    { label: 'Staging', value: 'staging' },
    { label: 'Development', value: 'dev' },
  ]},
  { name: 'test_coverage', label: 'Test Coverage (%)', type: 'number' as const },
  { name: 'has_migrations', label: 'Has Migrations', type: 'boolean' as const },
  { name: 'label', label: 'PR Label', type: 'select' as const, options: [
    { label: 'hotfix', value: 'hotfix' },
    { label: 'feature', value: 'feature' },
    { label: 'chore', value: 'chore' },
  ]},
];
```

### Email Filtering

Build rules for sorting, labeling, or forwarding emails.

```tsx
const fields = [
  { name: 'from', label: 'From', type: 'text' as const },
  { name: 'to', label: 'To', type: 'text' as const },
  { name: 'subject', label: 'Subject', type: 'text' as const },
  { name: 'has_attachment', label: 'Has Attachment', type: 'boolean' as const },
  { name: 'category', label: 'Category', type: 'select' as const, options: [
    { label: 'Primary', value: 'primary' },
    { label: 'Social', value: 'social' },
    { label: 'Promotions', value: 'promotions' },
    { label: 'Spam', value: 'spam' },
  ]},
  { name: 'size_kb', label: 'Size (KB)', type: 'number' as const },
];
```

### Data Validation

Define validation rules for form fields or data imports.

```tsx
const fields = [
  { name: 'field_name', label: 'Field Name', type: 'select' as const, options: [
    { label: 'Email', value: 'email' },
    { label: 'Phone', value: 'phone' },
    { label: 'Age', value: 'age' },
    { label: 'Username', value: 'username' },
  ]},
  { name: 'value_length', label: 'Value Length', type: 'number' as const },
  { name: 'is_required', label: 'Is Required', type: 'boolean' as const },
  { name: 'format', label: 'Format', type: 'select' as const, options: [
    { label: 'Email', value: 'email' },
    { label: 'URL', value: 'url' },
    { label: 'Phone', value: 'phone' },
    { label: 'Numeric', value: 'numeric' },
  ]},
  { name: 'min_value', label: 'Min Value', type: 'number' as const },
  { name: 'max_value', label: 'Max Value', type: 'number' as const },
];
```

### Access Control

Define permission rules for role-based access.

```tsx
const fields = [
  { name: 'role', label: 'Role', type: 'select' as const, options: [
    { label: 'Admin', value: 'admin' },
    { label: 'Editor', value: 'editor' },
    { label: 'Viewer', value: 'viewer' },
    { label: 'Guest', value: 'guest' },
  ]},
  { name: 'resource', label: 'Resource', type: 'select' as const, options: [
    { label: 'Dashboard', value: 'dashboard' },
    { label: 'Users', value: 'users' },
    { label: 'Settings', value: 'settings' },
    { label: 'Billing', value: 'billing' },
  ]},
  { name: 'action', label: 'Action', type: 'select' as const, options: [
    { label: 'Read', value: 'read' },
    { label: 'Write', value: 'write' },
    { label: 'Delete', value: 'delete' },
  ]},
  { name: 'is_2fa_enabled', label: '2FA Enabled', type: 'boolean' as const },
];
```

### Search / Content Filtering

Build advanced search queries for content or products.

```tsx
const fields = [
  { name: 'title', label: 'Title', type: 'text' as const },
  { name: 'author', label: 'Author', type: 'text' as const },
  { name: 'category', label: 'Category', type: 'select' as const, options: [
    { label: 'Technology', value: 'tech' },
    { label: 'Science', value: 'science' },
    { label: 'Business', value: 'business' },
    { label: 'Design', value: 'design' },
  ]},
  { name: 'published_date', label: 'Published Date', type: 'date' as const },
  { name: 'rating', label: 'Rating', type: 'number' as const },
  { name: 'is_featured', label: 'Is Featured', type: 'boolean' as const },
  { name: 'price', label: 'Price', type: 'number' as const },
];

## Development

```bash
# Install dependencies
npm install

# Start Storybook dev server
npm run dev

# Build the library
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint
npm run lint

# Build Storybook for deployment
npm run build-storybook
```

## License

MIT
