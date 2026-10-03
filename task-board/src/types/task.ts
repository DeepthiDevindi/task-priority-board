/**
 * Priority Union Type
 */
export type Priority = 'unassigned' | 'high' | 'medium' | 'low';

/**
 * Task Data Model
 * Single data source shape: { id, title, priority }
 */
export interface Task {
  id: string;
  title: string;
  priority: Priority;
}

/**
 * Priority Configuration Metadata
 */
export interface PriorityConfig {
  key: Priority;
  label: string;
  color?: string;
  emptyMessage?: string;
}
