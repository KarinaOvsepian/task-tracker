import { httpClient } from './httpClient';
import type { AuthUser, LoginCredentials, LoginResponse } from '../types/auth';

export const authApi = {
    login: (credentials: LoginCredentials): Promise<LoginResponse> => {
        return httpClient.post<LoginResponse>('/auth/login', {
            username: credentials.username,
            password: credentials.password,
        });
    },

    getMe: (): Promise<AuthUser> => {
        return httpClient.get<AuthUser>('/auth/me');
    },
};