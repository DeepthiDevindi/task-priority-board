import React, { useState } from 'react';
import { Priority } from '../types';
import { PRIORITIES } from '../constants';

interface TaskFormProps {
  onAddTask: (title: string, priority?: Priority) => { success: boolean; error?: string };
}

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('unassigned');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = onAddTask(title, priority);
    if (!result.success) {
      setError(result.error || 'Failed to add task.');
      return;
    }

    setTitle('');
    setPriority('unassigned');
    setError(null);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} aria-label="Create a new task">
      <div className="task-form-row">
        <div className="input-group">
          <input
            id="task-title-input"
            type="text"
            className={`task-input ${error ? 'input-error' : ''}`}
            placeholder="What needs to be prioritized? (e.g. Audit API security headers)"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError(null);
            }}
            aria-label="New task title"
            aria-invalid={!!error}
            aria-describedby={error ? 'title-error-msg' : undefined}
          />
          {error && (
            <span id="title-error-msg" className="field-error-msg" role="alert">
              ⚠️ {error}
            </span>
          )}
        </div>

        <div className="select-group">
          <label htmlFor="task-priority-select" className="sr-only">
            Initial Priority
          </label>
          <select
            id="task-priority-select"
            className="priority-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            aria-label="Task initial priority"
          >
            {PRIORITIES.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="submit-btn"
          id="add-task-submit-btn"
          aria-label="Add Task to Board"
        >
          + Add Task
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
