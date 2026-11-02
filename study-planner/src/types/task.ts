export const PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
} as const;

export type Priority = (typeof PRIORITY)[keyof typeof PRIORITY];

export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    priority: Priority;
    category: string;
}

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