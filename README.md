# Task Priority Board

A lightweight, interview-ready Kanban-style task priority board built with **React 19**, **Vite**, and **Plain CSS** (no external UI or state libraries).

---

## 🚀 Key Architectural & Design Decisions

### 1. Single Source of Truth
- The entire application state lives in a single `tasks` array managed by `useState` in `App.jsx`.
- Each task object has the strict shape:
  ```ts
  {
    id: string;
    title: string;
    priority: "unassigned" | "high" | "medium" | "low";
  }
  ```
- **Why this matters:** Having separate arrays for each column (e.g., `highTasks`, `mediumTasks`, `lowTasks`) introduces duplicate state, synchronization overhead, and potential edge-case bugs when moving tasks. A single array guarantees data integrity.

### 2. Derived Columns (Zero Redundancy)
- Priority columns do not store local copies or independent slices of state.
- Each `Column` component receives the central `tasks` array and filters items dynamically:
  ```jsx
  const columnTasks = tasks.filter((t) => t.priority === priority.key);
  ```
- Task counts (`columnTasks.length`) and empty-state triggers are computed directly on the fly.

### 3. Immutable State Updates
- Moving a task between priority columns or unassigning it uses pure immutable functional updates:
  ```jsx
  const moveTask = (id, newPriority) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, priority: newPriority } : t))
    );
  };
  ```
- Unassigning a task reuses the exact same function with `newPriority = "unassigned"`, avoiding redundant handler logic.

### 4. Dynamic Column Generation via Constants
- Columns are not hardcoded. Instead, `src/constants.js` defines:
  ```js
  export const PRIORITIES = [
    { key: 'unassigned', label: 'Unassigned' },
    { key: 'high', label: 'High Priority' },
    { key: 'medium', label: 'Medium Priority' },
    { key: 'low', label: 'Low Priority' }
  ];
  ```
- `Board.jsx` maps over `PRIORITIES` to render each `Column`, ensuring extensibility if priority tiers change.

### 5. Context-Aware Action Controls & Accessibility
- **Targeted Buttons:** A `TaskCard` presents buttons to move to High, Medium, or Low, automatically hiding the button for its current priority.
- **Unassign Button:** Shown only when a task is currently in `high`, `medium`, or `low` (hidden when already `unassigned`).
- **Accessibility:** Interactive buttons include explicit `aria-label` attributes for screen reader clarity.

### 6. Responsive CSS Grid & HTML5 Drag and Drop
- Built with standard CSS Grid: 4 columns on desktop, 2 columns on tablet, and single-column stack on mobile screens.
- Includes native HTML5 drag-and-drop: drag any card into another column to update its priority immediately.

---

## 📂 Project Structure

```
task-priority-board/
├── task-board/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Board.jsx       # Maps PRIORITIES to Columns
│   │   │   ├── Column.jsx      # Filters tasks, renders header count & empty state
│   │   │   └── TaskCard.jsx    # Displays title, drag handles & contextual move buttons
│   │   ├── constants.js        # PRIORITIES definitions & INITIAL_TASKS seed
│   │   ├── App.jsx             # Single tasks state, moveTask handler, and layout
│   │   ├── App.css             # Component styling, responsive CSS grid, card states
│   │   ├── index.css           # Global tokens and resets
│   │   └── main.jsx            # React root mount
│   ├── verify.test.js          # Automated verification script
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🛠️ Running Locally

1. Navigate to the project directory:
   ```bash
   cd task-board
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Run logic verification test:
   ```bash
   node verify.test.js
   ```

---

## 🧪 Verification Checklist

- [x] Initial seed contains 8 tasks, all in "Unassigned".
- [x] Moving a task updates the column count and moves the card immediately.
- [x] Move button for current priority is hidden.
- [x] "Unassign" button is hidden in "Unassigned" and visible in "High", "Medium", and "Low".
- [x] Clicking "Unassign" returns task to "Unassigned".
- [x] Empty state messages render when a column has 0 tasks.
- [x] Zero state mutations throughout the app lifecycle.
