import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useEffect } from 'react';
import bootstrapCssUrl from 'bootstrap/dist/css/bootstrap.min.css?url';
import { BootstrapQueryBuilder } from '../../src/templates/bootstrap';
import type { Group } from '../../src';
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

/** Dynamically injects Bootstrap CSS when mounted, removes it on unmount. */
function useBootstrapCSS() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = bootstrapCssUrl;
    link.id = 'bootstrap-story-css';
    document.head.appendChild(link);
    return () => { link.remove(); };
  }, []);
}

const meta: Meta<typeof BootstrapQueryBuilder> = {
  title: 'Templates/Bootstrap',
  component: BootstrapQueryBuilder,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BootstrapQueryBuilder>;

function BootstrapDemo({ useCase, colorMode = 'light' }: { useCase: UseCase; colorMode?: 'light' | 'dark' }) {
  useBootstrapCSS();
  const [query, setQuery] = useState<Group>(() => useCase.preset);
  return (
    <div className={`p-4 rounded ${colorMode === 'dark' ? 'bg-body' : ''}`} data-bs-theme={colorMode}>
      <h2 className="text-body mb-1" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
        {useCase.title}
      </h2>
      <p className="text-body-secondary mb-3" style={{ fontSize: '0.875rem' }}>
        {useCase.description}
      </p>
      <BootstrapQueryBuilder
        value={query}
        onChange={setQuery}
        colorMode={colorMode}
        fields={useCase.fields}
        operators={useCase.operators}
      />
      <pre className="mt-3 p-3 bg-body-secondary text-body rounded" style={{ fontSize: '0.75rem' }}>
        {JSON.stringify(query, null, 2)}
      </pre>
    </div>
  );
}

const src = (useCase: UseCase) => ({
  docs: { source: { code: generateSource(useCase, 'Bootstrap'), language: 'tsx' } },
});

export const Default: Story = {
  render: () => {
    useBootstrapCSS();
    const [query, setQuery] = useState<Group>(createEmptyGroup);
    return (
      <div className="p-4" data-bs-theme="light">
        <BootstrapQueryBuilder
          value={query}
          onChange={setQuery}
          colorMode="light"
          fields={[
            { name: 'name', label: 'Name', type: 'text' },
            { name: 'age', label: 'Age', type: 'number' },
            { name: 'active', label: 'Active', type: 'boolean' },
          ]}
        />
        <pre className="mt-3 p-3 bg-body-secondary text-body rounded" style={{ fontSize: '0.75rem' }}>
          {JSON.stringify(query, null, 2)}
        </pre>
      </div>
    );
  },
};

export const DarkMode: Story = {
  render: () => {
    useBootstrapCSS();
    const [query, setQuery] = useState<Group>(createEmptyGroup);
    return (
      <div className="p-4 bg-body rounded" data-bs-theme="dark">
        <BootstrapQueryBuilder
          value={query}
          onChange={setQuery}
          colorMode="dark"
          fields={[
            { name: 'name', label: 'Name', type: 'text' },
            { name: 'age', label: 'Age', type: 'number' },
            { name: 'active', label: 'Active', type: 'boolean' },
          ]}
        />
        <pre className="mt-3 p-3 bg-body-secondary text-body rounded" style={{ fontSize: '0.75rem' }}>
          {JSON.stringify(query, null, 2)}
        </pre>
      </div>
    );
  },
};

export const AlertManager: Story = {
  render: () => <BootstrapDemo useCase={alertManager} />,
  parameters: src(alertManager),
};

export const AlertManagerDark: Story = {
  render: () => <BootstrapDemo useCase={alertManager} colorMode="dark" />,
  parameters: src(alertManager),
};

export const TradingBot: Story = {
  render: () => <BootstrapDemo useCase={tradingBot} />,
  parameters: src(tradingBot),
};

export const TradingBotDark: Story = {
  render: () => <BootstrapDemo useCase={tradingBot} colorMode="dark" />,
  parameters: src(tradingBot),
};

export const Automation: Story = {
  render: () => <BootstrapDemo useCase={automation} />,
  parameters: src(automation),
};

export const PipelineManager: Story = {
  render: () => <BootstrapDemo useCase={pipelineManager} />,
  parameters: src(pipelineManager),
};

export const EmailFiltering: Story = {
  render: () => <BootstrapDemo useCase={emailFiltering} />,
  parameters: src(emailFiltering),
};

export const DataValidation: Story = {
  render: () => <BootstrapDemo useCase={dataValidation} />,
  parameters: src(dataValidation),
};

export const AccessControl: Story = {
  render: () => <BootstrapDemo useCase={accessControl} />,
  parameters: src(accessControl),
};

export const SearchFilter: Story = {
  render: () => <BootstrapDemo useCase={searchFilter} />,
  parameters: src(searchFilter),
};
