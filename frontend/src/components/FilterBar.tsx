import React from 'react';
import { Priority } from '../types';
import { useTaskContext } from '../context/TaskContext';
import { Filter, X } from 'lucide-react';

const FilterBar: React.FC = () => {
  const { filters, setFilters, categories } = useTaskContext();

  const handleClearFilters = () => {
    setFilters({
      sortBy: 'createdAt',
      order: 'desc',
    });
  };

  const hasActiveFilters = filters.completed !== undefined ||
    filters.priority ||
    filters.categoryId ||
    filters.tag;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4 mb-4 sm:mb-6">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Filter size={18} className="text-gray-600 sm:w-5 sm:h-5" />
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">フィルター</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="ml-auto text-xs sm:text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <X size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">すべて</span>クリア
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            ステータス
          </label>
          <select
            value={filters.completed === undefined ? 'all' : filters.completed ? 'completed' : 'active'}
            onChange={(e) => {
              const value = e.target.value;
              setFilters({
                ...filters,
                completed: value === 'all' ? undefined : value === 'completed',
              });
            }}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
          >
            <option value="all">すべて</option>
            <option value="active">未完了</option>
            <option value="completed">完了</option>
          </select>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            優先度
          </label>
          <select
            value={filters.priority || ''}
            onChange={(e) => setFilters({ ...filters, priority: (e.target.value as Priority) || '' })}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
          >
            <option value="">すべて</option>
            <option value={Priority.HIGH}>高</option>
            <option value={Priority.MEDIUM}>中</option>
            <option value={Priority.LOW}>低</option>
          </select>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            カテゴリ
          </label>
          <select
            value={filters.categoryId || ''}
            onChange={(e) => setFilters({
              ...filters,
              categoryId: e.target.value ? Number(e.target.value) : '',
            })}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
          >
            <option value="">すべて</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            並び替え
          </label>
          <div className="flex gap-2">
            <select
              value={filters.sortBy || 'createdAt'}
              onChange={(e) => setFilters({
                ...filters,
                sortBy: e.target.value as any,
              })}
              className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
            >
              <option value="createdAt">作成日</option>
              <option value="dueDate">期限</option>
              <option value="priority">優先度</option>
            </select>
            <button
              onClick={() => setFilters({
                ...filters,
                order: filters.order === 'asc' ? 'desc' : 'asc',
              })}
              className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm min-w-[2.5rem]"
              title={filters.order === 'asc' ? '昇順' : '降順'}
            >
              {filters.order === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 sm:mt-4">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          タグで検索
        </label>
        <input
          type="text"
          value={filters.tag || ''}
          onChange={(e) => setFilters({ ...filters, tag: e.target.value || undefined })}
          placeholder="タグ名を入力"
          className="w-full sm:w-64 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
        />
      </div>
    </div>
  );
};

export default FilterBar;
