import { httpClient } from '../api/httpClient';
import type { ApiTodo, CreateTodoDto, TodosResponse, UpdateTodoDto } from '../types/api';
import { PRIORITY, type Task, type TaskInput, type TaskUpdateInput } from '../types/task';

export interface GetTasksParams {
    limit: number;
    skip: number;
    signal?: AbortSignal;
}

export interface PaginatedTasksResult {
    tasks: Task[];
    total: number;
    skip: number;
    limit: number;
}

const DEFAULT_USER_ID = 1;
const DEFAULT_CATEGORY = 'Загальне';

function toTask(
    dto: ApiTodo,
    metadata?: Partial<Pick<Task, 'description' | 'priority' | 'category'>>
): Task {
    return {
        id: dto.id,
        title: dto.todo,
        description: metadata?.description ?? '',
        completed: dto.completed,
        priority: metadata?.priority ?? PRIORITY.MEDIUM,
        category: metadata?.category ?? DEFAULT_CATEGORY,
    };
}

export const taskRepository = {
    async getAll({ limit, skip, signal }: GetTasksParams): Promise<PaginatedTasksResult> {
        const response = await httpClient.get<TodosResponse>(
            `/todos?limit=${limit}&skip=${skip}`,
            signal
        );

        return {
            tasks: response.todos.map((item) => toTask(item)),
            total: response.total,
            skip: response.skip,
            limit: response.limit,
        };
    },

    async getById(id: number, signal?: AbortSignal): Promise<Task> {
        const dto = await httpClient.get<ApiTodo>(`/todos/${id}`, signal);
        return toTask(dto);
    },

    async create(input: TaskInput): Promise<Task> {
        const payload: CreateTodoDto = {
            todo: input.title,
            completed: false,
            userId: DEFAULT_USER_ID,
        };

        const createdDto = await httpClient.post<ApiTodo>('/todos/add', payload);

        return toTask(createdDto, {
            description: input.description,
            priority: input.priority,
            category: input.category || DEFAULT_CATEGORY,
        });
    },

    async update(id: number, input: TaskUpdateInput): Promise<Task> {
        const payload: UpdateTodoDto = {};
        if (input.title !== undefined) payload.todo = input.title;
        if (input.completed !== undefined) payload.completed = input.completed;

        const updatedDto = await httpClient.patch<ApiTodo>(`/todos/${id}`, payload);

        return toTask(updatedDto, {
            description: input.description,
            priority: input.priority,
            category: input.category,
        });
    },

    async delete(id: number): Promise<void> {
        await httpClient.delete<ApiTodo & { isDeleted?: boolean }>(`/todos/${id}`);
    },
};