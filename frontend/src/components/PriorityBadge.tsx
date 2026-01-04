import React from 'react';
import { Priority } from '../types';

interface PriorityBadgeProps {
  priority: Priority;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getStyles = () => {
    switch (priority) {
      case Priority.HIGH:
        return 'bg-red-100 text-red-800 border-red-300';
      case Priority.MEDIUM:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case Priority.LOW:
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getLabel = () => {
    switch (priority) {
      case Priority.HIGH:
        return '高';
      case Priority.MEDIUM:
        return '中';
      case Priority.LOW:
        return '低';
      default:
        return priority;
    }
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full border ${getStyles()}`}
    >
      {getLabel()}
    </span>
  );
};

export default PriorityBadge;
