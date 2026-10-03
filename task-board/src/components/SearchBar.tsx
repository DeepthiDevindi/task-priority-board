import React from 'react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalTasks: number;
  filteredTasksCount: number;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  totalTasks,
  filteredTasksCount,
}: SearchBarProps) {
  return (
    <div className="search-bar-wrap" role="search" aria-label="Filter tasks">
      <div className="search-input-container">
        <span className="search-icon" aria-hidden="true">
          🔍
        </span>
        <input
          id="task-search-input"
          type="search"
          className="search-input"
          placeholder="Filter tasks by title across all columns..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Filter tasks by title"
        />
        {searchQuery && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => onSearchChange('')}
            title="Clear filter"
            aria-label="Clear filter search"
          >
            ×
          </button>
        )}
      </div>

      {searchQuery && (
        <span className="search-results-badge" aria-live="polite">
          Showing {filteredTasksCount} of {totalTasks} tasks
        </span>
      )}
    </div>
  );
}

export default SearchBar;
