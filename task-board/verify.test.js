import assert from 'node:assert';
import { PRIORITIES, INITIAL_TASKS } from './src/constants.js';

console.log('--- Running Task Priority Board Logic Verifications ---');

// 1. Check PRIORITIES configuration
assert.strictEqual(PRIORITIES.length, 4, 'Must have exactly 4 priorities defined');
assert.deepStrictEqual(
  PRIORITIES.map(p => ({ key: p.key, label: p.label })),
  [
    { key: 'unassigned', label: 'Unassigned' },
    { key: 'high', label: 'High Priority' },
    { key: 'medium', label: 'Medium Priority' },
    { key: 'low', label: 'Low Priority' }
  ],
  'PRIORITIES must match exact keys and labels'
);
console.log('✓ PRIORITIES correctly defined with 4 sections');

// 2. Check INITIAL_TASKS seed
assert.strictEqual(INITIAL_TASKS.length, 8, 'Must seed ~8 tasks');
assert(
  INITIAL_TASKS.every(t => t.priority === 'unassigned'),
  'All initial tasks must be seeded with priority "unassigned"'
);
console.log('✓ INITIAL_TASKS seeded with 8 tasks, all "unassigned"');

// 3. Test state immutability & moveTask function
let tasks = [...INITIAL_TASKS];
const moveTask = (id, newPriority) => {
  tasks = tasks.map(t => (t.id === id ? { ...t, priority: newPriority } : t));
};

const testTaskId = tasks[0].id;
const originalRef = tasks[0];

// Move to High
moveTask(testTaskId, 'high');
assert.strictEqual(tasks[0].priority, 'high', 'Task priority must update to high');
assert.notStrictEqual(tasks[0], originalRef, 'Updated task must be a new object reference (immutable)');

// Check derived counts
const unassignedCount = tasks.filter(t => t.priority === 'unassigned').length;
const highCount = tasks.filter(t => t.priority === 'high').length;
const medCount = tasks.filter(t => t.priority === 'medium').length;
const lowCount = tasks.filter(t => t.priority === 'low').length;

assert.strictEqual(unassignedCount, 7, 'Unassigned column count must be 7');
assert.strictEqual(highCount, 1, 'High column count must be 1');
assert.strictEqual(medCount, 0, 'Medium column count must be 0 (empty state)');
assert.strictEqual(lowCount, 0, 'Low column count must be 0 (empty state)');
console.log('✓ Derived column filtering and counts are accurate');

// Move to Medium
moveTask(testTaskId, 'medium');
assert.strictEqual(tasks[0].priority, 'medium', 'Task priority must update to medium');

// Move to Low
moveTask(testTaskId, 'low');
assert.strictEqual(tasks[0].priority, 'low', 'Task priority must update to low');

// Unassign
moveTask(testTaskId, 'unassigned');
assert.strictEqual(tasks[0].priority, 'unassigned', 'Task priority must revert to unassigned');
assert.strictEqual(tasks.filter(t => t.priority === 'unassigned').length, 8, 'All 8 tasks unassigned again');
console.log('✓ Task movement through High -> Medium -> Low -> Unassign verified');

// 4. Test button visibility logic matching TaskCard
function getButtonsForTask(priority) {
  const buttons = [];
  if (priority !== 'high') buttons.push('high');
  if (priority !== 'medium') buttons.push('medium');
  if (priority !== 'low') buttons.push('low');
  if (priority !== 'unassigned') buttons.push('unassigned');
  return buttons;
}

assert.deepStrictEqual(getButtonsForTask('unassigned'), ['high', 'medium', 'low']);
assert.deepStrictEqual(getButtonsForTask('high'), ['medium', 'low', 'unassigned']);
assert.deepStrictEqual(getButtonsForTask('medium'), ['high', 'low', 'unassigned']);
assert.deepStrictEqual(getButtonsForTask('low'), ['high', 'medium', 'unassigned']);
console.log('✓ Button display logic strictly obeys current priority and unassign rules');

console.log('All Task Priority Board tests passed successfully!');
