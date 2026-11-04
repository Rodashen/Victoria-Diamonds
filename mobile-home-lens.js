document.addEventListener('DOMContentLoaded', () => {
  const dock = document.querySelector('.ma-dock');
  const hero = document.querySelector('.mobile-home-refresh .hero');
  const shop = document.querySelector('#mobile-home-shop');
  if (!dock || !hero || !shop) return;
  const mobile = matchMedia('(max-width: 760px)');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const sections = [...document.querySelectorAll('.landing-page > .featured-piece, #story, #reviews, .mobile-home-refresh .corporate')];
  let frame = 0;

  function update() {
    frame = 0;
    if (!mobile.matches) return;
    const heroBounds = hero.getBoundingClientRect();
    const shopBounds = shop.getBoundingClientRect();
    dock.classList.toggle('on-content', heroBounds.bottom < dock.getBoundingClientRect().top);
    dock.classList.toggle('is-browsing', shopBounds.top <= innerHeight * .4 && shopBounds.bottom > innerHeight * .35);
    if (motion.matches || !heroBounds.height) return;
    const progress = Math.min(1, Math.max(0, -heroBounds.top / heroBounds.height));
    hero.style.setProperty('--hero-drift', `${progress * 52}px`);
    hero.style.setProperty('--copy-drift', `${progress * -24}px`);
    dock.style.setProperty('--rim-light', `${18 + 64 * progress}%`);
    for (const section of sections) {
      const entry = Math.min(1, Math.max(0, (innerHeight - section.getBoundingClientRect().top) / (innerHeight * .4)));
      section.style.setProperty('--entry-offset', `${(1 - entry) * 24}px`);
      section.style.setProperty('--entry-opacity', String(.65 + .35 * entry));
    }
  }

  function schedule() {
    if (mobile.matches && !frame) frame = requestAnimationFrame(update);
  }
  addEventListener('scroll', schedule, {passive: true});
  addEventListener('resize', schedule);
  motion.addEventListener('change', schedule);
  update();
});
