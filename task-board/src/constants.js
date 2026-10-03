/**
 * Priorities constants defining the 4 board sections.
 * Used by Board to map columns dynamically without hardcoding.
 */
export const PRIORITIES = [
  { key: 'unassigned', label: 'Unassigned' },
  { key: 'high', label: 'High Priority' },
  { key: 'medium', label: 'Medium Priority' },
  { key: 'low', label: 'Low Priority' }
];

/**
 * Initial sample seed: 8 tasks, all initially set to 'unassigned'.
 */
export const INITIAL_TASKS = [
  { id: 'task-1', title: 'Audit website accessibility & keyboard navigation', priority: 'unassigned' },
  { id: 'task-2', title: 'Implement rate limiting on authentication API endpoints', priority: 'unassigned' },
  { id: 'task-3', title: 'Refactor database queries to eliminate N+1 problem', priority: 'unassigned' },
  { id: 'task-4', title: 'Design onboarding flow for new customer signups', priority: 'unassigned' },
  { id: 'task-5', title: 'Set up automated end-to-end regression test suite', priority: 'unassigned' },
  { id: 'task-6', title: 'Optimize production bundle size and code splitting', priority: 'unassigned' },
  { id: 'task-7', title: 'Draft technical architecture RFC for microservices', priority: 'unassigned' },
  { id: 'task-8', title: 'Upgrade React and dependencies to latest stable release', priority: 'unassigned' }
];
