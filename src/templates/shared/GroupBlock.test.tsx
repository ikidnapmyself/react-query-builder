import { render, screen, fireEvent } from '@testing-library/react';
import { GroupBlock } from './GroupBlock';
import type { Group } from '../../types';
import type { TemplateClassNames } from './types';

const cn: TemplateClassNames = {
  root: '', group: 'group', groupHeader: '', combinator: '',
  combinatorButton: 'btn-inactive', combinatorButtonActiveAnd: 'btn-active-and',
  combinatorButtonActiveOr: 'btn-active-or',
  rules: '', rule: '', ruleField: '', ruleOperator: '',
  ruleValue: '', removeButton: 'remove-btn', addButton: 'add-btn',
  addGroupButton: 'add-group-btn',
};

const operators = [{ name: 'eq', label: '=' }];
const fields = [{ name: 'name', label: 'Name' }];

describe('GroupBlock', () => {
  let onAddRule: ReturnType<typeof vi.fn>;
  let onAddGroup: ReturnType<typeof vi.fn>;
  let onRemoveRule: ReturnType<typeof vi.fn>;
  let onRemoveGroup: ReturnType<typeof vi.fn>;
  let onUpdateRule: ReturnType<typeof vi.fn>;
  let onSetCombinator: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onAddRule = vi.fn();
    onAddGroup = vi.fn();
    onRemoveRule = vi.fn();
    onRemoveGroup = vi.fn();
    onUpdateRule = vi.fn();
    onSetCombinator = vi.fn();
  });

  function renderGroup(group: Group, isRoot = false) {
    return render(
      <GroupBlock
        group={group} isRoot={isRoot} fields={fields} operators={operators}
        classNames={cn} onAddRule={onAddRule} onAddGroup={onAddGroup}
        onRemoveRule={onRemoveRule} onRemoveGroup={onRemoveGroup}
        onUpdateRule={onUpdateRule} onSetCombinator={onSetCombinator}
      />
    );
  }

  const groupAnd: Group = {
    id: 'g1', combinator: 'AND',
    rules: [{ id: 'r1', field: 'name', operator: 'eq', value: 'test' }],
  };

  const groupOr: Group = {
    id: 'g1', combinator: 'OR',
    rules: [{ id: 'r1', field: 'name', operator: 'eq', value: 'test' }],
  };

  // --- Combinator buttons ---

  it('shows AND button as active when combinator is AND', () => {
    renderGroup(groupAnd);
    expect(screen.getByText('AND')).toHaveClass('btn-active-and');
    expect(screen.getByText('OR')).toHaveClass('btn-inactive');
  });

  it('shows OR button as active when combinator is OR', () => {
    renderGroup(groupOr);
    expect(screen.getByText('OR')).toHaveClass('btn-active-or');
    expect(screen.getByText('AND')).toHaveClass('btn-inactive');
  });

  it('calls onSetCombinator when AND button is clicked', () => {
    renderGroup(groupOr);
    fireEvent.click(screen.getByText('AND'));
    expect(onSetCombinator).toHaveBeenCalledWith('g1', 'AND');
  });

  it('calls onSetCombinator when OR button is clicked', () => {
    renderGroup(groupAnd);
    fireEvent.click(screen.getByText('OR'));
    expect(onSetCombinator).toHaveBeenCalledWith('g1', 'OR');
  });

  // --- Add buttons ---

  it('calls onAddRule with group id when + Rule is clicked', () => {
    renderGroup(groupAnd);
    fireEvent.click(screen.getByText('+ Rule'));
    expect(onAddRule).toHaveBeenCalledWith('g1');
  });

  it('calls onAddGroup with group id when + Group is clicked', () => {
    renderGroup(groupAnd);
    fireEvent.click(screen.getByText('+ Group'));
    expect(onAddGroup).toHaveBeenCalledWith('g1');
  });

  // --- Remove button ---

  it('does not render group remove button when isRoot is true', () => {
    renderGroup(groupAnd, true);
    // Only the rule's remove button should be present, not the group's
    const removeButtons = screen.getAllByText('Remove');
    expect(removeButtons).toHaveLength(1); // only rule's remove
  });

  it('renders group remove button when isRoot is false', () => {
    renderGroup(groupAnd, false);
    const removeButtons = screen.getAllByText('Remove');
    expect(removeButtons).toHaveLength(2); // rule's remove + group's remove
  });

  it('calls onRemoveGroup when group remove button is clicked', () => {
    renderGroup(groupAnd, false);
    const removeButtons = screen.getAllByText('Remove');
    // Group remove button is in the header (first), rule's remove is in the rules section (second)
    fireEvent.click(removeButtons[0]);
    expect(onRemoveGroup).toHaveBeenCalledWith('g1');
  });

  // --- Nested group rendering ---

  it('renders nested GroupBlock for group items', () => {
    const nested: Group = {
      id: 'g1', combinator: 'AND',
      rules: [
        { id: 'g2', combinator: 'OR', rules: [{ id: 'r1', field: '', operator: 'eq', value: '' }] },
      ],
    };
    renderGroup(nested);
    // Both groups should render AND/OR buttons
    const andButtons = screen.getAllByText('AND');
    expect(andButtons).toHaveLength(2); // parent AND + nested AND
  });

  // --- Rule rendering ---

  it('renders RuleRow for rule items', () => {
    renderGroup(groupAnd, true);
    expect(screen.getByText('Remove')).toBeInTheDocument();
  });
});
