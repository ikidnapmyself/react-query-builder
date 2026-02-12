import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TailwindQueryBuilder } from '../../src/templates/tailwind';
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
