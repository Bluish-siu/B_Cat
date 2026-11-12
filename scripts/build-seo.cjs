// SEO for every page in public/, plus sitemap.xml, robots.txt, llms.txt and site.webmanifest.
// Adds to each page: a search-friendly <title> and description, canonical URL, Open Graph and
// Twitter share tags, icons, and JSON-LD structured data (organisation, website, page, breadcrumbs,
// FAQs read from the page, services, founder). Safe to run any number of times.
// Run as part of: npm run build:pages
//
// EDIT: when the site moves to its own domain, change SITE_URL (or set the SITE_URL environment variable).
const SITE_URL = (process.env.SITE_URL || 'https://bcat-blush.vercel.app').replace(/\/$/, '');

const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const root = path.join(__dirname, '..'), pub = path.join(root, 'public');

// ---------- company facts (used in structured data and llms.txt) ----------
const ORG = {
  name: 'Branding Catalyst',
  legalName: 'Branding Catalyst Pvt Ltd',
  description: 'AI-first product and growth studio in Mumbai, India. We build AI agents, RAG chatbots, AI content, AEO and GEO (AI search visibility), brand identities, Android and iOS apps, ERP systems, websites and 3D web experiences.',
  foundingDate: '2019',
  phone: '+91-90046-29888',
  email: 'hello@brandingcatalyst.in',
  hrEmail: 'hr@brandingcatalyst.in',
  city: 'Mumbai', region: 'Maharashtra', country: 'IN',
  founder: { name: 'Abhishek Trivedi', jobTitle: 'Founder', url: 'https://www.linkedin.com/in/abhishek-r-trivedi/' },
  sameAs: ['https://www.instagram.com/branding_catalyst', 'https://in.linkedin.com/company/branding-cataly', 'https://www.youtube.com/@brandingcatalyst'],
  knowsAbout: ['Artificial intelligence', 'AI agents', 'Retrieval-augmented generation (RAG)', 'Answer engine optimization (AEO)', 'Generative engine optimization (GEO)', 'Branding', 'Mobile app development', 'ERP software', 'Web development', 'WebGL and 3D web']
};

// ---------- per-page titles, descriptions and sitemap settings ----------
const PAGES = {
  'index.html':    { url: '/', priority: '1.0', freq: 'weekly', title: 'Branding Catalyst | AI-First App, ERP & Web Studio in Mumbai', description: 'AI-first studio in Mumbai building AI agents, chatbots, Android and iOS apps, ERP systems, websites and 3D web, plus AEO and GEO so you get found in AI search.' },
  'services.html': { url: '/services.html', priority: '0.9', freq: 'monthly', crumb: 'Services', type: 'CollectionPage', title: 'AI, App, ERP & Website Development Services | Branding Catalyst' },
  'check.html':    { url: '/check.html', priority: '0.8', freq: 'monthly', crumb: 'Idea Checker', title: 'Free App Idea Checker: Cost, Timeline & Team | Branding Catalyst' },
  'scale.html':    { url: '/scale.html', priority: '0.7', freq: 'monthly', crumb: 'Scale', title: 'Scalable Apps & Cloud Engineering for Peak Traffic | Branding Catalyst' },
  'about.html':    { url: '/about.html', priority: '0.7', freq: 'monthly', crumb: 'About', type: 'AboutPage', title: 'About Branding Catalyst | AI-First Studio in Mumbai Since 2019' },
  'careers.html':  { url: '/careers.html', priority: '0.5', freq: 'weekly', crumb: 'Careers', title: 'Careers at Branding Catalyst | Tech & Design Jobs in Mumbai' },
  'privacy.html':  { url: '/privacy.html', priority: '0.2', freq: 'yearly', crumb: 'Privacy Policy' },
  'terms.html':    { url: '/terms.html', priority: '0.2', freq: 'yearly', crumb: 'Terms of Use' }
};

// ---------- helpers ----------
const decode = s => s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/gi, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&rsquo;|&lsquo;/g, '’').replace(/&rarr;/g, '→').replace(/\s+/g, ' ').trim();
const attr = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const abs = p => SITE_URL + p;
const today = new Date().toISOString().slice(0, 10);
const lastmod = f => { try { return execFileSync('git', ['log', '-1', '--format=%cs', '--', 'public/' + f], { cwd: root }).toString().trim() || today; } catch { return today; } };

