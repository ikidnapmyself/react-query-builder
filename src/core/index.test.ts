import { describe, expect, it } from 'vitest';
import {
  generateId,
  createEmptyRule,
  createEmptyGroup,
  DEFAULT_OPERATORS,
  DEFAULT_FIELDS,
} from './index';

describe('core/index barrel exports', () => {
  it('exports all core utilities', () => {
    expect(generateId).toBeDefined();
    expect(createEmptyRule).toBeDefined();
    expect(createEmptyGroup).toBeDefined();
    expect(DEFAULT_OPERATORS).toBeDefined();
    expect(DEFAULT_FIELDS).toBeDefined();
  });
});
