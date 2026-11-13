import React from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import { TaskItem } from './TaskItem';
import { FILTER_STATUS, PRIORITY, SORT_ORDER } from '../types/task';

const PRIORITY_WEIGHTS = {
    [PRIORITY.HIGH]: 3,
    [PRIORITY.MEDIUM]: 2,
    [PRIORITY.LOW]: 1,
};

export const TaskList: React.FC = () => {
    const { tasks, filter, sortOrder, isLoading, error, retryFetch } = useTaskContext();

    if (isLoading) {
        return (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent mb-2" />
                <p className="text-slate-600 dark:text-slate-300 font-medium text-sm">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-800 p-6 space-y-3">
                <p className="text-rose-700 dark:text-rose-300 font-semibold text-sm">
                    Помилка завантаження.
                </p>
                <p className="text-rose-600 dark:text-rose-400 text-xs">{error}</p>
                <button
                    type="button"
                    onClick={retryFetch}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
                >
                    Спробувати ще
                </button>
            </div>
        );
    }

    const filteredTasks = tasks.filter((task) => {
        if (filter === FILTER_STATUS.COMPLETED) return task.completed;
        if (filter === FILTER_STATUS.ACTIVE) return !task.completed;
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

    if (sortedTasks.length === 0) {
        return (
            <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-6">
                <p className="text-slate-500 dark:text-slate-400 font-medium">Завдань не знайдено.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {sortedTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
            ))}
        </div>
    );
};