// Generates public/products.html: ARCO, the software products Branding Catalyst builds and runs.
// Reuses the Services page shell (head, styles, nav, footer, scripts). Screenshots live in
// public/products/arco/ (taken from arcooptics.com). EDIT the copy in PRODUCTS below.
const fs = require('fs'), path = require('path');
const [site] = process.argv.slice(2);
const svc = fs.readFileSync(path.join(site, 'services.html'), 'utf8');
const cut = (s, a, b) => { const i = s.indexOf(a), j = s.indexOf(b, i + 1); if (i < 0 || j < 0) throw new Error('cut: ' + a.slice(0, 40)); return s.slice(i, j); };

const headTop = cut(svc, '<!doctype html>', '<meta name="description"');
const baseCss = cut(svc, '<style>\n:root{', '/* AI-first trio */');
const tailCss = cut(svc, '/* faq + cta */', '</style>');
const bodyTop = cut(svc, '<body>', '<header class="nav">');
const header = cut(svc, '<header class="nav">', '<main>')
  .replace(' aria-current="page"', '')
  .replace('<a href="products.html">', '<a href="products.html" aria-current="page">')
  .replace('data-lead-source="Services header"', 'data-lead-source="Products header"');
const footerAndScripts = svc.slice(svc.indexOf('<footer>'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const IMG = 'products/arco/';

const PRODUCTS = [
  {
    id: 'arco-labs', c: '#7fd6e8', name: 'Arco Labs', kicker: 'ARCO Optics · for optical laboratories',
    title: 'Lab ERP, from prescription to dispatch.',
    lead: 'One system for every lab branch and the head office: Rx order entry, production, quality control, inventory, purchasing, accounts and delivery, with live data.',
    chips: ['Multi-branch', 'Rx job tracking', 'WhatsApp purchase orders', 'GST-ready'],
    points: [
      ['Speed-punched Rx orders', 'Brand, index, coating, tint, SPH, CYL, axis, add and prism per eye, all from the keyboard.'],
      ['Every job, stage by stage', 'Order entry → store → blocking → QC → coating → final QC → dispatch.'],
      ['Inventory command centre', 'Stock value, low-stock and reorder alerts, goods receipts and stock ledgers for each branch.'],
      ['Purchasing with approvals', 'Branches raise requisitions, head office assigns vendors, POs go out on WhatsApp.']
    ],
    shots: [['labs/labs-showcase', 'Arco Labs screens: material requisitions, lens sale order and inventory dashboard', 1536, 1024], ['labs/inventory-dashboard', 'Arco Labs inventory dashboard', 1600, 793], ['labs/material-requisitions', 'Arco Labs material requisitions and vendor orders', 1600, 790], ['labs/lens-sale-order', 'Arco Labs lens sale order entry', 1600, 794]],
    steps: ['Order entry', 'Store', 'Blocking', 'QC 1', 'Coating', 'Final QC', 'Dispatch'],
    site: 'https://arcooptics.com/labs.html'
  },
  {
    id: 'arco-wholesale', c: '#c9a2ff', name: 'Arco Wholesale', kicker: 'ARCO Optics · for distributors',
    title: 'B2B ERP for lens, frame and eyewear distributors.',
    lead: 'Orders, stock, pricing, accounts and delivery in one web portal for the sales desk, warehouse and accounts team, connected to the stores you supply.',
    chips: ['CGST / SGST / IGST', 'Razorpay payment links', 'OTP-confirmed delivery', 'AI insights'],
    points: [
      ['Order entry built for lenses', 'Bill by barcode or item with lens powers on every row and the party’s credit limit in view.'],
      ['Know your numbers live', 'Monthly revenue split by challan, invoice and B2B, six-month trends and top customers.'],
      ['Four product lines, one system', 'Stock lenses, Rx lab orders, contact lenses and frames tracked the same way.'],
      ['Delivery you can prove', 'Challans confirmed by the store’s OTP; payment links sent with the tax invoice.']
    ],
    shots: [['wholesale/wholesale-showcase', 'Arco Wholesale screens: dashboard, analytics and new lens sale', 1665, 945], ['wholesale/dashboard', 'Arco Wholesale dashboard with quick actions', 1364, 639], ['wholesale/analytics', 'Arco Wholesale revenue analytics', 1365, 635], ['wholesale/new-lens-sale', 'Arco Wholesale new lens sale', 1365, 638]],
    site: 'https://arcooptics.com/wholesale.html'
  },
  {
    id: 'arco-retail', c: '#f2a7c3', name: 'Arco Retail', kicker: 'ARCO Optics · for optical stores',
    title: 'An offline-first app for optical stores.',
    lead: 'Eye tests, job cards, billing, stock and customer care in one phone app, connected straight to the Arco Wholesale network, and it keeps working without internet.',
    chips: ['Works offline', 'GST invoices', 'WhatsApp updates', 'One-tap reorders'],
    points: [
      ['Rx orders from the phone', 'Lens specs and each eye’s prescription, with an auto-numbered order for every job.'],
      ['Live lab status', 'Follow every order from placed to delivered, with paid and due amounts.'],
      ['Account and ledger', 'Opening, credit, debit and net balance, filtered by date or document.'],
      ['Customer care', 'Prescription history, WhatsApp and SMS updates, eye-check reminders.']
    ],
    phones: [['retail/home', 'Arco Retail app home screen'], ['retail/new-order', 'Arco Retail new Rx order'], ['retail/order-tracking', 'Arco Retail order tracking through the lab'], ['retail/ledger', 'Arco Retail ledger and balance']],
    site: 'https://arcooptics.com/retail.html'
  },
  {
    id: 'arco-communication', c: '#6fcf97', name: 'ARCO Communication', kicker: 'For Shopify and D2C brands',
    title: 'Turn WhatsApp chats into Shopify revenue.',
    lead: 'A WhatsApp CRM and Shopify conversion suite on the official WhatsApp Business Cloud API: recover abandoned carts, verify COD orders, send shipping updates and answer every customer from one team inbox.',
    chips: ['Official Meta Cloud API', 'Shopify App Bridge', 'Team inbox', 'AI agent'],
    points: [
      ['Abandoned cart recovery', 'A timed WhatsApp drip with a discount code and a one-click link back to the cart.'],
      ['COD anti-RTO', '“Reply 1 to confirm, 2 to cancel”, with the Shopify order tagged automatically.'],
      ['Order and shipping updates', 'Branded receipts and live courier tracking for BlueDart, Delhivery, DTDC and more.'],
      ['Campaigns and templates', 'Broadcasts, a template builder, automations and analytics in your Shopify admin.']
    ],
    shots: [['communication/inbox', 'ARCO Communication team inbox', 1152, 539], ['communication/dashboard', 'ARCO Communication dashboard', 1345, 568], ['communication/campaigns', 'ARCO Communication campaigns', 940, 550], ['communication/automations', 'ARCO Communication automations', 1345, 553], ['communication/templates', 'ARCO Communication template builder', 1345, 493], ['communication/analytics', 'ARCO Communication analytics', 1048, 477]],
    site: 'https://arcooptics.com/communication.html', app: 'https://arco-communication.vercel.app'
  }
];

const FAQ = [
  ['What is ARCO?', 'ARCO is the family of software products built and run by Branding Catalyst. ARCO Optics (Arco Labs, Arco Wholesale and Arco Retail) connects optical labs, distributors and stores, and ARCO Communication is a WhatsApp CRM for Shopify brands.'],
  ['Who are the ARCO Optics products for?', 'Arco Labs is for optical laboratories with one or many branches, Arco Wholesale is for lens, frame and eyewear distributors, and Arco Retail is a phone app for optical stores. They work on their own or connected together.'],
  ['Are they built for Indian businesses?', 'Yes. Billing is GST-ready (CGST, SGST and IGST), updates and purchase orders go out on WhatsApp, payments can use Razorpay links, and Arco Retail keeps working without internet.'],
  ['Can ARCO be customised for my business?', 'Yes. Because we build ARCO ourselves, we can adapt workflows, reports and integrations for your team. Book a demo and tell us how you work today.'],
  ['How do I get a demo or pricing?', 'Use the “Book a demo” button for the product you are interested in, or message us on WhatsApp. We will show you the product on a short call and share pricing for your size of business.']
];

function gallery(p) {
  if (p.phones) return `<div class="phones">${p.phones.map(([f, alt]) => `<button class="phone" type="button" data-zoom="${IMG}${f}.webp" aria-label="Enlarge: ${esc(alt)}"><img src="${IMG}${f}.webp" alt="${esc(alt)}" width="600" height="1340" loading="lazy" decoding="async"></button>`).join('')}</div>`;
  const [main, ...rest] = p.shots;
  return `<div class="shots">
      <button class="shot-main" type="button" data-zoom="${IMG}${main[0]}.webp" aria-label="Enlarge screenshot"><img src="${IMG}${main[0]}.webp" alt="${esc(main[1])}" width="${main[2]}" height="${main[3]}" loading="lazy" decoding="async"></button>
      <div class="thumbs" role="list">${p.shots.map(([f, alt, w, h], i) => `<button type="button" role="listitem" class="thumb${i ? '' : ' on'}" data-src="${IMG}${f}.webp" data-alt="${esc(alt)}" data-w="${w}" data-h="${h}" aria-label="Show: ${esc(alt)}"><img src="${IMG}${f}.webp" alt="" width="${w}" height="${h}" loading="lazy" decoding="async"></button>`).join('')}</div>
    </div>`;
}

const productHTML = (p, i) => `
<section class="sec prod${i % 2 ? ' flip' : ''}" id="${p.id}" style="--c:${p.c}"><div class="wrap">
  <div class="prod-grid">
    <div class="prod-copy">
      <p class="eyebrow"><span class="num">0${i + 1}</span> ${esc(p.kicker)}</p>
      <h2 class="h2"><span class="pname">${esc(p.name)}</span><br>${esc(p.title)}</h2>
      <p class="lead">${esc(p.lead)}</p>
      <div class="chips">${p.chips.map(c => `<span>${esc(c)}</span>`).join('')}</div>
      <ul class="points">${p.points.map(([h, t]) => `<li><b>${esc(h)}</b><span>${esc(t)}</span></li>`).join('')}</ul>
      <div class="row"><button class="btn btn-w" type="button" data-lead data-lead-idea="I'd like a demo of ${esc(p.name)}." data-lead-source="Products: ${esc(p.name)}">Book a demo →</button>${p.app ? `<a class="btn" href="${p.app}" target="_blank" rel="noopener">Open the app ↗</a>` : ''}<a class="btn" href="${p.site}" target="_blank" rel="noopener">Product site ↗</a></div>
    </div>
    <div class="prod-media">${gallery(p)}</div>
  </div>
  ${p.steps ? `<ol class="lifecycle" aria-label="Rx job lifecycle">${p.steps.map((s, k) => `<li><i>${k + 1}</i>${esc(s)}</li>`).join('')}</ol>` : ''}
</div></section>`;

const page = headTop.replace(/<title>[^<]*<\/title>/, '<title>ARCO Products: Optical ERP &amp; WhatsApp CRM | Branding Catalyst</title>') + `<meta name="description" content="ARCO, software products by Branding Catalyst: Arco Labs lab ERP, Arco Wholesale B2B ERP for optical distributors, Arco Retail app for optical stores, and ARCO Communication WhatsApp CRM for Shopify.">
<link rel="icon" href="logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap">
${baseCss}
/* products page */
.hero-split{display:grid;grid-template-columns:1.25fr .75fr;gap:clamp(24px,4vw,56px);align-items:center}
.hero-split>*{min-width:0}
.logo3d{position:relative;aspect-ratio:1;width:100%;max-width:440px;justify-self:center;display:grid;place-items:center}
.logo3d::before{content:"";position:absolute;inset:6%;border-radius:50%;background:radial-gradient(circle,rgba(91,82,255,.36),transparent 66%)}
.logo3d canvas{position:absolute;inset:0;width:100%;height:100%}
.logo3d-flat{position:relative;width:46%;height:auto;transition:opacity .5s}
.logo3d.is-3d .logo3d-flat{opacity:0}
.logo3d-hint{position:absolute;bottom:2%;font-family:var(--f-mono);font-size:11px;letter-spacing:.14em;color:var(--dim);text-transform:uppercase}
@media(hover:none){.logo3d-hint{display:none}}
@media(max-width:860px){.hero-split{grid-template-columns:1fr}.logo3d{max-width:280px}}
.arco-mark{display:inline-grid;place-items:center;width:44px;height:44px;border-radius:12px;background:#0a0f1f;border:1px solid var(--line2);vertical-align:middle;margin-right:12px}
.arco-mark svg{width:26px;height:26px}
.family{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.family a{display:grid;gap:8px;padding:20px;text-decoration:none;min-width:0;border-top:2px solid var(--c)}
.family a:hover{border-color:var(--c)}
.family .k{font-family:var(--f-mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--c)}
.family b{font-family:var(--f-display);font-size:20px;font-weight:600}
.family span{color:var(--muted);font-size:14.5px}
.chain{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;margin-top:22px;border:1px solid var(--line);border-radius:var(--r);overflow:hidden}
.chain div{padding:16px 18px;border-right:1px solid var(--line);min-width:0;position:relative}
.chain div:last-child{border-right:0}
.chain small{display:block;font-family:var(--f-mono);font-size:11px;color:var(--dim);letter-spacing:.1em;text-transform:uppercase}
.chain b{font-weight:500}
.chain div:not(:last-child)::after{content:"→";position:absolute;right:-8px;top:50%;transform:translateY(-50%);color:var(--accent);background:var(--bg);font-size:13px;z-index:1}
.prod{border-top:1px solid var(--line);scroll-margin-top:72px}
.prod-grid{display:grid;grid-template-columns:minmax(0,.95fr) minmax(0,1.15fr);gap:clamp(28px,5vw,64px);align-items:center}
.prod.flip .prod-copy{order:2}
.prod-copy{display:grid;gap:18px;align-content:start;min-width:0}
.prod .num{color:var(--c)}
.prod .pname{color:var(--c)}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chips span{font-family:var(--f-mono);font-size:11.5px;padding:5px 11px;border-radius:99px;border:1px solid color-mix(in srgb,var(--c) 45%,transparent);color:var(--ink);background:color-mix(in srgb,var(--c) 8%,transparent)}
.points{list-style:none;padding:0;margin:0;display:grid;gap:12px}
.points li{display:grid;gap:2px;padding-left:18px;position:relative}
.points li::before{content:"";position:absolute;left:0;top:9px;width:7px;height:7px;border-radius:50%;background:var(--c)}
.points b{font-weight:500}.points span{color:var(--muted);font-size:15px}
.prod .row{display:flex;flex-wrap:wrap;gap:10px}
.prod-media{min-width:0}
.shots{display:grid;gap:10px}
.shot-main,.thumb,.phone{padding:0;border:1px solid var(--line2);border-radius:14px;overflow:hidden;background:#fff;cursor:zoom-in;display:block;width:100%}
.shot-main img{display:block;width:100%;height:auto;max-height:520px;object-fit:contain;background:#eef1f8}
.thumbs{display:grid;grid-template-columns:repeat(auto-fit,minmax(64px,1fr));gap:8px}
.thumb{cursor:pointer;opacity:.55;transition:opacity .2s,border-color .2s}
.thumb img{display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;object-position:top left}
.thumb.on,.thumb:hover{opacity:1;border-color:var(--c)}
.phones{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.phone{border-radius:22px;background:#111}
.phone img{display:block;width:100%;height:auto}
.lifecycle{list-style:none;padding:0;margin:clamp(28px,4vw,44px) 0 0;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:8px}
.lifecycle li{display:grid;gap:6px;justify-items:center;text-align:center;font-size:13.5px;color:var(--muted);position:relative}
.lifecycle i{font-style:normal;display:grid;place-items:center;width:30px;height:30px;border-radius:50%;border:1px solid var(--c);color:var(--c);font-family:var(--f-mono);font-size:12px;background:var(--bg)}
.lifecycle li:not(:last-child)::after{content:"";position:absolute;top:15px;left:calc(50% + 18px);right:calc(-50% + 18px);height:1px;background:color-mix(in srgb,var(--c) 50%,transparent)}
.why{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.why .card{padding:22px;display:grid;gap:8px;min-width:0}
.why h3{font-size:19px}.why p{color:var(--muted);font-size:15px}
.zoom{position:fixed;inset:0;z-index:96;background:rgba(5,3,10,.88);display:grid;place-items:center;padding:max(16px,env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) max(16px,env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px));cursor:zoom-out}
.zoom img{max-width:100%;max-height:100%;border-radius:12px;box-shadow:0 30px 90px rgba(0,0,0,.6);background:#fff}
.zoom button{position:absolute;top:max(14px,env(safe-area-inset-top,0px));right:max(14px,env(safe-area-inset-right,0px));width:42px;height:42px;border-radius:50%;border:1px solid var(--line2);background:var(--surface);color:var(--ink);font-size:22px;cursor:pointer}
@media(max-width:980px){.prod-grid{grid-template-columns:1fr}.prod.flip .prod-copy{order:0}.family{grid-template-columns:1fr 1fr}.why{grid-template-columns:1fr}}
@media(max-width:760px){.chain{grid-template-columns:1fr 1fr}.chain div:nth-child(2){border-right:0}.chain div:nth-child(-n+2){border-bottom:1px solid var(--line)}.chain div:nth-child(2)::after{display:none}.lifecycle{grid-template-columns:repeat(4,minmax(0,1fr));row-gap:16px}.lifecycle li:nth-child(4)::after{display:none}}
@media(max-width:560px){.family{grid-template-columns:1fr}.phones{grid-template-columns:repeat(2,minmax(0,1fr))}}
${tailCss}</style>
</head>
${bodyTop}${header}
<main>
<section class="hero"><div class="wrap hero-split">
  <div>
  <p class="eyebrow">Our products</p>
  <h1>ARCO. Software <span class="acc">we build and run.</span></h1>
  <p class="lead">Besides building for clients, we make our own products under the ARCO name. ARCO Optics connects the whole optical trade, from the lab that makes the lens to the store that fits it, and ARCO Communication turns WhatsApp conversations into Shopify sales. Same team, same Catalyst Engine, running in real businesses every day.</p>
  <div class="row"><button class="btn btn-w" type="button" data-lead data-lead-idea="I'd like a demo of ARCO." data-lead-source="Products hero">Book a demo →</button><a class="btn" href="https://arcooptics.com/" target="_blank" rel="noopener">Visit arcooptics.com ↗</a></div>
  </div>
  <div class="logo3d" data-shape="arco" role="img" aria-label="The ARCO logo in 3D"><svg class="logo3d-flat" viewBox="0 0 100 100" aria-hidden="true"><path d="M20 76 50 30 80 76" fill="none" stroke="#f6f0ff" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/><circle cx="50" cy="70" r="9" fill="#5b52ff"/></svg><span class="logo3d-hint">move your mouse</span></div>
</div></section>

<section class="sec" style="padding-top:0"><div class="wrap">
  <div class="family">
    ${PRODUCTS.map(p => `<a class="card" href="#${p.id}" style="--c:${p.c}"><span class="k">${esc(p.kicker.split(' · ').pop())}</span><b>${esc(p.name)}</b><span>${esc(p.title)}</span></a>`).join('\n    ')}
  </div>
  <div class="chain" aria-label="How ARCO Optics connects the optical trade">
    <div><small>Optical lab</small><b>Arco Labs</b></div>
    <div><small>Distributor</small><b>Arco Wholesale</b></div>
    <div><small>Optical store</small><b>Arco Retail</b></div>
    <div><small>Customer</small><b>WhatsApp updates</b></div>
  </div>
</div></section>
${PRODUCTS.map(productHTML).join('\n')}

<section class="sec"><div class="wrap">
  <div class="head"><div class="head-l"><p class="eyebrow">Why it matters to you</p><h2 class="h2">We build products,<br><span class="acc">not just projects.</span></h2></div>
  <p class="lead">Running our own software every day keeps us honest about what works. The same people and playbooks that build ARCO build your app, ERP or AI assistant.</p></div>
  <div class="why">
    <div class="card"><h3>Real workflows</h3><p>Rx job stages, GST billing, OTP delivery and WhatsApp purchase orders, built with the people who use them.</p></div>
    <div class="card"><h3>Proven modules</h3><p>Login, payments, inventory, ledgers, WhatsApp and dashboards from ARCO speed up your build too.</p></div>
    <div class="card"><h3>Long-term care</h3><p>We monitor, update and improve our own products, and we look after yours the same way.</p></div>
  </div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="head"><div class="head-l"><p class="eyebrow">Questions</p><h2 class="h2">About ARCO</h2></div></div>
  <div class="qa">
    ${FAQ.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n    ')}
  </div>
</div></section>

<section class="sec" style="padding-top:0"><div class="wrap">
  <div class="card cta"><div><h2>See ARCO on your own workflow.</h2><p>Tell us about your lab, distribution business, store or Shopify brand, and we’ll show you the right product on a short call.</p></div>
  <div class="row"><button class="btn btn-w" type="button" data-lead data-lead-idea="I'd like a demo of ARCO." data-lead-source="Products call to action">Book a demo →</button><a class="btn" href="services.html">Need something custom?</a></div></div>
</div></section>
</main>

<div class="zoom" id="zoom" hidden data-lenis-prevent><button type="button" aria-label="Close">×</button><img alt=""></div>
` + footerAndScripts.replace('<script>\n/* highlight the service in view', `<script>
/* product galleries: thumbnails switch the main screenshot; click to enlarge */
(() => {
  document.querySelectorAll('.shots').forEach(g => {
    const main = g.querySelector('.shot-main'), img = main.querySelector('img');
    g.querySelectorAll('.thumb').forEach(t => t.addEventListener('click', () => {
      g.querySelectorAll('.thumb').forEach(x => x.classList.toggle('on', x === t));
      img.src = t.dataset.src; img.alt = t.dataset.alt; img.width = +t.dataset.w; img.height = +t.dataset.h;
      main.dataset.zoom = t.dataset.src;
    }));
  });
  const zoom = document.getElementById('zoom'), zimg = zoom.querySelector('img');
  let last = null;
  const close = () => { zoom.hidden = true; if (window.__lenis) window.__lenis.start(); if (last) last.focus(); };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-zoom]'); if (!b) return;
    last = b; zimg.src = b.dataset.zoom; zimg.alt = (b.querySelector('img') || {}).alt || '';
    zoom.hidden = false; if (window.__lenis) window.__lenis.stop(); zoom.querySelector('button').focus();
  });
  zoom.addEventListener('click', close);
  addEventListener('keydown', e => { if (e.key === 'Escape' && !zoom.hidden) close(); });
})();
</script>
<script>
/* highlight the service in view`).replace("'.head', '.feat .card', '.svc-block',", "'.head', '.feat .card', '.svc-block', '.family .card', '.prod-copy', '.prod-media', '.why .card',");
fs.writeFileSync(path.join(site, 'products.html'), page);
console.log('products.html written');
