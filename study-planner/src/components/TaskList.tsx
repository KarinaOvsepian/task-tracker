import React from 'react';
import type {Task} from '../types/task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
    tasks: Task[];
    totalTasksCount: number;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
                                                      tasks,
                                                      totalTasksCount,
                                                      onToggle,
                                                      onDelete,
                                                  }) => {
    if (totalTasksCount === 0) {
        return (
            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-300 p-6">
                <p className="text-slate-500 font-medium">Завдань поки немає.</p>
                <p className="text-slate-400 text-sm mt-1">Додайте перше навчальне завдання!</p>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-300 p-6">
                <p className="text-slate-500 font-medium">За цим фільтром завдань немає.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};