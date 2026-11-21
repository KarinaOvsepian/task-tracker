import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, type TaskFormData } from '../schemas/taskSchema';
import { PRIORITY, type Task } from '../types/task';

export type TaskFormDialogProps = {
    open: boolean;
    mode: 'create' | 'edit';
    task?: Task;
    onClose: () => void;
    onSubmit: (data: TaskFormData) => Promise<void>;
};

export const TaskFormDialog: React.FC<TaskFormDialogProps> = ({
                                                                  open,
                                                                  mode,
                                                                  task,
                                                                  onClose,
                                                                  onSubmit,
                                                              }) => {
    const [isSuccess, setIsSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const titleInputRef = useRef<HTMLInputElement | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: '',
            description: '',
            category: 'Загальне',
            priority: PRIORITY.MEDIUM,
        },
    });

    useEffect(() => {
        if (!open) return;

        setIsSuccess(false);
        setSubmitError(null);

        if (mode === 'edit' && task) {
            reset({
                title: task.title,
                description: task.description,
                category: task.category,
                priority: task.priority,
            });
        } else {
            reset({
                title: '',
                description: '',
                category: 'Загальне',
                priority: PRIORITY.MEDIUM,
            });
        }

        const focusTimer = setTimeout(() => {
            titleInputRef.current?.focus();
        }, 0);

        return () => clearTimeout(focusTimer);
    }, [open, mode, task, reset]);

    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isSubmitting) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, isSubmitting, onClose]);

    if (!open) return null;

    const { ref: registerTitleRef, ...titleFieldProps } = register('title');

    const handleFormSubmit = async (data: TaskFormData) => {
        setSubmitError(null);
        try {
            await onSubmit(data);
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                onClose();
            }, 450);
        } catch (err) {
            setSubmitError(
                err instanceof Error ? err.message : 'Не вдалося зберегти завдання'
            );
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
            onClick={() => {
                if (!isSubmitting) onClose();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="task-dialog-title"
                className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl p-6 transition-colors"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">
                    <h2
                        id="task-dialog-title"
                        className="text-lg font-bold text-slate-800 dark:text-slate-100"
                    >
                        {mode === 'create' ? 'Нове завдання' : 'Редагувати завдання'}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        aria-label="Закрити діалог"
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-semibold px-2 py-1 rounded-lg disabled:opacity-50"
                    >
                        ✕
                    </button>
                </div>

                {submitError && (
                    <div className="mb-4 p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-sm rounded-lg">
                        {submitError}
                    </div>
                )}

                {isSuccess && (
                    <div className="mb-4 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm rounded-lg">
                        + {mode === 'create' ? 'Завдання створено!' : 'Зміни збережено!'}
                    </div>
                )}

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div>
                        <label
                            htmlFor="task-title"
                            className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1"
                        >
                            Назва *
                        </label>
                        <input
                            id="task-title"
                            type="text"
                            disabled={isSubmitting}
                            placeholder="Наприклад: Підготувати лабораторну №11"
                            ref={(el) => {
                                registerTitleRef(el);
                                titleInputRef.current = el;
                            }}
                            {...titleFieldProps}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-60"
                        />
                        {errors.title && (
                            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="task-description"
                            className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1"
                        >
                            Опис
                        </label>
                        <textarea
                            id="task-description"
                            rows={3}
                            disabled={isSubmitting}
                            placeholder="Деталі виконання завдання..."
                            {...register('description')}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none disabled:opacity-60"
                        />
                        {errors.description && (
                            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="task-category"
                                className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1"
                            >
                                Категорія *
                            </label>
                            <input
                                id="task-category"
                                type="text"
                                disabled={isSubmitting}
                                placeholder="React, TypeScript..."
                                {...register('category')}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-60"
                            />
                            {errors.category && (
                                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                                    {errors.category.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="task-priority"
                                className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1"
                            >
                                Пріоритет
                            </label>
                            <select
                                id="task-priority"
                                disabled={isSubmitting}
                                {...register('priority')}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white disabled:opacity-60"
                            >
                                <option value={PRIORITY.LOW}>Низький (Low)</option>
                                <option value={PRIORITY.MEDIUM}>Середній (Medium)</option>
                                <option value={PRIORITY.HIGH}>Високий (High)</option>
                            </select>
                            {errors.priority && (
                                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                                    {errors.priority.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                        >
                            Скасувати
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                                mode === 'edit'
                                    ? 'bg-amber-600 hover:bg-amber-700'
                                    : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                        >
                            {isSubmitting
                                ? 'Збереження...'
                                : mode === 'create'
                                    ? 'Створити завдання'
                                    : 'Зберегти зміни'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};