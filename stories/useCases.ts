import type { FieldDefinition, OperatorDefinition, Group } from '../src/types';

export type UseCase = {
  name: string;
  title: string;
  description: string;
  fields: FieldDefinition[];
  operators?: OperatorDefinition[];
  preset: Group;
};

export const alertManager: UseCase = {
  name: 'AlertManager',
  title: 'Alert Manager',
  description: 'Define when alerts fire based on metric thresholds.',
  fields: [
    { name: 'cpu_usage', label: 'CPU Usage (%)', type: 'number' },
    { name: 'memory_usage', label: 'Memory Usage (%)', type: 'number' },
    { name: 'error_rate', label: 'Error Rate', type: 'number' },
    { name: 'response_time', label: 'Response Time (ms)', type: 'number' },
    { name: 'service', label: 'Service', type: 'select', options: [
      { label: 'API', value: 'api' },
      { label: 'Worker', value: 'worker' },
      { label: 'Database', value: 'db' },
      { label: 'Cache', value: 'cache' },
    ]},
    { name: 'region', label: 'Region', type: 'select', options: [
      { label: 'US East', value: 'us-east' },
      { label: 'US West', value: 'us-west' },
      { label: 'EU West', value: 'eu-west' },
    ]},
    { name: 'is_production', label: 'Is Production', type: 'boolean' },
  ],
  preset: {
    id: 'g1', combinator: 'AND', rules: [
      { id: 'r1', field: 'cpu_usage', operator: 'gt', value: 90 },
      { id: 'r2', field: 'is_production', operator: 'eq', value: true },
      { id: 'g2', combinator: 'OR', rules: [
        { id: 'r3', field: 'error_rate', operator: 'gt', value: 5 },
        { id: 'r4', field: 'response_time', operator: 'gt', value: 2000 },
      ]},
      { id: 'r5', field: 'service', operator: 'eq', value: 'api' },
    ],
  },
};

export const tradingBot: UseCase = {
  name: 'TradingBot',
  title: 'Algorithmic Trading',
  description: 'Build entry/exit conditions for trading strategies.',
  fields: [
    { name: 'price', label: 'Price', type: 'number' },
    { name: 'rsi', label: 'RSI (14)', type: 'number' },
    { name: 'volume', label: 'Volume', type: 'number' },
    { name: 'sma_20', label: 'SMA (20)', type: 'number' },
    { name: 'ema_50', label: 'EMA (50)', type: 'number' },
    { name: 'macd', label: 'MACD', type: 'number' },
    { name: 'market', label: 'Market', type: 'select', options: [
      { label: 'BTC/USD', value: 'btc-usd' },
      { label: 'ETH/USD', value: 'eth-usd' },
      { label: 'SOL/USD', value: 'sol-usd' },
      { label: 'AAPL', value: 'aapl' },
    ]},
  ],
  operators: [
    { name: 'gt', label: '>' },
    { name: 'lt', label: '<' },
    { name: 'gte', label: '>=' },
    { name: 'lte', label: '<=' },
    { name: 'eq', label: '=' },
    { name: 'crosses_above', label: 'crosses above' },
    { name: 'crosses_below', label: 'crosses below' },
  ],
  preset: {
    id: 'g1', combinator: 'AND', rules: [
      { id: 'r1', field: 'market', operator: 'eq', value: 'btc-usd' },
      { id: 'g2', combinator: 'AND', rules: [
        { id: 'r2', field: 'rsi', operator: 'lt', value: 30 },
        { id: 'r3', field: 'price', operator: 'crosses_above', value: '' },
        { id: 'r4', field: 'sma_20', operator: 'gt', value: '' },
      ]},
      { id: 'g3', combinator: 'OR', rules: [
        { id: 'r5', field: 'volume', operator: 'gt', value: 1000000 },
        { id: 'r6', field: 'macd', operator: 'crosses_above', value: 0 },
      ]},
    ],
  },
};

