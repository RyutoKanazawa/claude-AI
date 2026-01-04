import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { Pencil, Trash2, Plus, X, Check } from 'lucide-react';

const CategoryManager: React.FC = () => {
  const { categories, createCategory, updateCategory, deleteCategory } = useTaskContext();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', color: '#3B82F6' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      if (editingId) {
        await updateCategory(editingId, formData);
        setEditingId(null);
      } else {
        await createCategory(formData);
        setIsAdding(false);
      }
      setFormData({ name: '', color: '#3B82F6' });
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleEdit = (id: number, name: string, color: string) => {
    setEditingId(id);
    setFormData({ name, color });
    setIsAdding(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('このカテゴリを削除しますか？このカテゴリのタスクはカテゴリなしになります。')) {
      try {
        await deleteCategory(id);
      } catch (error) {
        console.error('カテゴリの削除に失敗しました:', error);
      }
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', color: '#3B82F6' });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">カテゴリ</h3>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
            title="カテゴリを追加"
          >
            <Plus size={20} />
          </button>
        )}
      </div>

      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.id}>
            {editingId === category.id ? (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="flex-1 flex gap-2">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="カテゴリ名"
                    autoFocus
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="p-2 text-green-600 hover:text-green-800 transition-colors"
                  title="保存"
                >
                  <Check size={20} />
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="キャンセル"
                >
                  <X size={20} />
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 group">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(category.id, category.name, category.color)}
                    className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                    title="編集"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                    title="削除"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {isAdding && (
          <form onSubmit={handleSubmit} className="flex gap-2 pt-2">
            <div className="flex-1 flex gap-2">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Category name"
                autoFocus
                required
              />
            </div>
            <button
              type="submit"
              className="p-2 text-green-600 hover:text-green-800 transition-colors"
              title="Add"
            >
              <Check size={20} />
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Cancel"
            >
              <X size={20} />
            </button>
          </form>
        )}

        {categories.length === 0 && !isAdding && (
          <p className="text-sm text-gray-500 text-center py-2">
            カテゴリがありません。+をクリックして追加してください。
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;
