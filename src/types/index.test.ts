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
