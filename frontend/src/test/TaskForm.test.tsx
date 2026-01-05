import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import React from 'react';
import TaskForm from '../components/TaskForm';
import { TaskProvider, useTaskContext } from '../context/TaskContext';
import type { Task } from '../types';
import { Priority } from '../types';

// Wrapper component that provides context and pre-populates categories
function TestWrapper({ children, initialCategories = [] }: { children: React.ReactNode; initialCategories?: any[] }) {
  return <TaskProvider>{children}</TaskProvider>;
}

// Helper component to set up categories before rendering TaskForm
function TaskFormWithCategories() {
  const [showForm, setShowForm] = React.useState(false);
  const { categories, createCategory } = React.useContext(TaskProvider as any);

  React.useEffect(() => {
    // Create test categories
    const setupCategories = async () => {
      await createCategory({ name: '仕事', color: '#FF0000' });
      await createCategory({ name: '個人', color: '#00FF00' });
      setShowForm(true);
    };
    setupCategories();
  }, []);

  if (!showForm) return <div>Loading...</div>;

  return (
    <TaskForm
      onClose={() => {}}
      onSuccess={() => {}}
    />
  );
}

describe('TaskForm', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should display category dropdown with default "カテゴリなし" option', () => {
    const mockOnClose = vi.fn();
    const mockOnSuccess = vi.fn();

    render(
      <TaskProvider>
        <TaskForm onClose={mockOnClose} onSuccess={mockOnSuccess} />
      </TaskProvider>
    );

    // Should have the category select element
    const categorySelect = screen.getByLabelText(/カテゴリ/);
    expect(categorySelect).toBeInTheDocument();

    // Should have the default "カテゴリなし" option
    expect(screen.getByRole('option', { name: 'カテゴリなし' })).toBeInTheDocument();
  });

  it('should display all available categories in dropdown', async () => {
    const mockOnClose = vi.fn();
    const mockOnSuccess = vi.fn();

    render(
      <TaskProvider>
        <TaskFormTest onClose={mockOnClose} onSuccess={mockOnSuccess} />
      </TaskProvider>
    );

    // Wait for categories to be created
    await waitFor(() => {
      const categorySelect = screen.getByLabelText(/カテゴリ/);
      const options = within(categorySelect).getAllByRole('option');

      // Should have 3 options: "カテゴリなし" + 2 categories
      expect(options).toHaveLength(3);
    });

    // Check that specific categories are present
    expect(screen.getByRole('option', { name: 'カテゴリなし' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '仕事' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '個人' })).toBeInTheDocument();
  });

  it('should allow selecting a category', async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    const mockOnSuccess = vi.fn();

    render(
      <TaskProvider>
        <TaskFormTest onClose={mockOnClose} onSuccess={mockOnSuccess} />
      </TaskProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('option', { name: '仕事' })).toBeInTheDocument();
    });

    const categorySelect = screen.getByLabelText(/カテゴリ/) as HTMLSelectElement;

    // Select a category
    await user.selectOptions(categorySelect, '仕事');

    // Verify the category is selected
    expect(categorySelect.value).not.toBe('');
  });

  it('should create task with selected category', async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    const mockOnSuccess = vi.fn();

    render(
      <TaskProvider>
        <CompleteTestComponent onClose={mockOnClose} onSuccess={mockOnSuccess} />
      </TaskProvider>
    );

    // Wait for form to be ready
    await waitFor(() => {
      expect(screen.getByLabelText(/タイトル/)).toBeInTheDocument();
    });

    // Fill in the form
    const titleInput = screen.getByLabelText(/タイトル/);
    await user.type(titleInput, 'テストタスク');

    // Select category
    const categorySelect = screen.getByLabelText(/カテゴリ/);
    await waitFor(() => {
      expect(screen.getByRole('option', { name: '仕事' })).toBeInTheDocument();
    });
    await user.selectOptions(categorySelect, '仕事');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /タスクを作成/ });
    await user.click(submitButton);

    // Verify callbacks were called
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});

// Helper component for testing with categories
function TaskFormTest({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const { createCategory } = useTaskContext();
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const setup = async () => {
      await createCategory({ name: '仕事', color: '#FF0000' });
      await createCategory({ name: '個人', color: '#00FF00' });
      setReady(true);
    };
    setup();
  }, []);

  if (!ready) return null;

  return <TaskForm onClose={onClose} onSuccess={onSuccess} />;
}

// Helper component for complete test
function CompleteTestComponent({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const { createCategory } = useTaskContext();
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const setup = async () => {
      await createCategory({ name: '仕事', color: '#FF0000' });
      setReady(true);
    };
    setup();
  }, []);

  if (!ready) return null;

  return <TaskForm onClose={onClose} onSuccess={onSuccess} />;
}
