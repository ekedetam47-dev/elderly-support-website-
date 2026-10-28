/* =========================================================
   ELDERLY SUPPORT WEBSITE
   Main JavaScript — js/script.js
========================================================= */
(() => {
  'use strict';

  // Mobile navigation
  const menuToggle = document.querySelector('.menu-toggle');
  const navigationMenu = document.getElementById('navigationMenu');

  if (menuToggle && navigationMenu) {
    const closeMenu = () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation menu');
      navigationMenu.classList.remove('is-open');
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
      navigationMenu.classList.toggle('is-open', !isOpen);
    });

    navigationMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
  closeMenu();
});
  }

  // Scroll reveal. Elements remain visible when IntersectionObserver is unavailable.
  const revealElements = document.querySelectorAll('.reveal');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    revealElements.forEach(element => revealObserver.observe(element));
  } else {
    revealElements.forEach(element => element.classList.add('is-visible'));
  }

  // Impact counters: animate only when the target is a verified, positive number.
  const counters = document.querySelectorAll('.impact-counter[data-target]');

  const animateCounter = element => {
    const target = Number.parseInt(element.dataset.target, 10);
    if (!Number.isFinite(target) || target <= 0) {
      element.textContent = '0';
      return;
    }

    if (reducedMotion) {
      element.textContent = target.toLocaleString();
      return;
    }

    const duration = 1400;
    const startTime = performance.now();

    const tick = now => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window && !reducedMotion) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.55 });

    counters.forEach(counter => counterObserver.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }

  // Dynamic footer copyright year.
  const yearElement = document.getElementById('elderly-footer-year');
  if (yearElement) yearElement.textContent = new Date().getFullYear();

  // Back-to-top link: smooth scroll where supported.
  document.querySelectorAll('.elderly-footer__back-top').forEach(link => {
    link.addEventListener('click', event => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });
})();
