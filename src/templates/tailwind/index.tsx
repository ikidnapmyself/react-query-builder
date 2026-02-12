import type { QueryBuilderProps } from '@/types';
import type { TemplateClassNames } from '../shared/types';
import { TemplateQueryBuilder } from '../shared/TemplateQueryBuilder';

const tailwindClassNames: TemplateClassNames = {
  root: 'font-sans',
  group:
    'border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 p-4 space-y-3',
  groupHeader: 'flex items-center gap-2 flex-wrap',
  combinator: 'inline-flex rounded-md shadow-sm',
  combinatorButton:
    'cursor-pointer px-3 py-1.5 text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-l-md last:rounded-r-md -ml-px first:ml-0 transition-colors',
  combinatorButtonActiveAnd:
    'cursor-pointer px-3 py-1.5 text-sm font-medium first:rounded-l-md last:rounded-r-md -ml-px first:ml-0 transition-colors bg-blue-600 dark:bg-blue-500 text-white border border-blue-600 dark:border-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600',
  combinatorButtonActiveOr:
    'cursor-pointer px-3 py-1.5 text-sm font-medium first:rounded-l-md last:rounded-r-md -ml-px first:ml-0 transition-colors bg-amber-500 dark:bg-amber-400 text-white border border-amber-500 dark:border-amber-400 hover:bg-amber-600 dark:hover:bg-amber-500',
  rules:
    'space-y-2 ml-4 border-l-2 border-blue-200 dark:border-blue-800 pl-4',
  rule: 'flex items-center gap-2 flex-wrap',
  ruleField:
    'rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
  ruleOperator:
    'rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
  ruleValue:
    'rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
  removeButton:
    'cursor-pointer px-2 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-300 dark:hover:border-red-700 transition-colors',
  addButton:
    'cursor-pointer px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 transition-colors',
  addGroupButton:
    'cursor-pointer px-3 py-1.5 text-sm font-medium text-green-600 dark:text-green-400 bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 rounded-md hover:bg-green-50 dark:hover:bg-green-900/30 hover:border-green-300 dark:hover:border-green-700 transition-colors',
};

export function TailwindQueryBuilder(props: QueryBuilderProps) {
  return <TemplateQueryBuilder {...props} classNames={tailwindClassNames} />;
}
