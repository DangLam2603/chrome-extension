# Fix: Cognito Showing Email/Password Instead of Google Sign-In

## Problem
When clicking "Sign in with Google", Cognito shows an email/password form instead of redirecting directly to Google OAuth.

## Root Cause
Cognito's Hosted UI is configured to show the default sign-in page instead of going directly to Google.

## Solution: Configure Cognito Properly

### Step 1: Verify Google Identity Provider is Enabled

1. Go to AWS Cognito Console
2. Select your User Pool: `ap-southeast-1_6mxaYDeU2`
3. Go to **Sign-in experience** tab
4. Under **Federated identity provider sign-in**, verify:
   - ✅ Google is listed and enabled
   - ✅ Provider name is exactly **"Google"** (case-sensitive)

### Step 2: Configure App Client to Use Google Only

1. Go to **App integration** tab
2. Click on your App client: `55eql2a3igsleajk3o98sjucjq`
3. Scroll to **Hosted UI** section
4. Click **Edit**
5. Under **Identity providers**, make sure:
   - ✅ **Google** is checked
   - ❌ **Cognito user pool** is UNCHECKED (if you want Google only)
6. Click **Save changes**

### Step 3: Verify the Authorization URL

The extension is already sending the correct parameter:
```
identity_provider=Google
```

This should bypass the Cognito hosted UI and go directly to Google.

### Step 4: Alternative - Use Direct Google Authorization

If the above doesn't work, we can modify the code to use Google's authorization endpoint directly, then exchange the code with Cognito.

## Quick Test

After configuring Cognito:

1. Rebuild the extension:
   ```bash
   npm run build
   ```

2. Reload extension in Chrome

3. Click "Sign in with Google"

4. You should now see Google's account picker directly, not Cognito's email form

## If Still Not Working

The issue might be that Cognito requires the Hosted UI to be shown first. In that case, we have two options:

### Option A: Keep Cognito Hosted UI (Easier)
- Configure the Hosted UI to only show Google button
- Disable email/password sign-in in Cognito settings

### Option B: Direct Google OAuth (More Complex)
- Bypass Cognito Hosted UI completely
- Use Google OAuth directly
- Exchange Google token with Cognito

Let me know which approach you prefer, and I can implement it!
