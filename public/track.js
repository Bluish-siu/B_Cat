/* Branding Catalyst: ad tracking, cookie consent and lead attribution.
   Loaded on every page (added by scripts/build-seo.cjs).

   EDIT the IDs below once you have them. While they are empty, nothing is loaded,
   no cookie banner is shown, and only first-party attribution (below) is kept.

   What it does:
   1. Remembers where a visitor came from (utm_* tags, Google/Meta click IDs, landing page, referrer)
      in this browser, so every lead says which ad or search brought it. window.bcAttribution()
   2. Shows a small cookie banner (Accept / Decline) when a tracking ID is set, and loads
      Google tag (GA4 + Google Ads) with Consent Mode v2, and the Meta Pixel only after Accept.
   3. window.bcTrack(name, params) sends events; WhatsApp, phone and email link clicks are tracked
      automatically. Lead events also count as Google Ads conversions when a label is set. */
(() => {
  const GA4_ID = '';             // EDIT: Google Analytics 4 measurement ID, e.g. 'G-ABC123XYZ'
  const ADS_ID = '';             // EDIT: Google Ads tag ID, e.g. 'AW-123456789'
  const ADS_LABELS = {           // EDIT: Google Ads conversion labels (Goals → Conversions → each action → Tag setup)
    lead: '',                    //   any form / ARC / Idea Checker lead, e.g. 'AbCdEfGhIjk'
    whatsapp: '',                //   WhatsApp button or link click
    call: ''                     //   phone number tap
  };
  const META_PIXEL_ID = '';      // EDIT: Meta (Facebook/Instagram) Pixel ID, e.g. '1234567890'

  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };

  /* ---------- 1. attribution (first-party, never leaves the browser except inside a lead) ---------- */
  const KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid', 'fbclid'];
  const q = new URLSearchParams(location.search);
  const now = new Date().toISOString();
  const fromAd = KEYS.some(k => q.get(k));
  const ref = document.referrer && !document.referrer.startsWith(location.origin) ? document.referrer.split('?')[0] : '';
  let attr = store.get('bc_attr');
  const fresh = !attr || (attr.saved && Date.now() - new Date(attr.saved).getTime() > 90 * 864e5);
  if (fresh || fromAd) {
    // a new ad click replaces the old campaign; the first visit date is kept
    const next = { first_visit: (!fresh && attr && attr.first_visit) || now, saved: now, landing: location.pathname, referrer: ref || (attr && !fromAd ? attr.referrer : '') };
    KEYS.forEach(k => { const v = q.get(k); if (v) next[k] = v.slice(0, 200); });
    if (!fromAd && attr && !fresh) KEYS.forEach(k => { if (attr[k]) next[k] = attr[k]; });
    attr = next; store.set('bc_attr', attr);
  } else if (ref && !attr.referrer) { attr.referrer = ref; store.set('bc_attr', attr); }
  window.bcAttribution = () => { const a = { ...(store.get('bc_attr') || {}) }; delete a.saved; return a; };

  /* ---------- 2. consent + tags ---------- */
  const anyTag = !!(GA4_ID || ADS_ID || META_PIXEL_ID);
  window.dataLayer = window.dataLayer || [];
  const gtag = window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  let consent = store.get('bc_consent');            // 'granted' | 'denied' | null
  let metaLoaded = false;

  function loadMeta() {
    if (!META_PIXEL_ID || metaLoaded) return; metaLoaded = true;
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', META_PIXEL_ID); window.fbq('track', 'PageView');
  }
  function applyConsent(state) {
    consent = state; store.set('bc_consent', state);
    const v = state === 'granted' ? 'granted' : 'denied';
    gtag('consent', 'update', { ad_storage: v, analytics_storage: v, ad_user_data: v, ad_personalization: v });
    if (state === 'granted') loadMeta();
  }

  if (GA4_ID || ADS_ID) {
    gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 500 });
    if (consent === 'granted') gtag('consent', 'update', { ad_storage: 'granted', analytics_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' });
    const s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + (GA4_ID || ADS_ID);
    document.head.appendChild(s);
    gtag('js', new Date());
    if (GA4_ID) gtag('config', GA4_ID);
    if (ADS_ID) gtag('config', ADS_ID);
  }
  if (consent === 'granted') loadMeta();

  function banner() {
    if (!anyTag || document.getElementById('bcCookie')) return;
    const css = document.createElement('style');
    css.textContent = `.bc-cookie{position:fixed;left:max(12px,env(safe-area-inset-left,0px));right:max(12px,env(safe-area-inset-right,0px));bottom:max(12px,env(safe-area-inset-bottom,0px));z-index:120;max-width:640px;margin:0 auto;display:flex;flex-wrap:wrap;gap:12px 16px;align-items:center;padding:14px 16px;border-radius:16px;border:1px solid rgba(201,162,255,.25);background:#1b1129;color:#f1edf7;font:400 14px/1.5 var(--f-body,system-ui,sans-serif);box-shadow:0 20px 60px -20px rgba(0,0,0,.8)}
    .bc-cookie p{margin:0;flex:1 1 260px;min-width:0;color:#d9d1e8}.bc-cookie a{color:#c9a2ff}
    .bc-cookie .bk{display:flex;gap:8px;flex:none}.bc-cookie button{border-radius:10px;padding:9px 16px;font:500 14px var(--f-body,system-ui,sans-serif);cursor:pointer;border:1px solid rgba(201,162,255,.3);background:transparent;color:#f1edf7}
    .bc-cookie button.ok{background:#c9a2ff;border-color:#c9a2ff;color:#1a0b2e}`;
    document.head.appendChild(css);
    const el = document.createElement('div');
    el.className = 'bc-cookie'; el.id = 'bcCookie'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Cookie choice');
    el.innerHTML = '<p>We use cookies to measure our ads and improve this site. <a href="privacy.html#cookies">Learn more</a></p><div class="bk"><button type="button" data-c="denied">Decline</button><button type="button" class="ok" data-c="granted">Accept</button></div>';
    el.addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (!b) return; applyConsent(b.dataset.c); el.remove(); });
    document.body.appendChild(el);
  }
  // reopen from any link with data-cookie-settings (e.g. on the Privacy page)
  window.bcCookieSettings = () => { if (!anyTag) return false; const old = document.getElementById('bcCookie'); if (old) old.remove(); banner(); return true; };
  if (anyTag && !consent) (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', banner) : banner());
  document.addEventListener('click', e => { const t = e.target.closest('[data-cookie-settings]'); if (t) { e.preventDefault(); if (!window.bcCookieSettings()) t.textContent = 'This site does not set tracking cookies right now.'; } });

  /* ---------- 3. events ---------- */
  const LEAD_EVENTS = ['generate_lead', 'arc_lead', 'checker_lead', 'landing_lead'];
  window.bcTrack = (name, params = {}) => {
    try {
      if (GA4_ID) gtag('event', name, params);
      const label = LEAD_EVENTS.includes(name) ? ADS_LABELS.lead : name === 'whatsapp_click' ? ADS_LABELS.whatsapp : name === 'phone_click' ? ADS_LABELS.call : '';
      if (ADS_ID && label) gtag('event', 'conversion', { send_to: ADS_ID + '/' + label });
      if (metaLoaded && window.fbq) {
        if (LEAD_EVENTS.includes(name)) window.fbq('track', 'Lead', { content_name: params.form || name });
        else if (name === 'whatsapp_click' || name === 'phone_click') window.fbq('track', 'Contact');
      }
    } catch {}
  };
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]'); if (!a) return;
    const h = a.getAttribute('href');
    if (/wa\.me\/|api\.whatsapp\.com/.test(h)) window.bcTrack('whatsapp_click', { page: location.pathname, link_text: (a.textContent || a.getAttribute('aria-label') || '').trim().slice(0, 60) });
    else if (/^tel:/.test(h)) window.bcTrack('phone_click', { page: location.pathname });
    else if (/^mailto:/.test(h)) window.bcTrack('email_click', { page: location.pathname, to: h.slice(7).split('?')[0] });
  }, true);
})();
