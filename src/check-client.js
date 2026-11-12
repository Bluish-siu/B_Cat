/* ===== Idea Checker page: describe → analyse → result → unlock price ===== */
(() => {
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const goTo = el => window.bcScrollTo ? window.bcScrollTo(el) : el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
/*__ESTIMATOR__*/

/* EDIT: your average cost per build-week in rupees. Leave 0 to show a placeholder instead of a price. */
const WEEK_RATE_INR = 0;
const PLATFORMS = { web: 'Website / web app', mobile: 'Mobile app (Android + iOS)', both: 'Web + mobile apps', ai: 'AI tool / assistant' };
const STAGES = { mvp: { k: 0.85, label: 'MVP' }, grow: { k: 1.15, label: 'Growing business' }, ent: { k: 1.5, label: 'Enterprise' } };
const IMPOSSIBLE = /time ?machine|teleport|perpetual motion|read (people'?s )?minds|mind ?reading|guarantee(d)? lottery|predict lottery|immortal|travel faster than light/;
const EXAMPLES = [
  ['Salon booking app', 'A mobile app where customers book salon appointments, pay with UPI and collect loyalty points, with an admin dashboard for every branch.'],
  ['AI receptionist', 'An AI receptionist for our clinic that answers phone calls in Hindi and English, books appointments and sends WhatsApp reminders.'],
  ['3D sofa configurator', 'A 3D configurator on our website where shoppers change sofa fabric and size, see the price update live and order online.'],
  ['Factory ERP', 'An ERP for our factory covering inventory, purchase orders, GST invoices, attendance and payroll, with reports for the owner.'],
  ['Teleport app', 'An app that teleports parcels from Mumbai to Delhi instantly.']
];

const st = { platform: null, feats: new Set(), touched: new Set(), stage: 'mvp', est: null, unlocked: false };
const ta = $('#ckIdea');

// examples
$('#ckEx').innerHTML = EXAMPLES.map((e, i) => `<button type="button" class="chip" data-i="${i}">${e[0]}</button>`).join('');
$('#ckEx').addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (!b) return; ta.value = EXAMPLES[b.dataset.i][1]; st.touched.clear(); st.platform = null; analyse(); ta.focus(); });

// platform + stage
$('#ckPlat').addEventListener('click', e => { const b = e.target.closest('[data-p]'); if (!b) return; st.platform = b.dataset.p; paint(); });
$('#ckStage').addEventListener('click', e => { const b = e.target.closest('[data-s]'); if (!b) return; st.stage = b.dataset.s; paint(); });
// features
$('#ckFeat').innerHTML = FEATURES.map((f, i) => `<button type="button" class="tog" data-f="${i}">${f.label}</button>`).join('');
$('#ckFeat').addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (!b) return; const i = +b.dataset.f; st.touched.add(i); st.feats.has(i) ? st.feats.delete(i) : st.feats.add(i); paint(); });

