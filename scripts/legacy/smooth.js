/* ===== Smooth scrolling, reveal-on-scroll and scroll progress =====
   Uses Lenis for eased wheel/trackpad scrolling. Phones keep native touch scrolling.
   Everything here is skipped for visitors who prefer reduced motion. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NAV_OFFSET = -84;

  // let inner scroll areas (chat log, popups, wide tables) scroll on their own
  document.querySelectorAll('#term, .modal, .cmp-wrap, .vis-body').forEach(el => el.setAttribute('data-lenis-prevent', ''));

  // 1) smooth wheel scrolling
  let lenis = null;
  if (!reduce && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, wheelMultiplier: 0.95, touchMultiplier: 1.2 });
    window.__lenis = lenis;
    const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  // in-page links glide to their section and stop below the sticky menu
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href*="#"]'); if (!a || e.defaultPrevented) return;
    const url = new URL(a.getAttribute('href'), location.href);
    if (url.pathname !== location.pathname || !url.hash || url.hash === '#') return;
    const target = document.querySelector(url.hash); if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: NAV_OFFSET, duration: 1.4 });
    else window.scrollTo({ top: target.getBoundingClientRect().top + scrollY + NAV_OFFSET, behavior: reduce ? 'auto' : 'smooth' });
    history.replaceState(null, '', url.hash);
  });
  // arriving from another page with a #section in the address
  if (location.hash && lenis) { const t = document.querySelector(location.hash); if (t) setTimeout(() => lenis.scrollTo(t, { offset: NAV_OFFSET, immediate: true }), 60); }

  // 2) scroll progress bar
  const bar = document.createElement('div'); bar.className = 'scroll-prog'; bar.setAttribute('aria-hidden', 'true'); bar.innerHTML = '<i></i>';
  document.body.appendChild(bar);
  const fill = bar.firstChild;
  const prog = () => { const max = document.documentElement.scrollHeight - innerHeight; fill.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`; };
  addEventListener('scroll', prog, { passive: true }); addEventListener('resize', prog); prog();

  // 3) reveal sections as they scroll into view
  if (reduce || !('IntersectionObserver' in window)) return;
  const SEL = [
    '.head', '.feat .card', '.gl .card', '.nm', '.vis .txt', '.vis-card', '.scale .txt', '.sim', '.lean > *', '.three',
    '.al', '.bx', '.lab-filters', '.ring-stage', '.chk > *', '.strip > .card', '.st', '.faq .txt', '.qa details', '.cta',
    '.eq .el', '.eq .op', '.eq .react', '.logos .cap',
    '.story .l', '.story .r p', '.prin .card', '.founder', '.studios .st', '.stack-txt', '.sphere'
  ].join(',');
  const els = [...document.querySelectorAll(SEL)].filter(el => !el.closest('.hero') && !el.parentElement.closest('.rv'));
  const firstFold = innerHeight * 0.92;
  els.forEach(el => {
    if (el.getBoundingClientRect().top < firstFold) el.classList.add('in', 'now'); // on screen at load: show now, animate on later passes
    const sibs = [...el.parentElement.children].filter(c => els.includes(c));
    el.style.setProperty('--rd', Math.min(sibs.indexOf(el), 6) * 70 + 'ms');
    el.classList.add('rv');
  });
  document.documentElement.classList.add('rv-on');
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      const el = en.target;
      if (!en.isIntersecting || el.classList.contains('in')) return;
      el.classList.toggle('up', en.boundingClientRect.top < innerHeight * 0.4); // entering from the top = scrolling up
      el.classList.add('in');
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  // reset once fully off screen, so the animation plays again on the way back
  const out = new IntersectionObserver(entries => {
    entries.forEach(en => { if (!en.isIntersecting) en.target.classList.remove('in', 'now', 'up'); });
  }, { threshold: 0 });
  document.querySelectorAll('.rv').forEach(el => { io.observe(el); out.observe(el); });
})();
