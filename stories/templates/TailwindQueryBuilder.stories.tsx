import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TailwindQueryBuilder } from '../../src/templates/tailwind';
import { TemplateQueryBuilder } from '../../src/templates/shared/TemplateQueryBuilder';
import type { TemplateClassNames } from '../../src/templates/shared/types';
import type { Group } from '../../src';
import { createEmptyGroup } from '../../src';
import {
  alertManager,
  tradingBot,
  automation,
  pipelineManager,
  emailFiltering,
  dataValidation,
  accessControl,
  searchFilter,
  type UseCase,
} from '../useCases';
import { generateSource } from '../sourceCode';

const meta: Meta<typeof TailwindQueryBuilder> = {
  title: 'Templates/Tailwind',
  component: TailwindQueryBuilder,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TailwindQueryBuilder>;

function TailwindDemo({ useCase, dark = false }: { useCase: UseCase; dark?: boolean }) {
  const [query, setQuery] = useState<Group>(() => useCase.preset);
  return (
    <div className={`${dark ? 'dark bg-gray-950' : ''} p-6 max-w-4xl rounded-lg`}>
      <h2 className="text-lg font-bold mb-1 text-gray-900 dark:text-gray-100">
        {useCase.title}
      </h2>
      <p className="text-sm mb-4 text-gray-500 dark:text-gray-400">
        {useCase.description}
      </p>
      <TailwindQueryBuilder
        value={query}
        onChange={setQuery}
        fields={useCase.fields}
        operators={useCase.operators}
      />
      <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded text-xs overflow-auto">
        {JSON.stringify(query, null, 2)}
      </pre>
    </div>
  );
}

const src = (useCase: UseCase) => ({
  docs: { source: { code: generateSource(useCase, 'Tailwind'), language: 'tsx' } },
});

export const Default: Story = {
  render: () => {
    const [query, setQuery] = useState<Group>(createEmptyGroup);
    return (
      <div className="p-6 max-w-4xl">
        <TailwindQueryBuilder
          value={query}
          onChange={setQuery}
          fields={[
            { name: 'name', label: 'Name', type: 'text' },
            { name: 'age', label: 'Age', type: 'number' },
            { name: 'active', label: 'Active', type: 'boolean' },
          ]}
        />
        <pre className="mt-4 p-4 bg-gray-100 text-gray-800 rounded text-xs overflow-auto">
          {JSON.stringify(query, null, 2)}
        </pre>
      </div>
    );
  },
};

export const DarkMode: Story = {
  render: () => {
    const [query, setQuery] = useState<Group>(createEmptyGroup);
    return (
      <div className="dark bg-gray-950 p-6 max-w-4xl rounded-lg">
        <TailwindQueryBuilder
          value={query}
          onChange={setQuery}
          fields={[
            { name: 'name', label: 'Name', type: 'text' },
            { name: 'age', label: 'Age', type: 'number' },
            { name: 'active', label: 'Active', type: 'boolean' },
          ]}
        />
        <pre className="mt-4 p-4 bg-gray-800 text-gray-200 rounded text-xs overflow-auto">
          {JSON.stringify(query, null, 2)}
        </pre>
      </div>
    );
  },
};

export const AlertManager: Story = {
  render: () => <TailwindDemo useCase={alertManager} />,
  parameters: src(alertManager),
};

export const AlertManagerDark: Story = {
  render: () => <TailwindDemo useCase={alertManager} dark />,
  parameters: src(alertManager),
};

export const TradingBot: Story = {
  render: () => <TailwindDemo useCase={tradingBot} />,
  parameters: src(tradingBot),
};

export const TradingBotDark: Story = {
  render: () => <TailwindDemo useCase={tradingBot} dark />,
  parameters: src(tradingBot),
};

export const Automation: Story = {
  render: () => <TailwindDemo useCase={automation} />,
  parameters: src(automation),
};

export const PipelineManager: Story = {
  render: () => <TailwindDemo useCase={pipelineManager} />,
  parameters: src(pipelineManager),
};

export const EmailFiltering: Story = {
  render: () => <TailwindDemo useCase={emailFiltering} />,
  parameters: src(emailFiltering),
};

export const DataValidation: Story = {
  render: () => <TailwindDemo useCase={dataValidation} />,
  parameters: src(dataValidation),
};

export const AccessControl: Story = {
  render: () => <TailwindDemo useCase={accessControl} />,
  parameters: src(accessControl),
};

export const SearchFilter: Story = {
  render: () => <TailwindDemo useCase={searchFilter} />,
  parameters: src(searchFilter),
};

const valentineClassNames: TemplateClassNames = {
  root: 'font-sans',
  group:
    'border-2 border-red-200 rounded-xl bg-red-50 p-4 space-y-3 shadow-sm',
  groupHeader: 'flex items-center gap-2 flex-wrap',
  combinator: 'inline-flex rounded-full shadow-sm',
  combinatorButton:
    'cursor-pointer px-4 py-1.5 text-sm font-semibold border border-red-200 bg-white text-red-300 hover:bg-red-50 first:rounded-l-full last:rounded-r-full -ml-px first:ml-0 transition-colors',
  combinatorButtonActiveAnd:
    'cursor-pointer px-4 py-1.5 text-sm font-semibold first:rounded-l-full last:rounded-r-full -ml-px first:ml-0 transition-colors bg-red-500 text-white border border-red-500 hover:bg-red-600 shadow-md',
  combinatorButtonActiveOr:
    'cursor-pointer px-4 py-1.5 text-sm font-semibold first:rounded-l-full last:rounded-r-full -ml-px first:ml-0 transition-colors bg-pink-500 text-white border border-pink-500 hover:bg-pink-600 shadow-md',
  rules: 'space-y-2 ml-4 border-l-2 border-red-300 pl-4',
  rule: 'flex items-center gap-2 flex-wrap',
  ruleField:
    'rounded-lg border border-red-200 bg-white text-red-900 px-3 py-1.5 text-sm shadow-sm focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400',
  ruleOperator:
    'rounded-lg border border-red-200 bg-white text-red-900 px-3 py-1.5 text-sm shadow-sm focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400',
  ruleValue:
    'rounded-lg border border-red-200 bg-white text-red-900 px-3 py-1.5 text-sm shadow-sm focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400',
  removeButton:
    'cursor-pointer px-2 py-1.5 text-sm font-medium text-red-400 bg-white border border-red-200 rounded-lg hover:bg-red-100 hover:text-red-600 hover:border-red-300 transition-colors',
  addButton:
    'cursor-pointer px-3 py-1.5 text-sm font-semibold text-white bg-red-500 border border-red-500 rounded-full hover:bg-red-600 shadow-sm transition-colors',
  addGroupButton:
    'cursor-pointer px-3 py-1.5 text-sm font-semibold text-red-500 bg-white border border-red-300 rounded-full hover:bg-red-50 hover:border-red-400 transition-colors',
};

export const CustomButtonsValentine: Story = {
  name: "Custom Buttons — Valentine's Day",
  render: () => {
    const [query, setQuery] = useState<Group>(() => ({
      id: 'root',
      combinator: 'AND',
      rules: [
        { id: '1', field: 'recipient', operator: 'eq', value: '' },
        { id: '2', field: 'gift', operator: 'eq', value: '' },
      ],
    }));
    return (
      <div className="p-6 max-w-4xl">
        <h2 className="text-lg font-bold mb-1 text-red-700">
          Custom Buttons
        </h2>
        <p className="text-sm mb-4 text-red-400">
          Pass a custom <code className="bg-red-50 px-1 rounded text-red-600">classNames</code> object
          to <code className="bg-red-50 px-1 rounded text-red-600">TemplateQueryBuilder</code> to
          fully customize every element.
        </p>
        <TemplateQueryBuilder
          value={query}
          onChange={setQuery}
          classNames={valentineClassNames}
          fields={[
            { name: 'recipient', label: 'Recipient', type: 'text' },
            { name: 'gift', label: 'Gift', type: 'text' },
            { name: 'budget', label: 'Budget ($)', type: 'number' },
            { name: 'delivery_date', label: 'Delivery Date', type: 'date' },
            { name: 'handwritten_note', label: 'Handwritten Note', type: 'boolean' },
          ]}
        />
        <pre className="mt-4 p-4 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs overflow-auto">
          {JSON.stringify(query, null, 2)}
        </pre>
      </div>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `import { useState } from 'react';
import { TemplateQueryBuilder } from 'headless-react-query-builder/templates/shared';
import type { TemplateClassNames } from 'headless-react-query-builder/templates/shared';
import type { Group } from 'headless-react-query-builder';

// Define a fully custom Valentine's Day theme
const valentineClassNames: TemplateClassNames = {
  root: 'font-sans',
  group: 'border-2 border-red-200 rounded-xl bg-red-50 p-4 space-y-3 shadow-sm',
  groupHeader: 'flex items-center gap-2 flex-wrap',
  combinator: 'inline-flex rounded-full shadow-sm',
  combinatorButton:
    'cursor-pointer px-4 py-1.5 text-sm font-semibold border border-red-200 bg-white text-red-300 hover:bg-red-50 first:rounded-l-full last:rounded-r-full -ml-px first:ml-0 transition-colors',
  combinatorButtonActiveAnd:
    'cursor-pointer px-4 py-1.5 text-sm font-semibold first:rounded-l-full last:rounded-r-full -ml-px first:ml-0 transition-colors bg-red-500 text-white border border-red-500 hover:bg-red-600 shadow-md',
  combinatorButtonActiveOr:
    'cursor-pointer px-4 py-1.5 text-sm font-semibold first:rounded-l-full last:rounded-r-full -ml-px first:ml-0 transition-colors bg-pink-500 text-white border border-pink-500 hover:bg-pink-600 shadow-md',
  rules: 'space-y-2 ml-4 border-l-2 border-red-300 pl-4',
  rule: 'flex items-center gap-2 flex-wrap',
  ruleField:
    'rounded-lg border border-red-200 bg-white text-red-900 px-3 py-1.5 text-sm shadow-sm focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400',
  ruleOperator:
    'rounded-lg border border-red-200 bg-white text-red-900 px-3 py-1.5 text-sm shadow-sm focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400',
  ruleValue:
    'rounded-lg border border-red-200 bg-white text-red-900 px-3 py-1.5 text-sm shadow-sm focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400',
  removeButton:
    'cursor-pointer px-2 py-1.5 text-sm font-medium text-red-400 bg-white border border-red-200 rounded-lg hover:bg-red-100 hover:text-red-600 hover:border-red-300 transition-colors',
  addButton:
    'cursor-pointer px-3 py-1.5 text-sm font-semibold text-white bg-red-500 border border-red-500 rounded-full hover:bg-red-600 shadow-sm transition-colors',
  addGroupButton:
    'cursor-pointer px-3 py-1.5 text-sm font-semibold text-red-500 bg-white border border-red-300 rounded-full hover:bg-red-50 hover:border-red-400 transition-colors',
};

function App() {
  const [query, setQuery] = useState<Group>(preset);
  return (
    <TemplateQueryBuilder
      value={query}
      onChange={setQuery}
      classNames={valentineClassNames}
      fields={[
        { name: 'recipient', label: 'Recipient', type: 'text' },
        { name: 'gift', label: 'Gift', type: 'text' },
        { name: 'budget', label: 'Budget ($)', type: 'number' },
        { name: 'delivery_date', label: 'Delivery Date', type: 'date' },
        { name: 'handwritten_note', label: 'Handwritten Note', type: 'boolean' },
      ]}
    />
  );
}`,
        language: 'tsx',
      },
    },
  },
};

