import React, { useState } from 'react';
import type { Task } from '../types';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { useTaskContext } from '../context/TaskContext';
import { Loader2 } from 'lucide-react';

const TaskList: React.FC = () => {
  const { tasks, loading, deleteTask, toggleTaskComplete, fetchTasks } = useTaskContext();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('このタスクを削除してもよろしいですか？')) {
      try {
        await deleteTask(id);
      } catch (error) {
        console.error('タスクの削除に失敗しました:', error);
      }
    }
  };

  const handleToggleComplete = async (id: number) => {
    try {
      await toggleTaskComplete(id);
    } catch (error) {
      console.error('タスクの完了状態の切り替えに失敗しました:', error);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleFormSuccess = async () => {
    await fetchTasks();
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">タスクがありません。最初のタスクを作成してください！</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleComplete={handleToggleComplete}
          />
        ))}
      </div>

      {isFormOpen && (
        <TaskForm
          task={editingTask || undefined}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </>
  );
};

export default TaskList;
