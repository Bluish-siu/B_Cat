// Generates site/services.html in the site's design system.
const fs = require('fs'), path = require('path');
const site = process.argv[2], here = __dirname;
const about = fs.readFileSync(path.join(site, 'about.html'), 'utf8');
const DEFS = about.match(/<svg width="0" height="0"[\s\S]*?<\/svg>/)[0];
const HEADFX = about.match(/<script>try\{if\(!sessionStorage[\s\S]*?<\/style>/)[0];   // page transitions + intro cover
const ambientCss = fs.readFileSync(path.join(here, 'ambient.css'), 'utf8').replace('filter:blur(80px)', 'filter:none');
const smoothCss = fs.readFileSync(path.join(here, 'smooth.css'), 'utf8').replace('filter:blur(4px)', '').replace(';filter:none}', '}');
let smoothJs = fs.readFileSync(path.join(here, 'smooth.js'), 'utf8')
  .replace("new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, wheelMultiplier: 0.95, touchMultiplier: 1.2 })", "new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.2, syncTouch: false })")
  .replace("'.head', '.feat .card',", "'.head', '.feat .card', '.svc-block', '.ai3 .card', '.models .card', '.bundles .card', '.cluster-head',");
const esc = s => s.replace(/&/g, '&amp;');
const sparks = Array.from({ length: 16 }, (_, i) => `<i style="--x:${(i * 61 + 7) % 100}%;--d:${18 + (i * 7) % 16}s;--w:${-((i * 3.7) % 20).toFixed(1)}s;--z:${2 + (i % 3)}px;--sw:${(i % 2 ? 1 : -1) * (12 + (i * 5) % 30)}px"></i>`).join('');

// ---------- the services (EDIT here) ----------
const CLUSTERS = [
  { id: 'ai', name: 'AI & Intelligence', color: '#c9a2ff', blurb: 'Assistants and agents that work from your own data, around the clock.', items: [
    { id: 'ai-agents', title: 'AI Agents & Automation', lead: 'Digital teammates that qualify leads, answer calls, update your CRM and handle repetitive work 24/7.',
      ai: 'Agents plan and act across your tools, and hand over to a person whenever a decision needs one.',
      get: ['Sales and support agents on WhatsApp, web and phone', 'Workflow automation across CRM, sheets and email', 'Voice receptionists in Hindi, English and regional languages', 'Human hand-off and a full activity log'],
      tags: ['LLM APIs', 'n8n', 'Python', 'WhatsApp API'], time: '3–6 weeks', lead_service: 'AI agents & chatbots' },
    { id: 'rag', title: 'RAG Chatbots · AI on Your Data', lead: 'Assistants that answer from your own documents, catalogue and SOPs, and show their sources so they stay accurate.',
      ai: 'Retrieval-Augmented Generation finds the right passage first, then answers from it.',
      get: ['Ingestion of PDFs, websites, sheets and product catalogues', 'Cited answers on your website and WhatsApp', 'Admin panel to update what the bot knows', 'Analytics on what customers ask most'],
      tags: ['Vector DB', 'GPT · Claude · Gemini', 'Python', 'React'], time: '4–6 weeks', lead_service: 'AI agents & chatbots' },
    { id: 'ai-content', title: 'AI Content', lead: 'Posts, blogs, product copy and video scripts in your brand voice, produced with AI and edited by people.',
      ai: 'A brand-voice prompt library keeps every AI draft on-brand; editors make it great.',
      get: ['Brand voice guide and prompt library', 'Monthly content calendar', 'Multilingual content for Indian audiences', 'SEO and AEO-ready articles'],
      tags: ['Instagram', 'LinkedIn', 'Blog', 'YouTube scripts'], time: 'Monthly', lead_service: 'AI search (AEO/GEO) & growth' }
  ] },
  { id: 'search', name: 'AI Search, Brand & Growth', color: '#f2a7c3', blurb: 'Be the brand people choose, and the one AI recommends.', items: [
    { id: 'aeo', title: 'AEO · Answer Engine Optimization', lead: 'Make your content the answer that AI assistants and voice search give when customers ask about your category.',
      ai: 'We structure pages so AI tools can read, trust and quote them.',
      get: ['Answer-first pages and FAQs', 'Schema markup for your business, products and FAQs', 'Entity and knowledge-panel clean-up', 'Voice-search optimisation'],
      tags: ['Schema.org', 'Search Console', 'llms.txt'], time: '2–3 weeks setup, then monthly', lead_service: 'AI search (AEO/GEO) & growth' },
    { id: 'geo', title: 'GEO · Generative Engine Optimization', lead: 'Get ChatGPT, Gemini and Perplexity to mention and recommend your brand when people ask for options.',
      ai: 'We track the prompts your customers use and earn the citations that AI models rely on.',
      get: ['AI visibility audit across your top customer questions', 'Citations on sites and directories AI models trust', 'AI-readable site structure', 'Monthly AI-mention tracking report'],
      tags: ['ChatGPT', 'Gemini', 'Perplexity', 'Google AI'], time: 'Monthly', lead_service: 'AI search (AEO/GEO) & growth' },
    { id: 'branding', title: 'Branding & Identity', lead: 'Name, logo, colours, type and voice, built as one system that stays consistent everywhere, including in AI-made content.',
      ai: 'AI speeds up exploration; designers make the decisions and craft the final identity.',
      get: ['Logo and visual identity', 'Brand book and guidelines', 'Packaging and social media templates', 'Brand voice for people and AI'],
      tags: ['Figma', 'Illustrator', 'Brand book'], time: '2–4 weeks', lead_service: 'Branding', extra: ['index.html#brand-lab', 'Try the Brand Lab →'] },
    { id: 'growth', title: 'Growth Marketing', lead: 'Funnels, automation and analytics that turn attention into paying customers.',
      ai: 'AI scores leads and personalises follow-ups, so your team spends time on the warmest prospects.',
      get: ['Landing pages and funnels', 'WhatsApp and email automation', 'Ads with proper conversion tracking', 'Dashboards that show which channel brings customers'],
      tags: ['GA4', 'HubSpot', 'Meta & Google Ads', 'WhatsApp'], time: 'Monthly', lead_service: 'AI search (AEO/GEO) & growth' }
  ] },
  { id: 'build', name: 'Build', color: '#7fd6e8', blurb: 'Apps, systems and sites, built at AI speed and reviewed by engineers.', items: [
    { id: 'mobile', title: 'Mobile Apps · Android + iOS', lead: 'One codebase for both stores, with payments, bookings, notifications and offline mode built in.',
      ai: 'AI generates screens, tests and store listings, so your first working build lands in the first sprint.',
      get: ['UX research and UI design', 'Flutter or React Native app', 'Admin panel and backend', 'Play Store and App Store launch'],
      tags: ['Flutter', 'React Native', 'Firebase', 'Razorpay'], time: '7–11 weeks', lead_service: 'Mobile app (Android + iOS)' },
    { id: 'erp', title: 'ERP Systems', lead: 'Custom ERP for inventory, sales, purchase, HR and accounts, shaped around how your business actually runs.',
      ai: 'Built-in AI forecasts stock, flags anomalies and answers questions about your own data.',
      get: ['Inventory, purchase and sales', 'GST-ready billing and accounts', 'HR, attendance and payroll', 'Role-based dashboards and reports'],
      tags: ['React', 'Node.js / Django', 'PostgreSQL'], time: '8–12 weeks, phased', lead_service: 'ERP system' },
    { id: 'web', title: 'Websites & Platforms', lead: 'Fast company sites, SaaS platforms, portals and e-commerce, easy to edit and built to rank on Google and AI search.',
      ai: 'AEO is built in from day one, and AI helps draft copy and test every page.',
      get: ['Design and copywriting', 'Next.js build with an easy CMS', 'SEO and AEO built in', 'Hosting, analytics and care plans'],
      tags: ['Next.js', 'Headless CMS', 'Vercel', 'Shopify'], time: '2–5 weeks', lead_service: 'Website / platform' },
    { id: '3d', title: '3D Web Experiences', lead: 'Product configurators, virtual showrooms and walkthroughs that run in any browser, no app needed.',
      ai: 'AI-assisted modelling and texturing gets your products into 3D faster.',
      get: ['3D modelling and optimisation', 'Real-time configurators with live pricing', 'WebAR try-ons from a link', 'Virtual property and showroom tours'],
      tags: ['Three.js', 'WebGL', 'Blender', 'WebAR'], time: '4–7 weeks', lead_service: '3D web experience' }
  ] }
];
const all = CLUSTERS.flatMap(c => c.items.map(it => ({ ...it, c })));
let n = 0;
const block = it => { n++; const num = String(n).padStart(2, '0'); const ask = encodeURIComponent(`I need ${it.title.split(' · ')[0]}. Can you plan it?`);
  return `
      <article class="svc-block" id="${it.id}" style="--c:${it.c.color}">
        <div class="sb-l">
          <span class="sb-num">${num} · ${esc(it.c.name).toUpperCase()}</span>
          <h3>${esc(it.title)}</h3>
          <p class="sb-lead">${esc(it.lead)}</p>
          <p class="sb-ai"><b>AI-first:</b> ${esc(it.ai)}</p>
          <div class="sb-tags">${it.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
        </div>
        <div class="sb-r">
          <p class="sb-k">What you get</p>
          <ul>${it.get.map(g => `<li>${esc(g)}</li>`).join('')}</ul>
          <p class="sb-time"><span>Typical timeline</span><b>${esc(it.time)}</b></p>
          <div class="sb-cta"><button class="btn btn-w" type="button" data-lead data-lead-service="${esc(it.lead_service)}" data-lead-source="Services · ${esc(it.title)}">Start a project →</button><a class="btn" href="index.html?ask=${ask}#top">Ask ARC</a>${it.extra ? `<a class="sb-link" href="${it.extra[0]}">${it.extra[1]}</a>` : ''}</div>
        </div>
      </article>`; };

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Services | Branding Catalyst</title>
${HEADFX}
<meta name="description" content="AI-first services from Branding Catalyst, Mumbai: AI agents, RAG chatbots, AI content, AEO, GEO, branding, growth, Android and iOS apps, ERP systems, websites and 3D web experiences.">
<link rel="icon" href="logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap">
<style>
:root{color-scheme:dark;--bg:#0d0716;--bg2:#130b1f;--surface:#1b1129;--surface2:#23163a;--brand:#42066b;--line:rgba(201,162,255,.10);--line2:rgba(201,162,255,.19);--ink:#f1edf7;--muted:#a79fbb;--dim:#716885;--accent:#c9a2ff;--accent-soft:rgba(201,162,255,.12);--ok:#6fcf97;--f-display:"Lexend","Helvetica Neue",Arial,system-ui,sans-serif;--f-body:"Geist",system-ui,-apple-system,"Segoe UI",sans-serif;--f-mono:"Geist Mono",ui-monospace,Consolas,monospace;--wrap:1200px;--r:18px}
*{box-sizing:border-box}[hidden]{display:none!important}img{max-width:100%}
html{scroll-behavior:smooth;overflow-x:clip}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--f-body);font-size:16.5px;line-height:1.65;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
button,input,select,textarea{font:inherit;color:inherit}
:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:8px}
h1,h2,h3{font-family:var(--f-display);font-weight:600;margin:0;text-wrap:balance;letter-spacing:-.025em}
p{margin:0}
.wrap{max-width:var(--wrap);margin-inline:auto;padding-left:max(20px,env(safe-area-inset-left,0px));padding-right:max(20px,env(safe-area-inset-right,0px))}
.sec{padding-block:clamp(64px,9vw,112px);position:relative}
.sec+.sec::before{content:"";position:absolute;top:0;left:50%;width:min(1200px,92%);height:1px;transform:translateX(-50%);background:linear-gradient(90deg,transparent,rgba(201,162,255,.4),transparent)}
.eyebrow{font-family:var(--f-mono);font-size:11.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);display:flex;align-items:center;gap:10px}
.eyebrow::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 3px rgba(201,162,255,.18)}
.h2{font-size:clamp(30px,4.2vw,48px);line-height:1.1}
.acc{color:var(--accent)}
.lead{color:var(--muted);font-size:17px;max-width:58ch}
.head{display:grid;grid-template-columns:1fr 1fr;gap:24px 64px;align-items:end;margin-bottom:clamp(36px,5vw,56px)}
.head>*{min-width:0}.head-l{display:grid;gap:16px}
.btn{display:inline-flex;align-items:center;gap:8px;font-size:15px;font-weight:500;padding:12px 18px;border-radius:10px;border:1px solid var(--line2);background:transparent;cursor:pointer;white-space:nowrap;transition:border-color .2s,transform .2s,background .2s}
.btn:hover{border-color:rgba(255,255,255,.3)}
.btn-w{background:linear-gradient(135deg,#f6efff,#dcc4ff);color:var(--brand);border-color:transparent}
.btn-w:hover{transform:translateY(-1px)}
.card{background:linear-gradient(170deg,var(--surface),var(--bg2));border:1px solid var(--line);border-radius:var(--r)}
/* nav + footer */
.nav{position:sticky;top:env(safe-area-inset-top,0px);z-index:70;background:rgba(13,7,22,.94);border-bottom:1px solid var(--line)}
.nav .wrap{height:66px;display:flex;align-items:center;justify-content:space-between;gap:20px}
.logo{display:flex;align-items:center;gap:10px}.logo svg{width:28px;height:29px;flex:none}
.wm{font-family:"Lexend",var(--f-display);font-size:19px;letter-spacing:-.02em;line-height:1}.wm b{font-weight:600;color:#fff}.wm em{font-style:normal;font-weight:300;color:var(--accent)}
.nav ul{display:flex;gap:26px;list-style:none;margin:0;padding:0;font-size:14.5px;color:var(--muted)}
.nav ul a:hover,.nav ul a[aria-current]{color:var(--ink)}
@media(max-width:1020px){.nav ul{display:none}}
footer{border-top:1px solid var(--line);padding-block:28px;color:var(--dim);font-size:13.5px}
footer .wrap{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px}
footer a{color:var(--muted)}footer a:hover{color:var(--ink)}
/* hero */
.hero{padding-block:clamp(56px,8vw,100px) clamp(40px,6vw,64px);position:relative;overflow:hidden}
.hero h1{font-size:clamp(42px,6.6vw,88px);line-height:1;margin:18px 0;max-width:15ch}
.hero .lead{font-size:18px;max-width:64ch}
.hero .row{display:flex;gap:10px;flex-wrap:wrap;margin-top:26px}
.jump{display:flex;flex-wrap:wrap;gap:8px;margin-top:30px}
.jump a{font-size:13px;padding:6px 12px;border-radius:99px;border:1px solid var(--line2);color:var(--muted);display:inline-flex;align-items:center;gap:7px}
.jump a::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--c)}
.jump a:hover{color:var(--ink);border-color:var(--c)}
/* AI-first trio */
.ai3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.ai3 .card{padding:26px;display:grid;gap:12px;align-content:start;min-width:0;position:relative;overflow:hidden}
.ai3 .card::after{content:"";position:absolute;right:-40px;top:-40px;width:120px;height:120px;border-radius:50%;background:var(--c);opacity:.16}
.ai3 .k{font-family:var(--f-mono);font-size:12px;color:var(--c)}
.ai3 h3{font-size:24px}
.ai3 p{color:var(--muted)}
@media(max-width:860px){.ai3{grid-template-columns:1fr}}
/* services layout */
.svc-layout{display:grid;grid-template-columns:250px 1fr;gap:clamp(24px,4vw,48px);align-items:start}
.svc-layout>*{min-width:0}
.svc-index{position:sticky;top:96px;display:grid;gap:16px}
.svc-index .grp{display:grid;gap:2px}
.svc-index .grp b{font-family:var(--f-mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);font-weight:400;margin-bottom:4px}
.svc-index a{font-size:14.5px;color:var(--muted);padding:6px 10px;border-radius:8px;border-left:2px solid transparent;transition:background .2s,color .2s,border-color .2s}
.svc-index a:hover{color:var(--ink)}
.svc-index a.on{color:var(--ink);background:rgba(201,162,255,.08);border-left-color:var(--c)}
.cluster{display:grid;gap:14px}
.cluster+.cluster{margin-top:56px}
.cluster-head{display:grid;gap:8px;margin-bottom:6px}
.cluster-head .eyebrow::before{background:var(--c)}
.cluster-head h2{font-size:clamp(26px,3vw,36px)}
.cluster-head p{color:var(--muted)}
.svc-block{scroll-margin-top:90px;display:grid;grid-template-columns:1.1fr .9fr;gap:24px 36px;padding:clamp(22px,3vw,32px);border-radius:var(--r);border:1px solid var(--line);background:radial-gradient(80% 90% at 0% 0%,color-mix(in srgb,var(--c) 12%,transparent),transparent 60%),linear-gradient(170deg,var(--surface),var(--bg2));transition:border-color .3s}
.svc-block:hover{border-color:color-mix(in srgb,var(--c) 45%,transparent)}
.svc-block>*{min-width:0}
.sb-l,.sb-r{display:grid;gap:12px;align-content:start}
.sb-num{font-family:var(--f-mono);font-size:11px;letter-spacing:.14em;color:var(--c)}
.svc-block h3{font-size:clamp(24px,2.6vw,32px);line-height:1.12}
.sb-lead{color:#d9d3e6;font-size:16.5px}
.sb-ai{font-size:14.5px;color:var(--muted);padding:10px 12px;border-radius:10px;border:1px dashed color-mix(in srgb,var(--c) 45%,transparent);background:rgba(13,7,22,.35)}
.sb-ai b{color:var(--c);font-weight:500}
.sb-tags{display:flex;flex-wrap:wrap;gap:6px}
.sb-tags span{font-family:var(--f-mono);font-size:11px;padding:3px 9px;border-radius:99px;border:1px solid var(--line2)}
.sb-k{font-family:var(--f-mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--dim)}
.sb-r ul{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.sb-r li{display:grid;grid-template-columns:18px 1fr;gap:8px;font-size:15px}
.sb-r li::before{content:"✓";color:var(--c);font-weight:600}
.sb-time{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:10px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);font-size:14px}
.sb-time span{color:var(--muted)}
.sb-time b{font-weight:500}
.sb-cta{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.sb-link{font-size:14px;color:var(--accent);text-decoration:underline;text-underline-offset:3px}
@media(max-width:1000px){.svc-layout{grid-template-columns:1fr}.svc-index{display:none}}
@media(max-width:720px){.svc-block{grid-template-columns:1fr}}
/* models + bundles */
.models,.bundles{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.models .card,.bundles .card{padding:26px;display:grid;gap:12px;align-content:start;min-width:0}
.models h3,.bundles h3{font-size:22px}
.models p,.bundles p{color:var(--muted);font-size:15px}
.models .for{font-family:var(--f-mono);font-size:11.5px;color:var(--accent)}
.bundles .plus{display:flex;flex-wrap:wrap;gap:6px}
.bundles .plus span{font-size:12.5px;padding:4px 10px;border-radius:99px;background:rgba(201,162,255,.1);border:1px solid var(--line2)}
.bundles .plus i{font-style:normal;color:var(--dim);align-self:center}
@media(max-width:900px){.models,.bundles{grid-template-columns:1fr}}
/* faq + cta */
.qa{border-top:1px solid var(--line);max-width:900px}
.qa details{border-bottom:1px solid var(--line)}
.qa summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;gap:16px;padding:20px 0;font-size:17px;font-weight:500}
.qa summary::-webkit-details-marker{display:none}
.qa summary::after{content:"+";color:var(--muted);font-size:20px;line-height:1;transition:transform .25s}
.qa details[open] summary::after{transform:rotate(45deg)}
.qa details p{color:var(--muted);padding-bottom:20px;max-width:70ch}
.cta{padding:clamp(28px,5vw,52px);display:flex;justify-content:space-between;align-items:center;gap:24px;flex-wrap:wrap;background:radial-gradient(90% 140% at 100% 0%,rgba(201,162,255,.16),transparent 60%),linear-gradient(170deg,var(--surface),var(--bg2))}
.cta>div{display:grid;gap:12px;max-width:560px;min-width:0}
.cta h2{font-size:clamp(28px,3.6vw,40px);line-height:1.1}
.cta p{color:var(--muted)}
.cta .row{display:flex;gap:10px;flex-wrap:wrap}
@media(max-width:860px){.head{grid-template-columns:1fr}}
@media(min-width:1440px){:root{--wrap:1320px}body{font-size:17px}.svc-layout{grid-template-columns:270px 1fr}}
@media(min-width:1800px){:root{--wrap:1480px}body{font-size:18px}}
${ambientCss}
${smoothCss}
</style>
</head>
<body>
<div class="ambient" aria-hidden="true"><span class="blob b1"></span><span class="blob b2"></span><span class="blob b3"></span><span class="dots"></span><span class="sparks">${sparks}</span></div>
${DEFS}

<header class="nav"><div class="wrap">
  <a class="logo" href="index.html" aria-label="Branding Catalyst home"><svg viewBox="0 0 96 100" aria-hidden="true"><use href="#bcMark"/></svg><span class="wm"><b>Branding</b><em>Catalyst</em></span></a>
  <ul><li><a href="services.html" aria-current="page">Services</a></li><li><a href="scale.html">Scale</a></li><li><a href="check.html">Idea Checker</a></li><li><a href="index.html#brand-lab">Brand Lab</a></li><li><a href="index.html#idea-lab">Idea Lab</a></li><li><a href="about.html">About</a></li><li><a href="careers.html">Careers</a></li><li><a href="index.html#faq">FAQ</a></li></ul>
  <button class="btn btn-w" type="button" data-lead data-lead-source="Services header">Start a project →</button>
</div></header>

<main>
<section class="hero"><div class="wrap">
  <p class="eyebrow">Services · AI-first studio · Mumbai</p>
  <h1>AI-first, <span class="acc">from brand to build.</span></h1>
  <p class="lead">Every service we offer starts with AI. It helps us plan faster, build smarter and get your brand found where customers now search: in ChatGPT, Gemini and Google. Pick one service, or let one team run the whole journey.</p>
  <div class="row"><button class="btn btn-w" type="button" data-lead data-lead-source="Services hero">Start a project →</button><a class="btn" href="index.html?ask=${encodeURIComponent('Which of your services do I need for my business?')}#top">Not sure? Ask ARC</a></div>
  <nav class="jump" aria-label="Jump to a service">${all.map(it => `<a href="#${it.id}" style="--c:${it.c.color}">${esc(it.title.split(' · ')[0])}</a>`).join('')}</nav>
</div></section>

<section class="sec"><div class="wrap">
  <div class="head"><div class="head-l"><p class="eyebrow">Why AI-first</p><h2 class="h2">AI in every step.<br><span class="acc">People in charge.</span></h2></div>
  <p class="lead">AI does the heavy lifting so our designers, engineers and strategists can focus on what makes your product and brand different. Every release is still reviewed by a person.</p></div>
  <div class="ai3">
    <div class="card" style="--c:#c9a2ff"><span class="k">01 · PLAN</span><h3>AI plans it</h3><p>ARC and Catalyst Engine turn your idea into features, a team and a timeline in minutes, not weeks of meetings.</p></div>
    <div class="card" style="--c:#7fd6e8"><span class="k">02 · BUILD</span><h3>AI builds it</h3><p>Agents write and test the repetitive code and content. Engineers and designers review, refine and ship every week.</p></div>
    <div class="card" style="--c:#f2a7c3"><span class="k">03 · GROW</span><h3>AI gets it found</h3><p>AEO and GEO make your brand the answer in AI search, and AI-powered growth turns that attention into customers.</p></div>
  </div>
</div></section>

<section class="sec" id="all"><div class="wrap">
  <div class="head"><div class="head-l"><p class="eyebrow">All services</p><h2 class="h2">Eleven services.<br><span class="acc">One team.</span></h2></div>
  <p class="lead">Grouped the way most businesses grow: get intelligent, get found, then build what's next. Typical timelines are a guide; you get a fixed quote after a free scoping call.</p></div>
  <div class="svc-layout">
    <aside class="svc-index" aria-label="Services">${CLUSTERS.map(c => `<div class="grp"><b>${esc(c.name)}</b>${c.items.map(it => `<a href="#${it.id}" style="--c:${c.color}">${esc(it.title.split(' · ')[0])}</a>`).join('')}</div>`).join('')}</aside>
    <div>${CLUSTERS.map(c => `
      <div class="cluster" style="--c:${c.color}">
        <div class="cluster-head"><p class="eyebrow">${esc(c.name)}</p><h2>${esc(c.blurb)}</h2></div>${c.items.map(it => block({ ...it, c })).join('')}
      </div>`).join('')}
    </div>
  </div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="head"><div class="head-l"><p class="eyebrow">Ways to work with us</p><h2 class="h2">Pick the model<br><span class="acc">that fits.</span></h2></div>
  <p class="lead">Every engagement starts with a free scoping call. You get a fixed quote and a clear plan before any work begins.</p></div>
  <div class="models">
    <div class="card"><span class="for">BEST FOR APPS, ERP, WEBSITES, 3D</span><h3>Fixed-scope project</h3><p>Agreed scope, price and launch date, paid per milestone after you approve each one. A demo every week.</p></div>
    <div class="card"><span class="for">BEST FOR AEO, GEO, CONTENT, GROWTH</span><h3>Monthly growth partner</h3><p>A monthly plan with clear goals, AI-visibility tracking and a simple report on what moved and what is next.</p></div>
    <div class="card"><span class="for">BEST FOR ONGOING PRODUCTS</span><h3>Dedicated AI team</h3><p>A small cross-functional team (design, engineering, AI) working on your roadmap month after month.</p></div>
  </div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="head"><div class="head-l"><p class="eyebrow">Popular bundles</p><h2 class="h2">Better <span class="acc">together.</span></h2></div>
  <p class="lead">Services that clients often combine, because they work best as one plan.</p></div>
  <div class="bundles">
    <div class="card"><h3>Launch kit</h3><div class="plus"><span>Branding</span><i>+</i><span>Website</span><i>+</i><span>AEO</span></div><p>A new brand, a fast website and AI-search visibility from day one.</p><button class="btn" type="button" data-lead data-lead-service="Branding" data-lead-idea="Launch kit: branding, website and AEO" data-lead-source="Bundle · Launch kit">Ask about this →</button></div>
    <div class="card"><h3>App + growth</h3><div class="plus"><span>Mobile app</span><i>+</i><span>Growth</span><i>+</i><span>AI content</span></div><p>Launch your Android and iOS app and keep downloads and repeat customers coming.</p><button class="btn" type="button" data-lead data-lead-service="Mobile app" data-lead-idea="App + growth bundle: mobile app, growth marketing and AI content" data-lead-source="Bundle · App + growth">Ask about this →</button></div>
    <div class="card"><h3>Smart operations</h3><div class="plus"><span>ERP</span><i>+</i><span>AI agents</span><i>+</i><span>RAG assistant</span></div><p>Run the business on one system, with AI that answers questions and handles routine work.</p><button class="btn" type="button" data-lead data-lead-service="ERP system" data-lead-idea="Smart operations bundle: ERP, AI agents and a RAG assistant" data-lead-source="Bundle · Smart operations">Ask about this →</button></div>
  </div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="head"><div class="head-l"><p class="eyebrow">FAQ</p><h2 class="h2">Questions about <span class="acc">our services.</span></h2></div></div>
  <div class="qa">
    <details open><summary>What does "AI-first" actually mean for my project?</summary><p>We use AI at every stage: to plan scope and timelines, to generate and test repetitive code and content, and to make your brand visible in AI search. People still lead the strategy, design and quality checks, and an engineer reviews every release.</p></details>
    <details><summary>Can I hire you for just one service?</summary><p>Yes. Many clients start with one service, such as a website or an AEO audit, and add more later. Bundles are optional.</p></details>
    <details><summary>Who do you work with?</summary><p>Startups, growing businesses and established brands across India and abroad, from cafés and clinics to manufacturers and SaaS companies.</p></details>
    <details><summary>How much does it cost?</summary><p>It depends on scope. Ask ARC or use the idea checker for a first estimate; after a free 30-minute scoping call we give you a fixed quote.</p></details>
    <details><summary>Do you maintain what you build?</summary><p>Yes. We offer monitoring, updates and care plans after launch, plus monthly AEO, GEO and growth work to keep improving results.</p></details>
  </div>
</div></section>

<section class="sec" style="padding-top:0"><div class="wrap">
  <div class="card cta"><div><h2>Not sure which service you need?</h2><p>Tell ARC what you want to achieve, or share a few details and we'll recommend the right mix.</p></div>
  <div class="row"><button class="btn btn-w" type="button" data-lead data-lead-source="Services call to action">Start a project →</button><a class="btn" href="index.html?ask=${encodeURIComponent('Which of your services do I need for my business?')}#top">Ask ARC</a></div></div>
</div></section>
</main>

<footer><div class="wrap"><span>© 2026 Branding Catalyst Pvt Ltd · Mumbai, India</span><span><a href="index.html">Home</a> · <a href="services.html">Services</a> · <a href="scale.html">Scale</a> · <a href="check.html">Idea Checker</a> · <a href="about.html">About</a> · <a href="careers.html">Careers</a> · <a href="privacy.html">Privacy Policy</a> · <a href="terms.html">Terms of Use</a></span></div></footer>

<script>
/* highlight the service in view in the side index */
(() => { const links = [...document.querySelectorAll('.svc-index a')]; if (!links.length || !('IntersectionObserver' in window)) return;
  const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { links.forEach(a => a.classList.remove('on')); const a = map.get(e.target.id); if (a) a.classList.add('on'); } }), { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('.svc-block').forEach(b => io.observe(b)); })();
/* ambient background follows the scroll */
(() => { const a = document.querySelector('.ambient'); if (!a) return; let q = false;
  const upd = () => { const y = scrollY; a.style.setProperty('--s1', Math.sin(y / 700).toFixed(3)); a.style.setProperty('--c1', Math.cos(y / 900).toFixed(3)); a.style.setProperty('--s2', Math.sin(y / 1100 + 1).toFixed(3)); a.style.setProperty('--c2', Math.cos(y / 800 + 2).toFixed(3)); q = false; };
  addEventListener('scroll', () => { if (!q) { q = true; requestAnimationFrame(upd); } }, { passive: true }); upd(); })();
</script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.3.26/dist/lenis.min.js"></script>
<script>
${smoothJs}</script>
<script src="leads.js" defer></script>
<script src="fx.js" defer></script>
</body>
</html>
`;
fs.writeFileSync(path.join(site, 'services.html'), page);
console.log('services.html written:', all.length, 'services');
