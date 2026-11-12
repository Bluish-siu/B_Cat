// Generates public/check.html (Idea Checker page) from the services page shell and the homepage estimator.
const fs = require('fs'), path = require('path');
const [site, homeSrc] = process.argv.slice(2);
const svc = fs.readFileSync(path.join(site, 'services.html'), 'utf8');
const home = fs.readFileSync(homeSrc, 'utf8');
const cut = (s, a, b) => { const i = s.indexOf(a), j = s.indexOf(b, i + 1); if (i < 0 || j < 0) throw new Error('cut: ' + a.slice(0, 40)); return s.slice(i, j); };

const headTop = cut(svc, '<!doctype html>', '<meta name="description"').replace(/<title>[^<]*<\/title>/, '<title>Idea Checker | Branding Catalyst</title>');
const baseCss = cut(svc, '<style>\n:root{', '/* AI-first trio */');
const tailCss = cut(svc, '/* faq + cta */', '</style>');
const bodyTop = cut(svc, '<body>', '<header class="nav">');
const footerAndScripts = svc.slice(svc.indexOf('<footer>'));
const estimator = cut(home, 'const PRODUCTS = [', 'const featList');
// keep the data tables and helpers; drop the unfinished classify() body
const est = estimator.slice(0, estimator.indexOf('function classify'));
const client = fs.readFileSync(path.join(__dirname, '..', 'src', 'check-client.js'), 'utf8').replace('/*__ESTIMATOR__*/', () => est);

