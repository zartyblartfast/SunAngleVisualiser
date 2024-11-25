import { getLogs, clearLogs, LogConfig } from './utilities.js';

// Hide logs button if logging is disabled
document.addEventListener('DOMContentLoaded', function() {
    const logsButton = document.querySelector('.logs-button');
    if (!LogConfig.enabled) {
        logsButton.style.display = 'none';
    }
});

// Make functions available globally
window.showLogs = function() {
    const modal = document.getElementById('logsModal');
    refreshLogs();
    modal.style.display = 'block';
};

window.hideLogsModal = function() {
    const modal = document.getElementById('logsModal');
    modal.style.display = 'none';
};

window.refreshLogs = function() {
    const logsContent = document.getElementById('logsContent');
    logsContent.textContent = getLogs();
};

window.clearAllLogs = function() {
    if (confirm('Are you sure you want to clear all logs?')) {
        clearLogs();
        refreshLogs();
    }
};

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('logsModal');
    if (event.target === modal) {
        hideLogsModal();
    }
});
