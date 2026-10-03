# Task Priority Board

**Live demo:** https://task-priority-board-tau.vercel.app
**GitHub:** https://github.com/DeepthiDevindi/task-priority-board

A Kanban-style board for sorting tasks into **Unassigned**, **High**, **Medium** and **Low** priority. Built with **React 19**, **TypeScript**, **Vite** and plain CSS (no UI libraries), around a single source of truth, derived columns and immutable updates.

---

## Features

**Tasks**
- Add tasks with an initial priority. Titles are trimmed, required and must be unique (case-insensitive).
- Move tasks between columns with the **⇄ move menu** (only valid targets are shown, plus **Unassign** for prioritized tasks) or with **drag and drop**.
- Edit titles inline (double-click or ✎) with the same validation, and delete with confirmation.
- **Undo** the last action from the toast notification.
- Search filters tasks by title across all four columns.
- The board is saved to `localStorage`, so it survives a page refresh. **Reset** restores the 8 seed tasks.

**Interface**
- Light and dark themes (remembered between visits).
- Progress summary showing how many tasks have been prioritized.
- Responsive layout: 4 columns on desktop. On tablets and phones the columns become a swipeable row with a sticky column navigator (counts per column, tap to jump).
- Toasts auto-dismiss (4s, or 7s when Undo is offered) and pause while hovered or focused.

**Accessibility**
- Every control is keyboard operable with visible focus rings and descriptive labels.
- The move menu and priority picker follow WAI-ARIA menu and listbox patterns (arrow keys, Home/End, Enter, Escape).
- A polite live region announces changes such as *"Task X moved to High Priority"*.
- Text colours meet WCAG AA contrast in both themes.

---

## Tech stack

| Area | Tools |
|---|---|
| UI | React 19 (hooks, `useReducer`, `React.memo`, `useCallback`, `useMemo`) |
| Language | TypeScript |
| Build | Vite 8 |
| Styling | Plain CSS with design tokens (CSS custom properties) |
| Testing | Vitest, React Testing Library, jest-dom (24 tests) |
| Code quality | Oxlint, Prettier |
| Hosting | Vercel (auto-deploys from `main`) |

---

## Run locally

Requires Node.js 20+ (developed on Node 24).

```bash
git clone https://github.com/DeepthiDevindi/task-priority-board.git
cd task-priority-board/task-board
npm install
npm run dev
```

Then open http://localhost:5173.

Other scripts (run inside `task-board/`):

| Command | What it does |
|---|---|
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Lint with Oxlint |
| `npm run format` | Format with Prettier |

---

## Run tests

```bash
cd task-board
npm test            # run once
npm run test:watch  # watch mode
```

The suite has 24 tests:
- **Reducer unit tests** (`src/tests/tasksReducer.test.ts`): add, move, edit, delete, undo, reset and title validation.
- **Integration tests** (`src/tests/TaskBoard.test.tsx`): render the whole app and cover adding tasks, moving through High → Medium → Low → Unassign, editing, deleting, search, undo, theme toggle, the priority picker and toast auto-dismiss.

---

## Design decisions

### Single source of truth
All tasks live in one array. Each task carries its own priority, instead of separate arrays per column:

```ts
type Priority = 'unassigned' | 'high' | 'medium' | 'low';

interface Task {
  id: string;
  title: string;
  priority: Priority;
}
```

Moving a task only changes its `priority` field. A task can't end up in two columns or get lost between them, and persistence is a single `localStorage` write.

### Derived columns
Columns don't store tasks. Each one filters the master list when it renders:

```ts
const columnTasks = tasks.filter((t) => t.priority === priority.key);
```

Column counts, empty states, the progress summary and search results are all computed from the same array, so they can't drift out of sync.

### Immutable updates
Every change goes through a single reducer (`tasksReducer`) with the actions `ADD_TASK`, `MOVE_TASK`, `EDIT_TASK`, `DELETE_TASK`, `UNDO` and `RESET_TASKS`. Updates never mutate state; they return new arrays with `map`, `filter` and spread:

```ts
case 'MOVE_TASK': {
  const nextTasks = state.tasks.map((t) =>
    t.id === action.payload.id ? { ...t, priority: action.payload.priority } : t
  );
  return {
    tasks: nextTasks,
    history: [state.tasks, ...state.history].slice(0, MAX_HISTORY_LENGTH),
    lastAnnouncement: `Task "${targetTask.title}" moved to ${priorityLabel}.`,
  };
}
```

Because old arrays are never changed, the previous `tasks` array can be pushed onto a history stack as-is. That is what makes **Undo** simple: it pops the last snapshot. It also lets `React.memo` skip re-rendering cards that didn't change.

---

## Project structure

```
task-priority-board/
└── task-board/                 # the Vite app (Vercel root directory)
    ├── src/
    │   ├── components/         # Board, Column, TaskCard, TaskForm, PrioritySelect,
    │   │                       # SearchBar, ThemeToggle, Toast, LogoMark
    │   ├── constants/          # PRIORITIES config and seed tasks
    │   ├── hooks/              # useTasks (state + persistence), useTheme
    │   ├── reducer/            # tasksReducer with undo history
    │   ├── types/              # Task and Priority types
    │   ├── utils/              # title validation
    │   └── tests/              # Vitest suites
    ├── vercel.json             # Vercel build settings
    └── vite.config.ts
```

---

## Deployment

The app is hosted on Vercel with the project's root directory set to `task-board`, framework Vite, build command `npm run build` and output directory `dist`. Every push to `main` deploys to production automatically.
