# Quick Setup Guide

## Prerequisites

- Node.js 16+ installed
- Chrome browser
- AWS Cognito User Pool configured

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment

Create or update `.env` file in the project root:

```env
# AWS Cognito Configuration
VITE_AWS_REGION=ap-southeast-1
VITE_USER_POOL_ID=your-user-pool-id
VITE_CLIENT_ID=your-client-id
VITE_COGNITO_DOMAIN=https://your-domain.auth.region.amazoncognito.com

# OAuth Configuration
VITE_OAUTH_SCOPES=email openid phone
VITE_OAUTH_RESPONSE_TYPE=code
```

## Step 3: Build the Extension

```bash
npm run build
```

This will create a `dist` folder with all the extension files.

## Step 4: Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right corner)
3. Click **"Load unpacked"**
4. Select the `dist` folder from your project
5. The extension should now appear in your extensions list

## Step 5: Get Extension ID

1. In `chrome://extensions/`, find your extension
2. Copy the **Extension ID** (looks like: `abcdefghijklmnopqrstuvwxyz123456`)
3. You'll need this for AWS Cognito configuration

## Step 6: Configure AWS Cognito

### 6.1 Create User Pool (if not exists)

1. Go to AWS Cognito Console
2. Click "Create user pool"
3. Follow the wizard to create your user pool

### 6.2 Configure App Client

1. In your User Pool, go to "App integration" → "App clients"
2. Create or edit an app client
3. Configure the following:

**OAuth 2.0 Settings:**
- ✅ Authorization code grant
- ✅ Refresh token
- ✅ PKCE (Proof Key for Code Exchange)

**Callback URLs:**
```
chrome-extension://YOUR_EXTENSION_ID/callback.html
```

**Sign-out URLs:**
```
chrome-extension://YOUR_EXTENSION_ID/signout.html
```

**OAuth Scopes:**
- ✅ email
- ✅ openid
- ✅ phone (optional)

**Advanced settings:**
- Code challenge method: **S256**

4. Save the App Client ID

### 6.3 Configure Hosted UI (Optional)

1. Go to "App integration" → "Domain"
2. Create a Cognito domain or use custom domain
3. Customize the login page if desired

## Step 7: Update Environment Variables

Update your `.env` file with the actual values:

```env
VITE_AWS_REGION=ap-southeast-1
VITE_USER_POOL_ID=ap-southeast-1_XXXXXXXXX
VITE_CLIENT_ID=your-actual-client-id
VITE_COGNITO_DOMAIN=https://your-actual-domain.auth.ap-southeast-1.amazoncognito.com
```

## Step 8: Rebuild and Reload

```bash
# Rebuild with new configuration
npm run build

# In Chrome:
# 1. Go to chrome://extensions/
# 2. Click the refresh icon on your extension
```

## Step 9: Test the Extension

1. Click the extension icon in Chrome toolbar
2. The side panel should open
3. You should see the login screen
4. Click "Login with AWS Cognito"
5. Complete authentication in the popup window
6. You should be redirected back and see the main interface

## Verification Checklist

- [ ] Extension loads without errors
- [ ] Service worker is running (check in chrome://extensions/)
- [ ] Side panel opens when clicking extension icon
- [ ] Login button appears
- [ ] OAuth popup opens when clicking login
- [ ] Can authenticate with Cognito
- [ ] Redirected back to extension after login
- [ ] User profile appears in sidebar
- [ ] Can navigate between sections (ChatBox, MCP, Auto-Connect)
- [ ] Can logout successfully

## Troubleshooting

### Extension Not Loading

**Check:**
- Build completed successfully
- `dist` folder exists and contains files
- No errors in Chrome console

**Fix:**
```bash
npm run clean
npm run build
```

### OAuth Callback Fails

**Check:**
- Extension ID matches in Cognito callback URL
- Callback URL format: `chrome-extension://EXTENSION_ID/callback.html`
- PKCE is enabled in Cognito

**Fix:**
1. Get correct extension ID from chrome://extensions/
2. Update Cognito callback URLs
3. Rebuild extension

### Service Worker Errors

**Check:**
- Chrome DevTools console in service worker
- Click "service worker" link in chrome://extensions/

**Fix:**
- Review TROUBLESHOOTING.md
- Check service-worker.js syntax

## Development Workflow

### Making Changes

1. Edit source files in `src/`
2. Rebuild: `npm run build`
3. Reload extension in Chrome
4. Test changes

### Debugging

**Service Worker:**
```
chrome://extensions/ → Click "service worker" → View console
```

**Side Panel:**
```
Open side panel → Right-click → Inspect → View console
```

**Storage:**
```javascript
// In DevTools console
chrome.storage.local.get(null, console.log);
```

## Project Structure

```
├── src/
│   ├── background/
│   │   └── service-worker.ts       # Background service worker
│   ├── components/
│   │   ├── Auth/                   # Authentication components
│   │   ├── Layout/                 # Layout components
│   │   ├── Navigation/             # Navigation components
│   │   └── Sections/               # Main section components
│   ├── config/
│   │   ├── auth-config.ts          # Auth configuration
│   │   └── aws-config.ts           # AWS Cognito config
│   ├── services/
│   │   ├── auth-service.ts         # Main auth service
│   │   ├── token-manager.ts        # Token management
│   │   └── pkce.ts                 # PKCE utilities
│   ├── sidepanel/
│   │   ├── sidepanel.tsx           # Side panel entry
│   │   └── SidePanelApp.tsx        # Main app component
│   └── types/
│       └── index.ts                # TypeScript types
├── public/
│   ├── manifest.json               # Extension manifest
│   ├── callback.html               # OAuth callback page
│   └── signout.html                # Sign-out page
├── dist/                           # Built extension (generated)
├── .env                            # Environment variables
└── package.json                    # Dependencies and scripts
```

## Next Steps

1. **Customize UI** - Modify components in `src/components/`
2. **Add Features** - Implement MCP connections and auto-connect rules
3. **Test Thoroughly** - Test all authentication flows
4. **Deploy** - Prepare for Chrome Web Store submission

## Useful Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [OAuth 2.0 PKCE](https://oauth.net/2/pkce/)
- [Manifest V3 Migration](https://developer.chrome.com/docs/extensions/mv3/intro/)

## Support

For issues and questions:
1. Check TROUBLESHOOTING.md
2. Review AUTHENTICATION.md
3. Check Chrome DevTools console
4. Review service worker logs
