# OAuth2 Authentication Flow Diagram

## 🔄 Complete Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER CLICKS EXTENSION                        │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SidePanelApp.tsx (useAuth hook)                   │
│                    Check: isAuthenticated?                           │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
            ┌───────────────┐              ┌────────────────┐
            │      NO       │              │      YES       │
            │ Not Logged In │              │   Logged In    │
            └───────────────┘              └────────────────┘
                    │                               │
                    ▼                               ▼
    ┌──────────────────────────┐      ┌──────────────────────────┐
    │   Show LoginScreen.tsx   │      │   Show Main App          │
    │   "Sign in with Google"  │      │   (ChatBox, MCP, etc.)   │
    └──────────────────────────┘      └──────────────────────────┘
                    │
                    │ User clicks button
                    ▼
    ┌──────────────────────────────────────────────────────────────┐
    │                    signInWithGoogle()                         │
    │                    (src/utils/auth.ts)                        │
    └──────────────────────────────────────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────────────────────────────────┐
    │  Step 1: Generate PKCE Parameters                             │
    │  - codeVerifier = random string                               │
    │  - codeChallenge = SHA256(codeVerifier)                       │
    │  - Store codeVerifier in chrome.storage.local                 │
    └──────────────────────────────────────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────────────────────────────────┐
    │  Step 2: Build Authorization URL                              │
    │  https://cognito-domain/oauth2/authorize?                     │
    │    client_id=...                                              │
    │    response_type=code                                         │
    │    scope=email+openid+profile                                 │
    │    redirect_uri=https://extension-id.chromiumapp.org/         │
    │    identity_provider=Google                                   │
    │    code_challenge=...                                         │
    │    code_challenge_method=S256                                 │
    └──────────────────────────────────────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────────────────────────────────┐
    │  Step 3: Launch OAuth Flow                                    │
    │  chrome.identity.launchWebAuthFlow()                          │
    │  Opens new window with Cognito login                          │
    └──────────────────────────────────────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────────────────────────────────┐
    │                    AWS COGNITO                                │
    │  Redirects to Google OAuth                                    │
    └──────────────────────────────────────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────────────────────────────────┐
    │                    GOOGLE OAUTH                               │
    │  User selects Google account                                  │
    │  User grants permissions                                      │
    └──────────────────────────────────────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────────────────────────────────┐
    │                    GOOGLE → COGNITO                           │
    │  Google sends user info to Cognito                            │
    │  Cognito creates/updates user in User Pool                    │
    └──────────────────────────────────────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────────────────────────────────┐
    │                COGNITO → EXTENSION                            │
    │  Redirects to: https://extension-id.chromiumapp.org/?code=... │
    └──────────────────────────────────────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────────────────────────────────┐
    │  Step 4: Extract Authorization Code                           │
    │  Parse URL and get 'code' parameter                           │
    └──────────────────────────────────────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────────────────────────────────┐
    │  Step 5: Exchange Code for Tokens                             │
    │  POST https://cognito-domain/oauth2/token                     │
    │  Body:                                                        │
    │    grant_type=authorization_code                              │
    │    client_id=...                                              │
    │    code=...                                                   │
    │    redirect_uri=...                                           │
    │    code_verifier=... (from storage)                           │
    └──────────────────────────────────────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────────────────────────────────┐
    │  Step 6: Receive Tokens                                       │
    │  {                                                            │
    │    access_token: "...",                                       │
    │    id_token: "...",                                           │
    │    refresh_token: "...",                                      │
    │    expires_in: 3600                                           │
    │  }                                                            │
    └──────────────────────────────────────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────────────────────────────────┐
    │  Step 7: Store Tokens                                         │
    │  chrome.storage.local.set({                                   │
    │    authTokens: { ... },                                       │
    │    isAuthenticated: true                                      │
    │  })                                                           │
    └──────────────────────────────────────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────────────────────────────────┐
    │  Step 8: Decode User Info from ID Token                       │
    │  Parse JWT to get email, name, picture, sub                   │
    └──────────────────────────────────────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────────────────────────────────┐
    │                    LOGIN SUCCESS!                             │
    │  - useAuth hook detects change                                │
    │  - isLoggedIn = true                                          │
    │  - Main app renders                                           │
    └──────────────────────────────────────────────────────────────┘
