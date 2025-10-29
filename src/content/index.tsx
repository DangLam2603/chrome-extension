import React from 'react';
import { createRoot } from 'react-dom/client';
import ExtensionWidget from './components/ExtensionWidget';
import '../styles/globals.css';

class ChromeExtensionContent {
  private root: any = null;
  private container: HTMLDivElement | null = null;
  private isInjected = false;

  constructor() {
    this.init();
  }

  private init() {
    // Use setTimeout to avoid interfering with page's initial load
    setTimeout(() => {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setupExtension());
      } else {
        this.setupExtension();
      }
    }, 100);

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
    });

    // Handle page visibility changes instead of unload events
    // Use passive listener to avoid blocking
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        // Page is being hidden, do cleanup if needed
        this.handlePageHidden();
      }
    }, { passive: true });
  }

  private handlePageHidden() {
    // Cleanup logic that would normally be in unload event
    // This is safer and doesn't trigger permissions policy violations
  }

  private setupExtension() {
    // Content script is loaded but no widget injection
    // Extension functionality is handled through side panel only
    console.log('Chrome extension content script loaded - no UI injection');
  }

  private shouldInject(): boolean {
    // Don't inject on certain pages
    const excludedDomains = [
      'chrome://',
      'chrome-extension://',
      'moz-extension://',
      'edge://',
      'about:'
    ];

    const currentUrl = window.location.href;
    return !excludedDomains.some(domain => currentUrl.startsWith(domain));
  }

  private injectWidget() {
    if (this.isInjected) return;

    try {
      // Create container with better isolation
      this.container = document.createElement('div');
      this.container.id = 'chrome-extension-react-widget';
      this.container.style.cssText = `
        position: fixed !important;
        top: 20px !important;
        right: 20px !important;
        z-index: 2147483647 !important;
        pointer-events: auto !important;
        isolation: isolate !important;
      `;

      // Append to body with error handling
      if (document.body) {
        document.body.appendChild(this.container);
      } else {
        // If body is not ready, wait for it
        document.addEventListener('DOMContentLoaded', () => {
          if (document.body && this.container) {
            document.body.appendChild(this.container);
          }
        });
        return;
      }

      // Create React root and render with error handling
      this.root = createRoot(this.container);
      this.renderWidget();

      this.isInjected = true;
      console.log('Chrome extension widget injected');
    } catch (error) {
      console.error('Error injecting widget:', error);
    }
  }

  private renderWidget() {
    if (!this.root) return;

    // Render without StrictMode to avoid potential conflicts with page's event listeners
    this.root.render(
      <ExtensionWidget onClose={() => this.hideWidget()} />
    );
  }

  private toggleWidget() {
    if (!this.isInjected) {
      this.injectWidget();
    } else {
      if (this.container) {
        this.container.style.display =
          this.container.style.display === 'none' ? 'block' : 'none';
      }
    }
  }

  private hideWidget() {
    if (this.container) {
      this.container.style.display = 'none';
    }
  }

  private showWidget() {
    if (!this.isInjected) {
      this.injectWidget();
    } else if (this.container) {
      this.container.style.display = 'block';
    }
  }

  private removeWidget() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }

    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
      this.container = null;
    }

    this.isInjected = false;
  }

  private handleMessage(message: any, sender: any, sendResponse: (response?: any) => void) {
    console.log('Content script received message:', message);

    switch (message.type) {
      case 'PAGE_LOADED':
        console.log('Page loaded message received');
        sendResponse({ success: true });
        break;

      case 'STORAGE_CHANGED':
        // Handle storage changes if needed
        console.log('Storage changed:', message.changes);
        sendResponse({ success: true });
        break;

      default:
        console.log('Unknown message type:', message.type);
        sendResponse({ success: false, error: 'Unknown message type' });
    }
  }
}

// Initialize the extension
new ChromeExtensionContent();