import React from 'react';
import { Link, useNavigate } from 'react-router';
import { PRIORITY, type Priority, type Task } from '../types/task';
import { useAuth } from '../hooks/useAuth';

interface TaskItemProps {
    task: Task;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

const PRIORITY_COLORS: Record<Priority, string> = {
    [PRIORITY.LOW]: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600',
    [PRIORITY.MEDIUM]: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    [PRIORITY.HIGH]: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
};

const PRIORITY_LABELS: Record<Priority, string> = {
    [PRIORITY.LOW]: 'Низький',
    [PRIORITY.MEDIUM]: 'Середній',
    [PRIORITY.HIGH]: 'Високий',
};

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleToggleClick = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        onToggle(task.id);
    };

    const handleDeleteClick = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        onDelete(task.id);
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-start justify-between gap-3 transition-colors">
            <div className="flex items-start gap-3 min-w-0">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={handleToggleClick}
                    aria-label={`Позначити "${task.title}"`}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />

                <div className="min-w-0">
                    <Link
                        to={`/tasks/${task.id}`}
                        className={`font-semibold text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block truncate ${
                            task.completed
                                ? 'line-through text-slate-400 dark:text-slate-500'
                                : 'text-slate-800 dark:text-slate-100'
                        }`}
                    >
                        {task.title}
                    </Link>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {task.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              {task.category}
            </span>
                        <span
                            className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                                PRIORITY_COLORS[task.priority]
                            }`}
                        >
              {PRIORITY_LABELS[task.priority]}
            </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
                <Link
                    to={`/tasks/${task.id}`}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                    Деталі
                </Link>

                {isAuthenticated && (
                    <button
                        type="button"
                        onClick={handleDeleteClick}
                        className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                        Видалити
                    </button>
                )}
            </div>
        </div>
    );
};