// Builds the ad landing pages: public/erp.html, app.html, ai.html, website.html.
// Each is a light, fast page for one service (no 3D, no smooth-scroll library): a headline that
// matches the search, a short lead form at the top, client logos, what you get, how we work, FAQs.
// Use these as the "Final URL" in Google Ads, e.g. https://brandingcatalyst.in/erp.html
// Run as part of: npm run build:pages     EDIT the copy in PAGES below.
const fs = require('fs'), path = require('path');
const pub = path.join(__dirname, '..', 'public');

const WA = '919004629888', PHONE = '+91 90046 29888';
const LOGOS = [['rio-lenses', 'Rio Digital Lenses'], ['finterest-capital', 'Finterest Capital'], ['greencurve-securities', 'GreenCurve Securities', '#8ac642'], ['merlin-capital', 'Merlin Capital'], ['desire-jewels', 'Desire Jewels'], ['ghmev', 'GHM EV', '#1b212d'], ['avd-group', 'AVD Infra Group', '#8c8582'], ['wayback', 'Wayback Chips'], ['nemora', 'Nemora', '#050a18'], ['namoham', 'Namoham'], ['rolls-on-coals', 'Rolls on Coals']];

const PAGES = [
  {
    file: 'erp.html', key: 'erp', service: 'ERP system', label: 'ERP',
    title: 'Custom ERP Software for Manufacturers & Traders in India | Branding Catalyst',
    description: 'ERP built around how your business runs: inventory, purchase, GST billing, production, HR, payroll and accounts in one system. Live in 8–12 weeks. Free scoping call.',
    eyebrow: 'ERP for manufacturers, traders and distributors',
    h1: 'Stop running your business on Excel and WhatsApp.',
    lead: 'One ERP for stock, purchase, sales, GST billing, production, HR and accounts, built around how your business already works. See live numbers on your phone.',
    bullets: ['Live in 8–12 weeks, in phases', 'Fixed quote before we start', 'You own the code and data'],
    need: 'e.g. We are a 60-person manufacturer. Stock and orders are in Excel, billing in Tally. Want one system.',
    pains: [['Stock never matches', 'Counts differ between the store, the sheet and the accounts team.'], ['Billing takes hours', 'Invoices, GST and e-way bills are typed again in another system.'], ['No live view', 'You wait for month-end to know sales, dues and margins.']],
    features: [['Inventory & warehouse', 'Batches, locations, reorder alerts, barcode scanning.'], ['Purchase & vendors', 'Requests, approvals, purchase orders and goods received.'], ['Sales & GST billing', 'Quotes, orders, GST-ready invoices, e-way bills, dues.'], ['Production', 'Bills of material, job cards, work orders and wastage.'], ['HR & payroll', 'Attendance, leave, salary slips, PF and ESIC reports.'], ['Owner dashboard', 'Sales, stock, cash and dues live on your phone.']],
    faqs: [['How long does an ERP take?', 'Most ERPs go live in 8–12 weeks. We launch the most important module first, usually inventory or billing, so your team starts using it early, then add the rest in phases.'], ['Can it work with Tally or our existing software?', 'Yes. We can sync with Tally and other accounting tools, or move your data across, depending on what suits your team. We plan this on the scoping call.'], ['Why custom instead of a ready ERP?', 'Ready ERPs make you change how you work and charge per user every year. A custom ERP fits your process, has no per-user licence fee, and you own it.'], ['How much does it cost?', 'It depends on the modules and users. After a free 30-minute scoping call we give you a fixed quote, and you pay per milestone only after you accept it.']]
  },
  {
    file: 'app.html', key: 'app', service: 'Mobile app (Android + iOS)', label: 'Mobile app',
    title: 'Android & iOS App Development Company in Mumbai | Branding Catalyst',
    description: 'Android and iOS apps from one codebase: booking, delivery, loyalty, marketplace and business apps. Working prototype in the first sprint. Fixed quote after a free scoping call.',
    eyebrow: 'Android + iOS app development',
    h1: 'Your app on Android and iOS, built from one codebase.',
    lead: 'From idea to the Play Store and App Store: design, login, payments, admin panel and launch. You see a working prototype in the first sprint and a demo every week.',
    bullets: ['Usually 7–11 weeks to launch', 'Fixed quote, pay per milestone', 'You own the code and designs'],
    need: 'e.g. A booking app for my 3 salons with online payments and loyalty points.',
    pains: [['Two apps cost double', 'Separate Android and iOS teams mean double the time and budget.'], ['Projects drag on', 'Months pass with no working app to show customers or investors.'], ['Stuck after launch', 'No one to fix bugs, update the app or read the numbers.']],
    features: [['Design that converts', 'Screens planned around what your users need to do.'], ['Login & payments', 'OTP login, UPI, cards and wallets, subscriptions.'], ['Admin panel', 'Manage users, orders, content and offers from the web.'], ['Notifications', 'Push, SMS and WhatsApp updates that bring users back.'], ['Store launch', 'We publish to the Play Store and App Store for you.'], ['Support after launch', 'Monitoring, bug fixes, updates and analytics.']],
    faqs: [['Do you build both Android and iOS?', 'Yes. We usually use Flutter or React Native, so one codebase runs on both, which saves time and cost without hurting quality.'], ['How long does an app take?', 'Most apps launch in 7–11 weeks. You see a working prototype in the first sprint, then a demo every week.'], ['Will I own the app?', 'Yes. You own the code and designs. At launch we hand over the repository, store accounts and documentation, and we are happy to sign an NDA.'], ['How much does an app cost?', 'It depends on the features. After a free 30-minute scoping call we give you a fixed quote. You pay per milestone, only after you review and accept it.']]
  },
  {
    file: 'ai.html', key: 'ai', service: 'AI agents & chatbots', label: 'AI chatbot',
    title: 'AI Chatbot & AI Agent Development for Business in India | Branding Catalyst',
    description: 'AI chatbots and agents that answer from your own documents, on your website and WhatsApp: support, sales and internal knowledge. Live in 4–6 weeks. Free scoping call.',
    eyebrow: 'AI chatbots and AI agents for business',
    h1: 'An AI assistant that answers from your own documents.',
    lead: 'On your website, WhatsApp or internal tools: it answers customers, captures leads and helps your team find answers in seconds, using your data and citing its sources.',
    bullets: ['Live in 4–6 weeks', 'Answers from your data, with sources', 'Works on website and WhatsApp'],
    need: 'e.g. A WhatsApp bot that answers customer questions from our product catalogue and price list.',
    pains: [['Same questions all day', 'Your team answers the same 50 questions on calls and WhatsApp.'], ['Leads wait overnight', 'Enquiries after office hours go cold before anyone replies.'], ['Knowledge is scattered', 'Answers live in PDFs, sheets and people’s heads.']],
    features: [['Trained on your documents', 'Catalogues, policies, manuals and FAQs (RAG).'], ['Website & WhatsApp', 'One assistant across your site, WhatsApp and app.'], ['Lead capture', 'Collects name, need and number, and sends them to your team.'], ['Hands over to people', 'Passes tricky chats to your team with the full context.'], ['Automation', 'Fills forms, updates sheets and CRMs, sends follow-ups.'], ['Private and controlled', 'Your data stays yours; you set what it may answer.']],
    faqs: [['Will the AI make things up?', 'We build it to answer from your own documents and show the source. When it is not sure, it says so and hands over to your team.'], ['Can it work on WhatsApp?', 'Yes. We connect it to the WhatsApp Business API, your website and your app, so customers get the same answers everywhere.'], ['How long does it take?', 'Most AI assistants go live in 4–6 weeks, starting with a working prototype on your real documents.'], ['How much does it cost?', 'It depends on the channels, data and integrations. After a free 30-minute scoping call we give you a fixed quote, and you pay per milestone.']]
  },
  {
    file: 'website.html', key: 'website', service: 'Website / platform', label: 'Website',
    title: 'Business Website Development in Mumbai, Live in 2–4 Weeks | Branding Catalyst',
    description: 'Fast, mobile-first business websites that bring enquiries: SEO and AI-search ready, easy to edit, WhatsApp and lead forms built in. Live in 2–4 weeks. Free scoping call.',
    eyebrow: 'Business websites and web platforms',
    h1: 'A website that brings you enquiries, not just visitors.',
    lead: 'Fast on every phone, easy for your team to edit, and built to be found on Google and AI search, with WhatsApp and lead forms that send enquiries straight to you.',
    bullets: ['Live in 2–4 weeks', 'SEO and AI-search ready', 'Fixed quote, pay per milestone'],
    need: 'e.g. A website for my interior design studio with a project gallery and enquiry form.',
    pains: [['Looks outdated', 'Your website doesn’t match the quality of your work.'], ['Nobody finds it', 'You don’t show up on Google or in AI answers for your service.'], ['No enquiries', 'Visitors look around and leave without contacting you.']],
    features: [['Mobile-first design', 'Looks sharp and loads fast on every phone.'], ['Easy to edit', 'Change text, photos and projects yourself.'], ['SEO and AEO', 'Structured for Google and for AI assistants like ChatGPT.'], ['Leads to WhatsApp & email', 'Forms and WhatsApp buttons that reach you instantly.'], ['Analytics', 'See where visitors come from and what they do.'], ['Care after launch', 'Hosting, security updates and improvements.']],
    faqs: [['How long does a website take?', 'Most business websites go live in 2–4 weeks, depending on the number of pages and how ready your content is.'], ['Can I edit the website myself?', 'Yes. We set up an easy editor so you can change text, photos and projects without a developer.'], ['Will it show up on Google?', 'We build every page for search: fast loading, clean structure, schema markup and content written for your customers, plus AEO so AI assistants can cite you.'], ['How much does a website cost?', 'It depends on pages and features. After a free 30-minute scoping call we give you a fixed quote, and you pay per milestone.']]
  }
];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const services = fs.readFileSync(path.join(pub, 'services.html'), 'utf8');
const svgDefs = (services.match(/<svg width="0" height="0"[\s\S]*?<\/svg>/) || [''])[0];
const WA_ICON = '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3C8.8 3 3 8.6 3 15.6c0 2.5.7 4.8 2 6.8L3.6 29l6.8-1.8c1.8 1 3.8 1.5 5.6 1.5 7.2 0 13-5.6 13-12.6S23.2 3 16 3zm0 23.3c-1.7 0-3.5-.5-5-1.4l-.4-.2-4 1.1 1.1-3.9-.3-.4a10.4 10.4 0 0 1-1.7-5.9C5.7 9.9 10.3 5.4 16 5.4s10.3 4.5 10.3 10.2S21.7 26.3 16 26.3z"/></svg>';

