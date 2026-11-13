import React, { useState } from 'react';
import { PRIORITY, type Priority, type Task } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';

interface TaskItemProps {
    task: Task;
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

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
    const { toggleTask, deleteTask, setEditingTask, setSelectedTask } = useTaskContext();
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [isBusy, setIsBusy] = useState(false);

    const handleToggle = async () => {
        setIsBusy(true);
        await toggleTask(task.id);
        setIsBusy(false);
    };

    const handleConfirmDelete = async () => {
        setIsBusy(true);
        await deleteTask(task.id);
        setIsBusy(false);
    };

    return (
        <div
            className={`p-4 rounded-xl border transition-all ${
                task.completed
                    ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-75'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'
            }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        disabled={isBusy}
                        onChange={handleToggle}
                        className="mt-1 h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div>
                        <button
                            type="button"
                            onClick={() => setSelectedTask(task)}
                            className={`text-left font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
                                task.completed
                                    ? 'line-through text-slate-400 dark:text-slate-500'
                                    : 'text-slate-800 dark:text-slate-100'
                            }`}
                            title="Натисніть, щоб переглянути деталі"
                        >
                            {task.title}
                        </button>

                        {task.description && (
                            <p
                                className={`text-sm mt-1 ${
                                    task.completed ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-300'
                                }`}
                            >
                                {task.description}
                            </p>
                        )}

                        <div className="flex items-center gap-2 mt-3">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                {task.category}
              </span>
                            <span
                                className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${
                                    PRIORITY_COLORS[task.priority]
                                }`}
                            >
                {PRIORITY_LABELS[task.priority]}
              </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    <button
                        type="button"
                        onClick={() => setSelectedTask(task)}
                        disabled={isBusy}
                        className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg transition-colors text-sm hover:bg-indigo-50 dark:hover:bg-slate-700"
                        title="Деталі завдання"
                    >
                        Деталі
                    </button>
                    <button
                        type="button"
                        onClick={() => setEditingTask(task)}
                        disabled={isBusy}
                        className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg transition-colors text-sm hover:bg-indigo-50 dark:hover:bg-slate-700"
                        title="Редагувати"
                    >
                        Редагувати
                    </button>
                    <button
                        type="button"
                        onClick={() => setConfirmingDelete(true)}
                        disabled={isBusy}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors text-sm hover:bg-rose-50 dark:hover:bg-slate-700"
                        title="Видалити"
                    >
                        Видалити
                    </button>
                </div>
            </div>

            {confirmingDelete && (
                <div className="mt-3 pt-3 border-t border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-rose-50/70 dark:bg-rose-950/30 p-2.5 rounded-lg">
          <span className="text-xs font-medium text-rose-700 dark:text-rose-300">
            Ви впевнені, що хочете видалити це завдання?
          </span>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleConfirmDelete}
                            disabled={isBusy}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-md transition-colors disabled:opacity-50"
                        >
                            {isBusy ? 'Видалення...' : 'Так, видалити'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setConfirmingDelete(false)}
                            disabled={isBusy}
                            className="px-2.5 py-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 text-xs font-semibold rounded-md transition-colors"
                        >
                            Скасувати
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};