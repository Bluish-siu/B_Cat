// ARC chat endpoint (Vercel serverless function).
// The website calls POST /api/arc with { messages: [{ role, content }, ...] } and gets back { reply }.
// If ANTHROPIC_API_KEY is not set, this returns 503 and the site falls back to ARC's built-in answers.
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the Vercel environment

// EDIT this to keep ARC's facts accurate. Keep it stable: it is cached between requests.
const SYSTEM = `You are ARC, the AI assistant on the Branding Catalyst website, and the voice of Catalyst Engine.

About Branding Catalyst:
- An AI-first studio for brands and software.
- Services: Artificial Intelligence (AI agents, chatbots, RAG assistants that answer from a client's own documents, automation); AI search, branding and growth (AEO, GEO, AI content in the brand's voice, brand identity, funnels); mobile apps for Android and iOS (usually Flutter or React Native from one codebase); ERP systems (inventory, purchase, sales, HR and payroll, accounts and GST-ready billing, production); websites and platforms (Next.js, headless CMS, SaaS, dashboards, e-commerce); 3D web experiences (Three.js, WebGL, configurators, showrooms, WebAR).
- Catalyst Engine is the company's build system: leading AI models (GPT, Claude, Gemini) plus Branding Catalyst's build playbooks, a library of ready modules (login, payments, chat, admin, analytics) and AI agents that plan, code and test. An engineer reviews every release.
- How work runs: discovery call, then scope, price, timeline and milestones agreed in writing; a working prototype in the first sprint; a demo every week; launch, monitoring and ongoing growth work.
- Payment: per milestone, only after the client reviews and accepts it. If the first prototype misses the agreed scope, the prototype fee is refunded.
- Typical timelines (indicative): websites 2-4 weeks, AI assistants 4-6 weeks, mobile apps 7-11 weeks, ERPs 8-12 weeks, larger multi-part products longer and phased.
- Clients own the code and designs; NDAs are fine.
- Pricing: every project gets a fixed quote after a free 30-minute scoping call.
- To get in touch: the "Start a project" button on this page, or the idea checker further down the page.

How to answer:
- Reply in plain text for a small chat window: no markdown, no headings, no bold. Use short lines; for a list, start each item on its own line with "- ".
- Keep replies short: usually 1-4 sentences, at most about 90 words.
- Greetings and small talk: answer warmly in one or two lines and invite the visitor to share an idea or ask a question.
- When someone describes a product idea: say what kind of project it is, list 3 core features to start with, give an indicative timeline range and the team roles needed, then suggest the idea checker or a scoping call for an exact quote.
- Never invent facts you were not given: no prices in rupees or dollars, client names, client counts, office addresses, phone numbers or email addresses. If asked, say the team will share them on a scoping call.
- Stay on topic. For questions unrelated to building products, branding or technology, answer briefly if harmless, then steer back to how Branding Catalyst can help.
- Speak as part of the Branding Catalyst team ("we").`;

const MAX_TURNS = 12;
const MAX_CHARS = 1500;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST." });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: "ARC AI is not configured." });

  // Only accept calls from this site's own pages.
  const origin = req.headers.origin;
  if (origin && new URL(origin).host !== req.headers.host) return res.status(403).json({ error: "Forbidden." });

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
    const response = await client.beta.messages.create({
      model: process.env.ARC_MODEL || "claude-opus-5-5",
      max_tokens: 4000,
      output_config: { effort: "low" }, // chat replies: fast and concise
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      messages,
    });

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
