import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import App from '../App';

describe('Task Priority Board Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders the board with 4 priority columns, header counts, and progress summary', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /Task Priority Board/i })).toBeInTheDocument();
    expect(screen.getByText(/0 of 8/i)).toBeInTheDocument();

    // 4 Columns
    expect(screen.getByRole('region', { name: /Unassigned column/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /High Priority column/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /Medium Priority column/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /Low Priority column/i })).toBeInTheDocument();

    // Initially 8 unassigned tasks
    const unassignedCol = screen.getByRole('region', { name: /Unassigned column/i });
    expect(within(unassignedCol).getByText('8')).toBeInTheDocument();

    // High, Medium, Low are initially empty with personality copy
    const highCol = screen.getByRole('region', { name: /High Priority column/i });
    expect(within(highCol).getByText('0')).toBeInTheDocument();
    expect(within(highCol).getByText(/No fires to put out right now/i)).toBeInTheDocument();
  });

  it('allows adding a new task to Unassigned and rejects empty or duplicate titles', () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/What needs doing\?/i);
    const submitBtn = screen.getByRole('button', { name: /Add Task to Board/i });

    // 1. Try empty submission
    fireEvent.click(submitBtn);
    expect(screen.getByRole('alert')).toHaveTextContent(/Give your task a name first/i);

    // 2. Try duplicate submission with an existing task
    fireEvent.change(input, {
      target: { value: 'Audit website accessibility & keyboard navigation' },
    });
    fireEvent.click(submitBtn);
    expect(screen.getByRole('alert')).toHaveTextContent(/already exists/i);

    // 3. Valid submission
    fireEvent.change(input, { target: { value: 'Build GraphQL gateway service' } });
    fireEvent.click(submitBtn);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('Build GraphQL gateway service')).toBeInTheDocument();

    // Verify count increased to 9 in Unassigned
    const unassignedCol = screen.getByRole('region', { name: /Unassigned column/i });
    expect(within(unassignedCol).getByText('9')).toBeInTheDocument();
  });

  it('moves an unassigned task via move menu to High, Medium, Low, and unassigns it', () => {
    render(<App />);

    const taskTitle = 'Audit website accessibility & keyboard navigation';
    const card = screen.getByLabelText(`Task: ${taskTitle}`);

    // Open Move dropdown menu
    const moveMenuBtn = within(card).getByRole('button', {
      name: new RegExp(`Move task "${taskTitle}"`, 'i'),
    });
    fireEvent.click(moveMenuBtn);

    // In Unassigned: High, Medium, Low are present. Unassign is NOT present.
    expect(
      within(card).getByRole('menuitem', { name: /Move.*to High Priority/i })
    ).toBeInTheDocument();
    expect(
      within(card).getByRole('menuitem', { name: /Move.*to Medium Priority/i })
    ).toBeInTheDocument();
    expect(
      within(card).getByRole('menuitem', { name: /Move.*to Low Priority/i })
    ).toBeInTheDocument();
    expect(within(card).queryByRole('menuitem', { name: /Unassign/i })).not.toBeInTheDocument();

    // 1. Move to High Priority
    fireEvent.click(within(card).getByRole('menuitem', { name: /Move.*to High Priority/i }));

    const highCol = screen.getByRole('region', { name: /High Priority column/i });
    expect(within(highCol).getByText(taskTitle)).toBeInTheDocument();
    expect(within(highCol).getByText('1')).toBeInTheDocument();

    // In High: Open move menu on moved card
    const movedCardInHigh = screen.getByLabelText(`Task: ${taskTitle}`);
    const highMoveBtn = within(movedCardInHigh).getByRole('button', {
      name: new RegExp(`Move task "${taskTitle}"`, 'i'),
    });
    fireEvent.click(highMoveBtn);

    expect(
      within(movedCardInHigh).queryByRole('menuitem', { name: /Move.*to High Priority/i })
    ).not.toBeInTheDocument();
    expect(
      within(movedCardInHigh).getByRole('menuitem', { name: /Move.*to Medium Priority/i })
    ).toBeInTheDocument();
    expect(
      within(movedCardInHigh).getByRole('menuitem', { name: /Move.*to Low Priority/i })
    ).toBeInTheDocument();
    expect(
      within(movedCardInHigh).getByRole('menuitem', { name: /Unassign/i })
    ).toBeInTheDocument();

    // 2. Move to Medium Priority
    fireEvent.click(
      within(movedCardInHigh).getByRole('menuitem', { name: /Move.*to Medium Priority/i })
    );
    const medCol = screen.getByRole('region', { name: /Medium Priority column/i });
    expect(within(medCol).getByText(taskTitle)).toBeInTheDocument();
    expect(within(medCol).getByText('1')).toBeInTheDocument();
    expect(within(highCol).getByText('0')).toBeInTheDocument();

    // 3. Move to Low Priority
    const movedCardInMed = screen.getByLabelText(`Task: ${taskTitle}`);
    const medMoveBtn = within(movedCardInMed).getByRole('button', {
      name: new RegExp(`Move task "${taskTitle}"`, 'i'),
    });
    fireEvent.click(medMoveBtn);
    fireEvent.click(
      within(movedCardInMed).getByRole('menuitem', { name: /Move.*to Low Priority/i })
    );

    const lowCol = screen.getByRole('region', { name: /Low Priority column/i });
    expect(within(lowCol).getByText(taskTitle)).toBeInTheDocument();
    expect(within(lowCol).getByText('1')).toBeInTheDocument();

    // 4. Click Unassign -> Moves back to Unassigned
    const movedCardInLow = screen.getByLabelText(`Task: ${taskTitle}`);
    const lowMoveBtn = within(movedCardInLow).getByRole('button', {
      name: new RegExp(`Move task "${taskTitle}"`, 'i'),
    });
    fireEvent.click(lowMoveBtn);
    fireEvent.click(within(movedCardInLow).getByRole('menuitem', { name: /Unassign/i }));

    const unassignedCol = screen.getByRole('region', { name: /Unassigned column/i });
    expect(within(unassignedCol).getByText(taskTitle)).toBeInTheDocument();
    expect(within(unassignedCol).getByText('8')).toBeInTheDocument();
    expect(within(lowCol).getByText('0')).toBeInTheDocument();
  });

  it('supports inline title editing with double-click or edit icon and validation', () => {
    render(<App />);

    const card = screen.getByLabelText(
      'Task: Implement rate limiting on authentication API endpoints'
    );

    // Click edit icon
    const editBtn = within(card).getByRole('button', { name: /Edit title/i });
    fireEvent.click(editBtn);

    const editInput = within(card).getByLabelText(/Edit task title/i);
    expect(editInput).toBeInTheDocument();

    // Change title to new title and save
    fireEvent.change(editInput, { target: { value: 'Implement Redis token bucket rate limiter' } });
    fireEvent.click(within(card).getByRole('button', { name: /Save title/i }));

    expect(screen.getByText('Implement Redis token bucket rate limiter')).toBeInTheDocument();
  });

  it('deletes a task with confirmation dialog', () => {
    render(<App />);

    const taskTitle = 'Refactor database queries to eliminate N+1 problem';
    const card = screen.getByLabelText(`Task: ${taskTitle}`);

    // Mock confirm dialog to true
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const deleteBtn = within(card).getByRole('button', { name: /Delete task/i });
    fireEvent.click(deleteBtn);

    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining(taskTitle));
    expect(screen.queryByText(taskTitle)).not.toBeInTheDocument();

    // Count decreased from 8 to 7
    const unassignedCol = screen.getByRole('region', { name: /Unassigned column/i });
    expect(within(unassignedCol).getByText('7')).toBeInTheDocument();
  });

  it('filters tasks across all columns by search query', () => {
    render(<App />);

    const searchInput = screen.getByPlaceholderText(/Filter tasks by title/i);

    // Search for "Docker" (does not exist)
    fireEvent.change(searchInput, { target: { value: 'Docker' } });
    expect(screen.getByText(/Showing 0 of 8 tasks/i)).toBeInTheDocument();
    expect(screen.getAllByText(/No tasks matching "Docker"/i)).toHaveLength(4);

    // Search for "accessibility"
    fireEvent.change(searchInput, { target: { value: 'accessibility' } });
    expect(screen.getByText(/Showing 1 of 8 tasks/i)).toBeInTheDocument();
    expect(
      screen.getByText('Audit website accessibility & keyboard navigation')
    ).toBeInTheDocument();

    // Clear search
    const clearBtn = screen.getByRole('button', { name: /Clear filter search/i });
    fireEvent.click(clearBtn);
    expect(screen.queryByText(/Showing/i)).not.toBeInTheDocument();
  });

  it('supports undo from toast notification and restores previous state', () => {
    render(<App />);

    // Move task to High
    const card = screen.getByLabelText('Task: Audit website accessibility & keyboard navigation');
    const moveBtn = within(card).getByRole('button', { name: /Move task/i });
    fireEvent.click(moveBtn);
    fireEvent.click(within(card).getByRole('menuitem', { name: /Move.*to High Priority/i }));

    // Toast notification appears with Undo button
    const toast = screen.getByRole('status', { name: /Action feedback/i });
    expect(toast).toHaveTextContent(/moved to High Priority/i);

    const undoBtn = within(toast).getByRole('button', { name: /Undo/i });
    expect(undoBtn).toBeInTheDocument();

    // Click Undo
    fireEvent.click(undoBtn);

    // Task is restored to Unassigned
    const highCol = screen.getByRole('region', { name: /High Priority column/i });
    expect(within(highCol).getByText('0')).toBeInTheDocument();
  });

  it('toggles dark and light mode', () => {
    render(<App />);

    const toggleBtn = screen.getByRole('button', { name: /Click to switch to/i });
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    fireEvent.click(toggleBtn);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    fireEvent.click(toggleBtn);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
  it('picks an initial priority from the custom select (mouse and keyboard) and resets after adding', () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/What needs doing\?/i);
    const submitBtn = screen.getByRole('button', { name: /Add Task to Board/i });
    const picker = screen.getByRole('combobox', { name: /Initial task priority/i });

    // Mouse: open and choose High Priority
    fireEvent.click(picker);
    const listbox = screen.getByRole('listbox', { name: /Initial task priority/i });
    expect(within(listbox).getByRole('option', { name: /Unassigned/i })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    fireEvent.click(within(listbox).getByRole('option', { name: /High Priority/i }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(picker).toHaveAccessibleName(/High Priority/i);

    fireEvent.change(input, { target: { value: 'Patch login vulnerability' } });
    fireEvent.click(submitBtn);

    const highCol = screen.getByRole('region', { name: /High Priority column/i });
    expect(within(highCol).getByText('Patch login vulnerability')).toBeInTheDocument();
    // Picker resets to Unassigned after a successful add
    expect(picker).toHaveAccessibleName(/Unassigned/i);

    // Keyboard: ArrowDown opens, End jumps to Low, Enter selects
    fireEvent.keyDown(picker, { key: 'ArrowDown' });
    const list = screen.getByRole('listbox');
    fireEvent.keyDown(list, { key: 'End' });
    fireEvent.keyDown(list, { key: 'Enter' });
    expect(picker).toHaveAccessibleName(/Low Priority/i);

    // Escape closes without changing the value
    fireEvent.keyDown(picker, { key: 'Enter' });
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Home' });
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(picker).toHaveAccessibleName(/Low Priority/i);
  });
  it('auto-dismisses the toast, pauses while hovered, and shows a fresh toast after a manual dismiss', () => {
    vi.useFakeTimers();
    try {
      render(<App />);
      const getToast = () => screen.queryByRole('status', { name: /Action feedback/i });

      // Initial info toast (no Undo) disappears after 4s
      expect(getToast()).toBeInTheDocument();
      act(() => vi.advanceTimersByTime(4000));
      expect(getToast()).not.toBeInTheDocument();

      // A move shows an Undo toast, which stays longer (7s)
      const card = screen.getByRole('listitem', { name: /Audit website accessibility/i });
      fireEvent.click(within(card).getByRole('button', { name: /Move task/i }));
      fireEvent.click(within(card).getByRole('menuitem', { name: /Move.*to High Priority/i }));
      expect(getToast()).toHaveTextContent(/moved to High Priority/i);
      act(() => vi.advanceTimersByTime(5000));
      expect(getToast()).toBeInTheDocument();

      // Hovering pauses the countdown; leaving resumes it with the remaining time
      fireEvent.mouseEnter(getToast()!);
      act(() => vi.advanceTimersByTime(10000));
      expect(getToast()).toBeInTheDocument();
      fireEvent.mouseLeave(getToast()!);
      act(() => vi.advanceTimersByTime(1999));
      expect(getToast()).toBeInTheDocument();
      act(() => vi.advanceTimersByTime(1));
      expect(getToast()).not.toBeInTheDocument();

      // Undo is still reachable from a new action after an earlier manual dismiss
      const highCol = screen.getByRole('region', { name: /High Priority column/i });
      const moved = within(highCol).getByRole('listitem', { name: /Audit website accessibility/i });
      fireEvent.click(within(moved).getByRole('button', { name: /Move task/i }));
      fireEvent.click(within(moved).getByRole('menuitem', { name: /Move.*to Low Priority/i }));
      fireEvent.click(within(getToast()!).getByRole('button', { name: /Dismiss feedback/i }));
      expect(getToast()).not.toBeInTheDocument();

      const lowCol = screen.getByRole('region', { name: /Low Priority column/i });
      const inLow = within(lowCol).getByRole('listitem', { name: /Audit website accessibility/i });
      fireEvent.click(within(inLow).getByRole('button', { name: /Move task/i }));
      fireEvent.click(within(inLow).getByRole('menuitem', { name: /Move.*to Medium Priority/i }));
      expect(getToast()).toHaveTextContent(/moved to Medium Priority/i);
    } finally {
      vi.useRealTimers();
    }
  });
});
