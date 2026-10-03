import React, { useState } from 'react';
import { Priority } from '../types';
import PrioritySelect from './PrioritySelect';

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
      setError(result.error || 'Give your task a name first.');
      return;
    }

    setTitle('');
    setPriority('unassigned');
    setError(null);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} aria-label="Add a task">
      <div className="task-form-row">
        <div className="task-input-wrapper">
          <input
            id="task-title-input"
            type="text"
            className={`task-input ${error ? 'input-error' : ''}`}
            placeholder="What needs doing? (e.g. Audit checkout flow)"
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

        <PrioritySelect value={priority} onChange={setPriority} />

        <button
          type="submit"
          className="add-task-submit-btn"
          id="add-task-submit-btn"
          aria-label="Add Task to Board"
        >
          + Add a task
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
