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
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupExtension());
    } else {
      this.setupExtension();
    }

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
    });
  }

  private setupExtension() {
    // Check if we should inject on this page
    if (this.shouldInject()) {
      this.injectWidget();
    }

    // Listen for keyboard shortcut (Ctrl+Shift+E)
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'E') {
        event.preventDefault();
        this.toggleWidget();
      }
    });
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

    // Create container
    this.container = document.createElement('div');
    this.container.id = 'chrome-extension-react-widget';
    this.container.style.cssText = `
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      z-index: 2147483647 !important;
      pointer-events: auto !important;
    `;

    // Append to body
    document.body.appendChild(this.container);

    // Create React root and render
    this.root = createRoot(this.container);
    this.renderWidget();

    this.isInjected = true;
    console.log('Chrome extension widget injected');
  }

  private renderWidget() {
    if (!this.root) return;

    this.root.render(
      <React.StrictMode>
        <ExtensionWidget onClose={() => this.hideWidget()} />
      </React.StrictMode>
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
        break;

      case 'TOGGLE_WIDGET':
        this.toggleWidget();
        sendResponse({ success: true });
        break;

      case 'SHOW_WIDGET':
        this.showWidget();
        sendResponse({ success: true });
        break;

      case 'HIDE_WIDGET':
        this.hideWidget();
        sendResponse({ success: true });
        break;

      case 'EXTENSION_TOGGLED':
        if (message.enabled) {
          this.showWidget();
        } else {
          this.hideWidget();
        }
        break;

      case 'STORAGE_CHANGED':
        // Handle storage changes if needed
        console.log('Storage changed:', message.changes);
        break;

      default:
        console.log('Unknown message type:', message.type);
    }
  }
}

// Initialize the extension
new ChromeExtensionContent();

// Export for potential use in other scripts
export default ChromeExtensionContent;