function guessPlatform(t) {
  const has = id => PRODUCTS.find(p => p.id === id).re.test(id === 'mobile' ? t.replace(/whatsapp/g, ' ') : t);
  if ((has('rag') || has('agent')) && !/android|\bios\b|mobile/.test(t)) return 'ai';
  if (has('mobile') && /website|web ?app|\bweb\b|portal/.test(t)) return 'both';
  if (has('mobile')) return 'mobile';
  return 'web';
}
function analyse() {
  const t = ' ' + ta.value.toLowerCase() + ' ';
  FEATURES.forEach((f, i) => { if (st.touched.has(i)) return; f.re.test(t) ? st.feats.add(i) : st.feats.delete(i); });
  paint();
}
function estimate() {
  const t = ' ' + ta.value.toLowerCase() + ' ', plat = st.platform || guessPlatform(t);
  const byId = id => PRODUCTS.find(p => p.id === id);
  let prods = PRODUCTS.filter(p => ['erp', 'three', 'growth', 'brand', 'agent'].includes(p.id) && p.re.test(t));
  const platProds = { web: ['web'], mobile: ['mobile'], both: ['web', 'mobile'], ai: ['rag'] }[plat].map(byId);
  // an ERP or 3D build on the web already includes the web platform
  if (!(plat === 'web' && prods.some(p => ['erp', 'three'].includes(p.id)))) prods = [...platProds, ...prods];
  if (plat === 'ai' && prods.some(p => p.id === 'agent')) prods = prods.filter(p => p.id !== 'rag' || /document|knowledge|faq|receptionist|support/.test(t));
  const feats = [...st.feats].map(i => FEATURES[i]), stage = STAGES[st.stage];
  const base = prods.reduce((s, p) => s + p.weeks, 0), extra = feats.reduce((s, f) => s + f.weeks, 0);
  const lo = Math.max(2, (base * 0.8 + extra * 0.6) * stage.k), hi = lo * 1.4 + 1;
  let roles = uniq([...prods.flatMap(p => p.roles), ...feats.flatMap(f => f.roles || [])]);
  if (st.stage !== 'mvp') roles = uniq([...roles, 'QA engineer']);
  if (st.stage === 'ent') roles = uniq([...roles, 'DevOps engineer', 'Security reviewer']);
  const stack = uniq([...prods.flatMap(p => p.stack), ...feats.flatMap(f => f.stack || [])]).slice(0, 8);
  const risky = feats.filter(f => /IoT|Image|Predictions|Voice/.test(f.label)).length;
  const words = ta.value.trim().split(/\s+/).filter(Boolean).length;
  const impossible = IMPOSSIBLE.test(t);
  let score = Math.round(97 - prods.length * 2 - feats.length * 1.2 - risky * 3 - (st.stage === 'ent' ? 3 : 0) - (words < 8 ? 6 : 0));
  score = impossible ? 12 : Math.max(62, Math.min(97, score));
  const name = impossible ? 'Not buildable (yet)' : prods.slice(0, 3).map(p => p.name).join(' + ');
  const cx = hi > 16 ? ['Complex', 'large, phased build'] : hi > 9 ? ['Medium', 'medium build'] : ['Easy', 'compact build'];
  return { plat, prods, feats, lo, hi, roles, stack, risky, words, impossible, score, name, cx };
}
const fmtR = n => '₹' + (n >= 1e5 ? (n / 1e5).toFixed(n >= 1e6 ? 0 : 1).replace(/\.0$/, '') + ' lakh' : Math.round(n / 1000) + 'k');

function paint() {
  const e = st.est = estimate(), empty = !ta.value.trim();
  $$('#ckPlat [data-p]').forEach(b => { b.classList.toggle('on', b.dataset.p === e.plat); b.classList.toggle('auto', !st.platform && b.dataset.p === e.plat); });
  $$('#ckStage [data-s]').forEach(b => b.classList.toggle('on', b.dataset.s === st.stage));
  $$('#ckFeat [data-f]').forEach(b => b.classList.toggle('on', st.feats.has(+b.dataset.f)));
  // live analysis
  $('#laPlat').textContent = PLATFORMS[e.plat];
  $('#laCount').textContent = e.feats.length;
  $('#laFeats').innerHTML = empty ? '<i>Start typing, ARC is reading along…</i>' : e.feats.length ? e.feats.map(f => `<span>${esc(f.label)}</span>`).join('') : '<i>No add-ons spotted yet. Mention payments, bookings, chat, maps…</i>';
  $('#laCx').textContent = empty ? '—' : e.impossible ? 'Beyond today’s physics' : e.cx[0];
  $('#laCx').dataset.v = e.impossible ? 'x' : e.cx[0];
  const lvl = e.words < 8 ? ['Add more detail', 25] : e.words < 20 ? ['Good', 65] : ['Great', 100];
  $('#laDetail').textContent = empty ? '—' : lvl[0]; $('#laDetailBar').style.width = (empty ? 0 : lvl[1]) + '%';
  $('#laPrice').innerHTML = st.unlocked ? priceHTML(e) : '🔒 Unlocks after your result';
  steps(st.unlocked ? 4 : $('#ckRes').hidden ? (empty ? 1 : 2) : 3);
}
function steps(n) { $$('.steps li').forEach((li, i) => { li.classList.toggle('done', i < n - 1); li.classList.toggle('cur', i === n - 1); }); }
function priceHTML(e) {
  if (e.impossible) return 'Not applicable';
  if (!WEEK_RATE_INR) return '<span class="ph">₹[set your weekly rate]</span>';
  return `${fmtR(e.lo * WEEK_RATE_INR)} – ${fmtR(e.hi * WEEK_RATE_INR)}`;
}
ta.addEventListener('input', () => { clearTimeout(ta._t); ta._t = setTimeout(analyse, 120); });

