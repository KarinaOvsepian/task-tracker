import React, { useState } from 'react';
import { PRIORITY, type Priority, type Task } from '../types/task';

interface TaskFormProps {
    onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Загальне');
    const [priority, setPriority] = useState<Priority>(PRIORITY.MEDIUM);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Назва завдання є обовʼязковою!');
            return;
        }

        onAddTask({
            title: title.trim(),
            description: description.trim(),
            category: category.trim() || 'Загальне',
            priority,
        });

        setTitle('');
        setDescription('');
        setCategory('Загальне');
        setPriority(PRIORITY.MEDIUM);
        setError('');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 mb-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-700">Додати нове завдання</h2>

            {error && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Назва *</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Введіть назву завдання"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Категорія</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Наприклад: React, Математика"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Опис</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Короткий опис..."
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="w-1/2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Пріоритет</label>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as Priority)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                    >
                        <option value={PRIORITY.LOW}>Низький (Low)</option>
                        <option value={PRIORITY.MEDIUM}>Середній (Medium)</option>
                        <option value={PRIORITY.HIGH}>Високий (High)</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="mt-5 w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                    + Додати завдання
                </button>
            </div>
        </form>
    );
};