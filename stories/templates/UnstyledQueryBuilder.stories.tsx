import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { UnstyledQueryBuilder } from '../../src/templates/unstyled';
import type { Group } from '../../src/types';
import { createEmptyGroup } from '../../src/core';
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

const meta: Meta<typeof UnstyledQueryBuilder> = {
  title: 'Templates/Unstyled',
  component: UnstyledQueryBuilder,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof UnstyledQueryBuilder>;

const wrapperStyle: CSSProperties = {
  colorScheme: 'light dark',
  padding: '1.5rem',
  maxWidth: '56rem',
};

const titleStyle: CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 'bold',
  marginBottom: '0.25rem',
};

const descriptionStyle: CSSProperties = {
  fontSize: '0.875rem',
  opacity: 0.6,
  marginBottom: '1rem',
};

const preStyle: CSSProperties = {
  marginTop: '1rem',
  padding: '1rem',
  borderRadius: '4px',
  fontSize: '0.75rem',
  border: '1px solid currentColor',
  opacity: 0.8,
  overflow: 'auto',
};

function UnstyledDemo({ useCase }: { useCase: UseCase }) {
  const [query, setQuery] = useState<Group>(() => useCase.preset);
  return (
    <div style={wrapperStyle}>
      <h2 style={titleStyle}>{useCase.title}</h2>
      <p style={descriptionStyle}>{useCase.description}</p>
      <UnstyledQueryBuilder
        value={query}
        onChange={setQuery}
        fields={useCase.fields}
        operators={useCase.operators}
      />
      <pre style={preStyle}>
        {JSON.stringify(query, null, 2)}
      </pre>
    </div>
  );
}

const src = (useCase: UseCase) => ({
  docs: { source: { code: generateSource(useCase, 'Unstyled'), language: 'tsx' } },
});

export const Default: Story = {
  render: () => {
    const [query, setQuery] = useState<Group>(createEmptyGroup);
    return (
      <div style={wrapperStyle}>
        <UnstyledQueryBuilder
          value={query}
          onChange={setQuery}
          fields={[
            { name: 'name', label: 'Name', type: 'text' },
            { name: 'age', label: 'Age', type: 'number' },
            { name: 'active', label: 'Active', type: 'boolean' },
          ]}
        />
        <pre style={preStyle}>
          {JSON.stringify(query, null, 2)}
        </pre>
      </div>
    );
  },
};

export const AlertManager: Story = {
  render: () => <UnstyledDemo useCase={alertManager} />,
  parameters: src(alertManager),
};

export const TradingBot: Story = {
  render: () => <UnstyledDemo useCase={tradingBot} />,
  parameters: src(tradingBot),
};

export const Automation: Story = {
  render: () => <UnstyledDemo useCase={automation} />,
  parameters: src(automation),
};

export const PipelineManager: Story = {
  render: () => <UnstyledDemo useCase={pipelineManager} />,
  parameters: src(pipelineManager),
};

export const EmailFiltering: Story = {
  render: () => <UnstyledDemo useCase={emailFiltering} />,
  parameters: src(emailFiltering),
};

export const DataValidation: Story = {
  render: () => <UnstyledDemo useCase={dataValidation} />,
  parameters: src(dataValidation),
};

export const AccessControl: Story = {
  render: () => <UnstyledDemo useCase={accessControl} />,
  parameters: src(accessControl),
};

export const SearchFilter: Story = {
  render: () => <UnstyledDemo useCase={searchFilter} />,
  parameters: src(searchFilter),
};
