# OAuth2 Google Sign-In Setup Guide

This extension uses AWS Cognito with Google as an identity provider for authentication.

## Prerequisites

1. AWS Cognito User Pool configured
2. Google OAuth2 credentials configured in Cognito
3. Chrome extension built and loaded

## Setup Steps

### 1. Get Your Extension ID

After building and loading your extension in Chrome:

1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Find your extension and copy the Extension ID

### 2. Configure Cognito Callback URLs

1. Go to AWS Cognito Console
2. Navigate to your User Pool: `ap-southeast-1_6mxaYDeU2`
3. Go to "App integration" → "App clients"
4. Select your app client: `55eql2a3igsleajk3o98sjucjq`
5. Click "Edit" under "Hosted UI"
6. Add the following to "Allowed callback URLs":
   ```
   https://<your-extension-id>.chromiumapp.org/
   ```
   Replace `<your-extension-id>` with your actual extension ID

7. Add the same URL to "Allowed sign-out URLs" (optional)
8. Save changes

### 3. Configure Google Identity Provider in Cognito

Make sure Google is configured as an identity provider:

1. In Cognito User Pool, go to "Sign-in experience"
2. Under "Federated identity provider sign-in", ensure Google is added
3. Configure Google OAuth2 credentials (Client ID and Client Secret)
4. Map attributes (email, name, picture) from Google to Cognito

### 4. Environment Variables

Your `.env` file should contain:

```env
VITE_AWS_REGION=ap-southeast-1
VITE_USER_POOL_ID=ap-southeast-1_6mxaYDeU2
VITE_CLIENT_ID=55eql2a3igsleajk3o98sjucjq
VITE_COGNITO_DOMAIN=https://ap-southeast-16mxaydeu2.auth.ap-southeast-1.amazoncognito.com
VITE_OAUTH_SCOPES=email openid profile
VITE_OAUTH_RESPONSE_TYPE=code
```

### 5. Build and Test

1. Build the extension:
   ```bash
   npm run build
   ```

2. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

3. Click the extension icon to open the side panel
4. You should see the Google Sign-In button
5. Click it to authenticate

## How It Works

1. **PKCE Flow**: The extension uses PKCE (Proof Key for Code Exchange) for secure OAuth2 authentication
2. **Chrome Identity API**: Uses `chrome.identity.launchWebAuthFlow()` to handle the OAuth flow
3. **Token Management**: Stores tokens securely in `chrome.storage.local`
4. **Auto-Refresh**: Automatically refreshes access tokens when they expire
5. **User Info**: Decodes JWT ID token to get user information

## Authentication Flow

```
User clicks "Sign in with Google"
    ↓
Generate PKCE code verifier & challenge
    ↓
Launch OAuth flow with Cognito
    ↓
Cognito redirects to Google
    ↓
User authenticates with Google
    ↓
Google redirects back to Cognito
    ↓
Cognito redirects to extension with auth code
    ↓
Exchange auth code for tokens
    ↓
Store tokens in chrome.storage.local
    ↓
User is authenticated
```

## Troubleshooting

### "redirect_uri_mismatch" error
- Make sure the extension ID in Cognito callback URLs matches your actual extension ID
- The URL must end with a trailing slash: `https://<id>.chromiumapp.org/`

### "invalid_grant" error
- Check that your Cognito domain URL is correct
- Verify the client ID matches your app client

### Token refresh fails
- Ensure refresh tokens are enabled in your Cognito app client settings
- Check that the refresh token hasn't expired (default: 30 days)

### Google sign-in doesn't appear
- Verify Google is configured as an identity provider in Cognito
- Check that the identity provider name is exactly "Google" (case-sensitive)

## Security Notes

- Tokens are stored in `chrome.storage.local` (encrypted by Chrome)
- PKCE prevents authorization code interception
- Access tokens expire after 1 hour (configurable in Cognito)
- Refresh tokens can be used to get new access tokens
- Always use HTTPS in production
