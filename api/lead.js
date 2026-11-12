// Lead endpoint: POST /api/lead (run by server.js on the VPS; also works as a Vercel function).
// Receives every lead from the website: "Start a project" forms, ad landing pages, the Idea Checker,
// ARC chat (when a visitor shares their WhatsApp number), newsletter signups and job applications.
//
// For each lead it:
//   1. writes it to the server log (pm2 logs bcat-website, lines starting "LEAD"), always;
//   2. emails it to your inbox (Hostinger SMTP, or Resend as an alternative);
//   3. adds a row to your Google Sheet (optional; see docs/leads-sheet.gs);
//   4. for ARC chats, asks Claude Haiku to turn the conversation into a short "lead card".
//
// Settings: the .env file on the server (template .env.example). See docs/SETUP.md.
//   Email, option A: Hostinger SMTP (recommended, uses your existing Hostinger mailbox)
//     SMTP_USER        the mailbox that sends lead emails, e.g. website@brandingcatalyst.in
//     SMTP_PASS        that mailbox's password
//     SMTP_HOST        optional, default smtp.hostinger.com
//     SMTP_PORT        optional, default 465
//   Email, option B: Resend
//     RESEND_API_KEY   and LEAD_FROM_EMAIL (sender on a domain verified in Resend)
//   Where emails go
//     LEAD_TO_EMAIL    project leads and newsletter signups, default hello@brandingcatalyst.in
//     HR_EMAIL         job applications, default hr@brandingcatalyst.in
//   Google Sheet (optional)
//     LEADS_SHEET_URL     the Apps Script web app URL
//     LEADS_SHEET_SECRET  the same secret you put in the Apps Script
//   ARC lead cards (optional, uses the same key as ARC)
//     ANTHROPIC_API_KEY
import nodemailer from 'nodemailer';
import Anthropic from '@anthropic-ai/sdk';

const clean = (v, n) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n) : '');
const cleanBlock = (v, n) => (typeof v === 'string' ? v.replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, ' ').trim().slice(0, n) : '');
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PHONE = /^\+?[0-9][0-9\s-]{7,15}$/;
const TYPES = ['project', 'arc', 'checker', 'landing', 'newsletter', 'application'];
const TYPE_LABEL = { project: 'Project form', arc: 'ARC chat', checker: 'Idea Checker', landing: 'Ad landing page', newsletter: 'Newsletter', application: 'Job application' };

// At most RATE_MAX leads per hour from one IP address (kept in memory; stops casual spam).
const RATE_MAX = 10, RATE_WINDOW_MS = 60 * 60 * 1000, hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) { hits.set(ip, recent); return true; }
  recent.push(now); hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(k);
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });
  const origin = req.headers.origin;
  if (origin && new URL(origin).host !== req.headers.host) return res.status(403).json({ error: 'Forbidden.' });

  const b = req.body || {};
  if (clean(b.website, 100)) return res.status(200).json({ ok: true, delivered: true });   // honeypot: bots fill this hidden field

  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  if (rateLimited(ip)) return res.status(429).json({ error: 'Too many requests. Please message us on WhatsApp instead.' });

  const type = TYPES.includes(clean(b.type, 20)) ? clean(b.type, 20) : 'project';
  const a = b.attribution && typeof b.attribution === 'object' ? b.attribution : {};
  const lead = {
    type,
    name: clean(b.name, 80), phone: clean(b.phone, 20), email: clean(b.email, 120),
    service: clean(b.service, 80), budget: clean(b.budget, 40), message: cleanBlock(b.message, 3000),
    role: clean(b.role, 80), portfolio: clean(b.portfolio, 300),
    source: clean(b.source, 80), page: clean(b.page, 160),
    // where the visitor came from (saved by track.js from the ad link)
    utm_source: clean(a.utm_source, 80), utm_medium: clean(a.utm_medium, 80), utm_campaign: clean(a.utm_campaign, 120),
    utm_term: clean(a.utm_term, 120), utm_content: clean(a.utm_content, 120),
    gclid: clean(a.gclid, 200), gbraid: clean(a.gbraid, 200), wbraid: clean(a.wbraid, 200), fbclid: clean(a.fbclid, 200),
    landing: clean(a.landing, 200), referrer: clean(a.referrer, 200), first_visit: clean(a.first_visit, 40),
    at: new Date().toISOString()
  };

  // ARC chat transcript (last 20 messages)
  const transcript = Array.isArray(b.transcript)
    ? b.transcript.slice(-20).filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
        .map((m) => ({ role: m.role, content: cleanBlock(m.content, 1500) })).filter((m) => m.content)
    : [];

  if (type === 'application') {
    if (!lead.name) return res.status(400).json({ error: 'Enter your name.' });
    if (!EMAIL.test(lead.email)) return res.status(400).json({ error: 'Enter a valid email address.' });
    if (!PHONE.test(lead.phone)) return res.status(400).json({ error: 'Enter a valid phone number.' });
  } else if (type === 'newsletter') {
    if (!EMAIL.test(lead.email)) return res.status(400).json({ error: 'Enter a valid email address.' });
  } else {
    if (type !== 'arc' && !lead.name) return res.status(400).json({ error: 'Enter your name.' });
    if (!PHONE.test(lead.phone)) return res.status(400).json({ error: 'Enter a valid phone number.' });
    if (lead.email && !EMAIL.test(lead.email)) return res.status(400).json({ error: 'Enter a valid email address.' });
  }

  // ARC chats: let Claude summarise the conversation into a lead card for the sales team.
  let card = null;
  if (type === 'arc' && transcript.length) card = await leadCard(transcript, lead);
  if (card) {
    if (!lead.name && card.name) lead.name = clean(card.name, 80);
    if (!lead.service && card.project_type) lead.service = clean(card.project_type, 80);
  }
  if (!lead.name && type === 'arc') lead.name = 'ARC visitor';

  console.log('LEAD', JSON.stringify({ ...lead, card, transcript_messages: transcript.length }));

  const [emailed, sheeted] = await Promise.all([sendEmail(lead, card, transcript), addToSheet(lead, card, transcript)]);
  return res.status(200).json({ ok: true, delivered: emailed || sheeted, emailed, sheeted });
}