export const automation: UseCase = {
  name: 'Automation',
  title: 'IFTTT / Automation',
  description: 'Compose "if this then that" trigger conditions.',
  fields: [
    { name: 'trigger', label: 'Trigger', type: 'select', options: [
      { label: 'Email received', value: 'email_received' },
      { label: 'File uploaded', value: 'file_uploaded' },
      { label: 'Webhook fired', value: 'webhook' },
      { label: 'Schedule', value: 'schedule' },
    ]},
    { name: 'sender', label: 'Sender', type: 'text' },
    { name: 'file_type', label: 'File Type', type: 'text' },
    { name: 'priority', label: 'Priority', type: 'select', options: [
      { label: 'High', value: 'high' },
      { label: 'Medium', value: 'medium' },
      { label: 'Low', value: 'low' },
    ]},
    { name: 'is_recurring', label: 'Is Recurring', type: 'boolean' },
  ],
  preset: {
    id: 'g1', combinator: 'OR', rules: [
      { id: 'g2', combinator: 'AND', rules: [
        { id: 'r1', field: 'trigger', operator: 'eq', value: 'email_received' },
        { id: 'r2', field: 'sender', operator: 'contains', value: '@company.com' },
        { id: 'r3', field: 'priority', operator: 'eq', value: 'high' },
      ]},
      { id: 'g3', combinator: 'AND', rules: [
        { id: 'r4', field: 'trigger', operator: 'eq', value: 'webhook' },
        { id: 'r5', field: 'is_recurring', operator: 'eq', value: true },
      ]},
      { id: 'r6', field: 'trigger', operator: 'eq', value: 'schedule' },
    ],
  },
};

export const pipelineManager: UseCase = {
  name: 'PipelineManager',
  title: 'Pipeline Manager',
  description: 'Define branching logic and conditional steps in CI/CD pipelines.',
  fields: [
    { name: 'branch', label: 'Branch', type: 'text' },
    { name: 'env', label: 'Environment', type: 'select', options: [
      { label: 'Production', value: 'prod' },
      { label: 'Staging', value: 'staging' },
      { label: 'Development', value: 'dev' },
    ]},
    { name: 'test_coverage', label: 'Test Coverage (%)', type: 'number' },
    { name: 'has_migrations', label: 'Has Migrations', type: 'boolean' },
    { name: 'commit_author', label: 'Commit Author', type: 'text' },
    { name: 'file_changed', label: 'File Changed', type: 'text' },
    { name: 'label', label: 'PR Label', type: 'select', options: [
      { label: 'hotfix', value: 'hotfix' },
      { label: 'feature', value: 'feature' },
      { label: 'chore', value: 'chore' },
    ]},
  ],
  preset: {
    id: 'g1', combinator: 'AND', rules: [
      { id: 'r1', field: 'env', operator: 'eq', value: 'prod' },
      { id: 'r2', field: 'test_coverage', operator: 'gte', value: 80 },
      { id: 'g2', combinator: 'OR', rules: [
        { id: 'r3', field: 'branch', operator: 'eq', value: 'main' },
        { id: 'g3', combinator: 'AND', rules: [
          { id: 'r4', field: 'label', operator: 'eq', value: 'hotfix' },
          { id: 'r5', field: 'has_migrations', operator: 'eq', value: false },
        ]},
      ]},
    ],
  },
};

