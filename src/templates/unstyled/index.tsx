import type { QueryBuilderProps } from '../../types';
import type { TemplateClassNames } from '../shared/types';
import { TemplateQueryBuilder } from '../shared/TemplateQueryBuilder';

const unstyledClassNames: TemplateClassNames = {
  root: '',
  group: '',
  groupHeader: '',
  combinator: '',
  combinatorButton: '',
  combinatorButtonActiveAnd: '',
  combinatorButtonActiveOr: '',
  rules: '',
  rule: '',
  ruleField: '',
  ruleOperator: '',
  ruleValue: '',
  removeButton: '',
  addButton: '',
  addGroupButton: '',
};

export function UnstyledQueryBuilder(props: QueryBuilderProps) {
  return <TemplateQueryBuilder {...props} classNames={unstyledClassNames} />;
}
