import React, { createContext, useCallback, useEffect, useState } from 'react';
import {
    FILTER_STATUS,
    SORT_ORDER,
    TOAST_TYPE,
    type FilterStatus,
    type SortOrder,
    type Task,
    type TaskInput,
    type TaskUpdateInput,
    type ToastMessage,
    type ToastType,
} from '../types/task';
import { taskRepository } from '../repositories/taskRepository';
import { useLocalStorage } from '../hooks/useLocalStorage';

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
    filter: FilterStatus;
    setFilter: (filter: FilterStatus) => void;
    sortOrder: SortOrder;
    setSortOrder: (sort: SortOrder) => void;
    editingTask: Task | null;
    setEditingTask: (task: Task | null) => void;
    selectedTask: Task | null;
    setSelectedTask: (task: Task | null) => void;
    toast: ToastMessage | null;
    showToast: (message: string, type?: ToastType, duration?: number) => void;
    hideToast: () => void;

    retryFetch: () => void;
    addTask: (input: TaskInput) => Promise<boolean>;
    updateTask: (id: number, input: TaskUpdateInput) => Promise<boolean>;
    toggleTask: (id: number) => Promise<void>;
    deleteTask: (id: number) => Promise<void>;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

function isAbortError(err: unknown): boolean {
    return err instanceof DOMException && err.name === 'AbortError';
}

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [totalTasks, setTotalTasks] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadTrigger, setReloadTrigger] = useState<number>(0);

    const [page, setPage] = useState<number>(1);
    const [filter, setFilter] = useLocalStorage<FilterStatus>('study_planner_filter', FILTER_STATUS.ALL);
    const [sortOrder, setSortOrder] = useLocalStorage<SortOrder>('study_planner_sort', SORT_ORDER.NONE);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [toast, setToast] = useState<ToastMessage | null>(null);

    const totalPages = Math.max(1, Math.ceil(totalTasks / ITEMS_PER_PAGE));

    const showToast = useCallback((message: string, type: ToastType = TOAST_TYPE.INFO, duration = 3000) => {
        setToast({ id: Date.now().toString(), message, type, duration });
    }, []);

    const hideToast = useCallback(() => {
        setToast(null);
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
                if (isAbortError(err)) {
                    return;
                }
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

    const addTask = async (input: TaskInput): Promise<boolean> => {
        try {
            const created = await taskRepository.create(input);
            setTasks((prev) => {
                const idExists = prev.some((t) => t.id === created.id);
                const taskToInsert: Task = idExists ? { ...created, id: Date.now() } : created;
                return [taskToInsert, ...prev];
            });
            setTotalTasks((prev) => prev + 1);
            showToast('Завдання успішно створено!', TOAST_TYPE.SUCCESS);
            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Помилка при створенні завдання';
            showToast(message, TOAST_TYPE.ERROR);
            return false;
        }
    };

    const updateTask = async (id: number, input: TaskUpdateInput): Promise<boolean> => {
        try {
            const existing = tasks.find((t) => t.id === id);
            const updated = await taskRepository.update(id, {
                ...existing,
                ...input,
            });

            setTasks((prev) =>
                prev.map((task) =>
                    task.id === id
                        ? {
                            ...task,
                            ...updated,
                            description: input.description ?? task.description,
                            priority: input.priority ?? task.priority,
                            category: input.category ?? task.category,
                        }
                        : task
                )
            );
            setEditingTask(null);
            showToast('Завдання успішно оновлено!', TOAST_TYPE.SUCCESS);
            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Помилка при оновленні завдання';
            showToast(message, TOAST_TYPE.ERROR);
            return false;
        }
    };

    const toggleTask = async (id: number): Promise<void> => {
        const target = tasks.find((t) => t.id === id);
        if (!target) return;

        try {
            const updated = await taskRepository.update(id, {
                completed: !target.completed,
            });

            setTasks((prev) =>
                prev.map((task) =>
                    task.id === id ? { ...task, completed: updated.completed } : task
                )
            );
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Не вдалося змінити статус завдання';
            showToast(message, TOAST_TYPE.ERROR);
        }
    };

    const deleteTask = async (id: number): Promise<void> => {
        try {
            await taskRepository.delete(id);
            setTasks((prev) => prev.filter((task) => task.id !== id));
            setTotalTasks((prev) => Math.max(0, prev - 1));
            if (editingTask?.id === id) {
                setEditingTask(null);
            }
            if (selectedTask?.id === id) {
                setSelectedTask(null);
            }
            showToast('Завдання видалено', TOAST_TYPE.INFO);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Помилка при видаленні завдання';
            showToast(message, TOAST_TYPE.ERROR);
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
                filter,
                setFilter,
                sortOrder,
                setSortOrder,
                editingTask,
                setEditingTask,
                selectedTask,
                setSelectedTask,
                toast,
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