export const emailFiltering: UseCase = {
  name: 'EmailFiltering',
  title: 'Email Filtering',
  description: 'Build rules for sorting, labeling, or forwarding emails.',
  fields: [
    { name: 'from', label: 'From', type: 'text' },
    { name: 'to', label: 'To', type: 'text' },
    { name: 'subject', label: 'Subject', type: 'text' },
    { name: 'has_attachment', label: 'Has Attachment', type: 'boolean' },
    { name: 'is_read', label: 'Is Read', type: 'boolean' },
    { name: 'category', label: 'Category', type: 'select', options: [
      { label: 'Primary', value: 'primary' },
      { label: 'Social', value: 'social' },
      { label: 'Promotions', value: 'promotions' },
      { label: 'Updates', value: 'updates' },
      { label: 'Spam', value: 'spam' },
    ]},
    { name: 'size_kb', label: 'Size (KB)', type: 'number' },
  ],
  preset: {
    id: 'g1', combinator: 'OR', rules: [
      { id: 'g2', combinator: 'AND', rules: [
        { id: 'r1', field: 'from', operator: 'contains', value: '@newsletter' },
        { id: 'r2', field: 'category', operator: 'eq', value: 'promotions' },
      ]},
      { id: 'g3', combinator: 'AND', rules: [
        { id: 'r3', field: 'has_attachment', operator: 'eq', value: true },
        { id: 'r4', field: 'size_kb', operator: 'gt', value: 5000 },
        { id: 'r5', field: 'from', operator: 'not_contains', value: '@company.com' },
      ]},
      { id: 'r6', field: 'category', operator: 'eq', value: 'spam' },
    ],
  },
};

export const dataValidation: UseCase = {
  name: 'DataValidation',
  title: 'Data Validation',
  description: 'Define validation rules for form fields or data imports.',
  fields: [
    { name: 'field_name', label: 'Field Name', type: 'select', options: [
      { label: 'Email', value: 'email' },
      { label: 'Phone', value: 'phone' },
      { label: 'Age', value: 'age' },
      { label: 'ZIP Code', value: 'zip' },
      { label: 'Username', value: 'username' },
    ]},
    { name: 'value_length', label: 'Value Length', type: 'number' },
    { name: 'is_required', label: 'Is Required', type: 'boolean' },
    { name: 'format', label: 'Format', type: 'select', options: [
      { label: 'Email', value: 'email' },
      { label: 'URL', value: 'url' },
      { label: 'Phone', value: 'phone' },
      { label: 'Numeric', value: 'numeric' },
      { label: 'Alpha', value: 'alpha' },
    ]},
    { name: 'min_value', label: 'Min Value', type: 'number' },
    { name: 'max_value', label: 'Max Value', type: 'number' },
  ],
  operators: [
    { name: 'eq', label: 'equals' },
    { name: 'neq', label: 'not equals' },
    { name: 'gt', label: 'greater than' },
    { name: 'lt', label: 'less than' },
    { name: 'contains', label: 'matches' },
    { name: 'not_contains', label: 'does not match' },
    { name: 'in', label: 'is one of' },
  ],
  preset: {
    id: 'g1', combinator: 'AND', rules: [
      { id: 'g2', combinator: 'AND', rules: [
        { id: 'r1', field: 'field_name', operator: 'eq', value: 'email' },
        { id: 'r2', field: 'is_required', operator: 'eq', value: true },
        { id: 'r3', field: 'format', operator: 'eq', value: 'email' },
      ]},
      { id: 'g3', combinator: 'AND', rules: [
        { id: 'r4', field: 'field_name', operator: 'eq', value: 'age' },
        { id: 'r5', field: 'min_value', operator: 'gt', value: 0 },
        { id: 'r6', field: 'max_value', operator: 'lt', value: 150 },
      ]},
      { id: 'g4', combinator: 'AND', rules: [
        { id: 'r7', field: 'field_name', operator: 'eq', value: 'username' },
        { id: 'r8', field: 'value_length', operator: 'gt', value: 3 },
        { id: 'r9', field: 'format', operator: 'eq', value: 'alpha' },
      ]},
    ],
  },
};

