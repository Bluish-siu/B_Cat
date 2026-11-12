# Branding Catalyst website

The company website for **Branding Catalyst Pvt Ltd**, an AI-first studio in Mumbai: AI agents, RAG, AEO and GEO, branding and growth, Android and iOS apps, ERP systems, websites and 3D web experiences.

- **Live:** https://bcat-blush.vercel.app
- **Stack:** plain HTML, CSS and JavaScript (no framework), Vercel serverless functions for the AI assistant and lead forms, Lenis for smooth scrolling, Three.js for the 3D logo.

## Project structure

```
BCAT WEBSITE/
├── api/                    Vercel serverless functions
│   ├── arc.js              ARC, the AI assistant (Claude)
│   └── lead.js             Enquiry, newsletter and job-application forms
├── public/                 The website exactly as visitors get it (Vercel serves this folder)
│   ├── index.html          Homepage (generated from src/home.html)
│   ├── services.html       Services
│   ├── scale.html          Scale & reliability (generated)
│   ├── check.html          Idea Checker (generated)
│   ├── about.html          About and founder
│   ├── careers.html        Careers and job applications
│   ├── privacy.html        Privacy policy (generated)
│   ├── terms.html          Terms of use (generated)
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
│   ├── check.cjs           Checks every page's scripts for errors (npm run check)
│   ├── serve.cjs           Local preview server (npm run dev)
│   └── legacy/             Original Services page generator, kept for reference
├── docs/
│   └── SETUP.md            ARC, leads, careers and the pre-launch checklist
├── .env.example            Environment variables to set in Vercel
├── vercel.json             Tells Vercel to serve public/
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

Open http://localhost:8080. Locally, ARC uses its built-in answers and forms open WhatsApp; the `api/` functions only run on Vercel.

## Publish

```bash
npm run build:pages
```

```bash
git add -A && git commit -m "Describe the change" && git push origin main && git push bcat main
```

- `origin` is the private repo: branding-catalyst-pvt-ltd/Branding_Catalyst
- `bcat` is the public repo Vercel deploys from: Bluish-siu/B_Cat. Vercel redeploys within a minute of the push.

## Configuration

Set these in Vercel → Project → Settings → Environment Variables (see `.env.example`):

- `ANTHROPIC_API_KEY`: turns on ARC's AI answers
- `ARC_MODEL`: optional Claude model for ARC
- `RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL`: optional, emails each lead to you

More detail, plus the list of placeholders to fill before launch, is in [docs/SETUP.md](docs/SETUP.md).
