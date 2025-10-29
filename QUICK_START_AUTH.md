# Quick Start: Google OAuth2 Authentication

## 🚀 Quick Setup (5 minutes)

### Step 1: Build the Extension
```bash
npm run build
```

### Step 2: Load in Chrome
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist` folder
5. **Copy your Extension ID** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

### Step 3: Configure Cognito
1. Go to [AWS Cognito Console](https://console.aws.amazon.com/cognito/)
2. Select your User Pool: `ap-southeast-1_6mxaYDeU2`
3. Go to **App integration** → **App clients**
4. Select your app client: `55eql2a3igsleajk3o98sjucjq`
5. Click **Edit** under "Hosted UI"
6. Add to **Allowed callback URLs**:
   ```
   https://<YOUR-EXTENSION-ID>.chromiumapp.org/
   ```
   ⚠️ Replace `<YOUR-EXTENSION-ID>` with your actual ID
   ⚠️ Don't forget the trailing slash `/`
7. Click **Save changes**

### Step 4: Test Authentication
1. Click your extension icon in Chrome
2. You should see the login screen
3. Click "Sign in with Google"
4. Authenticate with your Google account
5. You'll be redirected back to the extension

## ✅ Verification

### Check if it's working:
1. Open the extension
2. Open DevTools (F12)
3. In console, type:
   ```javascript
   window.authDebug.status()
   ```
4. You should see your authentication details

### Common Issues:

**"redirect_uri_mismatch" error**
- Your extension ID in Cognito doesn't match the actual extension ID
- Make sure the URL ends with `/`

**Login screen doesn't appear**
- Check browser console for errors
- Verify `.env` file has correct values

**"invalid_grant" error**
- Cognito domain URL might be incorrect
- Client ID might not match

## 🔧 Development Commands

```bash
# Build for production
npm run build

# Build and watch for changes
npm run dev

# Clean build folder
npm run clean
```

## 📝 Environment Variables

Your `.env` should look like this:

```env
VITE_AWS_REGION=ap-southeast-1
VITE_USER_POOL_ID=ap-southeast-1_6mxaYDeU2
VITE_CLIENT_ID=55eql2a3igsleajk3o98sjucjq
VITE_COGNITO_DOMAIN=https://ap-southeast-16mxaydeu2.auth.ap-southeast-1.amazoncognito.com
VITE_OAUTH_SCOPES=email openid profile
VITE_OAUTH_RESPONSE_TYPE=code
```

## 🐛 Debug Tools

In development mode, you have access to debug tools in the browser console:

```javascript
// Check authentication status
window.authDebug.status()

// Clear all auth data (logout)
window.authDebug.clear()
```

## 📚 More Information

- Full setup guide: [OAUTH_SETUP.md](./OAUTH_SETUP.md)
- Main README: [README.md](./README.md)
- AWS Cognito Docs: https://docs.aws.amazon.com/cognito/

## 🎯 What Happens After Login?

Once authenticated:
- Access token is stored securely
- User info is available throughout the app
- Tokens auto-refresh before expiration
- User stays logged in across browser sessions

## 🔐 Security Features

- ✅ PKCE (Proof Key for Code Exchange)
- ✅ Secure token storage (Chrome encrypted storage)
- ✅ Auto token refresh
- ✅ No sensitive data in logs
- ✅ HTTPS only
