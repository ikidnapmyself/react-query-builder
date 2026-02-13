import { render, screen, fireEvent } from '@testing-library/react';
import { RuleRow } from './RuleRow';
import type { Rule } from '../../types';
import type { TemplateClassNames } from './types';

const cn: TemplateClassNames = {
  root: '', group: '', groupHeader: '', combinator: '',
  combinatorButton: '', combinatorButtonActiveAnd: '', combinatorButtonActiveOr: '',
  rules: '', rule: '', ruleField: '', ruleOperator: '',
  ruleValue: '', removeButton: '', addButton: '', addGroupButton: '',
};

const fields = [
  { name: 'name', label: 'Name' },
  { name: 'age', label: 'Age', type: 'number' as const },
  { name: 'dob', label: 'DOB', type: 'date' as const },
  { name: 'active', label: 'Active', type: 'boolean' as const },
  { name: 'status', label: 'Status', type: 'select' as const, options: [{ label: 'Open', value: 'open' }, { label: 'Closed', value: 'closed' }] },
  { name: 'broken', label: 'Broken', type: 'select' as const },
];

const operators = [{ name: 'eq', label: '=' }, { name: 'neq', label: '!=' }];

describe('RuleRow', () => {
  let onUpdate: ReturnType<typeof vi.fn>;
  let onRemove: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onUpdate = vi.fn();
    onRemove = vi.fn();
  });

  function renderRule(rule: Rule) {
    return render(
      <RuleRow rule={rule} fields={fields} operators={operators} classNames={cn} onUpdate={onUpdate} onRemove={onRemove} />
    );
  }

  // --- Field select ---

  it('calls onUpdate with reset value when field changes', () => {
    renderRule({ id: 'r1', field: '', operator: 'eq', value: '' });
    const fieldSelect = screen.getByDisplayValue('Select field...');
    fireEvent.change(fieldSelect, { target: { value: 'name' } });
    expect(onUpdate).toHaveBeenCalledWith('r1', { field: 'name', value: '' });
  });

  // --- Operator select ---

  it('calls onUpdate when operator changes', () => {
    renderRule({ id: 'r1', field: '', operator: 'eq', value: '' });
    const opSelect = screen.getByDisplayValue('=');
    fireEvent.change(opSelect, { target: { value: 'neq' } });
    expect(onUpdate).toHaveBeenCalledWith('r1', { operator: 'neq' });
  });

  // --- Remove button ---

  it('calls onRemove when remove button is clicked', () => {
    renderRule({ id: 'r1', field: '', operator: 'eq', value: '' });
    fireEvent.click(screen.getByText('Remove'));
    expect(onRemove).toHaveBeenCalledWith('r1');
  });

  // --- ValueInput: text (default, no field match) ---

  it('renders text input when field has no match', () => {
    renderRule({ id: 'r1', field: '', operator: 'eq', value: '' });
    expect(screen.getByPlaceholderText('Value')).toHaveAttribute('type', 'text');
  });

  it('renders text input for text-typed field', () => {
    renderRule({ id: 'r1', field: 'name', operator: 'eq', value: 'Alice' });
    expect(screen.getByDisplayValue('Alice')).toHaveAttribute('type', 'text');
  });

  it('calls onUpdate with string value for text input', () => {
    renderRule({ id: 'r1', field: 'name', operator: 'eq', value: '' });
    fireEvent.change(screen.getByPlaceholderText('Value'), { target: { value: 'Bob' } });
    expect(onUpdate).toHaveBeenCalledWith('r1', { value: 'Bob' });
  });

  // --- ValueInput: number ---

  it('renders number input for number-typed field', () => {
    renderRule({ id: 'r1', field: 'age', operator: 'eq', value: 25 });
    expect(screen.getByDisplayValue('25')).toHaveAttribute('type', 'number');
  });

  it('calls onUpdate with Number value for number input', () => {
    renderRule({ id: 'r1', field: 'age', operator: 'eq', value: '' });
    fireEvent.change(screen.getByPlaceholderText('Value'), { target: { value: '42' } });
    expect(onUpdate).toHaveBeenCalledWith('r1', { value: 42 });
  });

  // --- ValueInput: date ---

  it('renders date input for date-typed field', () => {
    renderRule({ id: 'r1', field: 'dob', operator: 'eq', value: '2025-01-01' });
    expect(screen.getByDisplayValue('2025-01-01')).toHaveAttribute('type', 'date');
  });

  // --- ValueInput: boolean ---

  it('renders boolean select with True/False options', () => {
    renderRule({ id: 'r1', field: 'active', operator: 'eq', value: '' });
    expect(screen.getByText('True')).toBeInTheDocument();
    expect(screen.getByText('False')).toBeInTheDocument();
  });

  it('calls onUpdate with boolean true for boolean select', () => {
    renderRule({ id: 'r1', field: 'active', operator: 'eq', value: '' });
    const boolSelect = screen.getByDisplayValue('Select...');
    fireEvent.change(boolSelect, { target: { value: 'true' } });
    expect(onUpdate).toHaveBeenCalledWith('r1', { value: true });
  });

  it('calls onUpdate with boolean false for boolean select', () => {
    renderRule({ id: 'r1', field: 'active', operator: 'eq', value: '' });
    const boolSelect = screen.getByDisplayValue('Select...');
    fireEvent.change(boolSelect, { target: { value: 'false' } });
    expect(onUpdate).toHaveBeenCalledWith('r1', { value: false });
  });

  // --- ValueInput: select with options ---

  it('renders select dropdown with field options', () => {
    renderRule({ id: 'r1', field: 'status', operator: 'eq', value: '' });
    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByText('Closed')).toBeInTheDocument();
  });

  it('calls onUpdate with selected option value', () => {
    renderRule({ id: 'r1', field: 'status', operator: 'eq', value: '' });
    const selects = screen.getAllByRole('combobox');
    const valueSelect = selects[selects.length - 1];
    fireEvent.change(valueSelect, { target: { value: 'open' } });
    expect(onUpdate).toHaveBeenCalledWith('r1', { value: 'open' });
  });

  // --- ValueInput: select type without options (falls back to text input) ---

  it('renders text input when field type is select but has no options', () => {
    renderRule({ id: 'r1', field: 'broken', operator: 'eq', value: '' });
    expect(screen.getByPlaceholderText('Value')).toHaveAttribute('type', 'text');
  });

  // --- ValueInput: null/undefined value ---

  it('renders empty string for null value', () => {
    renderRule({ id: 'r1', field: 'name', operator: 'eq', value: null });
    expect(screen.getByPlaceholderText('Value')).toHaveValue('');
  });
});
