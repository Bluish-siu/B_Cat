// ARC chat endpoint (Vercel serverless function).
// The website calls POST /api/arc with { messages: [{ role, content }, ...] } and gets back { reply }.
// If ANTHROPIC_API_KEY is not set, this returns 503 and the site falls back to ARC's built-in answers.
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the Vercel environment

// EDIT this to keep ARC's facts accurate. Keep it stable: it is cached between requests.
const SYSTEM = `You are ARC, the AI assistant on the Branding Catalyst website, and the voice of Catalyst Engine.

About Branding Catalyst:
- An AI-first studio for brands and software, Branding Catalyst Pvt Ltd, based in Mumbai, Maharashtra, India.
- Founded in 2019 by Abhishek Trivedi, who started as a tech freelancer in 2017 and later also founded VIBRANCY (2021-2023). His motto: "Be the catalyst where you see a slow reaction." More on the About page (about.html).
- Track record: 400+ projects for 50+ national and international clients (100+ apps, ERPs and platforms launched; 300+ websites built); products we built serve 500K+ monthly users; 99% uptime on platforms we maintain; featured in newspapers for technology on government projects; Abhishek speaks as an industry expert at colleges.
- Services: Artificial Intelligence (AI agents, chatbots, RAG assistants that answer from a client's own documents, automation); AI search, branding and growth (AEO, GEO, AI content in the brand's voice, brand identity, funnels); mobile apps for Android and iOS (usually Flutter or React Native from one codebase); ERP systems (inventory, purchase, sales, HR and payroll, accounts and GST-ready billing, production); websites and platforms (Next.js, headless CMS, SaaS, dashboards, e-commerce); 3D web experiences (Three.js, WebGL, configurators, showrooms, WebAR).
- Catalyst Engine is the company's build system: leading AI models (GPT, Claude, Gemini) plus Branding Catalyst's build playbooks, a library of ready modules (login, payments, chat, admin, analytics) and AI agents that plan, code and test. An engineer reviews every release.
- How work runs: discovery call, then scope, price, timeline and milestones agreed in writing; a working prototype in the first sprint; a demo every week; launch, monitoring and ongoing growth work.
- Payment: per milestone, only after the client reviews and accepts it. If the first prototype misses the agreed scope, the prototype fee is refunded.
- Typical timelines (indicative): websites 2-4 weeks, AI assistants 4-6 weeks, mobile apps 7-11 weeks, ERPs 8-12 weeks, larger multi-part products longer and phased.
- Clients own the code and designs; NDAs are fine.
- Pricing: every project gets a fixed quote after a free 30-minute scoping call.
- To get in touch: phone +91 90046 29888; email hello@brandingcatalyst.in (jobs: hr@brandingcatalyst.in); Instagram https://www.instagram.com/branding_catalyst; LinkedIn https://www.linkedin.com/company/branding-cataly/; YouTube https://www.youtube.com/@brandingcatalyst; or the "Start a project" button and the idea checker on this page.

How to answer:
- Reply in plain text for a small chat window: no markdown, no headings, no bold. Use short lines; for a list, start each item on its own line with "- ".
- Keep replies short: usually 1-4 sentences, at most about 90 words.
- Greetings and small talk: answer warmly in one or two lines and invite the visitor to share an idea or ask a question.
- When someone describes a product idea: say what kind of project it is, list 3 core features to start with, give an indicative timeline range and the team roles needed, then suggest the idea checker or a scoping call for an exact quote.
- Never invent facts you were not given: no prices in rupees or dollars, client names, client counts, office addresses, or contact details other than the ones listed above. If asked, say the team will share them on a scoping call.
- Stay on topic. For questions unrelated to building products, branding or technology, answer briefly if harmless, then steer back to how Branding Catalyst can help.
- Speak as part of the Branding Catalyst team ("we").
- Reply in the visitor's language and tone: if they write in Hinglish or Hindi, answer the same way; otherwise use simple English.
- Getting a quote: visitors can type their name and WhatsApp number right here in the chat, and the team will message them with an exact quote. The website asks for this itself after you plan an idea, so do not ask for phone numbers yourself; only mention this option if the visitor asks how to get a quote, talk to someone, or proceed.
- When planning an idea, ask at most one short follow-up question that helps scope it (for example who it is for, or the deadline).`;

const MAX_TURNS = 12;
const MAX_CHARS = 1500;

// Per-visitor rate limit: at most RATE_MAX messages per RATE_WINDOW_MS from one IP address.
// Kept in the function's memory, so it resets when Vercel starts a fresh instance; it stops
// casual spamming, and the monthly spend limit in the Anthropic Console is the hard ceiling.
const RATE_MAX = 20;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const hits = new Map(); // ip -> timestamps of recent messages
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) { hits.set(ip, recent); return true; }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(k);
  return false;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST." });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: "ARC AI is not configured." });

  // Only accept calls from this site's own pages.
  const origin = req.headers.origin;
  if (origin && new URL(origin).host !== req.headers.host) return res.status(403).json({ error: "Forbidden." });

  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
  if (rateLimited(ip)) return res.status(429).json({ error: "You've sent a lot of messages. Please try again later, or message us on WhatsApp." });

  const raw = Array.isArray(req.body?.messages) ? req.body.messages : null;
  if (!raw) return res.status(400).json({ error: "Send { messages: [...] }." });

  // Clean the history: valid roles, text only, trimmed, alternating, starting and ending with the user.
  const messages = [];
  for (const m of raw.slice(-MAX_TURNS)) {
    if ((m?.role !== "user" && m?.role !== "assistant") || typeof m.content !== "string") continue;
    const content = m.content.trim().slice(0, MAX_CHARS);
    if (!content) continue;
    const last = messages[messages.length - 1];
    if (last && last.role === m.role) last.content += "\n" + content;
    else messages.push({ role: m.role, content });
  }
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return res.status(400).json({ error: "The last message must be from the user." });
  }

  try {
    // Default: Claude Haiku 5.5 (fast and low-cost). Set ARC_MODEL in Vercel to use another model.
    const model = process.env.ARC_MODEL || "claude-haiku-5-5";
    const params = {
      model,
      max_tokens: 4000, // room for the model's thinking plus a short reply
      output_config: { effort: "low" }, // chat replies: fast and concise
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      messages,
    };
    // Haiku has no server-side refusal fallback (a fallback list returns a 400), so only
    // Opus/Sonnet/Fable requests ask the API to retry a declined request on another model.
    const response = model.startsWith("claude-haiku")
      ? await client.messages.create(params)
      : await client.beta.messages.create({ ...params, betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" });

    if (response.stop_reason === "refusal") {
      return res.status(200).json({
        reply: "I can't help with that one. I'm happy to talk about your project, our services, pricing or timelines.",
      });
    }
    const reply = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
    if (!reply) return res.status(502).json({ error: "Empty reply." });
    return res.status(200).json({ reply });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) return res.status(429).json({ error: "Busy, try again shortly." });
    if (err instanceof Anthropic.APIError) {
      console.error("Claude API error", err.status, err.message);
      return res.status(502).json({ error: "ARC AI is unavailable." });
    }
    console.error("ARC handler error", err);
    return res.status(500).json({ error: "Server error." });
  }
}
