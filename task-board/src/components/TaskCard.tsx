import React, { useState, useRef, useEffect } from 'react';
import { Task, Priority } from '../types';

interface TaskCardProps {
  task: Task;
  moveTask: (id: string, newPriority: Priority) => void;
  editTask: (id: string, newTitle: string) => { success: boolean; error?: string };
  deleteTask: (id: string) => void;
}

/**
 * TaskCard Component
 * Memoized with React.memo to prevent unnecessary re-renders.
 * Supports:
 * - Native HTML5 drag initiation
 * - Inline title editing (double-click or edit icon) with validation
 * - Delete with user confirmation
 * - Keyboard-accessible move buttons and unassign control
 */
export const TaskCard = React.memo(function TaskCard({
  task,
  moveTask,
  editTask,
  deleteTask,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editError, setEditError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEditing = () => {
    setEditedTitle(task.title);
    setEditError(null);
    setIsEditing(true);
  };

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleSaveEdit = () => {
    const result = editTask(task.id, editedTitle);
    if (!result.success) {
      setEditError(result.error || 'Invalid task title');
      return;
    }
    setIsEditing(false);
    setEditError(null);
  };

  const handleCancelEdit = () => {
    setEditedTitle(task.title);
    setIsEditing(false);
    setEditError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  const handleDelete = () => {
    const confirmed = window.confirm(`Are you sure you want to delete "${task.title}"?`);
    if (confirmed) {
      deleteTask(task.id);
    }
  };

  return (
    <article
      className={`task-card task-card-${task.priority}`}
      draggable={!isEditing}
      onDragStart={handleDragStart}
      aria-label={`Task: ${task.title}`}
    >
      <div className="task-card-header">
        <span className="task-badge task-badge-${task.priority}">
          {task.priority === 'unassigned' ? 'Unassigned' : `${task.priority.toUpperCase()}`}
        </span>

        <div className="task-header-actions">
          {!isEditing && (
            <button
              type="button"
              className="icon-action-btn edit-icon-btn"
              onClick={startEditing}
              title="Edit title (or double-click title)"
              aria-label={`Edit title for "${task.title}"`}
            >
              ✎
            </button>
          )}

          <button
            type="button"
            className="icon-action-btn delete-icon-btn"
            onClick={handleDelete}
            title="Delete task"
            aria-label={`Delete task "${task.title}"`}
          >
            🗑
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="task-edit-box">
          <input
            ref={inputRef}
            type="text"
            className={`task-edit-input ${editError ? 'input-error' : ''}`}
            value={editedTitle}
            onChange={(e) => {
              setEditedTitle(e.target.value);
              if (editError) setEditError(null);
            }}
            onKeyDown={handleKeyDown}
            aria-label="Edit task title"
          />
          {editError && <span className="inline-error-msg">{editError}</span>}
          <div className="task-edit-controls">
            <button
              type="button"
              className="edit-save-btn"
              onClick={handleSaveEdit}
              aria-label="Save title"
            >
              Save
            </button>
            <button
              type="button"
              className="edit-cancel-btn"
              onClick={handleCancelEdit}
              aria-label="Cancel editing"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <h3 className="task-title" onDoubleClick={startEditing} title="Double-click to edit title">
          {task.title}
        </h3>
      )}

      {/* Move Buttons - Hidden for current priority */}
      <div className="task-actions" aria-label="Move task between priority columns">
        <span className="task-actions-label">Move to:</span>
        <div className="task-buttons-group">
          {task.priority !== 'high' && (
            <button
              type="button"
              className="move-btn move-btn-high"
              onClick={() => moveTask(task.id, 'high')}
              aria-label={`Move "${task.title}" to High Priority`}
            >
              High
            </button>
          )}

          {task.priority !== 'medium' && (
            <button
              type="button"
              className="move-btn move-btn-medium"
              onClick={() => moveTask(task.id, 'medium')}
              aria-label={`Move "${task.title}" to Medium Priority`}
            >
              Medium
            </button>
          )}

          {task.priority !== 'low' && (
            <button
              type="button"
              className="move-btn move-btn-low"
              onClick={() => moveTask(task.id, 'low')}
              aria-label={`Move "${task.title}" to Low Priority`}
            >
              Low
            </button>
          )}

          {task.priority !== 'unassigned' && (
            <button
              type="button"
              className="move-btn move-btn-unassign"
              onClick={() => moveTask(task.id, 'unassigned')}
              aria-label={`Unassign "${task.title}"`}
            >
              ↩ Unassign
            </button>
          )}
        </div>
      </div>
    </article>
  );
});

export default TaskCard;
