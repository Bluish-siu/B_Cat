/* Branding Catalyst: lead capture, WhatsApp hand-off and floating WhatsApp button.
   Used on every page: <script src="leads.js" defer></script>
   - Any element with data-lead opens the "Start a project" form.
       data-lead-service="ERP Systems"   pre-selects a service
       data-lead-idea="#chkIn"           pre-fills the message from that field (or use plain text)
       data-lead-source="Idea checker"   records where the lead came from
   - Submitting opens WhatsApp with the details filled in and records the lead at /api/lead.
   - The footer form #subForm becomes a working newsletter signup. */
(() => {
  const WA_NUMBER = '919004629888';                 // EDIT: WhatsApp number in international format, no "+"
  const WA_DISPLAY = '+91 90046 29888';
  const SERVICES = ['Not sure yet', 'AI agents & chatbots', 'AI search (AEO/GEO) & growth', 'Branding', 'Mobile app (Android + iOS)', 'ERP system', 'Website / platform', '3D web experience'];
  const BUDGETS = ['Not sure yet', 'Under ₹1 lakh', '₹1–3 lakh', '₹3–10 lakh', '₹10 lakh+'];
  const wa = text => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- styles ---------- */
  const css = `
  .wa-float{position:fixed;right:max(18px,env(safe-area-inset-right,0px));bottom:max(18px,env(safe-area-inset-bottom,0px));z-index:85;display:grid;place-items:center;width:56px;height:56px;padding:0;border-radius:50%;background:#25d366;color:#fff;text-decoration:none;box-shadow:0 12px 30px -8px rgba(37,211,102,.6),0 0 0 1px rgba(255,255,255,.15) inset;transition:transform .2s,box-shadow .2s}
  .wa-float:hover{transform:translateY(-2px);box-shadow:0 16px 36px -8px rgba(37,211,102,.75)}
  .wa-float svg{width:31px;height:31px}
  .wa-float::after{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:0 0 0 0 rgba(37,211,102,.55);animation:waPulse 2.6s infinite;pointer-events:none}
  @keyframes waPulse{70%{box-shadow:0 0 0 14px rgba(37,211,102,0)}100%{box-shadow:0 0 0 0 rgba(37,211,102,0)}}
  @media(max-width:640px){.wa-float{width:52px;height:52px}.wa-float svg{width:28px;height:28px}}
  body.lead-open .wa-float{display:none}
  .lead-modal{position:fixed;inset:0;z-index:95;display:grid;place-items:center;padding:max(16px,env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) max(16px,env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px));background:rgba(8,4,14,.72);overflow-y:auto}
  .lead-card{position:relative;width:min(560px,100%);margin:auto;padding:clamp(22px,4vw,34px);border-radius:24px;border:1px solid rgba(201,162,255,.25);background:radial-gradient(90% 60% at 100% 0%,rgba(139,92,246,.22),transparent 60%),#17101f;color:var(--ink,#f1edf7);box-shadow:0 40px 100px -30px rgba(0,0,0,.8);display:grid;gap:14px}
  .lead-card h3{font-family:var(--f-display,system-ui,sans-serif);font-size:clamp(24px,3vw,30px);font-weight:600;letter-spacing:-.02em;margin:0;line-height:1.15}
  .lead-card .lead-sub{color:var(--muted,#a79fbb);font-size:15px;margin:0}
  .lead-x{position:absolute;top:14px;right:14px;width:38px;height:38px;border-radius:50%;border:1px solid rgba(201,162,255,.25);background:transparent;color:inherit;font-size:20px;line-height:1;cursor:pointer}
  .lead-x:hover{background:rgba(201,162,255,.12)}
  .lead-form{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .lead-form .full{grid-column:1/-1}
  .lead-f{display:grid;gap:6px;min-width:0}
  .lead-f label{font-size:13px;color:var(--muted,#a79fbb)}
  .lead-f label b{color:#f2a7c3;font-weight:500}
  .lead-f input,.lead-f select,.lead-f textarea{width:100%;min-width:0;background:rgba(13,7,22,.7);border:1px solid rgba(201,162,255,.22);border-radius:11px;color:var(--ink,#f1edf7);font:400 15px var(--f-body,system-ui,sans-serif);padding:11px 12px}
  .lead-f textarea{min-height:92px;resize:vertical}
  .lead-f input:focus,.lead-f select:focus,.lead-f textarea:focus{outline:none;border-color:#c9a2ff;box-shadow:0 0 0 4px rgba(201,162,255,.14)}
  .lead-f [aria-invalid="true"]{border-color:#f2a7a7}
  .lead-consent{display:flex;gap:10px;align-items:flex-start;font-size:13px;color:var(--muted,#a79fbb)}
  .lead-consent input{margin-top:3px;accent-color:#c9a2ff}
  .lead-consent a{color:#c9a2ff;text-decoration:underline}
  .lead-hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}
  .lead-go{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:14px 18px;border-radius:12px;border:0;background:#25d366;color:#05301a;font:600 16px var(--f-body,system-ui,sans-serif);cursor:pointer}
  .lead-go:hover{filter:brightness(1.05)}
  .lead-go svg{width:22px;height:22px}
  .lead-note{font-size:12.5px;color:var(--dim,#716885);margin:0;text-align:center}
  .lead-err{color:#f2a7a7;font-size:13.5px;margin:0;min-height:1em}
  .lead-done{display:grid;gap:12px;text-align:center;justify-items:center}
  .lead-done .tick{width:56px;height:56px;border-radius:50%;display:grid;place-items:center;background:rgba(37,211,102,.15);color:#25d366;font-size:28px}
  .lead-done p{color:var(--muted,#a79fbb);margin:0}
  .lead-done a{color:#c9a2ff}
  .sub-msg{width:100%;font-size:13px;margin:4px 0 0;color:var(--muted,#a79fbb)}
  @media(max-width:520px){.lead-form{grid-template-columns:1fr}}
  `;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const WA_ICON = '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3C8.8 3 3 8.6 3 15.6c0 2.5.7 4.8 2 6.8L3.6 29l6.8-1.8c1.8 1 3.8 1.5 5.6 1.5 7.2 0 13-5.6 13-12.6S23.2 3 16 3zm0 23.3c-1.7 0-3.5-.5-5-1.4l-.4-.2-4 1.1 1.1-3.9-.3-.4a10.4 10.4 0 0 1-1.7-5.9C5.7 9.9 10.3 5.4 16 5.4s10.3 4.5 10.3 10.2S21.7 26.3 16 26.3z"/><path fill="currentColor" d="M21.6 18.4c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.4 8.4 0 0 1-4.2-3.7c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1 2.5c0 1.5 1.1 2.9 1.2 3.1s2.1 3.2 5.1 4.5c1.9.8 2.6.9 3.6.7a3 3 0 0 0 2-1.4c.2-.6.2-1.1.2-1.2-.1-.2-.3-.3-.6-.4z"/></svg>';

  /* ---------- floating WhatsApp button ---------- */
  const float = document.createElement('a');
  float.className = 'wa-float'; float.target = '_blank'; float.rel = 'noopener';
  float.href = wa("Hi Branding Catalyst! I'd like to discuss a project.");
  float.setAttribute('aria-label', 'Chat with Branding Catalyst on WhatsApp');
  float.title = 'Chat with us on WhatsApp';
  float.innerHTML = WA_ICON;
  document.body.appendChild(float);

  /* ---------- "Start a project" form ---------- */
  const modal = document.createElement('div');
  modal.className = 'lead-modal'; modal.hidden = true; modal.setAttribute('data-lenis-prevent', '');
  modal.innerHTML = `
  <div class="lead-card" role="dialog" aria-modal="true" aria-labelledby="leadTitle">
    <button class="lead-x" type="button" aria-label="Close">×</button>
    <div class="lead-step">
      <p class="eyebrow">Start a project</p>
      <h3 id="leadTitle">Tell us what you want to build</h3>
      <p class="lead-sub">Share a few details and we'll get back to you on WhatsApp or email with next steps and a free scoping call.</p>
      <form class="lead-form" id="leadForm" novalidate>
        <div class="lead-f"><label for="leadName">Your name <b>*</b></label><input id="leadName" name="name" autocomplete="name" required></div>
        <div class="lead-f"><label for="leadPhone">WhatsApp / phone <b>*</b></label><input id="leadPhone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+91 98765 43210" required></div>
        <div class="lead-f full"><label for="leadEmail">Email (optional)</label><input id="leadEmail" name="email" type="email" autocomplete="email" placeholder="you@company.com"></div>
        <div class="lead-f"><label for="leadService">What do you need?</label><select id="leadService" name="service">${SERVICES.map(s => `<option>${s}</option>`).join('')}</select></div>
        <div class="lead-f"><label for="leadBudget">Budget</label><select id="leadBudget" name="budget">${BUDGETS.map(s => `<option>${s}</option>`).join('')}</select></div>
        <div class="lead-f full"><label for="leadMsg">Your idea</label><textarea id="leadMsg" name="message" placeholder="e.g. A booking app for my 3 salons with online payments and loyalty points"></textarea></div>
        <input class="lead-hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
        <label class="lead-consent full"><input type="checkbox" id="leadConsent" required><span>I agree to be contacted about my enquiry and accept the <a href="privacy.html" target="_blank">Privacy Policy</a>.</span></label>
        <p class="lead-err full" id="leadErr" role="alert"></p>
        <button class="lead-go full" type="submit">${WA_ICON}Send on WhatsApp</button>
        <p class="lead-note full">WhatsApp opens with your details filled in. Just tap Send.</p>
      </form>
    </div>
    <div class="lead-done" hidden>
      <div class="tick">✓</div>
      <h3 id="leadDoneTitle">Thanks!</h3>
      <p>WhatsApp has opened with your details. Tap <b>Send</b> there to reach our team.</p>
      <p>Didn't open? Message us on <a id="leadWaLink" href="#" target="_blank" rel="noopener">${WA_DISPLAY}</a>.</p>
      <button class="btn" type="button" data-close>Close</button>
    </div>
  </div>`;
  document.body.appendChild(modal);

  const $m = s => modal.querySelector(s);
  const form = $m('#leadForm'), err = $m('#leadErr');
  let lastFocus = null, source = 'Website';

  function open(opts = {}) {
    lastFocus = document.activeElement;
    $m('.lead-step').hidden = false; $m('.lead-done').hidden = true; err.textContent = '';
    if (opts.service) { const o = [...$m('#leadService').options].find(x => x.text.toLowerCase().includes(opts.service.toLowerCase())); if (o) $m('#leadService').value = o.text; }
    if (opts.idea) $m('#leadMsg').value = opts.idea;
    source = opts.source || 'Website';
    modal.hidden = false; document.body.classList.add('lead-open');
    if (window.__lenis) window.__lenis.stop();
    setTimeout(() => $m('#leadName').focus(), 30);
  }
  function close() {
    modal.hidden = true; document.body.classList.remove('lead-open');
    if (window.__lenis) window.__lenis.start();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  window.openLeadForm = open;

  $m('.lead-x').addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('[data-close]')) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-lead]'); if (!t) return;
    e.preventDefault();
    const ideaRef = t.getAttribute('data-lead-idea') || '';
    let idea = ideaRef;
    if (ideaRef.startsWith('#')) { const el = document.querySelector(ideaRef); idea = el ? (el.value || el.textContent || '').trim() : ''; }
    open({ service: t.getAttribute('data-lead-service') || '', idea, source: t.getAttribute('data-lead-source') || t.textContent.trim().slice(0, 40) });
  });

  form.addEventListener('submit', e => {
    e.preventDefault(); err.textContent = '';
    const v = n => form.elements[n].value.trim();
    const fields = { name: $m('#leadName'), phone: $m('#leadPhone'), email: $m('#leadEmail') };
    Object.values(fields).forEach(f => f.removeAttribute('aria-invalid'));
    const bad = (f, msg) => { f.setAttribute('aria-invalid', 'true'); f.focus(); err.textContent = msg; };
    if (!v('name')) return bad(fields.name, 'Please enter your name.');
    if (!/^\+?[0-9][0-9\s-]{7,15}$/.test(v('phone'))) return bad(fields.phone, 'Please enter a valid phone number, e.g. +91 98765 43210.');
    if (v('email') && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v('email'))) return bad(fields.email, 'Please check your email address.');
    if (!$m('#leadConsent').checked) { err.textContent = 'Please tick the box so we can contact you.'; $m('#leadConsent').focus(); return; }

    const lead = { type: 'project', name: v('name'), phone: v('phone'), email: v('email'), service: v('service'), budget: v('budget'), message: v('message'), website: form.elements.website.value, source, page: location.pathname };
    const text = [
      "Hi Branding Catalyst! I'd like to start a project.",
      `Name: ${lead.name}`, `Phone: ${lead.phone}`, lead.email && `Email: ${lead.email}`,
      `Service: ${lead.service}`, `Budget: ${lead.budget}`, lead.message && `Idea: ${lead.message}`
    ].filter(Boolean).join('\n');
    const link = wa(text);
    window.open(link, '_blank', 'noopener');                        // must happen inside the submit to avoid popup blockers
    fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead), keepalive: true }).catch(() => {});
    $m('#leadWaLink').href = link;
    $m('#leadDoneTitle').textContent = `Thanks, ${lead.name.split(' ')[0]}!`;
    $m('.lead-step').hidden = true; $m('.lead-done').hidden = false;
    form.reset();
  });

  /* ---------- newsletter (footer) ---------- */
  const sub = document.getElementById('subForm');
  if (sub) {
    const input = sub.querySelector('input'), btn = sub.querySelector('button');
    let msg = sub.querySelector('.sub-msg');
    if (!msg) { msg = document.createElement('p'); msg.className = 'sub-msg'; msg.setAttribute('role', 'status'); sub.appendChild(msg); }
    sub.addEventListener('submit', async e => {
      e.preventDefault(); e.stopImmediatePropagation();
      const email = input.value.trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { msg.textContent = 'Please enter a valid email address.'; input.focus(); return; }
      btn.disabled = true; btn.textContent = 'Subscribing…';
      try {
        const r = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'newsletter', email, source: 'Footer newsletter', page: location.pathname }) });
        if (!r.ok) throw new Error();
        btn.textContent = 'Subscribed ✓'; msg.textContent = "You're on the list. We'll share AI, branding and build notes now and then.";
        input.value = '';
      } catch { btn.disabled = false; btn.textContent = 'Subscribe'; msg.textContent = "That didn't go through. Please try again in a moment."; }
    }, true);
  }
})();
