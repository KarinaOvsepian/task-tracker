import React from 'react';
import { useTaskContext } from '../hooks/useTaskContext';

export const TaskStats: React.FC = () => {
    const { tasks } = useTaskContext();

    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const active = total - completed;

    return (
        <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-center shadow-sm">
                <span className="block text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Усього</span>
                <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{total}</span>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
                <span className="block text-xs text-emerald-600 dark:text-emerald-400 uppercase font-bold">Виконано</span>
                <span className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{completed}</span>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-800 text-center">
                <span className="block text-xs text-amber-600 dark:text-amber-400 uppercase font-bold">В процесі</span>
                <span className="text-xl font-bold text-amber-700 dark:text-amber-300">{active}</span>
            </div>
        </div>
    );
};