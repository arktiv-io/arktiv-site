/* ============================================================
   Arktiv — Nav Logic (homepage)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  const navLinks  = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  const nav       = document.querySelector('nav');

  // ── HAMBURGER TOGGLE ──────────────────────────────────────
  function openNav()  { navLinks.classList.add('open'); hamburger.setAttribute('aria-expanded', 'true'); }
  function closeNav() { navLinks.classList.remove('open'); hamburger.setAttribute('aria-expanded', 'false'); }

  window.toggleNav = function () {
    navLinks.classList.contains('open') ? closeNav() : openNav();
  };

  // Close nav when any nav link or button is clicked
  if (navLinks) {
    navLinks.addEventListener('click', function (e) {
      const isLink   = e.target.closest('a');
      const isButton = e.target.closest('button');
      if ((isLink || isButton) && navLinks.classList.contains('open')) {
        closeNav();
      }
    });
  }

  // Close nav on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
      closeNav();
      hamburger.focus();
    }
  });

  // ── NAV SHADOW ON SCROLL ──────────────────────────────────
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.boxShadow = window.scrollY > 10
        ? '0 2px 20px rgba(0,0,0,0.08)'
        : 'none';
    }, { passive: true });
  }

  // ── SMOOTH SCROLL ─────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return; // let onclick handlers deal with # links
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
