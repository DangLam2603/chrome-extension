// Debug utilities for OAuth authentication
import { getStoredTokens, getUserInfo } from './auth';

/**
 * Logs current authentication status to console
 */
export async function debugAuthStatus(): Promise<void> {
    console.group('🔐 Authentication Debug Info');

    try {
        const tokens = await getStoredTokens();

        if (!tokens) {
            console.log('❌ No tokens found - User not authenticated');
            console.groupEnd();
            return;
        }

        console.log('✅ Tokens found');
        console.log('Access Token:', tokens.accessToken.substring(0, 20) + '...');
        console.log('ID Token:', tokens.idToken.substring(0, 20) + '...');
        console.log('Refresh Token:', tokens.refreshToken ? 'Present' : 'Missing');
        console.log('Expires At:', new Date(tokens.expiresAt).toLocaleString());
        console.log('Is Expired:', Date.now() >= tokens.expiresAt);

        const userInfo = await getUserInfo();
        if (userInfo) {
            console.log('\n👤 User Info:');
            console.log('Email:', userInfo.email);
            console.log('Name:', userInfo.name);
            console.log('Sub:', userInfo.sub);
        }

        // Check redirect URI
        const redirectUri = chrome.identity.getRedirectURL();
        console.log('\n🔗 Redirect URI:', redirectUri);
        console.log('⚠️  Make sure this URL is added to Cognito callback URLs');

    } catch (error) {
        console.error('❌ Error checking auth status:', error);
    }

    console.groupEnd();
}

/**
 * Clears all authentication data (for testing)
 */
export async function clearAuthData(): Promise<void> {
    await chrome.storage.local.remove(['authTokens', 'isAuthenticated', 'codeVerifier']);
    console.log('🗑️  Authentication data cleared');
}

// Make debug functions available globally in development
if (import.meta.env.DEV) {
    (window as any).authDebug = {
        status: debugAuthStatus,
        clear: clearAuthData,
    };
    console.log('🛠️  Auth debug tools available: window.authDebug.status() and window.authDebug.clear()');
}
