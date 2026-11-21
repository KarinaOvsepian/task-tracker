export interface AuthUser {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    image?: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResponse extends AuthUser {
    accessToken: string;
    refreshToken: string;
}

export interface AuthContextType {
    user: AuthUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
}