import { useState, useCallback, useMemo } from 'react';
import type { Group, Rule, FieldDefinition, OperatorDefinition } from '../types';
import type { QueryBuilderContextValue } from '../context/QueryBuilderContext';
import { isGroup } from '../types';
import { createEmptyRule, createEmptyGroup, DEFAULT_OPERATORS, DEFAULT_FIELDS } from '../core';

type UseQueryBuilderOptions = {
  value?: Group;
  defaultValue?: Group;
  onChange?: (query: Group) => void;
  fields?: FieldDefinition[];
  operators?: OperatorDefinition[];
};

function updateGroupRecursive(group: Group, updater: (g: Group) => Group): Group {
  const result = updater(group);
  if (result !== group) return result;

  const newRules = group.rules.map((item) => {
    if (isGroup(item)) {
      return updateGroupRecursive(item, updater);
    }
    return item;
  });

  if (newRules.some((r, i) => r !== group.rules[i])) {
    return { ...group, rules: newRules };
  }

  return group;
}

function findAndUpdateRule(group: Group, ruleId: string, updates: Partial<Omit<Rule, 'id'>>): Group {
  const newRules = group.rules.map((item) => {
    if (isGroup(item)) {
      return findAndUpdateRule(item, ruleId, updates);
    }
    if (item.id === ruleId) {
      return { ...item, ...updates };
    }
    return item;
  });

  return { ...group, rules: newRules };
}

function findAndRemove(group: Group, targetId: string): Group {
  const newRules = group.rules
    .filter((item) => item.id !== targetId)
    .map((item) => {
      if (isGroup(item)) {
        return findAndRemove(item, targetId);
      }
      return item;
    });

  return { ...group, rules: newRules };
}

function findAndAddRule(group: Group, groupId: string, newItem: Rule | Group): Group {
  if (group.id === groupId) {
    return { ...group, rules: [...group.rules, newItem] };
  }

  const newRules = group.rules.map((item) => {
    if (isGroup(item)) {
      return findAndAddRule(item, groupId, newItem);
    }
    return item;
  });

  return { ...group, rules: newRules };
}

export function useQueryBuilder(options: UseQueryBuilderOptions = {}): QueryBuilderContextValue {
  const {
    value: controlledValue,
    defaultValue,
    onChange,
    fields = DEFAULT_FIELDS,
    operators = DEFAULT_OPERATORS,
  } = options;

  const [internalQuery, setInternalQuery] = useState<Group>(
    () => defaultValue ?? createEmptyGroup(),
  );

  const isControlled = controlledValue !== undefined;
  const query = isControlled ? controlledValue : internalQuery;

  const setQuery = useCallback(
    (next: Group) => {
      if (!isControlled) {
        setInternalQuery(next);
      }
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const addRule = useCallback(
    (groupId: string) => {
      setQuery(findAndAddRule(query, groupId, createEmptyRule()));
    },
    [query, setQuery],
  );

  const addGroup = useCallback(
    (groupId: string) => {
      setQuery(findAndAddRule(query, groupId, createEmptyGroup()));
    },
    [query, setQuery],
  );

  const removeRule = useCallback(
    (ruleId: string) => {
      setQuery(findAndRemove(query, ruleId));
    },
    [query, setQuery],
  );

  const removeGroup = useCallback(
    (groupId: string) => {
      setQuery(findAndRemove(query, groupId));
    },
    [query, setQuery],
  );

  const updateRule = useCallback(
    (ruleId: string, updates: Partial<Omit<Rule, 'id'>>) => {
      setQuery(findAndUpdateRule(query, ruleId, updates));
    },
    [query, setQuery],
  );

  const setCombinator = useCallback(
    (groupId: string, combinator: 'AND' | 'OR') => {
      const updated = updateGroupRecursive(query, (g) => {
        if (g.id === groupId) return { ...g, combinator };
        return g;
      });
      setQuery(updated);
    },
    [query, setQuery],
  );

  return useMemo(
    () => ({
      query,
      fields,
      operators,
      addRule,
      addGroup,
      removeRule,
      removeGroup,
      updateRule,
      setCombinator,
    }),
    [query, fields, operators, addRule, addGroup, removeRule, removeGroup, updateRule, setCombinator],
  );
}
