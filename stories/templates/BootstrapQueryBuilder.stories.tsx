import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useEffect } from 'react';
import bootstrapCssUrl from 'bootstrap/dist/css/bootstrap.min.css?url';
import { BootstrapQueryBuilder } from '../../src/templates/bootstrap';
import { TemplateQueryBuilder } from '../../src/templates/shared/TemplateQueryBuilder';
import type { TemplateClassNames } from '../../src/templates/shared/types';
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

const dutchBootstrapClassNames: TemplateClassNames = {
  root: '',
  group: 'card border-2 border-primary mb-3',
  groupHeader: 'd-flex align-items-center gap-2 card-header bg-primary bg-opacity-10 fw-semibold flex-wrap',
  combinator: 'btn-group btn-group-sm',
  combinatorButton: 'btn btn-outline-secondary',
  combinatorButtonActiveAnd: 'btn btn-danger fw-bold',
  combinatorButtonActiveOr: 'btn btn-primary fw-bold',
  rules: 'card-body d-flex flex-column gap-2 ps-4 border-start border-danger border-3',
  rule: 'd-flex align-items-center gap-2 flex-wrap',
  ruleField: 'form-select form-select-sm w-auto fw-medium',
  ruleOperator: 'form-select form-select-sm w-auto fw-medium',
  ruleValue: 'form-control form-control-sm w-auto',
  removeButton: 'btn btn-outline-danger btn-sm',
  addButton: 'btn btn-danger btn-sm',
  addGroupButton: 'btn btn-primary btn-sm',
};

const dutchLabels = {
  and: 'EN',
  or: 'OF',
  addRule: '+ Regel',
  addGroup: '+ Groep',
  removeRule: 'Verwijder',
  removeGroup: 'Verwijder',
};

export const DutchTheme: Story = {
  name: 'Nederlands Thema',
  render: () => {
    useBootstrapCSS();
    const [query, setQuery] = useState<Group>(() => ({
      id: 'root',
      combinator: 'AND',
      rules: [
        { id: '1', field: 'naam', operator: 'eq', value: '' },
        { id: '2', field: 'leeftijd', operator: 'gte', value: '18' },
      ],
    }));
    return (
      <div className="p-4" data-bs-theme="light">
        <h2 className="text-primary mb-1" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
          Nederlands Thema
        </h2>
        <p className="text-body-secondary mb-3" style={{ fontSize: '0.875rem' }}>
          Aangepaste knoppen en labels in het Nederlands met de kleuren van de
          Nederlandse vlag.
        </p>
        <TemplateQueryBuilder
          value={query}
          onChange={setQuery}
          classNames={dutchBootstrapClassNames}
          labels={dutchLabels}
          rootProps={{ 'data-bs-theme': 'light' }}
          fields={[
            { name: 'naam', label: 'Naam', type: 'text' },
            { name: 'leeftijd', label: 'Leeftijd', type: 'number' },
            { name: 'stad', label: 'Stad', type: 'text' },
            { name: 'actief', label: 'Actief', type: 'boolean' },
          ]}
        />
        <pre className="mt-3 p-3 bg-body-secondary text-body rounded" style={{ fontSize: '0.75rem' }}>
          {JSON.stringify(query, null, 2)}
        </pre>
      </div>
    );
  },
};
