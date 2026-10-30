import type {Task} from '../types/task';

export const initialTasks: Task[] = [
    {
        id: 1,
        title: 'React Components',
        description: 'Опрацювати базові принципи компонентів React',
        completed: false,
        priority: 'high',
        category: 'React',
    },
    {
        id: 2,
        title: 'TypeScript Exercises',
        description: 'Виконати практичні вправи з типізації',
        completed: true,
        priority: 'medium',
        category: 'TypeScript',
    },
    {
        id: 3,
        title: 'Оформлення звіту',
        description: 'Підготувати звіт до лабораторної роботи №8',
        completed: false,
        priority: 'low',
        category: 'Університет',
    },
];