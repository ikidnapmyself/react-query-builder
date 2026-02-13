import { render } from '@testing-library/react';
import { TailwindQueryBuilder } from './index';

describe('TailwindQueryBuilder', () => {
  it('renders with tailwind root class', () => {
    const { container } = render(<TailwindQueryBuilder />);
    expect(container.firstChild).toHaveClass('font-sans');
  });
});
