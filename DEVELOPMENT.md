# Development Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the extension:**
   ```bash
   npm run build
   ```

3. **Load in Chrome:**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

## Development Workflow

### Making Changes

1. Edit your code in the `src` directory
2. Run `npm run build` to rebuild
3. Go to `chrome://extensions/` and click the refresh button on your extension
4. Reload any tabs where you want to test content script changes

### Testing Different Components

- **Content Script**: Visit any website and press `Ctrl+Shift+E`
- **Side Panel**: Click the extension icon in the toolbar
- **Options Page**: Right-click extension icon → Options
- **Service Worker**: Check logs in `chrome://extensions/` → Details → service worker

### File Structure Explained

```
src/
├── background/
│   └── service-worker.ts     # Handles extension lifecycle, messaging
├── content/
│   ├── components/
│   │   └── ExtensionWidget.tsx  # Main floating widget
│   └── index.tsx             # Content script entry, handles injection
├── options/
│   ├── index.html           # Options page HTML
│   └── options.tsx          # Options page React component
├── sidepanel/
│   ├── index.html          # Side panel HTML
│   └── sidepanel.tsx       # Side panel React component
└── styles/
    └── globals.css         # Tailwind CSS and extension styles
```

## Key Features Implemented

### 1. Content Script Widget (3 Sections)

The main widget has three tabs as requested:

- **Dashboard**: Shows stats (42 active sessions, 98% success rate) and quick actions
- **Analytics**: Displays usage metrics (pages visited, time saved, actions performed)
- **Settings**: Extension controls (enable/disable, auto-minimize, notifications)

### 2. No Popup Design

The extension doesn't use a popup. Instead:
- Content script injects React UI directly into pages
- Side panel provides extended functionality
- Options page for detailed settings

### 3. Modern Architecture

- **Manifest V3** compliance
- **React 18** with hooks and modern patterns
- **TypeScript** for type safety
- **Tailwind CSS** for responsive design
- **Vite** for fast builds

## Customization Guide

### Adding New Features

1. **New Widget Section**: Add to `ExtensionWidget.tsx` activeSection state
2. **New Settings**: Add to options page and storage sync
3. **New Messaging**: Add handlers in service worker and content script

### Styling Changes

- Edit `src/styles/globals.css` for global styles
- Use Tailwind classes in components
- Widget container has isolation styles to avoid conflicts

### Storage Management

```typescript
// Save setting
chrome.storage.sync.set({ key: value });

// Load setting
chrome.storage.sync.get(['key'], (result) => {
  console.log(result.key);
});
```

## Security Best Practices

✅ **Implemented:**
- No remote code execution
- Minimal permissions (storage, activeTab, sidePanel)
- Content Security Policy
- Local asset serving only
- No eval() usage

✅ **Avoided:**
- Excessive permissions
- Remote script loading
- Unsafe innerHTML usage
- Cross-origin requests without proper permissions

## Performance Optimizations

- **Lazy Loading**: Components load only when needed
- **CSS Purging**: Tailwind removes unused styles
- **Code Splitting**: Separate bundles for different parts
- **Efficient Messaging**: Minimal background script communication

## Troubleshooting

### Common Issues

1. **Widget not appearing**: Check if extension is enabled and page allows content scripts
2. **Styles broken**: Ensure content.css is loaded and no conflicts with page styles
3. **Service worker errors**: Check chrome://extensions/ service worker logs
4. **Build failures**: Ensure all dependencies are installed

### Debug Tools

- **Content Script**: Browser DevTools on the page
- **Service Worker**: Extension details → service worker
- **Side Panel/Options**: DevTools on respective pages
- **Storage**: chrome://extensions/ → Details → Storage

## Chrome Web Store Preparation

Before publishing:

1. **Test thoroughly** on different websites
2. **Optimize images** and reduce bundle size
3. **Update manifest** with proper descriptions
4. **Add privacy policy** if collecting data
5. **Test permissions** are minimal and justified

## Browser Compatibility

- ✅ Chrome (Manifest V3)
- ✅ Edge (Chromium-based)
- ❌ Firefox (needs Manifest V2 conversion)
- ❌ Safari (different extension system)