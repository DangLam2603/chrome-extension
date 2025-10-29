# Debug Helper Guide

## Current Error: "Something went wrong"

This error appears when the side panel fails to load. Let's debug step by step.

## Step 1: Check Extension ID

1. Open Chrome DevTools on the side panel:
   - Open the extension side panel
   - Right-click anywhere in the panel
   - Select "Inspect"
   
2. In the Console tab, run:
```javascript
console.log('Extension ID:', chrome.runtime.id);
```

3. Copy the extension ID that appears

## Step 2: Check if Files are Loading

In the same DevTools Console, check for errors:

Look for errors like:
- `Failed to load resource`
- `404 Not Found`
- `Module not found`
- `Unexpected token`

## Step 3: Check Service Worker

1. Go to `chrome://extensions/`
2. Find your extension
3. Click on "service worker" (it should say "active")
4. Check the console for errors

## Step 4: Verify Build Output

Check that these files exist in your `dist` folder:

```
dist/
├── callback.html ✓
├── signout.html ✓
├── manifest.json ✓
├── service-worker.js ✓
├── sidepanel.js ✓
├── content.js ✓
├── content.css ✓
├── options.js ✓
├── chunks/
│   ├── auth-service-*.js ✓
│   ├── globals-*.js ✓
│   └── modulepreload-polyfill-*.js ✓
└── src/
    ├── sidepanel/
    │   └── index.html ✓
    └── options/
        └── index.html ✓
```

## Step 5: Check Manifest Configuration

Open `dist/manifest.json` and verify:

```json
{
  "side_panel": {
    "default_path": "src/sidepanel/index.html"
  }
}
```

## Step 6: Test Authentication Flow

### 6.1 Check Extension ID in Auth Service

Open DevTools Console in the side panel and run:

```javascript
// Check if chrome.runtime is available
console.log('Chrome runtime:', chrome.runtime);

// Check extension ID
console.log('Extension ID:', chrome.runtime.id);

// Check if auth service can build URLs
const extensionId = chrome.runtime.id;
console.log('Callback URL:', `chrome-extension://${extensionId}/callback.html`);
```

### 6.2 Check Cognito Configuration

Run this in the console to see what URL will be used for login:

```javascript
// Get the auth URL that will be used
const extensionId = chrome.runtime.id;
const callbackUrl = `chrome-extension://${extensionId}/callback.html`;
const authUrl = 'https://ap-southeast-16mxaydeu2.auth.ap-southeast-1.amazoncognito.com/oauth2/authorize';
const clientId = '55eql2a3igsleajk3o98sjucjq';
const scopes = 'email openid phone';

const params = new URLSearchParams({
  client_id: clientId,
  response_type: 'code',
  scope: scopes,
  redirect_uri: callbackUrl,
});

console.log('Login URL:', `${authUrl}?${params.toString()}`);
```

Copy this URL and check if the `redirect_uri` parameter has your actual extension ID (not "placeholder").

## Step 7: Check Storage

Check if there's any stored auth data:

```javascript
// Check local storage
chrome.storage.local.get(null, (items) => {
  console.log('Local storage:', items);
});

// Check sync storage
chrome.storage.sync.get(null, (items) => {
  console.log('Sync storage:', items);
});
```

## Step 8: Test Components Individually

### Test if React is loading:

```javascript
// Check if React root exists
const root = document.getElementById('sidepanel-root');
console.log('Root element:', root);
console.log('Root has children:', root?.children.length);
```

### Test if AuthGuard is working:

```javascript
// This should show the current auth state
chrome.storage.local.get(['cognito_access_token'], (result) => {
  console.log('Has access token:', !!result.cognito_access_token);
});
```

## Common Issues and Solutions

### Issue 1: "Failed to load resource: net::ERR_FILE_NOT_FOUND"

**Cause:** Files are not in the correct location

**Solution:**
```bash
npm run build
# Check that dist folder has all files
```

### Issue 2: "Uncaught SyntaxError: Unexpected token '<'"

**Cause:** HTML file being loaded as JavaScript

**Solution:** Check manifest.json paths are correct

### Issue 3: "Cannot read properties of undefined (reading 'id')"

**Cause:** chrome.runtime not available

**Solution:** Ensure code runs in extension context, not regular web page

### Issue 4: Blank screen, no errors

**Cause:** React component error caught by error boundary

**Solution:** Check for console warnings, add error logging

## Step 9: Enable Verbose Logging

Add this to the top of `src/sidepanel/sidepanel.tsx` (before building):

```typescript
console.log('=== SIDEPANEL LOADING ===');
console.log('Extension ID:', chrome.runtime.id);
console.log('Location:', window.location.href);

window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});
```

Then rebuild and check console.

## Step 10: Check Network Tab

In DevTools Network tab:
1. Reload the side panel
2. Check if all resources load successfully
3. Look for any 404 or failed requests

## Quick Diagnostic Script

Run this complete diagnostic in the DevTools Console:

```javascript
console.log('=== EXTENSION DIAGNOSTICS ===');
console.log('Extension ID:', chrome.runtime.id);
console.log('Manifest:', chrome.runtime.getManifest());
console.log('URL:', window.location.href);

// Check DOM
console.log('Root element:', document.getElementById('sidepanel-root'));
console.log('Body classes:', document.body.className);

// Check storage
chrome.storage.local.get(null, (local) => {
  console.log('Local storage:', local);
  chrome.storage.sync.get(null, (sync) => {
    console.log('Sync storage:', sync);
  });
});

// Check if modules loaded
console.log('React available:', typeof React !== 'undefined');
console.log('ReactDOM available:', typeof ReactDOM !== 'undefined');

console.log('=== END DIAGNOSTICS ===');
```

## What to Report

If you still have issues, provide:

1. **Extension ID** (from chrome://extensions/)
2. **Console errors** (from DevTools)
3. **Service worker errors** (from chrome://extensions/ → service worker)
4. **Network errors** (from DevTools Network tab)
5. **Build output** (from `npm run build`)
6. **Manifest content** (from dist/manifest.json)

## Next Steps

Based on the error you're seeing:

1. **"Something went wrong"** → Check DevTools Console for React errors
2. **Blank screen** → Check if files are loading in Network tab
3. **Login not working** → Follow GET_EXTENSION_ID.md to configure Cognito
4. **Service worker errors** → Check service worker console in chrome://extensions/

## Quick Fix Checklist

- [ ] Extension built successfully (`npm run build`)
- [ ] All files present in dist folder
- [ ] Extension loaded in Chrome
- [ ] Extension ID copied
- [ ] Cognito callback URLs updated with actual extension ID
- [ ] Extension refreshed (not reloaded)
- [ ] DevTools Console checked for errors
- [ ] Service worker is active
- [ ] Network tab shows all resources loading

If all checks pass and you still see errors, the issue is likely in the React component rendering. Check the console for specific React error messages.
