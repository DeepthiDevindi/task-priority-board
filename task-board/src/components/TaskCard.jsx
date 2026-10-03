import React from 'react';

/**
 * TaskCard Component
 * Displays task title and action buttons to move or unassign the task.
 * 
 * Rules:
 * - Shows High, Medium, Low buttons (hides button for task's current priority).
 * - Shows "Unassign" button only when task is in High, Medium, or Low.
 * - Fully accessible with descriptive aria-labels.
 * - HTML5 drag-and-drop enabled.
 */
export function TaskCard({ task, moveTask }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <article
      className={`task-card task-card-${task.priority}`}
      draggable
      onDragStart={handleDragStart}
      aria-label={`Task: ${task.title}`}
    >
      <h3 className="task-title">{task.title}</h3>

      <div className="task-actions" aria-label="Move task">
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
}

export default TaskCard;
