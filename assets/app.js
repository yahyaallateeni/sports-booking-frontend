(function () {
  'use strict';

  function setupMobileMenu() {
    const toggle = document.querySelector('[data-menu-toggle]');
    const nav = document.querySelector('.nav-links');

    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  function setupAutoYear() {
    const yearEls = document.querySelectorAll('[data-current-year]');
    if (!yearEls.length) return;

    const year = new Date().getFullYear();
    yearEls.forEach((el) => {
      el.textContent = String(year);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMobileMenu();
    setupAutoYear();
  });
})();
