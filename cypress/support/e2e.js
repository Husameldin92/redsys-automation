// Import commands
import './commands/auth';
import './commands/upload';

// List of errors to ignore (known application issues that don't affect tests)
const ignoredErrors = [
  'xhr-sync-worker.js',
  'ResizeObserver loop limit exceeded',
  'Non-Error promise rejection captured',
  'Cannot find module'
];

// Helper function to check if error should be ignored
const shouldIgnoreError = (errorMessage) => {
  const message = String(errorMessage);
  return ignoredErrors.some(ignored => message.includes(ignored));
};

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // Return false to prevent the error from failing the test
  if (shouldIgnoreError(err.message)) {
    console.log('Ignoring known application error:', err.message);
    return false;
  }
  // Return true to fail the test for other errors
  return true;
});

// Global error handler - fail tests on console.error
Cypress.on('window:before:load', (win) => {
  const originalError = win.console.error;
  win.console.error = (...args) => {
    // Still call the original console.error first
    if (originalError) {
      originalError.apply(win.console, args);
    }
    
    // Convert args to string for checking
    const errorMessage = args.map(arg => String(arg)).join(' ');
    
    if (!shouldIgnoreError(errorMessage)) {
      // Only throw error to fail the test if it's not in our ignore list
      throw new Error(`Console error: ${errorMessage}`);
    }
  };
});

// Hide fetch/XHR requests from command log to reduce noise
if (Cypress.config('hideXHRInCommandLog')) {
  const app = window.top;
  if (app && !app.document.head.querySelector('[data-hide-command-log-request]')) {
    const style = app.document.createElement('style');
    style.innerHTML = '.command-name-request, .command-name-xhr { display: none }';
    style.setAttribute('data-hide-command-log-request', '');
    app.document.head.appendChild(style);
  }
}
