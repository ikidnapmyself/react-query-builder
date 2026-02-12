import type { Rule, FieldDefinition, OperatorDefinition } from '../../types';
import type { TemplateClassNames } from './types';

type RuleRowProps = {
  rule: Rule;
  fields: FieldDefinition[];
  operators: OperatorDefinition[];
  classNames: TemplateClassNames;
  onUpdate: (ruleId: string, updates: Partial<Omit<Rule, 'id'>>) => void;
  onRemove: (ruleId: string) => void;
};

function ValueInput({
  rule,
  field,
  className,
  onUpdate,
}: {
  rule: Rule;
  field: FieldDefinition | undefined;
  className: string;
  onUpdate: (ruleId: string, updates: Partial<Omit<Rule, 'id'>>) => void;
}) {
  const type = field?.type ?? 'text';

  if (type === 'select' && field?.options) {
    return (
      <select
        className={className}
        value={String(rule.value)}
        onChange={(e) => onUpdate(rule.id, { value: e.target.value })}
      >
        <option value="">Select...</option>
        {field.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  if (type === 'boolean') {
    return (
      <select
        className={className}
        value={String(rule.value)}
        onChange={(e) => onUpdate(rule.id, { value: e.target.value === 'true' })}
      >
        <option value="">Select...</option>
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    );
  }

  return (
    <input
      type={type}
      className={className}
      value={String(rule.value ?? '')}
      placeholder="Value"
      onChange={(e) => {
        const val = type === 'number' ? Number(e.target.value) : e.target.value;
        onUpdate(rule.id, { value: val });
      }}
    />
  );
}

export function RuleRow({ rule, fields, operators, classNames, onUpdate, onRemove }: RuleRowProps) {
  const currentField = fields.find((f) => f.name === rule.field);

  return (
    <div className={classNames.rule}>
      <select
        className={classNames.ruleField}
        value={rule.field}
        onChange={(e) => onUpdate(rule.id, { field: e.target.value, value: '' })}
      >
        <option value="">Select field...</option>
        {fields.map((f) => (
          <option key={f.name} value={f.name}>
            {f.label}
          </option>
        ))}
      </select>

      <select
        className={classNames.ruleOperator}
        value={rule.operator}
        onChange={(e) => onUpdate(rule.id, { operator: e.target.value })}
      >
        {operators.map((op) => (
          <option key={op.name} value={op.name}>
            {op.label}
          </option>
        ))}
      </select>

      <ValueInput
        rule={rule}
        field={currentField}
        className={classNames.ruleValue}
        onUpdate={onUpdate}
      />

      <button
        type="button"
        className={classNames.removeButton}
        onClick={() => onRemove(rule.id)}
      >
        Remove
      </button>
    </div>
  );
}
