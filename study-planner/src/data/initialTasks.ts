import { PRIORITY, type Task } from '../types/task';

export const initialTasks: Task[] = [
    {
        id: 1,
        title: 'React Components',
        description: 'Опрацювати базові принципи компонентів React',
        completed: false,
        priority: PRIORITY.HIGH,
        category: 'React',
        createdBy: 'Me',
        createdAt: '21-11-2026'
    },
    {
        id: 2,
        title: 'TypeScript Exercises',
        description: 'Виконати практичні вправи',
        completed: true,
        priority: PRIORITY.MEDIUM,
        category: 'TypeScript',
        createdBy: 'My friend',
        createdAt: '19-11-2026'
    },
];