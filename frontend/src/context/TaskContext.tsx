import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Task, Category, TaskFilters, TaskFormData } from '../types';
import { taskApi, categoryApi } from '../services/api';

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

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({
    sortBy: 'createdAt',
    order: 'desc',
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskApi.getAll(filters);
      setTasks(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setError(null);
      const data = await categoryApi.getAll();
      setCategories(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch categories');
      console.error('Error fetching categories:', err);
    }
  };

  const createTask = async (data: TaskFormData) => {
    try {
      setLoading(true);
      setError(null);
      const newTask = await taskApi.create(data);
      setTasks((prev) => [newTask, ...prev]);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create task');
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
      const updatedTask = await taskApi.update(id, data);
      setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update task');
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
      await taskApi.delete(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete task');
      console.error('Error deleting task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskComplete = async (id: number) => {
    try {
      setError(null);
      const updatedTask = await taskApi.toggleComplete(id);
      setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to toggle task completion');
      console.error('Error toggling task completion:', err);
      throw err;
    }
  };

  const createCategory = async (data: { name: string; color?: string }) => {
    try {
      setError(null);
      const newCategory = await categoryApi.create(data);
      setCategories((prev) => [...prev, newCategory]);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create category');
      console.error('Error creating category:', err);
      throw err;
    }
  };

  const updateCategory = async (id: number, data: { name?: string; color?: string }) => {
    try {
      setError(null);
      const updatedCategory = await categoryApi.update(id, data);
      setCategories((prev) => prev.map((cat) => (cat.id === id ? updatedCategory : cat)));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update category');
      console.error('Error updating category:', err);
      throw err;
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      setError(null);
      await categoryApi.delete(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      await fetchTasks(); // Refresh tasks as their category may have changed
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete category');
      console.error('Error deleting category:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  useEffect(() => {
    fetchCategories();
  }, []);

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
