import { useReducer, useEffect, useCallback } from 'react';
import { Priority } from '../types';
import { tasksReducer, TasksState } from '../reducer/tasksReducer';
import { INITIAL_TASKS, STORAGE_KEY } from '../constants';
import { validateTaskTitle } from '../utils/validation';

function getInitialState(): TasksState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return {
          tasks: parsed,
          history: [],
          lastAnnouncement: 'Loaded tasks from local storage.',
        };
      }
    }
  } catch (err) {
    console.warn('Failed to load tasks from localStorage, falling back to seed tasks:', err);
  }

  return {
    tasks: INITIAL_TASKS,
    history: [],
    lastAnnouncement: 'Welcome to Task Priority Board.',
  };
}

export function useTasks() {
  const [state, dispatch] = useReducer(tasksReducer, null, getInitialState);

  // Sync tasks to localStorage whenever state.tasks updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
    } catch (err) {
      console.warn('Failed to save tasks to localStorage:', err);
    }
  }, [state.tasks]);

  const addTask = useCallback(
    (title: string, priority: Priority = 'unassigned') => {
      const validation = validateTaskTitle(title, state.tasks);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      dispatch({
        type: 'ADD_TASK',
        payload: { title: validation.cleanTitle, priority },
      });
      return { success: true };
    },
    [state.tasks]
  );

  const moveTask = useCallback((id: string, priority: Priority) => {
    dispatch({
      type: 'MOVE_TASK',
      payload: { id, priority },
    });
  }, []);

  const editTask = useCallback(
    (id: string, newTitle: string) => {
      const validation = validateTaskTitle(newTitle, state.tasks, id);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      dispatch({
        type: 'EDIT_TASK',
        payload: { id, title: validation.cleanTitle },
      });
      return { success: true };
    },
    [state.tasks]
  );

  const deleteTask = useCallback((id: string) => {
    dispatch({
      type: 'DELETE_TASK',
      payload: { id },
    });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const resetTasks = useCallback(() => {
    dispatch({ type: 'RESET_TASKS', payload: INITIAL_TASKS });
  }, []);

  return {
    tasks: state.tasks,
    lastAnnouncement: state.lastAnnouncement,
    canUndo: state.history.length > 0,
    addTask,
    moveTask,
    editTask,
    deleteTask,
    undo,
    resetTasks,
  };
}
