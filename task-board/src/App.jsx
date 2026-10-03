import React, { useState } from 'react';
import { INITIAL_TASKS } from './constants';
import Board from './components/Board';
import './App.css';

/**
 * Task Priority Board Application
 * 
 * Design Principles:
 * 1. Single Source of Truth: All tasks live in a single `tasks` array in App state.
 * 2. Derived Columns: Priority sections are computed on the fly by filtering the central array.
 * 3. Immutable Updates: `moveTask` produces a new array copy via `Array.prototype.map`.
 */
export function App() {
  // Single source of truth: 8 initial tasks, all unassigned
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  /**
   * Immutably moves a task to a new priority ('unassigned' | 'high' | 'medium' | 'low')
   * Uses setTasks(prev => prev.map(...))
   */
  const moveTask = (id, newPriority) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, priority: newPriority } : t))
    );
  };

  /**
   * Optional helper to add custom tasks for testing
   */
  const handleAddTask = (e) => {
    e.preventDefault();
    const trimmed = newTaskTitle.trim();
    if (!trimmed) return;

    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: trimmed,
      priority: 'unassigned'
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle('');
  };

  /**
   * Reset all tasks back to the initial 8 unassigned tasks
   */
  const handleReset = () => {
    setTasks(INITIAL_TASKS);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand">
          <h1 className="app-title">Task Priority Board</h1>
          <p className="app-description">
            Single-source React state architecture with derived priority sections
          </p>
        </div>

        <button
          type="button"
          className="reset-btn"
          onClick={handleReset}
          aria-label="Reset tasks to initial unassigned state"
        >
          ↻ Reset Initial Tasks
        </button>
      </header>

      {/* Quick Task Creation & Instructions Bar */}
      <section className="app-toolbar" aria-label="Task controls and quick creation">
        <form className="add-task-form" onSubmit={handleAddTask}>
          <input
            id="new-task-input"
            type="text"
            className="add-task-input"
            placeholder="Add a new task (defaults to Unassigned)..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            aria-label="New task title"
          />
          <button type="submit" className="add-task-btn" aria-label="Add task to board">
            + Add Task
          </button>
        </form>

        <p className="toolbar-hint">
          💡 Click move buttons to shift tasks between columns or click <strong>↩ Unassign</strong> to revert. Drag &amp; drop is also supported!
        </p>
      </section>

      {/* Kanban Board rendering the 4 sections */}
      <Board tasks={tasks} moveTask={moveTask} />
    </div>
  );
}

export default App;
