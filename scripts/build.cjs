// Builds the generated pages in public/ from src/.
//   src/home.html          -> public/index.html
//   (home + services.html) -> public/scale.html, public/check.html
//   build-legal.cjs        -> public/privacy.html, public/terms.html
// Run with: npm run build:pages
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const root = path.join(__dirname, '..'), pub = path.join(root, 'public'), home = path.join(root, 'src', 'home.html');

// 1) Homepage: src/home.html holds the <style> block then the page body; wrap it in a full document.
const lines = fs.readFileSync(home, 'utf8').split(/\r?\n/);
if (lines[lines.length - 1] === '') lines.pop();
const end = lines.indexOf('</style>');
if (end < 0) throw new Error('src/home.html: no line that is exactly </style>');
const head = '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<link rel="icon" href="logo.png">\n';
const out = head + lines.slice(0, end + 1).join('\n') + '\n</head>\n<body>\n' + lines.slice(end + 1).join('\n') + '\n</body>\n</html>\n';
fs.writeFileSync(path.join(pub, 'index.html'), out);
console.log('index.html written');

// 2) Pages generated from the homepage and the Services page shell, then the legal pages.
const run = (script, ...args) => execFileSync(process.execPath, [path.join(__dirname, script), ...args], { stdio: 'inherit' });
run('build-scale.cjs', pub, home);
run('build-check.cjs', pub, home);
run('build-legal.cjs', pub);
// 3) SEO on every page (titles, share tags, structured data) + sitemap.xml, robots.txt, llms.txt
run('build-seo.cjs');
