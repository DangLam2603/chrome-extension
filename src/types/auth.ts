export interface AuthTokens {
    accessToken: string;
    idToken: string;
    refreshToken: string;
    expiresAt: number;
}

export interface UserInfo {
    email: string;
    name?: string;
    picture?: string;
    sub: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: UserInfo | null;
    tokens: AuthTokens | null;
}
