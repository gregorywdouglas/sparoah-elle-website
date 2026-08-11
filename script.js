(() => {
  const header = document.querySelector('[data-header]');
  const button = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-nav]');
  const year = document.querySelector('[data-year]');

  if (year) year.textContent = new Date().getFullYear();

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (button && nav) {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('is-open', !expanded);
    });

    const closeMenu = () => {
      button.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    };

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      if (button.getAttribute('aria-expanded') !== 'true') return;
      closeMenu();
      button.focus();
    });

    document.addEventListener('click', (event) => {
      if (button.getAttribute('aria-expanded') !== 'true') return;
      if (nav.contains(event.target) || button.contains(event.target)) return;
      closeMenu();
    });
  }
})();
