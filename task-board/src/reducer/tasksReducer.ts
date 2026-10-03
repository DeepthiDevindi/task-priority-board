import { Task, Priority } from '../types';
import { PRIORITIES } from '../constants';

export interface TasksState {
  tasks: Task[];
  history: Task[][];
  lastAnnouncement: string;
}

export type TasksAction =
  | { type: 'ADD_TASK'; payload: { title: string; priority?: Priority } }
  | { type: 'MOVE_TASK'; payload: { id: string; priority: Priority } }
  | { type: 'EDIT_TASK'; payload: { id: string; title: string } }
  | { type: 'DELETE_TASK'; payload: { id: string } }
  | { type: 'UNDO' }
  | { type: 'RESET_TASKS'; payload?: Task[] }
  | { type: 'LOAD_TASKS'; payload: Task[] };

const MAX_HISTORY_LENGTH = 30;

function getPriorityLabel(priority: Priority): string {
  const found = PRIORITIES.find((p) => p.key === priority);
  return found ? found.label : priority;
}

export function tasksReducer(state: TasksState, action: TasksAction): TasksState {
  switch (action.type) {
    case 'ADD_TASK': {
      const priority = action.payload.priority || 'unassigned';
      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: action.payload.title,
        priority,
      };

      const newHistory = [state.tasks, ...state.history].slice(0, MAX_HISTORY_LENGTH);
      const priorityLabel = getPriorityLabel(priority);

      return {
        tasks: [newTask, ...state.tasks],
        history: newHistory,
        lastAnnouncement: `Task "${newTask.title}" added to ${priorityLabel}.`,
      };
    }

    case 'MOVE_TASK': {
      const targetTask = state.tasks.find((t) => t.id === action.payload.id);
      if (!targetTask || targetTask.priority === action.payload.priority) {
        return state;
      }

      const newHistory = [state.tasks, ...state.history].slice(0, MAX_HISTORY_LENGTH);
      const priorityLabel = getPriorityLabel(action.payload.priority);

      const nextTasks = state.tasks.map((t) =>
        t.id === action.payload.id ? { ...t, priority: action.payload.priority } : t
      );

      return {
        tasks: nextTasks,
        history: newHistory,
        lastAnnouncement: `Task "${targetTask.title}" moved to ${priorityLabel}.`,
      };
    }

    case 'EDIT_TASK': {
      const targetTask = state.tasks.find((t) => t.id === action.payload.id);
      if (!targetTask || targetTask.title === action.payload.title) {
        return state;
      }

      const newHistory = [state.tasks, ...state.history].slice(0, MAX_HISTORY_LENGTH);

      const nextTasks = state.tasks.map((t) =>
        t.id === action.payload.id ? { ...t, title: action.payload.title } : t
      );

      return {
        tasks: nextTasks,
        history: newHistory,
        lastAnnouncement: `Task updated to "${action.payload.title}".`,
      };
    }

    case 'DELETE_TASK': {
      const targetTask = state.tasks.find((t) => t.id === action.payload.id);
      if (!targetTask) {
        return state;
      }

      const newHistory = [state.tasks, ...state.history].slice(0, MAX_HISTORY_LENGTH);

      return {
        tasks: state.tasks.filter((t) => t.id !== action.payload.id),
        history: newHistory,
        lastAnnouncement: `Task "${targetTask.title}" deleted.`,
      };
    }

    case 'UNDO': {
      if (state.history.length === 0) {
        return state;
      }

      const [previousTasks, ...remainingHistory] = state.history;

      return {
        tasks: previousTasks,
        history: remainingHistory,
        lastAnnouncement: 'Last action undone.',
      };
    }

    case 'RESET_TASKS': {
      const initial = action.payload || [];
      const newHistory = [state.tasks, ...state.history].slice(0, MAX_HISTORY_LENGTH);

      return {
        tasks: initial,
        history: newHistory,
        lastAnnouncement: 'Board reset to default tasks.',
      };
    }

    case 'LOAD_TASKS': {
      return {
        ...state,
        tasks: action.payload,
      };
    }

    default:
      return state;
  }
}
