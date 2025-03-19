/**
 * Main JavaScript file for Snailshare.me
 * Contains common utility functions used across the application
 */

/**
 * Formats a file size in bytes to a human-readable string.
 * @param {number} bytes - The file size in bytes
 * @returns {string} Formatted file size
 */
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(2) + ' MB';
    return (bytes / 1024 / 1024 / 1024).toFixed(2) + ' GB';
}

/**
 * Formats a download speed in bytes/second to a human-readable string.
 * @param {number} bytesPerSecond - The download speed in bytes per second
 * @returns {string} Formatted download speed
 */
function formatSpeed(bytesPerSecond) {
    if (bytesPerSecond < 1024) return bytesPerSecond.toFixed(0) + ' B/s';
    if (bytesPerSecond < 1024 * 1024) return (bytesPerSecond / 1024).toFixed(2) + ' KB/s';
    return (bytesPerSecond / 1024 / 1024).toFixed(2) + ' MB/s';
}

/**
 * Formats a duration in seconds to a human-readable string.
 * @param {number} seconds - The duration in seconds
 * @returns {string} Formatted time duration
 */
function formatTimeRemaining(seconds) {
    if (seconds === Infinity || seconds <= 0) return 'Calculating...';

    if (seconds < 60) return Math.ceil(seconds) + ' seconds';
    if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.ceil(seconds % 60);
        return `${minutes} min ${remainingSeconds} sec`;
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} hr ${minutes} min`;
}

/**
 * Formats a date to show time elapsed (e.g., "5 minutes ago").
 * @param {Date|string} date - The date object or date string
 * @returns {string} Formatted "time ago" string
 */
function formatTimeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 60) return `${diffSec} seconds ago`;
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} minutes ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hours ago`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)} days ago`;

    return past.toLocaleDateString();
}

/**
 * Copy text to clipboard.
 * @param {string} text - The text to copy
 * @returns {Promise<boolean>} Whether the operation was successful
 */
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            return successful;
        }
    } catch (err) {
        console.error('Failed to copy text: ', err);
        return false;
    }
}


// Add event listener for copy buttons with data-copy-text attribute
document.addEventListener('DOMContentLoaded', () => {
    const copyButtons = document.querySelectorAll('[data-copy-text]');

    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const textToCopy = button.getAttribute('data-copy-text');
            if (!textToCopy) return;

            const success = await copyToClipboard(textToCopy);

            if (success) {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.disabled = true;

                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                }, 2000);
            }
        });
    });
});
