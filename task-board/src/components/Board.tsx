import React, { useEffect, useRef, useState } from 'react';
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
 * On narrow screens the columns become a horizontal swipe row, and a sticky
 * column navigator (visible only there) jumps to any column and tracks the one in view.
 */
export function Board({ tasks, searchQuery, moveTask, editTask, deleteTask }: BoardProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeKey, setActiveKey] = useState<Priority>(PRIORITIES[0].key);

  // While a chip-triggered smooth scroll runs, keep that chip active instead of tracking scroll
  const lockedKeyRef = useRef<Priority | null>(null);
  const unlockTimerRef = useRef<number | undefined>(undefined);

  // Active column = the one whose left edge is closest to the swipe row's left edge.
  // At the very end of the row, the last column wins (it can never reach the left edge).
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let frame = 0;
    const updateActive = () => {
      frame = 0;
      if (lockedKeyRef.current) return;
      const columns = Array.from(scroller.querySelectorAll<HTMLElement>('[data-priority]'));
      if (columns.length === 0) return;

      const atEnd = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 2;
      const scrollerLeft = scroller.getBoundingClientRect().left;
      const closest = atEnd
        ? columns[columns.length - 1]
        : columns.reduce((best, col) =>
            Math.abs(col.getBoundingClientRect().left - scrollerLeft) <
            Math.abs(best.getBoundingClientRect().left - scrollerLeft)
              ? col
              : best
          );
      setActiveKey(closest.dataset.priority as Priority);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateActive);
    };

    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      scroller.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
      window.clearTimeout(unlockTimerRef.current);
    };
  }, []);

  const scrollToColumn = (key: Priority) => {
    const scroller = scrollerRef.current;
    const column = scroller?.querySelector<HTMLElement>(`[data-priority="${key}"]`);
    if (!scroller || !column) return;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    setActiveKey(key);
    lockedKeyRef.current = key;
    window.clearTimeout(unlockTimerRef.current);
    unlockTimerRef.current = window.setTimeout(() => {
      lockedKeyRef.current = null;
    }, 700);

    // Scroll only the swipe row horizontally. scrollIntoView would also scroll the
    // page vertically (jumping to the column's top when the user is scrolled down).
    scroller.scrollTo({
      left:
        scroller.scrollLeft +
        column.getBoundingClientRect().left -
        scroller.getBoundingClientRect().left,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <main className="board-container" id="board-main" aria-label="Task Priority Columns">
      {/* Column Navigator (narrow screens only) */}
      <nav className="column-nav" aria-label="Jump to column">
        {PRIORITIES.map((priority) => {
          const count = tasks.filter((t) => t.priority === priority.key).length;
          const isActive = activeKey === priority.key;
          return (
            <button
              key={priority.key}
              type="button"
              className={`column-nav-chip ${isActive ? 'is-active' : ''}`}
              onClick={() => scrollToColumn(priority.key)}
              aria-current={isActive ? 'true' : undefined}
              aria-label={`Show ${priority.label} column, ${count} tasks`}
            >
              <span className={`column-status-dot dot-${priority.key}`} aria-hidden="true"></span>
              <span className="column-nav-label">{priority.label.replace(' Priority', '')}</span>
              <span className="column-nav-count" aria-hidden="true">
                {count}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="board-grid" ref={scrollerRef}>
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
