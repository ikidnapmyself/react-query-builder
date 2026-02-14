import { describe, expect, it } from 'vitest';
import { useQueryBuilder } from './index';

describe('hooks/index barrel exports', () => {
  it('exports useQueryBuilder', () => {
    expect(useQueryBuilder).toBeDefined();
  });
});