const compactClassNames: TemplateClassNames = {
  root: 'font-mono text-[11px] antialiased',
  group: 'border border-slate-200 bg-slate-50/50 p-1.5 space-y-1',
  groupHeader: 'flex items-center gap-0.5 flex-wrap',
  combinator: 'inline-flex',
  combinatorButton:
    'cursor-pointer px-1.5 py-px text-[10px] font-medium uppercase tracking-wider border border-slate-300 bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50 -ml-px first:ml-0 transition-colors',
  combinatorButtonActiveAnd:
    'cursor-pointer px-1.5 py-px text-[10px] font-medium uppercase tracking-wider -ml-px first:ml-0 transition-colors bg-slate-800 text-white border border-slate-800 hover:bg-slate-700',
  combinatorButtonActiveOr:
    'cursor-pointer px-1.5 py-px text-[10px] font-medium uppercase tracking-wider -ml-px first:ml-0 transition-colors bg-slate-600 text-white border border-slate-600 hover:bg-slate-500',
  rules: 'space-y-0 ml-2 border-l border-slate-300 pl-1.5',
  rule: 'flex items-center gap-0.5',
  ruleField:
    'border border-slate-200 bg-white text-slate-800 px-1 py-px text-[11px] focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-400 min-w-0 flex-1',
  ruleOperator:
    'border border-slate-200 bg-white text-slate-800 px-1 py-px text-[11px] focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-400 min-w-0 w-14',
  ruleValue:
    'border border-slate-200 bg-white text-slate-800 px-1 py-px text-[11px] focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-400 min-w-0 flex-1',
  removeButton:
    'cursor-pointer size-4 flex items-center justify-center text-[10px] leading-none text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors',
  addButton:
    'cursor-pointer px-1.5 py-px text-[10px] font-medium uppercase tracking-wider text-slate-500 bg-white border border-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-colors',
  addGroupButton:
    'cursor-pointer px-1.5 py-px text-[10px] font-medium uppercase tracking-wider text-slate-400 bg-transparent border border-dashed border-slate-300 hover:border-slate-500 hover:text-slate-600 transition-colors',
};