const page = headTop + `<meta name="description" content="Free idea checker from Branding Catalyst: describe your app, website, ERP or AI idea and get a first estimate of feasibility, timeline, team, tech stack and roadmap in a minute.">
<link rel="icon" href="logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap">
${baseCss}
/* idea checker page */
.ph{color:var(--accent);border-bottom:1px dashed var(--accent)}
.muted{color:var(--muted)}
.steps{list-style:none;margin:6px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
.steps li{display:flex;align-items:center;gap:8px;font-size:13.5px;color:var(--dim);padding:7px 13px 7px 8px;border-radius:99px;border:1px solid var(--line)}
.steps li::before{counter-increment:st;content:counter(st);display:grid;place-items:center;width:20px;height:20px;border-radius:50%;font:500 11px var(--f-mono);background:rgba(255,255,255,.06)}
.steps{counter-reset:st}
.steps li.cur{color:var(--ink);border-color:rgba(201,162,255,.5);background:rgba(139,92,246,.14)}
.steps li.cur::before{background:var(--accent);color:#1a0730}
.steps li.done{color:var(--muted)}
.steps li.done::before{content:"✓";background:rgba(111,207,151,.2);color:var(--ok)}
.ck{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:clamp(20px,3vw,36px);align-items:start}
.ck>*{min-width:0}
#ckForm{display:grid;gap:26px;padding:clamp(20px,3vw,30px);background:var(--surface)}
.q{display:grid;gap:12px;min-width:0}
.q>label,.q>.ql{font-family:var(--f-display);font-size:18px;font-weight:500}
.q>label i,.q>.ql i{font-style:normal;color:var(--dim);font-family:var(--f-mono);font-size:12px;margin-left:6px;font-weight:400}
#ckIdea{width:100%;min-height:120px;resize:vertical;background:var(--bg);border:1px solid var(--line2);border-radius:12px;padding:14px 16px;font-size:16px;line-height:1.5}
#ckIdea:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px rgba(201,162,255,.15)}
.exrow{display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-size:13px;color:var(--dim)}
.chip,.tog,.opt{font-size:13.5px;padding:7px 13px;border-radius:99px;border:1px solid var(--line2);background:rgba(27,17,41,.7);cursor:pointer;transition:border-color .2s,background .2s,color .2s}
.chip:hover,.tog:hover,.opt:hover{border-color:var(--accent)}
.tog.on{background:rgba(139,92,246,.22);border-color:rgba(201,162,255,.6);color:var(--ink)}
.tog.on::before{content:"✓ ";color:var(--ok)}
.opts{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px}
.opt{border-radius:12px;padding:12px 14px;text-align:left;display:grid;gap:3px}
.opt b{font-weight:500;font-size:14.5px}
.opt span{font-size:12.5px;color:var(--dim)}
.opt.on{border-color:var(--accent);background:rgba(139,92,246,.18)}
.opt.auto b::after{content:"auto";font:400 10px var(--f-mono);letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin-left:8px}
.togs{display:flex;flex-wrap:wrap;gap:8px}
.live{position:sticky;top:96px;padding:22px;display:grid;gap:16px;background:linear-gradient(160deg,rgba(66,6,107,.35),transparent 60%),var(--surface)}
.live-h{display:flex;justify-content:space-between;align-items:center;font-family:var(--f-mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.live-h i{display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--ok);margin-right:8px;animation:livePulse 1.6s infinite}
@keyframes livePulse{50%{opacity:.3}}
.la{display:grid;gap:6px;padding-top:14px;border-top:1px solid var(--line)}
.la small{font-family:var(--f-mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--dim)}
.la b{font-weight:500;font-size:16px}
.la-feats{display:flex;flex-wrap:wrap;gap:6px}
.la-feats span{font-size:12px;padding:3px 9px;border-radius:7px;background:rgba(255,255,255,.06);border:1px solid var(--line)}
.la-feats i{font-size:13px;color:var(--dim)}
#laCx[data-v=Easy]{color:var(--ok)}#laCx[data-v=Medium]{color:var(--accent)}#laCx[data-v=Complex]{color:var(--warm)}#laCx[data-v=x]{color:var(--warm)}
.dbar{height:5px;border-radius:9px;background:rgba(255,255,255,.07);overflow:hidden}
.dbar i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--violet),var(--accent));transition:width .4s}
@media(max-width:900px){.ck{grid-template-columns:1fr}.live{position:relative;top:0}}
#ckRes{scroll-margin-top:90px}
.res{padding:clamp(20px,3vw,32px);display:grid;gap:22px;margin-top:22px}
.res-top{display:grid;grid-template-columns:auto 1fr;gap:22px;align-items:center}
.res-top>*{min-width:0}
.res h3{font-size:clamp(22px,2.6vw,30px);letter-spacing:-.02em;margin:6px 0}
.ring{position:relative;width:110px;height:110px;display:grid;place-items:center;align-content:center}
.ring svg{position:absolute;inset:0;transform:rotate(-90deg)}
.ring circle{fill:none;stroke-width:8}
.ring-bg{stroke:rgba(255,255,255,.08)}
.ring-fg{stroke-linecap:round;stroke-dasharray:302;stroke-dashoffset:302;transition:stroke-dashoffset 1.2s ease}
.ring b{font:500 30px var(--f-display);line-height:1}
.ring small{font:400 11px var(--f-mono);color:var(--dim)}
.res-grid{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--line);border-radius:14px;overflow:hidden}
.res-grid div{padding:16px 18px;border-right:1px solid var(--line);display:grid;gap:4px;min-width:0}
.res-grid div:last-child{border-right:0}
.res-grid small,.res-sec small,.price small{font-family:var(--f-mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--dim)}
.res-grid b{font-weight:500;font-size:18px}
.res-grid em{font-style:normal;font-size:13px;color:var(--muted)}
@media(max-width:620px){.res-grid{grid-template-columns:1fr}.res-grid div{border-right:0;border-bottom:1px solid var(--line)}.res-grid div:last-child{border-bottom:0}.res-top{grid-template-columns:1fr}}
.res-sec{display:grid;gap:10px}
.tagrow{display:flex;flex-wrap:wrap;gap:6px}
.tagrow span{font-family:var(--f-mono);font-size:12px;padding:4px 10px;border-radius:99px;border:1px solid var(--line2)}
.road{list-style:none;margin:0;padding:0;display:grid;gap:12px;counter-reset:rd}
.road li{display:grid;gap:3px;padding-left:18px;border-left:2px solid var(--accent)}
.road li:nth-child(2){border-color:var(--cyan)}.road li:nth-child(3){border-color:var(--warm)}
.road b{font-weight:500}
.road p{color:var(--muted);font-size:14.5px}
.ai-note{font-size:14.5px;color:var(--muted);padding:12px 16px;border-radius:12px;background:rgba(139,92,246,.1);border:1px solid rgba(201,162,255,.2)}
.ai-note b{color:var(--accent);font-weight:500}
.unlock{display:grid;gap:16px;padding-top:20px;border-top:1px solid var(--line)}
.unlock h4{font:500 20px var(--f-display);margin-bottom:4px}
#ckLead{display:grid;grid-template-columns:repeat(3,minmax(0,1fr)) auto;gap:10px}
#ckLead input{min-width:0;background:var(--bg);border:1px solid var(--line2);border-radius:10px;padding:12px 14px;font-size:15px}
#ckLead input:focus{outline:none;border-color:var(--accent)}
#ckLead .hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}
#ckLead .err{grid-column:1/-1;color:var(--warm);font-size:13.5px;min-height:1em}
@media(max-width:860px){#ckLead{grid-template-columns:1fr}}
.price{display:grid;gap:4px}
.price b{font:500 clamp(26px,3vw,34px) var(--f-display);letter-spacing:-.02em}
.price em{font-style:normal;font-size:13px;color:var(--dim)}
.how{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.how .card{padding:22px;display:grid;gap:8px;align-content:start;min-width:0}
.how .k{font-family:var(--f-mono);font-size:11.5px;color:var(--accent);letter-spacing:.1em}
.how h3{font-size:19px}
.how p{color:var(--muted);font-size:14.5px}
@media(max-width:860px){.how{grid-template-columns:1fr}}
${tailCss}</style>
</head>
${bodyTop}<header class="nav"><div class="wrap">
  <a class="logo" href="index.html" aria-label="Branding Catalyst home"><svg viewBox="0 0 96 100" aria-hidden="true"><use href="#bcMark"/></svg><span class="wm"><b>Branding</b><em>Catalyst</em></span></a>
  <ul><li><a href="services.html">Services</a></li><li><a href="scale.html">Scale</a></li><li><a href="check.html" aria-current="page">Idea Checker</a></li><li><a href="about.html">About</a></li><li><a href="careers.html">Careers</a></li><li><a href="index.html#faq">FAQ</a></li></ul>
  <button class="btn btn-w" type="button" data-lead data-lead-source="Idea Checker header">Start a project →</button>
</div></header>

<main>
<section class="hero"><div class="wrap">
  <p class="eyebrow">Free idea checker</p>
  <h1>Will your idea <span class="acc">work?</span></h1>
  <p class="lead">Describe it in a sentence or two. The checker picks out the features you mention and, in about a minute, gives you a first estimate: feasibility score, timeline, team, tech stack and a phased roadmap. Then our team sends you a price on WhatsApp.</p>
  <ol class="steps" aria-label="Progress"><li>Describe</li><li>Analyse</li><li>Your result</li><li>Get your price</li></ol>
</div></section>

<section class="sec" style="padding-top:clamp(20px,3vw,40px)"><div class="wrap">
  <div class="ck">
    <form class="card" id="ckForm" novalidate>
      <div class="q"><label for="ckIdea">1. Describe your idea</label>
        <textarea id="ckIdea" placeholder="e.g. An app where customers order groceries from local shops, pay with UPI and track delivery live."></textarea>
        <div class="exrow" id="ckEx" aria-label="Examples"></div>
      </div>
      <div class="q"><span class="ql">2. Where should it run? <i>auto-detected</i></span>
        <div class="opts" id="ckPlat">
          <button type="button" class="opt" data-p="web"><b>Website / web app</b><span>Runs in any browser</span></button>
          <button type="button" class="opt" data-p="mobile"><b>Mobile app</b><span>Android + iOS</span></button>
          <button type="button" class="opt" data-p="both"><b>Web + mobile</b><span>One backend, both apps</span></button>
          <button type="button" class="opt" data-p="ai"><b>AI tool / assistant</b><span>Chat, voice or agent</span></button>
        </div>
      </div>
      <div class="q"><span class="ql">3. Features <i>auto-detected · tap to adjust</i></span><div class="togs" id="ckFeat"></div></div>
      <div class="q"><span class="ql">4. What stage are you at?</span>
        <div class="opts" id="ckStage">
          <button type="button" class="opt" data-s="mvp"><b>MVP / first launch</b><span>Core features, launch fast</span></button>
          <button type="button" class="opt" data-s="grow"><b>Growing business</b><span>Polish, scale, analytics</span></button>
          <button type="button" class="opt" data-s="ent"><b>Enterprise</b><span>Security, audits, high traffic</span></button>
        </div>
      </div>
      <button class="btn btn-w" type="submit" style="justify-self:start">Check my idea →</button>
    </form>
    <aside class="card live" aria-live="polite">
      <div class="live-h"><span><i></i>Live analysis</span><span>Auto</span></div>
      <div class="la"><small>Platform</small><b id="laPlat">—</b></div>
      <div class="la"><small>Features detected · <span id="laCount">0</span></small><div class="la-feats" id="laFeats"></div></div>
      <div class="la"><small>Complexity</small><b id="laCx">—</b></div>
      <div class="la"><small>Detail level</small><b id="laDetail">—</b><div class="dbar"><i id="laDetailBar"></i></div></div>
      <div class="la"><small>Your price</small><b id="laPrice">Sent to you on WhatsApp</b></div>
    </aside>
  </div>
  <div id="ckRes" hidden></div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="head"><div class="head-l"><p class="eyebrow">How it works</p><h2 class="h2">A quick first estimate.<br><span class="acc">Checked by people.</span></h2></div>
  <p class="lead">The checker matches what you describe against a list of common features, platforms and team roles. It is a quick starting point. A person on our team then reviews your plan before any price is shared.</p></div>
  <div class="how">
    <div class="card"><span class="k">01 · READ</span><h3>It spots what you need</h3><p>Payments, bookings, maps, chat, AI, 3D, ERP modules. Each one adds typical effort, roles and tools to your plan.</p></div>
    <div class="card"><span class="k">02 · SIZE</span><h3>It sizes the build</h3><p>Your platform and stage set the timeline and team, from a lean MVP to an enterprise rollout with security reviews.</p></div>
    <div class="card"><span class="k">03 · CONFIRM</span><h3>We make it real</h3><p>On a free scoping call we turn the estimate into a fixed price, milestones and a start date.</p></div>
  </div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="head"><div class="head-l"><p class="eyebrow">FAQ</p><h2 class="h2">About the <span class="acc">checker.</span></h2></div></div>
  <div class="qa">
    <details open><summary>How accurate is the estimate?</summary><p>It is a rough first estimate based on the features you describe, so real projects can differ. A person on our team reviews it before sending a price, and we confirm a fixed price and timeline after a free scoping call.</p></details>
    <details><summary>Is my idea kept private?</summary><p>Your idea is only sent to us if you ask for your price. We use it to prepare your scoping call and never share it. We are happy to sign an NDA before you share more detail.</p></details>
    <details><summary>Why do you ask for my details?</summary><p>A price only means something once a person has checked your plan. Your details let us send you a price range on WhatsApp and follow up with a fixed quote. We never sell or share them.</p></details>
    <details><summary>My idea is unusual. Can you still build it?</summary><p>Probably. If the checker misses something, describe it on a call. We build AI agents, ERPs, mobile apps, 3D experiences and much more.</p></details>
  </div>
</div></section>

<section class="sec" style="padding-top:0"><div class="wrap">
  <div class="card cta"><div><h2>Prefer to talk it through?</h2><p>Book a free 30-minute scoping call. Bring your idea, we bring a plan.</p></div>
  <div class="row"><button class="btn btn-w" type="button" data-lead data-lead-idea="#ckIdea" data-lead-source="Idea Checker call to action">Book a scoping call →</button><a class="btn" href="services.html">See all services</a></div></div>
</div></section>
</main>

` + footerAndScripts.replace('<script>\n/* highlight the service in view', () => `<script>\n${client}</script>\n<script>\n/* highlight the service in view`)
  .replace('lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.2, syncTouch: false });', m => m + '\n    window.bcScrollTo = el => lenis.scrollTo(el, { offset: NAV_OFFSET, duration: 1.2 });')
  .replace("'.head', '.feat .card', '.svc-block',", "'.head', '.feat .card', '.svc-block', '.how .card',");
fs.writeFileSync(path.join(site, 'check.html'), page);
console.log('check.html written');
