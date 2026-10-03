import React, { useState } from 'react';
import TaskCard from './TaskCard';

/**
 * Column Component
 * Represents one of the 4 priority sections.
 * Filters the single tasks array by priority.key and renders header, count,
 * cards or an empty-state message.
 */
export function Column({ priority, tasks, moveTask }) {
  const [isDragOver, setIsDragOver] = useState(false);

  // Derived list: filters the single source of truth tasks array
  const columnTasks = tasks.filter((t) => t.priority === priority.key);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      moveTask(taskId, priority.key);
    }
  };

  return (
    <section
      className={`column column-${priority.key} ${isDragOver ? 'is-drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-label={`${priority.label} column with ${columnTasks.length} tasks`}
    >
      <header className="column-header">
        <h2 className="column-title">{priority.label}</h2>
        <span
          className="column-count"
          aria-label={`${columnTasks.length} tasks in ${priority.label}`}
        >
          {columnTasks.length}
        </span>
      </header>

      <div className="column-content">
        {columnTasks.length === 0 ? (
          <div className="empty-state" role="status">
            <p className="empty-state-text">No tasks in {priority.label}</p>
            <span className="empty-state-subtext">Move tasks here to prioritize</span>
          </div>
        ) : (
          <div className="task-list">
            {columnTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                moveTask={moveTask}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Column;
