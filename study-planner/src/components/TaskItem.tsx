import React from 'react';
import { PRIORITY, type Priority, type Task } from '../types/task';

interface TaskItemProps {
    task: Task;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
    const PRIORITY_COLORS: Record<Priority, string> = {
        [PRIORITY.LOW]: 'bg-slate-100 text-slate-600 border-slate-200',
        [PRIORITY.MEDIUM]: 'bg-amber-100 text-amber-800 border-amber-200',
        [PRIORITY.HIGH]: 'bg-rose-100 text-rose-800 border-rose-200',
    };

    const PRIORITY_LABELS: Record<Priority, string> = {
        [PRIORITY.LOW]: 'Низький',
        [PRIORITY.MEDIUM]: 'Середній',
        [PRIORITY.HIGH]: 'Високий',
    };

    return (
        <div
            className={`p-4 rounded-xl border transition-all ${
                task.completed
                    ? 'bg-slate-50 border-slate-200 opacity-70'
                    : 'bg-white border-slate-200 shadow-sm'
            }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggle(task.id)}
                        className="mt-1 h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <div>
                        <h3
                            className={`font-semibold text-slate-800 ${
                                task.completed ? 'line-through text-slate-400' : ''
                            }`}
                        >
                            {task.title}
                        </h3>
                        {task.description && (
                            <p
                                className={`text-sm mt-1 ${
                                    task.completed ? 'text-slate-400' : 'text-slate-600'
                                }`}
                            >
                                {task.description}
                            </p>
                        )}
                        <div className="flex items-center gap-2 mt-3">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                 {task.category}
              </span>
                            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${PRIORITY_COLORS[task.priority]}`}>
                                {PRIORITY_LABELS[task.priority]}
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => onDelete(task.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors text-sm hover:bg-rose-50"
                    title="Видалити завдання"
                >
                    х
                </button>
            </div>
        </div>
    );
};