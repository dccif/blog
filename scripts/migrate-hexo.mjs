// One-time migration. Original Hexo sources remain in source/ for reference.
import fs from 'node:fs';
import path from 'node:path';
import { parse, stringify } from 'yaml';

const legacy = JSON.parse(fs.readFileSync('src/data/legacy-paths.json', 'utf8'));
const array = value => value == null ? [] : (Array.isArray(value) ? value.flat(Infinity) : [value]).map(String);
const date = value => String(value).trim().replace(' ', 'T') + '+08:00';
fs.mkdirSync('src/content/posts', { recursive: true });
fs.mkdirSync('src/content/spec', { recursive: true });
const manifest = [];
for (const file of fs.readdirSync('source/_posts').filter(f => f.endsWith('.md'))) {
  const source = fs.readFileSync(path.join('source/_posts', file), 'utf8').replace(/\r\n/g, '\n');
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`Invalid frontmatter: ${file}`);
  const old = parse(match[1].replace(/^\t+/gm, tabs => '  '.repeat(tabs.length)));
  const name = file.slice(0, -3);
  const legacyPath = legacy.find(p => /^\/\d{4}\//.test(p) && p.split('/').at(-2) === name);
  if (!legacyPath) throw new Error(`No deployed URL for ${file}`);
  const slug = legacyPath.slice(1, -1).trimEnd();
  let body = match[2].replace(/{%\s*img\s+(\S+)\s*([\s\S]*?)\s*%}/g, (_, src, alt) =>
    `![${alt.replace(/["'\[\]]/g, '').trim() || old.title}](${src})`)
    .replace(/{%\s*(?:raw|endraw)\s*%}/g, '')
    .replace(/&nbsp(?!;)/g, '&nbsp;');
  if (/{%/.test(body)) throw new Error(`Unconverted Hexo tag in ${file}`);
  const paragraphs = body.replace(/```[\s\S]*?```/g, '').replace(/<!--[^]*?-->/g, '')
    .split(/\n\s*\n/).map(p => p.trim()).filter(p => p && !/^(#|!\[|\||<)/.test(p));
  const description = (paragraphs[0] || old.title).replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '').replace(/\s+/g, ' ').slice(0, 150);
  const data = { title: old.title, slug, published: date(old.date), ...(old.updated ? { updated: date(old.updated) } : {}),
    description, tags: array(old.tags), category: array(old.categories || old.catagories).join(' / '), draft: false, lang: 'zh-CN' };
  const target = path.join('src/content/posts', file);
  const converted = `---\n${stringify(data)}---\n${body}`;
  if (fs.existsSync(target) && fs.readFileSync(target, 'utf8') !== converted) throw new Error(`Refusing to overwrite edited article: ${target}`);
  fs.writeFileSync(target, converted);
  manifest.push({ source: file, title: old.title, legacyPath, path: `/${slug}/`, category: data.category, tags: data.tags });
}
const about = fs.readFileSync('source/about/index.md', 'utf8').replace(/\r\n/g, '\n').replace(/^---\n[^]*?\n---\n/, '');
fs.writeFileSync('src/content/spec/about.md', `---\n---\n${about}`);
fs.writeFileSync('src/data/migration.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(`Migrated ${manifest.length} posts; original sources and published URLs preserved.`);
