// Quick safety check before pushing (npm run check): every inline <script> in public/*.html must parse.
const fs = require('fs'), path = require('path');
const pub = path.join(__dirname, '..', 'public');
let failed = 0;
for (const f of fs.readdirSync(pub).filter(f => f.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(pub, f), 'utf8');
  let n = 0;
  for (const m of html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/type="module"/.test(m[1])) continue;
    if (/type="application\/ld\+json"/.test(m[1])) {   // structured data must be valid JSON
      try { JSON.parse(m[2]); } catch (e) { failed++; console.error(`✗ ${f}: JSON-LD: ${e.message}`); }
      continue;
    }
    try { new Function(m[2]); n++; } catch (e) { failed++; console.error(`✗ ${f}: script ${n + 1}: ${e.message}`); }
  }
  console.log(`✓ ${f} (${n} scripts)`);
}
for (const f of ['fx.js', 'leads.js', 'track.js']) {
  try { new Function(fs.readFileSync(path.join(pub, f), 'utf8')); console.log(`✓ ${f}`); } catch (e) { failed++; console.error(`✗ ${f}: ${e.message}`); }
}
process.exit(failed ? 1 : 0);
