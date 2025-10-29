# How to Get Your Extension ID and Configure Cognito

## Problem

The error "Something went wrong" occurs because AWS Cognito doesn't recognize the callback URL. The Cognito test URL shows `placeholder` instead of your actual extension ID.

## Solution

### Step 1: Get Your Extension ID

1. Open Chrome and go to `chrome://extensions/`
2. Find your "React Chrome Extension"
3. Look for the **ID** field (it looks like: `abcdefghijklmnopqrstuvwxyz123456`)
4. **Copy this ID** - you'll need it for the next step

**Example:**
```
ID: kbmfpngjjgdllneeigpgjifpgocmfgmb
```

### Step 2: Configure AWS Cognito Callback URLs

1. Go to **AWS Cognito Console**
2. Select your User Pool
3. Go to **App integration** → **App clients and analytics**
4. Click on your app client (the one with ID: `55eql2a3igsleajk3o98sjucjq`)
5. Click **Edit** in the Hosted UI section

### Step 3: Update Callback URLs

Replace the placeholder URLs with your actual extension ID:

**Allowed callback URLs:**
```
chrome-extension://YOUR_ACTUAL_EXTENSION_ID/callback.html
```

**Example (replace with YOUR ID):**
```
chrome-extension://kbmfpngjjgdllneeigpgjifpgocmfgmb/callback.html
```

**Allowed sign-out URLs:**
```
chrome-extension://YOUR_ACTUAL_EXTENSION_ID/signout.html
```

**Example (replace with YOUR ID):**
```
chrome-extension://kbmfpngjjgdllneeigpgjifpgocmfgmb/signout.html
```

### Step 4: Verify Other Settings

While you're in the Cognito App Client settings, verify:

**OAuth 2.0 grant types:**
- ✅ Authorization code grant
- ✅ Implicit grant (optional)

**OpenID Connect scopes:**
- ✅ email
- ✅ openid
- ✅ phone (optional)
- ✅ profile (optional)

**Advanced settings:**
- Authentication flow session duration: 3 minutes (default)
- Refresh token expiration: 30 days (default)
- Access token expiration: 60 minutes (default)
- ID token expiration: 60 minutes (default)

### Step 5: Save and Test

1. Click **Save changes** in Cognito
2. Go back to Chrome
3. Reload your extension:
   - Go to `chrome://extensions/`
   - Click the refresh icon on your extension
4. Open the extension side panel
5. Click "Login with AWS Cognito"
6. You should now be redirected to the correct Cognito login page

## Verification

After configuring, the Cognito login URL should look like:

```
https://ap-southeast-16mxaydeu2.auth.ap-southeast-1.amazoncognito.com/login?
  client_id=55eql2a3igsleajk3o98sjucjq
  &response_type=code
  &scope=email+openid+phone
  &redirect_uri=chrome-extension://YOUR_ACTUAL_ID/callback.html
  &state=...
  &code_challenge=...
  &code_challenge_method=S256
```

Notice that `placeholder` should be replaced with your actual extension ID.

## Important Notes

### Extension ID Changes

⚠️ **Warning:** The extension ID changes when you:
- Reload an unpacked extension
- Reinstall the extension
- Load from a different folder

**Solution for Development:**
1. Load the extension once
2. Copy the extension ID
3. Configure Cognito with that ID
4. **Don't reload the unpacked extension** - just refresh it using the refresh button

### Multiple Extension IDs (Optional)

If you need to support multiple extension IDs (e.g., development and production):

1. In Cognito, add multiple callback URLs:
```
chrome-extension://dev-extension-id/callback.html
chrome-extension://prod-extension-id/callback.html
```

2. Cognito will accept any of these URLs

## Troubleshooting

### Still seeing "placeholder"?

This shouldn't happen with the current code, but if it does:

1. Check that `chrome.runtime.id` is available
2. Open DevTools on the side panel
3. Run in console:
```javascript
console.log('Extension ID:', chrome.runtime.id);
```

### Callback URL mismatch error?

If you see "redirect_uri_mismatch" error:

1. Double-check the extension ID in `chrome://extensions/`
2. Verify it matches exactly in Cognito (case-sensitive)
3. Make sure there are no extra spaces or characters
4. Ensure the URL format is exactly: `chrome-extension://ID/callback.html`

### Login page not loading?

1. Check that the Cognito domain is correct in `.env`
2. Verify the client ID is correct
3. Check browser console for CORS errors
4. Ensure the Cognito domain is accessible

## Quick Reference

**Get Extension ID:**
```
chrome://extensions/ → Find your extension → Copy ID
```

**Cognito Callback URL Format:**
```
chrome-extension://[EXTENSION_ID]/callback.html
```

**Cognito Sign-out URL Format:**
```
chrome-extension://[EXTENSION_ID]/signout.html
```

**Test Login URL (after configuration):**
```
https://[YOUR_COGNITO_DOMAIN]/login?
  client_id=[CLIENT_ID]
  &response_type=code
  &scope=email+openid+phone
  &redirect_uri=chrome-extension://[EXTENSION_ID]/callback.html
```

## Next Steps

After configuring Cognito:

1. ✅ Extension ID copied
2. ✅ Cognito callback URLs updated
3. ✅ Settings saved in Cognito
4. ✅ Extension refreshed in Chrome
5. ✅ Test login flow
6. ✅ Verify successful authentication

If you still encounter issues, check the browser console for specific error messages and refer to TROUBLESHOOTING.md.
