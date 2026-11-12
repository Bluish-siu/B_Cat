# Setup and content guide

How to configure the live features (leads, tracking, ads, ARC, careers) and what to fill in before launch. For the project layout and commands, see the README in the project folder. All settings ("environment variables") go in the `.env` file on the VPS (see [DEPLOY-VPS.md](DEPLOY-VPS.md)); after changing it run `pm2 reload bcat-website --update-env`.

## Go-live checklist (lead generation)

| # | Step | Who | Section |
|---|---|---|---|
| 1 | Put the site on the Hostinger VPS and connect brandingcatalyst.in | You (with DEPLOY-VPS.md) | [Domain](#domain-brandingcatalystin) |
| 2 | Lead emails from Hostinger | You (5 min) | [Lead email](#lead-email-hostinger-smtp) |
| 3 | Leads Google Sheet | You (5 min) | [Leads Google Sheet](#leads-google-sheet) |
| 4 | Anthropic key for ARC (AI answers + lead cards) | You | [ARC](#arc-ai-chat-and-lead-capture) |
| 5 | Google Analytics + Google Ads tag IDs | You → send to developer | [Tracking](#tracking-google-analytics-google-ads-meta) |
| 6 | Google Search Console + Google Business Profile | You | [Domain](#domain-brandingcatalystin) |
| 7 | Legal details (address, CIN, GSTIN, grievance officer, retention) | You → developer | [Legal](#leads-whatsapp-and-legal-pages) |
| 8 | Start ads on the landing pages | You | [Ad landing pages](#ad-landing-pages) |

## Domain (brandingcatalyst.in)

1. Follow [DEPLOY-VPS.md](DEPLOY-VPS.md): it sets up the organization's Hostinger VPS, points the domain's `A` record at the VPS, and adds free HTTPS.
2. **Do not change** the `MX`, `TXT` (SPF, DKIM, DMARC) or `mail` records in Hostinger DNS. They run your hello@ and hr@ email.
3. Once https://brandingcatalyst.in loads, remove the project from the personal Vercel account (or point it to the new domain) so there is one address.
4. Tell the developer: `SITE_URL` in `scripts/build-seo.cjs` changes to `https://brandingcatalyst.in`, which updates canonical links, the sitemap, share tags and structured data on every page.
5. **Google Search Console** (search.google.com/search-console): add a *Domain* property for brandingcatalyst.in, verify it with the TXT record Google gives you (add it in Hostinger DNS), then submit `https://brandingcatalyst.in/sitemap.xml`.
6. **Google Business Profile** (business.google.com): create the Branding Catalyst profile in Mumbai with the website, phone and hours, so you appear on Google Maps and in "near me" searches.

## Lead email (Hostinger SMTP)

Every lead (forms, landing pages, Idea Checker, ARC chats, newsletter) is emailed by `api/lead.js`. Job applications go to HR.

1. Hostinger hPanel → **Emails** → create the `hello@brandingcatalyst.in` mailbox (it both sends and receives lead emails; a separate `website@` mailbox also works).
2. Add these lines to the `.env` file on the VPS, then run `pm2 reload bcat-website --update-env`:

| Name | Value |
|---|---|
| `SMTP_USER` | `hello@brandingcatalyst.in` |
| `SMTP_PASS` | that mailbox's password |
| `LEAD_TO_EMAIL` | `hello@brandingcatalyst.in` (where leads arrive; this is also the default) |
| `HR_EMAIL` | `hr@brandingcatalyst.in` (default) |

`SMTP_HOST` (default `smtp.hostinger.com`) and `SMTP_PORT` (default `465`) only need setting if Hostinger tells you otherwise. Resend works as an alternative: set `RESEND_API_KEY` and `LEAD_FROM_EMAIL` instead of the SMTP values.

Each email shows the lead's details, a one-tap "Reply on WhatsApp" link, the ARC chat and AI lead card (for chat leads), and which ad, campaign and keyword brought the visitor.

## Leads Google Sheet

A shared list of every lead with a **Status** column for follow-up (New → Contacted → Call booked → Quote sent → Won / Lost).

1. Create a Google Sheet called "Website Leads" (with the company Google account).
2. **Extensions → Apps Script**, delete what is there, and paste all of `docs/leads-sheet.gs`.
3. In the script, change `SECRET` to a long random phrase. Save.
4. **Deploy → New deployment → Web app**. Execute as: **Me**. Who has access: **Anyone**. Deploy, allow access, copy the **Web app URL**.
5. Add `LEADS_SHEET_URL` (the URL) and `LEADS_SHEET_SECRET` (the same phrase) to `.env` on the VPS, then run `pm2 reload bcat-website --update-env`.

Job applications are not added to the Sheet; they go to HR by email only.

## Tracking (Google Analytics, Google Ads, Meta)

`public/track.js` runs on every page. While its IDs are empty it loads nothing and shows no cookie banner; it only remembers how a visitor arrived (ad campaign tags and click IDs) and attaches that to their lead.

To switch tracking on, edit the IDs at the top of `public/track.js` and push:

- `GA4_ID`: Google Analytics → Admin → Data streams → your web stream → Measurement ID (`G-…`).
- `ADS_ID` and `ADS_LABELS`: Google Ads → Goals → Conversions → create three website conversions ("Lead", "WhatsApp click", "Phone call click") → Tag setup → *Use Google tag* shows `AW-…` (the ID) and `send_to: 'AW-…/label'` (the label after the slash).
- `META_PIXEL_ID`: optional, from Meta Events Manager.

When any ID is set, visitors see a cookie banner (Accept / Decline). Google tags use Consent Mode v2: nothing that needs cookies is stored until a visitor accepts. The Privacy page explains this and has a "Cookie settings" link.

Events sent: `generate_lead` (project form), `landing_lead`, `checker_lead`, `arc_lead` (all counted as the Lead conversion), `whatsapp_click`, `phone_click`, `email_click`, `sign_up` (newsletter).

In Google Ads, turn on **auto-tagging** (Admin → Account settings) so each lead carries a click ID. For other links (Instagram, LinkedIn, email), add utm tags, e.g. `?utm_source=instagram&utm_medium=social&utm_campaign=erp-reel`.

## Ad landing pages

Fast, single-service pages for ads, generated by `scripts/build-landing.cjs` (edit the copy there, then `npm run build:pages`):

| Page | Use for searches like |
|---|---|
| `/erp.html` | ERP software for manufacturers, inventory and billing software |
| `/app.html` | Android and iOS app development company |
| `/ai.html` | AI chatbot for business, WhatsApp AI bot |
| `/website.html` | business website development, website designer Mumbai |

Each has a short form at the top (name, WhatsApp, need), client logos, features, process and FAQs. Leads arrive with the source "Landing page: ERP" etc. Use the page as the ad's **Final URL**. Add negative keywords such as *free, course, jobs, salary, template, download, internship*.

## ARC (AI chat) and lead capture

ARC answers in two ways:

1. **With AI (recommended):** `api/arc.js` sends the conversation to Claude and returns ARC's reply. Add `ANTHROPIC_API_KEY` (create a key at console.anthropic.com) to `.env` on the VPS and reload. **Set a monthly spend limit in the Anthropic Console.**
   - `ARC_MODEL` is optional. The default is `claude-haiku-5-5` (about ₹0.03 per message). `claude-sonnet-5-5` or `claude-opus-5-5` give richer answers at roughly 15–30× the cost.
   - Each visitor can send up to 20 messages an hour (`RATE_MAX` in `api/arc.js`).
   - ARC's facts and tone live in the `SYSTEM` text at the top of `api/arc.js`. Edit it to keep answers accurate.
2. **Built-in fallback:** if the AI isn't configured or fails, ARC answers from the built-in knowledge (`KNOW` list in `src/home.html`) and plans ideas with the estimator.

**Lead capture:** after ARC plans an idea, he invites the visitor once to type their name and WhatsApp number in the chat. When a message contains a phone number, the conversation is sent to `api/lead.js` (email + Sheet). With `ANTHROPIC_API_KEY` set, Claude Haiku also writes a **lead card**: project, summary, needs, timeline, budget, quality (Hot / Warm / Cold) and a suggested opening line. If lead delivery isn't set up, ARC shows a WhatsApp button instead so the lead isn't lost.

## Leads, WhatsApp and legal pages

- **Floating WhatsApp button** on every page opens a chat with +91 90046 29888 (edit `WA_NUMBER` at the top of `public/leads.js`).
- **Start a project form**: any button with `data-lead` opens it. Submitting sends the lead to `api/lead.js` (email + Sheet) and also opens WhatsApp with the details filled in.
- **Every lead is also in the server log** (`pm2 logs bcat-website`, lines starting `LEAD`), as a backup.
- **Spam protection**: a hidden honeypot field and at most 10 leads an hour per visitor.
- **Legal**: `privacy.html` and `terms.html` are generated by `scripts/build-legal.cjs`. Fill the highlighted items (registered address, grievance officer, CIN, GSTIN, retention periods) and have them reviewed before launch.

## Before going live (content)

- Homepage stats are filled in (`src/home.html`, "By the numbers"). Keep them in step with About and ARC (`api/arc.js`) when they change.
- Set real timelines, roles and tech stacks in the `PRODUCTS` and `FEATURES` lists in `src/home.html` (then run `npm run build:pages`). The idea checker and ARC use them to build estimates.
- Set `WEEK_RATE_INR` in `src/check-client.js` if the Idea Checker should show a price range (otherwise it promises a price on WhatsApp).
- Client logos live in `public/clients/` and are listed in `src/home.html` (`L1`, `L2`) and `scripts/build-landing.cjs` (`LOGOS`). Use them with each client's permission.

## Careers page

Applications go to **hr@brandingcatalyst.in**, never WhatsApp. With lead email set up (see above), the site emails each application to HR directly. Without it, the applicant's own email app opens with the application addressed to hr@, ready to send.

`public/careers.html` lists open roles from the `JOBS` list near the bottom of the file. To post a job, copy the example in the comment above `const JOBS = [];`, fill it in, and push. With no roles, the page shows "No open roles right now" and still accepts general applications.

## ARC lip sync

ARC's mouth position comes from the `FACE` settings in the script, measured in the image's own pixels (1024 × 1024):

- `mouthY`: the line between the lips
- `mouthW`: mouth width
- `jawBottom`: where the chin stops moving

Adjust these if you replace `nova.webp`.
