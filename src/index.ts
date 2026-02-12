// Types
export type {
  Rule,
  Group,
  QueryBuilderProps,
  FieldDefinition,
  OperatorDefinition,
} from './types';
export { isGroup } from './types';

// Core utilities
export {
  generateId,
  createEmptyRule,
  createEmptyGroup,
  DEFAULT_OPERATORS,
  DEFAULT_FIELDS,
} from './core';

// Hooks (primary API)
export { useQueryBuilder } from './hooks';

// Context
export { QueryBuilderContext, QueryBuilderProvider } from './context';
export type { QueryBuilderContextValue } from './context';

// Components
export { QueryBuilder } from './components';
