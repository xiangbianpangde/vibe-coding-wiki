// Vibe Coding Wiki · Theme management
// Light / Dark theme with localStorage persistence

(function() {
  'use strict';

  const STORAGE_KEY = 'vc-theme';

  // 1. Read initial theme (from localStorage or system preference)
  function getInitialTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    // Fall back to system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  // 2. Apply theme to <html>
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    // Update toggle button if exists
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? '切换到浅色' : '切换到深色');
    }
  }

  // 3. Toggle theme
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // 4. Initialize on page load (before paint to avoid FOUC)
  applyTheme(getInitialTheme());

  // 5. Attach click handler to toggle button once DOM loads
  function attachHandler() {
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.addEventListener('click', toggleTheme);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachHandler);
  } else {
    attachHandler();
  }

  // 6. Listen for system preference changes (only if user hasn't set explicit)
  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', (e) => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // Public API
  window.VC_THEME = {
    toggle: toggleTheme,
    set: applyTheme,
    current: () => document.documentElement.getAttribute('data-theme'),
  };
})();
