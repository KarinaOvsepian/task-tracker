import React from 'react';
import { useTaskContext } from '../hooks/useTaskContext';

export const Pagination: React.FC = () => {
    const { page, totalPages, totalTasks, isLoading, setPage } = useTaskContext();

    if (totalTasks === 0) return null;

    return (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
      <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
        Сторінка <strong className="text-slate-800 dark:text-white">{page}</strong> із{' '}
          <strong className="text-slate-800 dark:text-white">{totalPages}</strong> (усього:{' '}
          {totalTasks})
      </span>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page <= 1 || isLoading}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    ← Попередня
                </button>

                <button
                    type="button"
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page >= totalPages || isLoading}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    Наступна →
                </button>
            </div>
        </div>
    );
};