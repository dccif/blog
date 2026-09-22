import fs from 'node:fs';
import path from 'node:path';
const legacy = JSON.parse(fs.readFileSync('src/data/legacy-paths.json', 'utf8'));
const posts = JSON.parse(fs.readFileSync('src/data/migration.json', 'utf8'));
const redirects = [];
const escape = text => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
for (const old of legacy) {
  const post = posts.find(p => p.legacyPath === old);
  let target;
  if (post && old !== post.path) target = post.path;
  else if (old.startsWith('/archives')) {
    const [, year, month] = old.match(/^\/archives\/(\d{4})(?:\/(\d{2}))?/) || [];
    target = '/archive/' + (year ? `?year=${year}${month ? '&month=' + month : ''}` : '');
  } else if (/^\/(tags|categories)\//.test(old)) {
    const [, kind, value] = old.split('/');
    const actual = kind === 'tags' && value === 'C' ? 'C++' : value;
    target = '/archive/' + (actual ? `?${kind === 'tags' ? 'tag' : 'category'}=${encodeURIComponent(actual)}` : '');
  } else if (/^\/page\/\d+\/$/.test(old)) target = old.replace('/page', '');
  if (!target) continue;
  const filename = path.toNamespacedPath(path.resolve('dist', '.' + old, 'index.html'));
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  const destination = new URL(target, 'https://blog.dccif.top').href;
  fs.writeFileSync(filename, `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="robots" content="noindex"><link rel="canonical" href="${escape(destination)}"><meta http-equiv="refresh" content="0;url=${escape(destination)}"><title>正在跳转</title></head><body><a href="${escape(destination)}">前往新页面</a><script>location.replace(${JSON.stringify(target).replace(/</g, '\\u003c')} + location.hash)</script></body></html>`);
  redirects.push({ from: old, to: target });
}
// Keep the old sitemap endpoint useful for existing subscribers/search engines.
fs.copyFileSync('dist/sitemap-index.xml', 'dist/sitemap.xml');
fs.writeFileSync('dist/legacy-redirects.json', JSON.stringify(redirects));
console.log(`Generated ${redirects.length} legacy redirects.`);
