// OAuth2 and Cognito Authentication Utilities
import { generateCodeChallenge, generateCodeVerifier } from './pkce';

const CLIENT_ID = (import.meta.env.VITE_CLIENT_ID as string).trim();
const CLIENT_SECRET = (import.meta.env.VITE_CLIENT_SECRET as string).trim();
const COGNITO_DOMAIN = (import.meta.env.VITE_COGNITO_DOMAIN as string).trim();
const OAUTH_SCOPES = (import.meta.env.VITE_OAUTH_SCOPES || 'email openid profile').trim();
const REDIRECT_URI = chrome.identity.getRedirectURL();

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

/**
 * Initiates the OAuth2 flow with Google via Cognito
 */
export async function signInWithGoogle(): Promise<AuthTokens> {
    try {
        // Generate PKCE parameters
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = await generateCodeChallenge(codeVerifier);

        // Store code verifier for later use
        await chrome.storage.local.set({ codeVerifier });

        // Build authorization URL manually to avoid minification issues
        // Using array join to prevent Vite from corrupting the path
        const authPath = ['oauth2', 'authorize'].join('/');
        const params = new URLSearchParams({
            client_id: CLIENT_ID,
            response_type: 'code',
            scope: OAUTH_SCOPES,
            redirect_uri: REDIRECT_URI,
            identity_provider: 'Google',
            code_challenge: codeChallenge,
            code_challenge_method: 'S256'
        });

        const authUrl = `${COGNITO_DOMAIN}/${authPath}?${params.toString()}`;

        // Debug logging
        console.log('🔐 OAuth Configuration:');
        console.log('Cognito Domain:', COGNITO_DOMAIN);
        console.log('Client ID:', CLIENT_ID);
        console.log('Redirect URI:', REDIRECT_URI);
        console.log('Full Auth URL:', authUrl);

        // Launch OAuth flow
        const redirectUrl = await chrome.identity.launchWebAuthFlow({
            url: authUrl,
            interactive: true,
        });

        if (!redirectUrl) {
            throw new Error('No redirect URL received');
        }

        // Extract authorization code from redirect URL
        const url = new URL(redirectUrl);
        const code = url.searchParams.get('code');

        if (!code) {
            throw new Error('No authorization code received');
        }

        // Exchange code for tokens
        const tokens = await exchangeCodeForTokens(code, codeVerifier);

        // Store tokens
        await storeTokens(tokens);

        return tokens;
    } catch (error) {
        console.error('Sign in error:', error);
        throw error;
    }
}

/**
 * Exchanges authorization code for tokens
 */
async function exchangeCodeForTokens(
    code: string,
    codeVerifier: string
): Promise<AuthTokens> {
    const tokenUrl = `${COGNITO_DOMAIN}/oauth2/token`;

    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
    });

    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Token exchange failed: ${error}`);
    }

    const data = await response.json();

    return {
        accessToken: data.access_token,
        idToken: data.id_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + data.expires_in * 1000,
    };
}

/**
 * Stores authentication tokens
 */
async function storeTokens(tokens: AuthTokens): Promise<void> {
    await chrome.storage.local.set({
        authTokens: tokens,
        isAuthenticated: true,
    });
}

/**
 * Retrieves stored tokens
 */
export async function getStoredTokens(): Promise<AuthTokens | null> {
    const result = await chrome.storage.local.get(['authTokens']);
    return result.authTokens || null;
}

/**
 * Checks if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
    const tokens = await getStoredTokens();
    if (!tokens) return false;

    // Check if token is expired
    if (Date.now() >= tokens.expiresAt) {
        // Try to refresh token
        try {
            await refreshAccessToken();
            return true;
        } catch (error) {
            return false;
        }
    }

    return true;
}

/**
 * Refreshes the access token using refresh token
 */
export async function refreshAccessToken(): Promise<AuthTokens> {
    const tokens = await getStoredTokens();
    if (!tokens?.refreshToken) {
        throw new Error('No refresh token available');
    }

    const tokenUrl = `${COGNITO_DOMAIN}/oauth2/token`;

    const body = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: tokens.refreshToken,
    });

    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
    });

    if (!response.ok) {
        throw new Error('Token refresh failed');
    }

    const data = await response.json();

    const newTokens: AuthTokens = {
        accessToken: data.access_token,
        idToken: data.id_token,
        refreshToken: tokens.refreshToken, // Refresh token doesn't change
        expiresAt: Date.now() + data.expires_in * 1000,
    };

    await storeTokens(newTokens);
    return newTokens;
}

/**
 * Gets user information from ID token
 */
export async function getUserInfo(): Promise<UserInfo | null> {
    const tokens = await getStoredTokens();
    if (!tokens?.idToken) return null;

    try {
        // Decode JWT token (simple base64 decode, no verification needed as it comes from Cognito)
        const payload = tokens.idToken.split('.')[1];
        const decoded = JSON.parse(atob(payload));

        return {
            email: decoded.email,
            name: decoded.name,
            picture: decoded.picture,
            sub: decoded.sub,
        };
    } catch (error) {
        console.error('Error decoding user info:', error);
        return null;
    }
}

/**
 * Signs out the user
 */
export async function signOut(): Promise<void> {
    // Clear local storage
    await chrome.storage.local.remove(['authTokens', 'isAuthenticated', 'codeVerifier']);

    // Optional: Revoke tokens on Cognito (requires additional API call)
    // For now, just clearing local storage is sufficient
}

/**
 * Gets the current access token, refreshing if necessary
 */
export async function getAccessToken(): Promise<string | null> {
    const tokens = await getStoredTokens();
    if (!tokens) return null;

    // Check if token is expired
    if (Date.now() >= tokens.expiresAt) {
        try {
            const newTokens = await refreshAccessToken();
            return newTokens.accessToken;
        } catch (error) {
            console.error('Failed to refresh token:', error);
            return null;
        }
    }

    return tokens.accessToken;
}
