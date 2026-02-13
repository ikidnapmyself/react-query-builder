import { render, screen } from '@testing-library/react';
import { TemplateQueryBuilder } from './TemplateQueryBuilder';
import type { TemplateClassNames } from './types';

const cn: TemplateClassNames = {
  root: 'root-class', group: '', groupHeader: '', combinator: '',
  combinatorButton: '', combinatorButtonActiveAnd: '', combinatorButtonActiveOr: '',
  rules: '', rule: '', ruleField: '', ruleOperator: '',
  ruleValue: '', removeButton: '', addButton: '', addGroupButton: '',
};

describe('TemplateQueryBuilder', () => {
  it('renders with classNames.root when no className provided', () => {
    const { container } = render(<TemplateQueryBuilder classNames={cn} />);
    expect(container.firstChild).toHaveClass('root-class');
    expect((container.firstChild as HTMLElement).className).toBe('root-class');
  });

  it('merges className with classNames.root', () => {
    const { container } = render(<TemplateQueryBuilder classNames={cn} className="custom" />);
    expect(container.firstChild).toHaveClass('root-class');
    expect(container.firstChild).toHaveClass('custom');
  });

  it('renders hidden input when name is provided', () => {
    const { container } = render(<TemplateQueryBuilder classNames={cn} name="q" />);
    const input = container.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.name).toBe('q');
  });

  it('does not render hidden input when name is not provided', () => {
    const { container } = render(<TemplateQueryBuilder classNames={cn} />);
    expect(container.querySelector('input[type="hidden"]')).not.toBeInTheDocument();
  });

  it('spreads rootProps onto root div', () => {
    render(<TemplateQueryBuilder classNames={cn} rootProps={{ 'data-testid': 'qb-root' }} />);
    expect(screen.getByTestId('qb-root')).toBeInTheDocument();
  });
});
