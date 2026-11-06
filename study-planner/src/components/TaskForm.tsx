import React, { useState, useEffect } from 'react';
import { PRIORITY, type Priority } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';

export const TaskForm: React.FC = () => {
    const { addTask, updateTask, editingTask, setEditingTask } = useTaskContext();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Загальне');
    const [priority, setPriority] = useState<Priority>(PRIORITY.MEDIUM);
    const [error, setError] = useState('');

    useEffect(() => {
        if (editingTask) {
            setTitle(editingTask.title);
            setDescription(editingTask.description);
            setCategory(editingTask.category);
            setPriority(editingTask.priority);
            setError('');
        } else {
            resetForm();
        }
    }, [editingTask]);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setCategory('Загальне');
        setPriority(PRIORITY.MEDIUM);
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Назва завдання є обовʼязковою!');
            return;
        }

        if (editingTask) {
            updateTask(editingTask.id, {
                title: title.trim(),
                description: description.trim(),
                category: category.trim() || 'Загальне',
                priority,
            });
        } else {
            addTask({
                title: title.trim(),
                description: description.trim(),
                category: category.trim() || 'Загальне',
                priority,
            });
            resetForm();
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6 space-y-4 transition-colors"
        >
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                    {editingTask ? 'Редагувати завдання' : 'Додати нове завдання'}
                </h2>
                {editingTask && (
                    <button
                        type="button"
                        onClick={() => setEditingTask(null)}
                        className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline"
                    >
                        Скасувати редагування
                    </button>
                )}
            </div>

            {error && (
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-sm rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Назва *
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Введіть назву завдання"
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Категорія
                    </label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Наприклад: React, Математика"
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Опис
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Короткий опис..."
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="w-1/2">
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Пріоритет
                    </label>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as Priority)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                    >
                        <option value={PRIORITY.LOW}>Низький (Low)</option>
                        <option value={PRIORITY.MEDIUM}>Середній (Medium)</option>
                        <option value={PRIORITY.HIGH}>Високий (High)</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className={`mt-5 w-1/2 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm ${
                        editingTask
                            ? 'bg-amber-600 hover:bg-amber-700'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                >
                    {editingTask ? 'Зберегти зміни' : '+ Додати завдання'}
                </button>
            </div>
        </form>
    );
};