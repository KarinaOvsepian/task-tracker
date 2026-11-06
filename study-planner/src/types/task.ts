export const PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
} as const;

export type Priority = (typeof PRIORITY)[keyof typeof PRIORITY];

export const FILTER_STATUS = {
    ALL: 'all',
    COMPLETED: 'completed',
    ACTIVE: 'active',
} as const;

export type FilterStatus = (typeof FILTER_STATUS)[keyof typeof FILTER_STATUS];

export const SORT_ORDER = {
    NONE: 'none',
    HIGH_TO_LOW: 'high-to-low',
    LOW_TO_HIGH: 'low-to-high',
} as const;

export type SortOrder = (typeof SORT_ORDER)[keyof typeof SORT_ORDER];

export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    priority: Priority;
    category: string;
    isPendingDelete?: boolean;
}

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

export type TaskAction =
    | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'completed' | 'isPendingDelete'> }
    | { type: 'TOGGLE_TASK'; payload: number }
    | { type: 'UPDATE_TASK'; payload: { id: number; title: string; description: string; priority: Priority; category: string } }
    | { type: 'REQUEST_DELETE'; payload: number }
    | { type: 'CONFIRM_DELETE'; payload: number }
    | { type: 'UNDO_DELETE'; payload: number }
    | { type: 'CLEAR_COMPLETED' }
    | { type: 'RESET_TASKS' }
    | { type: 'SET_TASKS'; payload: Task[] };