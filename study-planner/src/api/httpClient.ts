const BASE_URL = import.meta.env.VITE_API_URL || 'https://dummyjson.com';

let authToken: string | null = null;

export const setHttpAuthToken = (token: string | null): void => {
    authToken = token;
};

interface RequestOptions extends Omit<RequestInit, 'body'> {
    body?: unknown;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { body, headers, ...restOptions } = options;

    const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(headers as Record<string, string>),
    };

    if (authToken) {
        requestHeaders['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...restOptions,
        headers: requestHeaders,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        let errorMessage = `HTTP Error: ${response.status}`;
        try {
            const errorData = await response.json();
            if (errorData && typeof errorData.message === 'string') {
                errorMessage = errorData.message;
            }
        } catch {
            errorMessage = `HTTP Error: ${response.status} ${response.statusText}`.trim();
        }
        throw new Error(errorMessage);
    }

    return response.json() as Promise<T>;
}

export const httpClient = {
    get: <T>(endpoint: string, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: 'GET' }),

    post: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: 'POST', body }),

    put: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: 'PUT', body }),

    patch: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: 'PATCH', body }),

    delete: <T>(endpoint: string, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: 'DELETE' }),
};