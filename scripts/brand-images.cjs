// Regenerates public/og-image.jpg and the icons from scripts/brand-images.html.
// Run: node scripts/brand-images.cjs  → open http://localhost:8095/ in a browser; files save into public/.
const http = require('http'), fs = require('fs'), path = require('path');
const pub = path.join(__dirname, '..', 'public'), page = path.join(__dirname, 'brand-images.html');
const ALLOWED = new Set(['og-image.jpg', 'favicon-32.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png']);
http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  if (req.method === 'POST' && u.pathname === '/save') {
    const name = u.searchParams.get('name');
    if (!ALLOWED.has(name)) { res.writeHead(400); return res.end('bad name'); }
    const chunks = []; req.on('data', c => chunks.push(c));
    req.on('end', () => { const b = Buffer.concat(chunks); fs.writeFileSync(path.join(pub, name), b); res.end(`${name} ${Math.round(b.length / 1024)}KB`); });
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(fs.readFileSync(page));
}).listen(8095, () => console.log('Open http://localhost:8095/'));
