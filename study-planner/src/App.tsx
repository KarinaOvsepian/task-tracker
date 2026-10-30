import { useState } from 'react';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskStats } from './components/TaskStats';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { initialTasks } from './data/initialTasks';
import type {FilterStatus, SortOrder, Task} from './types/task';

export function App() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [filter, setFilter] = useState<FilterStatus>('all');
    const [sortOrder, setSortOrder] = useState<SortOrder>('none');

    const handleAddTask = (newTaskData: Omit<Task, 'id' | 'completed'>) => {
        const newTask: Task = {
            ...newTaskData,
            id: Date.now(),
            completed: false,
        };
        setTasks((prev) => [newTask, ...prev]);
    };

    const handleToggleTask = (id: number) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const handleDeleteTask = (id: number) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    };

    const totalCount = tasks.length;
    const completedCount = tasks.filter((t) => t.completed).length;
    const activeCount = totalCount - completedCount;

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'completed') return task.completed;
        if (filter === 'active') return !task.completed;
        return true;
    });

    const priorityWeights = { high: 3, medium: 2, low: 1 };

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sortOrder === 'high-to-low') {
            return priorityWeights[b.priority] - priorityWeights[a.priority];
        }
        if (sortOrder === 'low-to-high') {
            return priorityWeights[a.priority] - priorityWeights[b.priority];
        }
        return 0;
    });

    return (
        <div className="min-h-screen bg-slate-100 py-10 px-4 font-sans">
            <div className="max-w-xl mx-auto">
                <Header />
                <TaskForm onAddTask={handleAddTask} />
                <TaskStats
                    total={totalCount}
                    completed={completedCount}
                    active={activeCount}
                />
                <TaskFilters
                    currentFilter={filter}
                    onFilterChange={setFilter}
                    currentSort={sortOrder}
                    onSortChange={setSortOrder}
                />
                <TaskList
                    tasks={sortedTasks}
                    totalTasksCount={totalCount}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                />
            </div>
        </div>
    );
}

export default App;