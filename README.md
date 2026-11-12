# Branding Catalyst website

The company website for **Branding Catalyst Pvt Ltd**, an AI-first studio in Mumbai: AI agents, RAG, AEO and GEO, branding and growth, Android and iOS apps, ERP systems, websites and 3D web experiences.

- **Live:** https://brandingcatalyst.in (organization Hostinger VPS; see [docs/DEPLOY-VPS.md](docs/DEPLOY-VPS.md)). Old preview: https://bcat-blush.vercel.app
- **Stack:** plain HTML, CSS and JavaScript (no framework), a small Node.js server (`server.js`) with API routes for the AI assistant and lead forms, Lenis for smooth scrolling, Three.js for the 3D logo.

## Project structure

```
BCAT WEBSITE/
├── server.js               Website server for the VPS: serves public/ and the api/ routes
├── deploy/                 VPS setup: PM2 config, Nginx site, update.sh
├── api/                    API routes (also work as Vercel functions)
│   ├── arc.js              ARC, the AI assistant (Claude)
│   └── lead.js             Enquiry, newsletter and job-application forms
├── public/                 The website exactly as visitors get it (server.js serves this folder)
│   ├── index.html          Homepage (generated from src/home.html)
│   ├── services.html       Services
│   ├── scale.html          Scale & reliability (generated)
│   ├── check.html          Idea Checker (generated)
│   ├── about.html          About and founder
│   ├── careers.html        Careers and job applications
│   ├── privacy.html        Privacy policy (generated)
│   ├── terms.html          Terms of use (generated)
│   ├── sitemap.xml, robots.txt, llms.txt, site.webmanifest  (generated, for search engines and AI)
│   ├── og-image.jpg, favicon-32.png, apple-touch-icon.png, icon-192/512.png  (share image and icons)
│   ├── fx.js               Logo intro, cursor, 3D logo, Brand Lab
│   ├── leads.js            WhatsApp button and the "Start a project" form
│   └── logo.png, nova.webp, founder.webp
├── src/                    Sources for generated pages
│   ├── home.html           Homepage source (styles + content + scripts)
│   └── check-client.js     Idea Checker page logic
├── scripts/                Build and dev tools
│   ├── build.cjs           Builds every generated page (npm run build:pages)
│   ├── build-scale.cjs     → public/scale.html
│   ├── build-check.cjs     → public/check.html
│   ├── build-legal.cjs     → public/privacy.html, public/terms.html
│   ├── build-seo.cjs       Titles, share tags, structured data, sitemap, robots.txt, llms.txt
│   ├── brand-images.cjs    Redraws the share image and icons (see the file for how)
│   ├── check.cjs           Checks every page's scripts for errors (npm run check)
│   ├── serve.cjs           Local preview server (npm run dev)
│   └── legacy/             Original Services page generator, kept for reference
├── docs/
│   ├── SETUP.md            Leads, tracking, ads, ARC, careers and the go-live checklist
│   ├── DEPLOY-VPS.md       Step-by-step VPS deployment
│   └── leads-sheet.gs      Google Apps Script for the leads Google Sheet
├── .env.example            Settings template: copy to .env on the server
├── vercel.json             Only for the old Vercel preview
└── package.json
```

## Which file do I edit?

| To change | Edit | Then |
|---|---|---|
| Homepage | `src/home.html` | `npm run build:pages` |
| Services, About, Careers | `public/services.html`, `public/about.html`, `public/careers.html` | `npm run build:pages` after editing Services (Scale and Idea Checker reuse its header and footer) |
| Scale page text | `scripts/build-scale.cjs` | `npm run build:pages` |
| Idea Checker page | `scripts/build-check.cjs` (layout) or `src/check-client.js` (logic and prices) | `npm run build:pages` |
| Privacy and Terms | `scripts/build-legal.cjs` | `npm run build:pages` |
| Page titles, descriptions, company facts for Google and AI | `scripts/build-seo.cjs` | `npm run build:pages` |
| WhatsApp number, lead form | `public/leads.js` | nothing |
| ARC's knowledge and tone | `api/arc.js` (`SYSTEM` text) | nothing |

Don't edit `public/index.html`, `scale.html`, `check.html`, `privacy.html` or `terms.html` directly: the next build overwrites them.

## Run it locally

Requires Node.js 18 or newer.

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:8080. The API routes run locally too: with a `.env` file (copy `.env.example`) ARC uses Claude and leads are emailed; without one, ARC uses its built-in answers.

## Publish

```bash
npm run build:pages
```

```bash
git add -A && git commit -m "Describe the change" && git push origin main
```

Then on the VPS: `cd /var/www/brandingcatalyst && bash deploy/update.sh` (see [docs/DEPLOY-VPS.md](docs/DEPLOY-VPS.md)).

- `origin` is the organization repo: branding-catalyst-pvt-ltd/Branding_Catalyst
- `bcat` (Bluish-siu/B_Cat, personal) only feeds the old Vercel preview and is being retired.

## SEO

Every build adds search and sharing data to all pages: keyword titles and descriptions, canonical URLs, Open Graph and Twitter share cards (`og-image.jpg`), and JSON-LD structured data (company, founder, services, FAQs, breadcrumbs). It also writes `sitemap.xml`, `robots.txt` (search engines and AI crawlers allowed, `/api` blocked) and `llms.txt` (a plain summary for AI assistants).

When the site moves to its own domain, change `SITE_URL` at the top of `scripts/build-seo.cjs` and run `npm run build:pages`.

## Configuration

Settings live in a `.env` file on the server (template: `.env.example`; never commit `.env`):

- `ANTHROPIC_API_KEY`: ARC's AI answers and lead cards (`ARC_MODEL` optional)
- `SMTP_USER`, `SMTP_PASS`: Hostinger mailbox that emails each lead (`LEAD_TO_EMAIL`, `HR_EMAIL` optional)
- `LEADS_SHEET_URL`, `LEADS_SHEET_SECRET`: the leads Google Sheet

More detail, plus the list of placeholders to fill before launch, is in [docs/SETUP.md](docs/SETUP.md).
