export type Rule = {
  id: string;
  field: string;
  operator: string;
  value: unknown;
};

export type Group = {
  id: string;
  combinator: 'AND' | 'OR';
  rules: (Rule | Group)[];
};

export type QueryBuilderProps = {
  /** Controlled value */
  value?: Group;
  /** Initial value for uncontrolled usage */
  defaultValue?: Group;
  /** Called when the query changes */
  onChange?: (query: Group) => void;
  /** Field name for hidden input (form submission) */
  name?: string;
  /** Available fields the user can select from */
  fields?: FieldDefinition[];
  /** Available operators */
  operators?: OperatorDefinition[];
  /** Additional class name for the root element */
  className?: string;
  children?: React.ReactNode;
};

export type FieldDefinition = {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'select';
  options?: { label: string; value: string }[];
};

export type OperatorDefinition = {
  name: string;
  label: string;
};

export function isGroup(ruleOrGroup: Rule | Group): ruleOrGroup is Group {
  return 'combinator' in ruleOrGroup && 'rules' in ruleOrGroup;
}
