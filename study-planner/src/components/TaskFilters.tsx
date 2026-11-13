import React from 'react';
import {
    FILTER_STATUS,
    SORT_ORDER,
    type FilterStatus,
    type SortOrder,
} from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';

const FILTER_OPTIONS: { value: FilterStatus; label: string }[] = [
    { value: FILTER_STATUS.ALL, label: 'Всі' },
    { value: FILTER_STATUS.ACTIVE, label: 'Не виконані' },
    { value: FILTER_STATUS.COMPLETED, label: 'Виконані' },
];

export const TaskFilters: React.FC = () => {
    const { filter, setFilter, sortOrder, setSortOrder } = useTaskContext();

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
            <div className="flex gap-1">
                {FILTER_OPTIONS.map((option) => {
                    const isActive = filter === option.value;
                    return (
                        <button
                            key={option.value}
                            type="button"
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

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                    className="text-xs border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                    <option value={SORT_ORDER.NONE}>Сортування: За замовчуванням</option>
                    <option value={SORT_ORDER.HIGH_TO_LOW}>Спочатку високий пріоритет</option>
                    <option value={SORT_ORDER.LOW_TO_HIGH}>Спочатку низький пріоритет</option>
                </select>
            </div>
        </div>
    );
};