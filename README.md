# Chrome Extension with React + Vite + Tailwind CSS

A modern Chrome extension built with React, Vite, and Tailwind CSS that injects a React-based UI directly into web pages without using a popup.

## Features

- **Manifest V3** compliance with modern Chrome extension standards
- **React 18** with TypeScript support
- **Tailwind CSS** for styling
- **Vite** for fast development and building
- **Content Script Injection** - No popup, UI injected directly into pages
- **Side Panel** for extended functionality
- **Options Page** for settings management
- **Background Service Worker** for tab management and messaging
- **Keyboard Shortcuts** (Ctrl+Shift+E to toggle widget)
- **Storage API** for persistent settings

## Project Structure

```
├── public/
│   └── manifest.json          # Extension manifest
├── src/
│   ├── background/
│   │   └── service-worker.ts  # Background service worker
│   ├── content/
│   │   ├── components/
│   │   │   └── ExtensionWidget.tsx  # Main widget component
│   │   └── index.tsx          # Content script entry point
│   ├── options/
│   │   ├── index.html         # Options page HTML
│   │   └── options.tsx        # Options page React component
│   ├── sidepanel/
│   │   ├── index.html         # Side panel HTML
│   │   └── sidepanel.tsx      # Side panel React component
│   └── styles/
│       └── globals.css        # Global styles with Tailwind
├── dist/                      # Built extension files
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Extension

```bash
npm run build
```

This creates a `dist` folder with all the built extension files.

### 3. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `dist` folder from your project
5. The extension should now be loaded and visible in your extensions list

### 4. Development Mode

For development with hot reloading:

```bash
npm run dev
```

Then rebuild and reload the extension in Chrome when you make changes.

## Usage

### Widget Features

The extension injects a floating widget into web pages with three main sections:

1. **Dashboard** - Quick stats and actions
   - Active sessions counter
   - Success rate display
   - Quick action buttons

2. **Analytics** - Usage tracking
   - Pages visited today
   - Time saved metrics
   - Actions performed count

3. **Settings** - Extension configuration
   - Enable/disable toggle
   - Auto-minimize option
   - Notification preferences
   - Reset settings button

### Keyboard Shortcuts

- **Ctrl+Shift+E** - Toggle widget visibility on any page

### Side Panel

Click the extension icon in the toolbar to open the side panel, which provides:
- Current tab information
- Extension control toggles
- Widget action buttons
- Quick statistics

### Options Page

Right-click the extension icon and select "Options" to access:
- General settings configuration
- Theme selection
- Keyboard shortcut customization
- Data management options

## Security Considerations

This extension follows Chrome Web Store security best practices:

- **No Remote Code Execution** - All code is bundled and served locally
- **Minimal Permissions** - Only requests necessary permissions (storage, activeTab, sidePanel)
- **Content Security Policy** - Strict CSP prevents XSS attacks
- **Host Permissions** - Limited to necessary domains
- **No Eval Usage** - No dynamic code execution

## Configuration Notes

### Vite Configuration

The `vite.config.js` is configured to:
- Build separate entry points for content scripts, service worker, and UI pages
- Generate proper file names for Chrome extension requirements
- Bundle CSS into a single file for content script injection
- Handle TypeScript and React compilation

### Manifest V3 Features

- Uses service worker instead of background pages
- Implements proper content script injection
- Configures side panel API
- Sets up storage and tab permissions

## Development Tips

### Testing the Extension

1. **Content Script Testing**: Visit any website and press Ctrl+Shift+E to toggle the widget
2. **Service Worker Testing**: Check `chrome://extensions/` and click "service worker" to view logs
3. **Side Panel Testing**: Click the extension icon in the toolbar
4. **Options Testing**: Right-click extension icon → Options

### Debugging

- **Content Scripts**: Use browser DevTools on the page where content is injected
- **Service Worker**: Use the service worker DevTools from the extensions page
- **Side Panel/Options**: Use DevTools on the respective pages

### Hot Reloading

During development:
1. Make changes to your code
2. Run `npm run build`
3. Click the refresh button on the extension in `chrome://extensions/`
4. Reload any tabs where you want to test content script changes

## Common Issues

### Extension Not Loading
- Ensure `dist` folder exists and contains built files
- Check manifest.json syntax in the dist folder
- Verify all file paths in manifest are correct

### Content Script Not Injecting
- Check if the page URL matches the content script patterns
- Verify the extension is enabled
- Check browser console for errors

### Service Worker Issues
- Service workers have limited lifetime - check logs regularly
- Use chrome.storage for persistent data
- Avoid long-running operations

## Browser Compatibility

- **Chrome**: Full support (Manifest V3)
- **Edge**: Full support (Chromium-based)
- **Firefox**: Requires manifest conversion for Manifest V2
- **Safari**: Not supported (different extension system)

## Performance Optimization

- Content scripts are injected only when needed
- React components are lazy-loaded where possible
- Tailwind CSS is purged to include only used classes
- Service worker uses efficient event listeners

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly in Chrome
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## 
Authentication

This extension uses **OAuth2 with Google Sign-In** via **AWS Cognito** for user authentication.

### Authentication Features

- **Google OAuth2** - Sign in with your Google account
- **AWS Cognito** - Secure token management and user pool
- **PKCE Flow** - Enhanced security for browser extensions
- **Auto Token Refresh** - Seamless session management
- **Secure Storage** - Tokens stored in Chrome's encrypted storage

### Setup Authentication

Before using the extension, you need to configure the OAuth callback URL:

1. **Build and load the extension** to get your Extension ID
2. **Copy the Extension ID** from `chrome://extensions/`
3. **Configure Cognito**:
   - Go to AWS Cognito Console
   - Navigate to your User Pool App Client settings
   - Add callback URL: `https://<your-extension-id>.chromiumapp.org/`
   - Save changes

For detailed setup instructions, see [OAUTH_SETUP.md](./OAUTH_SETUP.md)

### Authentication Flow

1. User clicks extension icon
2. If not authenticated, login screen appears
3. Click "Sign in with Google"
4. OAuth flow opens in new window
5. User authenticates with Google
6. Tokens are securely stored
7. User is redirected to main app

### Environment Variables

Required environment variables in `.env`:

```env
VITE_AWS_REGION=ap-southeast-1
VITE_USER_POOL_ID=your-user-pool-id
VITE_CLIENT_ID=your-client-id
VITE_COGNITO_DOMAIN=https://your-domain.auth.region.amazoncognito.com
VITE_OAUTH_SCOPES=email openid profile
```

### Security Notes

- Uses PKCE (Proof Key for Code Exchange) for enhanced security
- Tokens are stored in `chrome.storage.local` (encrypted by Chrome)
- Access tokens auto-refresh before expiration
- No sensitive data is logged or exposed
