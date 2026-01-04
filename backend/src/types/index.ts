export enum Priority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export interface TaskAttributes {
  id?: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority: Priority;
  dueDate?: Date;
  categoryId?: number;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryAttributes {
  id?: number;
  name: string;
  color: string;
  createdAt?: Date;
  updatedAt?: Date;
}
