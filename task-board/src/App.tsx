import React, { useState, useMemo } from 'react';
import { useTasks } from './hooks/useTasks';
import { useTheme } from './hooks/useTheme';
import Board from './components/Board';
import TaskForm from './components/TaskForm';
import SearchBar from './components/SearchBar';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

/**
 * Task Priority Board Application
 *
 * Core Architectural Highlights:
 * 1. Single Source of Truth: All tasks reside in one central `tasks` array managed
 *    via `useReducer` inside the `useTasks` hook.
 * 2. Purely Derived Sections: Each Column dynamically filters the central tasks list.
 * 3. Immutable Updates: All transitions return fresh arrays/objects.
 * 4. Undo Support: Reducer history stack tracks previous states for reversible operations.
 * 5. Accessibility: Live region announces actions to assistive tech.
 */
export function App() {
  const {
    tasks,
    lastAnnouncement,
    canUndo,
    addTask,
    moveTask,
    editTask,
    deleteTask,
    undo,
    resetTasks,
  } = useTasks();

  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  // Derived filtered tasks across all columns
  const filteredTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter((t) => t.title.toLowerCase().includes(q));
  }, [tasks, searchQuery]);

  return (
    <div className="app-container">
      {/* Screen reader live announcer for state transitions */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        id="board-live-announcer"
      >
        {lastAnnouncement}
      </div>

      {/* Top Application Header */}
      <header className="app-header">
        <div className="brand">
          <div className="brand-badge" aria-hidden="true">
            ⚡
          </div>
          <div>
            <h1 className="app-title">Task Priority Board</h1>
            <p className="app-description">
              Single-source state architecture with derived columns &amp; HTML5 drag and drop
            </p>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="action-btn undo-btn"
            onClick={undo}
            disabled={!canUndo}
            title={canUndo ? 'Undo last action' : 'Nothing to undo'}
            aria-label="Undo last action"
          >
            ↩ Undo
          </button>

          <button
            type="button"
            className="action-btn secondary-btn"
            onClick={resetTasks}
            title="Reset to 8 default unassigned tasks"
            aria-label="Reset tasks to initial state"
          >
            ↻ Reset
          </button>

          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>

      {/* Task Creation & Search Filter Controls */}
      <section className="app-controls" aria-label="Task Management Controls">
        <TaskForm onAddTask={addTask} />

        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalTasks={tasks.length}
          filteredTasksCount={filteredTasks.length}
        />
      </section>

      {/* Live announcement feedback pill */}
      {lastAnnouncement && (
        <div className="announcement-pill" role="status" aria-hidden="true">
          <span className="pill-dot"></span>
          <span>{lastAnnouncement}</span>
        </div>
      )}

      {/* Kanban Board with 4 Derived Columns */}
      <Board
        tasks={filteredTasks}
        searchQuery={searchQuery}
        moveTask={moveTask}
        editTask={editTask}
        deleteTask={deleteTask}
      />
    </div>
  );
}

export default App;