// ---------- ARC lead card (Claude Haiku, structured JSON) ----------
const CARD_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string', description: "Visitor's name if they said it, else empty" },
    project_type: { type: 'string', description: 'Short label, e.g. "Portfolio website", "ERP for a factory"' },
    summary: { type: 'string', description: 'Two or three sentences: what they want, for whom, and any context' },
    features: { type: 'array', items: { type: 'string' }, description: 'Features or needs they mentioned or agreed to' },
    timeline: { type: 'string', description: 'Their deadline or timing, or "Not shared"' },
    budget: { type: 'string', description: 'Their budget, or "Not shared"' },
    lead_quality: { type: 'string', enum: ['Hot', 'Warm', 'Cold'] },
    next_step: { type: 'string', description: 'One suggested opening line or action for the sales team' }
  },
  required: ['name', 'project_type', 'summary', 'features', 'timeline', 'budget', 'lead_quality', 'next_step'],
  additionalProperties: false
};

async function leadCard(transcript, lead) {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  try {
    const client = new Anthropic();
    const chat = transcript.map((m) => `${m.role === 'user' ? 'Visitor' : 'ARC'}: ${m.content}`).join('\n');
    const response = await client.messages.create({
      model: process.env.ARC_MODEL || 'claude-haiku-5-5',
      max_tokens: 2000,
      output_config: { effort: 'low', format: { type: 'json_schema', schema: CARD_SCHEMA } },
      system: 'You prepare sales lead cards for Branding Catalyst, a software and AI studio in Mumbai. Read the website chat and fill the card using only what the visitor actually said. Do not invent details. Lead quality: Hot = clear project plus a deadline or budget or asks for a quote; Warm = clear project idea; Cold = vague or just browsing.',
      messages: [{ role: 'user', content: `Visitor's phone: ${lead.phone}\n\nChat:\n${chat}` }]
    });
    const text = response.content.filter((c) => c.type === 'text').map((c) => c.text).join('');
    return text ? JSON.parse(text) : null;
  } catch (err) {
    console.error('Lead card failed', err?.status || '', err?.message || err);
    return null;
  }
}

