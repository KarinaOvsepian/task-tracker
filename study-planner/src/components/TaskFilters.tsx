import React from 'react';
import {
    FILTER_STATUS,
    type FilterStatus,
    SORT_ORDER,
    type SortOrder,
} from '../types/task';

interface TaskFiltersProps {
    currentFilter: FilterStatus;
    onFilterChange: (filter: FilterStatus) => void;
    currentSort: SortOrder;
    onSortChange: (sort: SortOrder) => void;
}

const FILTER_OPTIONS: { value: FilterStatus; label: string }[] = [
    { value: FILTER_STATUS.ALL, label: 'Всі' },
    { value: FILTER_STATUS.ACTIVE, label: 'Не виконані' },
    { value: FILTER_STATUS.COMPLETED, label: 'Виконані' },
];

export const TaskFilters: React.FC<TaskFiltersProps> = ({
                                                            currentFilter,
                                                            onFilterChange,
                                                            currentSort,
                                                            onSortChange,
                                                        }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex gap-1">
                {FILTER_OPTIONS.map((option) => {
                    const isActive = currentFilter === option.value;

                    return (
                        <button
                            key={option.value}
                            onClick={() => onFilterChange(option.value)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                isActive
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                    Сортування:
                </label>
                <select
                    value={currentSort}
                    onChange={(e) => onSortChange(e.target.value as SortOrder)}
                    className="text-xs border border-slate-300 rounded-lg px-2 py-1 bg-slate-50 focus:outline-none"
                >
                    <option value={SORT_ORDER.NONE}>За замовчуванням</option>
                    <option value={SORT_ORDER.HIGH_TO_LOW}>
                        Спочатку високий пріоритет
                    </option>
                    <option value={SORT_ORDER.LOW_TO_HIGH}>
                        Спочатку низький пріоритет
                    </option>
                </select>
            </div>
        </div>
    );
};