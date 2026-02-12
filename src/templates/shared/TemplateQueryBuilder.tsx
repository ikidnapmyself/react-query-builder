import type { QueryBuilderProps } from '../../types';
import type { TemplateClassNames, RootProps } from './types';
import { useQueryBuilder } from '../../hooks';
import { GroupBlock } from './GroupBlock';

type TemplateQueryBuilderProps = QueryBuilderProps & {
  classNames: TemplateClassNames;
  rootProps?: RootProps;
};

export function TemplateQueryBuilder({
  value,
  defaultValue,
  onChange,
  name,
  fields,
  operators,
  className,
  classNames,
  rootProps,
}: TemplateQueryBuilderProps) {
  const ctx = useQueryBuilder({ value, defaultValue, onChange, fields, operators });

  return (
    <div className={className ? `${classNames.root} ${className}` : classNames.root} {...rootProps}>
      <GroupBlock
        group={ctx.query}
        isRoot
        fields={ctx.fields}
        operators={ctx.operators}
        classNames={classNames}
        onAddRule={ctx.addRule}
        onAddGroup={ctx.addGroup}
        onRemoveRule={ctx.removeRule}
        onRemoveGroup={ctx.removeGroup}
        onUpdateRule={ctx.updateRule}
        onSetCombinator={ctx.setCombinator}
      />
      {name && (
        <input type="hidden" name={name} value={JSON.stringify(ctx.query)} />
      )}
    </div>
  );
}
