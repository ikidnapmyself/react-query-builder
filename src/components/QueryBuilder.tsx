import type { QueryBuilderProps } from '../types';
import { useQueryBuilder } from '../hooks/useQueryBuilder';
import { QueryBuilderProvider } from '../context/QueryBuilderContext';

export function QueryBuilder({
  value,
  defaultValue,
  onChange,
  name,
  fields,
  operators,
  className,
  children,
}: QueryBuilderProps) {
  const ctx = useQueryBuilder({ value, defaultValue, onChange, fields, operators });

  return (
    <QueryBuilderProvider value={ctx}>
      <div className={className}>
        {children}
        {name && (
          <input type="hidden" name={name} value={JSON.stringify(ctx.query)} />
        )}
      </div>
    </QueryBuilderProvider>
  );
}
