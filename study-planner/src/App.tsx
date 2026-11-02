import { useState } from 'react';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskStats } from './components/TaskStats';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { initialTasks } from './data/initialTasks';
import {
    FILTER_STATUS,
    type FilterStatus,
    PRIORITY,
    type Priority,
    SORT_ORDER,
    type SortOrder,
    type Task,
} from './types/task';

const PRIORITY_WEIGHTS: Record<Priority, number> = {
    [PRIORITY.HIGH]: 3,
    [PRIORITY.MEDIUM]: 2,
    [PRIORITY.LOW]: 1,
};

export function App() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);

    // Початковий стан через константи
    const [filter, setFilter] = useState<FilterStatus>(FILTER_STATUS.ALL);
    const [sortOrder, setSortOrder] = useState<SortOrder>(SORT_ORDER.NONE);

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

    // Перевірка фільтра через FILTER_STATUS
    const filteredTasks = tasks.filter((task) => {
        if (filter === FILTER_STATUS.COMPLETED) return task.completed;
        if (filter === FILTER_STATUS.ACTIVE) return !task.completed;
        return true;
    });

    // Перевірка сортування через SORT_ORDER
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sortOrder === SORT_ORDER.HIGH_TO_LOW) {
            return PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority];
        }
        if (sortOrder === SORT_ORDER.LOW_TO_HIGH) {
            return PRIORITY_WEIGHTS[a.priority] - PRIORITY_WEIGHTS[b.priority];
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