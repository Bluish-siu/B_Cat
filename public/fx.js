/* Branding Catalyst: creative effects shared by every page.
   1) Logo intro (first visit per browser session)   2) Dot cursor (desktop)
   3) 3D logo (any element with class "logo3d")       4) Brand Lab (homepage section #brandLab)
   Page transitions live in each page's CSS (@view-transition).
   Everything respects "reduce motion". Load with: <script src="fx.js" defer></script> */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = `
  .bc-intro{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;align-content:center;gap:22px;background:radial-gradient(60% 60% at 50% 45%,#2a0b46,#0d0716 70%);cursor:pointer}
  .bc-intro svg.mk{width:min(150px,34vw);height:auto;overflow:visible}
  .bc-intro .wmk{font-family:Lexend,system-ui,sans-serif;font-size:clamp(22px,4vw,34px);letter-spacing:-.02em;opacity:0;transform:translateY(10px)}
  .bc-intro .wmk b{font-weight:600;color:#fff}.bc-intro .wmk em{font-style:normal;font-weight:300;color:#c9a2ff}
  .bc-intro .skip{position:absolute;bottom:max(24px,env(safe-area-inset-bottom,0px));font:500 12px "Geist Mono",monospace;letter-spacing:.14em;color:rgba(255,255,255,.4)}
  html.intro-pending::after{content:"";position:fixed;inset:0;z-index:9999;background:#0d0716;animation:introFailsafe .4s 3s forwards}
  @keyframes introFailsafe{to{opacity:0;visibility:hidden}}
  .cur-dot{position:fixed;left:0;top:0;z-index:10001;pointer-events:none;width:9px;height:9px;margin:-4.5px 0 0 -4.5px;border-radius:50%;background:#c9a2ff;box-shadow:0 0 12px rgba(201,162,255,.9);opacity:0;display:grid;place-items:center;overflow:hidden;font:600 9.5px "Geist Mono",monospace;letter-spacing:.12em;color:#2a0446;text-transform:uppercase;transition:opacity .25s,width .25s,height .25s,margin .25s,box-shadow .25s}
  html.cur-on .cur-dot{opacity:1}
  html.cur-on.cur-hover .cur-dot{width:18px;height:18px;margin:-9px 0 0 -9px;box-shadow:0 0 24px rgba(201,162,255,.95)}
  html.cur-on.cur-drag .cur-dot{width:54px;height:54px;margin:-27px 0 0 -27px}
  html.cur-on.cur-down .cur-dot{width:6px;height:6px;margin:-3px 0 0 -3px}
  html.cur-on.cur-text .cur-dot{opacity:0}
  html.has-cursor,html.has-cursor *{cursor:none!important}
  html.has-cursor input,html.has-cursor textarea,html.has-cursor select,html.has-cursor [contenteditable]{cursor:auto!important}
  `;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- 1) Logo intro ---------- */
  (function intro(){
    const html = document.documentElement;
    let seen = false; try { seen = sessionStorage.getItem('bcIntro') === '1'; } catch {}
    if (reduce || seen) { html.classList.remove('intro-pending'); return; }
    try { sessionStorage.setItem('bcIntro', '1'); } catch {}
    const o = document.createElement('div'); o.className = 'bc-intro'; o.setAttribute('aria-hidden', 'true');
    o.innerHTML = `<svg class="mk" viewBox="0 0 96 100"><defs><mask id="ixCut" maskUnits="userSpaceOnUse" x="0" y="0" width="96" height="100"><rect width="96" height="100" fill="#fff"/><circle id="ixHole" cx="46" cy="50" r="0" fill="#000"/><rect id="ixGap" x="46" y="41.5" width="0" height="17" fill="#000"/></mask></defs>
      <g id="ixBlock" style="transform-origin:40px 50px"><path d="M14 8H41A34 34 0 0 1 75 42V58A34 34 0 0 1 41 92H14Q6 92 6 84V16Q6 8 14 8Z" fill="#fff" mask="url(#ixCut)"/></g>
      <circle id="ixPulse" cx="85" cy="50" r="7" fill="none" stroke="#c9a2ff" stroke-width="1.5" opacity="0"/>
      <g id="ixSparks"></g>
      <circle id="ixDot" cx="85" cy="50" r="7" fill="#c9a2ff" opacity="0"/></svg>
      <div class="wmk"><b>Branding</b><em>Catalyst</em></div><span class="skip">TAP TO SKIP</span>`;
    document.body.appendChild(o); html.classList.remove('intro-pending');
    if (window.__lenis) window.__lenis.stop();
    const $ = s => o.querySelector(s), hole = $('#ixHole'), gap = $('#ixGap'), dot = $('#ixDot'), pulse = $('#ixPulse'), sparks = $('#ixSparks');
    const ease = t => 1 - Math.pow(1 - t, 3), back = t => { const c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
    for (let i = 0; i < 10; i++) { const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); c.setAttribute('r', '1.6'); c.setAttribute('fill', i % 2 ? '#f2a7c3' : '#c9a2ff'); c.setAttribute('opacity', '0'); sparks.appendChild(c); }
    const block = $('#ixBlock'); block.style.transform = 'scale(.55)'; block.style.opacity = '0';
    let done = false; const t0 = performance.now(), TOTAL = 2050;
    function finish(){ if (done) return; done = true;
      o.animate([{ opacity: 1 }, { opacity: 0, transform: 'scale(1.04)' }], { duration: 420, easing: 'ease-in', fill: 'forwards' }).onfinish = () => { o.remove(); if (window.__lenis) window.__lenis.start(); };
    }
    o.addEventListener('click', finish); addEventListener('keydown', finish, { once: true });
    (function step(now){
      if (done) return;
      const t = now - t0, p = (a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
      const b = back(p(0, 520)); block.style.transform = `scale(${.55 + .45 * b})`; block.style.opacity = String(Math.min(1, p(0, 260)));
      hole.setAttribute('r', (20 * ease(p(380, 820))).toFixed(2));
      gap.setAttribute('width', (40 * ease(p(700, 980))).toFixed(2));
      const d = p(900, 1320), de = back(d);                                // dot flies in from the upper right with overshoot
      dot.setAttribute('opacity', d > 0 ? '1' : '0');
      dot.setAttribute('cx', (85 + (1 - de) * 60).toFixed(2)); dot.setAttribute('cy', (50 - (1 - de) * 42).toFixed(2));
      const r = p(1300, 1800);                                               // the "reaction": pulse ring and sparks
      pulse.setAttribute('opacity', r > 0 && r < 1 ? String(1 - r) : '0'); pulse.setAttribute('r', (7 + 26 * ease(r)).toFixed(2));
      [...sparks.children].forEach((c, i) => { const a = i / 10 * Math.PI * 2, dist = 6 + 30 * ease(r);
        c.setAttribute('cx', (85 + Math.cos(a) * dist).toFixed(2)); c.setAttribute('cy', (50 + Math.sin(a) * dist).toFixed(2)); c.setAttribute('opacity', r > 0 && r < 1 ? String(1 - r) : '0'); });
      const w = p(1250, 1650); const wm = $('.wmk'); wm.style.opacity = String(w); wm.style.transform = `translateY(${(1 - ease(w)) * 10}px)`;
      if (t >= TOTAL) return finish();
      requestAnimationFrame(step);
    })(t0);
  })();

  /* ---------- 2) Dot cursor (mouse/trackpad only) ---------- */
  (function cursor(){
    if (reduce || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const html = document.documentElement;
    const dot = document.createElement('div'); dot.className = 'cur-dot'; dot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(dot); html.classList.add('has-cursor');
    let x = -100, y = -100, dx = x, dy = y, moving = false;
    const HOVER = 'a,button,.arc-portal,summary,label,select,[data-lead],.chip,.bx,.lab-card,.el,.legend button,.wa-float,.tags span,.role,.st,.bl-chip';
    const DRAG = '.ring-stage,.sphere';
    const TEXT = 'input:not([type=checkbox]):not([type=radio]),textarea,[contenteditable]';
    addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX; y = e.clientY; html.classList.add('cur-on');
      const t = e.target instanceof Element ? e.target : null;
      const text = !!(t && t.closest(TEXT)), drag = !text && !!(t && t.closest(DRAG));
      html.classList.toggle('cur-text', text);
      html.classList.toggle('cur-drag', drag);
      html.classList.toggle('cur-hover', !drag && !text && !!(t && t.closest(HOVER)));
      dot.textContent = drag ? 'drag' : '';
      if (!moving) { moving = true; requestAnimationFrame(loop); }
    }, { passive: true });
    addEventListener('pointerdown', () => html.classList.add('cur-down'));
    addEventListener('pointerup', () => html.classList.remove('cur-down'));
    document.addEventListener('mouseleave', () => html.classList.remove('cur-on'));
    function loop(){
      dx += (x - dx) * 0.35; dy += (y - dy) * 0.35;
      dot.style.transform = `translate3d(${dx}px,${dy}px,0)`;
      if (Math.abs(x - dx) > .1 || Math.abs(y - dy) > .1) requestAnimationFrame(loop); else moving = false;
    }
  })();

  /* ---------- 3) 3D logo (Three.js, loaded only when needed) ---------- */
  (function logo3d(){
    const box = document.querySelector('.logo3d'); if (!box) return;
    let started = false;
    const io = new IntersectionObserver(es => { if (es[0].isIntersecting && !started) { started = true; io.disconnect(); start(); } }, { rootMargin: '200px' });
    io.observe(box);
    // backup in case the visibility signal never arrives (e.g. a tab opened in the background)
    setTimeout(() => { if (started) return; const r = box.getBoundingClientRect(); if (r.top < innerHeight + 200 && r.bottom > -200) { started = true; io.disconnect(); start(); } }, 1200);
    async function start(){
      let THREE;
      try { THREE = await import('https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js'); } catch { return; }   // keeps the flat logo
      const canvas = document.createElement('canvas'); canvas.setAttribute('aria-hidden', 'true');
      let renderer;
      try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch { return; }
      box.appendChild(canvas); box.classList.add('is-3d');
      renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 1, 1000); camera.position.set(0, 0, 290);

      // The mark, traced from the logo (SVG units, y flipped): rounded block, round hole and an opening on the right.
      const S = new THREE.Shape(), Y = v => 50 - v;
      S.moveTo(14, Y(8)); S.lineTo(41, Y(8));
      S.absarc(41, Y(42), 34, Math.PI / 2, Math.asin(0.5 / 34), true);       // top-right curve down to the opening
      S.lineTo(64.1 + 3, Y(41.5)); S.quadraticCurveTo(64.1, Y(41.5), 64.6, Y(44));
      S.absarc(46, Y(50), 20, Math.atan2(Y(41.5) - Y(50), 64.1 - 46) - .06, Math.atan2(Y(58.5) - Y(50), 64.1 - 46) + .06, false);  // around the hole
      S.quadraticCurveTo(64.1, Y(58.5), 67.1, Y(58.5)); S.lineTo(75, Y(58.5));
      S.absarc(41, Y(58), 34, -Math.asin(0.5 / 34), -Math.PI / 2, true);     // bottom-right curve
      S.lineTo(14, Y(92)); S.quadraticCurveTo(6, Y(92), 6, Y(84)); S.lineTo(6, Y(16)); S.quadraticCurveTo(6, Y(8), 14, Y(8));
      const geo = new THREE.ExtrudeGeometry(S, { depth: 16, bevelEnabled: true, bevelThickness: 2.4, bevelSize: 1.8, bevelSegments: 5, curveSegments: 48 });
      geo.translate(-44, 0, -8);
      const mark = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color: 0xf6f0ff, roughness: .28, metalness: .1, clearcoat: 1, clearcoatRoughness: .15 }));
      const dotM = new THREE.Mesh(new THREE.SphereGeometry(8, 48, 32), new THREE.MeshStandardMaterial({ color: 0xc9a2ff, emissive: 0x8b5cf6, emissiveIntensity: .7, roughness: .3 }));
      dotM.position.set(85 - 44, 0, 0);
      const group = new THREE.Group(); group.add(mark, dotM); scene.add(group);
      scene.add(new THREE.AmbientLight(0xffffff, .55));
      const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(80, 120, 160); scene.add(key);
      const rimP = new THREE.PointLight(0xc9a2ff, 9000, 0, 2); rimP.position.set(-140, 60, 60); scene.add(rimP);
      const rimV = new THREE.PointLight(0x8b5cf6, 9000, 0, 2); rimV.position.set(150, -90, 40); scene.add(rimV);

      let tx = 0, ty = 0, visible = true, raf = 0;
      function size(){ const r = box.getBoundingClientRect(); renderer.setSize(r.width, r.height, false); camera.aspect = r.width / Math.max(1, r.height); camera.updateProjectionMatrix(); }
      size(); addEventListener('resize', size);
      addEventListener('pointermove', e => { const r = box.getBoundingClientRect(); tx = ((e.clientX - (r.left + r.width / 2)) / innerWidth) * 1.4; ty = ((e.clientY - (r.top + r.height / 2)) / innerHeight) * 1.0; }, { passive: true });
      new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible && !raf) raf = requestAnimationFrame(frame); }).observe(box);
      function frame(now){
        raf = 0;
        const t = now / 1000, idle = reduce ? 0 : 1;
        group.rotation.y += ((tx * .9 + Math.sin(t * .6) * .35 * idle) - group.rotation.y) * .06;
        group.rotation.x += ((ty * .6 + Math.sin(t * .8) * .08 * idle) - group.rotation.x) * .06;
        group.position.y = Math.sin(t * 1.1) * 3 * idle;
        dotM.scale.setScalar(1 + Math.sin(t * 2.4) * .06 * idle);
        renderer.render(scene, camera);
        if (visible && !reduce) raf = requestAnimationFrame(frame);
      }
      raf = requestAnimationFrame(frame);
    }
  })();

  /* ---------- 4) Brand Lab: palette + font pairing from a business name ---------- */
  (function brandLab(){
    const lab = document.getElementById('brandLab'); if (!lab) return;
    const FONTS_URL = 'https://fonts.googleapis.com/css2?family=Anton&family=Work+Sans:wght@400;600&family=Fraunces:wght@600&family=Nunito+Sans:wght@400;600&family=Playfair+Display:wght@600&family=Lato:wght@400;700&family=Baloo+2:wght@600&family=Quicksand:wght@500;600&family=DM+Serif+Display&family=DM+Sans:wght@400;600&family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@400;500&display=swap';
    let fontsLoaded = false;
    const loadFonts = () => { if (fontsLoaded) return; fontsLoaded = true; const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = FONTS_URL; document.head.appendChild(l); };
    new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { loadFonts(); o.disconnect(); } }, { rootMargin: '400px' }).observe(lab);

    const VIBES = {
      bold:    { label: 'Bold',    display: 'Anton',            body: 'Work Sans',     taglines: ['Made to stand out.', 'Louder than the rest.', 'Big ideas, bigger impact.'] },
      calm:    { label: 'Calm',    display: 'Fraunces',         body: 'Nunito Sans',   taglines: ['Thoughtfully made.', 'Simple, honest, good.', 'Take a breath. We have you.'] },
      luxury:  { label: 'Luxury',  display: 'Playfair Display', body: 'Lato',          taglines: ['Crafted for the few.', 'Quiet luxury, every day.', 'Detail is everything.'] },
      playful: { label: 'Playful', display: 'Baloo 2',          body: 'Quicksand',     taglines: ['Joy in every order.', 'Come for the fun, stay for the love.', 'Happiness, delivered.'] },
      eco:     { label: 'Eco',     display: 'DM Serif Display', body: 'DM Sans',       taglines: ['Good for you. Good for the planet.', 'Grown with care.', 'Naturally better.'] },
      tech:    { label: 'Tech',    display: 'Space Grotesk',    body: 'IBM Plex Mono', taglines: ['Built for what is next.', 'Smarter by design.', 'Software that just works.'] }
    };
    const hash = s => { let h = 2166136261; for (const c of s) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
    const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    const hsl = (h, s, l) => { h = ((h % 360) + 360) % 360; s /= 100; l /= 100; const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); return '#' + [f(0), f(8), f(4)].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join(''); };
    const lum = hex => { const [r, g, b] = [1, 3, 5].map(i => { const c = parseInt(hex.slice(i, i + 2), 16) / 255; return c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4); }); return .2126 * r + .7152 * g + .0722 * b; };
    const on = hex => lum(hex) > .4 ? '#14101c' : '#ffffff';
    function palette(vibe, r){
      const j = (n) => (r() - .5) * n; let h = r() * 360;
      switch (vibe) {
        case 'bold':    return [hsl(h, 82 + j(8), 48 + j(6)), hsl(h - 25, 62, 30 + j(6)), hsl(h + 160, 92, 58), hsl(h, 40, 10), hsl(h, 30, 96)];
        case 'calm':    h = 150 + r() * 90; return [hsl(h, 35 + j(8), 45), hsl(h + 30, 30, 62), hsl(h - 30, 45, 72), hsl(h, 25, 15), hsl(h, 25, 96)];
        case 'luxury':  h = r() < .7 ? 250 + r() * 90 : r() * 20; return [hsl(h, 45, 22 + j(6)), hsl(h, 20, 36), hsl(40 + j(10), 62, 56), hsl(h, 30, 8), hsl(40, 30, 95)];
        case 'playful': return [hsl(h, 90, 60), hsl(h + 120, 85, 62), hsl(h + 240, 90, 66), hsl(h, 45, 18), hsl(h, 60, 97)];
        case 'eco':     h = 80 + r() * 70; return [hsl(h, 45 + j(8), 32), hsl(h - 50, 40, 55), hsl(32 + j(10), 70, 60), hsl(h, 30, 12), hsl(60, 30, 95)];
        default:        h = 190 + r() * 90; return [hsl(h, 85, 55), hsl(h + 40, 80, 62), hsl(h - 110, 95, 55), hsl(h, 45, 8), hsl(h, 30, 96)];
      }
    }
    const nameIn = lab.querySelector('#blName'), vibeBox = lab.querySelector('#blVibes'), out = lab.querySelector('#blOut'), cta = lab.querySelector('#blCta');
    let vibe = 'bold', shuffle = 0;
    Object.entries(VIBES).forEach(([k, v]) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = v.label; b.dataset.v = k; b.setAttribute('aria-pressed', k === vibe); vibeBox.appendChild(b); });
    vibeBox.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; vibe = b.dataset.v; shuffle = 0; vibeBox.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b)); render(); });
    lab.querySelector('#blShuffle').addEventListener('click', () => { shuffle++; render(); });
    nameIn.addEventListener('input', () => { shuffle = 0; render(); });
    const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    function render(){
      const name = (nameIn.value.trim() || 'Your Brand').slice(0, 32), v = VIBES[vibe], r = rng(hash(name.toLowerCase() + vibe) + shuffle * 7919);
      const [pri, sec, acc, dark, light] = palette(vibe, r), tag = v.taglines[Math.floor(r() * v.taglines.length)];
      const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('') || 'B';
      const D = `'${v.display}',Georgia,serif`, B = `'${v.body}',system-ui,sans-serif`;
      out.innerHTML = `
        <div class="bl-card" style="background:${light};color:${dark}">
          <div class="bl-top"><span class="bl-mono" style="background:${pri};color:${on(pri)};font-family:${D}">${esc(initials)}</span><span class="bl-name" style="font-family:${D}">${esc(name)}</span></div>
          <p class="bl-tag" style="font-family:${B}">${esc(tag)}</p>
          <div class="bl-ui"><span class="bl-btn" style="background:${pri};color:${on(pri)};font-family:${B}">Shop now</span><span class="bl-pill" style="background:${sec};color:${on(sec)};font-family:${B}">New</span><span class="bl-pill" style="background:${acc};color:${on(acc)};font-family:${B}">Featured</span></div>
          <div class="bl-post" style="background:${dark};color:${light}"><span style="font-family:${D}">${esc(tag)}</span><i style="background:${acc}"></i></div>
        </div>
        <div class="bl-side">
          <div class="bl-sw">${[['Primary', pri], ['Secondary', sec], ['Accent', acc], ['Dark', dark], ['Light', light]].map(([n, c]) => `<button type="button" class="bl-chip" data-hex="${c}" title="Copy ${c}"><i style="background:${c}"></i><b>${n}</b><span>${c.toUpperCase()}</span></button>`).join('')}</div>
          <div class="bl-fonts"><div><small>Headings</small><b style="font-family:${D}">${v.display}</b></div><div><small>Body</small><b style="font-family:${B};font-weight:400">${v.body}</b></div></div>
        </div>`;
      cta.setAttribute('data-lead-idea', `Brand identity for "${name}" (${v.label} vibe). Starter palette ${[pri, sec, acc].join(', ')}; fonts ${v.display} + ${v.body}.`);
    }
    out.addEventListener('click', async e => {
      const c = e.target.closest('.bl-chip'); if (!c) return;
      const hex = c.dataset.hex.toUpperCase(), label = c.querySelector('span');
      try { await navigator.clipboard.writeText(hex); label.textContent = 'Copied!'; } catch { label.textContent = hex; }
      setTimeout(() => { label.textContent = hex; }, 1200);
    });
    render();
  })();
})();
