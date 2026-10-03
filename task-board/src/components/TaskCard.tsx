import React, { useState, useRef, useEffect } from 'react';
import { Task, Priority } from '../types';

interface TaskCardProps {
  task: Task;
  moveTask: (id: string, newPriority: Priority) => void;
  editTask: (id: string, newTitle: string) => { success: boolean; error?: string };
  deleteTask: (id: string) => void;
}

const PRIORITY_LABELS: Record<Priority, string> = {
  unassigned: 'Unassigned',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

/**
 * TaskCard Component
 * Calm, modern card inspired by Linear and Notion.
 * Features:
 * - Drag handle with ghost preview
 * - Subtle priority chip with status dot
 * - Accessible dropdown "Move" menu with full keyboard navigation (Arrows, Enter, Esc)
 * - Inline title editing on double-click or edit icon
 * - Deletion with confirmation safeguard
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
  const [isMoveMenuOpen, setIsMoveMenuOpen] = useState(false);
  const [menuOpensUp, setMenuOpensUp] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  const startEditing = () => {
    setEditedTitle(task.title);
    setEditError(null);
    setIsEditing(true);
    setIsMoveMenuOpen(false);
  };

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  // Close move menu on outside click
  useEffect(() => {
    if (!isMoveMenuOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !menuBtnRef.current?.contains(e.target as Node)
      ) {
        setIsMoveMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMoveMenuOpen]);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
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

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  const handleDelete = () => {
    setIsMoveMenuOpen(false);
    const confirmed = window.confirm(`Are you sure you want to delete "${task.title}"?`);
    if (confirmed) {
      deleteTask(task.id);
    }
  };

  const handleMoveSelect = (newPriority: Priority) => {
    moveTask(task.id, newPriority);
    setIsMoveMenuOpen(false);
    menuBtnRef.current?.focus();
  };

  // Open the menu upward when there isn't room below (viewport or the clipping swipe row)
  const toggleMoveMenu = () => {
    if (!isMoveMenuOpen && menuBtnRef.current) {
      const MENU_HEIGHT = 200;
      const btnRect = menuBtnRef.current.getBoundingClientRect();
      const boardRect = menuBtnRef.current.closest('.board-grid')?.getBoundingClientRect();
      const bottomLimit = Math.min(window.innerHeight, boardRect?.bottom ?? Infinity);
      const topLimit = Math.max(0, boardRect?.top ?? 0);
      setMenuOpensUp(
        btnRect.bottom + MENU_HEIGHT > bottomLimit && btnRect.top - MENU_HEIGHT > topLimit
      );
    }
    setIsMoveMenuOpen((prev) => !prev);
  };

  // Keyboard navigation for dropdown menu
  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsMoveMenuOpen(false);
      menuBtnRef.current?.focus();
    }
  };

  return (
    <li
      className={`task-card-item ${isDragging ? 'is-dragging' : ''} ${isMoveMenuOpen ? 'menu-open' : ''}`}
      draggable={!isEditing}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      aria-label={`Task: ${task.title}`}
    >
      <article className={`task-card task-card-${task.priority}`}>
        {/* Card Header: Drag handle, Priority Chip, and Actions */}
        <div className="task-card-header">
          <div className="task-header-left">
            <span className="drag-handle" title="Drag to reprioritize" aria-hidden="true">
              ⠿
            </span>
            <span className={`priority-chip priority-chip-${task.priority}`}>
              <span className="priority-dot" aria-hidden="true"></span>
              {PRIORITY_LABELS[task.priority]}
            </span>
          </div>

          <div className="task-header-actions">
            {!isEditing && (
              <button
                type="button"
                className="card-action-btn"
                onClick={startEditing}
                title="Edit title (or double-click)"
                aria-label={`Edit title for "${task.title}"`}
              >
                ✎
              </button>
            )}

            <button
              type="button"
              className="card-action-btn delete-btn"
              onClick={handleDelete}
              title="Delete task"
              aria-label={`Delete task "${task.title}"`}
            >
              🗑
            </button>

            {/* Move Menu Dropdown Trigger */}
            <div className="move-dropdown-wrapper" ref={menuRef}>
              <button
                ref={menuBtnRef}
                type="button"
                className={`card-action-btn move-menu-btn ${isMoveMenuOpen ? 'active' : ''}`}
                onClick={toggleMoveMenu}
                title="Move task"
                aria-label={`Move task "${task.title}"`}
                aria-haspopup="menu"
                aria-expanded={isMoveMenuOpen}
              >
                ⇄
              </button>

              {/* Move Menu Dropdown */}
              {isMoveMenuOpen && (
                <div
                  className={`move-menu-dropdown ${menuOpensUp ? 'opens-up' : ''}`}
                  role="menu"
                  aria-label="Move task to priority"
                  onKeyDown={handleMenuKeyDown}
                >
                  <div className="move-menu-header">Move to...</div>
                  {task.priority !== 'high' && (
                    <button
                      type="button"
                      role="menuitem"
                      className="move-menu-item move-item-high"
                      onClick={() => handleMoveSelect('high')}
                      aria-label={`Move "${task.title}" to High Priority`}
                    >
                      <span className="menu-item-dot dot-high" aria-hidden="true"></span>
                      High Priority
                    </button>
                  )}

                  {task.priority !== 'medium' && (
                    <button
                      type="button"
                      role="menuitem"
                      className="move-menu-item move-item-medium"
                      onClick={() => handleMoveSelect('medium')}
                      aria-label={`Move "${task.title}" to Medium Priority`}
                    >
                      <span className="menu-item-dot dot-medium" aria-hidden="true"></span>
                      Medium Priority
                    </button>
                  )}

                  {task.priority !== 'low' && (
                    <button
                      type="button"
                      role="menuitem"
                      className="move-menu-item move-item-low"
                      onClick={() => handleMoveSelect('low')}
                      aria-label={`Move "${task.title}" to Low Priority`}
                    >
                      <span className="menu-item-dot dot-low" aria-hidden="true"></span>
                      Low Priority
                    </button>
                  )}

                  {task.priority !== 'unassigned' && (
                    <button
                      type="button"
                      role="menuitem"
                      className="move-menu-item move-item-unassign"
                      onClick={() => handleMoveSelect('unassigned')}
                      aria-label={`Unassign "${task.title}"`}
                    >
                      <span className="menu-item-icon" aria-hidden="true">
                        ↩
                      </span>
                      Take it back to Unassigned
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Task Title / Inline Edit Box */}
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
              onKeyDown={handleEditKeyDown}
              aria-label="Edit task title"
            />
            {editError && <span className="inline-error-msg">{editError}</span>}
            <div className="task-edit-actions">
              <button
                type="button"
                className="edit-btn-save"
                onClick={handleSaveEdit}
                aria-label="Save title"
              >
                Save
              </button>
              <button
                type="button"
                className="edit-btn-cancel"
                onClick={handleCancelEdit}
                aria-label="Cancel editing"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <h3
            className="task-title"
            onDoubleClick={startEditing}
            title="Double-click to edit title"
          >
            {task.title}
          </h3>
        )}
      </article>
    </li>
  );
});

export default TaskCard;
