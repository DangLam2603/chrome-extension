// Authentication Configuration
export const AUTH_CONFIG = {
    // Token storage keys
    storageKeys: {
        accessToken: 'cognito_access_token',
        refreshToken: 'cognito_refresh_token',
        idToken: 'cognito_id_token',
        tokenExpiry: 'cognito_token_expiry',
        userInfo: 'cognito_user_info',
        codeVerifier: 'cognito_code_verifier',
        state: 'cognito_oauth_state',
    },

    // Token refresh settings
    tokenRefresh: {
        // Refresh token when it expires in less than 5 minutes
        refreshThresholdMinutes: 5,
        // Maximum retry attempts for token refresh
        maxRetryAttempts: 3,
        // Retry delay in milliseconds
        retryDelayMs: 1000,
    },

    // PKCE settings
    pkce: {
        codeVerifierLength: 128,
        codeChallengeMethod: 'S256',
    },

    // Session settings
    session: {
        // Auto logout after token expires and refresh fails
        autoLogoutOnTokenExpiry: true,
        // Check token validity interval (in minutes)
        tokenCheckIntervalMinutes: 1,
    },
} as const;

// Authentication states
export enum AuthState {
    LOADING = 'loading',
    AUTHENTICATED = 'authenticated',
    UNAUTHENTICATED = 'unauthenticated',
    ERROR = 'error',
}

// Authentication error types
export enum AuthErrorType {
    NETWORK_ERROR = 'network_error',
    TOKEN_EXPIRED = 'token_expired',
    INVALID_TOKEN = 'invalid_token',
    REFRESH_FAILED = 'refresh_failed',
    OAUTH_ERROR = 'oauth_error',
    UNKNOWN_ERROR = 'unknown_error',
}