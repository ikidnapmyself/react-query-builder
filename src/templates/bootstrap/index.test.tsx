import { render } from '@testing-library/react';
import { BootstrapQueryBuilder } from './index';

describe('BootstrapQueryBuilder', () => {
  it('sets data-bs-theme when colorMode is provided', () => {
    const { container } = render(<BootstrapQueryBuilder colorMode="dark" />);
    expect(container.firstChild).toHaveAttribute('data-bs-theme', 'dark');
  });

  it('does not set data-bs-theme when colorMode is not provided', () => {
    const { container } = render(<BootstrapQueryBuilder />);
    expect(container.firstChild).not.toHaveAttribute('data-bs-theme');
  });
});
