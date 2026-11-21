import React, { createContext, useCallback, useState } from 'react';
import { authApi } from '../api/authApi';
import { setHttpAuthToken } from '../api/httpClient';
import type { AuthContextType, AuthUser, LoginCredentials } from '../types/auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
        const loginData = await authApi.login(credentials);
        setHttpAuthToken(loginData.accessToken);
        setAccessToken(loginData.accessToken);

        const currentUser = await authApi.getMe();
        setUser(currentUser);
    }, []);

    const logout = useCallback((): void => {
        setHttpAuthToken(null);
        setAccessToken(null);
        setUser(null);
    }, []);

    const isAuthenticated = Boolean(accessToken && user);

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                isAuthenticated,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};