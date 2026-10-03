import React, { useState } from 'react';
import { Task, Priority, PriorityConfig } from '../types';
import TaskCard from './TaskCard';

interface ColumnProps {
  priority: PriorityConfig;
  tasks: Task[];
  searchQuery: string;
  moveTask: (id: string, newPriority: Priority) => void;
  editTask: (id: string, newTitle: string) => { success: boolean; error?: string };
  deleteTask: (id: string) => void;
}

export function Column({
  priority,
  tasks,
  searchQuery,
  moveTask,
  editTask,
  deleteTask,
}: ColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  // Derived tasks filtered from the single tasks array
  const columnTasks = tasks.filter((t) => t.priority === priority.key);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
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
            <p className="empty-state-text">
              {searchQuery
                ? `No tasks matching "${searchQuery}"`
                : priority.emptyMessage || `No tasks in ${priority.label}`}
            </p>
            <span className="empty-state-subtext">
              {searchQuery ? 'Try another search term' : 'Drag items or use move buttons'}
            </span>
          </div>
        ) : (
          <div className="task-list">
            {columnTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                moveTask={moveTask}
                editTask={editTask}
                deleteTask={deleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Column;
