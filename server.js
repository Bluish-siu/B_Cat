// Branding Catalyst website server, for the Hostinger VPS (or any Linux server with Node.js 18+).
// Serves the site from public/ and runs the two API routes:
//   POST /api/arc   ARC, the AI assistant        (api/arc.js)
//   POST /api/lead  forms, ARC leads, newsletter  (api/lead.js)
// Settings come from a .env file next to this one (copy .env.example to .env on the server).
// Start: npm start (production, behind Nginx; see docs/DEPLOY-VPS.md) or npm run dev (local preview).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const pub = path.join(root, 'public');

// ---------- .env (simple KEY=value lines; real environment variables win) ----------
try {
  for (const line of fs.readFileSync(path.join(root, '.env'), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
    if (!m || line.trim().startsWith('#')) continue;
    const v = m[2].replace(/^(['"])(.*)\1$/, '$2');
    if (v && process.env[m[1]] === undefined) process.env[m[1]] = v;
  }
} catch { /* no .env file: fine for local preview */ }

const DEV = process.argv.includes('--dev');
const PORT = Number(process.env.PORT) || (DEV ? 8080 : 3000);
const HOST = process.env.HOST || '127.0.0.1';   // only Nginx on the same machine talks to this server

// API handlers are written in the Vercel style (req.body, res.status().json()); loaded after .env.
const routes = {
  '/api/arc': (await import('./api/arc.js')).default,
  '/api/lead': (await import('./api/lead.js')).default
};

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2'
};
// Pages from the old brandingcatalyst.in site and where they live now (permanent redirects).
const REDIRECTS = {
  '/index.html': '/',
  '/collaborate.html': '/#contact',
  '/collaborate': '/#contact',
  '/privacy-policy.html': '/privacy.html',
  '/privacy-policy': '/privacy.html',
  // the Products page moved to the ARCO product site
  '/products.html': 'https://arcooptics.com/',
  '/products': 'https://arcooptics.com/'
};
const SECURITY = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

function sendJSON(res, code, obj) {
  if (res.headersSent) return;
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...SECURITY });
  res.end(JSON.stringify(obj));
}

async function api(req, res, handler) {
  // read a JSON body (max 100 KB)
  let size = 0; const chunks = [];
  try {
    for await (const c of req) { size += c.length; if (size > 100_000) return sendJSON(res, 413, { error: 'Too large.' }); chunks.push(c); }
  } catch { return sendJSON(res, 400, { error: 'Bad request.' }); }
  let body = {};
  if (chunks.length) { try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return sendJSON(res, 400, { error: 'Send JSON.' }); } }
  req.body = body;
  // Vercel-style helpers
  let code = 200;
  res.status = (c) => { code = c; return res; };
  res.json = (obj) => { sendJSON(res, code, obj); return res; };
  try { await handler(req, res); }
  catch (err) { console.error('API error', req.url, err); sendJSON(res, 500, { error: 'Server error.' }); }
  if (!res.headersSent) sendJSON(res, 500, { error: 'No response.' });
}

function serveFile(req, res, file, status = 200) {
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) return notFound(req, res);
    const ext = path.extname(file).toLowerCase();
    const cache = DEV ? 'no-store'
      : ext === '.html' || ['.xml', '.txt', '.webmanifest'].includes(ext) ? 'no-cache'
      : ['.js', '.css'].includes(ext) ? 'public, max-age=3600'
      : 'public, max-age=604800';
    res.writeHead(status, { 'Content-Type': TYPES[ext] || 'application/octet-stream', 'Content-Length': st.size, 'Cache-Control': cache, ...SECURITY });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  });
}
function notFound(req, res) {
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', ...SECURITY });
  res.end('<!doctype html><meta charset="utf-8"><title>Page not found | Branding Catalyst</title><body style="font-family:system-ui;background:#0d0716;color:#f1edf7;display:grid;place-items:center;min-height:100vh;margin:0;text-align:center"><div><h1>Page not found</h1><p><a style="color:#c9a2ff" href="/">Go to the homepage</a></p></div>');
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const route = routes[url.pathname.replace(/\/$/, '')];
  if (route) return api(req, res, route);
  if (url.pathname.startsWith('/api/')) return sendJSON(res, 404, { error: 'Not found.' });
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, SECURITY); return res.end(); }

  // Old site (2024–2026) addresses → new pages, so Google rankings and shared links keep working
  const moved = REDIRECTS[url.pathname.toLowerCase()];
  if (moved) { res.writeHead(301, { Location: moved, ...SECURITY }); return res.end(); }

  let p; try { p = decodeURIComponent(url.pathname); } catch { return notFound(req, res); }
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(pub, path.normalize(p));
  if (!file.startsWith(pub + path.sep) && file !== pub) return notFound(req, res);
  // /services also serves services.html
  if (!path.extname(file) && fs.existsSync(file + '.html')) return serveFile(req, res, file + '.html');
  serveFile(req, res, file);
}).listen(PORT, DEV ? '0.0.0.0' : HOST, () => {
  console.log(`Branding Catalyst ${DEV ? 'preview' : 'server'}: http://${DEV ? 'localhost' : HOST}:${PORT}`);
  console.log(`ARC AI: ${process.env.ANTHROPIC_API_KEY ? 'on' : 'off (built-in answers)'} · Lead email: ${process.env.SMTP_USER && process.env.SMTP_PASS ? 'SMTP' : process.env.SMTP_USER ? 'off (SMTP_PASS missing)' : process.env.RESEND_API_KEY ? 'Resend' : 'off'} · Leads sheet: ${process.env.LEADS_SHEET_URL ? 'on' : 'off'}`);
});
