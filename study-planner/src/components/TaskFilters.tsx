import React from 'react';
import {
    FILTER_PRIORITY,
    FILTER_STATUS,
    SORT_ORDER,
    type FilterPriority,
    type FilterStatus,
    type SortOrder,
} from '../types/task';

interface TaskFiltersProps {
    status: FilterStatus;
    priority: FilterPriority;
    sortOrder: SortOrder;
    onStatusChange: (status: FilterStatus) => void;
    onPriorityChange: (priority: FilterPriority) => void;
    onSortChange: (sort: SortOrder) => void;
}

const STATUS_OPTIONS: { value: FilterStatus; label: string }[] = [
    { value: FILTER_STATUS.ALL, label: 'Всі' },
    { value: FILTER_STATUS.ACTIVE, label: 'Активні' },
    { value: FILTER_STATUS.COMPLETED, label: 'Виконані' },
];

export const TaskFilters: React.FC<TaskFiltersProps> = ({
                                                            status,
                                                            priority,
                                                            sortOrder,
                                                            onStatusChange,
                                                            onPriorityChange,
                                                            onSortChange,
                                                        }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6 bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
            <div className="flex gap-1">
                {STATUS_OPTIONS.map((option) => {
                    const isActive = status === option.value;
                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onStatusChange(option.value)}
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

            <div className="flex items-center gap-2 flex-wrap justify-end w-full sm:w-auto">
                <select
                    aria-label="Фільтр за пріоритетом"
                    value={priority}
                    onChange={(e) => onPriorityChange(e.target.value as FilterPriority)}
                    className="text-xs border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                    <option value={FILTER_PRIORITY.ALL}>Пріоритет: Усі</option>
                    <option value={FILTER_PRIORITY.HIGH}>Високий (High)</option>
                    <option value={FILTER_PRIORITY.MEDIUM}>Середній (Medium)</option>
                    <option value={FILTER_PRIORITY.LOW}>Низький (Low)</option>
                </select>

                <select
                    aria-label="Сортування за пріоритетом"
                    value={sortOrder}
                    onChange={(e) => onSortChange(e.target.value as SortOrder)}
                    className="text-xs border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                    <option value={SORT_ORDER.NONE}>Сортування: Без змін</option>
                    <option value={SORT_ORDER.HIGH_TO_LOW}>Спочатку високий</option>
                    <option value={SORT_ORDER.LOW_TO_HIGH}>Спочатку низький</option>
                </select>
            </div>
        </div>
    );
};