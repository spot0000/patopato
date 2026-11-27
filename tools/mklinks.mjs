// usage: node mklinks.mjs <siteDir> [--dry]
import fs from 'fs';
const dir = process.argv[2], dry = process.argv.includes('--dry');
const key = fs.readFileSync('C:/Patopato/.shortio-key', 'utf8').trim();
const window = {}; eval(fs.readFileSync(dir + '/data.js', 'utf8'));
const mapFile = dir + '/shortlinks.js';
const have = fs.existsSync(mapFile) ? JSON.parse(fs.readFileSync(mapFile, 'utf8').replace(/^[^{]*/, '').replace(/;\s*$/, '')) : {};
const want = [];
for (const m of window.PP_MW) want.push({ k: m.id, url: 'https://makerworld.com/en/models/' + m.id, path: 'web-' + m.id, title: 'web?W ' + m.t });
for (const p of window.PP_PATREON) { const id = p.u.match(/(\d+)\/?$/)[1]; want.push({ k: p.u, url: p.u, path: 'web-pat-' + id, title: 'web?atreon ' + p.t }); }
const todo = want.filter(w => !have[w.k]);
console.log('total', want.length, 'new', todo.length);
if (dry) { console.log(todo.slice(0, 3)); process.exit(0); }
for (let i = 0; i < todo.length; i += 100) {
  const chunk = todo.slice(i, i + 100);
  const r = await fetch('https://api.short.io/links/bulk', { method: 'POST', headers: { authorization: key, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ domain: 'patopato.s.gy', allowDuplicates: true, links: chunk.map(w => ({ originalURL: w.url, path: w.path, title: w.title })) }) });
  const j = await r.json();
  if (!r.ok || !Array.isArray(j)) { console.error(r.status, JSON.stringify(j).slice(0, 500)); process.exit(1); }
  j.forEach((x, n) => { if (x.shortURL || x.secureShortURL) have[chunk[n].k] = (x.secureShortURL || x.shortURL).replace('http://', 'https://'); else console.error('fail', chunk[n].path, JSON.stringify(x).slice(0, 200)); });
}
fs.writeFileSync(mapFile, '// official-site-only short.io links (patopato.s.gy/web-*), key = MW id or Patreon url\nwindow.PP_SHORT=' + JSON.stringify(have) + ';\n');
console.log('saved', Object.keys(have).length);

