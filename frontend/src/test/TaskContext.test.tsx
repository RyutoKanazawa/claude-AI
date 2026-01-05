import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { TaskProvider, useTaskContext } from '../context/TaskContext';
import { Priority } from '../types';

// Test component that uses the context
function TestComponent() {
  const { categories, tasks, createCategory, createTask } = useTaskContext();

  return (
    <div>
      <div data-testid="category-count">{categories.length}</div>
      <div data-testid="task-count">{tasks.length}</div>
      <button
        data-testid="add-category"
        onClick={() => createCategory({ name: 'Test Category', color: '#FF0000' })}
      >
        Add Category
      </button>
      <button
        data-testid="add-task"
        onClick={() =>
          createTask({
            title: 'Test Task',
            description: 'Test Description',
            priority: Priority.HIGH,
            categoryId: categories[0]?.id,
          })
        }
      >
        Add Task
      </button>
      <ul data-testid="categories-list">
        {categories.map((cat) => (
          <li key={cat.id} data-testid={`category-${cat.id}`}>
            {cat.name}
          </li>
        ))}
      </ul>
      <ul data-testid="tasks-list">
        {tasks.map((task) => (
          <li key={task.id} data-testid={`task-${task.id}`}>
            {task.title} - Category: {task.category?.name || 'None'}
          </li>
        ))}
      </ul>
    </div>
  );
}

describe('TaskContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should start with empty categories and tasks', () => {
    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );

    expect(screen.getByTestId('category-count')).toHaveTextContent('0');
    expect(screen.getByTestId('task-count')).toHaveTextContent('0');
  });

  it('should create a new category', async () => {
    const user = userEvent.setup();
    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );

    await user.click(screen.getByTestId('add-category'));

    await waitFor(() => {
      expect(screen.getByTestId('category-count')).toHaveTextContent('1');
    });

    expect(screen.getByText('Test Category')).toBeInTheDocument();
  });

  it('should persist categories in localStorage', async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );

    await user.click(screen.getByTestId('add-category'));

    await waitFor(() => {
      expect(screen.getByTestId('category-count')).toHaveTextContent('1');
    });

    // Unmount and remount to test persistence
    unmount();

    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );

    // Category should still be there
    expect(screen.getByTestId('category-count')).toHaveTextContent('1');
    expect(screen.getByText('Test Category')).toBeInTheDocument();
  });

  it('should create a task with category', async () => {
    const user = userEvent.setup();
    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );

    // First create a category
    await user.click(screen.getByTestId('add-category'));

    await waitFor(() => {
      expect(screen.getByTestId('category-count')).toHaveTextContent('1');
    });

    // Then create a task with that category
    await user.click(screen.getByTestId('add-task'));

    await waitFor(() => {
      expect(screen.getByTestId('task-count')).toHaveTextContent('1');
    });

    // Task should show the category name
    expect(screen.getByText(/Test Task - Category: Test Category/)).toBeInTheDocument();
  });

  it('should persist tasks in localStorage', async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );

    await user.click(screen.getByTestId('add-category'));
    await waitFor(() => {
      expect(screen.getByTestId('category-count')).toHaveTextContent('1');
    });

    await user.click(screen.getByTestId('add-task'));
    await waitFor(() => {
      expect(screen.getByTestId('task-count')).toHaveTextContent('1');
    });

    // Unmount and remount
    unmount();

    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );

    // Both category and task should still be there
    expect(screen.getByTestId('category-count')).toHaveTextContent('1');
    expect(screen.getByTestId('task-count')).toHaveTextContent('1');
    expect(screen.getByText(/Test Task - Category: Test Category/)).toBeInTheDocument();
  });
});
