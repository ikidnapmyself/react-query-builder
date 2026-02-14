import { describe, expect, it } from 'vitest';
import {
  isGroup,
  generateId,
  createEmptyRule,
  createEmptyGroup,
  DEFAULT_OPERATORS,
  DEFAULT_FIELDS,
  useQueryBuilder,
  QueryBuilderContext,
  QueryBuilderProvider,
  QueryBuilder,
} from './index';

describe('src/index barrel exports', () => {
  it('exports all public API', () => {
    expect(isGroup).toBeDefined();
    expect(generateId).toBeDefined();
    expect(createEmptyRule).toBeDefined();
    expect(createEmptyGroup).toBeDefined();
    expect(DEFAULT_OPERATORS).toBeDefined();
    expect(DEFAULT_FIELDS).toBeDefined();
    expect(useQueryBuilder).toBeDefined();
    expect(QueryBuilderContext).toBeDefined();
    expect(QueryBuilderProvider).toBeDefined();
    expect(QueryBuilder).toBeDefined();
  });
});
