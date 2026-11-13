import React, { useEffect, useState } from 'react';
import { PRIORITY, type Priority, type Task } from '../types/task';
import { taskRepository } from '../repositories/taskRepository';
import { useTaskContext } from '../hooks/useTaskContext';

const PRIORITY_LABELS: Record<Priority, string> = {
    [PRIORITY.LOW]: 'Низький (Low)',
    [PRIORITY.MEDIUM]: 'Середній (Medium)',
    [PRIORITY.HIGH]: 'Високий (High)',
};

const PRIORITY_BADGES: Record<Priority, string> = {
    [PRIORITY.LOW]: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200',
    [PRIORITY.MEDIUM]: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300',
    [PRIORITY.HIGH]: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300',
};

export const TaskDetailsModal: React.FC = () => {
    const { selectedTask, setSelectedTask } = useTaskContext();

    const [details, setDetails] = useState<Task | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState<number>(0);

    useEffect(() => {
        if (!selectedTask) {
            setDetails(null);
            setError(null);
            return;
        }

        const controller = new AbortController();

        const fetchDetails = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const fetchedTask = await taskRepository.getById(selectedTask.id, controller.signal);
                setDetails({
                    ...fetchedTask,
                    description: selectedTask.description || fetchedTask.description,
                    category: selectedTask.category || fetchedTask.category,
                    priority: selectedTask.priority || fetchedTask.priority,
                });
            } catch (err) {
                if (err instanceof DOMException && err.name === 'AbortError') {
                    return;
                }
                const message =
                    err instanceof Error ? err.message : 'Не вдалося завантажити деталі завдання';
                setError(message);
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        fetchDetails();

        return () => {
            controller.abort();
        };
    }, [selectedTask, retryCount]);

    if (!selectedTask) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
            onClick={() => setSelectedTask(null)}
        >
            <div
                className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl p-6 transition-colors"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                        Деталі завдання #{selectedTask.id}
                    </h2>
                    <button
                        type="button"
                        onClick={() => setSelectedTask(null)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-semibold px-2 py-1 rounded-lg"
                    >
                        ✕
                    </button>
                </div>

                {isLoading && (
                    <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                        Loading... Завантаження актуальних даних із сервера...
                    </div>
                )}

                {!isLoading && error && (
                    <div className="py-6 text-center space-y-3">
                        <p className="text-sm text-rose-600 dark:text-rose-400 font-medium">
                            Помилка завантаження: {error}
                        </p>
                        <button
                            type="button"
                            onClick={() => setRetryCount((prev) => prev + 1)}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                            Спробувати ще
                        </button>
                    </div>
                )}

                {!isLoading && !error && details && (
                    <div className="space-y-4 text-sm">
                        <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Назва
              </span>
                            <p className="text-base font-semibold text-slate-800 dark:text-slate-100">
                                {details.title}
                            </p>
                        </div>

                        <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Опис
              </span>
                            <p className="text-slate-600 dark:text-slate-300">
                                {details.description || 'Опис не вказано'}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-1">
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700">
                                <span className="block text-xs text-slate-400 mb-1">Категорія</span>
                                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {details.category}
                </span>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700">
                                <span className="block text-xs text-slate-400 mb-1">Пріоритет</span>
                                <span
                                    className={`inline-block text-xs px-2 py-0.5 rounded-md font-semibold ${
                                        PRIORITY_BADGES[details.priority]
                                    }`}
                                >
                  {PRIORITY_LABELS[details.priority]}
                </span>
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Статус виконання (completed)
              </span>
                            <span
                                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                    details.completed
                                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                                }`}
                            >
                {details.completed ? 'Виконано' : 'В процесі'}
              </span>
                        </div>
                    </div>
                )}

                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={() => setSelectedTask(null)}
                        className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        Закрити
                    </button>
                </div>
            </div>
        </div>
    );
};