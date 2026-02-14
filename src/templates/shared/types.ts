export type RootProps = Record<string, string>;

export type TemplateLabels = {
  addRule?: string;
  addGroup?: string;
  removeRule?: string;
  removeGroup?: string;
  and?: string;
  or?: string;
};

export type TemplateClassNames = {
  root: string;
  group: string;
  groupHeader: string;
  combinator: string;
  combinatorButton: string;
  combinatorButtonActiveAnd: string;
  combinatorButtonActiveOr: string;
  rules: string;
  rule: string;
  ruleField: string;
  ruleOperator: string;
  ruleValue: string;
  removeButton: string;
  addButton: string;
  addGroupButton: string;
};
