import type { Group, Rule, FieldDefinition, OperatorDefinition } from '../../types';
import { isGroup } from '../../types';
import type { TemplateClassNames, TemplateLabels } from './types';
import { RuleRow } from './RuleRow';

type GroupBlockProps = {
  group: Group;
  isRoot?: boolean;
  fields: FieldDefinition[];
  operators: OperatorDefinition[];
  classNames: TemplateClassNames;
  labels?: TemplateLabels;
  onAddRule: (groupId: string) => void;
  onAddGroup: (groupId: string) => void;
  onRemoveRule: (ruleId: string) => void;
  onRemoveGroup: (groupId: string) => void;
  onUpdateRule: (ruleId: string, updates: Partial<Omit<Rule, 'id'>>) => void;
  onSetCombinator: (groupId: string, combinator: 'AND' | 'OR') => void;
};

export function GroupBlock({
  group,
  isRoot = false,
  fields,
  operators,
  classNames,
  labels,
  onAddRule,
  onAddGroup,
  onRemoveRule,
  onRemoveGroup,
  onUpdateRule,
  onSetCombinator,
}: GroupBlockProps) {
  return (
    <div className={classNames.group}>
      <div className={classNames.groupHeader}>
        <div className={classNames.combinator}>
          <button
            type="button"
            className={
              group.combinator === 'AND'
                ? classNames.combinatorButtonActiveAnd
                : classNames.combinatorButton
            }
            onClick={() => onSetCombinator(group.id, 'AND')}
          >
            {labels?.and ?? 'AND'}
          </button>
          <button
            type="button"
            className={
              group.combinator === 'OR'
                ? classNames.combinatorButtonActiveOr
                : classNames.combinatorButton
            }
            onClick={() => onSetCombinator(group.id, 'OR')}
          >
            {labels?.or ?? 'OR'}
          </button>
        </div>

        <button
          type="button"
          className={classNames.addButton}
          onClick={() => onAddRule(group.id)}
        >
          {labels?.addRule ?? '+ Rule'}
        </button>
        <button
          type="button"
          className={classNames.addGroupButton}
          onClick={() => onAddGroup(group.id)}
        >
          {labels?.addGroup ?? '+ Group'}
        </button>

        {!isRoot && (
          <button
            type="button"
            className={classNames.removeButton}
            onClick={() => onRemoveGroup(group.id)}
          >
            {labels?.removeGroup ?? 'Remove'}
          </button>
        )}
      </div>

      <div className={classNames.rules}>
        {group.rules.map((item) =>
          isGroup(item) ? (
            <GroupBlock
              key={item.id}
              group={item}
              fields={fields}
              operators={operators}
              classNames={classNames}
              labels={labels}
              onAddRule={onAddRule}
              onAddGroup={onAddGroup}
              onRemoveRule={onRemoveRule}
              onRemoveGroup={onRemoveGroup}
              onUpdateRule={onUpdateRule}
              onSetCombinator={onSetCombinator}
            />
          ) : (
            <RuleRow
              key={item.id}
              rule={item}
              fields={fields}
              operators={operators}
              classNames={classNames}
              labels={labels}
              onUpdate={onUpdateRule}
              onRemove={onRemoveRule}
            />
          ),
        )}
      </div>
    </div>
  );
}
