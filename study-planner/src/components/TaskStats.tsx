import React from 'react';

interface TaskStatsProps {
    total: number;
    completed: number;
    active: number;
}

export const TaskStats: React.FC<TaskStatsProps> = ({ total, completed, active }) => {
    return (
        <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-sm">
                <span className="block text-xs text-slate-500 uppercase font-bold">Усього</span>
                <span className="text-xl font-bold text-slate-800">{total}</span>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-center">
                <span className="block text-xs text-emerald-600 uppercase font-bold">Виконано</span>
                <span className="text-xl font-bold text-emerald-700">{completed}</span>
            </div>
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center">
                <span className="block text-xs text-amber-600 uppercase font-bold"> В процесі</span>
                <span className="text-xl font-bold text-amber-700">{active}</span>
            </div>
        </div>
    );
};