// ---------- email ----------
function emailParts(lead, card, transcript) {
  const subject =
    lead.type === 'newsletter' ? `New newsletter signup: ${lead.email}`
    : lead.type === 'application' ? `New job application: ${lead.name} for ${lead.role || 'general'}`
    : `${card?.lead_quality ? card.lead_quality + ' lead' : 'New lead'} (${TYPE_LABEL[lead.type]}): ${lead.name}${lead.service ? ' · ' + lead.service : ''}`;
  const rows = [
    ['From', TYPE_LABEL[lead.type] + (lead.source ? ` (${lead.source})` : '')],
    ['Name', lead.name], ['WhatsApp / phone', lead.phone], ['Email', lead.email],
    ['Service', lead.service], ['Budget', lead.budget], ['Role', lead.role], ['Portfolio', lead.portfolio],
    ['Page', lead.page], ['Time (UTC)', lead.at]
  ].filter(([, v]) => v);
  const ad = [
    ['Source', lead.utm_source], ['Medium', lead.utm_medium], ['Campaign', lead.utm_campaign], ['Keyword', lead.utm_term],
    ['Ad', lead.utm_content], ['Google click ID', lead.gclid || lead.gbraid || lead.wbraid], ['Meta click ID', lead.fbclid],
    ['First landing page', lead.landing], ['Referrer', lead.referrer], ['First visit', lead.first_visit]
  ].filter(([, v]) => v);
  const waNumber = lead.phone.replace(/[^0-9]/g, '').replace(/^0+/, '');
  const waLink = waNumber ? `https://wa.me/${waNumber.length === 10 ? '91' + waNumber : waNumber}` : '';

  let text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');
  if (waLink) text += `\nReply on WhatsApp: ${waLink}`;
  if (card) {
    text += `\n\n--- Lead card (written by AI from the chat) ---\nQuality: ${card.lead_quality}\nProject: ${card.project_type}\n${card.summary}`;
    if (card.features?.length) text += `\nNeeds:\n${card.features.map((f) => '  - ' + f).join('\n')}`;
    text += `\nTimeline: ${card.timeline}\nBudget: ${card.budget}\nSuggested next step: ${card.next_step}`;
  }
  if (lead.message) text += `\n\n--- Message ---\n${lead.message}`;
  if (transcript.length) text += `\n\n--- ARC chat ---\n${transcript.map((m) => `${m.role === 'user' ? 'Visitor' : 'ARC'}: ${m.content}`).join('\n\n')}`;
  if (ad.length) text += `\n\n--- Where they came from ---\n${ad.map(([k, v]) => `${k}: ${v}`).join('\n')}`;
  return { subject, text };
}

async function sendEmail(lead, card, transcript) {
  const to = lead.type === 'application'
    ? (process.env.HR_EMAIL || 'hr@brandingcatalyst.in')
    : (process.env.LEAD_TO_EMAIL || 'hello@brandingcatalyst.in');
  const { subject, text } = emailParts(lead, card, transcript);
  const replyTo = lead.email || undefined;

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const port = Number(process.env.SMTP_PORT || 465);
      const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.hostinger.com', port, secure: port === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      });
      await transport.sendMail({ from: `"Branding Catalyst Website" <${process.env.SMTP_USER}>`, to, replyTo, subject, text });
      return true;
    } catch (err) { console.error('Lead email (SMTP) failed', err?.message || err); return false; }
  }
  if (process.env.RESEND_API_KEY) {
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.LEAD_FROM_EMAIL || 'Branding Catalyst Website <website@brandingcatalyst.in>',
          to: [to], ...(replyTo ? { reply_to: replyTo } : {}), subject, text
        })
      });
      if (!r.ok) console.error('Lead email (Resend) failed', r.status, await r.text());
      return r.ok;
    } catch (err) { console.error('Lead email (Resend) error', err); return false; }
  }
  return false;
}

// ---------- Google Sheet (Apps Script web app, see docs/leads-sheet.gs) ----------
async function addToSheet(lead, card, transcript) {
  const url = process.env.LEADS_SHEET_URL;
  if (!url || lead.type === 'application') return false;   // job applications stay in the HR inbox only
  try {
    const r = await fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, redirect: 'follow',
      body: JSON.stringify({
        secret: process.env.LEADS_SHEET_SECRET || '',
        lead: {
          ...lead, type: TYPE_LABEL[lead.type],
          quality: card?.lead_quality || '', project: card?.project_type || '', summary: card?.summary || '',
          needs: (card?.features || []).join('; '), timeline: card?.timeline || '', next_step: card?.next_step || '',
          chat: transcript.map((m) => `${m.role === 'user' ? 'Visitor' : 'ARC'}: ${m.content}`).join('\n').slice(0, 45000)
        }
      })
    });
    const body = await r.text();
    if (!r.ok || !/"ok"\s*:\s*true/.test(body)) { console.error('Lead sheet failed', r.status, body.slice(0, 200)); return false; }
    return true;
  } catch (err) { console.error('Lead sheet error', err?.message || err); return false; }
}
