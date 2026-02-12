import { createContext, useContext } from 'react';
import type { Group, Rule, FieldDefinition, OperatorDefinition } from '../types';

export type QueryBuilderContextValue = {
  query: Group;
  fields: FieldDefinition[];
  operators: OperatorDefinition[];
  addRule: (groupId: string) => void;
  addGroup: (groupId: string) => void;
  removeRule: (ruleId: string) => void;
  removeGroup: (groupId: string) => void;
  updateRule: (ruleId: string, updates: Partial<Omit<Rule, 'id'>>) => void;
  setCombinator: (groupId: string, combinator: 'AND' | 'OR') => void;
};

export const QueryBuilderContext = createContext<QueryBuilderContextValue | null>(null);

export function QueryBuilderProvider({ children, value }: { children: React.ReactNode; value: QueryBuilderContextValue }) {
  return <QueryBuilderContext value={value}>{children}</QueryBuilderContext>;
}

export function useQueryBuilderContext(): QueryBuilderContextValue {
  const ctx = useContext(QueryBuilderContext);
  if (!ctx) {
    throw new Error('useQueryBuilderContext must be used within a <QueryBuilderProvider>');
  }
  return ctx;
}
