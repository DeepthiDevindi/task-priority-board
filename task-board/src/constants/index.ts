import { PriorityConfig, Task } from '../types';

/**
 * Priority sections configuration for dynamic column rendering
 * with human-centered personality copy and gentle color tints.
 */
export const PRIORITIES: PriorityConfig[] = [
  {
    key: 'unassigned',
    label: 'Unassigned',
    color: 'var(--color-unassigned)',
    emptyMessage: 'Nothing waiting. Nice work!',
  },
  {
    key: 'high',
    label: 'High Priority',
    color: 'var(--color-high)',
    emptyMessage: 'No fires to put out right now.',
  },
  {
    key: 'medium',
    label: 'Medium Priority',
    color: 'var(--color-medium)',
    emptyMessage: 'Nothing here yet. Drag a task in.',
  },
  {
    key: 'low',
    label: 'Low Priority',
    color: 'var(--color-low)',
    emptyMessage: 'Easy does it. Nothing here yet.',
  },
];

/**
 * 8 Initial seed tasks (all seeded as 'unassigned')
 */
export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Audit website accessibility & keyboard navigation',
    priority: 'unassigned',
  },
  {
    id: 'task-2',
    title: 'Implement rate limiting on authentication API endpoints',
    priority: 'unassigned',
  },
  {
    id: 'task-3',
    title: 'Refactor database queries to eliminate N+1 problem',
    priority: 'unassigned',
  },
  {
    id: 'task-4',
    title: 'Design onboarding flow for new customer signups',
    priority: 'unassigned',
  },
  {
    id: 'task-5',
    title: 'Set up automated end-to-end regression test suite',
    priority: 'unassigned',
  },
  {
    id: 'task-6',
    title: 'Optimize production bundle size and code splitting',
    priority: 'unassigned',
  },
  {
    id: 'task-7',
    title: 'Draft technical architecture RFC for microservices',
    priority: 'unassigned',
  },
  {
    id: 'task-8',
    title: 'Upgrade React and dependencies to latest stable release',
    priority: 'unassigned',
  },
];

export const STORAGE_KEY = 'task_priority_board_tasks_v2';
export const THEME_STORAGE_KEY = 'task_priority_board_theme';
