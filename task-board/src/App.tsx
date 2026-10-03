import React, { useState, useMemo } from 'react';
import { useTasks } from './hooks/useTasks';
import { useTheme } from './hooks/useTheme';
import Board from './components/Board';
import TaskForm from './components/TaskForm';
import SearchBar from './components/SearchBar';
import ThemeToggle from './components/ThemeToggle';
import Toast from './components/Toast';
import './App.css';
import LogoMark from './components/LogoMark';

/**
 * Task Priority Board Application
 *
 * Calm, human-centered UI redesign inspired by Linear, Notion, and Trello.
 * Built around:
 * 1. Single Source of Truth (`tasks` array in useTasks hook)
 * 2. Derived columns (computed on the fly)
 * 3. Immutable state updates via useReducer
 * 4. Micro-interactions with toast feedback and bottom Undo
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
  const [toastDismissed, setToastDismissed] = useState(false);
  const [toastId, setToastId] = useState(0);

  // Every board action (new announcement or new tasks state) shows a fresh toast.
  // Keying the Toast by toastId restarts its auto-dismiss timer, and clears an earlier dismissal.
  // Adjusted during render (not in an effect) to avoid an extra cascading render.
  const [toastSource, setToastSource] = useState({ lastAnnouncement, tasks });
  if (toastSource.lastAnnouncement !== lastAnnouncement || toastSource.tasks !== tasks) {
    setToastSource({ lastAnnouncement, tasks });
    setToastDismissed(false);
    setToastId((id) => id + 1);
  }

  // Derived filtered tasks across all columns
  const filteredTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter((t) => t.title.toLowerCase().includes(q));
  }, [tasks, searchQuery]);

  // Progress summary: tasks with an assigned priority (not 'unassigned')
  const totalCount = tasks.length;
  const prioritizedCount = useMemo(() => {
    return tasks.filter((t) => t.priority !== 'unassigned').length;
  }, [tasks]);

  const progressPercent = totalCount > 0 ? Math.round((prioritizedCount / totalCount) * 100) : 0;

  return (
    <div className="app-shell">
      {/* Screen reader live announcements */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        id="board-live-announcer"
      >
        {lastAnnouncement}
      </div>

      {/* Main Container */}
      <div className="app-container">
        {/* Page Header */}
        <header className="page-header">
          <div className="header-left">
            <LogoMark />
            <div className="header-text-block">
              <h1 className="app-title">Task Priority Board</h1>
              <p className="app-subtitle">
                Organize what matters today with clear, calm priorities.
              </p>
            </div>
          </div>

          <div className="header-right">
            {/* Progress Summary: X of Y tasks prioritized */}
            <div
              className="progress-summary-badge"
              title={`${progressPercent}% of tasks have been assigned a priority`}
              aria-label={`Progress: ${prioritizedCount} of ${totalCount} tasks prioritized`}
            >
              <div className="progress-info">
                <span className="progress-label">
                  <strong>
                    {prioritizedCount} of {totalCount}
                  </strong>{' '}
                  tasks prioritized
                </span>
                <span className="progress-percent">{progressPercent}%</span>
              </div>
              <div className="progress-track" aria-hidden="true">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>

            <div className="header-button-group">
              <button
                type="button"
                className="header-action-button reset-button"
                onClick={resetTasks}
                title="Reset to initial 8 unassigned tasks"
                aria-label="Reset tasks to initial state"
              >
                ↻ Reset
              </button>

              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>
          </div>
        </header>

        {/* Toolbar: Task Creation Form & Search Filter */}
        <section className="dashboard-toolbar" aria-label="Task management tools">
          <TaskForm onAddTask={addTask} />

          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalTasks={totalCount}
            filteredTasksCount={filteredTasks.length}
          />
        </section>

        {/* Kanban Board with 4 Responsive Columns */}
        <Board
          tasks={filteredTasks}
          searchQuery={searchQuery}
          moveTask={moveTask}
          editTask={editTask}
          deleteTask={deleteTask}
        />
      </div>

      {/* Bottom Toast Feedback with Undo button */}
      {!toastDismissed && lastAnnouncement && (
        <Toast
          key={toastId}
          message={lastAnnouncement}
          canUndo={canUndo}
          onUndo={undo}
          onDismiss={() => setToastDismissed(true)}
        />
      )}
    </div>
  );
}

export default App;
