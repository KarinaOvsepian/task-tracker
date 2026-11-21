import React, { createContext, useCallback, useEffect, useState } from 'react';
import {
    TOAST_TYPE,
    type Task,
    type TaskInput,
    type TaskUpdateInput,
    type ToastMessage,
    type ToastType,
} from '../types/task';
import { taskRepository } from '../repositories/taskRepository';
import { useAuth } from '../hooks/useAuth';

const ITEMS_PER_PAGE = 10;

interface TaskContextType {
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

function isAbortError(err: unknown): boolean {
    return err instanceof DOMException && err.name === 'AbortError';
}

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, user } = useAuth();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [totalTasks, setTotalTasks] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadTrigger, setReloadTrigger] = useState<number>(0);

    const [page, setPage] = useState<number>(1);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const totalPages = Math.max(1, Math.ceil(totalTasks / ITEMS_PER_PAGE));

    const showToast = useCallback(
        (message: string, type: ToastType = TOAST_TYPE.INFO, duration = 3000) => {
            const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
            setToasts((prev) => [...prev, { id, message, type, duration }]);
        },
        []
    );

    const hideToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        const skip = (page - 1) * ITEMS_PER_PAGE;

        const loadTasks = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const result = await taskRepository.getAll({
                    limit: ITEMS_PER_PAGE,
                    skip,
                    signal: controller.signal,
                });

                setTasks(result.tasks);
                setTotalTasks(result.total);
            } catch (err) {
                if (isAbortError(err)) return;
                const message = err instanceof Error ? err.message : 'Не вдалося завантажити список завдань';
                setError(message);
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        loadTasks();

        return () => {
            controller.abort();
        };
    }, [page, reloadTrigger]);

    useEffect(() => {
        const activeCount = tasks.filter((t) => !t.completed).length;
        document.title = `Study Planner (${activeCount} active tasks)`;
    }, [tasks]);

    const retryFetch = () => {
        setReloadTrigger((prev) => prev + 1);
    };

    const addTask = async (input: TaskInput): Promise<Task | null> => {
        if (!isAuthenticated) {
            showToast('Авторизуйтеся для створення завдань', TOAST_TYPE.WARNING);
            return null;
        }

        try {
            const created = await taskRepository.create({
                ...input,
                createdBy: user ? `${user.firstName} ${user.lastName} (@${user.username})` : undefined,
            });

            let insertedTask = created;
            setTasks((prev) => {
                const idExists = prev.some((t) => t.id === created.id);
                insertedTask = idExists ? { ...created, id: Date.now() } : created;
                return [insertedTask, ...prev];
            });
            setTotalTasks((prev) => prev + 1);
            showToast('Завдання успішно створено!', TOAST_TYPE.SUCCESS);
            return insertedTask;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Помилка при створенні завдання';
            showToast(message, TOAST_TYPE.ERROR);
            return null;
        }
    };

    const updateTask = async (id: number, input: TaskUpdateInput): Promise<Task | null> => {
        if (!isAuthenticated) {
            showToast('Авторизуйтеся для редагування завдань', TOAST_TYPE.WARNING);
            return null;
        }

        try {
            const existing = tasks.find((t) => t.id === id);
            const updated = await taskRepository.update(id, {
                ...existing,
                ...input,
            });

            const mergedTask: Task = {
                ...updated,
                description: input.description ?? existing?.description ?? updated.description,
                priority: input.priority ?? existing?.priority ?? updated.priority,
                category: input.category ?? existing?.category ?? updated.category,
                createdBy: existing?.createdBy ?? updated.createdBy,
                createdAt: existing?.createdAt ?? updated.createdAt,
            };

            setTasks((prev) => prev.map((task) => (task.id === id ? mergedTask : task)));
            showToast('Завдання успішно оновлено!', TOAST_TYPE.SUCCESS);
            return mergedTask;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Помилка при оновленні завдання';
            showToast(message, TOAST_TYPE.ERROR);
            return null;
        }
    };

    const toggleTask = async (id: number): Promise<boolean> => {
        if (!isAuthenticated) {
            showToast('Авторизуйтеся для зміни статусу завдання', TOAST_TYPE.WARNING);
            return false;
        }

        const target = tasks.find((t) => t.id === id);
        if (!target) return false;

        try {
            const updated = await taskRepository.update(id, {
                completed: !target.completed,
            });

            setTasks((prev) =>
                prev.map((task) => (task.id === id ? { ...task, completed: updated.completed } : task))
            );
            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Не вдалося змінити статус завдання';
            showToast(message, TOAST_TYPE.ERROR);
            return false;
        }
    };

    const deleteTask = async (id: number): Promise<boolean> => {
        if (!isAuthenticated) {
            showToast('Авторизуйтеся для видалення завдань', TOAST_TYPE.WARNING);
            return false;
        }

        try {
            await taskRepository.delete(id);
            setTasks((prev) => prev.filter((task) => task.id !== id));
            setTotalTasks((prev) => Math.max(0, prev - 1));
            showToast('Завдання видалено', TOAST_TYPE.INFO);
            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Помилка при видаленні завдання';
            showToast(message, TOAST_TYPE.ERROR);
            return false;
        }
    };

    return (
        <TaskContext.Provider
            value={{
                tasks,
                totalTasks,
                isLoading,
                error,
                page,
                limit: ITEMS_PER_PAGE,
                totalPages,
                setPage,
                toasts,
                showToast,
                hideToast,
                retryFetch,
                addTask,
                updateTask,
                toggleTask,
                deleteTask,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
};