const compactLabels = {
  removeRule: '\u00d7',
  removeGroup: '\u00d7',
};

export const UltraCompact: Story = {
  name: 'Ultra Compact',
  render: () => {
    const [query, setQuery] = useState<Group>(() => ({
      id: 'root',
      combinator: 'AND',
      rules: [
        { id: '1', field: 'status', operator: 'eq', value: 'active' },
        { id: '2', field: 'priority', operator: 'gte', value: '3' },
        {
          id: 'g1',
          combinator: 'OR',
          rules: [
            { id: '3', field: 'tag', operator: 'eq', value: 'urgent' },
            { id: '4', field: 'assignee', operator: 'eq', value: 'me' },
          ],
        },
      ],
    }));
    return (
      <div className="p-4 max-w-xs">
        <h2 className="text-xs font-semibold mb-0.5 text-slate-700 uppercase tracking-wider">
          Ultra Compact
        </h2>
        <p className="text-[10px] mb-2 text-slate-400">
          Single-line rules, zero border-radius, monospace — fits sidebars,
          popovers, and narrow panels.
        </p>
        <TemplateQueryBuilder
          value={query}
          onChange={setQuery}
          classNames={compactClassNames}
          labels={compactLabels}
          fields={[
            { name: 'status', label: 'Status', type: 'text' },
            { name: 'priority', label: 'Priority', type: 'number' },
            { name: 'tag', label: 'Tag', type: 'text' },
            { name: 'assignee', label: 'Assignee', type: 'text' },
          ]}
        />
        <pre className="mt-2 p-1.5 bg-slate-100 text-slate-600 text-[10px] overflow-auto border border-slate-200">
          {JSON.stringify(query, null, 2)}
        </pre>
      </div>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `import { useState } from 'react';
import { TemplateQueryBuilder } from 'headless-react-query-builder/templates/shared';
import type { TemplateClassNames } from 'headless-react-query-builder/templates/shared';
import type { Group } from 'headless-react-query-builder';

// Ultra compact theme — single-line rules, zero border-radius, slate palette
const compactClassNames: TemplateClassNames = {
  root: 'font-mono text-[11px] antialiased',
  group: 'border border-slate-200 bg-slate-50/50 p-1.5 space-y-1',
  groupHeader: 'flex items-center gap-0.5 flex-wrap',
  combinator: 'inline-flex',
  combinatorButton:
    'cursor-pointer px-1.5 py-px text-[10px] font-medium uppercase tracking-wider border border-slate-300 bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50 -ml-px first:ml-0 transition-colors',
  combinatorButtonActiveAnd:
    'cursor-pointer px-1.5 py-px text-[10px] font-medium uppercase tracking-wider -ml-px first:ml-0 transition-colors bg-slate-800 text-white border border-slate-800 hover:bg-slate-700',
  combinatorButtonActiveOr:
    'cursor-pointer px-1.5 py-px text-[10px] font-medium uppercase tracking-wider -ml-px first:ml-0 transition-colors bg-slate-600 text-white border border-slate-600 hover:bg-slate-500',
  rules: 'space-y-0 ml-2 border-l border-slate-300 pl-1.5',
  rule: 'flex items-center gap-0.5',
  ruleField:
    'border border-slate-200 bg-white text-slate-800 px-1 py-px text-[11px] focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-400 min-w-0 flex-1',
  ruleOperator:
    'border border-slate-200 bg-white text-slate-800 px-1 py-px text-[11px] focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-400 min-w-0 w-14',
  ruleValue:
    'border border-slate-200 bg-white text-slate-800 px-1 py-px text-[11px] focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-400 min-w-0 flex-1',
  removeButton:
    'cursor-pointer size-4 flex items-center justify-center text-[10px] leading-none text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors',
  addButton:
    'cursor-pointer px-1.5 py-px text-[10px] font-medium uppercase tracking-wider text-slate-500 bg-white border border-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-colors',
  addGroupButton:
    'cursor-pointer px-1.5 py-px text-[10px] font-medium uppercase tracking-wider text-slate-400 bg-transparent border border-dashed border-slate-300 hover:border-slate-500 hover:text-slate-600 transition-colors',
};

// Custom labels — short symbols for tight layouts
const compactLabels = {
  removeRule: '\\u00d7',  // × symbol
  removeGroup: '\\u00d7',
};

function App() {
  const [query, setQuery] = useState<Group>(preset);
  return (
    <TemplateQueryBuilder
      value={query}
      onChange={setQuery}
      classNames={compactClassNames}
      labels={compactLabels}
      fields={[
        { name: 'status', label: 'Status', type: 'text' },
        { name: 'priority', label: 'Priority', type: 'number' },
        { name: 'tag', label: 'Tag', type: 'text' },
        { name: 'assignee', label: 'Assignee', type: 'text' },
      ]}
    />
  );
}`,
        language: 'tsx',
      },
    },
  },
};

