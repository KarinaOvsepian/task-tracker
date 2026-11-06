import React, { createContext, useReducer, useEffect, useState, useRef } from 'react';
import {
    type Task,
    type FilterStatus,
    type SortOrder,
    type Priority,
    FILTER_STATUS,
    SORT_ORDER,
    type ToastMessage,
    type ToastType,
} from '../types/task';
import { taskReducer } from '../reducers/taskReducer';
import { initialTasks } from '../data/initialTasks';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface TaskContextType {
    tasks: Task[];
    filter: FilterStatus;
    setFilter: (filter: FilterStatus) => void;
    sortOrder: SortOrder;
    setSortOrder: (sort: SortOrder) => void;
    editingTask: Task | null;
    setEditingTask: (task: Task | null) => void;
    toast: ToastMessage | null;
    pendingDeleteId: number | null;
    showToast: (message: string, type?: ToastType, duration?: number) => void;
    hideToast: () => void;

    addTask: (task: Omit<Task, 'id' | 'completed' | 'isPendingDelete'>) => void;
    updateTask: (id: number, data: { title: string; description: string; priority: Priority; category: string }) => void;
    toggleTask: (id: number) => void;
    requestDelete: (id: number) => void;
    undoDelete: (id: number) => void;
    clearCompleted: () => void;
    resetTasks: () => void;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'study_planner_tasks';

const getInitialTasks = (): Task[] => {
    try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (error) {
        console.error('Помилка зчитування задач з localStorage, використовуємо початкові:', error);
    }
    return initialTasks;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tasks, dispatch] = useReducer(taskReducer, [], getInitialTasks);
    const [filter, setFilter] = useLocalStorage<FilterStatus>('study_planner_filter', FILTER_STATUS.ALL);
    const [sortOrder, setSortOrder] = useLocalStorage<SortOrder>('study_planner_sort', SORT_ORDER.NONE);

    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [toast, setToast] = useState<ToastMessage | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

    const deleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
        } catch (e) {
            console.error('Помилка запису tasks у localStorage:', e);
        }
    }, [tasks]);

    useEffect(() => {
        const activeCount = tasks.filter((t) => !t.completed && !t.isPendingDelete).length;
        document.title = `Study Planner (${activeCount} active tasks)`;
    }, [tasks]);

    useEffect(() => {
        return () => {
            if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
        };
    }, []);

    const showToast = (message: string, type: ToastType = 'info', duration = 3000) => {
        setToast({ id: Date.now().toString(), message, type, duration });
    };

    const hideToast = () => {
        setToast(null);
    };

    const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'isPendingDelete'>) => {
        dispatch({ type: 'ADD_TASK', payload: taskData });
        showToast('Завдання успішно додано!', 'success');
    };

    const updateTask = (id: number, data: { title: string; description: string; priority: Priority; category: string }) => {
        dispatch({ type: 'UPDATE_TASK', payload: { id, ...data } });
        setEditingTask(null);
        showToast('Завдання успішно оновлено!', 'success');
    };

    const toggleTask = (id: number) => {
        dispatch({ type: 'TOGGLE_TASK', payload: id });
    };

    const requestDelete = (id: number) => {
        if (deleteTimerRef.current) {
            clearTimeout(deleteTimerRef.current);
            if (pendingDeleteId !== null) {
                dispatch({ type: 'CONFIRM_DELETE', payload: pendingDeleteId });
            }
        }

        dispatch({ type: 'REQUEST_DELETE', payload: id });
        setPendingDeleteId(id);
        showToast('Завдання буде видалено через 5 сек.', 'warning', 5000);

        deleteTimerRef.current = setTimeout(() => {
            dispatch({ type: 'CONFIRM_DELETE', payload: id });
            setPendingDeleteId(null);
            deleteTimerRef.current = null;
            showToast('Завдання остаточно видалено', 'error');
        }, 5000);
    };

    const undoDelete = (id: number) => {
        if (deleteTimerRef.current) {
            clearTimeout(deleteTimerRef.current);
            deleteTimerRef.current = null;
        }
        dispatch({ type: 'UNDO_DELETE', payload: id });
        setPendingDeleteId(null);
        hideToast();
        showToast('Видалення скасовано', 'info');
    };

    const clearCompleted = () => {
        dispatch({ type: 'CLEAR_COMPLETED' });
        showToast('Виконані завдання очищено', 'info');
    };

    const resetTasks = () => {
        dispatch({ type: 'RESET_TASKS' });
        showToast('Дані скинуто до початкових', 'info');
    };

    return (
        <TaskContext.Provider
            value={{
                tasks,
                filter,
                setFilter,
                sortOrder,
                setSortOrder,
                editingTask,
                setEditingTask,
                toast,
                pendingDeleteId,
                showToast,
                hideToast,
                addTask,
                updateTask,
                toggleTask,
                requestDelete,
                undoDelete,
                clearCompleted,
                resetTasks,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
};