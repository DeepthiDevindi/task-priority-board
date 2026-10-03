import React, { useState } from 'react';
import { PRIORITIES } from '../constants/priorities';

export function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('unassigned');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a task title.');
      return;
    }
    setError('');
    onAddTask(title.trim(), priority);
    setTitle('');
    setPriority('unassigned');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} aria-label="Add new task">
      <div className="task-form-inputs">
        <div className="input-field-wrap">
          <input
            id="task-title-input"
            type="text"
            className={`task-input ${error ? 'has-error' : ''}`}
            placeholder="What needs to be done? e.g., Write API integration tests..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            aria-label="New task title"
          />
          {error && <span className="input-error-msg">{error}</span>}
        </div>

        <div className="priority-select-wrap">
          <label htmlFor="task-priority-select" className="sr-only">
            Select Initial Priority
          </label>
          <select
            id="task-priority-select"
            className="priority-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            aria-label="Initial task priority"
          >
            {PRIORITIES.map((p) => (
              <option key={p.key} value={p.key}>
                {p.icon} {p.label}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" id="add-task-btn" className="submit-task-btn">
          <span>+ Add Task</span>
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
