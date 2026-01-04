export enum Priority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export interface Category {
  id: number;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority: Priority;
  dueDate?: string;
  categoryId?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

export interface TaskFilters {
  completed?: boolean;
  priority?: Priority | '';
  categoryId?: number | '';
  tag?: string;
  sortBy?: 'createdAt' | 'dueDate' | 'priority';
  order?: 'asc' | 'desc';
}

export interface TaskFormData {
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
  categoryId?: number;
  tags?: string[];
}
