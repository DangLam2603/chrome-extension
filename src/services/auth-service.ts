import { AWS_CONFIG, OAUTH_CONFIG, getExtensionUrls, getCognitoEndpoints } from '../config/aws-config';
import { AUTH_CONFIG, AuthState, AuthErrorType } from '../config/auth-config';
import { TokenManager } from './token-manager';
import { generatePKCE, validateState } from './pkce';
import type { CognitoTokens, CognitoUserInfo, AuthError } from '../types';

export class AuthService {
    private static instance: AuthService;
    private tokenRefreshTimer: number | null = null;

    private constructor() {
        this.initializeTokenRefresh();
    }

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    /**
     * Initialize OAuth login flow
     */
    async login(): Promise<void> {
        try {
            // Generate PKCE parameters
            const pkceData = generatePKCE();
            await TokenManager.storePKCEData(pkceData.codeVerifier, pkceData.state);

            // Build authorization URL
            const { callbackUrl } = getExtensionUrls();
            const { authUrl } = getCognitoEndpoints();

            const params = new URLSearchParams({
                client_id: AWS_CONFIG.clientId,
                response_type: OAUTH_CONFIG.responseType,
                scope: OAUTH_CONFIG.scopes.join(' '),
                redirect_uri: callbackUrl,
                state: pkceData.state,
                code_challenge: pkceData.codeChallenge,
                code_challenge_method: AUTH_CONFIG.pkce.codeChallengeMethod,
            });

            const authorizationUrl = `${authUrl}?${params.toString()}`;

            // Open authorization URL in new window
            chrome.windows.create({
                url: authorizationUrl,
                type: 'popup',
                width: 500,
                height: 600,
            });
        } catch (error) {
            console.error('Login error:', error);
            throw this.createAuthError(AuthErrorType.OAUTH_ERROR, 'Failed to initiate login');
        }
    }

    /**
     * Handle OAuth callback with authorization code
     */
    async handleCallback(code: string, state: string): Promise<CognitoTokens> {
        try {
            // Retrieve and validate PKCE data
            const pkceData = await TokenManager.getPKCEData();
            if (!pkceData) {
                throw this.createAuthError(AuthErrorType.OAUTH_ERROR, 'PKCE data not found');
            }

            if (!validateState(state, pkceData.state)) {
                throw this.createAuthError(AuthErrorType.OAUTH_ERROR, 'Invalid state parameter');
            }

            // Exchange authorization code for tokens
            const tokens = await this.exchangeCodeForTokens(code, pkceData.codeVerifier);

            // Store tokens
            await TokenManager.storeTokens(tokens);

            // Fetch and store user info
            const userInfo = await this.fetchUserInfo(tokens.accessToken);
            await TokenManager.storeUserInfo(userInfo);

            // Start token refresh timer
            this.scheduleTokenRefresh(tokens.expiresAt);

            return tokens;
        } catch (error) {
            console.error('Callback handling error:', error);
            throw error;
        }
    }

    /**
     * Exchange authorization code for tokens
     */
    private async exchangeCodeForTokens(code: string, codeVerifier: string): Promise<CognitoTokens> {
        const { callbackUrl } = getExtensionUrls();
        const { tokenUrl } = getCognitoEndpoints();

        const params = new URLSearchParams({
            grant_type: OAUTH_CONFIG.grantType,
            client_id: AWS_CONFIG.clientId,
            code: code,
            redirect_uri: callbackUrl,
            code_verifier: codeVerifier,
        });

        try {
            const response = await fetch(tokenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString(),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw this.createAuthError(
                    AuthErrorType.OAUTH_ERROR,
                    errorData.error_description || 'Token exchange failed'
                );
            }

            const data = await response.json();

            return {
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                idToken: data.id_token,
                expiresAt: TokenManager.calculateExpirationTime(data.expires_in),
            };
        } catch (error) {
            console.error('Token exchange error:', error);
            throw this.createAuthError(AuthErrorType.NETWORK_ERROR, 'Failed to exchange code for tokens');
        }
    }

