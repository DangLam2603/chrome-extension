// OAuth Callback Handler
console.log('Callback script loaded');

// Extract authorization code from URL
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');
const error = urlParams.get('error');
const state = urlParams.get('state');
const errorDescription = urlParams.get('error_description');

const statusElement = document.getElementById('callback-status');

if (error) {
    console.error('OAuth error:', error, errorDescription);
    statusElement.textContent = 'Authentication failed: ' + error;
    if (errorDescription) {
        statusElement.textContent += ' - ' + errorDescription;
    }

    // Send error to extension
    chrome.runtime.sendMessage({
        type: 'OAUTH_ERROR',
        error: error,
        errorDescription: errorDescription
    });
} else if (code) {
    console.log('Authorization code received');
    statusElement.textContent = 'Authentication successful! Redirecting...';

    // Send code to extension for token exchange
    chrome.runtime.sendMessage({
        type: 'OAUTH_SUCCESS',
        code: code,
        state: state
    }, () => {
        // Close the callback window after a short delay
        setTimeout(() => {
            window.close();
        }, 1000);
    });
} else {
    statusElement.textContent = 'No authorization code received';
    console.error('No authorization code in callback URL');
}
