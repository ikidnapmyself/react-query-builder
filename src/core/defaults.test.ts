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
