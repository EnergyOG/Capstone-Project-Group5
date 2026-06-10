(function () {
  'use strict';

  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const contactForm = document.getElementById('contact-form');
  const contactSuccess = document.getElementById('contact-success');
  const resetFormBtn = document.getElementById('reset-form');
  const yearEl = document.getElementById('year');

  // Footer year
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Mobile menu toggle
  function closeMenu() {
    navMenu.classList.remove('navbar__nav--open');
    menuToggle.classList.remove('navbar__toggle--open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
  }

  function openMenu() {
    navMenu.classList.add('navbar__nav--open');
    menuToggle.classList.add('navbar__toggle--open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
  }

  menuToggle.addEventListener('click', function () {
    const isOpen = navMenu.classList.contains('navbar__nav--open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when a nav link is clicked
  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.querySelectorAll('.navbar__cta, .footer__links a, .footer__logo').forEach(function (el) {
    el.addEventListener('click', closeMenu);
  });

  // Navbar shadow on scroll
  window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  });

  // Active nav link on scroll (scroll spy)
  function updateActiveLink() {
    const scrollPos = window.scrollY + navbar.offsetHeight + 80;

    let current = 'home';
    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();

  // Contact form handling
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    contactForm.hidden = true;
    contactSuccess.hidden = false;
  });

  resetFormBtn.addEventListener('click', function () {
    contactForm.reset();
    contactForm.hidden = false;
    contactSuccess.hidden = true;
  });

  // Scroll reveal animation
  const revealElements = document.querySelectorAll(
    '.home__content, .home__visual, .about__story, .about__value-card, .testimonials__card, .contact__info, .contact__form-wrap'
  );

  revealElements.forEach(function (el) {
    el.classList.add('reveal');
  });

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(function (el, index) {
    el.style.transitionDelay = (index % 4) * 0.1 + 's';
    revealObserver.observe(el);
  });
})();

const S3_BASE = "https://capstone-grp5-web-assets.s3.amazonaws.com/images/";