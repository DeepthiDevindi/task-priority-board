import React, { useEffect, useId, useRef, useState } from 'react';
import { Priority } from '../types';
import { PRIORITIES } from '../constants';

interface PrioritySelectProps {
  value: Priority;
  onChange: (priority: Priority) => void;
}

const PRIORITY_HINTS: Record<Priority, string> = {
  unassigned: 'Decide later',
  high: 'Urgent — needs attention today',
  medium: 'Important, but can wait',
  low: 'Nice to have',
};

/**
 * PrioritySelect Component
 * Styled replacement for the native <select> (whose open list can't be themed),
 * following the WAI-ARIA "select-only combobox" pattern:
 * - Trigger: Enter / Space / ArrowUp / ArrowDown opens
 * - List: Arrows, Home/End, type-ahead, Enter/Space selects, Esc/Tab closes
 */
export function PrioritySelect({ value, onChange }: PrioritySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const baseId = useId();
  const listId = `${baseId}-listbox`;
  const optionId = (index: number) => `${baseId}-option-${index}`;

  const selectedIndex = Math.max(
    0,
    PRIORITIES.findIndex((p) => p.key === value)
  );
  const selected = PRIORITIES[selectedIndex];

  const open = (index = selectedIndex) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  const close = (returnFocus = true) => {
    setIsOpen(false);
    if (returnFocus) triggerRef.current?.focus({ preventScroll: true });
  };

  const choose = (index: number) => {
    onChange(PRIORITIES[index].key);
    close();
  };

  // Move focus into the list when it opens so arrow keys work immediately.
  // preventScroll keeps the page from jumping; the 4-item list never needs scrolling.
  useEffect(() => {
    if (isOpen) listRef.current?.focus({ preventScroll: true });
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault();
      open();
    }
  };

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    const last = PRIORITIES.length - 1;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((i) => Math.min(last, i + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((i) => Math.max(0, i - 1));
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(last);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        choose(activeIndex);
        break;
      case 'Escape':
        e.preventDefault();
        close();
        break;
      case 'Tab':
        close(false);
        break;
      default:
        // Type-ahead: jump to the first option starting with the typed letter
        if (e.key.length === 1) {
          const match = PRIORITIES.findIndex((p) =>
            p.label.toLowerCase().startsWith(e.key.toLowerCase())
          );
          if (match !== -1) setActiveIndex(match);
        }
    }
  };

  return (
    <div className="priority-select-wrapper" ref={wrapperRef}>
      <button
        ref={triggerRef}
        id="task-priority-select"
        type="button"
        className={`priority-select-trigger ${isOpen ? 'is-open' : ''}`}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleTriggerKeyDown}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-label={`Initial task priority: ${selected.label}`}
      >
        <span className={`column-status-dot dot-${selected.key}`} aria-hidden="true"></span>
        <span className="priority-select-value">{selected.label}</span>
        <svg
          className="priority-select-chevron"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path
            d="M4 6l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          id={listId}
          className="priority-select-list"
          role="listbox"
          tabIndex={-1}
          aria-label="Initial task priority"
          aria-activedescendant={optionId(activeIndex)}
          onKeyDown={handleListKeyDown}
        >
          {PRIORITIES.map((p, index) => {
            const isSelected = p.key === value;
            return (
              <li
                key={p.key}
                id={optionId(index)}
                role="option"
                aria-selected={isSelected}
                className={`priority-select-option ${index === activeIndex ? 'is-active' : ''} ${
                  isSelected ? 'is-selected' : ''
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(index)}
              >
                <span className={`column-status-dot dot-${p.key}`} aria-hidden="true"></span>
                <span className="priority-select-option-text">
                  <span className="priority-select-option-label">{p.label}</span>
                  <span className="priority-select-option-hint">{PRIORITY_HINTS[p.key]}</span>
                </span>
                {isSelected && (
                  <svg
                    className="priority-select-check"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path
                      d="M3.5 8.5l3 3 6-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default PrioritySelect;