const orgId = abs('/#org'), siteId = abs('/#website'), founderId = abs('/#founder');
const orgNode = {
  '@type': ['Organization', 'ProfessionalService'], '@id': orgId,
  name: ORG.name, legalName: ORG.legalName, url: abs('/'), description: ORG.description,
  logo: { '@type': 'ImageObject', url: abs('/icon-512.png'), width: 512, height: 512 },
  image: abs('/og-image.jpg'), foundingDate: ORG.foundingDate, founder: { '@id': founderId },
  telephone: ORG.phone, email: ORG.email,
  address: { '@type': 'PostalAddress', addressLocality: ORG.city, addressRegion: ORG.region, addressCountry: ORG.country },
  areaServed: [{ '@type': 'Country', name: 'India' }, 'Worldwide'],
  contactPoint: [
    { '@type': 'ContactPoint', contactType: 'sales', telephone: ORG.phone, email: ORG.email, availableLanguage: ['English', 'Hindi'] },
    { '@type': 'ContactPoint', contactType: 'human resources', email: ORG.hrEmail }
  ],
  sameAs: ORG.sameAs, knowsAbout: ORG.knowsAbout
};
const founderNode = { '@type': 'Person', '@id': founderId, name: ORG.founder.name, jobTitle: ORG.founder.jobTitle, url: ORG.founder.url, sameAs: [ORG.founder.url], worksFor: { '@id': orgId } };
const siteNode = { '@type': 'WebSite', '@id': siteId, url: abs('/'), name: ORG.name, publisher: { '@id': orgId }, inLanguage: 'en-IN' };

// FAQs as shown on the page: <details><summary>Q</summary><p>A</p></details> inside .qa
function faqs(html) {
  const i = html.indexOf('class="qa"'); if (i < 0) return [];
  const end = html.indexOf('</section>', i), block = html.slice(i, end < 0 ? undefined : end);
  return [...block.matchAll(/<details[^>]*>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>\s*<\/details>/g)].map(m => ({ q: decode(m[1]), a: decode(m[2]) }));
}
// Services as listed on the Services page
function services(html) {
  return [...html.matchAll(/<article class="svc-block" id="([^"]+)"[\s\S]*?<h3>([\s\S]*?)<\/h3>\s*<p class="sb-lead">([\s\S]*?)<\/p>/g)]
    .map(m => ({ id: m[1], name: decode(m[2]), desc: decode(m[3]) }));
}

