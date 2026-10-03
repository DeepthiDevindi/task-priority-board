import React from 'react';
import { Task, Priority } from '../types';
import { PRIORITIES } from '../constants';
import Column from './Column';

interface BoardProps {
  tasks: Task[];
  searchQuery: string;
  moveTask: (id: string, newPriority: Priority) => void;
  editTask: (id: string, newTitle: string) => { success: boolean; error?: string };
  deleteTask: (id: string) => void;
}

/**
 * Board Component
 * Dynamically iterates over PRIORITIES constant to render the 4 sections.
 * Props only, purely derived presentation layer.
 */
export function Board({ tasks, searchQuery, moveTask, editTask, deleteTask }: BoardProps) {
  return (
    <main className="board-container" id="board-main" aria-label="Task Priority Columns">
      <div className="board-grid">
        {PRIORITIES.map((priority) => (
          <Column
            key={priority.key}
            priority={priority}
            tasks={tasks}
            searchQuery={searchQuery}
            moveTask={moveTask}
            editTask={editTask}
            deleteTask={deleteTask}
          />
        ))}
      </div>
    </main>
  );
}

export default Board;
