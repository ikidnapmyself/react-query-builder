import type { Group, FieldDefinition, OperatorDefinition } from '../types';
import { generateId } from './id';

export function createEmptyRule() {
  return {
    id: generateId(),
    field: '',
    operator: 'eq',
    value: '',
  };
}

export function createEmptyGroup(combinator: 'AND' | 'OR' = 'AND'): Group {
  return {
    id: generateId(),
    combinator,
    rules: [createEmptyRule()],
  };
}

export const DEFAULT_OPERATORS: OperatorDefinition[] = [
  { name: 'eq', label: '=' },
  { name: 'neq', label: '!=' },
  { name: 'gt', label: '>' },
  { name: 'gte', label: '>=' },
  { name: 'lt', label: '<' },
  { name: 'lte', label: '<=' },
  { name: 'contains', label: 'contains' },
  { name: 'not_contains', label: 'not contains' },
  { name: 'between', label: 'between' },
  { name: 'in', label: 'in' },
  { name: 'not_in', label: 'not in' },
];

export const DEFAULT_FIELDS: FieldDefinition[] = [];
