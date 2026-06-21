export const toast = {
  success: (message, title = 'Success') => {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message, type: 'success', title } }));
  },
  error: (message, title = 'Error') => {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message, type: 'error', title } }));
  },
  info: (message, title = 'Info') => {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message, type: 'info', title } }));
  }
};
