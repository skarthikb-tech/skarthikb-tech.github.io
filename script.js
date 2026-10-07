/* Progressive enhancements: every page and link works without JavaScript. */
(() => {
  'use strict';
  const root = document.documentElement;
  const progress = document.querySelector('.reading-progress');
  const backToTop = document.querySelector('.back-to-top');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const projectLinks = [...document.querySelectorAll('.project-nav a')];
  const projects = [...document.querySelectorAll('.project')];
  let scheduled = false;
  function updateScroll() {
    const total = root.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0})`;
    document.body.classList.toggle('scrolled', window.scrollY > 12);
    if (backToTop) backToTop.hidden = window.scrollY < 500;
    if (projects.length) {
      const marker = Math.max(160, window.innerHeight * 0.35);
      let current = projects[0];
      for (const project of projects) {
        if (project.getBoundingClientRect().top <= marker) current = project;
      }
      if (total > 0 && window.scrollY >= total - 2) current = projects[projects.length - 1];
      for (const link of projectLinks) {
        if (link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }
    scheduled = false;
  }
  function requestUpdate() {
    if (!scheduled) { scheduled = true; window.requestAnimationFrame(updateScroll); }
  }
  window.addEventListener('scroll', requestUpdate, {passive:true});
  window.addEventListener('resize', requestUpdate, {passive:true});
  window.addEventListener('pageshow', requestUpdate);
  updateScroll();
  if (backToTop) backToTop.addEventListener('click', () => {
    window.scrollTo({top:0, behavior:reduceMotion.matches ? 'auto' : 'smooth'});
    const home = document.querySelector('.logo');
    if (home) home.focus({preventScroll:true});
  });
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.focus-grid article').forEach(card => {
      card.addEventListener('pointermove', event => {
        if (reduceMotion.matches) return;
        const box = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${event.clientX - box.left}px`);
        card.style.setProperty('--mouse-y', `${event.clientY - box.top}px`);
      }, {passive:true});
    });
  }
})();
