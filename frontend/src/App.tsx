import { useState } from 'react';
import { TaskProvider } from './context/TaskContext';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import CategoryManager from './components/CategoryManager';
import TaskForm from './components/TaskForm';
import { Plus, ListTodo } from 'lucide-react';

function App() {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  return (
    <TaskProvider>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ListTodo className="text-blue-600" size={32} />
                <h1 className="text-3xl font-bold text-gray-900">TODOアプリ</h1>
              </div>
              <button
                onClick={() => setIsTaskFormOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
              >
                <Plus size={20} />
                タスクを追加
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <aside className="lg:col-span-1">
              <CategoryManager />
            </aside>

            <section className="lg:col-span-3">
              <FilterBar />
              <TaskList />
            </section>
          </div>
        </main>

        {isTaskFormOpen && (
          <TaskForm
            onClose={() => setIsTaskFormOpen(false)}
            onSuccess={() => {}}
          />
        )}
      </div>
    </TaskProvider>
  );
}

export default App;
