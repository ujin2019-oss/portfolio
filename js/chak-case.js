(() => {
  'use strict';
  const dialog = document.querySelector('.image-dialog');
  const image = dialog.querySelector('.zoom-image');
  const title = dialog.querySelector('#zoom-title');
  const sizeButton = dialog.querySelector('.dialog-size');
  let trigger = null;

  document.querySelectorAll('[data-zoom]').forEach(button => {
    button.addEventListener('click', () => {
      const source = button.querySelector('img');
      trigger = button;
      image.src = source.currentSrc || source.src;
      image.alt = source.alt;
      title.textContent = button.getAttribute('aria-label').replace(/ 확대$/, '');
      dialog.showModal();
      document.body.classList.add('zoom-open');
    });
  });
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  sizeButton.addEventListener('click', () => {
    const original = dialog.classList.toggle('is-original');
    sizeButton.setAttribute('aria-pressed', String(original));
    sizeButton.textContent = original ? '화면에 맞추기' : '원본 크기';
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('zoom-open');
    dialog.classList.remove('is-original');
    sizeButton.setAttribute('aria-pressed', 'false');
    sizeButton.textContent = '원본 크기';
    dialog.querySelector('.dialog-image-wrap').scrollTo(0, 0);
    if (trigger) trigger.focus({ preventScroll: true });
    image.removeAttribute('src');
  });

  const links = [...document.querySelectorAll('.page-header nav a')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-16% 0px -60% 0px', threshold: 0 });
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
  }
})();
