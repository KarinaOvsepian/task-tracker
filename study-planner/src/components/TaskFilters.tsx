import React from 'react';
import {
    FILTER_STATUS,
    type FilterStatus,
    SORT_ORDER,
    type SortOrder,
} from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';

const FILTER_OPTIONS: { value: FilterStatus; label: string }[] = [
    { value: FILTER_STATUS.ALL, label: 'Всі' },
    { value: FILTER_STATUS.ACTIVE, label: 'Не виконані' },
    { value: FILTER_STATUS.COMPLETED, label: 'Виконані' },
];

export const TaskFilters: React.FC = () => {
    const { filter, setFilter, sortOrder, setSortOrder, clearCompleted, resetTasks } = useTaskContext();

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
            <div className="flex gap-1">
                {FILTER_OPTIONS.map((option) => {
                    const isActive = filter === option.value;
                    return (
                        <button
                            key={option.value}
                            onClick={() => setFilter(option.value)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                isActive
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                    className="text-xs border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-2 py-1.5 focus:outline-none"
                >
                    <option value={SORT_ORDER.NONE}>Сортування: За замовчуванням</option>
                    <option value={SORT_ORDER.HIGH_TO_LOW}>Спочатку високий пріоритет</option>
                    <option value={SORT_ORDER.LOW_TO_HIGH}>Спочатку низький пріоритет</option>
                </select>

                <button
                    onClick={clearCompleted}
                    className="text-xs px-2.5 py-1.5 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors font-medium"
                    title="Видалити виконані завдання"
                >
                    Очистити виконані
                </button>

                <button
                    onClick={resetTasks}
                    className="text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors font-medium"
                    title="Скинути до початкового стану"
                >
                    Скинути
                </button>
            </div>
        </div>
    );
};