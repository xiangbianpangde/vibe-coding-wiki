// Vibe Coding Wiki · Mobile Navigation Toggle
(function() {
  'use strict';

  function setupMobileNav() {
    // Inject hamburger menu button if not exists
    const topnav = document.querySelector('.topnav__inner');
    if (!topnav) return;

    const links = topnav.querySelector('.topnav__links');
    if (!links) return;

    // Check if toggle button already exists
    if (topnav.querySelector('.vc-nav-toggle')) return;

    // Create toggle button
    const toggle = document.createElement('button');
    toggle.className = 'vc-nav-toggle';
    toggle.setAttribute('aria-label', '打开主导航菜单');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('type', 'button');
    toggle.innerHTML = '☰';

    // Insert before the search button
    const search = topnav.querySelector('.topnav__search');
    if (search) {
      topnav.insertBefore(toggle, search);
    } else {
      topnav.appendChild(toggle);
    }

    // Toggle handler
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('vc-nav-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.innerHTML = isOpen ? '✕' : '☰';
    });

    // Close on link click
    links.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        links.classList.remove('vc-nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '☰';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMobileNav);
  } else {
    setupMobileNav();
  }
})();
