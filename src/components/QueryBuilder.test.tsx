import { render, screen } from '@testing-library/react';
import { QueryBuilder } from './QueryBuilder';
import type { Group } from '../types';

const query: Group = {
  id: 'root', combinator: 'AND',
  rules: [{ id: 'r1', field: '', operator: 'eq', value: '' }],
};

describe('QueryBuilder', () => {
  it('renders children', () => {
    render(
      <QueryBuilder defaultValue={query}>
        <span data-testid="child">Hello</span>
      </QueryBuilder>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders hidden input with serialized query when name is provided', () => {
    const { container } = render(<QueryBuilder name="q" defaultValue={query} />);
    const input = container.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.name).toBe('q');
    expect(JSON.parse(input.value)).toMatchObject({ id: 'root', combinator: 'AND' });
  });

  it('does not render hidden input when name is not provided', () => {
    const { container } = render(<QueryBuilder defaultValue={query} />);
    expect(container.querySelector('input[type="hidden"]')).not.toBeInTheDocument();
  });

  it('applies className to root div', () => {
    const { container } = render(<QueryBuilder className="custom" defaultValue={query} />);
    expect(container.firstChild).toHaveClass('custom');
  });
});