```

## 🔄 Token Refresh Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│              User makes API call (needs access token)                │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │   getAccessToken() called     │
                    └───────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │   Check: Token expired?       │
                    └───────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
            ┌───────────┐                  ┌────────────┐
            │    NO     │                  │    YES     │
            │ Not Expired│                 │  Expired   │
            └───────────┘                  └────────────┘
                    │                               │
                    ▼                               ▼
    ┌──────────────────────┐      ┌────────────────────────────────┐
    │ Return access token  │      │  Call refreshAccessToken()     │
    └──────────────────────┘      └────────────────────────────────┘
                                                    │
                                                    ▼
                                    ┌───────────────────────────────┐
                                    │ POST /oauth2/token            │
                                    │ grant_type=refresh_token      │
                                    │ refresh_token=...             │
                                    └───────────────────────────────┘
                                                    │
                                                    ▼
                                    ┌───────────────────────────────┐
                                    │ Receive new tokens            │
                                    │ Store in chrome.storage.local │
                                    └───────────────────────────────┘
                                                    │
                                                    ▼
                                    ┌───────────────────────────────┐
                                    │ Return new access token       │
                                    └───────────────────────────────┘
```

## 🚪 Sign Out Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      User clicks "Sign Out"                          │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │   signOut() called            │
                    │   (src/utils/auth.ts)         │
                    └───────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │ Clear chrome.storage.local:   │
                    │ - authTokens                  │
                    │ - isAuthenticated             │
                    │ - codeVerifier                │
                    └───────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │ useAuth hook detects change   │
                    │ isLoggedIn = false            │
                    └───────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │ Show LoginScreen again        │
                    └───────────────────────────────┘
```

## 📦 Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SidePanelApp.tsx                             │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                      useAuth() hook                         │    │
│  │  - isAuthChecking                                           │    │
│  │  - isLoggedIn                                               │    │
│  │  - user                                                     │    │
│  │  - signOut()                                                │    │
│  │  - refreshAuth()                                            │    │
│  └────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│              ┌───────────────┴───────────────┐                      │
│              ▼                               ▼                       │
│  ┌──────────────────────┐      ┌──────────────────────┐            │
│  │   LoginScreen.tsx    │      │   MainLayout         │            │
│  │   (if not logged in) │      │   (if logged in)     │            │
│  └──────────────────────┘      └──────────────────────┘            │
│              │                                                       │
│              ▼                                                       │
│  ┌──────────────────────┐                                           │
│  │ signInWithGoogle()   │                                           │
│  └──────────────────────┘                                           │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         src/utils/auth.ts                            │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  - signInWithGoogle()                                       │    │
│  │  - exchangeCodeForTokens()                                  │    │
│  │  - storeTokens()                                            │    │
│  │  - getStoredTokens()                                        │    │
│  │  - isAuthenticated()                                        │    │
│  │  - refreshAccessToken()                                     │    │
│  │  - getUserInfo()                                            │    │
│  │  - signOut()                                                │    │
│  │  - getAccessToken()                                         │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         src/utils/pkce.ts                            │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  - generateCodeVerifier()                                   │    │
│  │  - generateCodeChallenge()                                  │    │
│  │  - base64URLEncode()                                        │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    chrome.storage.local                              │
│  {                                                                   │
│    authTokens: { accessToken, idToken, refreshToken, expiresAt },   │
│    isAuthenticated: true,                                            │
│    codeVerifier: "..."                                               │
│  }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

## 🔐 Security Layers

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Security Layer 1                             │
│                    PKCE (Code Challenge)                             │
│  Prevents authorization code interception attacks                    │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Security Layer 2                             │
│                  Chrome Identity API                                 │
│  Secure OAuth flow handling by Chrome                                │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Security Layer 3                             │
│                  chrome.storage.local                                │
│  Encrypted storage by Chrome (OS-level encryption)                   │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Security Layer 4                             │
│                    HTTPS Only                                        │
│  All OAuth communications over HTTPS                                 │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Security Layer 5                             │
│                  Token Expiration                                    │
│  Access tokens expire after 1 hour                                   │
│  Refresh tokens expire after 30 days                                 │
└─────────────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow

```
User Action → LoginScreen → signInWithGoogle() → PKCE Generation
                                                        │
                                                        ▼
                                            Chrome Identity API
                                                        │
                                                        ▼
                                                AWS Cognito
                                                        │
                                                        ▼
                                                Google OAuth
                                                        │
                                                        ▼
                                            Authorization Code
                                                        │
                                                        ▼
                                            Token Exchange
                                                        │
                                                        ▼
                                            chrome.storage.local
                                                        │
                                                        ▼
                                            useAuth Hook
                                                        │
                                                        ▼
                                            Main App Renders
```

---

**Note**: This diagram shows the complete OAuth2 flow with PKCE for the Chrome extension. All communication happens over HTTPS and tokens are stored securely in Chrome's encrypted storage.
