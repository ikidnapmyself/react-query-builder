import type { UseCase } from './useCases';

type TemplateName = 'Tailwind' | 'Bootstrap' | 'Unstyled';

const templateMap: Record<TemplateName, { component: string; path: string }> = {
  Tailwind: {
    component: 'TailwindQueryBuilder',
    path: 'headless-react-query-builder/templates/tailwind',
  },
  Bootstrap: {
    component: 'BootstrapQueryBuilder',
    path: 'headless-react-query-builder/templates/bootstrap',
  },
  Unstyled: {
    component: 'UnstyledQueryBuilder',
    path: 'headless-react-query-builder/templates/unstyled',
  },
};

function serialize(val: unknown, depth: number): string {
  const pad = '  '.repeat(depth);
  const innerPad = '  '.repeat(depth + 1);

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (typeof val === 'string') return `'${val.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);

  if (Array.isArray(val)) {
    if (val.length === 0) return '[]';
    const items = val.map((item) => `${innerPad}${serialize(item, depth + 1)},`);
    return `[\n${items.join('\n')}\n${pad}]`;
  }

  if (typeof val === 'object') {
    const obj = val as Record<string, unknown>;
    const keys = Object.keys(obj);
    if (keys.length === 0) return '{}';
    const entries = keys.map((key) => {
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;
      return `${innerPad}${safeKey}: ${serialize(obj[key], depth + 1)},`;
    });
    return `{\n${entries.join('\n')}\n${pad}}`;
  }

  return String(val);
}

export function generateSource(useCase: UseCase, template: TemplateName): string {
  const { component, path } = templateMap[template];
  const hasOperators = useCase.operators != null && useCase.operators.length > 0;

  const operatorsSection = hasOperators
    ? `\nconst operators = ${serialize(useCase.operators!, 0)};\n`
    : '';

  const jsxProps = [
    '      value={query}',
    '      onChange={setQuery}',
    '      fields={fields}',
  ];
  if (hasOperators) {
    jsxProps.push('      operators={operators}');
  }

  const source = [
    `import { useState } from 'react';`,
    `import { ${component} } from '${path}';`,
    `import type { Group } from 'headless-react-query-builder';`,
    ``,
    `const fields = ${serialize(useCase.fields, 0)};`,
    operatorsSection,
    `const preset: Group = ${serialize(useCase.preset, 0)};`,
    ``,
    `function App() {`,
    `  const [query, setQuery] = useState<Group>(preset);`,
    `  return (`,
    `    <${component}`,
    ...jsxProps,
    `    />`,
    `  );`,
    `}`,
  ].join('\n');

  return source.replace(/\n{3,}/g, '\n\n');
}