const found = { services: [] };
const files = fs.readdirSync(pub).filter(f => f.endsWith('.html'));
for (const f of files) {
  const cfg = PAGES[f]; if (!cfg) { console.warn('seo: no settings for', f); continue; }
  let html = fs.readFileSync(path.join(pub, f), 'utf8');
  html = html.replace(/\n?<!-- seo:start -->[\s\S]*?<!-- seo:end -->/, '');
  // title + description
  if (cfg.title) html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${attr(cfg.title)}</title>`);
  const title = decode((html.match(/<title>([\s\S]*?)<\/title>/) || [, ORG.name])[1]);
  if (cfg.description) html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${attr(cfg.description)}">`);
  const description = decode((html.match(/<meta name="description" content="([^"]*)">/) || [, ORG.description])[1]);
  const url = abs(cfg.url);

  // structured data
  const pageNode = { '@type': cfg.type || 'WebPage', '@id': url + '#webpage', url, name: title, description, isPartOf: { '@id': siteId }, about: { '@id': orgId }, inLanguage: 'en-IN', primaryImageOfPage: abs('/og-image.jpg') };
  const graph = [orgNode, siteNode, pageNode];
  if (f === 'index.html' || f === 'about.html') graph.push(founderNode);
  if (cfg.crumb) {
    graph.push({ '@type': 'BreadcrumbList', '@id': url + '#breadcrumb', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: abs('/') },
      { '@type': 'ListItem', position: 2, name: cfg.crumb, item: url }] });
    pageNode.breadcrumb = { '@id': url + '#breadcrumb' };
  }
  const qa = faqs(html);
  if (qa.length) graph.push({ '@type': 'FAQPage', '@id': url + '#faq', isPartOf: { '@id': url + '#webpage' }, mainEntity: qa.map(x => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } })) });
  if (f === 'services.html') {
    found.services = services(html);
    graph.push({ '@type': 'ItemList', '@id': url + '#services', name: 'Branding Catalyst services', itemListElement: found.services.map((s, i) => ({
      '@type': 'ListItem', position: i + 1,
      item: { '@type': 'Service', '@id': `${url}#${s.id}`, name: s.name, description: s.desc, url: `${url}#${s.id}`, provider: { '@id': orgId }, areaServed: { '@type': 'Country', name: 'India' } } })) });
    pageNode.mainEntity = { '@id': url + '#services' };
  }
  if (f === 'check.html') graph.push({ '@type': 'WebApplication', '@id': url + '#app', name: 'Branding Catalyst Idea Checker', url, applicationCategory: 'BusinessApplication', operatingSystem: 'Any (web browser)', description: 'Free tool that estimates feasibility, timeline, team, tech stack and roadmap for an app, website, ERP or AI idea.', offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' }, provider: { '@id': orgId } });
  if (f === 'about.html') pageNode.mainEntity = { '@id': orgId };

  const ogTitle = title.replace(/\s*\|\s*Branding Catalyst$/, '') || title;
  const block = `<!-- seo:start -->
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta name="theme-color" content="#0d0716">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Branding Catalyst">
<meta property="og:locale" content="en_IN">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${attr(ogTitle)}">
<meta property="og:description" content="${attr(description)}">
<meta property="og:image" content="${abs('/og-image.jpg')}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Branding Catalyst: Ideas in. Impact out. AI-first studio in Mumbai.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${attr(ogTitle)}">
<meta name="twitter:description" content="${attr(description)}">
<meta name="twitter:image" content="${abs('/og-image.jpg')}">
<link rel="icon" href="favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>
<!-- seo:end -->`;
  html = html.replace(/<link rel="icon" href="logo.png">\n?/, '');
  html = html.replace('</head>', block + '\n</head>');
  fs.writeFileSync(path.join(pub, f), html);
  console.log(`seo: ${f} (${graph.length} schema items${qa.length ? `, ${qa.length} FAQs` : ''})`);
}

// ---------- sitemap.xml ----------
const sm = Object.entries(PAGES).filter(([f]) => files.includes(f)).map(([f, c]) =>
  `  <url>\n    <loc>${abs(c.url)}</loc>\n    <lastmod>${lastmod(f)}</lastmod>\n    <changefreq>${c.freq}</changefreq>\n    <priority>${c.priority}</priority>\n  </url>`).join('\n');
fs.writeFileSync(path.join(pub, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sm}\n</urlset>\n`);

// ---------- robots.txt: everyone welcome, including AI search crawlers; keep out of the API ----------
const BOTS = ['*', 'Googlebot', 'Bingbot', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Claude-SearchBot', 'Google-Extended', 'Applebot-Extended'];
fs.writeFileSync(path.join(pub, 'robots.txt'), `# Branding Catalyst: search engines and AI assistants are welcome to read and cite this site.
${BOTS.map(b => 'User-agent: ' + b).join('\n')}
Allow: /
Disallow: /api/

Sitemap: ${abs('/sitemap.xml')}
`);

// ---------- llms.txt: a plain summary for AI assistants (llmstxt.org) ----------
fs.writeFileSync(path.join(pub, 'llms.txt'), `# ${ORG.name}

> ${ORG.description}

${ORG.legalName} was founded in ${ORG.foundingDate} by ${ORG.founder.name} and is based in ${ORG.city}, India. Projects are planned with Catalyst Engine, our AI-assisted build system, and ARC, the assistant on our homepage, gives instant first estimates.

## Services
${found.services.map(s => `- [${s.name}](${abs('/services.html#' + s.id)}): ${s.desc}`).join('\n')}

## Key pages
- [Home](${abs('/')}): overview, Catalyst Engine, AI visibility demo, idea lab and FAQ
- [Services](${abs('/services.html')}): every service, what you get, timelines and engagement models
- [Idea Checker](${abs('/check.html')}): free estimate of feasibility, timeline, team and stack for an idea
- [Scale](${abs('/scale.html')}): how we build apps and platforms that stay fast at peak traffic
- [About](${abs('/about.html')}): our story, founder, principles and tools
- [Careers](${abs('/careers.html')}): open roles and how to apply

## Contact
- Email: ${ORG.email}
- WhatsApp / phone: ${ORG.phone}
- Careers: ${ORG.hrEmail}
- Instagram: ${ORG.sameAs[0]}
- LinkedIn: ${ORG.sameAs[1]}
- YouTube: ${ORG.sameAs[2]}
`);

// ---------- web app manifest (home-screen icon on phones) ----------
fs.writeFileSync(path.join(pub, 'site.webmanifest'), JSON.stringify({
  name: ORG.name, short_name: ORG.name, start_url: '/', display: 'browser', background_color: '#0d0716', theme_color: '#0d0716',
  icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }]
}, null, 2) + '\n');
console.log(`seo: sitemap.xml, robots.txt, llms.txt, site.webmanifest written for ${SITE_URL}`);
