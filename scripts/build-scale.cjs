// Generates public/scale.html, reusing the services page shell and the homepage's traffic simulation.
const fs = require('fs'), path = require('path');
const [site, homeSrc] = process.argv.slice(2), here = __dirname;
const svc = fs.readFileSync(path.join(site, 'services.html'), 'utf8');
const home = fs.readFileSync(homeSrc, 'utf8');
const cut = (s, a, b) => { const i = s.indexOf(a), j = s.indexOf(b, i + 1); if (i < 0 || j < 0) throw new Error('cut: ' + a.slice(0, 40)); return s.slice(i, j); };

// shell pieces from the services page (same head, styles, nav, footer, scripts)
const headTop = cut(svc, '<!doctype html>', '<meta name="description"');
const baseCss = cut(svc, '<style>\n:root{', '/* AI-first trio */');
const tailCss = cut(svc, '/* faq + cta */', '</style>');
const bodyTop = cut(svc, '<body>', '<header class="nav">');
const footerAndScripts = svc.slice(svc.indexOf('<footer>'));
// homepage simulation: drawing code + styles
const simJs = cut(home, '/* ===== Scale simulation: a festive sale day, autoscaling ===== */', '/* ===== Anatomy');
const simCss = home.split('\n').filter(l => /^\.(sim|sbar)\b|^#stStatus|^@keyframes livePulse|^\.sim-h \.live|^\.sim-stats/.test(l)).join('\n');

const CARE = [
  ['Uptime and error monitoring', 'Alerts reach our team first, day and night.'],
  ['Security patches', 'Operating system, framework and library updates applied on a schedule.'],
  ['Daily backups', 'Automated, encrypted and restore-tested, not just switched on.'],
  ['Performance reviews', 'Monthly checks on speed, slow queries and app size.'],
  ['Cloud cost reviews', 'Right-sizing servers so bills follow real traffic.'],
  ['Store and OS updates', 'Apps kept current with new Android and iOS releases.'],
  ['Small improvements', 'A monthly allowance for tweaks and fixes, no new contract needed.'],
  ['AI-search upkeep', 'AEO and GEO checks so you stay visible in AI answers.'],
  ['Clear monthly report', 'What happened, what we fixed and what is next, in plain language.']
];
const page = headTop.replace(/<title>[^<]*<\/title>/, '<title>Scale &amp; Reliability | Branding Catalyst</title>') + `<meta name="description" content="How Branding Catalyst builds apps, ERPs and platforms that stay fast during festive sales and launch-day rushes: autoscaling, load testing, zero-downtime releases, monitoring and care plans.">
<link rel="icon" href="logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap">
${baseCss}
/* scale page */
.pillars{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.pillars .card{padding:24px;display:grid;gap:10px;align-content:start;min-width:0}
.pillars .k{font-family:var(--f-mono);font-size:11.5px;color:var(--c);letter-spacing:.1em}
.pillars h3{font-size:21px}
.pillars p{color:var(--muted);font-size:15px}
.pillars .tools{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}
.pillars .tools span{font-family:var(--f-mono);font-size:11px;padding:3px 9px;border-radius:99px;border:1px solid var(--line2)}
@media(max-width:980px){.pillars{grid-template-columns:1fr 1fr}}
@media(max-width:600px){.pillars{grid-template-columns:1fr}}
.sim-wrap{display:grid;gap:14px}
.sim-legend{display:flex;flex-wrap:wrap;gap:14px 22px;font-size:13.5px;color:var(--muted)}
.sim-legend i{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:7px;vertical-align:middle}
.layers{display:grid;gap:10px;max-width:980px}
.layer{display:grid;grid-template-columns:200px 1fr auto;gap:18px;align-items:center;padding:18px 22px;border-radius:16px;border:1px solid var(--line);background:linear-gradient(90deg,color-mix(in srgb,var(--c) 14%,transparent),transparent 55%),var(--surface)}
.layer>*{min-width:0}
.layer b{font-family:var(--f-display);font-size:18px;font-weight:600}
.layer p{color:var(--muted);font-size:15px}
.layer span{font-family:var(--f-mono);font-size:11px;color:var(--c);white-space:nowrap}
.layer-arrow{justify-self:start;margin-left:96px;color:var(--dim);font-size:14px;line-height:1}
@media(max-width:760px){.layer{grid-template-columns:1fr;gap:6px}.layer-arrow{margin-left:22px}}
.playbook{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;position:relative}
.playbook::before{content:"";position:absolute;left:0;right:0;top:15px;height:2px;background:linear-gradient(90deg,#c9a2ff,#f2a7c3,#7fd6e8)}
.pb{display:grid;gap:8px;align-content:start;padding-top:34px;position:relative;min-width:0}
.pb::before{content:"";position:absolute;top:8px;left:0;width:16px;height:16px;border-radius:50%;background:var(--bg);border:2px solid var(--accent);box-shadow:0 0 12px rgba(201,162,255,.6)}
.pb .when{font-family:var(--f-mono);font-size:12px;color:var(--accent)}
.pb h3{font-size:18px}
.pb p{color:var(--muted);font-size:14.5px}
@media(max-width:980px){.playbook{grid-template-columns:1fr 1fr}.playbook::before{display:none}}
@media(max-width:520px){.playbook{grid-template-columns:1fr}}
.india{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.india .card{padding:22px;display:grid;gap:8px;align-content:start;min-width:0}
.india h3{font-size:18px}
.india p{color:var(--muted);font-size:14.5px}
@media(max-width:980px){.india{grid-template-columns:1fr 1fr}}
@media(max-width:520px){.india{grid-template-columns:1fr}}
.care{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border:1px solid var(--line);border-radius:var(--r);overflow:hidden}
.care div{padding:20px 22px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);display:grid;gap:4px;min-width:0;background:rgba(19,11,31,.6)}
.care div:nth-child(3n){border-right:0}
.care div:nth-last-child(-n+3){border-bottom:0}
.care b{font-weight:500;display:flex;gap:8px}
.care b::before{content:"✓";color:var(--ok)}
.care p{color:var(--muted);font-size:14.5px}
@media(max-width:860px){.care{grid-template-columns:1fr}.care div{border-right:0!important;border-bottom:1px solid var(--line)!important}.care div:last-child{border-bottom:0!important}}
.stack{display:flex;flex-wrap:wrap;gap:8px}
.stack span{font-family:var(--f-mono);font-size:12.5px;padding:7px 13px;border-radius:99px;border:1px solid var(--line2);background:rgba(27,17,41,.7)}
.stack span i{font-style:normal;color:var(--dim);margin-left:6px}
${simCss}
.sim{position:relative;top:0}
.sim canvas{height:clamp(360px,42vw,520px)}
@media(max-width:560px){.sim canvas{height:380px}}
@media(max-width:520px){.sim-stats{grid-template-columns:1fr 1fr}.sim-stats div:nth-child(2){border-right:0}.sim-stats div:nth-child(-n+2){border-bottom:1px solid var(--line)}}
${tailCss}</style>
</head>
${bodyTop}<header class="nav"><div class="wrap">
  <a class="logo" href="index.html" aria-label="Branding Catalyst home"><svg viewBox="0 0 96 100" aria-hidden="true"><use href="#bcMark"/></svg><span class="wm"><b>Branding</b><em>Catalyst</em></span></a>
  <ul><li><a href="services.html">Services</a></li><li><a href="scale.html" aria-current="page">Scale</a></li><li><a href="check.html">Idea Checker</a></li><li><a href="index.html#idea-lab">Idea Lab</a></li><li><a href="about.html">About</a></li><li><a href="careers.html">Careers</a></li><li><a href="index.html#faq">FAQ</a></li></ul>
  <button class="btn btn-w" type="button" data-lead data-lead-source="Scale header">Start a project →</button>
</div></header>

<main>
<section class="hero"><div class="wrap">
  <p class="eyebrow">Scale &amp; reliability</p>
  <h1>Ready for your <span class="acc">busiest day.</span></h1>
  <p class="lead">Diwali offers, launch days, a reel that goes viral at midnight. Busy days are good news, unless the app slows down or goes offline. We build every app, ERP and platform to stay fast under pressure, and we keep watching it after launch.</p>
  <div class="row"><button class="btn btn-w" type="button" data-lead data-lead-source="Scale hero">Plan something that must scale →</button><a class="btn" href="#sim">Watch the simulation</a></div>
</div></section>

<section class="sec" id="sim"><div class="wrap sim-wrap">
  <div class="head"><div class="head-l"><p class="eyebrow">Live simulation</p><h2 class="h2">A festive sale day,<br><span class="acc">in one minute.</span></h2></div>
  <p class="lead">Watch traffic build through the day, spike when the 8 pm sale goes live, and see app servers switch on to meet it, then switch off again so you stop paying for them. Illustrative, but it is exactly how we set up production systems.</p></div>
  <div class="card sim">
    <div class="sim-h"><span><i class="live"></i>LIVE SIMULATION · A FESTIVE SALE DAY, AUTOSCALING</span><b id="clock">00:00</b></div>
    <canvas id="simCv" aria-label="Simulated traffic and app servers over a festive sale day"></canvas>
    <div class="sim-stats">
      <div><small>Requests / sec</small><b id="stReq">0</b></div>
      <div><small>App servers</small><b id="stSrv">2</b></div>
      <div><small>P95 response</small><b id="stP95">60ms</b></div>
      <div><small>Status</small><b id="stStatus">steady</b><i class="sbar"><b id="stBar"></b></i></div>
    </div>
  </div>
  <div class="sim-legend"><span><i style="background:#c9a2ff"></i>Requests through the load balancer</span><span><i style="background:#7fd6e8"></i>Cache hits</span><span><i style="background:#9aa3f5"></i>Database reads and writes</span><span><i style="background:#f2a7c3"></i>Background jobs (orders, emails, invoices)</span></div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="head"><div class="head-l"><p class="eyebrow">What we never skip</p><h2 class="h2">Six habits that keep<br><span class="acc">apps fast and online.</span></h2></div>
  <p class="lead">None of these are glamorous. All of them are the difference between a great launch and an apology post.</p></div>
  <div class="pillars">
    <div class="card" style="--c:#6fcf97"><span class="k">01 · AUTOSCALING</span><h3>Capacity that follows demand</h3><p>Servers are added automatically when traffic jumps and removed when it drops, so a rush never takes you down and quiet nights cost less.</p><div class="tools"><span>AWS Auto Scaling</span><span>Kubernetes</span><span>Vercel</span></div></div>
    <div class="card" style="--c:#c9a2ff"><span class="k">02 · LOAD TESTING</span><h3>We rehearse the rush</h3><p>Before launch we simulate your peak traffic, find the slow parts and fix them before real customers ever arrive.</p><div class="tools"><span>k6</span><span>Locust</span><span>Lighthouse</span></div></div>
    <div class="card" style="--c:#7fd6e8"><span class="k">03 · ZERO-DOWNTIME RELEASES</span><h3>Ship any day, safely</h3><p>Automated tests and deploys with instant rollback mean updates go out during business hours without taking the app offline.</p><div class="tools"><span>GitHub Actions</span><span>Docker</span><span>Blue-green deploys</span></div></div>
    <div class="card" style="--c:#f2a7c3"><span class="k">04 · MONITORING</span><h3>We hear about it first</h3><p>Uptime checks, error tracking and performance alerts reach our team at any hour, usually before your customers notice anything.</p><div class="tools"><span>Grafana</span><span>Sentry</span><span>UptimeRobot</span></div></div>
    <div class="card" style="--c:#f2c27a"><span class="k">05 · SECURITY &amp; BACKUPS</span><h3>Protected and recoverable</h3><p>Encrypted data, least-privilege access, daily backups and a recovery plan we actually test, not just a checkbox.</p><div class="tools"><span>Cloudflare WAF</span><span>Encrypted backups</span><span>OWASP checks</span></div></div>
    <div class="card" style="--c:#9aa3f5"><span class="k">06 · COST CONTROL</span><h3>Fast, without waste</h3><p>Caching, right-sized servers and monthly reviews keep your AWS, Google Cloud or Azure bill in line with real usage.</p><div class="tools"><span>Redis</span><span>CDN</span><span>Cost reports</span></div></div>
  </div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="head"><div class="head-l"><p class="eyebrow">How we build for scale</p><h2 class="h2">Five layers,<br><span class="acc">each with a job.</span></h2></div>
  <p class="lead">Scale is designed in from the first sprint. Every product we ship follows the same shape, sized to your traffic today and ready for the traffic you're planning for.</p></div>
  <div class="layers">
    <div class="layer" style="--c:#7fd6e8"><b>Edge &amp; CDN</b><p>Images, pages and files served from locations close to your users, with a firewall in front.</p><span>FAST FIRST LOAD</span></div>
    <span class="layer-arrow">↓</span>
    <div class="layer" style="--c:#c9a2ff"><b>App tier</b><p>Stateless app servers behind a load balancer, so we can add or remove them in seconds.</p><span>AUTOSCALES</span></div>
    <span class="layer-arrow">↓</span>
    <div class="layer" style="--c:#9aa3f5"><b>Data</b><p>A primary database with read replicas, plus a cache for the questions everyone asks.</p><span>NO BOTTLENECKS</span></div>
    <span class="layer-arrow">↓</span>
    <div class="layer" style="--c:#f2a7c3"><b>Background jobs</b><p>Orders, emails, invoices and AI tasks go to a queue, so customers never wait for them.</p><span>NEVER BLOCKS</span></div>
    <span class="layer-arrow">↓</span>
    <div class="layer" style="--c:#6fcf97"><b>Observability</b><p>Logs, metrics and traces across every layer, with alerts tied to what customers feel.</p><span>SEES EVERYTHING</span></div>
  </div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="head"><div class="head-l"><p class="eyebrow">Launch-day playbook</p><h2 class="h2">Big days are<br><span class="acc">planned, not hoped for.</span></h2></div>
  <p class="lead">For every launch, sale or campaign we know is coming, we run the same playbook with your team.</p></div>
  <div class="playbook">
    <div class="pb"><span class="when">4 weeks before</span><h3>Forecast &amp; load test</h3><p>Estimate peak traffic and test well beyond it.</p></div>
    <div class="pb"><span class="when">2 weeks before</span><h3>Security review</h3><p>Check access, payments and data handling end to end.</p></div>
    <div class="pb"><span class="when">1 week before</span><h3>Runbooks &amp; alerts</h3><p>Write who does what if something goes wrong, and tune alerts.</p></div>
    <div class="pb"><span class="when">Launch day</span><h3>War room</h3><p>Our engineers watch live dashboards with your team.</p></div>
    <div class="pb"><span class="when">1 week after</span><h3>Review &amp; tune</h3><p>Fix what we learned and bring cloud costs back down.</p></div>
  </div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="head"><div class="head-l"><p class="eyebrow">Built for India</p><h2 class="h2">Local realities,<br><span class="acc">designed in.</span></h2></div>
  <p class="lead">Scaling in India has its own patterns. We plan for them from day one.</p></div>
  <div class="india">
    <div class="card"><h3>Festive spikes</h3><p>Diwali, Navratri and end-of-season sales can multiply traffic in minutes. We size for those peaks.</p></div>
    <div class="card"><h3>UPI &amp; payment peaks</h3><p>Reliable checkout with Razorpay and UPI, retries and clear status, even when banks are slow.</p></div>
    <div class="card"><h3>Patchy mobile networks</h3><p>Lightweight pages, image compression and offline-friendly apps for 4G in a crowded market.</p></div>
    <div class="card"><h3>Mumbai cloud regions</h3><p>Servers in Indian cloud regions for speed, and data stored in line with Indian data protection rules.</p></div>
  </div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="head"><div class="head-l"><p class="eyebrow">After launch</p><h2 class="h2">We don't disappear<br><span class="acc">after go-live.</span></h2></div>
  <p class="lead">Care plans keep your product healthy, secure and fast month after month.</p></div>
  <div class="care">${CARE.map(([a, b]) => `<div><b>${a}</b><p>${b}</p></div>`).join('')}</div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="head"><div class="head-l"><p class="eyebrow">Our scale stack</p><h2 class="h2">Proven tools,<br><span class="acc">picked per project.</span></h2></div>
  <p class="lead">We use mainstream, well-supported technology, so your product is easy to run, hire for and hand over.</p></div>
  <div class="stack">${[['AWS', 'Mumbai region'], ['Google Cloud', ''], ['Azure', ''], ['Vercel', ''], ['Cloudflare', ''], ['Docker', ''], ['Kubernetes', ''], ['PostgreSQL', ''], ['Redis', ''], ['Message queues', ''], ['GitHub Actions', ''], ['Grafana', ''], ['Sentry', ''], ['k6', 'load tests']].map(([a, b]) => `<span>${a}${b ? `<i>${b}</i>` : ''}</span>`).join('')}</div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="head"><div class="head-l"><p class="eyebrow">FAQ</p><h2 class="h2">Questions about <span class="acc">scale.</span></h2></div></div>
  <div class="qa">
    <details open><summary>Do I need all of this from day one?</summary><p>No. We size the setup to the traffic you have now and design it so it can grow without a rebuild. A new app might start on a simple, low-cost setup and switch on autoscaling when it is needed.</p></details>
    <details><summary>Can you fix an app that already struggles under load?</summary><p>Yes. We start with an audit and a load test to find the bottlenecks, then fix the biggest ones first, often caching, slow database queries and work that should run in the background.</p></details>
    <details><summary>Will scaling make my cloud bill explode?</summary><p>Not if it is set up well. Autoscaling adds servers only during a rush and removes them afterwards, and caching reduces how much work each request needs. We review costs monthly.</p></details>
    <details><summary>Where will my data be hosted?</summary><p>Usually in Indian cloud regions such as AWS Mumbai, or wherever your customers and compliance needs are. We can discuss data residency during scoping.</p></details>
  </div>
</div></section>

<section class="sec" style="padding-top:0"><div class="wrap">
  <div class="card cta"><div><h2>Planning something that has to scale?</h2><p>A sale, a launch or an app you expect to grow fast. Tell us about it and we'll plan for the big day.</p></div>
  <div class="row"><button class="btn btn-w" type="button" data-lead data-lead-source="Scale call to action">Start a project →</button><a class="btn" href="services.html">See all services</a></div></div>
</div></section>
</main>

` + footerAndScripts.replace('<script>\n/* highlight the service in view', `<script>
/* traffic simulation (shared with the homepage) */
(() => { const $ = s => document.querySelector(s); const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
${simJs}})();
</script>
<script>
/* highlight the service in view`).replace("'.head', '.feat .card', '.svc-block',", "'.head', '.feat .card', '.svc-block', '.pillars .card', '.layer', '.pb', '.india .card', '.care', '.stack',");
fs.writeFileSync(path.join(site, 'scale.html'), page);
console.log('scale.html written');
