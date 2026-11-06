import React from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import { TaskItem } from './TaskItem';
import { FILTER_STATUS, PRIORITY, SORT_ORDER } from '../types/task';

const PRIORITY_WEIGHTS = {
    [PRIORITY.HIGH]: 3,
    [PRIORITY.MEDIUM]: 2,
    [PRIORITY.LOW]: 1,
};

export const TaskList: React.FC = () => {
    const { tasks, filter, sortOrder } = useTaskContext();

    const filteredTasks = tasks.filter((task) => {
        if (filter === FILTER_STATUS.COMPLETED) return task.completed;
        if (filter === FILTER_STATUS.ACTIVE) return !task.completed;
        return true;
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sortOrder === SORT_ORDER.HIGH_TO_LOW) {
            return PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority];
        }
        if (sortOrder === SORT_ORDER.LOW_TO_HIGH) {
            return PRIORITY_WEIGHTS[a.priority] - PRIORITY_WEIGHTS[b.priority];
        }
        return 0;
    });

    if (tasks.length === 0) {
        return (
            <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-6">
                <p className="text-slate-500 dark:text-slate-400 font-medium">Завдань поки немає.</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Додайте перше навчальне завдання!</p>
            </div>
        );
    }

    if (sortedTasks.length === 0) {
        return (
            <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-6">
                <p className="text-slate-500 dark:text-slate-400 font-medium">За цим фільтром завдань немає.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {sortedTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
            ))}
        </div>
    );
};