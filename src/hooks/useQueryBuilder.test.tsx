import { renderHook, act } from '@testing-library/react';
import { useQueryBuilder } from './useQueryBuilder';
import type { Group } from '../types';

describe('useQueryBuilder', () => {
  // --- Initialization ---

  describe('initialization', () => {
    it('creates a default empty group when no options provided', () => {
      const { result } = renderHook(() => useQueryBuilder());
      expect(result.current.query.combinator).toBe('AND');
      expect(result.current.query.rules).toHaveLength(1);
    });

    it('uses defaultValue when provided', () => {
      const defaultValue: Group = {
        id: 'root', combinator: 'OR',
        rules: [{ id: 'r1', field: 'name', operator: 'eq', value: 'test' }],
      };
      const { result } = renderHook(() => useQueryBuilder({ defaultValue }));
      expect(result.current.query).toBe(defaultValue);
    });

    it('uses controlled value when provided', () => {
      const value: Group = { id: 'root', combinator: 'AND', rules: [] };
      const { result } = renderHook(() => useQueryBuilder({ value }));
      expect(result.current.query).toBe(value);
    });

    it('uses default fields (empty) and operators (11) when not provided', () => {
      const { result } = renderHook(() => useQueryBuilder());
      expect(result.current.fields).toEqual([]);
      expect(result.current.operators).toHaveLength(11);
    });

    it('uses custom fields and operators when provided', () => {
      const fields = [{ name: 'age', label: 'Age' }];
      const operators = [{ name: 'eq', label: '=' }];
      const { result } = renderHook(() => useQueryBuilder({ fields, operators }));
      expect(result.current.fields).toBe(fields);
      expect(result.current.operators).toBe(operators);
    });
  });

  // --- addRule ---

  describe('addRule', () => {
    it('adds a rule to the root group', () => {
      const { result } = renderHook(() => useQueryBuilder());
      const rootId = result.current.query.id;
      act(() => result.current.addRule(rootId));
      expect(result.current.query.rules).toHaveLength(2);
    });

    it('adds a rule to a nested group', () => {
      const defaultValue: Group = {
        id: 'root', combinator: 'AND',
        rules: [
          { id: 'r0', field: '', operator: 'eq', value: '' },
          { id: 'g1', combinator: 'OR', rules: [{ id: 'r1', field: '', operator: 'eq', value: '' }] },
        ],
      };
      const { result } = renderHook(() => useQueryBuilder({ defaultValue }));
      act(() => result.current.addRule('g1'));
      const nested = result.current.query.rules[1] as Group;
      expect(nested.rules).toHaveLength(2);
    });
  });

  // --- addGroup ---

  describe('addGroup', () => {
    it('adds a nested group to the root', () => {
      const { result } = renderHook(() => useQueryBuilder());
      const rootId = result.current.query.id;
      act(() => result.current.addGroup(rootId));
      expect(result.current.query.rules).toHaveLength(2);
      const added = result.current.query.rules[1] as Group;
      expect(added.combinator).toBe('AND');
      expect(added.rules).toHaveLength(1);
    });
  });

  // --- removeRule ---

  describe('removeRule', () => {
    it('removes a rule from the root group', () => {
      const defaultValue: Group = {
        id: 'root', combinator: 'AND',
        rules: [
          { id: 'r1', field: '', operator: 'eq', value: '' },
          { id: 'r2', field: '', operator: 'eq', value: '' },
        ],
      };
      const { result } = renderHook(() => useQueryBuilder({ defaultValue }));
      act(() => result.current.removeRule('r1'));
      expect(result.current.query.rules).toHaveLength(1);
      expect(result.current.query.rules[0].id).toBe('r2');
    });

    it('removes a rule from a nested group', () => {
      const defaultValue: Group = {
        id: 'root', combinator: 'AND',
        rules: [{
          id: 'g1', combinator: 'OR',
          rules: [
            { id: 'r1', field: '', operator: 'eq', value: '' },
            { id: 'r2', field: '', operator: 'eq', value: '' },
          ],
        }],
      };
      const { result } = renderHook(() => useQueryBuilder({ defaultValue }));
      act(() => result.current.removeRule('r1'));
      const nested = result.current.query.rules[0] as Group;
      expect(nested.rules).toHaveLength(1);
      expect(nested.rules[0].id).toBe('r2');
    });
  });

  // --- removeGroup ---

  describe('removeGroup', () => {
    it('removes a nested group', () => {
      const defaultValue: Group = {
        id: 'root', combinator: 'AND',
        rules: [
          { id: 'r1', field: '', operator: 'eq', value: '' },
          { id: 'g1', combinator: 'OR', rules: [] },
        ],
      };
      const { result } = renderHook(() => useQueryBuilder({ defaultValue }));
      act(() => result.current.removeGroup('g1'));
      expect(result.current.query.rules).toHaveLength(1);
      expect(result.current.query.rules[0].id).toBe('r1');
    });
  });

  // --- updateRule ---

  describe('updateRule', () => {
    it('updates a rule in the root group', () => {
      const defaultValue: Group = {
        id: 'root', combinator: 'AND',
        rules: [
          { id: 'r1', field: '', operator: 'eq', value: '' },
          { id: 'r2', field: '', operator: 'eq', value: '' },
        ],
      };
      const { result } = renderHook(() => useQueryBuilder({ defaultValue }));
      act(() => result.current.updateRule('r1', { field: 'name', value: 'test' }));
      const rule = result.current.query.rules[0] as { id: string; field: string; value: unknown };
      expect(rule.field).toBe('name');
      expect(rule.value).toBe('test');
      expect(result.current.query.rules[1].id).toBe('r2');
    });

    it('updates a deeply nested rule (3 levels)', () => {
      const defaultValue: Group = {
        id: 'root', combinator: 'AND',
        rules: [
          { id: 'r0', field: '', operator: 'eq', value: '' },
          {
            id: 'g1', combinator: 'OR',
            rules: [{
              id: 'g2', combinator: 'AND',
              rules: [{ id: 'r1', field: '', operator: 'eq', value: '' }],
            }],
          },
        ],
      };
      const { result } = renderHook(() => useQueryBuilder({ defaultValue }));
      act(() => result.current.updateRule('r1', { field: 'age' }));
      const g1 = result.current.query.rules[1] as Group;
      const g2 = g1.rules[0] as Group;
      expect((g2.rules[0] as { field: string }).field).toBe('age');
    });
  });

  // --- setCombinator ---

  describe('setCombinator', () => {
    it('changes the root group combinator', () => {
      const { result } = renderHook(() => useQueryBuilder());
      act(() => result.current.setCombinator(result.current.query.id, 'OR'));
      expect(result.current.query.combinator).toBe('OR');
    });

    it('changes a nested group combinator', () => {
      const defaultValue: Group = {
        id: 'root', combinator: 'AND',
        rules: [
          { id: 'r0', field: '', operator: 'eq', value: '' },
          { id: 'g1', combinator: 'AND', rules: [{ id: 'r1', field: '', operator: 'eq', value: '' }] },
        ],
      };
      const { result } = renderHook(() => useQueryBuilder({ defaultValue }));
      act(() => result.current.setCombinator('g1', 'OR'));
      const nested = result.current.query.rules[1] as Group;
      expect(nested.combinator).toBe('OR');
    });

    it('returns same query when groupId does not exist', () => {
      const defaultValue: Group = {
        id: 'root', combinator: 'AND',
        rules: [
          { id: 'r0', field: '', operator: 'eq', value: '' },
          { id: 'g1', combinator: 'AND', rules: [{ id: 'r1', field: '', operator: 'eq', value: '' }] },
        ],
      };
      const { result } = renderHook(() => useQueryBuilder({ defaultValue }));
      const before = result.current.query;
      act(() => result.current.setCombinator('nonexistent', 'OR'));
      expect(result.current.query).toBe(before);
    });
  });

  // --- Controlled mode ---

  describe('controlled mode', () => {
    it('calls onChange but does not update internal state', () => {
      const onChange = vi.fn();
      const value: Group = {
        id: 'root', combinator: 'AND',
        rules: [{ id: 'r1', field: '', operator: 'eq', value: '' }],
      };
      const { result } = renderHook(() => useQueryBuilder({ value, onChange }));
      act(() => result.current.addRule('root'));
      expect(onChange).toHaveBeenCalledOnce();
      expect(result.current.query).toBe(value);
    });
  });

  // --- Uncontrolled mode with onChange ---

  describe('uncontrolled mode', () => {
    it('calls onChange and updates internal state', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useQueryBuilder({ onChange }));
      const rootId = result.current.query.id;
      act(() => result.current.addRule(rootId));
      expect(onChange).toHaveBeenCalledOnce();
      expect(result.current.query.rules).toHaveLength(2);
    });
  });
});
