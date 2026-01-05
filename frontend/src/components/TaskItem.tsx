import React from 'react';
import type { Task } from '../types';
import PriorityBadge from './PriorityBadge';
import { formatDate, isOverdue, isDueToday } from '../utils/dateHelpers';
import { Pencil, Trash2, Calendar, Tag } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const getDueDateStyle = () => {
    if (!task.dueDate) return 'text-gray-400';
    if (isOverdue(task.dueDate)) return 'text-red-600 font-semibold';
    if (isDueToday(task.dueDate)) return 'text-orange-600 font-semibold';
    return 'text-gray-600';
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-3 sm:p-4 hover:shadow-md transition-shadow ${
      task.isCompleted ? 'opacity-60' : ''
    }`}>
      <div className="flex items-start gap-2 sm:gap-3">
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={() => onToggleComplete(task.id)}
          className="mt-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <h3 className={`text-sm sm:text-base lg:text-lg font-semibold ${
              task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
            }`}>
              {task.title}
            </h3>
            <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
              <button
                onClick={() => onEdit(task)}
                className="p-0.5 sm:p-1 text-gray-500 hover:text-blue-600 transition-colors"
                title="タスクを編集"
              >
                <Pencil size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-0.5 sm:p-1 text-gray-500 hover:text-red-600 transition-colors"
                title="タスクを削除"
              >
                <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>
          </div>

          {task.description && (
            <p className={`text-xs sm:text-sm mb-2 sm:mb-3 ${
              task.isCompleted ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
            <PriorityBadge priority={task.priority} />

            {task.category && (
              <span
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${task.category.color}20`,
                  color: task.category.color,
                  borderColor: task.category.color,
                  border: '1px solid',
                }}
              >
                {task.category.name}
              </span>
            )}

            {task.dueDate && (
              <span className={`flex items-center gap-1 ${getDueDateStyle()}`}>
                <Calendar size={14} />
                {formatDate(task.dueDate)}
              </span>
            )}

            {task.tags && task.tags.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap">
                <Tag size={14} className="text-gray-400" />
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
