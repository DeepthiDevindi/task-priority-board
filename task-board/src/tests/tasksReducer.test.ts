import { describe, it, expect } from 'vitest';
import { tasksReducer, TasksState } from '../reducer/tasksReducer';
import { Task } from '../types';
import { validateTaskTitle } from '../utils/validation';

describe('tasksReducer Unit Tests', () => {
  const initialTask: Task = {
    id: 'test-1',
    title: 'Initial Task',
    priority: 'unassigned',
  };

  const baseState: TasksState = {
    tasks: [initialTask],
    history: [],
    lastAnnouncement: '',
  };

  it('should add a new task to the top of the tasks list and record history', () => {
    const nextState = tasksReducer(baseState, {
      type: 'ADD_TASK',
      payload: { title: 'New Task 1', priority: 'high' },
    });

    expect(nextState.tasks).toHaveLength(2);
    expect(nextState.tasks[0].title).toBe('New Task 1');
    expect(nextState.tasks[0].priority).toBe('high');
    expect(nextState.history).toHaveLength(1);
    expect(nextState.history[0]).toEqual([initialTask]);
    expect(nextState.lastAnnouncement).toContain('added to High Priority');
  });

  it('should default priority to unassigned when none is provided in ADD_TASK', () => {
    const nextState = tasksReducer(baseState, {
      type: 'ADD_TASK',
      payload: { title: 'Unassigned Task' },
    });

    expect(nextState.tasks[0].priority).toBe('unassigned');
  });

  it('should immutably move a task to a new priority and record history', () => {
    const nextState = tasksReducer(baseState, {
      type: 'MOVE_TASK',
      payload: { id: 'test-1', priority: 'high' },
    });

    expect(nextState.tasks[0].priority).toBe('high');
    expect(nextState.tasks[0]).not.toBe(baseState.tasks[0]); // Immutable object reference
    expect(nextState.history).toHaveLength(1);
    expect(nextState.history[0][0].priority).toBe('unassigned');
    expect(nextState.lastAnnouncement).toContain('moved to High Priority');
  });

  it('should not update state or history if moving to the same priority', () => {
    const nextState = tasksReducer(baseState, {
      type: 'MOVE_TASK',
      payload: { id: 'test-1', priority: 'unassigned' },
    });

    expect(nextState).toBe(baseState);
    expect(nextState.history).toHaveLength(0);
  });

  it('should unassign a task by setting priority back to unassigned', () => {
    const highState: TasksState = {
      tasks: [{ id: 'test-1', title: 'High Task', priority: 'high' }],
      history: [],
      lastAnnouncement: '',
    };

    const nextState = tasksReducer(highState, {
      type: 'MOVE_TASK',
      payload: { id: 'test-1', priority: 'unassigned' },
    });

    expect(nextState.tasks[0].priority).toBe('unassigned');
    expect(nextState.lastAnnouncement).toContain('moved to Unassigned');
  });

  it('should edit a task title immutably and record history', () => {
    const nextState = tasksReducer(baseState, {
      type: 'EDIT_TASK',
      payload: { id: 'test-1', title: 'Updated Title' },
    });

    expect(nextState.tasks[0].title).toBe('Updated Title');
    expect(nextState.tasks[0]).not.toBe(baseState.tasks[0]);
    expect(nextState.history).toHaveLength(1);
    expect(nextState.lastAnnouncement).toBe('Task updated to "Updated Title".');
  });

  it('should delete a task by ID and record history', () => {
    const nextState = tasksReducer(baseState, {
      type: 'DELETE_TASK',
      payload: { id: 'test-1' },
    });

    expect(nextState.tasks).toHaveLength(0);
    expect(nextState.history).toHaveLength(1);
    expect(nextState.history[0]).toEqual([initialTask]);
    expect(nextState.lastAnnouncement).toContain('deleted');
  });

  it('should revert to previous state on UNDO', () => {
    // 1. Move task
    const stateAfterMove = tasksReducer(baseState, {
      type: 'MOVE_TASK',
      payload: { id: 'test-1', priority: 'medium' },
    });
    expect(stateAfterMove.tasks[0].priority).toBe('medium');
    expect(stateAfterMove.history).toHaveLength(1);

    // 2. Undo move
    const stateAfterUndo = tasksReducer(stateAfterMove, { type: 'UNDO' });
    expect(stateAfterUndo.tasks[0].priority).toBe('unassigned');
    expect(stateAfterUndo.history).toHaveLength(0);
    expect(stateAfterUndo.lastAnnouncement).toBe('Last action undone.');
  });

  it('should safely do nothing on UNDO when history is empty', () => {
    const nextState = tasksReducer(baseState, { type: 'UNDO' });
    expect(nextState).toBe(baseState);
  });

  it('should reset tasks to the provided seed array on RESET_TASKS', () => {
    const stateWithTasks: TasksState = {
      tasks: [
        { id: '1', title: 'Task 1', priority: 'high' },
        { id: '2', title: 'Task 2', priority: 'low' },
      ],
      history: [],
      lastAnnouncement: '',
    };

    const nextState = tasksReducer(stateWithTasks, {
      type: 'RESET_TASKS',
      payload: [initialTask],
    });

    expect(nextState.tasks).toEqual([initialTask]);
    expect(nextState.history).toHaveLength(1);
    expect(nextState.lastAnnouncement).toBe('Board reset to default tasks.');
  });
});

describe('validateTaskTitle Unit Tests', () => {
  const existingTasks: Task[] = [
    { id: '1', title: 'Existing Task One', priority: 'unassigned' },
    { id: '2', title: 'Refactor Code', priority: 'high' },
  ];

  it('should reject empty or whitespace-only titles', () => {
    expect(validateTaskTitle('', existingTasks).isValid).toBe(false);
    expect(validateTaskTitle('   ', existingTasks).isValid).toBe(false);
    expect(validateTaskTitle('   ', existingTasks).error).toBe('Task title is required.');
  });

  it('should reject duplicate titles (case-insensitive)', () => {
    const res1 = validateTaskTitle('existing task one', existingTasks);
    expect(res1.isValid).toBe(false);
    expect(res1.error).toBe('A task with this title already exists.');

    const res2 = validateTaskTitle('  REFACTOR CODE  ', existingTasks);
    expect(res2.isValid).toBe(false);
    expect(res2.error).toBe('A task with this title already exists.');
  });

  it('should allow identical title when editing the same task', () => {
    const res = validateTaskTitle('Existing Task One', existingTasks, '1');
    expect(res.isValid).toBe(true);
    expect(res.cleanTitle).toBe('Existing Task One');
  });

  it('should accept valid unique titles and trim whitespace', () => {
    const res = validateTaskTitle('   Brand New Feature   ', existingTasks);
    expect(res.isValid).toBe(true);
    expect(res.cleanTitle).toBe('Brand New Feature');
    expect(res.error).toBeUndefined();
  });
});
