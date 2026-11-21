import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
    FILTER_PRIORITY,
    FILTER_STATUS,
    PRIORITY,
    SORT_ORDER,
    type FilterPriority,
    type FilterStatus,
    type Priority,
    type SortOrder,
} from '../types/task';
import type { TaskFormData } from '../schemas/taskSchema';
import { useTaskContext } from '../hooks/useTaskContext';
import { useAuth } from '../hooks/useAuth';
import { TaskStats } from '../components/TaskStats';
import { TaskFilters } from '../components/TaskFilters';
import { TaskList } from '../components/TaskList';
import { Pagination } from '../components/Pagination';
import { TaskFormDialog } from '../components/TaskFormDialog';

const PRIORITY_WEIGHTS: Record<Priority, number> = {
    [PRIORITY.HIGH]: 3,
    [PRIORITY.MEDIUM]: 2,
    [PRIORITY.LOW]: 1,
};

function parseStatus(value: string | null): FilterStatus {
    if (value === FILTER_STATUS.COMPLETED || value === FILTER_STATUS.ACTIVE) {
        return value;
    }
    return FILTER_STATUS.ALL;
}

function parsePriority(value: string | null): FilterPriority {
    if (
        value === FILTER_PRIORITY.LOW ||
        value === FILTER_PRIORITY.MEDIUM ||
        value === FILTER_PRIORITY.HIGH
    ) {
        return value;
    }
    return FILTER_PRIORITY.ALL;
}

function parseSort(value: string | null): SortOrder {
    if (value === SORT_ORDER.HIGH_TO_LOW || value === SORT_ORDER.LOW_TO_HIGH) {
        return value;
    }
    return SORT_ORDER.NONE;
}

export const TasksPage: React.FC = () => {
    const { tasks, isLoading, error, retryFetch, addTask, toggleTask, deleteTask } =
        useTaskContext();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const status = parseStatus(searchParams.get('status'));
    const priority = parsePriority(searchParams.get('priority'));
    const sortOrder = parseSort(searchParams.get('sort'));

    const updateQueryParam = (key: string, value: string, defaultValue: string) => {
        const next = new URLSearchParams(searchParams);
        if (value === defaultValue) {
            next.delete(key);
        } else {
            next.set(key, value);
        }
        setSearchParams(next, { replace: true });
    };

    const handleOpenCreate = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        setIsCreateOpen(true);
    };

    const handleCreateSubmit = async (data: TaskFormData) => {
        const created = await addTask(data);
        if (!created) {
            throw new Error('Не вдалося створити завдання');
        }
    };

    const filteredTasks = tasks.filter((task) => {
        if (status === FILTER_STATUS.COMPLETED && !task.completed) return false;
        if (status === FILTER_STATUS.ACTIVE && task.completed) return false;
        if (priority !== FILTER_PRIORITY.ALL && task.priority !== priority) return false;
        return true;
    });

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
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                        Навчальні завдання
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {isAuthenticated
                            ? 'Ви авторизовані — доступне створення, редагування та видалення'
                            : 'Режим гостя — увійдіть, щоб додавати або змінювати завдання'}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleOpenCreate}
                    title={isAuthenticated ? 'Створити нове завдання' : 'Увійдіть, щоб створити завдання'}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-xs transition-colors"
                >
                    + Нове завдання
                </button>
            </div>

            <TaskStats />

            <TaskFilters
                status={status}
                priority={priority}
                sortOrder={sortOrder}
                onStatusChange={(val) => updateQueryParam('status', val, FILTER_STATUS.ALL)}
                onPriorityChange={(val) => updateQueryParam('priority', val, FILTER_PRIORITY.ALL)}
                onSortChange={(val) => updateQueryParam('sort', val, SORT_ORDER.NONE)}
            />

            {isLoading && (
                <div className="text-center py-10 text-sm text-slate-500 dark:text-slate-400">
                    Завантаження завдань...
                </div>
            )}

            {!isLoading && error && (
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-rose-200 dark:border-rose-800 text-center space-y-3">
                    <p className="text-sm text-rose-600 dark:text-rose-400 font-medium">{error}</p>
                    <button
                        type="button"
                        onClick={retryFetch}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg"
                    >
                        Спробувати ще
                    </button>
                </div>
            )}

            {!isLoading && !error && (
                <>
                    <TaskList
                        tasks={sortedTasks}
                        totalTasksCount={tasks.length}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                    />
                    <Pagination />
                </>
            )}

            <TaskFormDialog
                open={isCreateOpen}
                mode="create"
                onClose={() => setIsCreateOpen(false)}
                onSubmit={handleCreateSubmit}
            />
        </div>
    );
};