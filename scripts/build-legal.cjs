// Builds privacy.html and terms.html in the site's style.
const fs = require('fs'), path = require('path');
const out = process.argv[2];
const UPDATED = '11 November 2026';
const shell = (title, desc, active, body) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title} | Branding Catalyst</title>
<script>try{if(!sessionStorage.getItem('bcIntro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('intro-pending')}catch(e){}</script>
<style>
@view-transition{navigation:auto}
::view-transition-old(root){animation:vt-out .32s cubic-bezier(.4,0,.2,1) both}
::view-transition-new(root){animation:vt-in .5s cubic-bezier(.2,.7,.2,1) both}
@keyframes vt-out{to{opacity:0;transform:translateY(-12px)}}
@keyframes vt-in{from{opacity:0;transform:translateY(20px)}}
header .logo{view-transition-name:brand-logo}
html.intro-pending::after{content:"";position:fixed;inset:0;z-index:9999;background:#0d0716;animation:introFailsafe .4s 3s forwards}
@keyframes introFailsafe{to{opacity:0;visibility:hidden}}
@media(prefers-reduced-motion:reduce){::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none!important}}
</style>

<meta name="description" content="${desc}">
<link rel="icon" href="logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap">
<style>
:root{color-scheme:dark;--bg:#0d0716;--bg2:#130b1f;--surface:#1b1129;--line:rgba(201,162,255,.10);--line2:rgba(201,162,255,.19);--ink:#f1edf7;--muted:#a79fbb;--dim:#716885;--accent:#c9a2ff;--brand:#42066b;--f-display:"Lexend","Helvetica Neue",Arial,system-ui,sans-serif;--f-body:"Geist",system-ui,-apple-system,"Segoe UI",sans-serif;--f-mono:"Geist Mono",ui-monospace,Consolas,monospace}
*{box-sizing:border-box}[hidden]{display:none!important}
html{scroll-behavior:smooth;overflow-x:clip}
body{margin:0;background:radial-gradient(60% 40% at 80% 0%,rgba(66,6,107,.55),transparent 70%),var(--bg);color:var(--ink);font-family:var(--f-body);font-size:16.5px;line-height:1.7;-webkit-font-smoothing:antialiased}
a{color:var(--accent)}
:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:6px}
.wrap{max-width:860px;margin-inline:auto;padding-left:max(20px,env(safe-area-inset-left,0px));padding-right:max(20px,env(safe-area-inset-right,0px))}
.top{position:sticky;top:0;z-index:50;background:rgba(13,7,22,.94);border-bottom:1px solid var(--line)}
.top .wrap{max-width:1200px;height:66px;display:flex;align-items:center;justify-content:space-between;gap:16px}
.logo{display:flex;align-items:center;gap:10px;text-decoration:none}
.logo svg{width:28px;height:29px}
.wm{font-family:"Lexend",var(--f-display);font-size:19px;letter-spacing:-.02em;line-height:1}.wm b{font-weight:600;color:#fff}.wm em{font-style:normal;font-weight:300;color:var(--accent)}
.top nav{display:flex;gap:18px;font-size:14.5px}.top nav a{color:var(--muted);text-decoration:none}.top nav a:hover,.top nav a[aria-current]{color:var(--ink)}
main{padding-block:56px 80px}
.eyebrow{font-family:var(--f-mono);font-size:11.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)}
h1{font-family:var(--f-display);font-weight:600;font-size:clamp(34px,5vw,52px);letter-spacing:-.03em;line-height:1.08;margin:12px 0 10px}
.meta{color:var(--dim);font-size:14px;margin:0 0 28px}
.note{border:1px dashed rgba(201,162,255,.4);border-radius:14px;padding:14px 16px;color:var(--muted);font-size:14.5px;margin-bottom:28px}
h2{font-family:var(--f-display);font-weight:500;font-size:22px;letter-spacing:-.01em;margin:36px 0 8px}
p,li{color:#d9d3e6}
ul{padding-left:20px}
li{margin:4px 0}
.ph{color:var(--accent);border-bottom:1px dashed var(--accent)}
.toc{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 8px;padding:0;list-style:none}
.toc a{display:inline-block;font-size:13px;padding:5px 11px;border-radius:99px;border:1px solid var(--line2);color:var(--muted);text-decoration:none}
footer{border-top:1px solid var(--line);padding-block:28px;color:var(--dim);font-size:13.5px}
footer .wrap{max-width:1200px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px}
footer a{color:var(--muted)}
@media(max-width:560px){.top nav{display:none}}
</style>
</head>
<body>
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<mask id="bcCut" maskUnits="userSpaceOnUse" x="0" y="0" width="96" height="100"><rect width="96" height="100" fill="#fff"/><circle cx="46" cy="50" r="20" fill="#000"/><rect x="46" y="41.5" width="40" height="17" fill="#000"/><rect x="70" y="36.5" width="6" height="5" fill="#000"/><circle cx="70" cy="36.5" r="5" fill="#fff"/><rect x="70" y="58.5" width="6" height="5" fill="#000"/><circle cx="70" cy="63.5" r="5" fill="#fff"/><rect x="64" y="38.5" width="3.2" height="3" fill="#000"/><circle cx="67.2" cy="38.5" r="3" fill="#fff"/><rect x="64" y="58.5" width="3.2" height="3" fill="#000"/><circle cx="67.2" cy="61.5" r="3" fill="#fff"/></mask>
<symbol id="bcMark" viewBox="0 0 96 100"><path d="M14 8H41A34 34 0 0 1 75 42V58A34 34 0 0 1 41 92H14Q6 92 6 84V16Q6 8 14 8Z" fill="#fff" mask="url(#bcCut)"/><circle cx="85" cy="50" r="7" fill="#c9a2ff"/></symbol></defs></svg>
<header class="top"><div class="wrap">
  <a class="logo" href="index.html" aria-label="Branding Catalyst home"><svg viewBox="0 0 96 100" aria-hidden="true"><use href="#bcMark"/></svg><span class="wm"><b>Branding</b><em>Catalyst</em></span></a>
  <nav aria-label="Main"><a href="index.html">Home</a><a href="services.html">Services</a><a href="scale.html">Scale</a><a href="check.html">Idea Checker</a><a href="about.html">About</a><a href="careers.html">Careers</a><a href="privacy.html"${active === 'privacy' ? ' aria-current="page"' : ''}>Privacy</a><a href="terms.html"${active === 'terms' ? ' aria-current="page"' : ''}>Terms</a></nav>
</div></header>
<main class="wrap">
${body}
</main>
<footer><div class="wrap"><span>© 2026 Branding Catalyst Pvt Ltd · Mumbai, India</span><span><a href="index.html">Home</a> · <a href="services.html">Services</a> · <a href="scale.html">Scale</a> · <a href="check.html">Idea Checker</a> · <a href="careers.html">Careers</a> · <a href="privacy.html">Privacy Policy</a> · <a href="terms.html">Terms of Use</a></span></div></footer>
<script src="leads.js" defer></script>
<script src="fx.js" defer></script>
</body>
</html>
`;

const NOTE = `<p class="note">This page is a starting draft written for Branding Catalyst Pvt Ltd. Replace the highlighted items and have it reviewed by your legal advisor before relying on it.</p>`;
const CONTACT = `Branding Catalyst Pvt Ltd, <span class="ph">[registered office address]</span>, Mumbai, Maharashtra, India · Email: <span class="ph">[privacy email, e.g. hello@yourdomain]</span> · Phone / WhatsApp: +91 90046 29888`;

const privacy = shell('Privacy Policy', 'How Branding Catalyst Pvt Ltd collects, uses and protects personal data shared through this website, forms, WhatsApp and ARC.', 'privacy', `
<p class="eyebrow">Legal</p>
<h1>Privacy Policy</h1>
<p class="meta">Last updated: ${UPDATED}</p>
${NOTE}
<p>This policy explains what personal data Branding Catalyst Pvt Ltd ("Branding Catalyst", "we", "us") collects when you use this website, how we use it, and the choices you have. We process personal data in line with India's Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000.</p>

<h2>1. What we collect</h2>
<ul>
  <li><b>Details you give us:</b> your name, phone or WhatsApp number, email address, the service you are interested in, budget range and a description of your idea, when you use the "Start a project" form, the idea checker or the newsletter signup.</li>
  <li><b>Job applications:</b> your name, email, phone, the role you apply for, links to your CV or portfolio and any note you add, when you use the form on our Careers page.</li>
  <li><b>Conversations with ARC:</b> the messages you type to ARC, our website assistant, so it can reply. If you use voice, speech is produced by your own browser; we do not record audio.</li>
  <li><b>WhatsApp messages:</b> when you choose to message us on WhatsApp, we receive what you send there. WhatsApp's own privacy policy also applies.</li>
  <li><b>Technical data:</b> basic information our hosting provider records automatically, such as your IP address, browser type and the pages you request, used for security and to keep the site running.</li>
</ul>
<p>We do not ask for payment details, government ID numbers or passwords on this website.</p>

<h2>2. How we use it</h2>
<ul>
  <li>To reply to your enquiry, prepare an estimate and arrange a scoping call.</li>
  <li>To consider your job application and contact you about it or about future openings.</li>
  <li>To send occasional updates you asked for through the newsletter. You can unsubscribe at any time.</li>
  <li>To answer your questions through ARC.</li>
  <li>To keep the website secure, fix problems and understand how it is used.</li>
</ul>
<p>We process this data with your consent, which you give when you submit a form or start a chat, and to take steps you request before entering into a contract with us.</p>

<h2>3. Who we share it with</h2>
<p>We do not sell your personal data. We share it only with service providers that help us run this website and respond to you, under appropriate safeguards:</p>
<ul>
  <li><b>Website hosting</b> (Vercel), which stores form submissions in its logs and serves the site.</li>
  <li><b>AI provider</b> (Anthropic), if ARC's AI answers are switched on: your chat messages are sent to generate a reply.</li>
  <li><b>Email delivery</b> (for example Resend), if enabled, to forward your enquiry to our team.</li>
  <li><b>WhatsApp</b> (Meta), when you choose to contact us there.</li>
</ul>
<p>Some of these providers may process data outside India. We may also disclose data where required by law.</p>

<h2>4. How long we keep it</h2>
<p>We keep enquiry details for as long as needed to respond and, if we work together, for the duration of the project and any period required by law (for example tax and accounting rules). Newsletter details are kept until you unsubscribe. Job applications are kept for up to 12 months so we can consider you for future roles, unless you ask us to delete them sooner. We then delete or anonymise the data. <span class="ph">[Confirm your retention periods.]</span></p>

<h2>5. Your rights</h2>
<p>Under the Digital Personal Data Protection Act, 2023 you can:</p>
<ul>
  <li>ask what personal data we hold about you and how we use it;</li>
  <li>ask us to correct, complete, update or erase it;</li>
  <li>withdraw your consent at any time (this does not affect processing already carried out);</li>
  <li>nominate another person to exercise your rights in case of death or incapacity;</li>
  <li>raise a grievance with us, and if unresolved, with the Data Protection Board of India.</li>
</ul>
<p>To use any of these rights, contact us using the details below. We will respond within a reasonable time.</p>

<h2>6. Cookies and storage</h2>
<p>This website does not use advertising or tracking cookies. It loads fonts from Google Fonts and a scrolling library from a public CDN, which may receive your IP address when delivering those files. <span class="ph">[Update this section if you add analytics.]</span></p>

<h2>7. Security</h2>
<p>We use reasonable technical and organisational measures to protect personal data, including encrypted connections (HTTPS) and limited access to enquiries. No method of transmission over the internet is completely secure.</p>

<h2>8. Children</h2>
<p>This website is meant for businesses and adults. We do not knowingly collect personal data from children under 18.</p>

<h2>9. Changes</h2>
<p>We may update this policy from time to time. The "last updated" date above shows when it last changed.</p>

<h2>10. Contact and grievance officer</h2>
<p>For privacy questions, requests or complaints, contact our grievance officer: <span class="ph">[name of grievance officer]</span>, ${CONTACT}.</p>
`);

const terms = shell('Terms of Use', 'Terms for using the Branding Catalyst website, ARC assistant, idea checker and estimates.', 'terms', `
<p class="eyebrow">Legal</p>
<h1>Terms of Use</h1>
<p class="meta">Last updated: ${UPDATED}</p>
${NOTE}
<p>These terms apply to your use of this website, operated by Branding Catalyst Pvt Ltd ("Branding Catalyst", "we", "us"). By using the website you agree to them. If you do not agree, please do not use the website.</p>

<h2>1. About this website</h2>
<p>The website describes our services in branding, AI, mobile apps, ERP systems, websites and 3D web experiences, and lets you contact us, use our idea checker and chat with ARC, our website assistant.</p>

<h2>2. Estimates, ARC and the idea checker are indicative</h2>
<ul>
  <li>Timelines, team sizes, technology suggestions, feasibility scores and price ranges shown by ARC or the idea checker are <b>general guidance only</b>. They are not a quotation, offer or commitment.</li>
  <li>ARC is an automated assistant and can make mistakes. Please confirm anything important with our team.</li>
  <li>The AI visibility check and the traffic simulation on the website are illustrations, not measurements of your business.</li>
</ul>

<h2>3. Projects are governed by a signed agreement</h2>
<p>Scope, price, timeline, milestones, payment terms, ownership of deliverables and any guarantee or refund apply only as set out in a written proposal or contract signed by both parties. If those documents differ from anything on this website, the signed documents prevail.</p>

<h2>4. Acceptable use</h2>
<p>You agree not to misuse the website, including by trying to gain unauthorised access, disrupting its operation, sending spam or automated requests, or submitting unlawful, harmful or misleading content through our forms or ARC.</p>

<h2>5. Intellectual property</h2>
<p>The website's design, text, graphics, the Branding Catalyst name and logo, ARC and Catalyst Engine belong to Branding Catalyst or its licensors. You may view and share pages for personal or internal business use, but you may not copy, modify or republish them for commercial purposes without our written permission. Third-party names and trademarks mentioned belong to their owners.</p>

<h2>6. Your submissions</h2>
<p>Ideas and information you share with us through the website are treated as confidential business enquiries and used to respond to you, as described in our <a href="privacy.html">Privacy Policy</a>. If you need a non-disclosure agreement before sharing details, ask us and we will sign one.</p>

<h2>7. Third-party links and services</h2>
<p>The website links to services we do not control, such as WhatsApp, LinkedIn, Instagram and YouTube. Their own terms and policies apply.</p>

<h2>8. Disclaimer and limitation of liability</h2>
<p>The website is provided "as is". We try to keep it accurate and available but do not guarantee that it will be error-free or uninterrupted. To the extent permitted by law, Branding Catalyst is not liable for any indirect or consequential loss arising from your use of the website or reliance on its content.</p>

<h2>9. Governing law</h2>
<p>These terms are governed by the laws of India. Courts in Mumbai, Maharashtra have exclusive jurisdiction over any dispute relating to them.</p>

<h2>10. Changes and contact</h2>
<p>We may update these terms from time to time; the "last updated" date shows the latest version. Questions? Contact ${CONTACT}.</p>
<p class="meta">Company details: Branding Catalyst Pvt Ltd · CIN <span class="ph">[CIN]</span> · GSTIN <span class="ph">[GSTIN]</span></p>
`);

fs.writeFileSync(path.join(out, 'privacy.html'), privacy);
fs.writeFileSync(path.join(out, 'terms.html'), terms);
console.log('privacy.html and terms.html written');
