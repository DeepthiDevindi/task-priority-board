# ⚡ Task Priority Board

A high-performance, interview-ready Kanban-style task priority board built with **React 19**, **TypeScript**, **Vite**, and **Plain CSS** (no UI libraries). Designed around a strict **Single Source of Truth** architecture, derived state, and immutable updates.

---

## 🌟 Features Overview

### 1. Core Kanban & State Management
- **Single Source of Truth**: All tasks live in a single `tasks` array managed via `useReducer` in the custom `useTasks()` hook.
- **Derived Priority Sections**: 4 columns (**Unassigned**, **High Priority**, **Medium Priority**, **Low Priority**) dynamically filter the central state.
- **Task Creation with Validation**: Form ensures required, trimmed titles and strictly prevents duplicate task names (case-insensitive).
- **Inline Editing**: Double-click any task title or click the edit icon (✎) to update titles inline with instant validation.
- **Delete with Confirmation**: Safeguarded task removal with explicit user confirmation.
- **Native HTML5 Drag and Drop**: Drag tasks across columns with dynamic visual dropzone highlights (`is-drag-over`), plus keyboard-accessible move buttons as fallbacks.
- **Context-Aware Move & Unassign**:
  - Buttons for High, Medium, Low automatically hide the button for the task's current priority.
  - An **↩ Unassign** button appears only when a task is in High, Medium, or Low, returning it to Unassigned.
- **Live Search Filter**: Real-time title search narrowing down tasks across all four columns with match count indicators.
- **Undo History**: Integrated reducer-level history stack allowing immediate rollback of the last action.

### 2. UI & Accessibility (a11y)
- **Dark / Light Theme Toggle**: Persistent custom CSS variable design tokens for seamless dark/light modes.
- **Accessible Assistive Tech Support**: Live `aria-live="polite"` region announcing state transitions (e.g. *"Task X moved to High Priority"*, *"Task title updated"*).
- **Accessible Controls**: Fully navigable with keyboard focus rings and descriptive `aria-label` tags on every interactive element.
- **Responsive Layout**: Clean 4-column CSS Grid that smoothly adapts to 2 columns on tablets and 1 column on mobile screens.

---

## 🛠️ Tech Stack

- **Framework**: React 19 (Hooks, Functional Components, `React.memo`, `useCallback`)
- **Language**: TypeScript (Strict typing for `Task`, `Priority`, and `PriorityConfig`)
- **Build Tool**: Vite 8
- **Styling**: Vanilla CSS (CSS Variables, Responsive CSS Grid, Glassmorphism, Micro-animations)
- **Testing**: Vitest + React Testing Library + `@testing-library/jest-dom` (22 unit & integration tests)
- **Code Quality**: Oxlint + Prettier

---

## 🏛️ Architecture & Design Decisions

### 1. Single Source of Truth
Instead of maintaining fragmented arrays for each column (`highTasks`, `mediumTasks`, `lowTasks`, `unassignedTasks`), all tasks exist strictly within a single `tasks` array:
```ts
export type Priority = 'unassigned' | 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  priority: Priority;
}
```
**Why this matters**: Multiple state arrays inevitably cause synchronization issues, duplicate items, or race conditions during rapid state transitions. A single array guarantees data integrity and simplifies persistence.

### 2. Purely Derived State (Zero Redundancy)
Each `Column` calculates its displayed tasks dynamically by filtering the master list:
```tsx
const columnTasks = tasks.filter((t) => t.priority === priority.key);
```
Counts and empty states are computed on the fly without storing duplicate copies in child state.

### 3. Reducer Pattern & Undo Stack
All mutations pass through `tasksReducer`, ensuring predictable transitions:
- `ADD_TASK`
- `MOVE_TASK`
- `EDIT_TASK`
- `DELETE_TASK`
- `UNDO`
- `RESET_TASKS`

Every modifying action snapshots the previous state into an immutable `history` stack, enabling instant **Undo** capability without external middleware.

### 4. Performance Optimization
- `TaskCard` is wrapped with `React.memo` to eliminate unnecessary re-renders when other cards change.
- All handler functions passed to child components are stabilized using `useCallback`.
- Search filtering is memoized with `useMemo`.

---

## 📁 Project Structure

```
task-priority-board/
├── task-board/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Board.tsx         # Maps PRIORITIES constant into Columns
│   │   │   ├── Column.tsx        # Column dropzone, headers, counts, empty state
│   │   │   ├── TaskCard.tsx      # Memoized card, inline editing, move buttons
│   │   │   ├── TaskForm.tsx      # Task creation form with validation
│   │   │   ├── SearchBar.tsx     # Cross-column search input
│   │   │   └── ThemeToggle.tsx   # Light/dark mode toggle button
│   │   ├── constants/
│   │   │   └── index.ts          # PRIORITIES metadata & 8 seed tasks
│   │   ├── hooks/
│   │   │   ├── useTasks.ts       # Central tasks state, persistence & handlers
│   │   │   └── useTheme.ts       # Theme state & localStorage synchronization
│   │   ├── reducer/
│   │   │   └── tasksReducer.ts   # Action handlers & undo history stack
│   │   ├── types/
│   │   │   ├── task.ts           # Task and Priority union definitions
│   │   │   └── index.ts          # Type exports
│   │   ├── utils/
│   │   │   └── validation.ts     # Title trimming and duplicate checks
│   │   ├── tests/
│   │   │   ├── setup.ts          # Vitest jest-dom setup
│   │   │   ├── tasksReducer.test.ts # Reducer unit tests (14 tests)
│   │   │   └── TaskBoard.test.tsx   # React Testing Library integration tests (8 tests)
│   │   ├── App.tsx               # App layout, announcer, and provider
│   │   ├── App.css               # Component CSS, responsive grid & card styles
│   │   ├── index.css             # Theme variables & base typography
│   │   └── main.tsx              # React DOM entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .prettierrc
└── README.md
```

---

## 🚀 Getting Started

### 1. Installation
```bash
cd task-board
npm install
```

### 2. Development Server
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.

### 3. Run Tests
```bash
npm test
```
Executes all 22 Vitest and React Testing Library tests covering reducer logic, task creation, moves, unassigning, inline editing, deletion, search filtering, and undo.

### 4. Build Production Bundle
```bash
npm run build
```

### 5. Format & Lint
```bash
npm run format
npm run lint
```

---

## 🚢 Deploying to Vercel

You can deploy this project to [Vercel](https://vercel.com/) in under two minutes:

### Option A: Via Vercel Web Dashboard (Recommended)
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository (`task-priority-board`).
4. In the configuration settings:
   - **Root Directory**: Select `task-board`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Vercel will automatically build and deploy your application.

### Option B: Via Vercel CLI
```bash
npm i -g vercel
cd task-board
vercel
```
Follow the interactive prompts to deploy.