export const accessControl: UseCase = {
  name: 'AccessControl',
  title: 'Access Control',
  description: 'Define permission rules for role-based access.',
  fields: [
    { name: 'role', label: 'Role', type: 'select', options: [
      { label: 'Admin', value: 'admin' },
      { label: 'Editor', value: 'editor' },
      { label: 'Viewer', value: 'viewer' },
      { label: 'Guest', value: 'guest' },
    ]},
    { name: 'resource', label: 'Resource', type: 'select', options: [
      { label: 'Dashboard', value: 'dashboard' },
      { label: 'Users', value: 'users' },
      { label: 'Settings', value: 'settings' },
      { label: 'Billing', value: 'billing' },
      { label: 'API Keys', value: 'api_keys' },
    ]},
    { name: 'action', label: 'Action', type: 'select', options: [
      { label: 'Read', value: 'read' },
      { label: 'Write', value: 'write' },
      { label: 'Delete', value: 'delete' },
      { label: 'Admin', value: 'admin' },
    ]},
    { name: 'ip_range', label: 'IP Range', type: 'text' },
    { name: 'is_2fa_enabled', label: '2FA Enabled', type: 'boolean' },
    { name: 'department', label: 'Department', type: 'text' },
  ],
  preset: {
    id: 'g1', combinator: 'OR', rules: [
      { id: 'g2', combinator: 'AND', rules: [
        { id: 'r1', field: 'role', operator: 'eq', value: 'admin' },
        { id: 'r2', field: 'is_2fa_enabled', operator: 'eq', value: true },
      ]},
      { id: 'g3', combinator: 'AND', rules: [
        { id: 'r3', field: 'role', operator: 'eq', value: 'editor' },
        { id: 'r4', field: 'resource', operator: 'neq', value: 'billing' },
        { id: 'r5', field: 'action', operator: 'neq', value: 'delete' },
      ]},
      { id: 'g4', combinator: 'AND', rules: [
        { id: 'r6', field: 'role', operator: 'eq', value: 'viewer' },
        { id: 'r7', field: 'action', operator: 'eq', value: 'read' },
        { id: 'r8', field: 'ip_range', operator: 'contains', value: '10.0.' },
      ]},
    ],
  },
};

export const searchFilter: UseCase = {
  name: 'SearchFilter',
  title: 'Search / Content Filtering',
  description: 'Build advanced search queries for content or products.',
  fields: [
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'author', label: 'Author', type: 'text' },
    { name: 'category', label: 'Category', type: 'select', options: [
      { label: 'Technology', value: 'tech' },
      { label: 'Science', value: 'science' },
      { label: 'Business', value: 'business' },
      { label: 'Design', value: 'design' },
      { label: 'Health', value: 'health' },
    ]},
    { name: 'published_date', label: 'Published Date', type: 'date' },
    { name: 'rating', label: 'Rating', type: 'number' },
    { name: 'is_featured', label: 'Is Featured', type: 'boolean' },
    { name: 'price', label: 'Price', type: 'number' },
    { name: 'tag', label: 'Tag', type: 'text' },
  ],
  preset: {
    id: 'g1', combinator: 'AND', rules: [
      { id: 'g2', combinator: 'OR', rules: [
        { id: 'r1', field: 'category', operator: 'eq', value: 'tech' },
        { id: 'r2', field: 'category', operator: 'eq', value: 'science' },
      ]},
      { id: 'r3', field: 'rating', operator: 'gte', value: 4 },
      { id: 'g3', combinator: 'OR', rules: [
        { id: 'r4', field: 'is_featured', operator: 'eq', value: true },
        { id: 'g4', combinator: 'AND', rules: [
          { id: 'r5', field: 'price', operator: 'lt', value: 50 },
          { id: 'r6', field: 'published_date', operator: 'gte', value: '2024-01-01' },
        ]},
      ]},
      { id: 'r7', field: 'tag', operator: 'contains', value: 'react' },
    ],
  },
};

export const allUseCases: UseCase[] = [
  alertManager,
  tradingBot,
  automation,
  pipelineManager,
  emailFiltering,
  dataValidation,
  accessControl,
  searchFilter,
];