const dutchLabels = {
  and: 'EN',
  or: 'OF',
  addRule: '+ Regel',
  addGroup: '+ Groep',
  removeRule: 'Verwijder',
  removeGroup: 'Verwijder',
};

const dutchClassNames: TemplateClassNames = {
  root: 'font-sans',
  group:
    'border-2 border-blue-800 rounded-lg bg-blue-50 p-4 space-y-3',
  groupHeader: 'flex items-center gap-2 flex-wrap',
  combinator: 'inline-flex rounded-md shadow-sm',
  combinatorButton:
    'cursor-pointer px-3 py-1.5 text-sm font-medium border border-gray-300 bg-white text-gray-400 hover:bg-gray-50 first:rounded-l-md last:rounded-r-md -ml-px first:ml-0 transition-colors',
  combinatorButtonActiveAnd:
    'cursor-pointer px-3 py-1.5 text-sm font-bold first:rounded-l-md last:rounded-r-md -ml-px first:ml-0 transition-colors bg-red-700 text-white border border-red-700 hover:bg-red-800',
  combinatorButtonActiveOr:
    'cursor-pointer px-3 py-1.5 text-sm font-bold first:rounded-l-md last:rounded-r-md -ml-px first:ml-0 transition-colors bg-blue-800 text-white border border-blue-800 hover:bg-blue-900',
  rules:
    'space-y-2 ml-4 border-l-2 border-red-700 pl-4',
  rule: 'flex items-center gap-2 flex-wrap',
  ruleField:
    'rounded-md border border-blue-300 bg-white text-gray-900 px-3 py-1.5 text-sm shadow-sm focus:border-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-800',
  ruleOperator:
    'rounded-md border border-blue-300 bg-white text-gray-900 px-3 py-1.5 text-sm shadow-sm focus:border-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-800',
  ruleValue:
    'rounded-md border border-blue-300 bg-white text-gray-900 px-3 py-1.5 text-sm shadow-sm focus:border-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-800',
  removeButton:
    'cursor-pointer px-2 py-1.5 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 hover:border-red-500 transition-colors',
  addButton:
    'cursor-pointer px-3 py-1.5 text-sm font-medium text-white bg-red-700 border border-red-700 rounded-md hover:bg-red-800 transition-colors',
  addGroupButton:
    'cursor-pointer px-3 py-1.5 text-sm font-medium text-white bg-blue-800 border border-blue-800 rounded-md hover:bg-blue-900 transition-colors',
};

