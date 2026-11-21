import { createContext } from 'react';
import type { Task, TaskInput, TaskUpdateInput, ToastMessage, ToastType } from '../types/task';

export interface TaskContextType {
    tasks: Task[];
    totalTasks: number;
    isLoading: boolean;
    error: string | null;
    page: number;
    limit: number;
    totalPages: number;
    setPage: (page: number) => void;
    toasts: ToastMessage[];
    showToast: (message: string, type?: ToastType, duration?: number) => void;
    hideToast: (id: string) => void;
    retryFetch: () => void;
    addTask: (input: TaskInput) => Promise<Task | null>;
    updateTask: (id: number, input: TaskUpdateInput) => Promise<Task | null>;
    toggleTask: (id: number) => Promise<boolean>;
    deleteTask: (id: number) => Promise<boolean>;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);