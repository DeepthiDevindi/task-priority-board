import React from 'react';
import { PRIORITIES } from '../constants';
import Column from './Column';

/**
 * Board Component
 * Maps over PRIORITIES to render a Column for each section dynamically.
 * Receives tasks and moveTask via props.
 */
export function Board({ tasks, moveTask }) {
  return (
    <main className="board-container" id="board-main">
      <div className="board-grid">
        {PRIORITIES.map((priority) => (
          <Column
            key={priority.key}
            priority={priority}
            tasks={tasks}
            moveTask={moveTask}
          />
        ))}
      </div>
    </main>
  );
}

export default Board;
