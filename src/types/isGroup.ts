import type { Rule, Group } from './types';

export function isGroup(ruleOrGroup: Rule | Group): ruleOrGroup is Group {
  return 'combinator' in ruleOrGroup && 'rules' in ruleOrGroup;
}
