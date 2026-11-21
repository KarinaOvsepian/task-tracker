import { httpClient } from '../api/httpClient';
import type { ApiTodo, TodosResponse } from '../types/api';
import { PRIORITY, type Task, type TaskInput, type TaskUpdateInput } from '../types/task';

const DEFAULT_USER_ID = 1;

function mapApiTodoToTask(
    apiTodo: ApiTodo,
    overrides?: Partial<Omit<Task, 'id' | 'title' | 'completed'>>
): Task {
    return {
        id: apiTodo.id,
        title: apiTodo.todo,
        completed: apiTodo.completed,
        description: overrides?.description ?? 'Навчальне завдання із REST API',
        priority: overrides?.priority ?? PRIORITY.MEDIUM,
        category: overrides?.category ?? 'Загальне',
        createdBy: overrides?.createdBy ?? `User #${apiTodo.userId || DEFAULT_USER_ID}`,
        createdAt: overrides?.createdAt ?? new Date().toISOString(),
    };
}

export const taskRepository = {
    async getAll(params: { limit: number; skip: number; signal?: AbortSignal }) {
        const data = await httpClient.get<TodosResponse>(
            `/todos?limit=${params.limit}&skip=${params.skip}`,
            { signal: params.signal }
        );

        return {
            tasks: data.todos.map((item) => mapApiTodoToTask(item)),
            total: data.total,
        };
    },

    async getById(id: number, signal?: AbortSignal): Promise<Task> {
        const data = await httpClient.get<ApiTodo>(`/todos/${id}`, { signal });
        return mapApiTodoToTask(data);
    },

    async create(input: TaskInput): Promise<Task> {
        const created = await httpClient.post<ApiTodo>('/todos/add', {
            todo: input.title,
            completed: false,
            userId: DEFAULT_USER_ID,
        });

        return mapApiTodoToTask(created, {
            description: input.description,
            priority: input.priority,
            category: input.category,
            createdBy: input.createdBy ?? 'Авторизований користувач',
            createdAt: new Date().toISOString(),
        });
    },

    async update(id: number, input: TaskUpdateInput): Promise<Task> {
        const payload: Record<string, unknown> = {};
        if (input.title !== undefined) payload.todo = input.title;
        if (input.completed !== undefined) payload.completed = input.completed;

        const updated = await httpClient.patch<ApiTodo>(`/todos/${id}`, payload);

        return mapApiTodoToTask(updated, {
            description: input.description,
            priority: input.priority,
            category: input.category,
        });
    },

    async delete(id: number): Promise<void> {
        await httpClient.delete(`/todos/${id}`);
    },
};