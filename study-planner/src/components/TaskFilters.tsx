import React from 'react';
import type {FilterStatus, SortOrder} from '../types/task';

interface TaskFiltersProps {
    currentFilter: FilterStatus;
    onFilterChange: (filter: FilterStatus) => void;
    currentSort: SortOrder;
    onSortChange: (sort: SortOrder) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
                                                            currentFilter,
                                                            onFilterChange,
                                                            currentSort,
                                                            onSortChange,
                                                        }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            {/* Фільтрація */}
            <div className="flex gap-1">
                <button
                    onClick={() => onFilterChange('all')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        currentFilter === 'all'
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    Всі
                </button>
                <button
                    onClick={() => onFilterChange('active')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        currentFilter === 'active'
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    Не виконані
                </button>
                <button
                    onClick={() => onFilterChange('completed')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        currentFilter === 'completed'
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    Виконані
                </button>
            </div>

            {/* Додаткове завдання: Сортування за пріоритетом */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                    Сортування:
                </label>
                <select
                    value={currentSort}
                    onChange={(e) => onSortChange(e.target.value as SortOrder)}
                    className="text-xs border border-slate-300 rounded-lg px-2 py-1 bg-slate-50 focus:outline-none"
                >
                    <option value="none">За замовчуванням</option>
                    <option value="high-to-low">Спочатку високий пріоритет</option>
                    <option value="low-to-high">Спочатку низький пріоритет</option>
                </select>
            </div>
        </div>
    );
};