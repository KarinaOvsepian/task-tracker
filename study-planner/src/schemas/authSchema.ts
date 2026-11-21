import { z } from 'zod';

export const authSchema = z.object({
    username: z
        .string()
        .trim()
        .min(1, 'Імʼя користувача є обовʼязковим'),
    password: z
        .string()
        .min(6, 'Пароль повинен містити щонайменше 6 символів'),
});

export type LoginFormData = z.infer<typeof authSchema>;