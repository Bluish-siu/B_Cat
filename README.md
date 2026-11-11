# Branding Catalyst

Company website for Branding Catalyst: AI products, AEO and GEO, Android and iOS apps, ERP systems, websites and 3D web experiences.

It is a single static page with no build step and no backend.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole site: layout, styles and scripts |
| `logo.png` | Brand logo, also used as the browser-tab icon |
| `nova.webp` | Face image for ARC, the AI assistant in the hero |
| `api/arc.js` | Vercel function that lets ARC answer with Claude |
| `package.json` | Declares the Anthropic SDK used by `api/arc.js` |

## Run locally

Any static file server works. For example:

```bash
npx serve .
```

Then open the address it prints.

## Deploy

Upload the three files to any static host (Netlify, Vercel, GitHub Pages, Hostinger or cPanel). No build step is needed.

## Before going live

- Replace every `[X]` placeholder (client counts, stats, email, phone, social links) with real details.
- Set real timelines, roles and tech stacks in the `PRODUCTS` and `FEATURES` lists in the script. The idea checker and ARC use them to build estimates.
- Set the discount values and odds in `DISCOUNTS` (idea checker wheel).
- Confirm the guarantee terms in the "Our promise" section.
- Replace the client logo tiles with real logos, used with permission.

## ARC answers (AI chat)

ARC answers in two ways:

1. **With AI (recommended):** `api/arc.js` is a Vercel serverless function that sends the conversation to Claude and returns ARC's reply. To turn it on, open the Vercel project, go to **Settings → Environment Variables**, add `ANTHROPIC_API_KEY` (create a key at console.anthropic.com), then redeploy.
   - Optional: set `ARC_MODEL` to pick a different Claude model. The default is `claude-opus-5-5`. A smaller model such as `claude-haiku-5-5` costs less per message.
   - ARC's facts and tone live in the `SYSTEM` text at the top of `api/arc.js`. Edit it to keep answers accurate.
   - The endpoint only accepts requests from the site's own pages, and limits message length and history, but anyone visiting the site can still use it. Set a monthly spend limit in the Anthropic Console.
2. **Built-in fallback:** if the function isn't configured or fails, ARC answers from the built-in knowledge (`KNOW` list in the page script). This covers greetings, services, Catalyst Engine, AEO, GEO, RAG, pricing, timelines, guarantee, tech stack, support and ownership. It also plans any project idea with the estimator.

## Leads, WhatsApp and legal pages

- **Floating WhatsApp button** on every page opens a chat with +91 90046 29888 (edit `WA_NUMBER` at the top of `leads.js`).
- **Start a project form**: any button with `data-lead` opens it (homepage and About calls to action, the idea checker's "Book a free scoping call", and ARC's "send it to our team"). Submitting opens WhatsApp with the visitor's details pre-filled and records the lead at `api/lead.js`.
- **Where leads are recorded**: every lead appears in Vercel → your project → **Logs** (search `LEAD`). To also get each lead by email, add `RESEND_API_KEY` (free at resend.com), `LEAD_TO_EMAIL` and optionally `LEAD_FROM_EMAIL` in Vercel → Settings → Environment Variables, then redeploy.
- **Newsletter**: the footer signup records emails the same way.
- **Legal**: `privacy.html` and `terms.html` are drafts for Branding Catalyst Pvt Ltd under India's DPDP Act, 2023. Fill the highlighted items (registered address, email, grievance officer, CIN, GSTIN) and have them reviewed before launch.

## Careers page

`careers.html` lists open roles from the `JOBS` list near the bottom of the file. To post a job, copy the example in the comment above `const JOBS = [];`, fill it in, and push. Remove it when the role is filled. With no roles, the page shows "No open roles right now" and still accepts general applications.

Applications open WhatsApp with the applicant's details pre-filled and are recorded at `api/lead.js` (type `application`), the same way as project leads. Applicants can also email hr@brandingcatalyst.in (shown on the page).

## ARC lip sync

ARC's mouth position comes from the `FACE` settings in the script, measured in the image's own pixels (1024 × 1024):

- `mouthY`: the line between the lips
- `mouthW`: mouth width
- `jawBottom`: where the chin stops moving

Adjust these if you replace `nova.webp`.
