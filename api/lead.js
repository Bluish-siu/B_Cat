// Lead endpoint (Vercel serverless function): project enquiries, newsletter signups and job applications.
// The website's forms POST here. Every lead is written to the Vercel logs (Project → Logs, search "LEAD").
// Optional email: in Vercel → Settings → Environment Variables add
//   RESEND_API_KEY   (free account at resend.com)
//   LEAD_TO_EMAIL    (where project leads and newsletter signups arrive, e.g. hello@brandingcatalyst.in)
//   HR_EMAIL         (optional; job applications go here, default hr@brandingcatalyst.in)
//   LEAD_FROM_EMAIL  (optional sender on a domain verified in Resend)
// and redeploy. Without these, project leads still reach you on WhatsApp from the visitor's side,
// and job applicants' own email app opens addressed to hr@ (see public/careers.html).

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
    type: ['newsletter', 'application'].includes(clean(b.type, 20)) ? clean(b.type, 20) : 'project',
    name: clean(b.name, 80), phone: clean(b.phone, 20), email: clean(b.email, 120),
    service: clean(b.service, 60), budget: clean(b.budget, 40), message: clean(b.message, 2000),
    role: clean(b.role, 80), portfolio: clean(b.portfolio, 300),
    source: clean(b.source, 60), page: clean(b.page, 160), at: new Date().toISOString()
  };
  if (lead.type === 'application') {
    if (!lead.name) return res.status(400).json({ error: 'Enter your name.' });
    if (!EMAIL.test(lead.email)) return res.status(400).json({ error: 'Enter a valid email address.' });
    if (!PHONE.test(lead.phone)) return res.status(400).json({ error: 'Enter a valid phone number.' });
  } else if (lead.type === 'newsletter') {
    if (!EMAIL.test(lead.email)) return res.status(400).json({ error: 'Enter a valid email address.' });
  } else {
    if (!lead.name) return res.status(400).json({ error: 'Enter your name.' });
    if (!PHONE.test(lead.phone)) return res.status(400).json({ error: 'Enter a valid phone number.' });
    if (lead.email && !EMAIL.test(lead.email)) return res.status(400).json({ error: 'Enter a valid email address.' });
  }

  console.log('LEAD', JSON.stringify(lead));

  let emailed = false;
  // job applications go to HR; everything else to the main lead inbox
  const to = lead.type === 'application' ? (process.env.HR_EMAIL || 'hr@brandingcatalyst.in') : process.env.LEAD_TO_EMAIL;
  if (process.env.RESEND_API_KEY && to) {
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.LEAD_FROM_EMAIL || 'Branding Catalyst Website <onboarding@resend.dev>',
          to: [to],
          ...(lead.email ? { reply_to: lead.email } : {}),
          subject: lead.type === 'newsletter' ? `New newsletter signup: ${lead.email}` : lead.type === 'application' ? `New job application: ${lead.name} for ${lead.role || 'general'}` : `New project lead: ${lead.name} (${lead.service || 'not sure'})`,
          text: Object.entries(lead).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n')
        })
      });
      emailed = r.ok;
      if (!r.ok) console.error('Lead email failed', r.status, await r.text());
    } catch (err) { console.error('Lead email error', err); }
  }
  return res.status(200).json({ ok: true, emailed });
}
