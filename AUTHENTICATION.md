# AWS Cognito Authentication Implementation

## Overview

This Chrome extension now includes complete AWS Cognito authentication using OAuth 2.0 with PKCE (Proof Key for Code Exchange) flow. Users must authenticate before accessing the extension's features.

## Architecture

### Authentication Flow

```
1. User opens extension → AuthGuard checks authentication status
2. If not authenticated → Login screen displayed
3. User clicks "Login" → OAuth flow initiated with PKCE
4. Redirected to AWS Cognito hosted UI
5. User authenticates → Redirected back to callback.html
6. Authorization code exchanged for tokens
7. Tokens stored securely in Chrome storage
8. User profile loaded and displayed
9. Automatic token refresh before expiration
```

### Components

#### Core Services

**`src/services/auth-service.ts`**
- Main authentication service (singleton pattern)
- Handles login, logout, token refresh
- Manages OAuth flow with PKCE
- Automatic token refresh scheduling
- User information fetching

**`src/services/token-manager.ts`**
- Secure token storage in Chrome storage
- Token expiration checking
- PKCE data management
- User info persistence

**`src/services/pkce.ts`**
- PKCE code verifier generation
- Code challenge creation (SHA256)
- State parameter validation

#### UI Components

**`src/components/Auth/AuthGuard.tsx`**
- Protects routes requiring authentication
- Shows loading state during auth check
- Displays login screen if unauthenticated
- Wraps main application content

**`src/components/Auth/LoginButton.tsx`**
- Initiates OAuth login flow
- Shows loading state during login
- Handles login errors

**`src/components/Auth/UserProfile.tsx`**
- Displays user information
- Provides logout functionality
- Adapts to collapsed/expanded sidebar

#### Configuration

**`src/config/aws-config.ts`**
- AWS Cognito configuration
- OAuth scopes and endpoints
- Extension callback URLs

**`src/config/auth-config.ts`**
- Token refresh settings
- PKCE configuration
- Session management
- Authentication states and error types

## Configuration

### Environment Variables

Create or update `.env` file:

```env
# AWS Cognito Configuration
VITE_AWS_REGION=ap-southeast-1
VITE_USER_POOL_ID=ap-southeast-1_6mxaYDeU2
VITE_CLIENT_ID=55eql2a3igsleajk3o98sjucjq
VITE_COGNITO_DOMAIN=https://ap-southeast-16mxaydeu2.auth.ap-southeast-1.amazoncognito.com

# OAuth Configuration
VITE_OAUTH_SCOPES=email openid phone
VITE_OAUTH_RESPONSE_TYPE=code
```

### AWS Cognito Setup

1. **Create User Pool** in AWS Cognito
2. **Configure App Client**:
   - Enable OAuth 2.0 flows
   - Add callback URL: `chrome-extension://<extension-id>/callback.html`
   - Add sign-out URL: `chrome-extension://<extension-id>/signout.html`
   - Enable PKCE (S256)
   - Select scopes: email, openid, phone

3. **Configure Hosted UI**:
   - Customize login page (optional)
   - Set up identity providers

## Security Features

### PKCE Implementation
- Cryptographically secure random code verifier (128 characters)
- SHA256 code challenge
- State parameter validation
- Protection against authorization code interception

### Token Management
- Secure storage in Chrome's local storage
- Automatic token refresh 5 minutes before expiration
- Retry logic for failed refresh attempts
- Automatic logout on token expiry (configurable)

### Content Security Policy
- No remote code execution
- Strict CSP headers
- Local asset serving only

## Usage

### Protecting Routes

Wrap your application with `AuthGuard`:

```tsx
import AuthGuard from './components/Auth/AuthGuard';

function App() {
  return (
    <AuthGuard>
      <YourAppContent />
    </AuthGuard>
  );
}
```

### Getting User Information

```tsx
import { authService } from './services/auth-service';

// Get current user
const user = await authService.getCurrentUser();
console.log(user.email, user.name);
```

### Getting Valid Access Token

```tsx
import { authService } from './services/auth-service';

// Automatically refreshes if expired
const token = await authService.getValidAccessToken();

// Use token for API calls
fetch('https://api.example.com/data', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Manual Logout

```tsx
import { authService } from './services/auth-service';

await authService.logout();
```

## Token Refresh

Tokens are automatically refreshed:
- 5 minutes before expiration (configurable)
- Maximum 3 retry attempts with exponential backoff
- Automatic logout if refresh fails (configurable)

Configure in `src/config/auth-config.ts`:

```typescript
tokenRefresh: {
  refreshThresholdMinutes: 5,
  maxRetryAttempts: 3,
  retryDelayMs: 1000,
}
```

## Error Handling

### Error Types

```typescript
enum AuthErrorType {
  NETWORK_ERROR = 'network_error',
  TOKEN_EXPIRED = 'token_expired',
  INVALID_TOKEN = 'invalid_token',
  REFRESH_FAILED = 'refresh_failed',
  OAUTH_ERROR = 'oauth_error',
  UNKNOWN_ERROR = 'unknown_error',
}
```

### Handling Errors

```tsx
try {
  await authService.login();
} catch (error) {
  if (error.type === AuthErrorType.NETWORK_ERROR) {
    // Handle network error
  }
}
```

## Testing

### Manual Testing

1. **Build the extension**:
   ```bash
   npm run build
   ```

2. **Load in Chrome**:
   - Go to `chrome://extensions/`
   - Enable Developer mode
   - Click "Load unpacked"
   - Select the `dist` folder

3. **Test authentication flow**:
   - Open extension side panel
   - Click "Login with AWS Cognito"
   - Complete authentication
   - Verify user profile appears
   - Test logout functionality

### Testing Token Refresh

Modify token expiry in Chrome DevTools:
```javascript
chrome.storage.local.get(['cognito_token_expiry'], (result) => {
  // Set expiry to 4 minutes from now
  chrome.storage.local.set({
    cognito_token_expiry: Date.now() + (4 * 60 * 1000)
  });
});
```

## Troubleshooting

### Common Issues

**1. Callback URL mismatch**
- Ensure callback URL in Cognito matches: `chrome-extension://<extension-id>/callback.html`
- Extension ID changes when reloading unpacked extension

**2. PKCE validation failed**
- Check that PKCE is enabled in Cognito app client
- Verify code challenge method is S256

**3. Token refresh fails**
- Check refresh token is being stored
- Verify Cognito app client allows refresh token flow
- Check network connectivity

**4. User not redirected after login**
- Check callback.html is accessible
- Verify service worker is running
- Check browser console for errors

### Debug Mode

Enable detailed logging:

```typescript
// In auth-service.ts
console.log('Auth state:', await authService.getAuthState());
console.log('Tokens:', await TokenManager.getTokens());
console.log('User info:', await authService.getCurrentUser());
```

## Best Practices

1. **Never log tokens** in production
2. **Always use HTTPS** for Cognito domain
3. **Rotate refresh tokens** regularly
4. **Implement proper error handling** for all auth operations
5. **Test token expiration** scenarios
6. **Monitor failed login attempts**
7. **Keep dependencies updated** for security patches

## Future Enhancements

- [ ] Multi-factor authentication (MFA) support
- [ ] Social identity providers (Google, Facebook)
- [ ] Remember device functionality
- [ ] Biometric authentication
- [ ] Session management across devices
- [ ] Advanced security monitoring
- [ ] Custom authentication UI

## References

- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [OAuth 2.0 PKCE](https://oauth.net/2/pkce/)
- [Chrome Extension OAuth](https://developer.chrome.com/docs/extensions/mv3/tut_oauth/)