// result
$('#ckForm').addEventListener('submit', ev => {
  ev.preventDefault();
  if (!ta.value.trim()) { ta.focus(); return; }
  const e = estimate(), res = $('#ckRes');
  res.hidden = false;
  if (e.impossible) {
    res.innerHTML = `<div class="card res"><div class="res-top">${ring(e.score)}<div><p class="eyebrow">Your result</p><h3>${e.name}</h3><p class="muted">We love the ambition, but this one needs a breakthrough in physics before it needs an app. Want to build the closest real thing, such as same-day delivery with live tracking? Try describing that instead.</p></div></div></div>`;
    paint(); goTo(res); return;
  }
  const core = uniq([...e.feats.map(f => f.label), ...e.prods.flatMap(p => CORE[p.id] || [])]);
  const p1 = core.slice(0, 4), p2 = core.slice(4, 8);
  const team = e.roles.map(r => `<span>${esc(r)}</span>`).join('');
  res.innerHTML = `<div class="card res">
    <div class="res-top">${ring(e.score)}<div><p class="eyebrow">Your result · ${esc(STAGES[st.stage].label)}</p><h3>${esc(e.name)}</h3><p class="muted">${e.score >= 85 ? 'Very buildable. This is the kind of product we ship regularly.' : e.score >= 75 ? 'Buildable, with a few parts that need careful planning.' : 'Buildable in phases. We would de-risk the hardest parts first.'}</p></div></div>
    <div class="res-grid">
      <div><small>Timeline</small><b>${fmtW(e.lo)} – ${fmtW(e.hi)}</b><em>${e.cx[1]}</em></div>
      <div><small>Team</small><b>${e.roles.length} specialists</b><em>plus a project lead you talk to</em></div>
      <div><small>Complexity</small><b>${e.cx[0]}</b><em>${e.feats.length} features detected</em></div>
    </div>
    <div class="res-sec"><small>Who builds it</small><div class="tagrow">${team}</div></div>
    <div class="res-sec"><small>Suggested stack</small><div class="tagrow">${e.stack.map(s => `<span>${esc(s)}</span>`).join('')}</div></div>
    <div class="res-sec"><small>Roadmap</small><ol class="road">
      <li><b>Phase 1 · Launch</b><p>${esc(p1.join(', '))}</p></li>
      ${p2.length ? `<li><b>Phase 2 · Grow</b><p>${esc(p2.join(', '))}</p></li>` : ''}
      <li><b>${p2.length ? 'Phase 3' : 'Phase 2'} · Get found</b><p>AEO and GEO so ChatGPT, Gemini and Perplexity recommend you, plus analytics to see what customers use.</p></li>
    </ol></div>
    <p class="ai-note"><b>AI-first:</b> we use AI for planning, code review, testing and content, which is part of why these timelines are shorter than a traditional agency’s.</p>
    <div class="unlock" id="ckUnlock">
      <div><h4>Unlock your price range</h4><p class="muted">Tell us where to send it. We’ll also WhatsApp you a short summary of this plan.</p></div>
      <form id="ckLead" novalidate>
        <input name="name" placeholder="Your name" autocomplete="name" required>
        <input name="phone" placeholder="WhatsApp number" inputmode="tel" autocomplete="tel" required>
        <input name="email" placeholder="Email" type="email" autocomplete="email" required>
        <input name="website" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true">
        <button class="btn btn-w" type="submit">Unlock my price →</button>
        <p class="err" id="ckErr" role="alert"></p>
      </form>
    </div>
  </div>`;
  $('#ckLead').addEventListener('submit', unlock);
  paint();
  requestAnimationFrame(() => requestAnimationFrame(() => { const c = res.querySelector('.ring-fg'); if (c) c.style.strokeDashoffset = 302 * (1 - e.score / 100); }));
  goTo(res);
});
const CORE = {
  erp: ['Inventory and stock tracking', 'Purchase and sales orders', 'Role-based access per department'],
  three: ['Interactive 3D model with colour and part swaps', 'Live price updates', 'Runs on phones, no app needed'],
  rag: ['Answers from your documents, with sources', 'Hand-off to a person when unsure', 'Admin panel to update knowledge'],
  agent: ['Automated workflow with approvals', 'Connections to your existing tools', 'Activity log and alerts'],
  growth: ['AI-search visibility audit', 'Answer-first pages with schema markup', 'Monthly AI-mention report'],
  brand: ['Logo and visual identity', 'Brand book and voice guide', 'Social media templates'],
  mobile: ['Phone OTP sign-up', 'Push notifications', 'Play Store and App Store release'],
  web: ['Responsive pages for every device', 'Easy content editing', 'SEO and AEO-ready structure']
};
function ring(score) {
  const col = score >= 80 ? 'var(--ok)' : score >= 50 ? 'var(--accent)' : 'var(--warm)';
  return `<div class="ring"><svg viewBox="0 0 110 110" aria-hidden="true"><circle cx="55" cy="55" r="48" class="ring-bg"/><circle cx="55" cy="55" r="48" class="ring-fg" style="stroke:${col}"/></svg><b>${score}</b><small>/100</small></div>`;
}

