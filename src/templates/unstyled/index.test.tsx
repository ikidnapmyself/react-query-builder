import { render, screen } from '@testing-library/react';
import { UnstyledQueryBuilder } from './index';

describe('UnstyledQueryBuilder', () => {
  it('renders without errors', () => {
    render(<UnstyledQueryBuilder />);
    expect(screen.getByText('AND')).toBeInTheDocument();
  });
});
