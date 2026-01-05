import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Task, Category, TaskFilters, TaskFormData } from '../types';
import { Priority } from '../types';

interface TaskContextType {
  tasks: Task[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  filters: TaskFilters;
  setFilters: (filters: TaskFilters) => void;
  fetchTasks: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  createTask: (data: TaskFormData) => Promise<void>;
  updateTask: (id: number, data: Partial<TaskFormData>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  toggleTaskComplete: (id: number) => Promise<void>;
  createCategory: (data: { name: string; color?: string }) => Promise<void>;
  updateCategory: (id: number, data: { name?: string; color?: string }) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// LocalStorage keys
const TASKS_KEY = 'todo_tasks';
const CATEGORIES_KEY = 'todo_categories';

// Helper functions for LocalStorage
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Filtering and sorting helper
const filterAndSortTasks = (tasks: Task[], filters: TaskFilters): Task[] => {
  let filtered = [...tasks];

  // Apply filters
  if (filters.completed !== undefined) {
    filtered = filtered.filter(task => task.isCompleted === filters.completed);
  }
  if (filters.priority) {
    filtered = filtered.filter(task => task.priority === filters.priority);
  }
  if (filters.categoryId) {
    filtered = filtered.filter(task => task.categoryId === filters.categoryId);
  }
  if (filters.tag) {
    filtered = filtered.filter(task =>
      task.tags?.some(t => t.toLowerCase().includes(filters.tag!.toLowerCase()))
    );
  }

  // Apply sorting
  const sortBy = filters.sortBy || 'createdAt';
  const order = filters.order || 'desc';

  filtered.sort((a, b) => {
    let comparison = 0;

    if (sortBy === 'priority') {
      const priorityOrder = { [Priority.HIGH]: 3, [Priority.MEDIUM]: 2, [Priority.LOW]: 1 };
      comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
    } else if (sortBy === 'dueDate') {
      const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      comparison = aDate - bDate;
    } else if (sortBy === 'createdAt') {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }

    return order === 'asc' ? comparison : -comparison;
  });

  return filtered;
};

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allTasks, setAllTasks] = useState<Task[]>(() => loadFromStorage(TASKS_KEY, []));
  const [categories, setCategories] = useState<Category[]>(() => loadFromStorage(CATEGORIES_KEY, []));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({
    sortBy: 'createdAt',
    order: 'desc',
  });

  const [tasks, setTasks] = useState<Task[]>([]);

  // Update filtered tasks when allTasks or filters change
  useEffect(() => {
    const enrichedTasks = allTasks.map(task => ({
      ...task,
      category: task.categoryId ? categories.find(c => c.id === task.categoryId) : undefined,
    }));
    const filtered = filterAndSortTasks(enrichedTasks, filters);
    setTasks(filtered);
  }, [allTasks, categories, filters]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveToStorage(TASKS_KEY, allTasks);
  }, [allTasks]);

  useEffect(() => {
    saveToStorage(CATEGORIES_KEY, categories);
  }, [categories]);

  const fetchTasks = async () => {
    // No-op for LocalStorage version, data is already loaded
    setLoading(false);
  };

  const fetchCategories = async () => {
    // No-op for LocalStorage version, data is already loaded
  };

  const createTask = async (data: TaskFormData) => {
    try {
      setLoading(true);
      setError(null);

      const newTask: Task = {
        id: Date.now(), // Simple ID generation
        title: data.title,
        description: data.description,
        isCompleted: false,
        priority: data.priority || Priority.MEDIUM,
        dueDate: data.dueDate,
        categoryId: data.categoryId,
        tags: data.tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setAllTasks((prev) => [newTask, ...prev]);
    } catch (err: any) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: number, data: Partial<TaskFormData>) => {
    try {
      setLoading(true);
      setError(null);

      setAllTasks((prev) => prev.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            ...data,
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      }));
    } catch (err: any) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      setAllTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err: any) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskComplete = async (id: number) => {
    try {
      setError(null);
      setAllTasks((prev) => prev.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            isCompleted: !task.isCompleted,
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      }));
    } catch (err: any) {
      setError('Failed to toggle task completion');
      console.error('Error toggling task completion:', err);
      throw err;
    }
  };

  const createCategory = async (data: { name: string; color?: string }) => {
    try {
      setError(null);
      const newCategory: Category = {
        id: Date.now(),
        name: data.name,
        color: data.color || '#3B82F6',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCategories((prev) => [...prev, newCategory]);
    } catch (err: any) {
      setError('Failed to create category');
      console.error('Error creating category:', err);
      throw err;
    }
  };

  const updateCategory = async (id: number, data: { name?: string; color?: string }) => {
    try {
      setError(null);
      setCategories((prev) => prev.map((cat) => {
        if (cat.id === id) {
          return {
            ...cat,
            ...data,
            updatedAt: new Date().toISOString(),
          };
        }
        return cat;
      }));
    } catch (err: any) {
      setError('Failed to update category');
      console.error('Error updating category:', err);
      throw err;
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      setError(null);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      // Remove category from tasks
      setAllTasks((prev) => prev.map((task) => {
        if (task.categoryId === id) {
          return { ...task, categoryId: undefined };
        }
        return task;
      }));
    } catch (err: any) {
      setError('Failed to delete category');
      console.error('Error deleting category:', err);
      throw err;
    }
  };

  const value: TaskContextType = {
    tasks,
    categories,
    loading,
    error,
    filters,
    setFilters,
    fetchTasks,
    fetchCategories,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    createCategory,
    updateCategory,
    deleteCategory,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
