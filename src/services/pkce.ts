import CryptoJS from 'crypto-js';
import { AUTH_CONFIG } from '../config/auth-config';
import type { PKCEData } from '../types';

/**
 * Generate a cryptographically secure random string
 */
function generateRandomString(length: number): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let result = '';
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
        result += charset[randomValues[i] % charset.length];
    }

    return result;
}

/**
 * Generate SHA256 hash and encode as base64url
 */
function sha256Base64Url(input: string): string {
    const hash = CryptoJS.SHA256(input);
    const base64 = CryptoJS.enc.Base64.stringify(hash);

    // Convert base64 to base64url
    return base64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

/**
 * Generate PKCE code verifier and challenge
 */
export function generatePKCE(): PKCEData {
    const codeVerifier = generateRandomString(AUTH_CONFIG.pkce.codeVerifierLength);
    const codeChallenge = sha256Base64Url(codeVerifier);
    const state = generateRandomString(32);

    return {
        codeVerifier,
        codeChallenge,
        state,
    };
}

/**
 * Validate PKCE state parameter
 */
export function validateState(receivedState: string, expectedState: string): boolean {
    return receivedState === expectedState;
}