const CSS = `
:root{color-scheme:dark;--bg:#0d0716;--surface:#1b1129;--surface2:#23163a;--line:rgba(201,162,255,.10);--line2:rgba(201,162,255,.19);--ink:#f1edf7;--muted:#a79fbb;--dim:#716885;--accent:#c9a2ff;--accent-soft:rgba(201,162,255,.12);--ok:#6fcf97;--f-display:"Lexend","Helvetica Neue",Arial,system-ui,sans-serif;--f-body:"Geist",system-ui,-apple-system,"Segoe UI",sans-serif;--f-mono:"Geist Mono",ui-monospace,Consolas,monospace}
*{box-sizing:border-box}[hidden]{display:none!important}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--f-body);font-size:16.5px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{color:inherit}img{max-width:100%}
h1,h2,h3{font-family:var(--f-display);font-weight:600;margin:0;letter-spacing:-.025em;text-wrap:balance}
.wrap{max-width:1160px;margin:0 auto;padding-left:max(20px,env(safe-area-inset-left,0px));padding-right:max(20px,env(safe-area-inset-right,0px))}
.eyebrow{font-family:var(--f-mono);font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);margin:0 0 14px}
.nav{position:sticky;top:0;z-index:50;background:rgba(13,7,22,.86);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
.nav .wrap{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:64px}
.logo{display:flex;align-items:center;gap:10px;text-decoration:none}.logo svg{width:26px;height:27px}
.wm{font-family:"Lexend",var(--f-display);font-size:18px;letter-spacing:-.02em;line-height:1}.wm b{font-weight:600}.wm em{font-style:normal;font-weight:300;color:var(--accent)}
.nav-r{display:flex;align-items:center;gap:10px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 18px;border-radius:12px;border:1px solid var(--line2);background:transparent;color:var(--ink);font:500 15px var(--f-body);text-decoration:none;cursor:pointer;white-space:nowrap}
.btn-w{background:#25d366;border-color:#25d366;color:#05301a;font-weight:600}.btn svg{width:20px;height:20px}
.btn-a{background:var(--accent);border-color:var(--accent);color:#1a0b2e;font-weight:600}
@media(max-width:560px){.nav .call{display:none}}
.hero{padding-block:clamp(36px,6vw,72px) clamp(40px,6vw,72px);background:radial-gradient(70% 60% at 85% 0%,rgba(139,92,246,.22),transparent 60%)}
.hero .wrap{display:grid;grid-template-columns:1.1fr .9fr;gap:clamp(28px,5vw,64px);align-items:start}
.hero h1{font-size:clamp(32px,5vw,54px);line-height:1.08}
.hero .lead{color:var(--muted);font-size:clamp(16.5px,1.6vw,19px);margin:18px 0 22px;max-width:56ch}
.ticks{list-style:none;padding:0;margin:0;display:grid;gap:10px}.ticks li{display:flex;gap:10px;align-items:flex-start}.ticks li::before{content:"✓";color:var(--ok);font-weight:700}
.hero-contact{margin-top:24px;color:var(--muted);font-size:14.5px}.hero-contact a{color:var(--accent)}
.formcard{background:var(--surface);border:1px solid var(--line2);border-radius:20px;padding:clamp(20px,3vw,28px);box-shadow:0 30px 80px -40px rgba(0,0,0,.9);display:grid;gap:12px}
.formcard h2{font-size:22px}.formcard .sub{color:var(--muted);font-size:14.5px;margin:-4px 0 4px}
.f{display:grid;gap:6px;min-width:0}.f label{font-size:13px;color:var(--muted)}
.f input,.f textarea{width:100%;min-width:0;background:rgba(13,7,22,.7);border:1px solid var(--line2);border-radius:11px;color:var(--ink);font:400 15.5px var(--f-body);padding:12px}
.f textarea{min-height:84px;resize:vertical}
.f input:focus,.f textarea:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 4px var(--accent-soft)}
.f [aria-invalid="true"]{border-color:#f2a7a7}
.consent{display:flex;gap:10px;align-items:flex-start;font-size:13px;color:var(--muted)}.consent input{margin-top:3px;accent-color:var(--accent)}.consent a{color:var(--accent)}
.hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}
.err{color:#f2a7a7;font-size:13.5px;margin:0;min-height:1em}
.go{width:100%;padding:14px;font-size:16px}
.small{font-size:12.5px;color:var(--dim);text-align:center;margin:0}
.done{display:grid;gap:12px;text-align:center;justify-items:center;padding:12px 0}.done .tick{width:56px;height:56px;border-radius:50%;display:grid;place-items:center;background:rgba(37,211,102,.15);color:#25d366;font-size:28px}.done p{margin:0;color:var(--muted)}
.logos{padding-block:28px;border-block:1px solid var(--line)}
.logos p{text-align:center;font-family:var(--f-mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);margin:0 0 16px}
.lg-row{display:flex;flex-wrap:wrap;justify-content:center;gap:10px}
.lg{width:132px;height:58px;border-radius:10px;background:#fff;display:grid;place-items:center;overflow:hidden}.lg img{max-width:86%;max-height:44px;object-fit:contain}
section.sec{padding-block:clamp(48px,7vw,84px)}
.sec h2{font-size:clamp(26px,3.4vw,38px);line-height:1.15;max-width:22ch}
.sec .intro{color:var(--muted);max-width:60ch;margin:12px 0 0}
.grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:28px}
.card{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:20px;min-width:0}
.card h3{font-size:17px;margin-bottom:6px}.card p{margin:0;color:var(--muted);font-size:15px}
.pain{border-color:rgba(242,167,167,.18)}.pain h3::before{content:"✕ ";color:#f2a7a7}
.steps{counter-reset:s;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-top:28px}
.steps .card h3::before{counter-increment:s;content:counter(s,decimal-leading-zero);display:block;font-family:var(--f-mono);font-size:12px;color:var(--accent);margin-bottom:8px}
.why{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-top:28px}
.qa{display:grid;gap:10px;margin-top:24px;max-width:820px}
.qa details{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:16px 18px}
.qa summary{cursor:pointer;font-weight:500;list-style:none}.qa summary::-webkit-details-marker{display:none}.qa summary::after{content:"+";float:right;color:var(--accent)}.qa details[open] summary::after{content:"–"}
.qa p{margin:10px 0 0;color:var(--muted)}
.cta{text-align:center;background:radial-gradient(60% 80% at 50% 100%,rgba(139,92,246,.25),transparent 70%)}
.cta h2{margin:0 auto}.cta .row{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:22px}
footer{border-top:1px solid var(--line);padding-block:24px calc(24px + env(safe-area-inset-bottom,0px));color:var(--dim);font-size:13.5px}
footer .wrap{display:flex;flex-wrap:wrap;gap:10px 24px;justify-content:space-between}footer a{color:var(--muted);text-decoration:none}
@media(max-width:900px){.hero .wrap{grid-template-columns:1fr}.grid3{grid-template-columns:1fr 1fr}.steps,.why{grid-template-columns:1fr 1fr}}
@media(max-width:560px){.grid3,.steps,.why{grid-template-columns:1fr}.lg{width:calc(50% - 5px)}}
`;

