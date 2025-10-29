import { AUTH_CONFIG } from '../config/auth-config';
import type { CognitoTokens, CognitoUserInfo } from '../types';

export class TokenManager {
    /**
     * Store tokens securely in Chrome storage
     */
    static async storeTokens(tokens: CognitoTokens): Promise<void> {
        const storageData = {
            [AUTH_CONFIG.storageKeys.accessToken]: tokens.accessToken,
            [AUTH_CONFIG.storageKeys.refreshToken]: tokens.refreshToken,
            [AUTH_CONFIG.storageKeys.idToken]: tokens.idToken,
            [AUTH_CONFIG.storageKeys.tokenExpiry]: tokens.expiresAt,
        };

        await chrome.storage.local.set(storageData);
    }

    /**
     * Retrieve tokens from Chrome storage
     */
    static async getTokens(): Promise<CognitoTokens | null> {
        const keys = [
            AUTH_CONFIG.storageKeys.accessToken,
            AUTH_CONFIG.storageKeys.refreshToken,
            AUTH_CONFIG.storageKeys.idToken,
            AUTH_CONFIG.storageKeys.tokenExpiry,
        ];

        const result = await chrome.storage.local.get(keys);

        if (!result[AUTH_CONFIG.storageKeys.accessToken]) {
            return null;
        }

        return {
            accessToken: result[AUTH_CONFIG.storageKeys.accessToken],
            refreshToken: result[AUTH_CONFIG.storageKeys.refreshToken],
            idToken: result[AUTH_CONFIG.storageKeys.idToken],
            expiresAt: result[AUTH_CONFIG.storageKeys.tokenExpiry],
        };
    }

    /**
     * Store user information
     */
    static async storeUserInfo(userInfo: CognitoUserInfo): Promise<void> {
        await chrome.storage.local.set({
            [AUTH_CONFIG.storageKeys.userInfo]: userInfo,
        });
    }

    /**
     * Retrieve user information
     */
    static async getUserInfo(): Promise<CognitoUserInfo | null> {
        const result = await chrome.storage.local.get([AUTH_CONFIG.storageKeys.userInfo]);
        return result[AUTH_CONFIG.storageKeys.userInfo] || null;
    }

    /**
     * Store PKCE data temporarily
     */
    static async storePKCEData(codeVerifier: string, state: string): Promise<void> {
        await chrome.storage.local.set({
            [AUTH_CONFIG.storageKeys.codeVerifier]: codeVerifier,
            [AUTH_CONFIG.storageKeys.state]: state,
        });
    }

    /**
     * Retrieve PKCE data
     */
    static async getPKCEData(): Promise<{ codeVerifier: string; state: string } | null> {
        const result = await chrome.storage.local.get([
            AUTH_CONFIG.storageKeys.codeVerifier,
            AUTH_CONFIG.storageKeys.state,
        ]);

        if (!result[AUTH_CONFIG.storageKeys.codeVerifier]) {
            return null;
        }

        return {
            codeVerifier: result[AUTH_CONFIG.storageKeys.codeVerifier],
            state: result[AUTH_CONFIG.storageKeys.state],
        };
    }

    /**
     * Clear all authentication data
     */
    static async clearAuthData(): Promise<void> {
        const keys = Object.values(AUTH_CONFIG.storageKeys);
        await chrome.storage.local.remove(keys);
    }

    /**
     * Check if access token is expired or will expire soon
     */
    static isTokenExpired(expiresAt: number): boolean {
        const now = Date.now();
        const thresholdMs = AUTH_CONFIG.tokenRefresh.refreshThresholdMinutes * 60 * 1000;
        return now >= (expiresAt - thresholdMs);
    }

    /**
     * Calculate token expiration time from expires_in seconds
     */
    static calculateExpirationTime(expiresInSeconds: number): number {
        return Date.now() + (expiresInSeconds * 1000);
    }
}