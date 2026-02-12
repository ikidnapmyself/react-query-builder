import type { QueryBuilderProps } from '../../types';
import type { TemplateClassNames } from '../shared/types';
import { TemplateQueryBuilder } from '../shared/TemplateQueryBuilder';

const bootstrapClassNames: TemplateClassNames = {
  root: '',
  group: 'card border-2 mb-3',
  groupHeader: 'd-flex align-items-center gap-2 card-header fw-semibold flex-wrap',
  combinator: 'btn-group btn-group-sm',
  combinatorButton: 'btn btn-outline-secondary',
  combinatorButtonActiveAnd: 'btn btn-primary fw-bold',
  combinatorButtonActiveOr: 'btn btn-warning fw-bold',
  rules: 'card-body d-flex flex-column gap-2 ps-4 border-start border-primary border-3',
  rule: 'd-flex align-items-center gap-2 flex-wrap',
  ruleField: 'form-select form-select-sm w-auto fw-medium',
  ruleOperator: 'form-select form-select-sm w-auto fw-medium',
  ruleValue: 'form-control form-control-sm w-auto',
  removeButton: 'btn btn-danger btn-sm',
  addButton: 'btn btn-primary btn-sm',
  addGroupButton: 'btn btn-success btn-sm',
};

type BootstrapQueryBuilderProps = QueryBuilderProps & {
  /** Set to "dark" to enable Bootstrap dark mode */
  colorMode?: 'light' | 'dark';
};

export function BootstrapQueryBuilder({ colorMode, ...props }: BootstrapQueryBuilderProps) {
  const rootProps = colorMode ? { 'data-bs-theme': colorMode } : undefined;
  return <TemplateQueryBuilder {...props} classNames={bootstrapClassNames} rootProps={rootProps} />;
}