export const DutchTheme: Story = {
  name: 'Nederlands Thema',
  render: () => {
    const [query, setQuery] = useState<Group>(() => ({
      id: 'root',
      combinator: 'AND',
      rules: [
        { id: '1', field: 'naam', operator: 'eq', value: '' },
        { id: '2', field: 'leeftijd', operator: 'gte', value: '18' },
      ],
    }));
    return (
      <div className="p-6 max-w-4xl">
        <h2 className="text-lg font-bold mb-1 text-blue-900">
          Nederlands Thema
        </h2>
        <p className="text-sm mb-4 text-gray-500">
          Aangepaste knoppen en labels in het Nederlands met de kleuren van de
          Nederlandse vlag.
        </p>
        <TemplateQueryBuilder
          value={query}
          onChange={setQuery}
          classNames={dutchClassNames}
          labels={dutchLabels}
          fields={[
            { name: 'naam', label: 'Naam', type: 'text' },
            { name: 'leeftijd', label: 'Leeftijd', type: 'number' },
            { name: 'stad', label: 'Stad', type: 'text' },
            { name: 'actief', label: 'Actief', type: 'boolean' },
          ]}
        />
        <pre className="mt-4 p-4 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg text-xs overflow-auto">
          {JSON.stringify(query, null, 2)}
        </pre>
      </div>
    );
  },
};
