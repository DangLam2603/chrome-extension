# OAuth2 Integration Checklist

Use this checklist to ensure your Google OAuth2 authentication is properly configured.

## ✅ Pre-Setup Checklist

- [ ] Node.js and npm installed
- [ ] Chrome browser installed
- [ ] AWS Cognito User Pool created
- [ ] Google OAuth2 configured in Cognito
- [ ] `.env` file configured with correct values

## ✅ Build & Load Checklist

- [ ] Run `npm install` to install dependencies
- [ ] Run `npm run build` successfully
- [ ] Load extension in Chrome (`chrome://extensions/`)
- [ ] Extension ID copied from Chrome
- [ ] No build errors in console

## ✅ Cognito Configuration Checklist

- [ ] Logged into AWS Cognito Console
- [ ] Found User Pool: `ap-southeast-1_6mxaYDeU2`
- [ ] Found App Client: `55eql2a3igsleajk3o98sjucjq`
- [ ] Added callback URL: `https://<extension-id>.chromiumapp.org/`
- [ ] Callback URL has trailing slash `/`
- [ ] Google is configured as Identity Provider
- [ ] OAuth scopes include: `email`, `openid`, `profile`
- [ ] Saved all changes in Cognito

## ✅ Extension Permissions Checklist

- [ ] `manifest.json` includes `"identity"` permission
- [ ] `manifest.json` includes `"storage"` permission
- [ ] Extension has proper host permissions
- [ ] No permission errors in Chrome

## ✅ Testing Checklist

- [ ] Extension icon appears in Chrome toolbar
- [ ] Clicking icon opens side panel
- [ ] Login screen appears (if not authenticated)
- [ ] "Sign in with Google" button visible
- [ ] Clicking button opens OAuth window
- [ ] Can select Google account
- [ ] Successfully redirected back to extension
- [ ] Main app appears after login
- [ ] No errors in browser console

## ✅ Verification Checklist

- [ ] Open DevTools (F12)
- [ ] Run `window.authDebug.status()` in console
- [ ] See authentication tokens
- [ ] See user information (email, name)
- [ ] Token expiry time is in the future
- [ ] Refresh extension - still logged in
- [ ] Close and reopen Chrome - still logged in

## ✅ Files Created/Modified

### New Files Created:
- [ ] `src/components/Auth/LoginScreen.tsx` - Login UI component
- [ ] `src/hooks/useAuth.ts` - Authentication hook
- [ ] `src/utils/auth.ts` - OAuth2 utilities
- [ ] `src/utils/pkce.ts` - PKCE implementation
- [ ] `src/utils/authDebug.ts` - Debug utilities
- [ ] `src/types/auth.ts` - TypeScript types
- [ ] `OAUTH_SETUP.md` - Detailed setup guide
- [ ] `QUICK_START_AUTH.md` - Quick start guide
- [ ] `AUTH_CHECKLIST.md` - This checklist

### Modified Files:
- [ ] `src/sidepanel/SidePanelApp.tsx` - Added auth check
- [ ] `src/background/service-worker.ts` - Added auth messages
- [ ] `public/manifest.json` - Added identity permission
- [ ] `.env` - Added redirect URI notes
- [ ] `README.md` - Added authentication section

## 🐛 Troubleshooting

If something doesn't work, check:

1. **Extension ID mismatch**
   - Extension ID in Cognito = Extension ID in Chrome?
   
2. **Environment variables**
   - All VITE_* variables set in `.env`?
   - Cognito domain URL correct?
   
3. **Cognito configuration**
   - Google identity provider enabled?
   - Callback URL has trailing slash?
   - App client has correct settings?
   
4. **Browser console**
   - Any error messages?
   - Run `window.authDebug.status()` for details
   
5. **Rebuild required**
   - After changing `.env`, rebuild: `npm run build`
   - Reload extension in Chrome

## 📞 Need Help?

1. Check [OAUTH_SETUP.md](./OAUTH_SETUP.md) for detailed instructions
2. Check [QUICK_START_AUTH.md](./QUICK_START_AUTH.md) for quick setup
3. Use `window.authDebug.status()` to diagnose issues
4. Check browser console for error messages
5. Verify Cognito configuration in AWS Console

## 🎉 Success Criteria

You've successfully integrated OAuth2 when:

✅ Login screen appears on first use
✅ Google OAuth window opens
✅ Successfully authenticate with Google
✅ Redirected back to extension
✅ Main app loads with user data
✅ Stay logged in after refresh
✅ No console errors

---

**Last Updated:** October 29, 2025
**Integration Type:** Google OAuth2 via AWS Cognito
**Security:** PKCE Flow