function page(p) {
  const logos = LOGOS.map(([f, n, bg]) => `<div class="lg"${bg ? ` style="background:${bg}"` : ''}><img src="clients/${f}.png" alt="${esc(n)} logo" loading="lazy" decoding="async"></div>`).join('');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.description)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap">
<style>${CSS}</style>
</head>
<body>
${svgDefs}
<header class="nav"><div class="wrap">
  <a class="logo" href="index.html" aria-label="Branding Catalyst home"><svg viewBox="0 0 96 100" aria-hidden="true"><use href="#bcMark"/></svg><span class="wm"><b>Branding</b><em>Catalyst</em></span></a>
  <div class="nav-r"><a class="btn call" href="tel:+919004629888">Call ${PHONE}</a><a class="btn btn-a" href="#get-quote">Get a free quote</a></div>
</div></header>

<main>
<section class="hero"><div class="wrap">
  <div>
    <p class="eyebrow">${esc(p.eyebrow)}</p>
    <h1>${esc(p.h1)}</h1>
    <p class="lead">${esc(p.lead)}</p>
    <ul class="ticks">${p.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>
    <p class="hero-contact">Prefer to talk? <a href="https://wa.me/${WA}?text=${encodeURIComponent(`Hi Branding Catalyst! I'd like a quote for a ${p.label.toLowerCase()} project.`)}" target="_blank" rel="noopener">WhatsApp us</a> or call <a href="tel:+919004629888">${PHONE}</a>.</p>
  </div>
  <div class="formcard" id="get-quote">
    <div id="lpStep">
      <h2>Get a free quote</h2>
      <p class="sub">Tell us a little. Our team will WhatsApp you to book a free 30-minute scoping call.</p>
      <form id="lpForm" novalidate style="display:grid;gap:12px">
        <div class="f"><label for="lpName">Your name</label><input id="lpName" name="name" autocomplete="name" required></div>
        <div class="f"><label for="lpPhone">WhatsApp number</label><input id="lpPhone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+91 98765 43210" required></div>
        <div class="f"><label for="lpNeed">What do you need? <span style="color:var(--dim)">(optional)</span></label><textarea id="lpNeed" name="message" placeholder="${esc(p.need)}"></textarea></div>
        <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
        <label class="consent"><input type="checkbox" id="lpConsent" required><span>I agree to be contacted about my enquiry and accept the <a href="privacy.html" target="_blank">Privacy Policy</a>.</span></label>
        <p class="err" id="lpErr" role="alert"></p>
        <button class="btn btn-a go" type="submit">Get my free quote →</button>
        <p class="small">No spam. No obligation. Fixed quote after the call.</p>
      </form>
    </div>
    <div class="done" id="lpDone" hidden>
      <div class="tick">✓</div>
      <h2 id="lpDoneTitle">Thanks!</h2>
      <p id="lpDoneMsg">Our team will WhatsApp you shortly to book your free scoping call.</p>
      <a class="btn btn-w" id="lpWa" href="https://wa.me/${WA}" target="_blank" rel="noopener">${WA_ICON}Chat on WhatsApp now</a>
    </div>
  </div>
</div></section>

<div class="logos"><div class="wrap"><p>Trusted by 50+ brands · 400+ projects since 2019</p><div class="lg-row">${logos}</div></div></div>

<section class="sec"><div class="wrap">
  <p class="eyebrow">Sound familiar?</p>
  <h2>What holds most businesses back</h2>
  <div class="grid3">${p.pains.map(([h, t]) => `<div class="card pain"><h3>${esc(h)}</h3><p>${esc(t)}</p></div>`).join('')}</div>
</div></section>

<section class="sec" style="padding-top:0"><div class="wrap">
  <p class="eyebrow">What you get</p>
  <h2>Everything you need, built around how you work</h2>
  <div class="grid3">${p.features.map(([h, t]) => `<div class="card"><h3>${esc(h)}</h3><p>${esc(t)}</p></div>`).join('')}</div>
</div></section>

<section class="sec" style="padding-top:0"><div class="wrap">
  <p class="eyebrow">How we work</p>
  <h2>Clear steps, a demo every week</h2>
  <div class="steps">
    <div class="card"><h3>Free scoping call</h3><p>30 minutes to understand your business and goals.</p></div>
    <div class="card"><h3>Fixed quote</h3><p>Scope, price, timeline and milestones agreed in writing.</p></div>
    <div class="card"><h3>Build with demos</h3><p>A working prototype in the first sprint, then a demo every week.</p></div>
    <div class="card"><h3>Launch and grow</h3><p>We launch, monitor and keep improving it with you.</p></div>
  </div>
  <div class="why">
    <div class="card"><h3>Pay per milestone</h3><p>Only after you review and accept it.</p></div>
    <div class="card"><h3>You own it</h3><p>Code, designs and data are yours. NDAs are fine.</p></div>
    <div class="card"><h3>AI-first, engineer-checked</h3><p>Faster builds; an engineer reviews every release.</p></div>
    <div class="card"><h3>Based in Mumbai</h3><p>Working with clients across India and abroad since 2019.</p></div>
  </div>
</div></section>

<section class="sec" style="padding-top:0"><div class="wrap">
  <p class="eyebrow">Questions</p>
  <h2>Before you ask</h2>
  <div class="qa">${p.faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
</div></section>

<section class="sec cta"><div class="wrap">
  <h2>Let’s plan your ${esc(p.label.toLowerCase())}. The first call is free.</h2>
  <div class="row"><a class="btn btn-a" href="#get-quote">Get a free quote</a><a class="btn btn-w" href="https://wa.me/${WA}?text=${encodeURIComponent(`Hi Branding Catalyst! I'd like a quote for a ${p.label.toLowerCase()} project.`)}" target="_blank" rel="noopener">${WA_ICON}WhatsApp us</a></div>
</div></section>
</main>

<footer><div class="wrap"><span>© 2026 Branding Catalyst Pvt Ltd · Mumbai, India · <a href="mailto:hello@brandingcatalyst.in">hello@brandingcatalyst.in</a></span><span><a href="index.html">Home</a> · <a href="services.html">Services</a> · <a href="check.html">Idea Checker</a> · <a href="about.html">About</a> · <a href="privacy.html">Privacy Policy</a> · <a href="terms.html">Terms of Use</a></span></div></footer>

<script>
(() => {
  const SERVICE = ${JSON.stringify(p.service)}, LABEL = ${JSON.stringify(p.label)}, WA = '${WA}';
  const f = document.getElementById('lpForm'), err = document.getElementById('lpErr');
  f.addEventListener('submit', async e => {
    e.preventDefault(); err.textContent = '';
    const v = n => f.elements[n].value.trim();
    const name = f.elements.name, phone = f.elements.phone;
    [name, phone].forEach(x => x.removeAttribute('aria-invalid'));
    if (!v('name')) { name.setAttribute('aria-invalid', 'true'); name.focus(); err.textContent = 'Please enter your name.'; return; }
    if (!/^\\+?[0-9][0-9\\s-]{7,15}$/.test(v('phone'))) { phone.setAttribute('aria-invalid', 'true'); phone.focus(); err.textContent = 'Please enter a valid WhatsApp number, e.g. +91 98765 43210.'; return; }
    if (!document.getElementById('lpConsent').checked) { err.textContent = 'Please tick the box so we can contact you.'; return; }
    const btn = f.querySelector('button'); btn.disabled = true; btn.textContent = 'Sending…';
    const lead = { type: 'landing', name: v('name'), phone: v('phone'), service: SERVICE, message: v('message'), website: v('website'), source: 'Landing page: ' + LABEL, page: location.pathname, attribution: window.bcAttribution ? window.bcAttribution() : {} };
    let delivered = false;
    try { const r = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) }); const j = r.ok ? await r.json() : null; delivered = !!(j && j.delivered); } catch {}
    if (window.bcTrack) window.bcTrack('landing_lead', { form: 'Landing: ' + LABEL, service: SERVICE });
    const text = ['Hi Branding Catalyst! I would like a quote for a ' + LABEL.toLowerCase() + ' project.', 'Name: ' + lead.name, 'Phone: ' + lead.phone, lead.message && 'Need: ' + lead.message].filter(Boolean).join('\\n');
    document.getElementById('lpWa').href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text);
    document.getElementById('lpDoneTitle').textContent = 'Thanks, ' + lead.name.split(' ')[0] + '!';
    if (!delivered) document.getElementById('lpDoneMsg').innerHTML = 'Tap the button below to send your request on WhatsApp, and we will reply there.';
    document.getElementById('lpStep').hidden = true; document.getElementById('lpDone').hidden = false;
  });
})();
</script>
<script src="leads.js" defer></script>
</body>
</html>
`;
}

for (const p of PAGES) {
  fs.writeFileSync(path.join(pub, p.file), page(p));
  console.log(p.file + ' written');
}
module.exports = { PAGES };
