import { describe, expect, it } from 'vitest';
import { QueryBuilderContext, QueryBuilderProvider } from './index';

describe('context/index barrel exports', () => {
  it('exports context and provider', () => {
    expect(QueryBuilderContext).toBeDefined();
    expect(QueryBuilderProvider).toBeDefined();
  });
});