    /**
     * Refresh access token using refresh token
     */
    async refreshToken(): Promise<CognitoTokens> {
        const tokens = await TokenManager.getTokens();
        if (!tokens || !tokens.refreshToken) {
            throw this.createAuthError(AuthErrorType.INVALID_TOKEN, 'No refresh token available');
        }

        const { tokenUrl } = getCognitoEndpoints();

        const params = new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: AWS_CONFIG.clientId,
            refresh_token: tokens.refreshToken,
        });

        let retryCount = 0;
        const maxRetries = AUTH_CONFIG.tokenRefresh.maxRetryAttempts;

        while (retryCount < maxRetries) {
            try {
                const response = await fetch(tokenUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: params.toString(),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw this.createAuthError(
                        AuthErrorType.REFRESH_FAILED,
                        errorData.error_description || 'Token refresh failed'
                    );
                }

                const data = await response.json();

                const newTokens: CognitoTokens = {
                    accessToken: data.access_token,
                    refreshToken: data.refresh_token || tokens.refreshToken,
                    idToken: data.id_token,
                    expiresAt: TokenManager.calculateExpirationTime(data.expires_in),
                };

                await TokenManager.storeTokens(newTokens);
                this.scheduleTokenRefresh(newTokens.expiresAt);

                return newTokens;
            } catch (error) {
                retryCount++;
                if (retryCount >= maxRetries) {
                    console.error('Token refresh failed after retries:', error);
                    throw error;
                }
                await this.delay(AUTH_CONFIG.tokenRefresh.retryDelayMs * retryCount);
            }
        }

        throw this.createAuthError(AuthErrorType.REFRESH_FAILED, 'Token refresh failed after retries');
    }

    /**
     * Fetch user information from Cognito
     */
    async fetchUserInfo(accessToken: string): Promise<CognitoUserInfo> {
        const { userInfoUrl } = getCognitoEndpoints();

        try {
            const response = await fetch(userInfoUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw this.createAuthError(AuthErrorType.NETWORK_ERROR, 'Failed to fetch user info');
            }

            const userInfo = await response.json();
            return userInfo as CognitoUserInfo;
        } catch (error) {
            console.error('User info fetch error:', error);
            throw this.createAuthError(AuthErrorType.NETWORK_ERROR, 'Failed to fetch user information');
        }
    }

    /**
     * Logout user and clear all authentication data
     */
    async logout(): Promise<void> {
        try {
            const tokens = await TokenManager.getTokens();

            // Clear local storage
            await TokenManager.clearAuthData();

            // Clear token refresh timer
            if (this.tokenRefreshTimer) {
                clearTimeout(this.tokenRefreshTimer);
                this.tokenRefreshTimer = null;
            }

            // Redirect to Cognito logout
            if (tokens) {
                const { signoutUrl } = getExtensionUrls();
                const { logoutUrl } = getCognitoEndpoints();

                const params = new URLSearchParams({
                    client_id: AWS_CONFIG.clientId,
                    logout_uri: signoutUrl,
                });

                const cognitoLogoutUrl = `${logoutUrl}?${params.toString()}`;

                chrome.windows.create({
                    url: cognitoLogoutUrl,
                    type: 'popup',
                    width: 500,
                    height: 600,
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear local data even if Cognito logout fails
            await TokenManager.clearAuthData();
        }
    }

    /**
     * Get current authentication state
     */
    async getAuthState(): Promise<AuthState> {
        try {
            const tokens = await TokenManager.getTokens();
            const userInfo = await TokenManager.getUserInfo();

            if (!tokens || !tokens.accessToken) {
                return AuthState.UNAUTHENTICATED;
            }

            // Check if token is expired
            if (TokenManager.isTokenExpired(tokens.expiresAt)) {
                // Try to refresh token
                try {
                    await this.refreshToken();
                    return AuthState.AUTHENTICATED;
                } catch (error) {
                    return AuthState.UNAUTHENTICATED;
                }
            }

            return userInfo ? AuthState.AUTHENTICATED : AuthState.LOADING;
        } catch (error) {
            console.error('Get auth state error:', error);
            return AuthState.ERROR;
        }
    }

    /**
     * Get current user information
     */
    async getCurrentUser(): Promise<CognitoUserInfo | null> {
        return await TokenManager.getUserInfo();
    }

    /**
     * Get valid access token (refresh if needed)
     */
    async getValidAccessToken(): Promise<string | null> {
        const tokens = await TokenManager.getTokens();

        if (!tokens) {
            return null;
        }

        if (TokenManager.isTokenExpired(tokens.expiresAt)) {
            try {
                const newTokens = await this.refreshToken();
                return newTokens.accessToken;
            } catch (error) {
                console.error('Failed to refresh token:', error);
                return null;
            }
        }

        return tokens.accessToken;
    }

    /**
     * Initialize automatic token refresh
     */
    private initializeTokenRefresh(): void {
        // Check token status on startup
        TokenManager.getTokens().then((tokens) => {
            if (tokens && !TokenManager.isTokenExpired(tokens.expiresAt)) {
                this.scheduleTokenRefresh(tokens.expiresAt);
            }
        });
    }

    /**
     * Schedule token refresh before expiration
     */
    private scheduleTokenRefresh(expiresAt: number): void {
        // Clear existing timer
        if (this.tokenRefreshTimer) {
            clearTimeout(this.tokenRefreshTimer);
        }

        const now = Date.now();
        const thresholdMs = AUTH_CONFIG.tokenRefresh.refreshThresholdMinutes * 60 * 1000;
        const refreshTime = expiresAt - thresholdMs - now;

        if (refreshTime > 0) {
            this.tokenRefreshTimer = window.setTimeout(async () => {
                try {
                    await this.refreshToken();
                } catch (error) {
                    console.error('Scheduled token refresh failed:', error);
                    if (AUTH_CONFIG.session.autoLogoutOnTokenExpiry) {
                        await this.logout();
                    }
                }
            }, refreshTime);
        }
    }

    /**
     * Create standardized auth error
     */
    private createAuthError(type: AuthErrorType, message: string): AuthError {
        return {
            type,
            message,
        };
    }

    /**
     * Delay utility for retry logic
     */
    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

// Export singleton instance
export const authService = AuthService.getInstance();
