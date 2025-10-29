# Troubleshooting Guide

## Common Issues and Solutions

### 1. Service Worker Errors

#### Error: "Uncaught SyntaxError: Cannot use 'import.meta' outside a module"

**Solution:** This has been fixed by:
- Removing dynamic imports from the service worker
- Using Chrome storage to pass OAuth data between callback and sidepanel
- Setting `"type": "module"` in manifest.json background configuration

#### Error: "Service worker registration failed. Status code: 15"

**Causes:**
- Syntax errors in service-worker.js
- Missing or malformed manifest.json
- Service worker file not found

**Solution:**
1. Rebuild the extension: `npm run build`
2. Check that `dist/service-worker.js` exists
3. Verify manifest.json has correct service worker path
4. Check Chrome DevTools console for specific errors

### 2. Manifest Errors

#### Error: "URL pattern 'https://cognito-idp.*.amazonaws.com/*' is malformed"

**Solution:** This pattern has been removed from host_permissions. The extension now uses:
```json
"host_permissions": [
    "https://*/*",
    "http://*/*",
    "https://*.amazoncognito.com/*"
]
```

### 3. OAuth/Authentication Errors

#### Callback URL Mismatch

**Problem:** OAuth callback fails with redirect_uri mismatch

**Solution:**
1. Get your extension ID from `chrome://extensions/`
2. Update AWS Cognito App Client settings:
   - Callback URL: `chrome-extension://<YOUR_EXTENSION_ID>/callback.html`
   - Sign-out URL: `chrome-extension://<YOUR_EXTENSION_ID>/signout.html`
3. Rebuild and reload extension

#### PKCE Validation Failed

**Problem:** "Invalid code_verifier" or PKCE errors

**Solution:**
1. Ensure PKCE is enabled in Cognito App Client
2. Verify code challenge method is set to S256
3. Check that code_verifier is being stored and retrieved correctly

#### Token Refresh Fails

**Problem:** Tokens expire and refresh fails

**Solution:**
1. Check that refresh token is being stored
2. Verify Cognito App Client allows refresh token flow
3. Check network connectivity
4. Review Chrome DevTools console for specific errors

### 4. Build Errors

#### Module Not Found

**Problem:** Build fails with module resolution errors

**Solution:**
```bash
# Clean and reinstall dependencies
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### TypeScript Errors

**Problem:** Type errors during build

**Solution:**
1. Check that all type definitions are installed
2. Verify `@types/chrome` is in devDependencies
3. Run `npm install --save-dev @types/chrome`

### 5. Runtime Errors

#### Extension Not Loading

**Checklist:**
- [ ] Extension built successfully (`npm run build`)
- [ ] `dist` folder exists and contains files
- [ ] Manifest.json is valid JSON
- [ ] All required files are in dist folder
- [ ] Chrome Developer Mode is enabled

**Steps:**
1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist` folder
5. Check for errors in the extension card

#### Side Panel Not Opening

**Problem:** Clicking extension icon does nothing

**Solution:**
1. Check service worker is running (click "service worker" link in extension card)
2. Verify `src/sidepanel/index.html` exists in dist
3. Check Chrome console for errors
4. Try reloading the extension

#### Authentication Screen Not Showing

**Problem:** Extension shows blank screen or loading forever

**Solution:**
1. Open Chrome DevTools on the side panel
2. Check console for errors
3. Verify AuthGuard component is rendering
4. Check that auth-service.ts is being loaded correctly

### 6. Storage Issues

#### Data Not Persisting

**Problem:** Settings or tokens lost after closing browser

**Solution:**
1. Verify using `chrome.storage.local` or `chrome.storage.sync`
2. Check storage quota hasn't been exceeded
3. Test storage operations in DevTools:
```javascript
// Test write
chrome.storage.local.set({ test: 'value' }, () => {
  console.log('Saved');
});

// Test read
chrome.storage.local.get(['test'], (result) => {
  console.log('Retrieved:', result.test);
});
```

### 7. Development Workflow Issues

#### Changes Not Reflecting

**Problem:** Code changes don't appear after rebuild

**Solution:**
1. Rebuild: `npm run build`
2. Go to `chrome://extensions/`
3. Click refresh icon on extension card
4. Hard reload any open tabs (Ctrl+Shift+R)
5. Close and reopen side panel

#### Hot Reload Not Working

**Note:** Chrome extensions don't support hot reload. You must:
1. Make changes
2. Run `npm run build`
3. Reload extension in Chrome
4. Reload affected pages

### 8. Debugging Tips

#### Enable Verbose Logging

Add to service worker or components:
```typescript
console.log('Debug:', { variable, state, data });
```

#### Check Service Worker Logs

1. Go to `chrome://extensions/`
2. Find your extension
3. Click "service worker" link
4. View console logs

#### Check Side Panel Logs

1. Open side panel
2. Right-click in panel
3. Select "Inspect"
4. View console in DevTools

#### Check Storage Contents

```javascript
// View all storage
chrome.storage.local.get(null, (items) => {
  console.log('All storage:', items);
});

// View specific keys
chrome.storage.local.get(['cognito_access_token', 'cognito_user_info'], (result) => {
  console.log('Auth data:', result);
});
```

### 9. Performance Issues

#### Extension Slow to Load

**Solutions:**
- Check bundle sizes in build output
- Lazy load heavy components
- Optimize images and assets
- Use code splitting

#### High Memory Usage

**Solutions:**
- Clean up event listeners
- Dispose of unused resources
- Limit message history
- Implement pagination for large lists

### 10. Security Issues

#### CSP Violations

**Problem:** Content Security Policy errors

**Solution:**
1. Check manifest.json CSP configuration
2. Avoid inline scripts and styles
3. Use nonces for dynamic content
4. Review Chrome DevTools Security tab

#### Token Exposure

**Prevention:**
- Never log tokens in production
- Use secure storage (chrome.storage.local)
- Implement token rotation
- Clear tokens on logout

## Getting Help

If you're still experiencing issues:

1. **Check Chrome DevTools Console** - Most errors are logged here
2. **Review Extension Logs** - Check service worker and side panel consoles
3. **Verify Configuration** - Double-check .env and manifest.json
4. **Test in Incognito** - Rule out extension conflicts
5. **Check Chrome Version** - Ensure you're using a recent version
6. **Review Documentation** - See AUTHENTICATION.md and README.md

## Useful Commands

```bash
# Clean build
npm run clean
npm run build

# View build output
ls -la dist/

# Check for TypeScript errors
npx tsc --noEmit

# Test extension loading
# 1. Build
npm run build
# 2. Load in Chrome
# chrome://extensions/ -> Load unpacked -> select dist/
```

## Common Error Messages

| Error | Likely Cause | Solution |
|-------|--------------|----------|
| "Cannot use import.meta" | Service worker module issue | Fixed in latest build |
| "Status code: 15" | Service worker registration failed | Check service-worker.js syntax |
| "redirect_uri mismatch" | Cognito callback URL wrong | Update Cognito settings |
| "Invalid state parameter" | PKCE state validation failed | Check state storage/retrieval |
| "Token expired" | Access token expired | Implement token refresh |
| "Network error" | API call failed | Check network and CORS |

## Debug Checklist

Before reporting an issue, verify:

- [ ] Extension builds without errors
- [ ] All files present in dist folder
- [ ] Manifest.json is valid
- [ ] Service worker loads successfully
- [ ] No console errors in DevTools
- [ ] Chrome is up to date
- [ ] Developer mode is enabled
- [ ] Extension is enabled
- [ ] Correct extension ID in Cognito
- [ ] Environment variables are set
- [ ] Network connectivity is working
