export type Priority = 'low' | 'medium' | 'high';

export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    priority: Priority;
    category: string;
}

export type FilterStatus = 'all' | 'completed' | 'active';
export type SortOrder = 'none' | 'high-to-low' | 'low-to-high';