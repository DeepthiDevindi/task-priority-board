import { Task } from '../types';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  cleanTitle: string;
}

/**
 * Validates a task title:
 * - Must not be empty or only whitespace
 * - Must not duplicate an existing task title (case-insensitive)
 * - Excludes the current task being edited if currentTaskId is provided
 */
export function validateTaskTitle(
  title: string,
  existingTasks: Task[],
  currentTaskId?: string
): ValidationResult {
  const cleanTitle = title.trim();

  if (!cleanTitle) {
    return {
      isValid: false,
      error: 'Task title is required.',
      cleanTitle: '',
    };
  }

  const isDuplicate = existingTasks.some((t) => {
    if (currentTaskId && t.id === currentTaskId) return false;
    return t.title.toLowerCase() === cleanTitle.toLowerCase();
  });

  if (isDuplicate) {
    return {
      isValid: false,
      error: 'A task with this title already exists.',
      cleanTitle,
    };
  }

  return {
    isValid: true,
    cleanTitle,
  };
}
