/**
 * Priority definitions used throughout the board.
 * Each priority object defines a unique 'key' and a human-readable 'label',
 * plus aesthetic visual tokens.
 */
export const PRIORITIES = [
  {
    key: 'unassigned',
    label: 'Unassigned',
    badgeText: 'Backlog',
    icon: '📋',
    color: '#94a3b8',
    bgLight: 'rgba(148, 163, 184, 0.12)',
    borderColor: 'rgba(148, 163, 184, 0.25)',
    glowColor: 'rgba(148, 163, 184, 0.2)',
    emptyMessage: 'No unassigned tasks remaining. All items have been prioritized!'
  },
  {
    key: 'high',
    label: 'High',
    badgeText: 'Critical',
    icon: '🔥',
    color: '#f43f5e',
    bgLight: 'rgba(244, 63, 94, 0.12)',
    borderColor: 'rgba(244, 63, 94, 0.3)',
    glowColor: 'rgba(244, 63, 94, 0.25)',
    emptyMessage: 'No high-priority tasks. Urgent items are fully handled!'
  },
  {
    key: 'medium',
    label: 'Medium',
    badgeText: 'Standard',
    icon: '⚡',
    color: '#f59e0b',
    bgLight: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    emptyMessage: 'No medium-priority tasks in progress.'
  },
  {
    key: 'low',
    label: 'Low',
    badgeText: 'Minor',
    icon: '🌱',
    color: '#10b981',
    bgLight: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    emptyMessage: 'No low-priority backlog tasks at the moment.'
  }
];

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Implement OAuth 2.0 PKCE authentication flow',
    priority: 'high'
  },
  {
    id: 'task-2',
    title: 'Resolve memory leak in real-time notification socket listener',
    priority: 'high'
  },
  {
    id: 'task-3',
    title: 'Design responsive dark-mode color tokens & CSS variables',
    priority: 'medium'
  },
  {
    id: 'task-4',
    title: 'Add multi-column sorting and filtering to data table',
    priority: 'medium'
  },
  {
    id: 'task-5',
    title: 'Update project deployment documentation in README',
    priority: 'low'
  },
  {
    id: 'task-6',
    title: 'Audit third-party npm dependencies for bundle optimization',
    priority: 'low'
  },
  {
    id: 'task-7',
    title: 'Explore Web Workers for background client-side calculations',
    priority: 'unassigned'
  },
  {
    id: 'task-8',
    title: 'Draft release changelog for upcoming quarterly showcase',
    priority: 'unassigned'
  }
];
