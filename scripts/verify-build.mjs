import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
const posts = JSON.parse(fs.readFileSync('src/data/migration.json', 'utf8'));
const legacy = JSON.parse(fs.readFileSync('src/data/legacy-paths.json', 'utf8'));
const disk = url => path.toNamespacedPath(path.resolve('dist', '.' + decodeURIComponent(url).split(/[?#]/)[0]));
const page = url => fs.readFileSync(path.join(disk(url), 'index.html'), 'utf8');
assert.equal(posts.length, fs.readdirSync('source/_posts').filter(p => p.endsWith('.md')).length);
for (const url of legacy) assert.ok(fs.existsSync(path.join(disk(url), 'index.html')), `Missing legacy URL ${url}`);
const failures = [];
function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(f => f.isDirectory() ? walk(path.join(dir, f.name)) : [path.join(dir, f.name)]); }
for (const file of walk(path.toNamespacedPath(path.resolve('dist'))).filter(p => p.endsWith('.html'))) {
  const html = fs.readFileSync(file, 'utf8');
  assert.ok(!/{%\s*(img|raw|endraw)/.test(html), `Unconverted Hexo markup in ${file}`);
  for (const [, attr, value] of html.matchAll(/\b(href|src)="([^"#]+)"/g)) {
    if (!value.startsWith('/') || value.startsWith('//')) continue;
    const target = disk(value.replaceAll('&amp;', '&'));
    if (!fs.existsSync(target) && !fs.existsSync(path.join(target, 'index.html'))) failures.push(`${file}: ${attr}=${value}`);
  }
}
assert.deepEqual(failures, [], 'Broken local links/assets');
for (const post of posts) {
  const html = page(post.path);
  assert.ok(html.includes('data-pagefind-body'), `Search body missing: ${post.path}`);
  assert.ok(html.includes('application/ld+json'), `Article structured data missing: ${post.path}`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
  assert.equal(decodeURI(canonical?.[1]), 'https://blog.dccif.top' + post.path);
}
const publishedCount = walk('src/content/posts').filter(file => /\.mdx?$/.test(file)).filter(file => {
  const frontmatter = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---/);
  return frontmatter && parse(frontmatter[1]).draft !== true;
}).length;
assert.equal((fs.readFileSync('dist/rss.xml', 'utf8').match(/<item>/g) || []).length, publishedCount);
assert.ok(fs.existsSync('dist/pagefind/pagefind.js'));
assert.equal(fs.readFileSync('dist/CNAME', 'utf8').trim(), 'blog.dccif.top');
assert.ok(fs.existsSync('dist/404.html'));
assert.ok(!page('/').includes('Lorem ipsum'));
const css = walk('dist/_astro').filter(p => p.endsWith('.css')).map(p => fs.readFileSync(p, 'utf8')).join('');
assert.ok(css.includes('--card-bg:') && css.includes('--page-bg:'), 'Fuwari global theme variables must be included');
assert.ok(posts.every(post => page('/archive/').includes(post.title.replaceAll('&', '&amp;'))));
console.log(`Verified ${posts.length} migrated articles, ${legacy.length} legacy URLs, local links/assets, RSS, SEO, search, archive and custom domain.`);
