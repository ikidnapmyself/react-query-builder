import { describe, expect, it } from 'vitest';
import { QueryBuilder } from './index';

describe('components/index barrel exports', () => {
  it('exports QueryBuilder', () => {
    expect(QueryBuilder).toBeDefined();
  });
});
