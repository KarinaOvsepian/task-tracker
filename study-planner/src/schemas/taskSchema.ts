import { z } from 'zod';
import { PRIORITY } from '../types/task';

export const taskSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, 'Назва завдання є обовʼязковою')
        .max(120, 'Назва не повинна перевищувати 120 символів'),
    description: z
        .string()
        .trim()
        .max(500, 'Опис не повинен перевищувати 500 символів'),
    category: z
        .string()
        .trim()
        .min(1, 'Вкажіть категорію завдання'),
    priority: z.enum([PRIORITY.LOW, PRIORITY.MEDIUM, PRIORITY.HIGH], {
        message: 'Оберіть коректний пріоритет',
    }),
});

export type TaskFormData = z.infer<typeof taskSchema>;