const RAW_BASE_URL = import.meta.env.VITE_API_URL || 'https://dummyjson.com';
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: unknown;
    signal?: AbortSignal;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, signal } = options;
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${BASE_URL}${normalizedEndpoint}`;

    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal,
    });

    if (!response.ok) {
        throw new Error(`HTTP помилка ${response.status}: ${response.statusText || 'Не вдалося виконати запит'}`);
    }

    return (await response.json()) as T;
}

export const httpClient = {
    get: <T>(endpoint: string, signal?: AbortSignal): Promise<T> =>
        request<T>(endpoint, { method: 'GET', signal }),

    post: <T>(endpoint: string, body: unknown, signal?: AbortSignal): Promise<T> =>
        request<T>(endpoint, { method: 'POST', body, signal }),

    patch: <T>(endpoint: string, body: unknown, signal?: AbortSignal): Promise<T> =>
        request<T>(endpoint, { method: 'PATCH', body, signal }),

    delete: <T>(endpoint: string, signal?: AbortSignal): Promise<T> =>
        request<T>(endpoint, { method: 'DELETE', signal }),
};