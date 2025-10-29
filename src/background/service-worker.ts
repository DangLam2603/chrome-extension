// Background service worker for Chrome extension
console.log('Background service worker loaded');

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
    console.log('Extension installed:', details.reason);

    // Set default storage values
    chrome.storage.sync.set({
        extensionEnabled: true,
        theme: 'light'
    });

    // Check authentication status on install
    chrome.storage.local.get(['isAuthenticated'], (result) => {
        if (!result.isAuthenticated) {
            console.log('User not authenticated');
        }
    });
});

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        console.log('Tab updated:', tab.url);

        // Send message to content script when page is loaded
        chrome.tabs.sendMessage(tabId, {
            type: 'PAGE_LOADED',
            url: tab.url
        }).catch(() => {
            // Content script might not be ready yet, ignore error
        });
    }
});

// Handle messages from content scripts and other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Background received message:', message);

    switch (message.type) {
        case 'GET_TAB_INFO':
            if (sender.tab) {
                sendResponse({
                    tabId: sender.tab.id,
                    url: sender.tab.url,
                    title: sender.tab.title
                });
            }
            break;

        case 'TOGGLE_EXTENSION':
            chrome.storage.sync.get(['extensionEnabled'], (result) => {
                const newState = !result.extensionEnabled;
                chrome.storage.sync.set({ extensionEnabled: newState });

                // Notify all content scripts
                chrome.tabs.query({}, (tabs) => {
                    tabs.forEach((tab) => {
                        if (tab.id) {
                            chrome.tabs.sendMessage(tab.id, {
                                type: 'EXTENSION_TOGGLED',
                                enabled: newState
                            }).catch(() => { });
                        }
                    });
                });

                sendResponse({ enabled: newState });
            });
            return true; // Keep message channel open for async response

        case 'CHECK_AUTH':
            chrome.storage.local.get(['isAuthenticated'], (result) => {
                sendResponse({ isAuthenticated: result.isAuthenticated || false });
            });
            return true;

        case 'SIGN_OUT':
            chrome.storage.local.remove(['authTokens', 'isAuthenticated', 'codeVerifier'], () => {
                sendResponse({ success: true });
            });
            return true;

        default:
            console.log('Unknown message type:', message.type);
    }
});

// Handle action button click (opens side panel)
chrome.action.onClicked.addListener((tab) => {
    if (tab.id) {
        chrome.sidePanel.open({ tabId: tab.id });
    }
});

// Handle storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
    console.log('Storage changed:', changes, namespace);

    // Notify content scripts of storage changes
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
            if (tab.id) {
                chrome.tabs.sendMessage(tab.id, {
                    type: 'STORAGE_CHANGED',
                    changes: changes
                }).catch(() => { });
            }
        });
    });
});