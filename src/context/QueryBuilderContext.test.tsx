import { renderHook } from '@testing-library/react';
import { QueryBuilderProvider, useQueryBuilderContext } from './QueryBuilderContext';
import type { QueryBuilderContextValue } from './QueryBuilderContext';

const mockCtx: QueryBuilderContextValue = {
  query: { id: 'root', combinator: 'AND', rules: [] },
  fields: [],
  operators: [],
  addRule: vi.fn(),
  addGroup: vi.fn(),
  removeRule: vi.fn(),
  removeGroup: vi.fn(),
  updateRule: vi.fn(),
  setCombinator: vi.fn(),
};

describe('useQueryBuilderContext', () => {
  it('returns context value when used within provider', () => {
    const { result } = renderHook(() => useQueryBuilderContext(), {
      wrapper: ({ children }) => (
        <QueryBuilderProvider value={mockCtx}>{children}</QueryBuilderProvider>
      ),
    });
    expect(result.current).toBe(mockCtx);
  });

  it('throws when used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useQueryBuilderContext())).toThrow(
      'useQueryBuilderContext must be used within a <QueryBuilderProvider>'
    );
    spy.mockRestore();
  });
});
