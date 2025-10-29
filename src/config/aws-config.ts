// AWS Cognito Configuration
export const AWS_CONFIG = {
    region: import.meta.env.VITE_AWS_REGION || 'ap-southeast-1',
    userPoolId: import.meta.env.VITE_USER_POOL_ID || 'ap-southeast-1_6mxaYDeU2',
    clientId: import.meta.env.VITE_CLIENT_ID || '55eql2a3igsleajk3o98sjucjq',
    cognitoDomain: import.meta.env.VITE_COGNITO_DOMAIN || 'https://ap-southeast-16mxaydeu2.auth.ap-southeast-1.amazoncognito.com',
} as const;

// OAuth Configuration
export const OAUTH_CONFIG = {
    scopes: (import.meta.env.VITE_OAUTH_SCOPES || 'email openid profile').split(' '),
    responseType: import.meta.env.VITE_OAUTH_RESPONSE_TYPE || 'code',
    grantType: 'authorization_code',
} as const;

// Chrome Extension URLs
export const getExtensionUrls = () => {
    const extensionId = chrome.runtime.id;
    return {
        callbackUrl: `chrome-extension://${extensionId}/callback.html`,
        signoutUrl: `chrome-extension://${extensionId}/signout.html`,
    };
};

// Cognito Endpoints
export const getCognitoEndpoints = () => ({
    authUrl: `${AWS_CONFIG.cognitoDomain}/oauth2/authorize`,
    tokenUrl: `${AWS_CONFIG.cognitoDomain}/oauth2/token`,
    logoutUrl: `${AWS_CONFIG.cognitoDomain}/logout`,
    userInfoUrl: `${AWS_CONFIG.cognitoDomain}/oauth2/userInfo`,
});