import { PriorityConfig, Task } from '../types';

/**
 * Priority sections configuration for dynamic column rendering
 */
export const PRIORITIES: PriorityConfig[] = [
  {
    key: 'unassigned',
    label: 'Unassigned',
    color: 'var(--color-unassigned)',
    emptyMessage: 'No unassigned tasks remaining. All items are prioritized!',
  },
  {
    key: 'high',
    label: 'High Priority',
    color: 'var(--color-high)',
    emptyMessage: 'No high-priority tasks. Critical items are clear!',
  },
  {
    key: 'medium',
    label: 'Medium Priority',
    color: 'var(--color-medium)',
    emptyMessage: 'No medium-priority tasks in progress.',
  },
  {
    key: 'low',
    label: 'Low Priority',
    color: 'var(--color-low)',
    emptyMessage: 'No low-priority backlog items.',
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
