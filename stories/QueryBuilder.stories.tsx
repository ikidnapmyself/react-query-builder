import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { QueryBuilder } from '../src/components';
import { useQueryBuilder } from '../src/hooks';
import type { Group } from '../src/types';
import { createEmptyGroup } from '../src/core';

const meta: Meta<typeof QueryBuilder> = {
  title: 'QueryBuilder',
  component: QueryBuilder,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof QueryBuilder>;

export const Default: Story = {
  render: () => {
    const [query, setQuery] = useState<Group>(createEmptyGroup);
    return (
      <div>
        <QueryBuilder value={query} onChange={setQuery}>
          <pre className="p-4 bg-gray-100 rounded text-sm">
            {JSON.stringify(query, null, 2)}
          </pre>
        </QueryBuilder>
      </div>
    );
  },
};

export const HooksOnly: Story = {
  render: () => {
    const { query, addRule, addGroup } = useQueryBuilder();
    return (
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-bold">Hooks-only usage</h2>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded"
            onClick={() => addRule(query.id)}
          >
            + Rule
          </button>
          <button
            className="px-3 py-1 bg-green-500 text-white rounded"
            onClick={() => addGroup(query.id)}
          >
            + Group
          </button>
        </div>
        <pre className="p-4 bg-gray-100 rounded text-sm">
          {JSON.stringify(query, null, 2)}
        </pre>
      </div>
    );
  },
};
