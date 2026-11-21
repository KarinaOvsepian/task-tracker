import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { PRIORITY, type Priority, type Task } from '../types/task';
import type { TaskFormData } from '../schemas/taskSchema';
import { taskRepository } from '../repositories/taskRepository';
import { useTaskContext } from '../hooks/useTaskContext';
import { useAuth } from '../hooks/useAuth';
import { TaskFormDialog } from '../components/TaskFormDialog';

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

export const TaskDetailsPage: React.FC = () => {
    const { taskId } = useParams<{ taskId: string }>();
    const navigate = useNavigate();

    const { tasks, updateTask, deleteTask } = useTaskContext();
    const { isAuthenticated } = useAuth();

    const [task, setTask] = useState<Task | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

    const numericId = Number(taskId);

    useEffect(() => {
        if (!taskId || Number.isNaN(numericId)) {
            setError('Некоректний ідентифікатор завдання');
            setIsLoading(false);
            return;
        }

        const controller = new AbortController();

        const loadTask = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const fetched = await taskRepository.getById(numericId, controller.signal);
                const existingInContext = tasks.find((t) => t.id === numericId);

                setTask({
                    ...fetched,
                    title: existingInContext?.title ?? fetched.title,
                    completed: existingInContext?.completed ?? fetched.completed,
                    description: existingInContext?.description ?? fetched.description,
                    category: existingInContext?.category ?? fetched.category,
                    priority: existingInContext?.priority ?? fetched.priority,
                    createdBy: existingInContext?.createdBy ?? fetched.createdBy,
                    createdAt: existingInContext?.createdAt ?? fetched.createdAt,
                });
            } catch (err) {
                if (err instanceof DOMException && err.name === 'AbortError') return;
                setError(
                    err instanceof Error ? err.message : 'Не вдалося завантажити деталі завдання'
                );
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        loadTask();

        return () => {
            controller.abort();
        };
    }, [taskId, numericId]);

    const handleEditClick = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        setIsEditOpen(true);
    };

    const handleEditSubmit = async (data: TaskFormData) => {
        if (!task) return;
        const updated = await updateTask(task.id, data);
        if (!updated) {
            throw new Error('Не вдалося оновити завдання');
        }
        setTask(updated);
    };

    const handleDeleteClick = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (!task) return;
        const ok = await deleteTask(task.id);
        if (ok) {
            navigate('/tasks');
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <Link
                    to="/tasks"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                    ← Назад до списку завдань
                </Link>
            </div>

            {isLoading && (
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 text-center text-sm text-slate-500 dark:text-slate-400">
                    Завантаження деталей завдання...
                </div>
            )}

            {!isLoading && error && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-rose-200 dark:border-rose-800 text-center space-y-3">
                    <p className="text-sm font-medium text-rose-600 dark:text-rose-400">{error}</p>
                    <Link
                        to="/tasks"
                        className="inline-block px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg"
                    >
                        Повернутися до завдань
                    </Link>
                </div>
            )}

            {!isLoading && !error && task && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-5">
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-4">
                        <div>
              <span className="text-xs font-semibold text-slate-400">
                Завдання #{task.id}
              </span>
                            <h1 className="text-xl font-bold text-slate-800 dark:text-white mt-1">
                                {task.title}
                            </h1>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleEditClick}
                                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors"
                            >
                                Редагувати
                            </button>

                            {isAuthenticated && (
                                <button
                                    type="button"
                                    onClick={handleDeleteClick}
                                    className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                >
                                    Видалити
                                </button>
                            )}
                        </div>
                    </div>

                    <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase mb-1">
              Опис
            </span>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                            {task.description || 'Опис відсутній'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700">
                            <span className="block text-xs text-slate-400 mb-1">Категорія</span>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {task.category}
              </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700">
                            <span className="block text-xs text-slate-400 mb-1">Пріоритет</span>
                            <span
                                className={`inline-block text-xs px-2.5 py-0.5 rounded-md font-semibold ${
                                    PRIORITY_BADGES[task.priority]
                                }`}
                            >
                {PRIORITY_LABELS[task.priority]}
              </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700">
                            <span className="block text-xs text-slate-400 mb-1">Стан виконання</span>
                            <span
                                className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${
                                    task.completed
                                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                                }`}
                            >
                {task.completed ? 'Виконано' : 'У процесі'}
              </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700">
              <span className="block text-xs text-slate-400 mb-0.5">
                Створив (client-owned metadata)
              </span>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                {task.createdBy}
              </span>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700">
              <span className="block text-xs text-slate-400 mb-0.5">
                Дата створення (client-owned metadata)
              </span>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                {new Date(task.createdAt).toLocaleString('uk-UA')}
              </span>
                        </div>
                    </div>

                    <TaskFormDialog
                        open={isEditOpen}
                        mode="edit"
                        task={task}
                        onClose={() => setIsEditOpen(false)}
                        onSubmit={handleEditSubmit}
                    />
                </div>
            )}
        </div>
    );
};