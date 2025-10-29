# OAuth2 Troubleshooting Guide

## 🔍 Common Issues and Solutions

### Issue 1: "redirect_uri_mismatch" Error

**Symptoms:**
- OAuth window shows error: "redirect_uri_mismatch"
- Cannot complete sign-in

**Causes:**
- Extension ID in Cognito doesn't match actual extension ID
- Missing trailing slash in callback URL
- Typo in callback URL

**Solutions:**
1. Get your actual Extension ID:
   - Go to `chrome://extensions/`
   - Find your extension
   - Copy the ID (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

2. Update Cognito callback URL:
   - Go to AWS Cognito Console
   - Navigate to App Client settings
   - Add: `https://<YOUR-ACTUAL-ID>.chromiumapp.org/`
   - **Important**: Include the trailing slash `/`
   - Save changes

3. Rebuild and reload extension:
   ```bash
   npm run build
   ```
   - Reload extension in Chrome

---

### Issue 2: Login Screen Doesn't Appear

**Symptoms:**
- Extension opens but shows blank screen
- No login button visible

**Causes:**
- Build error
- React component not rendering
- Missing dependencies

**Solutions:**
1. Check browser console for errors (F12)

2. Verify build completed successfully:
   ```bash
   npm run build
   ```
   Look for any errors in output

3. Check if files exist in `dist` folder:
   - `dist/sidepanel.js`
   - `dist/service-worker.js`

4. Reload extension:
   - Go to `chrome://extensions/`
   - Click reload button on your extension

---

### Issue 3: "invalid_grant" Error

**Symptoms:**
- OAuth window closes
- Error in console: "Token exchange failed: invalid_grant"

**Causes:**
- Incorrect Cognito domain URL
- Wrong client ID
- Code verifier mismatch
- Authorization code expired

**Solutions:**
1. Verify `.env` configuration:
   ```env
   VITE_COGNITO_DOMAIN=https://your-domain.auth.region.amazoncognito.com
   VITE_CLIENT_ID=your-client-id
   ```

2. Check Cognito domain format:
   - Should start with `https://`
   - Should NOT end with `/`
   - Example: `https://mydomain.auth.us-east-1.amazoncognito.com`

3. Rebuild after changing `.env`:
   ```bash
   npm run build
   ```

4. Try signing in again immediately (codes expire quickly)

---

### Issue 4: OAuth Window Doesn't Open

**Symptoms:**
- Click "Sign in with Google"
- Nothing happens
- No new window opens

**Causes:**
- Pop-up blocker
- Chrome identity permission missing
- JavaScript error

**Solutions:**
1. Check pop-up blocker:
   - Look for blocked pop-up icon in address bar
   - Allow pop-ups for the extension

2. Verify `identity` permission in manifest:
   ```json
   "permissions": [
     "identity",
     "storage"
   ]
   ```

3. Check console for errors:
   - Open DevTools (F12)
   - Look for red error messages
   - Share error message for help

4. Try in incognito mode:
   - Enable extension in incognito
   - Test sign-in flow

---

### Issue 5: Token Refresh Fails

**Symptoms:**
- Logged out unexpectedly
- "Token refresh failed" in console
- Have to sign in again frequently

**Causes:**
- Refresh token expired
- Refresh token not enabled in Cognito
- Network error

**Solutions:**
1. Check Cognito app client settings:
   - Go to AWS Cognito Console
   - App client settings
   - Ensure "Refresh token expiration" is set (default: 30 days)
   - Ensure refresh token is enabled

2. Check token expiration:
   ```javascript
   window.authDebug.status()
   ```
   Look at "Expires At" timestamp

3. Clear auth data and sign in again:
   ```javascript
   window.authDebug.clear()
   ```
   Then sign in again

---

### Issue 6: "No authorization code received"

**Symptoms:**
- OAuth window closes
- Error: "No authorization code received"

**Causes:**
- User cancelled sign-in
- Cognito configuration issue
- Redirect URI not configured

**Solutions:**
1. Complete the sign-in process:
   - Don't close OAuth window manually
   - Select a Google account
   - Grant permissions

2. Verify Cognito configuration:
   - Callback URL is correct
   - Google identity provider is enabled
   - OAuth scopes are configured

3. Check Cognito logs:
   - Go to AWS Cognito Console
   - Check CloudWatch logs for errors

---

### Issue 7: Extension ID Changes After Rebuild

**Symptoms:**
- Extension ID is different after rebuilding
- Have to reconfigure Cognito each time

**Causes:**
- Loading unpacked extension generates random ID
- Need to use consistent extension ID

**Solutions:**
1. **For Development**: Use a consistent extension ID
   - Create a `key` in manifest.json
   - Or always load from same folder

2. **For Production**: Publish to Chrome Web Store
   - Published extensions have permanent IDs
   - No need to reconfigure

3. **Temporary Fix**: Keep same `dist` folder
   - Don't delete and recreate
   - Just rebuild into existing folder

---

### Issue 8: "Cannot find module './pkce'"

**Symptoms:**
- Build error or TypeScript error
- "Cannot find module './pkce' or its corresponding type declarations"

**Causes:**
- File not created
- Import path incorrect
- TypeScript configuration issue

**Solutions:**
1. Verify file exists:
   ```bash
   dir src\utils\pkce.ts
   ```

2. Check import statement in `auth.ts`:
   ```typescript
   import { generateCodeChallenge, generateCodeVerifier } from './pkce';
   ```

3. Rebuild:
   ```bash
   npm run build
   ```

---

### Issue 9: User Info Not Showing

**Symptoms:**
- Logged in successfully
- But user email/name not displayed

**Causes:**
- ID token not decoded properly
- Attribute mapping issue in Cognito
- Google didn't provide all attributes

**Solutions:**
1. Check what's in the token:
   ```javascript
   window.authDebug.status()
   ```
   Look at "User Info" section

2. Verify Cognito attribute mapping:
   - Go to AWS Cognito Console
   - Identity providers → Google
   - Check attribute mappings:
     - `email` → `email`
     - `name` → `name`
     - `picture` → `picture`

3. Check Google OAuth scopes:
   - Ensure `.env` has: `VITE_OAUTH_SCOPES=email openid profile`

---

### Issue 10: Works in Dev, Fails in Production

**Symptoms:**
- Works with `npm run dev`
- Fails after `npm run build`

**Causes:**
- Environment variables not included in build
- Vite configuration issue
- Different extension ID

**Solutions:**
1. Verify `.env` file is in project root

2. Check Vite loads environment variables:
   - Variables must start with `VITE_`
   - Example: `VITE_CLIENT_ID` ✅
   - Example: `CLIENT_ID` ❌

3. Rebuild completely:
   ```bash
   npm run clean
   npm run build
   ```

4. Check built files include environment variables:
   - Open `dist/sidepanel.js`
   - Search for your Cognito domain
   - Should be replaced with actual value

---

## 🛠️ Debug Tools

### Check Authentication Status
```javascript
// In browser console (dev mode only)
window.authDebug.status()
```

**Output shows:**
- ✅ or ❌ Token status
- Token expiration time
- User information
- Redirect URI

### Clear Authentication Data
```javascript
// In browser console (dev mode only)
window.authDebug.clear()
```

**This will:**
- Remove all tokens
- Log you out
- Clear stored data
- Require fresh sign-in

---

## 📋 Pre-Flight Checklist

Before asking for help, verify:

- [ ] Extension built successfully (`npm run build`)
- [ ] Extension loaded in Chrome
- [ ] Extension ID copied correctly
- [ ] Callback URL added to Cognito with trailing `/`
- [ ] `.env` file has all required variables
- [ ] Google identity provider enabled in Cognito
- [ ] No errors in browser console
- [ ] Tried `window.authDebug.status()` to check status

---

## 🔍 How to Get Help

When asking for help, provide:

1. **Error Message**: Exact error from console
2. **Debug Output**: Result of `window.authDebug.status()`
3. **Steps Taken**: What you've already tried
4. **Environment**: Chrome version, OS
5. **Configuration**: Cognito region, domain (no secrets!)

### Example Help Request:

```
Issue: OAuth window shows "redirect_uri_mismatch"

Error: redirect_uri_mismatch

Debug Output:
🔗 Redirect URI: https://abc123.chromiumapp.org/

Steps Taken:
- Added callback URL to Cognito
- Rebuilt extension
- Reloaded in Chrome

Environment:
- Chrome 120
- Windows 11
- Extension ID: abc123...

Configuration:
- Region: us-east-1
- Domain: mydomain.auth.us-east-1.amazoncognito.com
```

---

## 📚 Additional Resources

- [OAUTH_SETUP.md](./OAUTH_SETUP.md) - Detailed setup guide
- [QUICK_START_AUTH.md](./QUICK_START_AUTH.md) - Quick start guide
- [AUTH_CHECKLIST.md](./AUTH_CHECKLIST.md) - Setup checklist
- [AUTH_FLOW_DIAGRAM.md](./AUTH_FLOW_DIAGRAM.md) - Visual flow diagram

---

## 🆘 Still Having Issues?

1. Start fresh:
   ```bash
   npm run clean
   window.authDebug.clear()  # In console
   npm run build
   ```

2. Reload extension in Chrome

3. Try sign-in again

4. Check all steps in [AUTH_CHECKLIST.md](./AUTH_CHECKLIST.md)

5. Review [OAUTH_SETUP.md](./OAUTH_SETUP.md) for detailed instructions

---

**Last Updated**: October 29, 2025