async function unlock(ev) {
  ev.preventDefault();
  const f = ev.target, v = n => f.elements[n].value.trim(), err = $('#ckErr'), btn = f.querySelector('button');
  if (!v('name')) return err.textContent = 'Enter your name.';
  if (!/^\+?[\d\s-]{8,16}$/.test(v('phone'))) return err.textContent = 'Enter a valid WhatsApp number.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email'))) return err.textContent = 'Enter a valid email address.';
  err.textContent = ''; btn.disabled = true; btn.textContent = 'Unlocking…';
  const e = st.est;
  const summary = `${e.name} · ${PLATFORMS[e.plat]} · ${STAGES[st.stage].label} · ${fmtW(e.lo)}–${fmtW(e.hi)} · features: ${e.feats.map(x => x.label).join(', ') || 'none detected'}`;
  try {
    await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'project', name: v('name'), phone: v('phone'), email: v('email'), service: e.name, budget: '', message: `Idea: ${ta.value.trim()}\n\nChecker result: ${summary}`, website: v('website'), source: 'Idea Checker page', page: location.pathname }) });
  } catch (_) { /* the price still unlocks; the WhatsApp link below is the backup channel */ }
  st.unlocked = true;
  const wa = 'https://wa.me/919004629888?text=' + encodeURIComponent(`Hi Branding Catalyst, I'm ${v('name')}. I checked my idea on your site:\n${ta.value.trim()}\n\nResult: ${summary}`);
  $('#ckUnlock').innerHTML = `<div class="price"><small>Estimated price range</small><b>${priceHTML(e)}</b><em>Indicative. We confirm a fixed price after a free scoping call.</em></div>
    <p class="muted">Thanks, ${esc(v('name'))}. Our team will review your idea and get back to you on WhatsApp.</p>
    <div class="row" style="display:flex;flex-wrap:wrap;gap:10px"><a class="btn btn-w" href="${wa}" target="_blank" rel="noopener">Send this plan on WhatsApp →</a><button class="btn" type="button" data-lead data-lead-idea="#ckIdea" data-lead-source="Idea Checker result">Book a free scoping call</button></div>`;
  paint();
}

// ?idea= from other pages (e.g. the homepage checker or ARC)
const q = new URLSearchParams(location.search).get('idea');
if (q) ta.value = q.slice(0, 600);
analyse();
})();
