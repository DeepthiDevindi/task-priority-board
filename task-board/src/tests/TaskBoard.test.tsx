import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../App';

describe('Task Priority Board Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders the board with 4 priority columns and header counts', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /Task Priority Board/i })).toBeInTheDocument();

    // 4 Columns
    expect(screen.getByRole('region', { name: /Unassigned column/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /High Priority column/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /Medium Priority column/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /Low Priority column/i })).toBeInTheDocument();

    // Initially 8 unassigned tasks
    const unassignedCol = screen.getByRole('region', { name: /Unassigned column/i });
    expect(within(unassignedCol).getByText('8')).toBeInTheDocument();

    // High, Medium, Low are initially empty
    const highCol = screen.getByRole('region', { name: /High Priority column/i });
    expect(within(highCol).getByText('0')).toBeInTheDocument();
    expect(within(highCol).getByText(/No high-priority tasks/i)).toBeInTheDocument();
  });

  it('allows adding a new task to Unassigned and rejects empty or duplicate titles', () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/What needs to be prioritized\?/i);
    const submitBtn = screen.getByRole('button', { name: /Add Task to Board/i });

    // 1. Try empty submission
    fireEvent.click(submitBtn);
    expect(screen.getByRole('alert')).toHaveTextContent(/Task title is required/i);

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

  it('moves an unassigned task to High, Medium, Low, and unassigns it', () => {
    render(<App />);

    const taskTitle = 'Audit website accessibility & keyboard navigation';
    const card = screen.getByLabelText(`Task: ${taskTitle}`);

    // In Unassigned: High, Medium, Low are present. Unassign is NOT present.
    expect(
      within(card).getByRole('button', { name: /Move.*to High Priority/i })
    ).toBeInTheDocument();
    expect(
      within(card).getByRole('button', { name: /Move.*to Medium Priority/i })
    ).toBeInTheDocument();
    expect(
      within(card).getByRole('button', { name: /Move.*to Low Priority/i })
    ).toBeInTheDocument();
    expect(within(card).queryByRole('button', { name: /Unassign/i })).not.toBeInTheDocument();

    // 1. Move to High Priority
    fireEvent.click(within(card).getByRole('button', { name: /Move.*to High Priority/i }));

    const highCol = screen.getByRole('region', { name: /High Priority column/i });
    expect(within(highCol).getByText(taskTitle)).toBeInTheDocument();
    expect(within(highCol).getByText('1')).toBeInTheDocument();

    // In High: High button is hidden, Unassign button is visible
    const movedCardInHigh = screen.getByLabelText(`Task: ${taskTitle}`);
    expect(
      within(movedCardInHigh).queryByRole('button', { name: /Move.*to High Priority/i })
    ).not.toBeInTheDocument();
    expect(
      within(movedCardInHigh).getByRole('button', { name: /Move.*to Medium Priority/i })
    ).toBeInTheDocument();
    expect(
      within(movedCardInHigh).getByRole('button', { name: /Move.*to Low Priority/i })
    ).toBeInTheDocument();
    expect(within(movedCardInHigh).getByRole('button', { name: /Unassign/i })).toBeInTheDocument();

    // 2. Move to Medium Priority
    fireEvent.click(
      within(movedCardInHigh).getByRole('button', { name: /Move.*to Medium Priority/i })
    );
    const medCol = screen.getByRole('region', { name: /Medium Priority column/i });
    expect(within(medCol).getByText(taskTitle)).toBeInTheDocument();
    expect(within(medCol).getByText('1')).toBeInTheDocument();
    expect(within(highCol).getByText('0')).toBeInTheDocument();

    // 3. Move to Low Priority
    const movedCardInMed = screen.getByLabelText(`Task: ${taskTitle}`);
    fireEvent.click(within(movedCardInMed).getByRole('button', { name: /Move.*to Low Priority/i }));
    const lowCol = screen.getByRole('region', { name: /Low Priority column/i });
    expect(within(lowCol).getByText(taskTitle)).toBeInTheDocument();
    expect(within(lowCol).getByText('1')).toBeInTheDocument();

    // 4. Click Unassign -> Moves back to Unassigned
    const movedCardInLow = screen.getByLabelText(`Task: ${taskTitle}`);
    fireEvent.click(within(movedCardInLow).getByRole('button', { name: /Unassign/i }));

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

  it('supports undo for state changes', () => {
    render(<App />);

    const undoBtn = screen.getByRole('button', { name: /Undo last action/i });
    expect(undoBtn).toBeDisabled();

    // Move task
    const card = screen.getByLabelText('Task: Audit website accessibility & keyboard navigation');
    fireEvent.click(within(card).getByRole('button', { name: /Move.*to High Priority/i }));

    // Undo is now enabled
    expect(undoBtn).not.toBeDisabled();

    // Click Undo
    fireEvent.click(undoBtn);

    // Verify task is back in Unassigned
    const highCol = screen.getByRole('region', { name: /High Priority column/i });
    expect(within(highCol).getByText('0')).toBeInTheDocument();
    expect(undoBtn).toBeDisabled();
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
});
