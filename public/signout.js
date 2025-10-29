// Sign Out Handler
console.log('Signout script loaded');

const statusElement = document.getElementById('signout-status');
statusElement.textContent = 'Successfully signed out!';

// Notify extension of successful sign out
chrome.runtime.sendMessage({
    type: 'SIGNOUT_SUCCESS'
}, () => {
    // Close the signout window after a short delay
    setTimeout(() => {
        window.close();
    }, 1000);
});
