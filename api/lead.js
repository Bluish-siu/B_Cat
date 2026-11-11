// Lead endpoint (Vercel serverless function).
// The website's forms POST here. Every lead is written to the Vercel logs (Project → Logs, search "LEAD").
// Optional email: in Vercel → Settings → Environment Variables add
//   RESEND_API_KEY   (free account at resend.com)
//   LEAD_TO_EMAIL    (where leads should arrive, e.g. you@brandingcatalyst.in)
//   LEAD_FROM_EMAIL  (optional sender on a domain verified in Resend)
// and redeploy. Without these, leads still reach you on WhatsApp from the visitor's side.

const clean = (v, n) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, n) : '');
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PHONE = /^\+?[0-9][0-9\s-]{7,15}$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });
  const origin = req.headers.origin;
  if (origin && new URL(origin).host !== req.headers.host) return res.status(403).json({ error: 'Forbidden.' });

  const b = req.body || {};
  if (clean(b.website, 100)) return res.status(200).json({ ok: true });   // honeypot: bots fill this hidden field

  const lead = {
    type: clean(b.type, 20) === 'newsletter' ? 'newsletter' : 'project',
    name: clean(b.name, 80), phone: clean(b.phone, 20), email: clean(b.email, 120),
    service: clean(b.service, 60), budget: clean(b.budget, 40), message: clean(b.message, 2000),
    source: clean(b.source, 60), page: clean(b.page, 160), at: new Date().toISOString()
  };
  if (lead.type === 'newsletter') {
    if (!EMAIL.test(lead.email)) return res.status(400).json({ error: 'Enter a valid email address.' });
  } else {
    if (!lead.name) return res.status(400).json({ error: 'Enter your name.' });
    if (!PHONE.test(lead.phone)) return res.status(400).json({ error: 'Enter a valid phone number.' });
    if (lead.email && !EMAIL.test(lead.email)) return res.status(400).json({ error: 'Enter a valid email address.' });
  }

  console.log('LEAD', JSON.stringify(lead));

  let emailed = false;
  if (process.env.RESEND_API_KEY && process.env.LEAD_TO_EMAIL) {
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.LEAD_FROM_EMAIL || 'Branding Catalyst Website <onboarding@resend.dev>',
          to: [process.env.LEAD_TO_EMAIL],
          ...(lead.email ? { reply_to: lead.email } : {}),
          subject: lead.type === 'newsletter' ? `New newsletter signup: ${lead.email}` : `New project lead: ${lead.name} (${lead.service || 'not sure'})`,
          text: Object.entries(lead).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n')
        })
      });
      emailed = r.ok;
      if (!r.ok) console.error('Lead email failed', r.status, await r.text());
    } catch (err) { console.error('Lead email error', err); }
  }
  return res.status(200).json({ ok: true, emailed });
}
