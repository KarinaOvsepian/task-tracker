import React from 'react';
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
    const { toggleTask, requestDelete, undoDelete, setEditingTask } = useTaskContext();

    const isPending = task.isPendingDelete;

    return (
        <div
            className={`p-4 rounded-xl border transition-all ${
                isPending
                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 opacity-60'
                    : task.completed
                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-70'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'
            }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        disabled={isPending}
                        onChange={() => toggleTask(task.id)}
                        className="mt-1 h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div>
                        <div className="flex items-center gap-2">
                            <h3
                                className={`font-semibold text-slate-800 dark:text-slate-100 ${
                                    task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                                }`}
                            >
                                {task.title}
                            </h3>
                            {isPending && (
                                <span className="text-xs px-2 py-0.5 bg-amber-200 text-amber-900 rounded font-bold animate-pulse">
                  Буде видалено...
                </span>
                            )}
                        </div>

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

                <div className="flex items-center gap-1">
                    {isPending ? (
                        <button
                            onClick={() => undoDelete(task.id)}
                            className="text-xs font-semibold px-2.5 py-1 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                        >
                            Скасувати
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => setEditingTask(task)}
                                className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg transition-colors text-sm hover:bg-indigo-50 dark:hover:bg-slate-700"
                                title="Редагувати"
                            >
                                Редагувати
                            </button>
                            <button
                                onClick={() => requestDelete(task.id)}
                                className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors text-sm hover:bg-rose-50 dark:hover:bg-slate-700"
                                title="Видалити"
                            >
                                Видалити
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};